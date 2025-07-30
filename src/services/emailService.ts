// src/lib/emailService.ts
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface RegistrationEmailData {
  name: string;
  email: string;
  category: string;
  location: string;
  language: 'sq' | 'en';
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private gmail: any;

  constructor() {
    this.initializeGmailAPI();
    this.initializeNodemailer();
  }

  private async initializeGmailAPI() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  private async initializeNodemailer() {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });

      const accessToken = await oauth2Client.getAccessToken();

      this.transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.FROM_EMAIL,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken.token as string,
        },
      });
    } catch (error) {
      console.error('Error initializing nodemailer:', error);
      throw new Error('Failed to initialize email service');
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
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #00203F; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00203F; color: white; padding: 20px; text-align: center; }
            .logo { width: 50px; height: 50px; margin: 0 auto 10px; }
            .content { background: #F3F3F3; padding: 30px; }
            .highlight { background: #FFC800; color: #00203F; padding: 2px 6px; border-radius: 4px; }
            .footer { background: #00203F; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .btn { display: inline-block; background: #FFC800; color: #00203F; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔧</div>
                <h1>myUsta</h1>
                <p>Platforma juaj për mundësi pune</p>
            </div>
            
            <div class="content">
                <h2>Përshëndetje ${data.name}! 👋</h2>
                
                <p>Faleminderit që u bashkuat me <span class="highlight">myUsta</span>! Ne kemi pranuar regjistrimin tuaj dhe do t'ju kontaktojmë sa më shpejt që myUsta të lançohet.</p>
                
                <div class="details">
                    <h3>Detajet e regjistrimit tuaj:</h3>
                    <ul>
                        <li><strong>Kategoria:</strong> ${this.getCategoryTranslation(data.category, 'sq')}</li>
                        <li><strong>Vendndodhja:</strong> ${this.getLocationTranslation(data.location, 'sq')}</li>
                        <li><strong>Data e regjistrimit:</strong> ${new Date().toLocaleDateString('sq-AL')}</li>
                    </ul>
                </div>
                
                <p>Me myUsta, ju do të:</p>
                <ul>
                    <li>🎯 Merrni mundësi pune direkt</li>
                    <li>⏰ Kurseni kohë dhe mundim</li>
                    <li>⭐ Ndërtoni reputacionin tuaj</li>
                    <li>💼 Lidheni me klientë të besuar</li>
                </ul>
                
                <p>Ne do t'ju njoftojmë me email sa më shpejt që platforma të jetë gati për përdorim!</p>
                
                <p>Faleminderit për durimin,<br>
                <strong>Ekipi i myUsta</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2025 myUsta. Të gjitha të drejtat e rezervuara.</p>
                <p>Aftësitë tuaja. Platforma jonë. Mundësi të pafundme.</p>
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
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #00203F; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00203F; color: white; padding: 20px; text-align: center; }
            .logo { width: 50px; height: 50px; margin: 0 auto 10px; }
            .content { background: #F3F3F3; padding: 30px; }
            .highlight { background: #FFC800; color: #00203F; padding: 2px 6px; border-radius: 4px; }
            .footer { background: #00203F; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .btn { display: inline-block; background: #FFC800; color: #00203F; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔧</div>
                <h1>myUsta</h1>
                <p>Your platform for endless opportunities</p>
            </div>
            
            <div class="content">
                <h2>Hello ${data.name}! 👋</h2>
                
                <p>Thank you for joining <span class="highlight">myUsta</span>! We've received your registration and will contact you as soon as myUsta launches.</p>
                
                <div class="details">
                    <h3>Your registration details:</h3>
                    <ul>
                        <li><strong>Category:</strong> ${this.getCategoryTranslation(data.category, 'en')}</li>
                        <li><strong>Location:</strong> ${this.getLocationTranslation(data.location, 'en')}</li>
                        <li><strong>Registration date:</strong> ${new Date().toLocaleDateString('en-US')}</li>
                    </ul>
                </div>
                
                <p>With myUsta, you will:</p>
                <ul>
                    <li>🎯 Get direct job opportunities</li>
                    <li>⏰ Save time and effort</li>
                    <li>⭐ Build your reputation</li>
                    <li>💼 Connect with trusted clients</li>
                </ul>
                
                <p>We'll notify you via email as soon as the platform is ready for use!</p>
                
                <p>Thank you for your patience,<br>
                <strong>The myUsta Team</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2025 myUsta. All rights reserved.</p>
                <p>Your Skills. Our platform. Endless Opportunities.</p>
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
- Kategoria: ${this.getCategoryTranslation(data.category, 'sq')}
- Vendndodhja: ${this.getLocationTranslation(data.location, 'sq')}
- Data e regjistrimit: ${new Date().toLocaleDateString('sq-AL')}

Me myUsta, ju do të:
- Merrni mundësi pune direkt
- Kurseni kohë dhe mundim
- Ndërtoni reputacionin tuaj
- Lidheni me klientë të besuar

Ne do t'ju njoftojmë me email sa më shpejt që platforma të jetë gati për përdorim!

Faleminderit për durimin,
Ekipi i myUsta

© 2025 myUsta. Të gjitha të drejtat e rezervuara.
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
- Category: ${this.getCategoryTranslation(data.category, 'en')}
- Location: ${this.getLocationTranslation(data.location, 'en')}
- Registration date: ${new Date().toLocaleDateString('en-US')}

With myUsta, you will:
- Get direct job opportunities
- Save time and effort
- Build your reputation
- Connect with trusted clients

We'll notify you via email as soon as the platform is ready for use!

Thank you for your patience,
The myUsta Team

© 2025 myUsta. All rights reserved.
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
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00203F; color: white; padding: 15px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .highlight { background: #FFC800; padding: 2px 5px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🔔 New myUsta Registration</h2>
            </div>
            
            <div class="content">
                <p>A new professional has registered on myUsta:</p>
                
                <div class="details">
                    <h3>Registration Details:</h3>
                    <ul>
                        <li><strong>Name:</strong> ${data.name}</li>
                        <li><strong>Email:</strong> ${data.email}</li>
                        <li><strong>Category:</strong> <span class="highlight">${data.category}</span></li>
                        <li><strong>Location:</strong> <span class="highlight">${data.location}</span></li>
                        <li><strong>Language:</strong> ${data.language.toUpperCase()}</li>
                        <li><strong>Registered:</strong> ${new Date().toLocaleString()}</li>
                    </ul>
                </div>
                
                <p>Please follow up with this registration as appropriate.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Send confirmation email to user
   */
  async sendConfirmationEmail(data: RegistrationEmailData): Promise<boolean> {
    try {
      const template = this.getConfirmationTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: data.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      await this.transporter.sendMail(mailOptions);
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
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New myUsta Registration - ${data.name} (${data.category})`,
        html: this.getAdminNotificationHTML(data),
      };

      await this.transporter.sendMail(mailOptions);
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
      let subject: string;
      let html: string;

      if (type === 'confirmation') {
        subject = 'myUsta - GDPR Request Confirmation';
        html = `
        <h2>GDPR Request Confirmation</h2>
        <p>We have received your GDPR request and will process it within 30 days as required by law.</p>
        <p>If you have any questions, please contact us at ${process.env.GDPR_CONTACT_EMAIL}</p>
        `;
      } else {
        subject = 'myUsta - Your Data Export';
        html = `
        <h2>Your Personal Data Export</h2>
        <p>As requested, here is all the personal data we have stored for your email address:</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <p>If you have any questions, please contact us at ${process.env.GDPR_CONTACT_EMAIL}</p>
        `;
      }

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: subject,
        html: html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending GDPR email:', error);
      return false;
    }
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
      other: { sq: 'Tjetër', en: 'Other' }
    };

    return translations[location]?.[language] || location;
  }
}

export const emailService = new EmailService();