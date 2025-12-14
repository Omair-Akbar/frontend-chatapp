"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { setUser } from "@/lib/store/slices/auth-slice"
import { Loader2 } from "lucide-react"

export default function VerifyOtpPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { otpEmail } = useAppSelector((state) => state.auth)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    dispatch(
      setUser({
        id: "1",
        name: "Demo User",
        username: "demouser",
        email: otpEmail || "demo@example.com",
        createdAt: new Date().toISOString(),
      }),
    )

    setIsSubmitting(false)
    router.push("/chat")
  }

  const handleResend = () => {
    setResendTimer(60)
    // Trigger resend OTP API call
  }

  return (
    <AuthLayout title="Verify your email" subtitle={`We've sent a 6-digit code to ${otpEmail || "your email"}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2"
        >
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-lg font-semibold"
            />
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Button type="submit" variant="secondary" className="w-full" disabled={isSubmitting || otp.some((d) => !d)}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          {resendTimer > 0 ? (
            <p className="text-sm text-muted-foreground">Resend code in {resendTimer}s</p>
          ) : (
            <Button type="button" variant="ghost" onClick={handleResend}>
              Resend code
            </Button>
          )}
        </motion.div>
      </form>
    </AuthLayout>
  )
}
