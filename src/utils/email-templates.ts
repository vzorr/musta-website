// src/utils/email-templates.ts - Email template utilities
import { EmailTemplateData } from '../types';

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

class EmailTemplateUtil {
  getConfirmationTemplate(data: EmailTemplateData): EmailTemplate {
    if (data.language === 'sq') {
      return {
        subject: 'Mirësevini në myUsta - Regjistrimi u Konfirmua',
        html: this.generateConfirmationHTML(data, 'sq'),
        text: this.generateConfirmationText(data, 'sq')
      };
    } else {
      return {
        subject: 'Welcome to myUsta - Registration Confirmed',
        html: this.generateConfirmationHTML(data, 'en'),
        text: this.generateConfirmationText(data, 'en')
      };
    }
  }

  getAdminNotificationTemplate(data: EmailTemplateData): EmailTemplate {
    return {
      subject: `New myUsta Registration - ${data.name} (${data.category})`,
      html: this.generateAdminNotificationHTML(data)
    };
  }

  getGDPRTemplate(type: 'confirmation' | 'data_export', data?: any): EmailTemplate {
    if (type === 'confirmation') {
      return {
        subject: 'myUsta - GDPR Request Confirmation',
        html: `
          <h2>GDPR Request Confirmation</h2>
          <p>We have received your GDPR request and will process it within 30 days.</p>
          <p>Contact: ${process.env.GDPR_CONTACT_EMAIL}</p>
        `
      };
    } else {
      return {
        subject: 'myUsta - Your Data Export',
        html: `
          <h2>Your Personal Data Export</h2>
          <p>Here is your personal data:</p>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `
      };
    }
  }

  private generateConfirmationHTML(data: EmailTemplateData, language: 'sq' | 'en'): string {
    const content = language === 'sq' ? {
      greeting: `Përshëndetje ${data.name}!`,
      thankYou: 'Faleminderit që u bashkuat me myUsta!',
      details: 'Detajet e regjistrimit:',
      category: 'Kategoria',
      location: 'Vendndodhja',
      benefits: 'Me myUsta ju do të:',
      benefit1: '🎯 Merrni mundësi pune direkt',
      benefit2: '⏰ Kurseni kohë',
      benefit3: '⭐ Ndërtoni reputacionin',
      closing: 'Faleminderit,<br>Ekipi i myUsta'
    } : {
      greeting: `Hello ${data.name}!`,
      thankYou: 'Thank you for joining myUsta!',
      details: 'Registration details:',
      category: 'Category',
      location: 'Location',
      benefits: 'With myUsta you will:',
      benefit1: '🎯 Get direct job opportunities',
      benefit2: '⏰ Save time',
      benefit3: '⭐ Build your reputation',
      closing: 'Thank you,<br>The myUsta Team'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #00203F; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00203F; color: white; padding: 20px; text-align: center; }
          .content { background: #F3F3F3; padding: 30px; }
          .highlight { background: #FFC800; color: #00203F; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>myUsta</h1>
          </div>
          <div class="content">
            <h2>${content.greeting}</h2>
            <p>${content.thankYou}</p>
            <h3>${content.details}</h3>
            <ul>
              <li><strong>${content.category}:</strong> ${this.translateCategory(data.category, language)}</li>
              <li><strong>${content.location}:</strong> ${this.translateLocation(data.location, language)}</li>
            </ul>
            <p>${content.benefits}</p>
            <ul>
              <li>${content.benefit1}</li>
              <li>${content.benefit2}</li>
              <li>${content.benefit3}</li>
            </ul>
            <p>${content.closing}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateConfirmationText(data: EmailTemplateData, language: 'sq' | 'en'): string {
    const content = language === 'sq' ? {
      greeting: `Përshëndetje ${data.name}!`,
      thankYou: 'Faleminderit që u bashkuat me myUsta!',
      details: `Kategoria: ${this.translateCategory(data.category, language)}\nVendndodhja: ${this.translateLocation(data.location, language)}`,
      closing: 'Faleminderit,\nEkipi i myUsta'
    } : {
      greeting: `Hello ${data.name}!`,
      thankYou: 'Thank you for joining myUsta!',
      details: `Category: ${this.translateCategory(data.category, language)}\nLocation: ${this.translateLocation(data.location, language)}`,
      closing: 'Thank you,\nThe myUsta Team'
    };

    return `${content.greeting}\n\n${content.thankYou}\n\n${content.details}\n\n${content.closing}`;
  }

  private generateAdminNotificationHTML(data: EmailTemplateData): string {
    return `
      <h2>🔔 New myUsta Registration</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
        <h3>Registration Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Category:</strong> ${data.category}</li>
          <li><strong>Location:</strong> ${data.location}</li>
          <li><strong>Language:</strong> ${data.language.toUpperCase()}</li>
          <li><strong>Registered:</strong> ${new Date().toLocaleString()}</li>
        </ul>
      </div>
    `;
  }

  private translateCategory(category: string, language: 'sq' | 'en'): string {
    const translations: { [key: string]: { sq: string; en: string } } = {
      plumber: { sq: 'Hidraulik', en: 'Plumber' },
      electrician: { sq: 'Elektriçist', en: 'Electrician' },
      painter: { sq: 'Piktor', en: 'Painter' },
      carpenter: { sq: 'Marangoz', en: 'Carpenter' },
      tiler: { sq: 'Pllakaxhi', en: 'Tiler' },
      mason: { sq: 'Murator', en: 'Mason' },
      other: { sq: 'Tjetër', en: 'Other' }
    };
    return translations[category]?.[language] || category;
  }

  private translateLocation(location: string, language: 'sq' | 'en'): string {
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
}

export const emailTemplates = new EmailTemplateUtil();