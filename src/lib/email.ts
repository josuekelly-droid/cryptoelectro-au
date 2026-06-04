import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const SITE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

// ============ ORDER CONFIRMATION ============
export async function sendOrderConfirmationEmail(
  to: string,
  data: {
    orderNumber: string;
    customerName: string;
    items: { name: string; quantity: number; price: number }[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    cryptoCurrency?: string;
    cryptoAmount?: string;
    cryptoAddress?: string;
    paymentMethod: string;
  }
) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #333;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #333; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  const cryptoInstructions =
    data.cryptoAddress && data.cryptoAmount
      ? `
    <div style="background: #2C2C2C; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #007BFF;">💰 Crypto Payment Instructions</h3>
      <p>Send exactly <strong>${data.cryptoAmount} ${data.cryptoCurrency}</strong> to this address:</p>
      <p style="background: #000; color: #28A745; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all;">${data.cryptoAddress}</p>
      <p style="font-size: 12px; color: #999;">Your order will be confirmed once the payment is detected on the blockchain (usually within 10-30 minutes).</p>
    </div>`
      : "";

  await transporter.sendMail({
    from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Order Confirmed #${data.orderNumber} - Cryptoelectro-au`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0A0A0A;">
        <div style="background: #007BFF; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cryptoelectro-au</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Order Confirmation</p>
        </div>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; color: #F0F0F0;">
          <h2 style="margin-top: 0;">Thank you, ${data.customerName}! 🎉</h2>
          <p>Your order <strong style="color: #007BFF;">#${data.orderNumber}</strong> has been received and is being processed.</p>
          
          <h3 style="border-bottom: 2px solid #007BFF; padding-bottom: 8px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; color: #F0F0F0;">
            <thead>
              <tr style="background: #2C2C2C;">
                <th style="padding: 10px 8px; text-align: left;">Product</th>
                <th style="padding: 10px 8px; text-align: center;">Qty</th>
                <th style="padding: 10px 8px; text-align: right;">Price</th>
                <th style="padding: 10px 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right; background: #2C2C2C; padding: 16px; border-radius: 8px;">
            <p style="margin: 4px 0;">Subtotal: <strong>$${data.subtotal.toFixed(2)}</strong></p>
            <p style="margin: 4px 0;">Shipping: <strong>${data.shipping === 0 ? "Free" : "$" + data.shipping.toFixed(2)}</strong></p>
            <p style="margin: 4px 0;">GST (10%): <strong>$${data.tax.toFixed(2)}</strong></p>
            <p style="margin: 12px 0 4px; font-size: 20px; color: #007BFF;">Total: <strong>$${data.total.toFixed(2)}</strong></p>
          </div>
          
          ${cryptoInstructions}
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <p>📦 <a href="${SITE_URL}/dashboard" style="color: #007BFF; text-decoration: none;">Track your order</a></p>
            <p>❓ <a href="${SITE_URL}/contact" style="color: #007BFF; text-decoration: none;">Contact support</a></p>
          </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          Cryptoelectro-au — Australia's Premium Electronics Marketplace<br>
          Payments secured by NowPayments
        </p>
      </div>
    `,
  });
}

// ============ WITHDRAWAL CONFIRMATION ============
export async function sendWithdrawalConfirmationEmail(
  to: string,
  data: {
    customerName: string;
    amount: number;
    type: "store_credit" | "crypto";
    walletAddress?: string;
    newBalance: number;
  }
) {
  const typeLabel = data.type === "store_credit" ? "Store Credit" : "Cryptocurrency (TRX)";
  const typeIcon = data.type === "store_credit" ? "🛒" : "💎";

  const detailsHtml =
    data.type === "crypto"
      ? `
        <div style="background: #2C2C2C; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Wallet Address:</strong></p>
          <p style="background: #000; color: #FFC107; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all;">${data.walletAddress}</p>
          <p style="font-size: 12px; color: #999; margin-bottom: 0;">Processing time: 24-48 hours</p>
        </div>`
      : `
        <div style="background: #2C2C2C; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;">✅ The amount has been added to your store credit and is <strong>available immediately</strong> for your next purchase.</p>
        </div>`;

  await transporter.sendMail({
    from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Withdrawal Processed — $${data.amount.toFixed(2)} ${typeLabel} — Cryptoelectro-au`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0A0A0A;">
        <div style="background: #28A745; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cryptoelectro-au</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Withdrawal Confirmation</p>
        </div>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; color: #F0F0F0;">
          <h2 style="margin-top: 0;">Hello ${data.customerName},</h2>
          <p>Your withdrawal of <strong style="color: #28A745;">$${data.amount.toFixed(2)}</strong> has been processed as <strong>${typeIcon} ${typeLabel}</strong>.</p>
          
          ${detailsHtml}
          
          <div style="background: #2C2C2C; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">💰 New available balance: <strong style="color: #007BFF;">$${data.newBalance.toFixed(2)}</strong></p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <p>📊 <a href="${SITE_URL}/dashboard/affiliate" style="color: #007BFF; text-decoration: none;">View your affiliate dashboard</a></p>
            <p>❓ <a href="${SITE_URL}/contact" style="color: #007BFF; text-decoration: none;">Contact support</a></p>
          </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          Cryptoelectro-au — Australia's Premium Electronics Marketplace
        </p>
      </div>
    `,
  });
}

// ============ ORDER EXPIRED — CLIENT ============
export async function sendOrderExpiredEmail(
  to: string,
  data: {
    orderNumber: string;
    customerName: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    expiredAt: string;
  }
) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #333;">${item.name} × ${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Commande annulée #${data.orderNumber} — Délai de paiement dépassé`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0A0A0A;">
        <div style="background: #DC3545; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Cryptoelectro-au</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0;">Commande annulée</p>
        </div>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; color: #F0F0F0;">
          <h2 style="margin-top: 0;">Bonjour ${data.customerName},</h2>
          
          <div style="background: #3C1518; border-left: 4px solid #DC3545; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #DC3545; font-weight: bold;">⏰ Votre commande #${data.orderNumber} a été annulée</p>
            <p style="margin: 8px 0 0; font-size: 14px;">Le délai de paiement d'une heure est dépassé. Votre commande a été automatiquement annulée.</p>
          </div>
          
          <h3 style="border-bottom: 2px solid #DC3545; padding-bottom: 8px;">Récapitulatif de la commande</h3>
          <table style="width: 100%; border-collapse: collapse; color: #F0F0F0;">
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right; background: #2C2C2C; padding: 16px; border-radius: 8px;">
            <p style="margin: 4px 0; font-size: 18px;">Total: <strong style="color: #DC3545;">$${data.total.toFixed(2)}</strong></p>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            Date d'expiration : ${new Date(data.expiredAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
            <p>🛒 <a href="${SITE_URL}/category/smartphones" style="color: #007BFF; text-decoration: none;">Recommander ces articles</a></p>
            <p>📦 <a href="${SITE_URL}/dashboard" style="color: #007BFF; text-decoration: none;">Voir mes commandes</a></p>
            <p>❓ <a href="${SITE_URL}/contact" style="color: #007BFF; text-decoration: none;">Contacter le support</a></p>
          </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          Cryptoelectro-au — Australia's Premium Electronics Marketplace
        </p>
      </div>
    `,
  });
}

// ============ ORDER EXPIRED — ADMIN ============
export async function sendOrderExpiredAdminEmail(
  to: string,
  data: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    expiredAt: string;
    paymentMethod: string;
    cryptoCurrency?: string | null;
  }
) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 6px 8px; border-bottom: 1px solid #333;">${item.name}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #333; text-align: center;">${item.quantity}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #333; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"Cryptoelectro-au" <${process.env.GMAIL_USER}>`,
    to,
    subject: `[EXPIRÉE] Commande #${data.orderNumber} — Non payée — ${data.customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0A0A0A;">
        <div style="background: #FFC107; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #000; margin: 0; font-size: 24px;">⚠️ Commande expirée</h1>
          <p style="color: rgba(0,0,0,0.7); margin: 5px 0 0;">Administration — Cryptoelectro-au</p>
        </div>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 0 0 8px 8px; color: #F0F0F0;">
          <div style="background: #3D2E00; border-left: 4px solid #FFC107; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: bold; color: #FFC107;">Commande #${data.orderNumber}</p>
            <p style="margin: 4px 0 0; font-size: 14px;">Statut : <strong style="color: #DC3545;">ANNULÉE</strong> — Délai de paiement dépassé</p>
          </div>
          
          <h3 style="border-bottom: 2px solid #FFC107; padding-bottom: 8px; color: #FFC107;">Détails</h3>
          <table style="width: 100%; border-collapse: collapse; color: #F0F0F0;">
            ${itemsHtml}
          </table>
          
          <div style="margin-top: 16px; background: #2C2C2C; padding: 12px; border-radius: 6px;">
            <p style="margin: 2px 0;"><strong>Client :</strong> ${data.customerName} (${data.customerEmail})</p>
            <p style="margin: 2px 0;"><strong>Total :</strong> $${data.total.toFixed(2)}</p>
            <p style="margin: 2px 0;"><strong>Paiement :</strong> ${data.paymentMethod === "crypto" ? data.cryptoCurrency || "Crypto" : "Card/PayPal"}</p>
            <p style="margin: 2px 0;"><strong>Expirée le :</strong> ${new Date(data.expiredAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #333;">
            <p style="font-size: 12px; color: #999;">📊 <a href="${SITE_URL}/admin/orders" style="color: #007BFF;">Voir toutes les commandes</a></p>
          </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          Cryptoelectro-au — Administration
        </p>
      </div>
    `,
  });
}