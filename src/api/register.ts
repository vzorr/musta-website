import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
}

// Configure your email transporter
const transporter = nodemailer.createTransporter({
  // For Gmail
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
  // For other providers, use:
  // host: process.env.SMTP_HOST,
  // port: parseInt(process.env.SMTP_PORT || '587'),
  // secure: false,
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASS,
  // },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, category, location }: RegistrationData = req.body;

    // Validate required fields
    if (!name || !email || !phone || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Prepare email content
    const emailContent = `
      New Registration on myUsta Platform
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Category: ${category}
      Location: ${location}
      
      Registered at: ${new Date().toLocaleString()}
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New myUsta Registration',
      text: emailContent,
      html: `
        <h2>New Registration on myUsta Platform</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Registered at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to myUsta - Registration Confirmed',
      html: `
        <h2>Welcome to myUsta!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for joining our waitlist. We've received your registration and will contact you as soon as myUsta launches.</p>
        <p>Your registration details:</p>
        <ul>
          <li><strong>Category:</strong> ${category}</li>
          <li><strong>Location:</strong> ${location}</li>
        </ul>
        <p>Stay tuned for updates!</p>
        <p>Best regards,<br>The myUsta Team</p>
      `,
    });

    // Here you could also save to a database
    // await saveToDatabase({ name, email, phone, category, location });

    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}