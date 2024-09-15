"use client";

import { useEffect, useState } from "react";
import { Word } from "./Word";

interface Props {
  wordArray: readonly string[];
}

export const WordCarousel: React.FC<Props> = ({ wordArray }) => {
  const [currWord, setCurrWord] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrWord((currWord) => (currWord + 1) % wordArray.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [wordArray]);

  return <Word value={wordArray[currWord]} />;
};
