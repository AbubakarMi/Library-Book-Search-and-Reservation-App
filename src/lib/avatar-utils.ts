/**
 * Avatar utilities for generating name-based avatar initials and colors
 */

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') {
    return 'U';
  }

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word - take first two characters
    return words[0].substring(0, 2).toUpperCase();
  } else if (words.length === 2) {
    // Two words - take first character of each
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  } else {
    // More than two words - take first character of first and last word
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }
}

/**
 * Generate a background color for avatar based on name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];

  if (!name) {
    return colors[0];
  }

  // Use first character to determine color
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
}

/**
 * Get avatar props for a user - returns initials and color based on name
 */
export function getAvatarProps(user: { name?: string }) {
  const initials = getInitials(user.name || 'User');
  const backgroundColor = getAvatarColor(user.name || 'User');

  return {
    initials,
    backgroundColor,
  };
}