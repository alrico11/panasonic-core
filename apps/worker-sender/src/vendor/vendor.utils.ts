// Lightweight vendor Redis cache utilities used by worker-sender and easy to share.
// Does not depend on Nest providers; pass a Redis-like client implementing get/set.

export const VENDOR_REDIS_KEYS = {
  QONTAK_CONFIG: 'vendor:qontak:config',
  QONTAK_ENDPOINTS: 'vendor:qontak:endpoints',
} as const;

export interface QontakConfig {
  baseUrl?: string;
  token: string;
  messageTemplateId?: string;
  channelIntegrationId?: string;
  updatedAt?: string;
  [k: string]: any;
}

export interface QontakEndpoints {
  whatsappBlast?: string; // e.g., /api/open/v1/broadcasts/whatsapp/direct
  getWhatsappLog?: string; // e.g., /api/open/v1/broadcasts/{:whatsappId}/whatsapp/log
  hash?: string; // optional stable hash for change detection
  [k: string]: any;
}

export interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<'OK' | null>;
}

export async function getQontakConfig(redis: RedisLike): Promise<QontakConfig | null> {
  const raw = await redis.get(VENDOR_REDIS_KEYS.QONTAK_CONFIG);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QontakConfig;
  } catch {
    return null;
  }
}

export async function getQontakEndpoints(redis: RedisLike): Promise<QontakEndpoints | null> {
  const raw = await redis.get(VENDOR_REDIS_KEYS.QONTAK_ENDPOINTS);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QontakEndpoints;
  } catch {
    return null;
  }
}

export function resolveWhatsappBlastUrl(baseUrl: string, endpoints?: QontakEndpoints): string | null {
  const path = endpoints?.whatsappBlast || 'api/open/v1/broadcasts/whatsapp/direct';
  return `${trimSlash(baseUrl)}/${trimSlash(path)}`;
}

export function resolveWhatsappLogUrl(baseUrl: string, endpoints?: QontakEndpoints, whatsappId?: string): string | null {
  const path = endpoints?.getWhatsappLog || 'api/open/v1/broadcasts/{:whatsappId}/whatsapp/log';
  if (!whatsappId) return null;
  const resolved = path.replace('{:whatsappId}', whatsappId);
  return `${trimSlash(baseUrl)}/${trimSlash(resolved)}`;
}

function trimSlash(s: string): string {
  return (s || '').replace(/^\/+|\/+$/g, '');
}
