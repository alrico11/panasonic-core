import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { VendorModel } from '../../../suzuki-base/src/vendor/vendor/entities/vendor.entity';
import { VendorAuthTypeEnum } from '../../../suzuki-base/src/vendor/vendor/vendor.enum';
import { VendorEndpointModel } from '../../../suzuki-base/src/vendor/endpoint/entities/endpoint.entity';
import { VendorCredentialModel } from '../../../suzuki-base/src/vendor/credential/entities/credential.entity';
import { decrypt } from '@tcid/utils/utils';
import { RedisService } from '@tcid/nestjs-redis';
import Redis from 'ioredis';
import { getQontakConfig, VENDOR_REDIS_KEYS } from './vendor.utils';

export interface VendorEndpointResolved {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string; // fully resolved URL with baseUrl + path (placeholders kept for runtime params like {:whatsappId})
  headers: Record<string, string>;
}

@Injectable()
export class VendorConfigService implements OnModuleInit {
  private logger = new Logger(VendorConfigService.name);
  private vendorName = 'Qontak';
  private baseUrl: string | null = null;
  private token: string | null = null;
  private messageTemplateId: string | null = null;
  private channelIntegrationId: string | null = null;
  private cachedAt = 0;
  private ttlMs = 30 * 60 * 1000; // 30 minutes
  private http: AxiosInstance | null = null;
  private redis: Redis;
  private readonly REDIS_CFG_KEY = VENDOR_REDIS_KEYS.QONTAK_CONFIG;
  private readonly REDIS_EPS_KEY = VENDOR_REDIS_KEYS.QONTAK_ENDPOINTS;
  private readonly REDIS_TTL_SEC = 30 * 60; // 30 minutes

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  async onModuleInit(): Promise<void> {
    await this.ensureLoaded(true);
  }

  async ensureLoaded(force = false): Promise<void> {
    const now = Date.now();
    if (!force && this.baseUrl && this.token && now - this.cachedAt < this.ttlMs) return;
    try {
      // Diagnostics: log Redis connection info and key TTL
      try {
        const anyRedis: any = this.redis as any;
        const keyPrefix = anyRedis?.options?.keyPrefix ?? '(none)';
        const dbIndex = anyRedis?.options?.db ?? '(unknown)';
        const ttlCfg = await this.redis.ttl(this.REDIS_CFG_KEY).catch(() => -3);
        const ttlEps = await this.redis.ttl(this.REDIS_EPS_KEY).catch(() => -3);
        this.logger.debug(`[VENDOR][REDIS] prefix=${keyPrefix} db=${dbIndex} ttl(cfg)=${ttlCfg} ttl(eps)=${ttlEps}`);
      } catch {}

      const cfg = await getQontakConfig(this.redis as any);
      if (cfg && cfg.token && (cfg.baseUrl || process.env.QONTAK_BASE_URL || process.env.VENDOR_QONTAK_BASE_URL)) {
        this.baseUrl = cfg.baseUrl || process.env.QONTAK_BASE_URL || process.env.VENDOR_QONTAK_BASE_URL || null;
        this.token = cfg.token;
        this.messageTemplateId = cfg.messageTemplateId || null;
        this.channelIntegrationId = cfg.channelIntegrationId || null;
        this.cachedAt = now;
        this.logger.debug(`[VENDOR][CACHE] cfgLoaded baseUrl=${this.baseUrl ? 'yes' : 'no'} tokenLen=${this.token?.length || 0} tmpl=${!!this.messageTemplateId} ch=${!!this.channelIntegrationId}`);
        this.http = axios.create({
          baseURL: this.baseUrl || undefined,
          headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
          timeout: 15000,
        });
        this.logger.log('[VENDOR][CACHE] Loaded Qontak config from Redis');
        if (!this.messageTemplateId || !this.channelIntegrationId) {
          // Option B: worker-sender does NOT hit DB; AMS is source of truth for Redis cache
          this.logger.warn('[VENDOR][CACHE] Missing template/channel IDs in Redis; waiting for AMS to populate. Messages may be deferred.');
        }
        return;
      }
    } catch (e) {
      this.logger.warn(`[VENDOR][CACHE] Failed to read Redis config (${(e as any)?.message || e}). Will try ENV then DB`);
    }
    return;
    /*
    // Env-based fallback to avoid DB dependency on first boot
    const envBaseUrl = process.env.QONTAK_BASE_URL || process.env.VENDOR_QONTAK_BASE_URL;
    const envToken = process.env.QONTAK_TOKEN || process.env.VENDOR_QONTAK_TOKEN;
    const envTemplate = process.env.QONTAK_TEMPLATE_ID || process.env.VENDOR_QONTAK_TEMPLATE_ID;
    const envChannel = process.env.QONTAK_CHANNEL_INTEGRATION_ID || process.env.VENDOR_QONTAK_CHANNEL_INTEGRATION_ID;
    if (envBaseUrl && envToken) {
      this.baseUrl = envBaseUrl;
      this.token = envToken;
      this.messageTemplateId = envTemplate || null;
      this.channelIntegrationId = envChannel || null;
      this.cachedAt = now;
      this.http = axios.create({
        baseURL: this.baseUrl || undefined,
        headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
        timeout: 15000,
      });
      try {
        await this.redis.setex(
          this.REDIS_CFG_KEY,
          this.REDIS_TTL_SEC,
          JSON.stringify({
            baseUrl: this.baseUrl,
            token: this.token,
            messageTemplateId: this.messageTemplateId,
            channelIntegrationId: this.channelIntegrationId,
          }),
        );
        this.logger.log('[VENDOR][CACHE] Stored Qontak config into Redis (ENV fallback)');
      } catch {}
      return;
    }

    // DB lookup (requires knex bound)
    const vendor = await VendorModel.query()
      .withGraphFetched('[endpoints]')
      .findOne({ name: this.vendorName, status: true })
      .catch((err) => {
        this.logger.error('[VENDOR] DB lookup failed, no knex bound?', err?.message || err);
        throw new Error('Vendor config unavailable: DB not connected and no ENV provided');
      });

    if (!vendor) {
      this.logger.error(`[VENDOR] ${this.vendorName} not found or inactive`);
      throw new Error('Vendor not configured');
    }

    if (vendor.authType !== VendorAuthTypeEnum.BEARER_STATIC) {
      this.logger.error(`[VENDOR] Unsupported authType for AMS: ${vendor.authType}`);
      throw new Error('Unsupported vendor authType');
    }

    this.baseUrl = vendor.baseUrl;
    // fetch credentials by name
    const tokenRow = await VendorCredentialModel.query()
      .findOne({ vendorId: vendor.id, name: 'token', status: true });
    if (!tokenRow || !tokenRow.data) {
      this.logger.error('[VENDOR] Missing credentials: token');
      throw new Error('Vendor credential missing: token');
    }
    this.token = decrypt(tokenRow.data);

    const tmplRow = await VendorCredentialModel.query()
      .findOne({ vendorId: vendor.id, name: 'message_template_id', status: true });
    this.messageTemplateId = tmplRow && tmplRow.data ? decrypt(tmplRow.data) : null;

    const chRow = await VendorCredentialModel.query()
      .findOne({ vendorId: vendor.id, name: 'channel_integration_id', status: true });
    this.channelIntegrationId = chRow && chRow.data ? decrypt(chRow.data) : null;
    this.cachedAt = now;

    this.http = axios.create({
      baseURL: this.baseUrl || undefined,
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    // Cache to Redis
    try {
      await this.redis.setex(
        this.REDIS_CFG_KEY,
        this.REDIS_TTL_SEC,
        JSON.stringify({
          baseUrl: this.baseUrl,
          token: this.token,
          messageTemplateId: this.messageTemplateId,
          channelIntegrationId: this.channelIntegrationId,
        }),
      );
      this.logger.log('[VENDOR][CACHE] Stored Qontak config into Redis');
    } catch (e) {
      this.logger.warn('[VENDOR][CACHE] Failed to store config to Redis');
    }

    this.logger.log(`[VENDOR] Loaded ${this.vendorName} config baseUrl=${this.baseUrl}`);*/
  }

  private replaceHeaderPlaceholders(raw: string): Record<string, string> {
    try {
      const obj: Record<string, string> = JSON.parse(raw);
      const resolved: Record<string, string> = {};
      for (const [k, v] of Object.entries(obj)) {
        resolved[k] = v.replace('{:token}', this.token || '');
      }
      return resolved;
    } catch {
      return { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' };
    }
  }

  async getEndpointByName(name: string): Promise<VendorEndpointResolved> {
    await this.ensureLoaded();
    // Try endpoints cache
    try {
      const cached = await this.redis.hget(this.REDIS_EPS_KEY, name);
      if (cached) {
        const ep = JSON.parse(cached);
        return ep as VendorEndpointResolved;
      }
    } catch (e) {
      this.logger.warn(`[VENDOR][CACHE] Failed to read endpoints hash for ${name}: ${(e as any)?.message || e}`);
    }

    // DB endpoints (if knex bound)
    try {
      const endpoint = await VendorEndpointModel.query()
        .withGraphFetched('vendor')
        .findOne({ name, status: true });
      if (endpoint) {
        const headers = this.replaceHeaderPlaceholders(endpoint.headers || '{}');
        const url = `${this.baseUrl}${endpoint.path}`;
        const epObj: VendorEndpointResolved = { name: endpoint.name, method: endpoint.method as any, url, headers };
        // Cache endpoint
        try {
          await this.redis.hset(this.REDIS_EPS_KEY, name, JSON.stringify(epObj));
          await this.redis.expire(this.REDIS_EPS_KEY, this.REDIS_TTL_SEC);
        } catch {}
        return epObj;
      }
    } catch (err) {
      this.logger.warn('[VENDOR] Endpoint DB lookup failed, trying ENV defaults', err?.message || err);
    }

    // ENV default endpoints when DB is unavailable
    if (this.baseUrl && this.token) {
      const base = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
      if (name === 'get-whatsapp-log') {
        const epObj: VendorEndpointResolved = {
          name,
          method: 'GET',
          url: base + 'api/open/v1/broadcasts/{:whatsappId}/whatsapp/log',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
        };
        try { await this.redis.hset(this.REDIS_EPS_KEY, name, JSON.stringify(epObj)); await this.redis.expire(this.REDIS_EPS_KEY, this.REDIS_TTL_SEC); } catch {}
        return epObj;
      }
      if (name === 'whatsapp-blast' || name === 'whatapp-blast') {
        const epObj: VendorEndpointResolved = {
          name,
          method: 'POST',
          url: base + 'api/open/v1/broadcasts/whatsapp/direct',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
        };
        try { await this.redis.hset(this.REDIS_EPS_KEY, name, JSON.stringify(epObj)); await this.redis.expire(this.REDIS_EPS_KEY, this.REDIS_TTL_SEC); } catch {}
        return epObj;
      }
    }

    throw new Error(`Vendor endpoint not found: ${name}`);
  }

  getHttp(): AxiosInstance {
    if (!this.http) throw new Error('HTTP client not initialized');
    return this.http;
  }

  getTemplateAndChannel() {
    return { templateId: this.messageTemplateId, channelIntegrationId: this.channelIntegrationId };
  }
}
