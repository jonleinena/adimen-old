import * as React from 'react'
import { type NextRequest, NextResponse } from 'next/server'

import FormDataEmail from '@/features/emails/formData'
import { resendClient } from '@/libs/resend/resend-client'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.json()

        const { name, email, company, phone, message } = formData

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 })
        }

        // Hardcoding the recipient email as requested
        const recipientEmail = 'leinenajon@gmail.com'
        // Using a placeholder sender email - replace with your verified domain in Resend
        const senderEmail = 'jon@resumaker-ai.com' // Replace with your actual sender email

        const { data, error } = await resendClient.emails.send({
            from: senderEmail,
            to: recipientEmail,
            subject: 'New Contact Form Submission',
            react: FormDataEmail({ name, email, company, phone, message }) as React.ReactElement,
        })

        if (error) {
            console.error('Error sending email:', error)
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
        }

        console.log('Email sent successfully:', data)
        return NextResponse.json({ message: 'Email sent successfully', data })
    } catch (error) {
        console.error('Error processing request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
} 