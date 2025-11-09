export interface User {
  id: string
  name: string
  username: string
  email: string
  phone?: string
  phoneNumber?: string
  countryCode?: string
  avatar?: string
  profilePicture?: string
  role?: string
  country?: string
  interests?: string[]
  portfolio?: string
  facebook?: string
  instagram?: string
  discord?: string
  twitter?: string
  bio?: string
  profileView?: number
  projects?: number
  contributions?: number
  isVerified?: boolean
  isActive?: boolean
  isOnline?: boolean
  blocked?: boolean
}

export interface SignUpData {
  name: string
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  username: string
  password: string
  rememberMe?: boolean
}

export interface OTPData {
  phone: string
  otp: string
}

