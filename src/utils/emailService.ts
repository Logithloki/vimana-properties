import nodemailer from 'nodemailer';
import { ContactFormData } from '@/utils/firebaseUtils';

interface ContactDataWithTimestamp extends ContactFormData {
  submittedAt: string;
  status: string;
}

// Email configuration
const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || 'gmail', // gmail, outlook, etc.
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // For Gmail, use App Password
  },
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  to: process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
};

export const sendContactEmail = async (contactData: ContactDataWithTimestamp) => {
  try {
    // Check if email is configured
    if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
      console.log('Email not configured, skipping...');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: EMAIL_CONFIG.service,
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth,
    });

    // Verify connection configuration
    await transporter.verify();

    // Format the submission date
    const submissionDate = new Date(contactData.submittedAt).toLocaleString();

    // Email content for company notification
    const companyEmailContent = {
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.to,
      subject: `New Contact Form Submission - ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Contact Details:</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
            ${contactData.phone ? `<p><strong>Phone:</strong> <a href="tel:${contactData.phone}">${contactData.phone}</a></p>` : ''}
            <p><strong>Submitted:</strong> ${submissionDate}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #0284c7; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #0284c7;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #059669;">
              <strong>Next Steps:</strong> Please respond to this inquiry within 24 hours for best customer service.
            </p>
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was automatically generated from your real estate website contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}\n` : ''}
Submitted: ${submissionDate}

Message:
${contactData.message}

Please respond to this inquiry within 24 hours for best customer service.
      `
    };

    // Send email to company
    const companyResult = await transporter.sendMail(companyEmailContent);
    console.log('Company notification email sent:', companyResult.messageId);

    // Auto-reply email to customer
    const customerEmailContent = {
      from: EMAIL_CONFIG.from,
      to: contactData.email,
      subject: 'Thank you for contacting us - We received your message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            Thank You for Contacting Us!
          </h2>
          
          <p>Dear ${contactData.name},</p>
          
          <p>We have received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible, typically within 24 hours.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Message Summary:</h3>
            <p><strong>Submitted:</strong> ${submissionDate}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #fff; padding: 10px; border-left: 3px solid #059669; margin-top: 10px;">
              <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; color: #059669;">
              <strong>What's Next?</strong><br>
              Our real estate experts will review your inquiry and respond with relevant information or schedule a consultation if needed.
            </p>
          </div>
          
          <p>If you have any urgent questions, please don't hesitate to call us directly.</p>
          
          <p>Best regards,<br>
          Your Real Estate Team</p>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This is an automated response. Please do not reply to this email directly.
          </p>
        </div>
      `,
      text: `
Dear ${contactData.name},

We have received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible, typically within 24 hours.

Your Message Summary:
Submitted: ${submissionDate}
Message: ${contactData.message}

What's Next?
Our real estate experts will review your inquiry and respond with relevant information or schedule a consultation if needed.

If you have any urgent questions, please don't hesitate to call us directly.

Best regards,
Your Real Estate Team

This is an automated response. Please do not reply to this email directly.
      `
    };

    // Send auto-reply to customer
    const customerResult = await transporter.sendMail(customerEmailContent);
    console.log('Customer auto-reply email sent:', customerResult.messageId);

    return {
      companyEmail: companyResult.messageId,
      customerEmail: customerResult.messageId
    };

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
