/**
 * Formats a Date object as a 24-hour time string with hours and minutes.
 *
 * @param {Date} date The Date object to format
 * @returns {string} The formatted time string
 */
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour time
  });
}

