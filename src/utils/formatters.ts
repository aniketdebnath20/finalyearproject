/**
 * Format and utility functions for consistent presentation across the university portal.
 */

/**
 * Truncates an email address for compact tabular and card displays.
 * Format example:
 *   "alexander.wright@student.university.edu" -> "alexander.wright@student. ..."
 *
 * @param email The email string to truncate
 * @param maxLength The character cutoff before appending " ..." (default: 24)
 * @returns Truncated email with ellipsis if length exceeds maxLength, or original email
 */
export const truncateEmail = (email?: string | null, maxLength: number = 24): string => {
  if (!email) return '';
  const trimmed = email.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)} ...` : trimmed;
};

/**
 * Returns a dynamic greeting based on current local time of day.
 * - 04:00 to 11:59: "Good morning"
 * - 12:00 to 16:59: "Good afternoon"
 * - 17:00 to 03:59: "Good evening"
 */
export const getTimeGreeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour >= 4 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
};
