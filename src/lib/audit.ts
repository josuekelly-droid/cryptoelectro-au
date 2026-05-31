import { prisma } from "@/lib/prisma";

interface AuditData {
  userId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(data: AuditData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        details: data.details || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}

// Fonctions utilitaires pour les actions courantes
export async function logLogin(userId: string, ip?: string, userAgent?: string) {
  await logAudit({ userId, action: "LOGIN", details: "User logged in", ipAddress: ip, userAgent });
}

export async function logLogout(userId: string) {
  await logAudit({ userId, action: "LOGOUT", details: "User logged out" });
}

export async function logRegister(userId: string, ip?: string) {
  await logAudit({ userId, action: "REGISTER", details: "New account created", ipAddress: ip });
}

export async function logPasswordReset(userId: string, ip?: string) {
  await logAudit({ userId, action: "PASSWORD_RESET", details: "Password reset completed", ipAddress: ip });
}

export async function logOrderCreated(userId: string, orderNumber: string) {
  await logAudit({ userId, action: "ORDER_CREATED", details: `Order ${orderNumber} created` });
}

export async function logPaymentReceived(orderNumber: string) {
  await logAudit({ action: "PAYMENT_RECEIVED", details: `Payment confirmed for order ${orderNumber}` });
}

export async function logAdminAction(adminId: string, action: string, details?: string) {
  await logAudit({ userId: adminId, action: `ADMIN_${action}`, details });
}

export async function logFailedLogin(email: string, ip?: string) {
  await logAudit({ action: "FAILED_LOGIN", details: `Failed login attempt for ${email}`, ipAddress: ip });
}

export async function logSecurityEvent(action: string, details?: string, ip?: string) {
  await logAudit({ action: `SECURITY_${action}`, details, ipAddress: ip });
}