/**
 * Copies text to clipboard with fallback for mobile devices
 * @param text The text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  // Check if running on mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    
    // Select and copy the text
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy text:', err);
      throw err;
    }
    
    // Clean up
    document.body.removeChild(tempInput);
  } else {
    // Use clipboard API for desktop
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
      throw err;
    }
  }
}; 