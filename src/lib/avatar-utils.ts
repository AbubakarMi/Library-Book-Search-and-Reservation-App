/**
 * Avatar utilities for generating initials and managing profile pictures
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
 * Get avatar props for a user
 */
export function getAvatarProps(user: { name?: string; profilePicture?: string; avatarUrl?: string }) {
  const initials = getInitials(user.name || 'User');
  const backgroundColor = getAvatarColor(user.name || 'User');
  const imageUrl = user.profilePicture || user.avatarUrl;

  return {
    initials,
    backgroundColor,
    imageUrl,
    hasImage: !!imageUrl
  };
}

/**
 * Validate image file for upload
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, or WebP)'
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB'
    };
  }

  return { isValid: true };
}

/**
 * Compress image file with better mobile support
 */
export function compressImage(file: File, maxSizeKB: number = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if we're on a browser that supports canvas
    if (typeof document === 'undefined' || !document.createElement) {
      // Fallback: just convert to base64 without compression
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Add timeout for mobile devices
    const timeout = setTimeout(() => {
      reject(new Error('Image processing timeout'));
    }, 10000);

    img.onload = () => {
      clearTimeout(timeout);

      try {
        // Calculate new dimensions to maintain aspect ratio
        const maxWidth = 300; // Reduced for mobile
        const maxHeight = 300;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Check if context is available
        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        // Draw and compress with error handling
        ctx.drawImage(img, 0, 0, width, height);

        // Start with moderate quality for mobile devices
        let quality = 0.7;
        let dataUrl: string;

        try {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        } catch (error) {
          // Fallback to PNG if JPEG fails
          dataUrl = canvas.toDataURL('image/png');
        }

        // Reduce quality until we get under the target size (max 3 iterations for mobile)
        let iterations = 0;
        while (dataUrl.length > maxSizeKB * 1024 * 1.33 && quality > 0.3 && iterations < 3) {
          quality -= 0.2;
          try {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          } catch (error) {
            break; // Stop if we can't compress further
          }
          iterations++;
        }

        // Clean up
        URL.revokeObjectURL(img.src);
        resolve(dataUrl);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the file with error handling
    try {
      img.src = URL.createObjectURL(file);
    } catch (error) {
      clearTimeout(timeout);
      reject(new Error('Failed to create object URL'));
    }
  });
}