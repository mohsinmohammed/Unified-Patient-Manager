// Environment configuration management
export const config = {
  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // Authentication
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '604800'), // 7 days in seconds

  // Email
  emailFrom: process.env.EMAIL_FROM || 'noreply@unifiedpatientmanager.com',
  emailService: process.env.EMAIL_SERVICE || 'smtp',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',

  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',

  // Encryption
  encryptionKey: process.env.ENCRYPTION_KEY || '',

  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Security
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes

  // Features
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
