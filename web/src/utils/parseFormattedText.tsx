import React from 'react';

/**
 * Parse Markdown-style formatting into React elements.
 * Supports:
 *   **bold**  → <strong>
 *   *italic*  → <em>
 *   __underline__ → <u>
 *
 * Handles newlines as <br />.
 * Returns an array of React nodes.
 */
export function parseFormattedText(text: string): React.ReactNode[] {
  // Split by newlines first, then parse inline formatting on each line
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
 * Parse inline formatting for a single line of text.
 * Order of matching: bold (**), underline (__), italic (*).
 */
function parseInline(text: string, lineKey: number): React.ReactNode[] {
  // Regex matches **bold**, __underline__, *italic* in order.
  // Bold before italic to avoid conflict with single *.
  const regex = /(\*\*(.+?)\*\*)|(__(.+?)__)|(\*(.+?)\*)/g;

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
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
