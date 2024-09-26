import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SESSION_ID_KEY = "cinewrax-session";

export function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    setSessionId(sessionId);
  }, []);

  return sessionId;
}
