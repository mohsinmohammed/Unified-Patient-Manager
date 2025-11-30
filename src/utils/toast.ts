/**
 * Toast Notification Utility
 * Provides consistent error and success messaging across the application
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

class ToastManager {
  private toastContainer: HTMLElement | null = null;
  private toastCount = 0;

  private ensureContainer(): HTMLElement {
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toast-container';
      this.toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(this.toastContainer);
    }
    return this.toastContainer;
  }

  private getToastStyles(type: ToastType): string {
    const baseStyles = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md animate-slide-in';
    
    const typeStyles = {
      success: 'bg-green-50 border border-green-200 text-green-800',
      error: 'bg-red-50 border border-red-200 text-red-800',
      warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border border-blue-200 text-blue-800',
    };

    return `${baseStyles} ${typeStyles[type]}`;
  }

  private getIcon(type: ToastType): string {
    const icons = {
      success: `<svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
      error: `<svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
      warning: `<svg class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>`,
      info: `<svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`,
    };

    return icons[type];
  }

  show(options: ToastOptions): void {
    const {
      message,
      type,
      duration = 5000,
    } = options;

    const container = this.ensureContainer();
    const toastId = `toast-${++this.toastCount}`;

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = this.getToastStyles(type);
    toast.innerHTML = `
      ${this.getIcon(type)}
      <p class="flex-1 text-sm font-medium">${message}</p>
      <button 
        onclick="document.getElementById('${toastId}').remove()"
        class="text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;

    container.appendChild(toast);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }
}

// Export singleton instance
export const toast = new ToastManager();

/**
 * Format API error responses into user-friendly messages
 */
export function formatApiError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Common error messages for consistency
 */
export const ErrorMessages = {
  // Authentication errors
  AUTH_REQUIRED: 'You must be logged in to access this page.',
  AUTH_INVALID: 'Invalid email or password.',
  AUTH_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_FORBIDDEN: 'You do not have permission to perform this action.',

  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  TIMEOUT_ERROR: 'The request timed out. Please try again.',

  // Validation errors
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_DATE: 'Please enter a valid date.',
  PASSWORD_WEAK: 'Password must be at least 8 characters long.',
  PASSWORD_MISMATCH: 'Passwords do not match.',

  // Data errors
  NOT_FOUND: 'The requested resource was not found.',
  ALREADY_EXISTS: 'This resource already exists.',
  INVALID_DATA: 'The provided data is invalid.',

  // Payment errors
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  PAYMENT_DECLINED: 'Your payment was declined. Please check your card details.',
  PAYMENT_NETWORK: 'Unable to process payment. Please check your connection.',

  // Generic
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  TRY_AGAIN: 'Something went wrong. Please try again.',
};

/**
 * Add toast animations to global styles
 */
export function initializeToastStyles(): void {
  if (typeof document === 'undefined') return;

  const styleId = 'toast-animations';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }

    .animate-fade-out {
      animation: fade-out 0.3s ease-out;
    }
  `;

  document.head.appendChild(style);
}
