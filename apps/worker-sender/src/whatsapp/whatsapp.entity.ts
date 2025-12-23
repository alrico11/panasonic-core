export interface WhatsAppSurveyPayload {
  customerName: string;
  customerPhone: string;
  vehicleModel?: string;
  vehicleYear?: number;
  serviceDate: string;
  webSurveyCode: string;
  messageType: 'web_survey' | 'otp' | 'reminder';
  dealerId: string; // Required for quota checking
  isResend?: boolean;
  timestamp: string;
  otpCode?: string; // optional to support SURVEY_OTP_WEB combined message
}

export interface WhatsAppOTPPayload {
  customerName: string;
  customerPhone: string;
  otpCode: string;
  messageType: 'otp';
  dealerId: string; // Required for quota checking
  timestamp: string;
}

export type WhatsAppPayload = WhatsAppSurveyPayload | WhatsAppOTPPayload;

export function isSurveyMessage(payload: WhatsAppPayload): payload is WhatsAppSurveyPayload {
  return payload.messageType === 'web_survey' || payload.messageType === 'reminder';
}

export function isOTPMessage(payload: WhatsAppPayload): payload is WhatsAppOTPPayload {
  return payload.messageType === 'otp';
}

export interface QontakApiResponse {
  status: string;
  data?: {
    id: string;
    phone: string;
    message: string;
    status: string;
  };
  error?: string;
}

export interface QontakMessageRequest {
  to: string;
  type: 'text' | 'template';
  body?: {
    text: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}
