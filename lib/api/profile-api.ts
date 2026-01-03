import apiInstance from "./axios-instance"
import type { User } from "./auth-api"

export interface UpdateProfileRequest {
  name: string
  username: string
  phoneNumber: string
}

export interface ProfileResponse {
  message: string
  user: User
}

export interface SearchUserResponse {
  user: User
}

export interface SearchUserErrorResponse {
  message: string
}

// Update profile (name, username, phone number)
export const updateProfile = async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
  const response = await apiInstance.put<ProfileResponse>("/user/update", data)
  return response.data
}

// Upload avatar
export const uploadAvatar = async (file: File): Promise<ProfileResponse> => {
  const formData = new FormData()
  formData.append("avatar", file)

  const response = await apiInstance.put<ProfileResponse>("/user/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// Delete avatar
export const deleteAvatar = async (): Promise<ProfileResponse> => {
  const response = await apiInstance.delete<ProfileResponse>("/user/update-avatar")
  return response.data
}

export const searchUsers = async (
  query: string,
  type: "email" | "username",
): Promise<SearchUserResponse | SearchUserErrorResponse> => {
  const params = type === "email" ? { email: query } : { username: query }
  const response = await apiInstance.get<SearchUserResponse | SearchUserErrorResponse>("/user/search", { params })
  return response.data
}
