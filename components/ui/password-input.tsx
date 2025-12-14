"use client"

import * as React from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean
}

export function PasswordInput({ className, showStrength = false, value, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const password = typeof value === "string" ? value : ""

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const strength = Object.values(checks).filter(Boolean).length

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-destructive"
    if (strength <= 3) return "bg-muted-foreground"
    if (strength <= 4) return "bg-foreground/60"
    return "bg-success"
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input type={showPassword ? "text" : "password"} className={cn("pr-10", className)} value={value} {...props} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
        </Button>
      </div>
      <AnimatePresence>
        {showStrength && password.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i <= strength ? getStrengthColor() : "bg-muted",
                  )}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <PasswordCheck label="8+ characters" met={checks.length} />
              <PasswordCheck label="Uppercase" met={checks.uppercase} />
              <PasswordCheck label="Lowercase" met={checks.lowercase} />
              <PasswordCheck label="Number" met={checks.number} />
              <PasswordCheck label="Special char" met={checks.special} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {met ? <Check className="h-3 w-3 text-success" /> : <X className="h-3 w-3 text-muted-foreground" />}
      <span className={cn(met ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    </div>
  )
}
