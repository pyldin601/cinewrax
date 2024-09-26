"use client";

import { useSessionId } from "../../hooks/useSessionId";

export default function Convert() {
  const sessionId = useSessionId();

  return <div>Session: {sessionId}</div>;
}
