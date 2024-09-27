import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_ID_COOKIE = "cinewraxSessionId";
const SESSION_ID_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export function getSessionId(): string {
  const cookiesStore = cookies();
  const sessionId = cookiesStore.get(SESSION_ID_COOKIE);

  if (!sessionId) {
    throw new Error("The session should be initialized.");
  }

  return sessionId.value;
}

export function initSessionId(request: NextRequest, response: NextResponse) {
  const cookieStore = request.cookies;

  if (!cookieStore.has(SESSION_ID_COOKIE)) {
    const sessionId = uuidv4();

    response.cookies.set(SESSION_ID_COOKIE, sessionId, {
      maxAge: SESSION_ID_COOKIE_MAX_AGE,
    });
  }
}
