// src/types/index.ts - Complete TypeScript type definitions for myUsta

// ========================================
//   LANGUAGE & LOCALIZATION TYPES
// ========================================

export type LanguageType = 'sq' | 'en';

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

// ========================================
//   CATEGORY & LOCATION TYPES
// ========================================

export type CategoryType = 
  | 'plumber' 
  | 'electrician' 
  | 'painter' 
  | 'carpenter' 
  | 'tiler' 
  | 'mason'
  | 'woodworker' 
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

export type StatusType = 
  | 'pending' 
  | 'processed' 
  | 'resolved' 
  | 'approved' 
  | 'rejected'
  | 'active'
  | 'inactive';

// ========================================
//   API RESPONSE TYPES
// ========================================

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: any;
  timestamp: string;
  retryAfter?: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// ========================================
//   REGISTRATION TYPES
// ========================================

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
  createdAt?: string;
  updatedAt?: string;
  status?: StatusType;
}

export interface RegistrationFormData extends Omit<RegistrationData, 'ip' | 'userAgent'> {
  consentDetails: ConsentState;
}

// ========================================
//   CONTACT FORM TYPES
// ========================================

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  language: LanguageType;
  ip?: string;
  userAgent?: string;
  status?: 'pending' | 'processed' | 'resolved';
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  language: LanguageType;
}

export interface ContactServiceResponse {
  success: boolean;
  message: string;
  data?: ContactFormData;
  error?: string;
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: string[];
  data?: ContactFormData;
}

// ========================================
//   RECOMMENDATION FORM TYPES
// ========================================

export interface RecommendFormData {
  // Recommender Information
  name: string;
  email?: string;
  phone: string;
  
  // Usta Information (if recommending someone else)
  ustaName?: string;
  ustaEmail?: string;
  ustaPhone?: string;
  
  // Common Fields
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  isRecommendation: boolean;
  
  // Metadata
  ip?: string;
  userAgent?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
  source?: string;
  referralCode?: string;
}

export interface RecommendEmailData {
  recommenderName: string;
  recommenderEmail?: string;
  recommenderPhone: string;
  ustaName?: string;
  ustaEmail?: string;
  ustaPhone?: string;
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  isRecommendation: boolean;
}

export interface RecommendServiceResponse {
  success: boolean;
  message: string;
  data?: RecommendFormData;
  error?: string;
}

export interface RecommendValidationResult {
  isValid: boolean;
  errors: string[];
  data?: RecommendFormData;
}

// ========================================
//   GDPR TYPES
// ========================================

export interface GDPRRequest {
  email: string;
  requestType: GDPRRequestType;
  details?: string;
  language?: LanguageType;
  confirmEmail?: string;
  reason?: string;
}

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  gdprAccepted: boolean;
  timestamp: string;
}

export type GDPRRequestType = 'access' | 'export' | 'delete' | 'rectify';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

// ========================================
//   EMAIL TYPES
// ========================================

export interface EmailTemplateData {
  name: string;
  email: string;
  category?: CategoryType;
  location?: LocationType;
  language: LanguageType;
  phone?: string;
  subject?: string;
  message?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailLog {
  id: number;
  recipientEmail: string;
  emailType: string;
  subject?: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  errorMessage?: string;
  referenceId?: number;
  referenceType?: string;
  createdAt: Date;
}

// ========================================
//   USER DATA TYPES
// ========================================

export interface UserData {
  id?: string;
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
  lastActivity?: string;
  referralCode?: string;
  referredBy?: string;
}

export interface UserProfile extends UserData {
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  verified?: boolean;
  documents?: Document[];
}

// ========================================
//   DATABASE MODELS
// ========================================

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  language: LanguageType;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'processed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string;
}

export interface Recommendation {
  id: number;
  recommenderName: string;
  recommenderEmail?: string;
  recommenderPhone: string;
  ustaName?: string;
  ustaEmail?: string;
  ustaPhone?: string;
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  isRecommendation: boolean;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
  source?: string;
  referralCode?: string;
}

// ========================================
//   GOOGLE SHEETS TYPES
// ========================================

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

export interface SheetsContactRow {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  language: LanguageType;
  ip: string;
  userAgent: string;
  status: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

export interface SheetsRecommendRow {
  timestamp: string;
  recommenderName: string;
  recommenderEmail?: string;
  recommenderPhone: string;
  ustaName?: string;
  ustaEmail?: string;
  ustaPhone?: string;
  category: CategoryType;
  location: LocationType;
  language: LanguageType;
  isRecommendation: string;
  ip: string;
  userAgent: string;
  status: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  referralCode?: string;
}

// ========================================
//   VALIDATION TYPES
// ========================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

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

// ========================================
//   RATE LIMITING TYPES
// ========================================

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remainingPoints?: number;
  consumedPoints?: number;
}

// ========================================
//   ERROR TYPES
// ========================================

export type APIErrorCode = 
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SPAM_DETECTED'
  | 'DUPLICATE_EMAIL'
  | 'DUPLICATE_USTA'
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
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
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

  public toJSON(): object {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}

// ========================================
//   CONTEXT TYPES
// ========================================

export interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

export interface ApiContextType {
  isOnline: boolean;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  handleGlobalError: (error: APIError) => void;
}

// ========================================
//   COMPONENT PROP TYPES
// ========================================

export interface GDPRConsentProps {
  onConsentChange?: (consents: ConsentState) => void;
  required?: boolean;
}

export interface RegistrationFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  gdprConsents: ConsentState;
}

export interface ContactFormProps {
  defaultLanguage?: LanguageType;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface RecommendUstaFormProps {
  defaultLanguage?: LanguageType;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// ========================================
//   COMPONENT STATE TYPES
// ========================================

export interface FormState {
  isSubmitting: boolean;
  message: string;
  messageType: 'success' | 'error' | '';
}

// ========================================
//   NEXT.JS SPECIFIC TYPES
// ========================================

export interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  children: React.ReactNode;
  params: { [key: string]: string | string[] | undefined };
}

// ========================================
//   MIDDLEWARE TYPES
// ========================================

export interface MiddlewareRequest extends Request {
  nextUrl: URL;
  geo?: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
  };
  ip?: string;
}

// ========================================
//   ENVIRONMENT CONFIGURATION
// ========================================

export interface EnvironmentConfig {
  // Google Services
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REFRESH_TOKEN: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEETS_ID: string;
  
  // Email Configuration
  FROM_EMAIL: string;
  FROM_NAME: string;
  ADMIN_EMAIL: string;
  GDPR_CONTACT_EMAIL: string;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  
  // Application
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_BASE_URL: string;
  
  // Database (if using)
  DATABASE_URL?: string;
  
  // Redis (if using)
  REDIS_URL?: string;
  
  // Security
  JWT_SECRET?: string;
  ENCRYPTION_KEY?: string;
  
  // External Services
  CLOUDINARY_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  
  // Monitoring
  SENTRY_DSN?: string;
  GOOGLE_ANALYTICS_ID?: string;
  
  // Feature Flags
  ENABLE_API_LOGGING?: string;
  ENABLE_GDPR_ENDPOINTS?: string;
  ENABLE_RATE_LIMITING?: string;
}

// ========================================
//   UTILITY TYPES
// ========================================

export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type ValueOf<T> = T[keyof T];

// ========================================
//   FILTER & QUERY TYPES
// ========================================

export interface QueryFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface ContactFilters extends QueryFilters {
  email?: string;
  status?: 'pending' | 'processed' | 'resolved';
}

export interface RecommendFilters extends QueryFilters {
  category?: CategoryType;
  location?: LocationType;
  isRecommendation?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface RegistrationFilters extends QueryFilters {
  category?: CategoryType;
  location?: LocationType;
  language?: LanguageType;
  status?: StatusType;
}

// ========================================
//   ANALYTICS & STATISTICS TYPES
// ========================================

export interface RegistrationStatistics {
  totalRegistrations: number;
  totalRecommendations: number;
  totalSelfRegistrations: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  byCategory: Record<CategoryType, number>;
  byLocation: Record<LocationType, number>;
  byLanguage: Record<LanguageType, number>;
  dailyRegistrations: Array<{
    date: string;
    count: number;
  }>;
}

export interface ContactStatistics {
  totalContacts: number;
  pendingContacts: number;
  resolvedContacts: number;
  averageResponseTime: number;
  bySubject: Record<string, number>;
  dailyContacts: Array<{
    date: string;
    count: number;
  }>;
}

// ========================================
//   NOTIFICATION TYPES
// ========================================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// ========================================
//   DOCUMENT TYPES
// ========================================

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// ========================================
//   CONSTANTS FOR RUNTIME USE
// ========================================

// These can be used as both types and values
export const LANGUAGES = ['sq', 'en'] as const;
export const CATEGORIES = ['plumber', 'electrician', 'painter', 'carpenter', 'tiler', 'mason', 'woodworker', 'other'] as const;
export const LOCATIONS = ['tirana', 'durres', 'vlore', 'shkoder', 'elbasan', 'korce', 'fier', 'berat', 'other'] as const;
export const STATUSES = ['pending', 'processed', 'resolved', 'approved', 'rejected', 'active', 'inactive'] as const;
export const GDPR_REQUEST_TYPES = ['access', 'export', 'delete', 'rectify'] as const;
export const API_ERROR_CODES = [
  'VALIDATION_ERROR',
  'RATE_LIMITED',
  'SPAM_DETECTED',
  'DUPLICATE_EMAIL',
  'DUPLICATE_USTA',
  'STORAGE_ERROR',
  'EMAIL_ERROR',
  'INTERNAL_ERROR',
  'NO_DATA_FOUND',
  'PROCESSING_ERROR',
  'DELETION_ERROR',
  'INVALID_METHOD',
  'INVALID_ACTION',
  'REQUEST_FAILED',
  'REQUEST_TIMEOUT',
  'NETWORK_ERROR',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'UNKNOWN_ERROR'
] as const;