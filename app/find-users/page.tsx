"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { UserProfile } from "@/lib/store/slices/user-slice"

// Mock data
const mockUsers: UserProfile[] = [
  { id: "1", name: "Alice Johnson", username: "alice", email: "alice@example.com", isOnline: true },
  {
    id: "2",
    name: "Bob Smith",
    username: "bobsmith",
    email: "bob@example.com",
    isOnline: false,
    lastSeen: "2 hours ago",
  },
  { id: "3", name: "Carol Davis", username: "carol_d", email: "carol@example.com", isOnline: true },
  {
    id: "4",
    name: "David Wilson",
    username: "davidw",
    email: "david@example.com",
    isOnline: false,
    lastSeen: "Yesterday",
  },
  { id: "5", name: "Emma Brown", username: "emmab", email: "emma@example.com", isOnline: true },
]

export default function FindUsersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      setIsSearching(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Find Users</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-6">
        {/* Search */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-2">
          {searchQuery.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Start typing to search for users</p>
            </motion.div>
          ) : filteredUsers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground">No users found for &quot;{searchQuery}&quot;</p>
            </motion.div>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <Link href={`/user/${user.username}`} className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    {!user.isOnline && user.lastSeen && (
                      <p className="text-xs text-muted-foreground">Last seen {user.lastSeen}</p>
                    )}
                  </div>
                </Link>
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" asChild>
                    <Link href={`/chat?user=${user.username}`}>
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
