/**
 * Utility functions for handling image URLs and fallbacks
 */

/**
 * Constructs a full image URL that works in both development and production
 * @param relativePath - The relative path to the image (e.g., "/uploads/image.png")
 * @returns Full URL or null if no path provided
 */
export function getImageUrl(relativePath?: string | null): string | null {
  if (!relativePath) return null;
  
  // If already a full URL (starts with http/https), return as-is
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  
  // For relative paths, construct the full URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  return `${baseUrl}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}

/**
 * Checks if an image URL is likely to be valid
 * @param url - The image URL to validate
 * @returns boolean indicating if URL appears valid
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
  return imageExtensions.test(url) || url.startsWith('data:image/');
}

/**
 * Preloads an image to check if it's accessible
 * @param url - The image URL to preload
 * @returns Promise that resolves if image loads successfully
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}