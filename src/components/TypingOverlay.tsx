import { useEffect, useMemo, useState } from "react";
import { TYPED_LINES, TYPED_CHAR_DELAY, POST_TYPING_SCENE_DELAY, CURSOR_BLINK_INTERVAL } from "../constants";

type TypingOverlayProps = {
  hasStarted: boolean;
  onTypingComplete: () => void;
  backgroundOpacity: number;
};

export function TypingOverlay({ hasStarted, onTypingComplete, backgroundOpacity }: TypingOverlayProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTypingDone, setIsTypingDone] = useState(false);

  const typingComplete = currentLineIndex >= TYPED_LINES.length;

  useEffect(() => {
    if (!hasStarted) {
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setIsTypingDone(false);
      return;
    }

    if (typingComplete) {
      if (!isTypingDone) {
        const handle = window.setTimeout(() => {
          setIsTypingDone(true);
          onTypingComplete();
        }, POST_TYPING_SCENE_DELAY);
        return () => window.clearTimeout(handle);
      }
      return;
    }

    const currentLine = TYPED_LINES[currentLineIndex] ?? "";
    const handle = window.setTimeout(() => {
      if (currentCharIndex < currentLine.length) {
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        let nextLineIndex = currentLineIndex + 1;
        while (nextLineIndex < TYPED_LINES.length && TYPED_LINES[nextLineIndex].length === 0) {
          nextLineIndex += 1;
        }
        setCurrentLineIndex(nextLineIndex);
        setCurrentCharIndex(0);
      }
    }, TYPED_CHAR_DELAY);
    return () => window.clearTimeout(handle);
  }, [hasStarted, currentLineIndex, currentCharIndex, typingComplete, isTypingDone, onTypingComplete]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), CURSOR_BLINK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const typedLines = useMemo(() => {
    if (!TYPED_LINES.length) return [""];
    return TYPED_LINES.map((line, index) => {
      if (typingComplete || index < currentLineIndex) return line;
      if (index === currentLineIndex) return line.slice(0, currentCharIndex);
      return "";
    });
  }, [currentCharIndex, currentLineIndex, typingComplete]);

  return (
    <div className="background-overlay" style={{ opacity: backgroundOpacity }}>
      <div className="typed-text">
        {typedLines.map((line, index) => {
          const showCursor = cursorVisible && index === currentLineIndex && !isTypingDone;
          return (
            <span className="typed-line" style={{ color: "#ff69b4" }} key={index}>
              {line || "\u00a0"}
              {showCursor && <span className="typed-cursor">_</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}