"use client";

import { useEffect, useState } from "react";
import { randomChars } from "./helpers";

interface Props {
  value: string;
}

export const Word: React.FC<Props> = ({ value }) => {
  const [frame, setFrame] = useState(0);
  const [word, setWord] = useState("");

  useEffect(() => setFrame(0), [value]);

  useEffect(() => {
    if (frame < value.length * 3) {
      const timeoutId = window.setTimeout(() => setFrame(frame + 1), 100);

      return () => window.clearTimeout(timeoutId);
    }
  }, [frame]);

  useEffect(() => {
    const staticCount = Math.floor(frame / 3);
    const staticPart = value.slice(0, staticCount);
    const randomPart = randomChars(value.length - staticCount);

    setWord(staticPart + randomPart);
  }, [frame]);

  return <>{word}</>;
};
