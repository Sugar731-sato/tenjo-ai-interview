import "server-only";

/**
 * 内部API route（自己呼び出し）の認証を検証する。
 * REVALIDATE_SECRET を Bearer token として照合する。
 */
export function verifyInternalAuth(request: Request): void {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    throw new Error("REVALIDATE_SECRET is not configured");
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    throw new Error("Unauthorized: Invalid bearer token");
  }
}
