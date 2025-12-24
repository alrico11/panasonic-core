export interface IActivationUserTemplate {
  name: string;
  email: string;
  password: string;
  verificationLink: string;
}

export interface IResetPasswordTemplate {
  name: string;
  resetUrl: string;
}

export interface ISurveyOtpWebTemplate {
  name: string;
  otpCode: string;
  surveyUrl: string;
  dealerName?: string;
}

export interface IUnhappyCustomerSurveyReportTemplate {
  dealer_id: string;
  dealer_name: string;
  is_instant_unhappy: number;
  is_ws_unhappy: number;
  total_unhappy: number;
  dateFrom: string;
  dateTo: string;
  url: string;
}

export interface IUnhappyCustomerNotificationTemplate {
  customer_name: string;
  police_number: string;
  service_advisor_name?: string;
  dealer_name: string;
  service_name: string;
  survey_type: string;
  survey_date: string;
  dashboard_url: string;
}

export interface IExportTemplate {
  name: string;
  periode: string;
  downloadUrl?: string;
  module: string;
  format: string;
  size: string;
  createdAt: string;
}

export type NatsPayloadChannelSender =
  | IActivationUserTemplate
  | IResetPasswordTemplate
  | ISurveyOtpWebTemplate
  | IUnhappyCustomerSurveyReportTemplate
  | IUnhappyCustomerNotificationTemplate
  | IExportTemplate;

const hasProperty = <Obj, Prop extends string>(
  obj: Obj,
  prop: Prop,
): obj is Obj & Record<Prop, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, prop) as boolean;

export const isExport = (obj: unknown): obj is IExportTemplate =>
  hasProperty(obj, 'name') &&
  typeof obj.name === 'string' &&
  hasProperty(obj, 'periode') &&
  typeof obj.periode === 'string' &&
  hasProperty(obj, 'downloadUrl') &&
  typeof obj.downloadUrl === 'string' &&
  hasProperty(obj, 'module') &&
  typeof obj.module === 'string' &&
  hasProperty(obj, 'format') &&
  typeof obj.format === 'string' &&
  hasProperty(obj, 'size') &&
  typeof obj.size === 'string' &&
  hasProperty(obj, 'createdAt') &&
  typeof obj.createdAt === 'string';

// type guard activation user
export const isActivationUser = (
  obj: unknown,
): obj is IActivationUserTemplate =>
  hasProperty(obj, 'name') &&
  typeof obj.name === 'string' &&
  hasProperty(obj, 'email') &&
  typeof obj.email === 'string' &&
  hasProperty(obj, 'password') &&
  typeof obj.password === 'string' &&
  hasProperty(obj, 'verificationLink') &&
  typeof obj.verificationLink === 'string';

// type guard reset password
export const isResetPassword = (obj: unknown): obj is IResetPasswordTemplate =>
  hasProperty(obj, 'name') &&
  typeof obj.name === 'string' &&
  hasProperty(obj, 'resetUrl') &&
  typeof obj.resetUrl === 'string';

// type guard survey otp + web
export const isSurveyOtpWeb = (obj: unknown): obj is ISurveyOtpWebTemplate =>
  hasProperty(obj, 'name') && typeof (obj as any).name === 'string' &&
  hasProperty(obj, 'otpCode') && typeof (obj as any).otpCode === 'string' &&
  hasProperty(obj, 'surveyUrl') && typeof (obj as any).surveyUrl === 'string';

// Type guard for a single unhappy customer survey report
export const isUnhappyCustomerSurveyReportItem = (obj: unknown): obj is IUnhappyCustomerSurveyReportTemplate => {
  if (!obj || typeof obj !== 'object') return false;
  
  return (
    hasProperty(obj, 'dealer_id') && typeof (obj as any).dealer_id === 'string' &&
    hasProperty(obj, 'dealer_name') && typeof (obj as any).dealer_name === 'string' &&
    hasProperty(obj, 'is_instant_unhappy') && (typeof (obj as any).is_instant_unhappy === 'number' || !isNaN(Number((obj as any).is_instant_unhappy))) &&
    hasProperty(obj, 'is_ws_unhappy') && (typeof (obj as any).is_ws_unhappy === 'number' || !isNaN(Number((obj as any).is_ws_unhappy))) &&
    hasProperty(obj, 'total_unhappy') && (typeof (obj as any).total_unhappy === 'number' || !isNaN(Number((obj as any).total_unhappy))) &&
    hasProperty(obj, 'dateFrom') && typeof (obj as any).dateFrom === 'string' &&
    hasProperty(obj, 'dateTo') && typeof (obj as any).dateTo === 'string' &&
    hasProperty(obj, 'url') && typeof (obj as any).url === 'string'
  );
};

// Type guard for an array of unhappy customer survey reports
export const isUnhappyCustomerSurveyReport = (obj: unknown): obj is IUnhappyCustomerSurveyReportTemplate[] =>
  Array.isArray(obj) && obj.every(item => isUnhappyCustomerSurveyReportItem(item));

export function isUnhappyCustomerNotification(
  payload: any,
): payload is IUnhappyCustomerNotificationTemplate {
  return (
    payload &&
    typeof payload.customer_name === 'string' &&
    typeof payload.police_number === 'string' &&
    typeof payload.dealer_name === 'string' &&
    typeof payload.service_name === 'string' &&
    typeof payload.survey_type === 'string' &&
    typeof payload.survey_date === 'string' &&
    typeof payload.dashboard_url === 'string' &&
    (payload.service_advisor_name === undefined || 
     typeof payload.service_advisor_name === 'string')
  );
}
