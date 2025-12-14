"use client"

import type React from "react"

import { useState, useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Edit2, Save, X, AlertCircle, Upload, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { updateProfile, updateAvatar, removeAvatar } from "@/lib/store/slices/auth-slice"

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "Demo User")
  const [username, setUsername] = useState(user?.username || "demouser")
  const [bio, setBio] = useState(user?.bio || "")
  const [isSaving, setIsSaving] = useState(false)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canChangeName = useMemo(() => {
    if (!user?.lastNameChange) return true
    const lastChange = new Date(user.lastNameChange)
    const daysSinceChange = Math.floor((Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceChange >= 14
  }, [user?.lastNameChange])

  const canChangeUsername = useMemo(() => {
    if (!user?.lastUsernameChange) return true
    const lastChange = new Date(user.lastUsernameChange)
    const daysSinceChange = Math.floor((Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceChange >= 14
  }, [user?.lastUsernameChange])

  const daysUntilNameChange = useMemo(() => {
    if (!user?.lastNameChange) return 0
    const lastChange = new Date(user.lastNameChange)
    const daysSinceChange = Math.floor((Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, 14 - daysSinceChange)
  }, [user?.lastNameChange])

  const daysUntilUsernameChange = useMemo(() => {
    if (!user?.lastUsernameChange) return 0
    const lastChange = new Date(user.lastUsernameChange)
    const daysSinceChange = Math.floor((Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, 14 - daysSinceChange)
  }, [user?.lastUsernameChange])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewAvatar(url)
    }
  }

  const handleUploadAvatar = () => {
    if (previewAvatar) {
      dispatch(updateAvatar(previewAvatar))
      setPreviewAvatar(null)
    }
  }

  const handleRemoveAvatar = () => {
    dispatch(removeAvatar())
    setPreviewAvatar(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updates: Record<string, string> = { bio }

    if (canChangeName && name !== user?.name) {
      updates.name = name
      updates.lastNameChange = new Date().toISOString()
    }

    if (canChangeUsername && username !== user?.username) {
      updates.username = username
      updates.lastUsernameChange = new Date().toISOString()
    }

    dispatch(updateProfile(updates))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setName(user?.name || "Demo User")
    setUsername(user?.username || "demouser")
    setBio(user?.bio || "")
    setPreviewAvatar(null)
    setIsEditing(false)
  }

  const displayAvatar = previewAvatar || user?.avatar

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold">My Profile</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-secondary text-secondary-foreground hover:bg-accent"
              >
                <Save className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Avatar section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {displayAvatar && <AvatarImage src={displayAvatar || "/placeholder.svg"} alt={name} />}
                <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Camera className="h-4 w-4" />
                  Set Picture
                </Button>

                {previewAvatar && (
                  <Button variant="secondary" size="sm" onClick={handleUploadAvatar} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                )}

                {(user?.avatar || previewAvatar) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            )}

            {!isEditing && (
              <div className="mt-4 text-center">
                <h1 className="text-xl font-semibold">{name}</h1>
                <p className="text-muted-foreground">@{username}</p>
              </div>
            )}
          </div>

          {/* Profile fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!canChangeName} />
                  {!canChangeName && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      You can change your name again in {daysUntilNameChange} days
                    </p>
                  )}
                </>
              ) : (
                <p className="p-2 rounded-lg bg-secondary text-secondary-foreground">{name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    disabled={!canChangeUsername}
                  />
                  {!canChangeUsername && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      You can change your username again in {daysUntilUsernameChange} days
                    </p>
                  )}
                </>
              ) : (
                <p className="p-2 rounded-lg bg-secondary text-secondary-foreground">@{username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <p className="p-2 rounded-lg bg-secondary text-muted-foreground">{user?.email || "demo@example.com"}</p>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              ) : (
                <p className="p-2 rounded-lg bg-secondary text-secondary-foreground min-h-[80px]">
                  {bio || <span className="text-muted-foreground">No bio yet</span>}
                </p>
              )}
            </div>
          </div>

          {/* Account info */}
          <div className="pt-4 border-t border-border">
            <h2 className="font-semibold mb-4">Account Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "January 2024"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account type</span>
                <span>Free</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
