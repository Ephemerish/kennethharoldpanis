import type { APIRoute } from 'astro';

// Enable server-side rendering for this endpoint
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    console.log('Form data received:', { name, email, subject, message: message?.substring(0, 50) + '...' });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Validation failed: missing fields');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'All fields are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email address' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if Resend API key is available
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    console.log('Resend API key available:', !!resendApiKey);
    
    if (!resendApiKey) {
      console.log('No Resend API key found');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email service not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send email with Resend
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      console.log('Attempting to send email via Resend...');

      const emailResponse = await resend.emails.send({
        from: 'Kenneth Harold Panis <contact@kennethharoldpanis.com>', // Replace with your verified domain
        to: 'kennethpanis24@gmail.com',
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      console.log('Resend response:', emailResponse);

      if (emailResponse.error) {
        console.error('Resend error:', emailResponse.error);
        throw new Error(emailResponse.error.message || 'Resend API error');
      }

      console.log('Email sent successfully');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (resendError) {
      console.error('Resend sending failed:', resendError);
      throw resendError;
    }

  } catch (error) {
    console.error('Email sending failed:', error);
    
    // Return more specific error information
    let errorMessage = 'Failed to send email';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      details: error instanceof Error ? error.stack : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
