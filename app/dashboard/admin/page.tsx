"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, FileText, TrendingUp, MessageSquare, Calendar, Loader2, ArrowUpRight, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalContent: 0,
    totalTrades: 0,
    unreadMessages: 0,
    pendingMeetings: 0,
    confirmedMeetings: 0,
    completedMeetings: 0,
    cancelledMeetings: 0,
    engagementRate: 0,
    userGrowth: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading stats:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#12261f] mb-2">
          Admin Overview
        </h1>
        <p className="text-[#4a5a55]">
          Real-time metrics and platform status
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <Card className="p-6 border-[#DCE5E1] hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] font-medium mb-1">Total Users</p>
              <p className="text-4xl font-bold text-[#12261f] mb-2">{stats.totalUsers}</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>{stats.userGrowth}% growth this month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#2D6A4F]/10">
              <Users className="w-6 h-6 text-[#2D6A4F]" />
            </div>
          </div>
        </Card>

        {/* Active Users */}
        <Card className="p-6 border-[#DCE5E1] hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] font-medium mb-1">Active Users</p>
              <p className="text-4xl font-bold text-[#12261f] mb-2">{stats.activeUsers}</p>
              <div className="flex items-center gap-1 text-[#52796F] text-sm">
                <span>{stats.engagementRate}% engagement rate</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Pending Meetings */}
        <Card className="p-6 border-[#DCE5E1] hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] font-medium mb-1">Pending Meetings</p>
              <p className="text-4xl font-bold text-[#12261f] mb-2">{stats.pendingMeetings}</p>
              <div className="flex items-center gap-1 text-amber-600 text-sm">
                <span>Awaiting approval</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        {/* Content Items */}
        <Card className="p-6 border-[#DCE5E1] hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] font-medium mb-1">Published Content</p>
              <p className="text-4xl font-bold text-[#12261f] mb-2">{stats.totalContent}</p>
              <div className="flex items-center gap-1 text-[#52796F] text-sm">
                <span>Market insights & updates</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* Trade Uploads */}
        <Card className="p-6 border-[#DCE5E1] hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] font-medium mb-1">Trade Uploads</p>
              <p className="text-4xl font-bold text-[#12261f] mb-2">{stats.totalTrades}</p>
              <div className="flex items-center gap-1 text-[#52796F] text-sm">
                <span>All-time submissions</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#A8C5BA]/20">
              <TrendingUp className="w-6 h-6 text-[#2D6A4F]" />
            </div>
          </div>
        </Card>

        {/* Unread Messages */}
        <Card className="p-6 border-[#DCE5E1] hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] font-medium mb-1">Unread Messages</p>
              <p className="text-4xl font-bold text-[#12261f] mb-2">{stats.unreadMessages}</p>
              <div className="flex items-center gap-1 text-[#52796F] text-sm">
                <span>Requiring attention</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-rose-50">
              <MessageSquare className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Confirmed Meetings</p>
              <p className="text-3xl font-bold text-[#12261f]">{stats.confirmedMeetings}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Completed Meetings</p>
              <p className="text-3xl font-bold text-[#12261f]">{stats.completedMeetings}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Cancelled Meetings</p>
              <p className="text-3xl font-bold text-[#12261f]">{stats.cancelledMeetings}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-[#DCE5E1]">
        <h2 className="text-xl font-semibold text-[#12261f] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard/admin/users"
            className="p-4 rounded-lg border border-[#DCE5E1] hover:bg-[#E8EEEB] transition-all text-center group"
          >
            <Users className="w-6 h-6 mx-auto mb-2 text-[#2D6A4F] group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#12261f]">Manage Users</p>
          </a>
          <a
            href="/dashboard/admin/meetings"
            className="p-4 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all text-center group"
          >
            <Calendar className="w-6 h-6 mx-auto mb-2 text-amber-600 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#12261f]">Review Meetings</p>
            {stats.pendingMeetings > 0 && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-xs font-semibold">
                {stats.pendingMeetings} pending
              </span>
            )}
          </a>
          <a
            href="/dashboard/admin/content"
            className="p-4 rounded-lg border border-[#DCE5E1] hover:bg-[#E8EEEB] transition-all text-center group"
          >
            <FileText className="w-6 h-6 mx-auto mb-2 text-[#2D6A4F] group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#12261f]">Create Content</p>
          </a>
          <a
            href="/dashboard/admin/analytics"
            className="p-4 rounded-lg border border-[#DCE5E1] hover:bg-[#E8EEEB] transition-all text-center group"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#2D6A4F] group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-[#12261f]">View Analytics</p>
          </a>
        </div>
      </Card>
    </div>
  )
}

