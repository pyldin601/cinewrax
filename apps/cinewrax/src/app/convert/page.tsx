"use client";

import { useSessionId } from "../../hooks/useSessionId";

export default function Convert() {
  const sessionId = useSessionId();

  return (
    <div>
      <div>
        <div>
          <h2>Choose file</h2>
          <input type={"file"} />
        </div>
        <div>
          <h2>Choose format</h2>
          <div>Formats...</div>
        </div>
        <div>
          <h2>Choose bitrate</h2>
          <div>Bitrate...</div>
        </div>
        <div>
          <button>Convert</button>
        </div>
      </div>
    </div>
  );
}
