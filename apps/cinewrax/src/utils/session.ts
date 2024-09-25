import { v4 as uuidv4 } from "uuid";

const SESSION_ID_KEY = "cinewrax-session";

export function getOrInitSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}
