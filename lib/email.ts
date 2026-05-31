import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const ADMIN_EMAIL = process.env.GMAIL_USER!;
const BUSINESS_NAME = "Roopé";

// ─── Booking Notification to Admin ───────────────────────────────────────────
export async function sendBookingNotification(booking: {
  id: string;
  name: string;
  phone: string;
  email: string;
  occasion: string;
  service_name: string;
  date: string;
  time: string;
  city: string;
  address: string;
  artist_tier: string;
  extras: string[];
  total_amount: number;
}) {
  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Notifications" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🆕 New Booking: ${booking.name} — ${booking.service_name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 8px;">New Booking Received</h1>
        <p style="color: #C9A84C; font-size: 13px; margin-bottom: 24px;">Booking ID: #RP-${booking.id.slice(0, 8).toUpperCase()}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px; width: 140px;">Customer</td><td style="color: #1A1612; font-weight: 500;">${booking.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Phone</td><td style="color: #1A1612;">${booking.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Email</td><td style="color: #1A1612;">${booking.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Occasion</td><td style="color: #1A1612;">${booking.occasion}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Service</td><td style="color: #1A1612; font-weight: 500;">${booking.service_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Date & Time</td><td style="color: #1A1612;">${booking.date} at ${booking.time}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Location</td><td style="color: #1A1612;">${booking.city}<br/><small>${booking.address}</small></td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Artist Tier</td><td style="color: #1A1612;">${booking.artist_tier}</td></tr>
          ${booking.extras.length > 0 ? `<tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Extras</td><td style="color: #1A1612;">${booking.extras.join(", ")}</td></tr>` : ""}
          <tr style="border-top: 2px solid #C9A84C;"><td style="padding: 12px 0 0; color: #1A1612; font-weight: 700; font-size: 16px;">Total</td><td style="padding: 12px 0 0; color: #C9A84C; font-size: 20px; font-weight: 300;">₹${booking.total_amount.toLocaleString("en-IN")}</td></tr>
        </table>
        <p style="margin-top: 24px; padding: 16px; background: #fff; border-radius: 8px; color: #6B5E52; font-size: 13px;">
          📋 View all bookings at your admin dashboard.
        </p>
      </div>
    `,
  });
}

// ─── Booking Confirmation to Customer ────────────────────────────────────────
export async function sendBookingConfirmation(booking: {
  id: string;
  name: string;
  email: string;
  service_name: string;
  date: string;
  time: string;
  city: string;
  total_amount: number;
}) {
  await transporter.sendMail({
    from: `"${BUSINESS_NAME}" <${ADMIN_EMAIL}>`,
    to: booking.email,
    subject: `✨ Booking Confirmed — ${booking.service_name} on ${booking.date}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 4px;">Your booking is confirmed!</h1>
        <p style="color: #C9A84C; margin-bottom: 24px; font-size: 13px;">Booking ID: #RP-${booking.id.slice(0, 8).toUpperCase()}</p>
        <p style="color: #6B5E52; line-height: 1.7;">Dear ${booking.name},<br/><br/>
        Thank you for booking with ${BUSINESS_NAME}. Your artist has been reserved. Here's a summary of your appointment:</p>
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; color: #1A1612; font-weight: 600;">${booking.service_name}</p>
          <p style="margin: 0 0 4px; color: #6B5E52; font-size: 14px;">📅 ${booking.date} at ${booking.time}</p>
          <p style="margin: 0 0 4px; color: #6B5E52; font-size: 14px;">📍 ${booking.city}</p>
          <p style="margin: 16px 0 0; padding-top: 12px; border-top: 1px solid #F0EBE0; color: #C9A84C; font-size: 18px; font-weight: 300;">Total: ₹${booking.total_amount.toLocaleString("en-IN")}</p>
        </div>
        <p style="color: #6B5E52; font-size: 13px; line-height: 1.7;">
          ✅ Free cancellation up to 24 hours before your appointment.<br/>
          📞 Questions? Reply to this email or WhatsApp us at ${process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 98765 43210"}
        </p>
        <p style="color: #C9A84C; margin-top: 24px; font-size: 13px;">With love,<br/><strong style="color: #1A1612;">${BUSINESS_NAME} Team</strong></p>
      </div>
    `,
  });
}

// ─── Contact Form Notification ────────────────────────────────────────────────
export async function sendContactNotification(contact: {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Notifications" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `💬 New Contact: ${contact.subject}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 24px;">New Contact Message</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px; width: 100px;">From</td><td style="color: #1A1612; font-weight: 500;">${contact.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Email</td><td style="color: #1A1612;"><a href="mailto:${contact.email}" style="color: #C9A84C;">${contact.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Subject</td><td style="color: #1A1612;">${contact.subject}</td></tr>
        </table>
        <div style="background: white; border-radius: 8px; padding: 16px; margin-top: 16px; color: #1A1612; font-size: 14px; line-height: 1.7;">
          ${contact.message.replace(/\n/g, "<br/>")}
        </div>
        <p style="margin-top: 16px; color: #8B7D6B; font-size: 12px;">Reply directly to: <a href="mailto:${contact.email}" style="color: #C9A84C;">${contact.email}</a></p>
      </div>
    `,
    replyTo: contact.email,
  });
}

// ─── Bridal Inquiry Notification ─────────────────────────────────────────────
export async function sendBridalInquiryNotification(inquiry: {
  id: string;
  name: string;
  phone: string;
  email: string;
  package_name: string;
  wedding_date?: string;
  city: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Notifications" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `💍 New Bridal Inquiry: ${inquiry.package_name} — ${inquiry.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 24px;">New Bridal Package Inquiry</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px; width: 140px;">Bride's Name</td><td style="color: #1A1612; font-weight: 500;">${inquiry.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Phone</td><td style="color: #1A1612;">${inquiry.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Email</td><td style="color: #1A1612;"><a href="mailto:${inquiry.email}" style="color: #C9A84C;">${inquiry.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Package</td><td style="color: #C9A84C; font-weight: 600;">${inquiry.package_name}</td></tr>
          ${inquiry.wedding_date ? `<tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Wedding Date</td><td style="color: #1A1612;">${inquiry.wedding_date}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">City</td><td style="color: #1A1612;">${inquiry.city}</td></tr>
        </table>
        ${inquiry.message ? `<div style="background: white; border-radius: 8px; padding: 16px; margin-top: 16px; color: #1A1612; font-size: 14px; line-height: 1.7;">${inquiry.message.replace(/\n/g, "<br/>")}</div>` : ""}
      </div>
    `,
    replyTo: inquiry.email,
  });
}

// ─── Event Inquiry Notification ───────────────────────────────────────────────
export async function sendEventInquiryNotification(inquiry: {
  id: string;
  name: string;
  phone: string;
  email: string;
  package_name: string;
  group_size: number;
  event_date?: string;
  city: string;
  add_ons: string[];
  message: string;
}) {
  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Notifications" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `✨ New Event Inquiry: ${inquiry.package_name} — ${inquiry.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 24px;">New Event Package Inquiry</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px; width: 140px;">Name</td><td style="color: #1A1612; font-weight: 500;">${inquiry.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Phone</td><td style="color: #1A1612;">${inquiry.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Email</td><td style="color: #1A1612;"><a href="mailto:${inquiry.email}" style="color: #C9A84C;">${inquiry.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Package</td><td style="color: #C9A84C; font-weight: 600;">${inquiry.package_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Group Size</td><td style="color: #1A1612;">${inquiry.group_size} people</td></tr>
          ${inquiry.event_date ? `<tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Event Date</td><td style="color: #1A1612;">${inquiry.event_date}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">City</td><td style="color: #1A1612;">${inquiry.city}</td></tr>
          ${inquiry.add_ons.length > 0 ? `<tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Add-ons</td><td style="color: #1A1612;">${inquiry.add_ons.join(", ")}</td></tr>` : ""}
        </table>
        ${inquiry.message ? `<div style="background: white; border-radius: 8px; padding: 16px; margin-top: 16px; color: #1A1612; font-size: 14px; line-height: 1.7;">${inquiry.message.replace(/\n/g, "<br/>")}</div>` : ""}
      </div>
    `,
    replyTo: inquiry.email,
  });
}

// ─── Review Notification ──────────────────────────────────────────────────────
export async function sendReviewNotification(review: {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  review_text: string;
}) {
  const stars = "⭐".repeat(review.rating);
  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Notifications" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `${stars} New Review from ${review.name} (${review.rating}/5)`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 8px;">New Review Submitted</h1>
        <p style="color: #8B7D6B; font-size: 13px; margin-bottom: 24px;">Pending your approval in the admin dashboard</p>
        <div style="background: white; border-radius: 12px; padding: 20px;">
          <p style="color: #C9A84C; font-size: 20px; margin: 0 0 12px;">${stars}</p>
          <p style="color: #1A1612; font-style: italic; line-height: 1.7; margin: 0 0 16px;">"${review.review_text}"</p>
          <p style="color: #6B5E52; font-size: 13px; margin: 0;">— ${review.name}, ${review.location} | ${review.service}</p>
        </div>
        <p style="margin-top: 16px; color: #8B7D6B; font-size: 12px;">Approve or reject this review in your admin dashboard.</p>
      </div>
    `,
  });
}

// ─── Professional Registration Notification to Admin ─────────────────────────
export async function sendProfessionalApplicationNotification(app: {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience_years: number;
  city: string;
  skills: string[];
  portfolio_link?: string;
  certificate_url?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const acceptLink = `${appUrl}/api/register/professional/action?id=${app.id}&action=accept`;
  const rejectLink = `${appUrl}/api/register/professional/action?id=${app.id}&action=reject`;

  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Partner Portal" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `💼 New Artist Application: ${app.name} (${app.experience_years} yrs exp)`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px; border: 1px solid #E8D5A0;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 8px; text-align: center;">New Artist Application</h1>
        <p style="color: #8B7D6B; font-size: 13px; margin-bottom: 24px; text-align: center;">Review credentials and take action below</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px; width: 140px;">Artist Name</td><td style="color: #1A1612; font-weight: 500;">${app.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Email</td><td style="color: #1A1612;"><a href="mailto:${app.email}" style="color: #C9A84C;">${app.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Phone</td><td style="color: #1A1612;">${app.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Experience</td><td style="color: #1A1612; font-weight: 500;">${app.experience_years} Years</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">City</td><td style="color: #1A1612;">${app.city}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Specialties</td><td style="color: #1A1612;">${app.skills.join(", ")}</td></tr>
          ${app.portfolio_link ? `<tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Portfolio</td><td style="color: #1A1612;"><a href="${app.portfolio_link}" target="_blank" style="color: #C9A84C;">View Portfolio</a></td></tr>` : ""}
          ${app.certificate_url ? `<tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Certificate</td><td style="color: #1A1612;"><a href="${app.certificate_url}" target="_blank" style="color: #C9A84C;">View Certificate Document</a></td></tr>` : ""}
        </table>

        <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #FAF6EC;">
          <p style="margin: 0 0 16px; color: #1A1612; font-weight: 600; font-size: 14px;">Onboarding Decision</p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <a href="${acceptLink}" style="display: inline-block; background: #C9A84C; color: white; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 13px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(201,168,76,0.3);">Accept Application</a>
            <a href="${rejectLink}" style="display: inline-block; background: #6B5E52; color: white; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 13px; font-family: sans-serif; margin-left: 12px;">Reject</a>
          </div>
        </div>
      </div>
    `,
    replyTo: app.email,
  });
}

// ─── Salon Registration Notification to Admin ────────────────────────────────
export async function sendSalonApplicationNotification(salon: {
  id: string;
  salon_name: string;
  owner_name: string;
  email: string;
  phone: string;
  address: string;
  website_link?: string;
  staff_count: number;
  years_in_business: number;
  services: string[];
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const acceptLink = `${appUrl}/api/register/salon/action?id=${salon.id}&action=accept`;
  const rejectLink = `${appUrl}/api/register/salon/action?id=${salon.id}&action=reject`;

  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Partner Portal" <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🏨 New Salon Partnership Inquiry: ${salon.salon_name} — ${salon.owner_name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px; border: 1px solid #E8D5A0;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 8px; text-align: center;">New Salon Partnership</h1>
        <p style="color: #8B7D6B; font-size: 13px; margin-bottom: 24px; text-align: center;">Review details and take action below</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px; width: 140px;">Salon/Parlour Name</td><td style="color: #1A1612; font-weight: 500;">${salon.salon_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Owner Name</td><td style="color: #1A1612; font-weight: 500;">${salon.owner_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Email</td><td style="color: #1A1612;"><a href="mailto:${salon.email}" style="color: #C9A84C;">${salon.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Phone</td><td style="color: #1A1612;">${salon.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Business Age</td><td style="color: #1A1612;">${salon.years_in_business} Years</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Staff Count</td><td style="color: #1A1612;">${salon.staff_count} Members</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Address</td><td style="color: #1A1612;">${salon.address}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Specialties</td><td style="color: #1A1612;">${salon.services.join(", ")}</td></tr>
          ${salon.website_link ? `<tr><td style="padding: 8px 0; color: #8B7D6B; font-size: 13px;">Website / Social</td><td style="color: #1A1612;"><a href="${salon.website_link}" target="_blank" style="color: #C9A84C;">Visit Site</a></td></tr>` : ""}
        </table>

        <div style="background: white; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #FAF6EC;">
          <p style="margin: 0 0 16px; color: #1A1612; font-weight: 600; font-size: 14px;">Onboarding Decision</p>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <a href="${acceptLink}" style="display: inline-block; background: #C9A84C; color: white; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 13px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(201,168,76,0.3);">Accept Application</a>
            <a href="${rejectLink}" style="display: inline-block; background: #6B5E52; color: white; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 13px; font-family: sans-serif; margin-left: 12px;">Reject</a>
          </div>
        </div>
      </div>
    `,
    replyTo: salon.email,
  });
}

// ─── Onboarding Follow-Up Update to Applicant ───────────────────────────────
export async function sendApplicationStatusUpdate(applicant: {
  name: string;
  email: string;
  type: "professional" | "salon";
  status: "accepted" | "rejected";
}) {
  const isAccepted = applicant.status === "accepted";
  const subject = isAccepted
    ? `💖 Roopé Partnership Status: Congratulations!`
    : `Roopé Onboarding Application Update`;

  const htmlContent = isAccepted
    ? `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 4px; text-align: center;">Welcome to Roopé!</h1>
        <p style="color: #C9A84C; font-size: 11px; margin-bottom: 24px; text-align: center; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Application Accepted</p>
        
        <p style="color: #6B5E52; line-height: 1.7; font-size: 14px;">
          Dear ${applicant.name},<br/><br/>
          Congratulations! We are delighted to inform you that your application to join the Roopé Beauty Platform has been <strong>Accepted</strong>.
          We reviewed your credentials and certificates and are incredibly excited about the prospect of working together.
        </p>
        <div style="background: white; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #F0EBE0;">
          <p style="margin: 0 0 12px; color: #1A1612; font-weight: 600; font-size: 14px;">📅 What's Next?</p>
          <p style="margin: 0; color: #6B5E52; font-size: 13px; line-height: 1.6;">
            A representative from our partnership team will reach out to you via phone or email within the next 48 hours to schedule a conversation and finalize your onboarding onto our platform in Indore.
          </p>
        </div>
        <p style="color: #6B5E52; font-size: 13px; line-height: 1.6;">
          If you have any questions in the meantime, feel free to reply directly to this email or reach us on WhatsApp at ${process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 98765 43210"}.
        </p>
        <p style="color: #C9A84C; margin-top: 32px; font-size: 13px;">With love,<br/><strong style="color: #1A1612;">The Roopé Partnership Team</strong></p>
      </div>
    `
    : `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EC; padding: 32px; border-radius: 12px;">
        <h1 style="color: #1A1612; font-weight: 300; margin-bottom: 24px; text-align: center;">Roopé Application Status</h1>
        
        <p style="color: #6B5E52; line-height: 1.7; font-size: 14px;">
          Dear ${applicant.name},<br/><br/>
          Thank you for your interest in partnering with the Roopé Beauty Platform. We truly appreciate the time and effort you put into applying and submitting your details.
        </p>
        <p style="color: #6B5E52; line-height: 1.7; font-size: 14px;">
          After careful consideration of your application and current capacity requirements in Indore, we regret to inform you that we are unable to move forward with your onboarding at this stage.
        </p>
        <p style="color: #6B5E52; line-height: 1.7; font-size: 14px;">
          We will keep your professional credentials and portfolio on file in our database and will contact you directly if matching onboarding openings arise in the future. We wish you the absolute best in your professional journey.
        </p>
        <p style="color: #C9A84C; margin-top: 32px; font-size: 13px;">Sincerely,<br/><strong style="color: #1A1612;">The Roopé Partnership Team</strong></p>
      </div>
    `;

  await transporter.sendMail({
    from: `"${BUSINESS_NAME} Partnership Team" <${ADMIN_EMAIL}>`,
    to: applicant.email,
    subject,
    html: htmlContent,
  });
}
