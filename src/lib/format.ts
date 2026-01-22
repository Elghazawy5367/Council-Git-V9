/**
 * Utility functions for formatting numbers and text
 */

/**
 * Format large numbers with K/M abbreviations
 * @param num - Number to format
 * @returns Formatted string (e.g., 1055 -> "1.1k", 1500000 -> "1.5M")
 */
export const formatCount = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

/**
 * Format currency with appropriate decimal places
 * @param amount - Amount to format
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, decimals: number = 4): string => {
  return `$${amount.toFixed(decimals)}`;
};
