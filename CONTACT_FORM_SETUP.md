# Contact Form Integration Setup Guide

This guide explains how to set up the enhanced contact form that saves to Firebase, Google Sheets, and sends emails.

## Features

✅ **Firebase Storage**: Automatically saves all contact form submissions  
✅ **Google Sheets Export**: Optionally exports to a Google Sheets spreadsheet  
✅ **Email Notifications**: Optionally sends emails to company and auto-replies to customers  

## Setup Instructions

### 1. Firebase (Already Configured)
Firebase is already set up and working. Contact forms will be saved to the `contacts` collection.

### 2. Google Sheets Setup (Optional)

#### Step 1: Create a Google Sheets Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

#### Step 2: Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Go to "Credentials" → "Create Credentials" → "Service Account"
5. Download the JSON key file
6. Share your spreadsheet with the service account email (found in the JSON file)

#### Step 3: Add Environment Variables
```env
GOOGLE_SHEETS_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your_project_id
```

### 3. Email Setup (Optional)

#### For Gmail:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Add environment variables:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
COMPANY_EMAIL=your_company_email@gmail.com
```

#### For Other Email Providers:
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@provider.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=your_email@provider.com
COMPANY_EMAIL=your_company_email@provider.com
```

## How It Works

1. **User submits contact form** → Always saved to Firebase
2. **If Google Sheets configured** → Creates/updates spreadsheet with contact data
3. **If Email configured** → Sends notification to company and auto-reply to customer

## Spreadsheet Structure

The Google Sheets will have these columns:
- **Submitted At**: Date and time of submission
- **Name**: Customer's name
- **Email**: Customer's email
- **Phone**: Customer's phone (if provided)
- **Message**: Customer's message
- **Status**: Form status (always "new")

## Email Templates

### Company Notification Email
- Subject: "New Contact Form Submission - [Customer Name]"
- Contains all customer details and message
- Formatted for easy reading and response

### Customer Auto-Reply Email
- Subject: "Thank you for contacting us - We received your message"
- Confirms receipt of their message
- Sets expectations for response time
- Professional and reassuring tone

## Testing

1. **Firebase Only**: Submit a form and check Firebase console
2. **With Google Sheets**: Check if new row appears in spreadsheet
3. **With Email**: Check if emails are sent and received

## Troubleshooting

### Google Sheets Issues
- Verify service account has access to the spreadsheet
- Check that Google Sheets API is enabled
- Ensure private key is properly formatted with `\n` characters

### Email Issues
- For Gmail, make sure you're using App Password, not regular password
- Check spam folders for test emails
- Verify SMTP settings for other providers

### Firebase Issues
- Check Firebase console for any errors
- Verify Firestore rules allow writes to `contacts` collection

## Error Handling

The system is designed to be resilient:
- Firebase submission must succeed
- Google Sheets and Email are optional and won't cause form submission to fail
- All errors are logged for debugging
- Users always get appropriate feedback

## Security Notes

- Environment variables are server-side only
- Google service account has minimal permissions
- Email passwords should use App Passwords when possible
- All API routes include proper error handling and validation
