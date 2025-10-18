/**
 * Type definitions for Oferente Layout Component
 */

export interface MenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly route: string;
  readonly badge?: number;
  readonly ariaLabel?: string;
}

export interface UserInfo {
  readonly name: string;
  readonly email: string;
  readonly avatarUrl?: string;
  readonly role?: string;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'normal' | 'large';
  theme: 'light' | 'dark';
}
