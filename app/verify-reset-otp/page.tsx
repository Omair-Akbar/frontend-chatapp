"use client"

import { AuthLayout } from "@/components/layout/auth-layout"
import { VerifyResetOtpForm } from "@/components/auth/verify-reset-otp-form"

export default function VerifyResetOtpPage() {
  return (
    <AuthLayout title="Verify reset code" subtitle="Enter the 6-digit code we sent to your email">
      <VerifyResetOtpForm />
    </AuthLayout>
  )
}
