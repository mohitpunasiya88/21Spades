export interface User {
  id: string
  name: string
  username: string
  email: string
  phone?: string
  avatar?: string
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

