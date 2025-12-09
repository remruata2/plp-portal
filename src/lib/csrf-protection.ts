import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const CSRF_TOKEN_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generate a secure CSRF token
 */
export function generateCsrfToken(): string {
    return randomBytes(32).toString("hex");
}

/**
 * Get or create CSRF token for the current session
 * Call this in server components to set the CSRF cookie
 */
export async function getCsrfToken(): Promise<string> {
    const cookieStore = await cookies();
    let token = cookieStore.get(CSRF_TOKEN_NAME)?.value;

    if (!token) {
        token = generateCsrfToken();
        cookieStore.set(CSRF_TOKEN_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });
    }

    return token;
}

/**
 * Validate CSRF token from request headers against cookie
 * Call this in API routes that handle state-changing operations
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!cookieToken || !headerToken) {
        return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    if (cookieToken.length !== headerToken.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < cookieToken.length; i++) {
        result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
    }

    return result === 0;
}

/**
 * CSRF validation middleware for API routes
 * Returns error response if CSRF validation fails
 */
export async function csrfProtection(
    request: Request
): Promise<Response | null> {
    // Skip CSRF check for safe methods
    const safeMethod = ["GET", "HEAD", "OPTIONS"].includes(request.method);
    if (safeMethod) {
        return null;
    }

    const isValid = await validateCsrfToken(request);
    if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    return null;
}

// Export constants for client-side use
export const CSRF_HEADER = CSRF_HEADER_NAME;
