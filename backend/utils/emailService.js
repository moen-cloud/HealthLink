const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to HealthLink! 🏥',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Welcome to HealthLink, ${name}!</h1>
        <p>Thank you for joining our digital healthcare platform.</p>
        <p>You can now:</p>
        <ul>
          <li>Check your symptoms with our AI-powered triage system</li>
          <li>Book appointments with healthcare providers</li>
          <li>Access health education resources</li>
          <li>Chat with doctors in real-time</li>
        </ul>
        <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Login to Your Account
        </a>
      </div>
    `
  }),

  appointmentConfirmation: (patientName, doctorName, date) => ({
    subject: 'Appointment Confirmed ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Appointment Confirmed</h1>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been confirmed with Dr. ${doctorName}.</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(date).toLocaleTimeString()}</p>
        <a href="${process.env.CLIENT_URL}/patient/appointments" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          View Appointment
        </a>
      </div>
    `
  }),

  appointmentReminder: (patientName, doctorName, date) => ({
    subject: 'Appointment Reminder 🔔',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Appointment Reminder</h1>
        <p>Dear ${patientName},</p>
        <p>This is a reminder about your upcoming appointment with Dr. ${doctorName}.</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(date).toLocaleTimeString()}</p>
        <p>Please arrive 10 minutes early.</p>
      </div>
    `
  }),

  highRiskAlert: (doctorName, patientName) => ({
    subject: '⚠️ High Risk Triage Alert',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">High Risk Patient Alert</h1>
        <p>Dear Dr. ${doctorName},</p>
        <p>A patient (${patientName}) has been flagged as high-risk in the triage system.</p>
        <p>Please review their case as soon as possible.</p>
        <a href="${process.env.CLIENT_URL}/doctor/triages" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Review Case
        </a>
      </div>
    `
  }),

  newMessage: (recipientName, senderName) => ({
    subject: '💬 New Message from HealthLink',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">New Message</h1>
        <p>Dear ${recipientName},</p>
        <p>You have a new message from ${senderName}.</p>
        <a href="${process.env.CLIENT_URL}/chat" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          View Message
        </a>
      </div>
    `
  })
};

// Send email function
async function sendEmail(to, templateName, templateData) {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const { subject, html } = typeof template === 'function' 
      ? template(...templateData) 
      : template;

    const info = await transporter.sendMail({
      from: `"HealthLink" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email failed:', error);
    return { success: false, error: error.message };
  }
}

// Automated email triggers
async function sendWelcomeEmail(user) {
  return sendEmail(user.email, 'welcome', [user.name]);
}

async function sendAppointmentConfirmation(appointment) {
  return sendEmail(
    appointment.userId.email,
    'appointmentConfirmation',
    [appointment.userId.name, appointment.doctorName || 'Your Doctor', appointment.preferredDate]
  );
}

async function sendAppointmentReminder(appointment) {
  return sendEmail(
    appointment.userId.email,
    'appointmentReminder',
    [appointment.userId.name, appointment.doctorName || 'Your Doctor', appointment.preferredDate]
  );
}

async function sendHighRiskAlert(triage, doctor) {
  return sendEmail(
    doctor.email,
    'highRiskAlert',
    [doctor.name, triage.userId.name]
  );
}

async function sendNewMessageNotification(recipient, sender) {
  return sendEmail(
    recipient.email,
    'newMessage',
    [recipient.name, sender.name]
  );
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendHighRiskAlert,
  sendNewMessageNotification
};