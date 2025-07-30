// src/services/google.service.ts - Consolidated Google services
import { google } from 'googleapis';
import { RegistrationData, GDPRRequest } from '../types';

class GoogleService {
  private sheets: any;
  private gmail: any;
  private spreadsheetId: string;

  constructor() {
    this.initializeServices();
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
  }

  private async initializeServices() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/gmail.send'
      ],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  // Sheets operations
  async addRegistration(data: RegistrationData): Promise<boolean> {
    try {
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        data.name,
        data.email,
        data.phone,
        data.category,
        data.location,
        data.language,
        data.ip || 'N/A',
        data.userAgent || 'N/A',
        data.gdprConsent ? 'YES' : 'NO',
        data.marketingConsent ? 'YES' : 'NO',
        'Active',
        new Date().toLocaleDateString()
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Registrations!A:M',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] }
      });

      return true;
    } catch (error) {
      console.error('Error adding registration:', error);
      return false;
    }
  }

  async getUserData(email: string): Promise<any[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Registrations!A:M'
      });

      const rows = response.data.values || [];
      const headers = rows[0];
      const userData = [];

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][2] === email) {
          const userRecord: any = {};
          headers.forEach((header: string, index: number) => {
            userRecord[header] = rows[i][index];
          });
          userData.push(userRecord);
        }
      }

      return userData;
    } catch (error) {
      console.error('Error getting user data:', error);
      return [];
    }
  }

  async deleteUserData(email: string): Promise<boolean> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Registrations!A:M'
      });

      const rows = response.data.values || [];
      const rowsToDelete = [];

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][2] === email) {
          rowsToDelete.push(i + 1);
        }
      }

      for (const rowIndex of rowsToDelete.reverse()) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: rowIndex - 1,
                  endIndex: rowIndex
                }
              }
            }]
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  }

  async logGDPRRequest(request: GDPRRequest): Promise<boolean> {
    try {
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        request.email,
        request.requestType,
        request.details || '',
        'Pending'
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'GDPR_Requests!A:E',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] }
      });

      return true;
    } catch (error) {
      console.error('Error logging GDPR request:', error);
      return false;
    }
  }

  async initializeSheets(): Promise<void> {
    // Initialize sheets with proper headers if they don't exist
    const registrationHeaders = [
      'Timestamp', 'Name', 'Email', 'Phone', 'Category', 'Location',
      'Language', 'IP', 'User Agent', 'GDPR Consent', 'Marketing Consent',
      'Status', 'Created Date'
    ];

    const gdprHeaders = [
      'Timestamp', 'Email', 'Request Type', 'Details', 'Status'
    ];

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Registrations!A1:M1',
        valueInputOption: 'RAW',
        requestBody: { values: [registrationHeaders] }
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'GDPR_Requests!A1:E1',
        valueInputOption: 'RAW',
        requestBody: { values: [gdprHeaders] }
      });
    } catch (error) {
      console.error('Error initializing sheets:', error);
      throw error;
    }
  }
}

export const googleService = new GoogleService();