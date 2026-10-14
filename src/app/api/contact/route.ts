import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// 🔒 Nettoie les entrées pour éviter l'injection d'en-têtes SMTP (CRLF) et XSS
function sanitize(input: string, maxLength = 500): string {
  return String(input)
    .replace(/[\r\n]+/g, " ")      // Supprimer CRLF (injection en-têtes)
    .replace(/[\x00-\x1F\x7F]/g, "") // Supprimer caractères de contrôle
    .replace(/<[^>]*>/g, "")        // Supprimer les balises HTML (anti-XSS)
    .trim()
    .substring(0, maxLength);
}

// 🔒 Échappe le HTML pour l'affichage sécurisé dans l'email
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 🔒 Validation email stricte
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // 🔒 Validation des champs obligatoires
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 🔒 Validation des types
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid input types" }, { status: 400 });
    }

    // 🔒 SANITISATION — Suppression CRLF + caractères de contrôle
    const safeName = sanitize(name, 100);
    const safeEmail = sanitize(email, 254);
    const safeSubject = sanitize(subject, 150);
    const safeMessage = sanitize(message, 5000);

    // 🔒 Validation email
    if (!isValidEmail(safeEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // 🔒 Validation longueur minimale
    if (safeName.length < 2 || safeSubject.length < 3 || safeMessage.length < 10) {
      return NextResponse.json(
        { error: "Name, subject or message is too short" },
        { status: 400 }
      );
    }

    // 🔒 Échapper le HTML pour l'affichage sécurisé dans le template
    const htmlName = escapeHtml(safeName);
    const htmlEmail = escapeHtml(safeEmail);
    const htmlSubject = escapeHtml(safeSubject);
    const htmlMessage = escapeHtml(safeMessage);

    // 🔒 Envoi sécurisé — toutes les valeurs sont nettoyées
    await transporter.sendMail({
      from: `"Cryptoelectro-au Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: safeEmail, // ✅ Nettoyé (pas de CRLF possible)
      subject: `[Contact] ${safeSubject}`, // ✅ Nettoyé (pas de CRLF possible)
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2 style="color: #007BFF;">New Contact Message</h2>
          <p><strong>From:</strong> ${htmlName} (${htmlEmail})</p>
          <p><strong>Subject:</strong> ${htmlSubject}</p>
          <hr style="border: 1px solid #eee;" />
          <p style="white-space: pre-line;">${htmlMessage}</p>
        </div>
      `,
    });

    // 🔒 Log de sécurité (visible dans Vercel Logs)
    console.log("📧 Contact form submitted:", {
      nameLength: safeName.length,
      subjectLength: safeSubject.length,
      messageLength: safeMessage.length,
      ip: req.headers.get("x-forwarded-for") || "unknown",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Contact form error:", error?.message || error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}