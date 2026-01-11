"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { forgotPassword } from "@/lib/store/slices/auth-slice"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { otpEmail, isLoading } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState(otpEmail || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await dispatch(forgotPassword({ email })).unwrap()
      toast.success("Reset code sent to your email!")
      router.push("/verify-reset-otp")
    } catch (err) {
      toast.error((err as string) || "Failed to send reset code")
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset code">
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Button type="submit" variant="default" className="w-full dark:text-black dark:bg-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset code"
            )}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </motion.div>
      </form>
    </AuthLayout>
  )
}
