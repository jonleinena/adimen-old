import * as React from 'react';

interface FormDataEmailProps {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message?: string;
}

export const FormDataEmail: React.FC<Readonly<FormDataEmailProps>> = ({
    name,
    email,
    company,
    phone,
    message,
}) => (
    <div>
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        {company && <p><strong>Company:</strong> {company}</p>}
        {phone && <p><strong>Phone:</strong> {phone}</p>}
        {message && <p><strong>Message:</strong></p>}
        {message && <p>{message}</p>}
    </div>
);

export default FormDataEmail;
