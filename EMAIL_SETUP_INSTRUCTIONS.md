# Email Setup Instructions for Contact Form

Your contact form is now fully configured to send emails to the admin when someone submits the form. Here's what you need to do to complete the setup:

## ✅ What's Already Done

1. **Contact Form**: Updated with proper validation and error handling
2. **API Endpoint**: Already configured to send emails via `/api/contact`
3. **Email Service**: Already implemented in `src/utils/emailService.ts`
4. **Dependencies**: All required packages are already installed

## 🔧 Setup Required

### Step 1: Configure Email Settings

1. Open your `.env.local` file
2. Replace the email configuration with your actual credentials:

```bash
# Email Configuration (for contact form notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=your_actual_email@gmail.com
COMPANY_EMAIL=admin@vimanaproperties.com
```

### Step 2: Set Up Gmail App Password (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### Step 3: Alternative Email Providers

If you don't want to use Gmail, you can use other providers:

```bash
# For other email providers:
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@provider.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=your_email@provider.com
COMPANY_EMAIL=admin@vimanaproperties.com
```

## 🚀 How It Works

1. **User fills out form** on your homepage
2. **Form validates** required fields (name, email, message)
3. **Data is saved** to Firebase (always works)
4. **Email is sent** to admin (if configured)
5. **Success message** is shown to user

## 📧 Email Template

When someone submits the contact form, the admin will receive an email like this:

**Subject**: "New Contact Form Submission - [Customer Name]"

**Content**:
- Customer's name
- Customer's email
- Customer's phone (if provided)
- Customer's message
- Timestamp of submission

## 🔍 Testing

1. Start your development server: `npm run dev`
2. Go to your homepage and scroll to the contact section
3. Fill out the form and click "Send Message"
4. Check if you receive an email at your configured admin email

## 🚨 Troubleshooting

- **No email received**: Check your email configuration in `.env.local`
- **Gmail not working**: Make sure you're using an App Password, not your regular password
- **Form not submitting**: Check the browser console for any errors

## 📝 Note

The contact form will always save data to Firebase, even if email sending fails. This ensures no leads are lost.
