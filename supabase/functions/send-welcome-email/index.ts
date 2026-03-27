// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { Resend } from 'https://esm.sh/resend'

Deno.serve(async (req: Request) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { email, username, userId } = await req.json()

    if (!email || !userId) {
      throw new Error('Missing required fields')
    }

    console.log(`Sending welcome email to: ${email}`)

    // Initialize Resend with your API key
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Welcome to SomaSoma! ✨</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a2e;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .card {
            background: white;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 24px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
            color: white;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 12px;
            margin: 24px 0;
          }
          .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">SomaSoma / S²</div>
            <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome to SomaSoma, ${username || 'learner'}! 🎉</h1>
            <p>We're thrilled to have you join our community! Your AI study partner is ready to help you learn smarter.</p>
            <div style="text-align: center;">
              <a href="https://somasoma.com/dashboard" class="button">Start Learning →</a>
            </div>
            <div class="footer">
              <p>Happy learning!<br>The SomaSoma Team</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',  // Resend's test domain
      to: [email],
      subject: 'Welcome to SomaSoma! ✨ Your AI Study Partner Awaits',
      html: htmlContent,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent:', data)

    // Add to waitlist
    const { error: waitlistError } = await supabaseClient
      .from('waitlist')
      .upsert({
        email: email,
        is_verified: true,
      }, { onConflict: 'email' })

    if (waitlistError) {
      console.error('Waitlist error:', waitlistError)
    }

    return new Response(
      JSON.stringify({ success: true, message: `Welcome email sent to ${email}` }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})