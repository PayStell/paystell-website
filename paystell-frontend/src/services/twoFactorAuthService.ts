/**
 * Enables Two-Factor Authentication for the current user
 * Endpoint: /api/auth/enable-2fa (POST)
 * @returns Promise with QR code URL and secret
 */
export const enableTwoFactorAuth = async (): Promise<{ qrCode: string, secret: string }> => {
  try {
    // No authentication required for 2FA setup as per requirements
    const response = await fetch('/api/auth/enable-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enable 2FA');
    }
    
    const data = await response.json();
    return {
      qrCode: data.qrCode,
      secret: data.secret
    };
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    throw error;
  }
};

/**
 * Verifies the 2FA token during the initial setup process
 * Endpoint: /api/auth/verify-2fa-setup (POST)
 * 
 * @param token The 6-digit verification code
 * @param secret The secret provided during the enable-2fa step
 * @returns Promise resolving to success status
 */
export const verifyTwoFactorSetup = async (token: string, secret: string): Promise<boolean> => {
  try {
    // No authentication required for 2FA setup verification as per requirements
    const response = await fetch('/api/auth/verify-2fa-setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, secret })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify 2FA code');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error verifying 2FA setup:', error);
    throw error;
  }
};

/**
 * Verifies the 2FA token provided by the user during login
 * Endpoint: /api/auth/login-2fa (POST)
 * 
 * @param token The 6-digit verification code
 * @returns Promise resolving to success status
 */
export const verifyTwoFactorCode = async (token: string): Promise<boolean> => {
  try {
    const authToken = localStorage.getItem('token');
    
    if (!authToken) {
      throw new Error('Authentication required');
    }
    
    // This endpoint is specifically for verifying during login process
    const response = await fetch('/api/auth/login-2fa', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify 2FA code');
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    throw error;
  }
};

/**
 * Requests a new 2FA setup (regenerates QR code)
 * This is essentially the same as enableTwoFactorAuth but named differently for UX clarity
 */
export const resendTwoFactorCode = async (): Promise<{ qrCode: string, secret: string }> => {
  try {
    // This is the same as enabling 2FA again - it will regenerate the QR code
    return await enableTwoFactorAuth();
  } catch (error) {
    console.error('Error resending 2FA code:', error);
    throw error;
  }
};

/**
 * Disables Two-Factor Authentication for the current user
 * Endpoint: /api/auth/disable-2fa (POST)
 * @returns Promise resolving to success status
 */
export const disableTwoFactorAuth = async (): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch('/api/auth/disable-2fa', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to disable 2FA');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    throw error;
  }
};