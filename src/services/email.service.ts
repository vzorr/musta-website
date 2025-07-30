// src/services/email.service.ts - Email service only
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { EmailTemplateData } from '../types';
import { emailTemplates } from '../utils/email-templates';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
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
  }

  async sendConfirmationEmail(data: EmailTemplateData): Promise<boolean> {
    try {
      const template = emailTemplates.getConfirmationTemplate(data);

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

  async sendAdminNotification(data: EmailTemplateData): Promise<boolean> {
    try {
      const template = emailTemplates.getAdminNotificationTemplate(data);

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: template.subject,
        html: template.html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return false;
    }
  }

  async sendGDPREmail(email: string, type: 'confirmation' | 'data_export', data?: any): Promise<boolean> {
    try {
      const template = emailTemplates.getGDPRTemplate(type, data);

      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: template.subject,
        html: template.html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending GDPR email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();