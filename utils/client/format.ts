import { JSX } from "react";

export function formatPrice(price: number): string {
  return price
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace("IDR", "Rp");
}

/**
 * Formats text for use in image placeholders by splitting it into lines by words
 * @param text The text to format
 * @param maxWordsPerLine Maximum number of words per line (default: 2)
 * @param maxLines Maximum number of lines to show (default: 3)
 * @returns Formatted text with line breaks
 */
export function formatTextForPlaceholder(
  text: string | JSX.Element | null | undefined,
  maxWordsPerLine: number = 2,
  maxLines: number = 3
): string {
  // Handle null, undefined, or JSX elements
  if (!text) return "";

  // If text is a JSX element, try to extract a string representation
  // or return a default placeholder
  if (typeof text !== "string") {
    try {
      // Try to get a string representation if possible
      const stringText = String(text);
      if (stringText === "[object Object]") {
        return "Menu Item"; // Default fallback for JSX elements
      }
      text = stringText;
    } catch (e) {
      return "Menu Item"; // Default fallback if conversion fails
    }
  }

  // Split the text into words
  const words = text.trim().split(/\s+/);

  // Group words into lines
  const lines: string[] = [];
  for (
    let i = 0;
    i < words.length && lines.length < maxLines;
    i += maxWordsPerLine
  ) {
    const lineWords = words.slice(i, i + maxWordsPerLine);
    lines.push(lineWords.join(" "));
  }

  // If there are more words than we can show, add ellipsis to the last line
  if (words.length > maxWordsPerLine * maxLines) {
    lines[lines.length - 1] = lines[lines.length - 1] + "...";
  }

  return lines.join("\n");
}
