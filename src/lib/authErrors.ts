/**
 * Utility to parse Firebase Authentication errors and return user-friendly messages
 * suitable for direct UI display.
 */

export function getFirebaseAuthErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred during authentication. Please try again.';
  }

  const errObj = error as { code?: string; message?: string };
  const code = (errObj.code || '').toLowerCase();
  const rawMessage = (errObj.message || '').toLowerCase();

  // Invalid email or password (modern Firebase Auth uses 'auth/invalid-credential')
  if (
    code.includes('invalid-credential') ||
    rawMessage.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    rawMessage.includes('wrong-password') ||
    code.includes('user-not-found') ||
    rawMessage.includes('user-not-found') ||
    code.includes('invalid-login-credentials') ||
    rawMessage.includes('invalid-login-credentials')
  ) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }

  // Account already exists
  if (
    code.includes('email-already-in-use') ||
    rawMessage.includes('email-already-in-use')
  ) {
    return 'This email address is already registered. Please sign in instead.';
  }

  // Invalid email syntax
  if (
    code.includes('invalid-email') ||
    rawMessage.includes('invalid-email')
  ) {
    return 'Please enter a valid email address.';
  }

  // Weak password
  if (
    code.includes('weak-password') ||
    rawMessage.includes('weak-password')
  ) {
    return 'Password is too weak. Please use at least 6 characters with a combination of letters and numbers.';
  }

  // Rate limiting / brute force guard
  if (
    code.includes('too-many-requests') ||
    rawMessage.includes('too-many-requests')
  ) {
    return 'Access to this account has been temporarily disabled due to multiple failed login attempts. Please wait a few moments or reset your password.';
  }

  // Disabled user account
  if (
    code.includes('user-disabled') ||
    rawMessage.includes('user-disabled')
  ) {
    return 'This account has been suspended or deactivated. Please contact your mission administrator.';
  }

  // Connectivity issues
  if (
    code.includes('network-request-failed') ||
    rawMessage.includes('network-request-failed')
  ) {
    return 'Network connection failure. Please check your internet connection and try again.';
  }

  // Popup closed before completing flow
  if (
    code.includes('popup-closed-by-user') ||
    rawMessage.includes('popup-closed-by-user')
  ) {
    return 'The sign-in popup was closed before completing authentication.';
  }

  // Popup blocked by browser
  if (
    code.includes('popup-blocked') ||
    rawMessage.includes('popup-blocked')
  ) {
    return 'The sign-in window was blocked by your browser. Please enable popups for this site and try again.';
  }

  // Auth provider disabled
  if (
    code.includes('operation-not-allowed') ||
    rawMessage.includes('operation-not-allowed')
  ) {
    return 'This sign-in method is currently disabled. Please contact your administrator.';
  }

  // If a standard clean error string is present
  if (typeof errObj.message === 'string' && errObj.message.trim()) {
    const match = errObj.message.match(/auth\/([a-z0-9-]+)/i);
    if (match && match[1]) {
      const authKey = match[1].toLowerCase();
      if (
        authKey.includes('invalid-credential') ||
        authKey.includes('wrong-password') ||
        authKey.includes('user-not-found')
      ) {
        return 'Invalid email or password. Please verify your credentials and try again.';
      }
      return `Authentication failed: ${authKey.replace(/-/g, ' ')}. Please try again.`;
    }
    if (!errObj.message.startsWith('Firebase:')) {
      return errObj.message;
    }
  }

  return 'Authentication failed. Please check your information and try again.';
}
