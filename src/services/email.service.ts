// src/services/email.service.ts - Comprehensive Email service (MINIMAL FIX - ALL FUNCTIONALITY PRESERVED)
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { EmailTemplateData } from '../types';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface RegistrationEmailData {
  name: string;
  email: string;
  phone?: string;
  category: string | string[];
  location: string | string[];
  language: 'sq' | 'en';
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private gmail: any;
  private initialized = false;

  constructor() {
  }

  // CHANGE: Added this method to ensure initialization
  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeServices();
    }
  }

  private async initializeServices() {
    try {
      // Use SMTP configuration if available, otherwise fall back to Gmail OAuth
      if (process.env.MAIL_SERVICE === 'custom' && process.env.MAIL_HOST) {
        // Initialize Nodemailer with SMTP configuration
        this.transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT || '465'),
          secure: true, // Use SSL
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        });

        // Test the connection
        await this.transporter.verify();
        console.log('SMTP connection verified successfully');
      } else {
        // Fallback to Gmail OAuth
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });

        // Initialize Gmail API
        this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Initialize Nodemailer
        const accessToken = await oauth2Client.getAccessToken();

        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: process.env.FROM_EMAIL || process.env.EMAIL_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken.token as string,
          },
        });
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing email service:', error);
      throw new Error('Failed to initialize email service');
    }
  }

  /**
   * Send confirmation email to user
   */
  async sendConfirmationEmail(data: RegistrationEmailData): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const template = this.getConfirmationTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'myUsta'} <${process.env.MAIL_FROM_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: data.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      await this.transporter!.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(data: RegistrationEmailData): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const template = this.getAdminNotificationTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'myUsta'} <${process.env.MAIL_FROM_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM_EMAIL || process.env.EMAIL_USER,
        subject: template.subject,
        html: template.html,
      };

      await this.transporter!.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return false;
    }
  }

  /**
   * Send GDPR-related emails
   */
  async sendGDPREmail(email: string, type: 'confirmation' | 'data_export', data?: any): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const template = this.getGDPRTemplate(type, data);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'myUsta'} <${process.env.MAIL_FROM_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: email,
        subject: template.subject,
        html: template.html,
      };

      await this.transporter!.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending GDPR email:', error);
      return false;
    }
  }

 
  async sendContactConfirmation(data: any): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const template = this.getContactConfirmationTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'myUsta'} <${process.env.MAIL_FROM_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: data.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      await this.transporter!.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending contact confirmation email:', error);
      return false;
    }
  }

  /**
   * Send contact form notification to admin
   */
  async sendContactAdminNotification(data: any): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const template = this.getContactAdminTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'myUsta'} <${process.env.MAIL_FROM_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM_EMAIL || process.env.EMAIL_USER,
        subject: template.subject,
        html: template.html,
      };

      await this.transporter!.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending contact admin notification:', error);
      return false;
    }
  }

  /**
   * Send recommend form confirmation email to user
   */
  async sendRecommendConfirmation(data: any): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const template = this.getRecommendConfirmationTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'myUsta'} <${process.env.MAIL_FROM_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: data.email || data.recommender_email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      await this.transporter!.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending recommend confirmation email:', error);
      return false;
    }
  }

  /**
   * Send recommend form notification to admin
   */
  async sendRecommendAdminNotification(data: any): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const template = this.getRecommendAdminTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'myUsta'} <${process.env.MAIL_FROM_EMAIL || process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.MAIL_FROM_EMAIL || process.env.EMAIL_USER,
        subject: template.subject,
        html: template.html,
      };

      await this.transporter!.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending recommend admin notification:', error);
      return false;
    }
  }

  /**
   * Get confirmation email template
   */
  private getConfirmationTemplate(data: RegistrationEmailData): EmailTemplate {
    if (data.language === 'sq') {
      return {
        subject: 'Mirësevini në myUsta - Regjistrimi u Konfirmua',
        html: this.getAlbanianConfirmationHTML(data),
        text: this.getAlbanianConfirmationText(data)
      };
    } else {
      return {
        subject: 'Welcome to myUsta - Registration Confirmed',
        html: this.getEnglishConfirmationHTML(data),
        text: this.getEnglishConfirmationText(data)
      };
    }
  }

  /**
   * Get admin notification template
   */
  private getAdminNotificationTemplate(data: RegistrationEmailData): EmailTemplate {
    return {
      subject: `New myUsta Registration - ${data.name} (${data.category})`,
      html: this.getAdminNotificationHTML(data),
      text: ''
    };
  }

  /**
   * Get GDPR email template
   */
  private getGDPRTemplate(type: 'confirmation' | 'data_export', data?: any): EmailTemplate {
    if (type === 'confirmation') {
      return {
        subject: 'myUsta - GDPR Request Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #00203F; color: white; padding: 20px; text-align: center;">
              <h1>myUsta</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px;">
              <h2>GDPR Request Confirmation</h2>
              <p>We have received your GDPR request and will process it within 30 days as required by law.</p>
              <p>If you have any questions, please contact us at ${process.env.GDPR_CONTACT_EMAIL || process.env.MAIL_FROM_EMAIL || process.env.ADMIN_EMAIL}</p>
            </div>
          </div>
        `,
        text: 'GDPR Request Confirmation - We have received your request and will process it within 30 days.'
      };
    } else {
      return {
        subject: 'myUsta - Your Data Export',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #00203F; color: white; padding: 20px; text-align: center;">
              <h1>myUsta</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px;">
              <h2>Your Personal Data Export</h2>
              <p>As requested, here is all the personal data we have stored for your email address:</p>
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <pre style="white-space: pre-wrap; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
              </div>
              <p>If you have any questions, please contact us at ${process.env.GDPR_CONTACT_EMAIL || process.env.MAIL_FROM_EMAIL || process.env.ADMIN_EMAIL}</p>
            </div>
          </div>
        `,
        text: `Your Personal Data Export: ${JSON.stringify(data, null, 2)}`
      };
    }
  }

  /**
   * Albanian confirmation email HTML template
   */
  private getAlbanianConfirmationHTML(data: RegistrationEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="sq">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mirësevini në myUsta</title>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #00203F; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00203F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; margin: 0 auto 10px; }
            .content { background: #F3F3F3; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: #FFC800; color: #00203F; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔧 myUsta</div>
                <p style="margin: 0;">Platforma juaj për mundësi pune</p>
            </div>
            
            <div class="content">
                <h2>Përshëndetje ${data.name}! 👋</h2>
                
                <p>Faleminderit që u bashkuat me <span class="highlight">myUsta</span>! Ne kemi pranuar regjistrimin tuaj dhe do t'ju kontaktojmë sa më shpejt që myUsta të lançohet.</p>
                
                <div class="details">
                    <h3>Detajet e regjistrimit tuaj:</h3>
                    <ul>
                        <li><strong>Kategoria:</strong> ${this.formatCategories(data.category, 'sq')}</li>
                        <li><strong>Vendndodhja:</strong> ${this.formatLocations(data.location, 'sq')}</li>
                        <li><strong>Data e regjistrimit:</strong> ${new Date().toLocaleDateString('sq-AL')}</li>
                    </ul>
                </div>
                
                <p><strong>Me myUsta, ju do të:</strong></p>
                <ul>
                    <li>🎯 Merrni mundësi pune direkt nga klientët</li>
                    <li>⏰ Kurseni kohë dhe mundim në kërkimin e punës</li>
                    <li>⭐ Ndërtoni reputacionin tuaj profesional</li>
                    <li>💼 Lidheni me klientë të besuar në zonën tuaj</li>
                    <li>📱 Menaxhoni projektet tuaja lehtë</li>
                </ul>
                
                <p>Ne do t'ju njoftojmë me email sa më shpejt që platforma të jetë gati për përdorim!</p>
                
                <p style="margin-top: 30px;">Faleminderit për durimin,<br>
                <strong>Ekipi i myUsta</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2025 myUsta. Të gjitha të drejtat e rezervuara.</p>
                <p><em>Aftësitë tuaja. Platforma jonë. Mundësi të pafundme.</em></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * English confirmation email HTML template
   */
  private getEnglishConfirmationHTML(data: RegistrationEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to myUsta</title>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #00203F; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00203F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; margin: 0 auto 10px; }
            .content { background: #F3F3F3; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: #FFC800; color: #00203F; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔧 myUsta</div>
                <p style="margin: 0;">Your platform for endless opportunities</p>
            </div>
            
            <div class="content">
                <h2>Hello ${data.name}! 👋</h2>
                
                <p>Thank you for joining <span class="highlight">myUsta</span>! We've received your registration and will contact you as soon as myUsta launches.</p>
                
                <div class="details">
                    <h3>Your registration details:</h3>
                    <ul>
                        <li><strong>Category:</strong> ${this.formatCategories(data.category, 'en')}</li>
                        <li><strong>Location:</strong> ${this.formatLocations(data.location, 'en')}</li>
                        <li><strong>Registration date:</strong> ${new Date().toLocaleDateString('en-US')}</li>
                    </ul>
                </div>
                
                <p><strong>With myUsta, you will:</strong></p>
                <ul>
                    <li>🎯 Get direct job opportunities from clients</li>
                    <li>⏰ Save time and effort in job searching</li>
                    <li>⭐ Build your professional reputation</li>
                    <li>💼 Connect with trusted clients in your area</li>
                    <li>📱 Manage your projects easily</li>
                </ul>
                
                <p>We'll notify you via email as soon as the platform is ready for use!</p>
                
                <p style="margin-top: 30px;">Thank you for your patience,<br>
                <strong>The myUsta Team</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2025 myUsta. All rights reserved.</p>
                <p><em>Your Skills. Our platform. Endless Opportunities.</em></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Albanian confirmation email text template
   */
  private getAlbanianConfirmationText(data: RegistrationEmailData): string {
    return `
Përshëndetje ${data.name}!

Faleminderit që u bashkuat me myUsta! Ne kemi pranuar regjistrimin tuaj dhe do t'ju kontaktojmë sa më shpejt që myUsta të lançohet.

Detajet e regjistrimit tuaj:
- Kategoria: ${this.formatCategories(data.category, 'sq')}
- Vendndodhja: ${this.formatLocations(data.location, 'sq')}
- Data e regjistrimit: ${new Date().toLocaleDateString('sq-AL')}

Me myUsta, ju do të:
- Merrni mundësi pune direkt nga klientët
- Kurseni kohë dhe mundim në kërkimin e punës
- Ndërtoni reputacionin tuaj profesional
- Lidheni me klientë të besuar në zonën tuaj
- Menaxhoni projektet tuaja lehtë

Ne do t'ju njoftojmë me email sa më shpejt që platforma të jetë gati për përdorim!

Faleminderit për durimin,
Ekipi i myUsta

© 2025 myUsta. Të gjitha të drejtat e rezervuara.
Aftësitë tuaja. Platforma jonë. Mundësi të pafundme.
    `;
  }

  /**
   * English confirmation email text template
   */
  private getEnglishConfirmationText(data: RegistrationEmailData): string {
    return `
Hello ${data.name}!

Thank you for joining myUsta! We've received your registration and will contact you as soon as myUsta launches.

Your registration details:
- Category: ${this.formatCategories(data.category, 'en')}
- Location: ${this.formatLocations(data.location, 'en')}
- Registration date: ${new Date().toLocaleDateString('en-US')}

With myUsta, you will:
- Get direct job opportunities from clients
- Save time and effort in job searching
- Build your professional reputation
- Connect with trusted clients in your area
- Manage your projects easily

We'll notify you via email as soon as the platform is ready for use!

Thank you for your patience,
The myUsta Team

© 2025 myUsta. All rights reserved.
Your Skills. Our platform. Endless Opportunities.
    `;
  }

  /**
   * Admin notification email template
   */
  private getAdminNotificationHTML(data: RegistrationEmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New myUsta Registration</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #00203F; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .highlight { background: #FFC800; padding: 2px 8px; border-radius: 3px; color: #00203F; font-weight: bold; }
            .footer { text-align: center; margin-top: 15px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🔔 New myUsta Registration</h2>
            </div>
            
            <div class="content">
                <p>A new professional has registered on the myUsta platform!</p>
                
                <div class="details">
                    <h3>📋 Registration Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 8px 0;"><strong>👤 Name:</strong> ${data.name}</li>
                        <li style="margin: 8px 0;"><strong>📧 Email:</strong> ${data.email}</li>
                        ${data.phone ? `<li style="margin: 8px 0;"><strong>📱 Phone:</strong> ${data.phone}</li>` : ''}
                        <li style="margin: 8px 0;"><strong>🔧 Category:</strong> <span class="highlight">${this.formatCategories(data.category, 'en')}</span></li>
                        <li style="margin: 8px 0;"><strong>📍 Location:</strong> <span class="highlight">${this.formatLocations(data.location, 'en')}</span></li>
                        <li style="margin: 8px 0;"><strong>🌐 Language:</strong> ${data.language.toUpperCase()}</li>
                        <li style="margin: 8px 0;"><strong>📅 Registered:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                </div>
                
                <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #00203F;">
                    <p style="margin: 0;"><strong>Action Required:</strong> Please follow up with this registration and add them to the appropriate contact lists.</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This email was automatically generated by the myUsta registration system.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Helper function to translate categories
   */
  private getCategoryTranslation(category: string, language: 'sq' | 'en'): string {
    const translations: { [key: string]: { sq: string; en: string } } = {
      plumber: { sq: 'Hidraulik', en: 'Plumber' },
      electrician: { sq: 'Elektriçist', en: 'Electrician' },
      painter: { sq: 'Piktor', en: 'Painter' },
      carpenter: { sq: 'Marangoz', en: 'Carpenter' },
      tiler: { sq: 'Pllakaxhi', en: 'Tiler' },
      mason: { sq: 'Murator', en: 'Mason' },
      woodworker: { sq: 'Zdrukthëtar', en: 'Woodworker' },
      other: { sq: 'Tjetër', en: 'Other' }
    };

    return translations[category]?.[language] || category;
  }

  /**
   * Helper function to translate locations
   */
  private getLocationTranslation(location: string, language: 'sq' | 'en'): string {
    const translations: { [key: string]: { sq: string; en: string } } = {
      tirana: { sq: 'Tiranë', en: 'Tirana' },
      durres: { sq: 'Durrës', en: 'Durres' },
      vlore: { sq: 'Vlorë', en: 'Vlore' },
      shkoder: { sq: 'Shkodër', en: 'Shkoder' },
      elbasan: { sq: 'Elbasan', en: 'Elbasan' },
      korce: { sq: 'Korçë', en: 'Korce' },
      fier: { sq: 'Fier', en: 'Fier' },
      berat: { sq: 'Berat', en: 'Berat' },
      other: { sq: 'Tjetër', en: 'Other' }
    };

    return translations[location]?.[language] || location;
  }

  /**
   * Helper function to format multiple categories
   */
  private formatCategories(categories: string | string[], language: 'sq' | 'en'): string {
    const categoryArray = Array.isArray(categories) ? categories : [categories];
    return categoryArray.map(cat => this.getCategoryTranslation(cat, language)).join(', ');
  }

  /**
   * Helper function to format multiple locations
   */
  private formatLocations(locations: string | string[], language: 'sq' | 'en'): string {
    const locationArray = Array.isArray(locations) ? locations : [locations];
    return locationArray.map(loc => this.getLocationTranslation(loc, language)).join(', ');
  }

  /**
   * Get contact confirmation email template
   */
  private getContactConfirmationTemplate(data: any): EmailTemplate {
    if (data.language === 'sq') {
      return {
        subject: 'Faleminderit për mesazhin - myUsta',
        html: this.getContactConfirmationHTML(data),
        text: this.getContactConfirmationText(data)
      };
    } else {
      return {
        subject: 'Thank you for your message - myUsta',
        html: this.getContactConfirmationHTML(data),
        text: this.getContactConfirmationText(data)
      };
    }
  }

  /**
   * Get contact admin notification template
   */
  private getContactAdminTemplate(data: any): EmailTemplate {
    return {
      subject: `New Contact Form Submission - ${data.subject}`,
      html: this.getContactAdminHTML(data),
      text: ''
    };
  }

  /**
   * Get recommend confirmation email template
   */
  private getRecommendConfirmationTemplate(data: any): EmailTemplate {
    if (data.language === 'sq') {
      return {
        subject: data.isRecommendation ? 'Faleminderit për rekomandimin - myUsta' : 'Faleminderit për regjistrimin - myUsta',
        html: this.getRecommendConfirmationHTML(data),
        text: this.getRecommendConfirmationText(data)
      };
    } else {
      return {
        subject: data.isRecommendation ? 'Thank you for your recommendation - myUsta' : 'Thank you for your registration - myUsta',
        html: this.getRecommendConfirmationHTML(data),
        text: this.getRecommendConfirmationText(data)
      };
    }
  }

  /**
   * Get recommend admin notification template
   */
  private getRecommendAdminTemplate(data: any): EmailTemplate {
    return {
      subject: data.isRecommendation ? `New Usta Recommendation - ${data.name}` : `New Usta Registration - ${data.name}`,
      html: this.getRecommendAdminHTML(data),
      text: ''
    };
  }

  /**
   * Contact confirmation HTML template
   */
  private getContactConfirmationHTML(data: any): string {
    return `
    <!DOCTYPE html>
    <html lang="${data.language}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.language === 'sq' ? 'Faleminderit për mesazhin' : 'Thank you for your message'}</title>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #00203F; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00203F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F3F3F3; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="font-size: 24px; margin: 0 auto 10px;">🔧 myUsta</div>
                <p style="margin: 0;">${data.language === 'sq' ? 'Platforma juaj për mundësi pune' : 'Your platform for endless opportunities'}</p>
            </div>
            
            <div class="content">
                <h2>${data.language === 'sq' ? `Përshëndetje ${data.name}! 👋` : `Hello ${data.name}! 👋`}</h2>
                
                <p>${data.language === 'sq' 
                  ? 'Faleminderit që na kontaktuat! Ne kemi marrë mesazhin tuaj dhe do t\'ju përgjigjemi sa më shpejt që të jetë e mundur.'
                  : 'Thank you for contacting us! We have received your message and will respond as soon as possible.'
                }</p>
                
                <div class="details">
                    <h3>${data.language === 'sq' ? 'Detajet e mesazhit tuaj:' : 'Your message details:'}</h3>
                    <ul>
                        <li><strong>${data.language === 'sq' ? 'Subjekti:' : 'Subject:'}</strong> ${data.subject}</li>
                        <li><strong>${data.language === 'sq' ? 'Data:' : 'Date:'}</strong> ${new Date().toLocaleDateString(data.language === 'sq' ? 'sq-AL' : 'en-US')}</li>
                    </ul>
                </div>
                
                <p>${data.language === 'sq' 
                  ? 'Ne do t\'ju kontaktojmë në adresën tuaj email ose numrin e telefonit që keni dhënë.'
                  : 'We will contact you at the email address or phone number you provided.'
                }</p>
                
                <p style="margin-top: 30px;">${data.language === 'sq' ? 'Faleminderit për durimin,' : 'Thank you for your patience,'}<br>
                <strong>${data.language === 'sq' ? 'Ekipi i myUsta' : 'The myUsta Team'}</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2025 myUsta. ${data.language === 'sq' ? 'Të gjitha të drejtat e rezervuara.' : 'All rights reserved.'}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Contact confirmation text template
   */
  private getContactConfirmationText(data: any): string {
    return `
${data.language === 'sq' ? `Përshëndetje ${data.name}!` : `Hello ${data.name}!`}

${data.language === 'sq' 
  ? 'Faleminderit që na kontaktuat! Ne kemi marrë mesazhin tuaj dhe do t\'ju përgjigjemi sa më shpejt që të jetë e mundur.'
  : 'Thank you for contacting us! We have received your message and will respond as soon as possible.'
}

${data.language === 'sq' ? 'Detajet e mesazhit tuaj:' : 'Your message details:'}
- ${data.language === 'sq' ? 'Subjekti:' : 'Subject:'} ${data.subject}
- ${data.language === 'sq' ? 'Data:' : 'Date:'} ${new Date().toLocaleDateString(data.language === 'sq' ? 'sq-AL' : 'en-US')}

${data.language === 'sq' 
  ? 'Ne do t\'ju kontaktojmë në adresën tuaj email ose numrin e telefonit që keni dhënë.'
  : 'We will contact you at the email address or phone number you provided.'
}

${data.language === 'sq' ? 'Faleminderit për durimin,' : 'Thank you for your patience,'}
${data.language === 'sq' ? 'Ekipi i myUsta' : 'The myUsta Team'}

© 2025 myUsta. ${data.language === 'sq' ? 'Të gjitha të drejtat e rezervuara.' : 'All rights reserved.'}
    `;
  }

  /**
   * Contact admin notification HTML template
   */
  private getContactAdminHTML(data: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #00203F; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .message { background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #00203F; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>📧 New Contact Form Submission</h2>
            </div>
            
            <div class="content">
                <p>A new contact form has been submitted on the myUsta website!</p>
                
                <div class="details">
                    <h3>📋 Contact Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 8px 0;"><strong>👤 Name:</strong> ${data.name}</li>
                        <li style="margin: 8px 0;"><strong>📧 Email:</strong> ${data.email}</li>
                        <li style="margin: 8px 0;"><strong>📱 Phone:</strong> ${data.phone}</li>
                        <li style="margin: 8px 0;"><strong>📝 Subject:</strong> ${data.subject}</li>
                        <li style="margin: 8px 0;"><strong>🌐 Language:</strong> ${data.language.toUpperCase()}</li>
                        <li style="margin: 8px 0;"><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                </div>
                
                <div class="message">
                    <h4>💬 Message:</h4>
                    <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
                    <p style="margin: 0;"><strong>Action Required:</strong> Please respond to this contact inquiry promptly.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Recommend confirmation HTML template
   */
  private getRecommendConfirmationHTML(data: any): string {
    return `
    <!DOCTYPE html>
    <html lang="${data.language}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.language === 'sq' ? 'Faleminderit për rekomandimin' : 'Thank you for your recommendation'}</title>
        <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #00203F; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00203F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #F3F3F3; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="font-size: 24px; margin: 0 auto 10px;">🔧 myUsta</div>
                <p style="margin: 0;">${data.language === 'sq' ? 'Platforma juaj për mundësi pune' : 'Your platform for endless opportunities'}</p>
            </div>
            
            <div class="content">
                <h2>${data.language === 'sq' ? `Përshëndetje ${data.name}! 👋` : `Hello ${data.name}! 👋`}</h2>
                
                <p>${data.isRecommendation 
                  ? (data.language === 'sq' 
                      ? 'Faleminderit që rekomanduat një Usta! Ne do të kontaktojmë personin që rekomanduat dhe do t\'ju njoftojmë për progresin.'
                      : 'Thank you for recommending a Usta! We will contact the person you recommended and keep you updated on the progress.')
                  : (data.language === 'sq' 
                      ? 'Faleminderit që u regjistruat! Ne do t\'ju kontaktojmë sa më shpejt që myUsta të lançohet.'
                      : 'Thank you for registering! We will contact you as soon as myUsta launches.')
                }</p>
                
                <div class="details">
                    <h3>${data.language === 'sq' ? 'Detajet:' : 'Details:'}</h3>
                    <ul>
                        <li><strong>${data.language === 'sq' ? 'Kategoria:' : 'Category:'}</strong> ${this.formatCategories(data.category, data.language)}</li>
                        <li><strong>${data.language === 'sq' ? 'Vendndodhja:' : 'Location:'}</strong> ${this.formatLocations(data.location, data.language)}</li>
                        ${data.isRecommendation && data.ustaName ? `<li><strong>${data.language === 'sq' ? 'Usta i rekomanduar:' : 'Recommended Usta:'}</strong> ${data.ustaName}</li>` : ''}
                        <li><strong>${data.language === 'sq' ? 'Data:' : 'Date:'}</strong> ${new Date().toLocaleDateString(data.language === 'sq' ? 'sq-AL' : 'en-US')}</li>
                    </ul>
                </div>
                
                <p style="margin-top: 30px;">${data.language === 'sq' ? 'Faleminderit për durimin,' : 'Thank you for your patience,'}<br>
                <strong>${data.language === 'sq' ? 'Ekipi i myUsta' : 'The myUsta Team'}</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2025 myUsta. ${data.language === 'sq' ? 'Të gjitha të drejtat e rezervuara.' : 'All rights reserved.'}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Recommend confirmation text template
   */
  private getRecommendConfirmationText(data: any): string {
    return `
${data.language === 'sq' ? `Përshëndetje ${data.name}!` : `Hello ${data.name}!`}

${data.isRecommendation 
  ? (data.language === 'sq' 
      ? 'Faleminderit që rekomanduat një Usta! Ne do të kontaktojmë personin që rekomanduat dhe do t\'ju njoftojmë për progresin.'
      : 'Thank you for recommending a Usta! We will contact the person you recommended and keep you updated on the progress.')
  : (data.language === 'sq' 
      ? 'Faleminderit që u regjistruat! Ne do t\'ju kontaktojmë sa më shpejt që myUsta të lançohet.'
      : 'Thank you for registering! We will contact you as soon as myUsta launches.')
}

${data.language === 'sq' ? 'Detajet:' : 'Details:'}
- ${data.language === 'sq' ? 'Kategoria:' : 'Category:'} ${this.formatCategories(data.category, data.language)}
- ${data.language === 'sq' ? 'Vendndodhja:' : 'Location:'} ${this.formatLocations(data.location, data.language)}
${data.isRecommendation && data.ustaName ? `- ${data.language === 'sq' ? 'Usta i rekomanduar:' : 'Recommended Usta:'} ${data.ustaName}` : ''}
- ${data.language === 'sq' ? 'Data:' : 'Date:'} ${new Date().toLocaleDateString(data.language === 'sq' ? 'sq-AL' : 'en-US')}

${data.language === 'sq' ? 'Faleminderit për durimin,' : 'Thank you for your patience,'}
${data.language === 'sq' ? 'Ekipi i myUsta' : 'The myUsta Team'}

© 2025 myUsta. ${data.language === 'sq' ? 'Të gjitha të drejtat e rezervuara.' : 'All rights reserved.'}
    `;
  }

  /**
   * Recommend admin notification HTML template
   */
  private getRecommendAdminHTML(data: any): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${data.isRecommendation ? 'New Usta Recommendation' : 'New Usta Registration'}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: #00203F; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .highlight { background: #FFC800; padding: 2px 8px; border-radius: 3px; color: #00203F; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>${data.isRecommendation ? '🤝 New Usta Recommendation' : '👤 New Usta Registration'}</h2>
            </div>
            
            <div class="content">
                <p>${data.isRecommendation 
                  ? 'Someone has recommended a Usta for the myUsta platform!'
                  : 'A new professional has registered on the myUsta platform!'
                }</p>
                
                <div class="details">
                    <h3>📋 ${data.isRecommendation ? 'Recommendation Details:' : 'Registration Details:'}</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 8px 0;"><strong>👤 Name:</strong> ${data.name}</li>
                        <li style="margin: 8px 0;"><strong>📧 Email:</strong> ${data.email || data.recommender_email || 'Not provided'}</li>
                        <li style="margin: 8px 0;"><strong>📱 Phone:</strong> ${data.phone}</li>
                        <li style="margin: 8px 0;"><strong>🔧 Category:</strong> <span class="highlight">${this.formatCategories(data.category, 'en')}</span></li>
                        <li style="margin: 8px 0;"><strong>📍 Location:</strong> <span class="highlight">${this.formatLocations(data.location, 'en')}</span></li>
                        <li style="margin: 8px 0;"><strong>🌐 Language:</strong> ${data.language.toUpperCase()}</li>
                        <li style="margin: 8px 0;"><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                </div>
                
                ${data.isRecommendation && data.ustaName ? `
                <div class="details">
                    <h3>🔧 Recommended Usta Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 8px 0;"><strong>👤 Usta Name:</strong> ${data.ustaName}</li>
                        <li style="margin: 8px 0;"><strong>📱 Usta Phone:</strong> ${data.ustaPhone || 'Not provided'}</li>
                        <li style="margin: 8px 0;"><strong>📧 Usta Email:</strong> ${data.ustaEmail || 'Not provided'}</li>
                    </ul>
                </div>
                ` : ''}
                
                <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #00203F;">
                    <p style="margin: 0;"><strong>Action Required:</strong> Please follow up with this ${data.isRecommendation ? 'recommendation' : 'registration'} and add them to the appropriate contact lists.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

export const emailService = new EmailService();