import { google } from 'googleapis';
import { ContactFormData } from '@/utils/firebaseUtils';

interface ContactDataWithTimestamp extends ContactFormData {
  submittedAt: string;
  status: string;
}

// Google Sheets configuration
const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: process.env.GOOGLE_SHEETS_ID,
  range: 'Sheet1!A:F', // Adjust based on your sheet structure
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_PROJECT_ID,
  }
};

export const saveToGoogleSheets = async (contactData: ContactDataWithTimestamp) => {
  try {
    // Check if Google Sheets is configured
    if (!GOOGLE_SHEETS_CONFIG.credentials.client_email || 
        !GOOGLE_SHEETS_CONFIG.credentials.private_key ||
        !GOOGLE_SHEETS_CONFIG.spreadsheetId ||
        GOOGLE_SHEETS_CONFIG.spreadsheetId === 'your_actual_spreadsheet_id_here') {
      console.log('Google Sheets not properly configured, skipping...');
      return;
    }

    console.log('Attempting to save to Google Sheets ID:', GOOGLE_SHEETS_CONFIG.spreadsheetId);

    // Authenticate with Google Sheets API
    const auth = new google.auth.JWT(
      GOOGLE_SHEETS_CONFIG.credentials.client_email,
      undefined,
      GOOGLE_SHEETS_CONFIG.credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = GOOGLE_SHEETS_CONFIG.spreadsheetId;

    // Prepare the row data
    const rowData = [
      new Date(contactData.submittedAt).toLocaleString(),
      contactData.name,
      contactData.email,
      contactData.phone || '',
      contactData.message,
      contactData.status
    ];

    // Check if headers exist in the first sheet, if not create them
    let sheetName = 'Sheet1'; // Default sheet name
    
    try {
      // First, get the sheet properties to understand the structure
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId
      });
      
      // Use the first sheet's title
      if (spreadsheet.data.sheets && spreadsheet.data.sheets.length > 0) {
        sheetName = spreadsheet.data.sheets[0].properties?.title || 'Sheet1';
      }
      
      console.log('Using sheet name:', sheetName);

      // Check if headers exist
      const headerRange = `${sheetName}!A1:F1`;
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: headerRange,
      });

      // If no data or headers don't exist, add headers
      if (!response.data.values || response.data.values.length === 0) {
        console.log('Adding headers to sheet...');
        await sheets.spreadsheets.values.update({
          spreadsheetId: spreadsheetId,
          range: headerRange,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Submitted At', 'Name', 'Email', 'Phone', 'Message', 'Status']]
          }
        });
        console.log('Headers added successfully');
      } else {
        console.log('Headers already exist');
      }
    } catch (headerError) {
      console.error('Error checking/adding headers:', headerError);
      // Continue anyway - headers are not critical
    }

    // Append the contact data
    const dataRange = `${sheetName}!A:F`;
    console.log('Appending data to range:', dataRange);
    
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: dataRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData]
      }
    });

    console.log('Successfully saved to Google Sheets:', result.data.updates?.updatedRows, 'rows updated');
    console.log('View your spreadsheet at: https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit');
    return result.data;

  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        console.error('The spreadsheet ID may be incorrect or the service account may not have access to it.');
        console.error('Make sure to share the spreadsheet with:', GOOGLE_SHEETS_CONFIG.credentials.client_email);
      }
    }
    
    throw error;
  }
};
