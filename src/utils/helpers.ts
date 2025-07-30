// src/utils/helpers.ts - General helper functions
class HelpersUtil {
  formatDate(date: Date, locale: 'sq' | 'en' = 'sq'): string {
    return date.toLocaleDateString(locale === 'sq' ? 'sq-AL' : 'en-US');
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  logInfo(message: string, data?: any): void {
    if (process.env.ENABLE_API_LOGGING === 'true') {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
    }
  }

  logError(message: string, error?: any): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  createAPIResponse(success: boolean, message: string, data?: any, error?: string) {
    return {
      success,
      message,
      ...(data && { data }),
      ...(error && { error }),
      timestamp: new Date().toISOString()
    };
  }
}

export const helpers = new HelpersUtil();