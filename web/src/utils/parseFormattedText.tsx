import React from 'react';
import { Emoji, EmojiStyle } from 'emoji-picker-react';

/**
 * Helper to convert a native emoji character to its unified hex string.
 * e.g., 😀 -> 1f600
 */
function charToUnified(char: string): string {
  return Array.from(char)
    .map((c) => c.codePointAt(0)!.toString(16))
    .join('-');
}

/**
 * Parse Markdown-style formatting and Emojis into React elements.
 * Supports:
 *   **bold**  → <strong>
 *   *italic*  → <em>
 *   __underline__ → <u>
 *   Emojis    → <Emoji /> (Apple style)
 */
export function parseFormattedText(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      result.push(<br key={`br-${lineIndex}`} />);
    }
    result.push(...parseInline(line, lineIndex));
  });

  return result;
}

/**
 * Parse inline formatting and emojis for a single line of text.
 */
function parseInline(text: string, lineKey: number): React.ReactNode[] {
  // Regex matches:
  // 1-2: **bold**
  // 3-4: __underline__
  // 5-6: *italic*
  // 7:   Emoji characters (using unicode property escapes)
  const regex = /(\*\*(.+?)\*\*)|(__(.+?)__)|(\*(.+?)\*)|(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyCounter = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add preceding plain text
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    const key = `${lineKey}-${keyCounter++}`;

    if (match[1]) {
      // Bold: **text**
      result.push(<strong key={key}>{match[2]}</strong>);
    } else if (match[3]) {
      // Underline: __text__
      result.push(<u key={key}>{match[4]}</u>);
    } else if (match[5]) {
      // Italic: *text*
      result.push(<em key={key}>{match[6]}</em>);
    } else if (match[7]) {
      // Emoji character
      const unified = charToUnified(match[7]);
      result.push(
        <span key={key} className="inline-block align-middle mx-px transform translate-y-[-1px]">
          <Emoji unified={unified} emojiStyle={EmojiStyle.APPLE} size={20} />
        </span>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
