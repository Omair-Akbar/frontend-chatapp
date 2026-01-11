import apiInstance from "./axios-instance"

export interface RegisterRequest {
  name: string
  username: string
  email: string
  password: string
  phoneNumber: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyResetOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  newPassword: string
  confirmPassword: string
}

export interface User {
  _id: string
  name: string
  username: string
  email: string
  phoneNumber: string
  phoneVisibility: string
  avatar: string | null
  lastSeen: string
  timezone: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  message: string
  user?: User
  userData?: User
}

export interface PasswordResponse {
  message: string
}

// Register user - sends OTP to email
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiInstance.post<AuthResponse>("/user/register", data)
  return response.data
}

// Verify OTP and create account
export const verifyOtp = async (data: VerifyOtpRequest): Promise<{ message: string; user: User }> => {
  const response = await apiInstance.post<{ message: string; user: User }>("/user/verify", data)
  return response.data
}

// Login user
export const loginUser = async (data: LoginRequest): Promise<{ message: string; userData: User }> => {
  const response = await apiInstance.post<{ message: string; userData: User }>("/user/login", data)
  return response.data
}

// Get current user
export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await apiInstance.get<{ user: User }>("/user/me")
  return response.data
}

// Logout user
export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await apiInstance.get<{ message: string }>("/user/logout")
  return response.data
}

/**
 * Change password for authenticated user
 * @param data - Current password and new password
 * @returns Success message
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<PasswordResponse> => {
  const response = await apiInstance.post<PasswordResponse>("/user/change-password", data)
  return response.data
}

/**
 * Request password reset - sends OTP to email
 * @param data - User email address
 * @returns Success message with OTP expiry info
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<PasswordResponse> => {
  const response = await apiInstance.post<PasswordResponse>("/user/forgot-password", data)
  return response.data
}

/**
 * Verify OTP for password reset
 * @param data - Email and OTP code
 * @returns Success message
 */
export const verifyResetOtp = async (data: VerifyResetOtpRequest): Promise<PasswordResponse> => {
  const response = await apiInstance.post<PasswordResponse>("/user/verify-reset-otp", data)
  return response.data
}

/**
 * Reset password after OTP verification
 * @param data - New password and confirmation
 * @returns Success message
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<PasswordResponse> => {
  const response = await apiInstance.post<PasswordResponse>("/user/reset-password", data)
  return response.data
}

export default apiInstance
