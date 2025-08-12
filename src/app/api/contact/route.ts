import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    console.log('Received form data:', formData);
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      console.log('Missing required fields:', { name: !!formData.name, email: !!formData.email, message: !!formData.message });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Add timestamp
    const contactData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'new'
    };
    console.log('Contact data prepared:', contactData);

    // Send email notification - this is the primary function
    try {
      console.log('Attempting to send email...');
      await sendContactEmail(contactData);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Email error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    // Optional: Try to save to Firebase (don't fail if this doesn't work)
    let firebaseSuccess = false;
    try {
      const { submitContactForm } = await import('@/utils/firebaseUtils');
      console.log('Attempting to save to Firebase...');
      const firebaseResult = await submitContactForm(contactData);
      console.log('✅ Saved to Firebase:', firebaseResult);
      firebaseSuccess = true;
    } catch (firebaseError) {
      console.error('❌ Firebase error (non-critical):', firebaseError);
    }
    
    // Optional: Try to save to Google Sheets (don't fail if this doesn't work)
    let sheetsSuccess = false;
    try {
      const { saveToGoogleSheets } = await import('@/utils/googleSheets');
      console.log('Attempting to save to Google Sheets...');
      await saveToGoogleSheets(contactData);
      console.log('✅ Saved to Google Sheets');
      sheetsSuccess = true;
    } catch (sheetsError) {
      console.error('❌ Google Sheets error (non-critical):', sheetsError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully! We will get back to you soon.',
      details: {
        emailSent: true,
        firebaseSaved: firebaseSuccess,
        sheetsSaved: sheetsSuccess
      }
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}
