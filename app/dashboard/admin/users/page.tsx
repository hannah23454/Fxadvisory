"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Search, UserCheck, UserX, Mail } from "lucide-react"
import { getDatabase } from "@/lib/mongodb"

export default function UsersManagement() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserAccess = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          active: !currentStatus 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      toast.success(`User ${currentStatus ? 'disabled' : 'enabled'} successfully`)
      loadUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user status')
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    const name = user.name?.toLowerCase() || ''
    const email = user.email?.toLowerCase() || ''
    return name.includes(searchLower) || email.includes(searchLower)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#12261f] mb-2">
            User Management
          </h1>
          <p className="text-[#4a5a55]">
            Manage user access and monitor activity
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-[#DCE5E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-[#2D6A4F]" />
            </div>
            <div>
              <p className="text-sm text-[#4a5a55]">Total Users</p>
              <p className="text-2xl font-bold text-[#12261f]">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[#DCE5E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[#4a5a55]">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.active !== false).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[#DCE5E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-[#4a5a55]">Disabled Users</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.active === false).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-[#DCE5E1]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4a5a55]" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users List */}
      <Card className="p-6 border-[#DCE5E1]">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserX className="w-12 h-12 mx-auto text-[#4a5a55] mb-3" />
            <p className="text-[#4a5a55]">
              {searchQuery ? 'No users found matching your search' : 'No users registered yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 rounded-lg border border-[#DCE5E1] hover:border-[#2D6A4F] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-[#2D6A4F]">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#12261f]">{user.name || 'No name'}</h4>
                    <p className="text-sm text-[#4a5a55]">{user.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {user.company && (
                        <span className="text-xs text-[#4a5a55]">
                          {user.company}
                        </span>
                      )}
                      {user.lastLogin && (
                        <span className="text-xs text-[#4a5a55]">
                          Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      )}
                      {user.role === 'admin' && (
                        <span className="text-xs bg-[#2D6A4F] text-white px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user.active !== false ? (
                      <UserCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${user.active !== false ? 'text-green-600' : 'text-red-600'}`}>
                      {user.active !== false ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <Switch
                    checked={user.active !== false}
                    onCheckedChange={(checked) => toggleUserAccess(user._id, user.active !== false)}
                  />
                  <Button variant="ghost" size="sm" title="Send email">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
