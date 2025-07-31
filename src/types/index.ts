// src/types/index.ts - Centralized type definitions (Updated for App Router)

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Registration Types
export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  userAgent?: string;
  ip?: string;
  gdprConsent: boolean;
  marketingConsent: boolean;
}

export interface RegistrationFormData extends Omit<RegistrationData, 'ip' | 'userAgent'> {
  consentDetails: ConsentState;
}

// GDPR Types
export interface GDPRRequest {
  email: string;
  requestType: GDPRRequestType;
  details?: string;
}

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  gdprAccepted: boolean;
  timestamp: string;
}

export type GDPRRequestType = 'access' | 'export' | 'delete' | 'rectify';

// Email Types
export interface EmailTemplateData {
  name: string;
  email: string;
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  phone?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// Enum Types
export type LanguageType = 'sq' | 'en';

export type CategoryType = 
  | 'plumber' 
  | 'electrician' 
  | 'painter' 
  | 'carpenter' 
  | 'tiler' 
  | 'mason' 
  | 'other';

export type LocationType = 
  | 'tirana' 
  | 'durres' 
  | 'vlore' 
  | 'shkoder' 
  | 'elbasan' 
  | 'korce' 
  | 'fier' 
  | 'berat' 
  | 'other';

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

// Rate Limiting Types
export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

// User Data Types (for GDPR responses)
export interface UserData {
  name: string;
  email: string;
  phone: string;
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  registrationDate: string;
  gdprConsent: string;
  marketingConsent: string;
  status: string;
  ip?: string;
  userAgent?: string;
}

// Service Response Types
export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Google Sheets Types
export interface SheetsRowData {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  ip: string;
  userAgent: string;
  gdprConsent: string;
  marketingConsent: string;
  status: string;
  createdDate: string;
}

// Environment Variables Type
export interface EnvironmentConfig {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REFRESH_TOKEN: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEETS_ID: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
  ADMIN_EMAIL: string;
  GDPR_CONTACT_EMAIL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_BASE_URL: string;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
}

// Form Component Props Types
export interface GDPRConsentProps {
  onConsentChange?: (consents: ConsentState) => void;
  required?: boolean;
}

export interface RegistrationFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Context Types
export interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
}

// Error Types
export type APIErrorCode = 
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SPAM_DETECTED'
  | 'DUPLICATE_EMAIL'
  | 'STORAGE_ERROR'
  | 'EMAIL_ERROR'
  | 'INTERNAL_ERROR'
  | 'NO_DATA_FOUND'
  | 'PROCESSING_ERROR'
  | 'DELETION_ERROR'
  | 'INVALID_METHOD'
  | 'INVALID_ACTION'
  | 'REQUEST_FAILED'
  | 'REQUEST_TIMEOUT'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export class APIError extends Error {
  public readonly code: APIErrorCode;
  public readonly status: number;
  public readonly details?: any;

  constructor(code: APIErrorCode, message: string, status: number = 0, details?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }

  public isNetworkError(): boolean {
    return this.status === 0;
  }
}

// Translation Types
export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

// Component State Types
export interface FormState {
  isSubmitting: boolean;
  message: string;
  messageType: 'success' | 'error' | '';
}

// Next.js specific types
export interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  children: React.ReactNode;
  params: { [key: string]: string | string[] | undefined };
}

// Middleware types
export interface MiddlewareRequest extends Request {
  nextUrl: URL;
  geo?: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
  };
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Cookie consent types (for client-side storage)
export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

// Form validation types
export interface FieldError {
  field: string;
  message: string;
  code?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FieldError[];
  data?: any;
}