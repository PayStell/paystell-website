// src/services/email.service.ts
import nodemailer from 'nodemailer';
import { AppError, errorTypes } from '../utils/error-handler';

/**
 * Service for handling email operations in the PayStell application
 */
export class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    // Initialize email transporter with configuration from environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Sends a test email to verify email configuration
   * @param recipient The email address to send test email to
   */
  async sendTestEmail(recipient: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"PayStell" <${process.env.EMAIL_FROM}>`,
        to: recipient,
        subject: 'Test Email from PayStell',
        text: 'If you received this email, your email configuration is working correctly.',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3E7BFA;">PayStell Email Test</h2>
            <p>If you received this email, your email configuration is working correctly.</p>
            <p style="margin-top: 30px;">Best regards,</p>
            <p>The PayStell Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Test email sent to ${recipient}`);
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw new AppError('Failed to send test email', errorTypes.INTERNAL_SERVER);
    }
  }

  /**
   * Sends wallet verification email to user
   * @param email Recipient email
   * @param verificationCode Verification code
   * @param walletAddress Stellar wallet address being verified
   */
  async sendVerificationEmail(
    email: string, 
    verificationCode: string,
    walletAddress: string
  ): Promise<void> {
    try {
      // Mask the wallet address for security in the email
      const maskedAddress = `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
      
      const mailOptions = {
        from: `"PayStell" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Stellar Wallet on PayStell',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3E7BFA;">Verify Your Stellar Wallet</h2>
            <p>Hello,</p>
            <p>We received a request to verify the Stellar wallet <strong>${maskedAddress}</strong> with your PayStell account.</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f4f7ff; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${verificationCode}
            </div>
            <p>This code will expire in 24 hours.</p>
            <p>If you did not request this verification, please ignore this email or contact our support team immediately.</p>
            <p style="margin-top: 30px;">Best regards,</p>
            <p>The PayStell Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new AppError('Failed to send verification email', errorTypes.INTERNAL_SERVER);
    }
  }

  /**
   * Sends confirmation email when wallet is successfully verified
   * @param email Recipient email
   * @param walletAddress Verified wallet address
   */
  async sendVerificationConfirmationEmail(
    email: string,
    walletAddress: string
  ): Promise<void> {
    try {
      // Mask the wallet address for security
      const maskedAddress = `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
      
      const mailOptions = {
        from: `"PayStell" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Stellar Wallet Successfully Verified on PayStell',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3E7BFA;">Wallet Verification Successful</h2>
            <p>Hello,</p>
            <p>We're pleased to inform you that your Stellar wallet <strong>${maskedAddress}</strong> has been successfully verified with your PayStell account.</p>
            <p>You can now use all PayStell features with this wallet.</p>
            <p>If you did not request this verification, please contact our support team immediately.</p>
            <p style="margin-top: 30px;">Best regards,</p>
            <p>The PayStell Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Verification confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send verification confirmation email:', error);
      // We don't throw here because this is not critical for the verification flow
      // Just log the error
    }
  }
}