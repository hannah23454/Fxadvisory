"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Calendar, Clock, Loader2, Video, CheckCircle2, XCircle, AlertCircle, User, Mail } from "lucide-react"

export default function AdminMeetingsPage() {
  const [loading, setLoading] = useState(true)
  const [meetings, setMeetings] = useState<any[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [actionForm, setActionForm] = useState({
    action: '' as 'confirm' | 'cancel' | '',
    confirmedDate: '',
    confirmedTime: '',
    meetingLink: '',
    adminNotes: ''
  })

  useEffect(() => {
    loadMeetings()
  }, [])

  const loadMeetings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (res.ok) {
        const data = await res.json()
        setMeetings(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading meetings:', error)
      setLoading(false)
    }
  }

  const handleAction = async (meetingId: string, action: 'confirm' | 'cancel') => {
    if (action === 'confirm' && !actionForm.meetingLink) {
      toast.error('Please provide a meeting link')
      return
    }

    try {
      const updates: any = {
        status: action === 'confirm' ? 'confirmed' : 'cancelled'
      }

      if (action === 'confirm') {
        if (actionForm.confirmedDate && actionForm.confirmedTime) {
          updates.confirmedDate = new Date(`${actionForm.confirmedDate}T${actionForm.confirmedTime}`)
        }
        updates.meetingLink = actionForm.meetingLink
        if (actionForm.adminNotes) {
          updates.notes = (selectedMeeting?.notes || '') + '\n\nAdmin Notes: ' + actionForm.adminNotes
        }
      } else {
        if (actionForm.adminNotes) {
          updates.notes = (selectedMeeting?.notes || '') + '\n\nCancellation Reason: ' + actionForm.adminNotes
        }
      }

      const res = await fetch(`/api/bookings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: meetingId, updates })
      })

      if (res.ok) {
        toast.success(`Meeting ${action === 'confirm' ? 'confirmed' : 'cancelled'} successfully`)
        setSelectedMeeting(null)
        setActionForm({
          action: '',
          confirmedDate: '',
          confirmedTime: '',
          meetingLink: '',
          adminNotes: ''
        })
        loadMeetings()
      } else {
        toast.error('Failed to update meeting')
      }
    } catch (error) {
      console.error('Action error:', error)
      toast.error('An error occurred')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case '15min-consult':
        return '15-Min Consultation'
      case 'pricing':
        return 'Pricing Discussion'
      case 'loom-meeting':
        return 'Loom Meeting'
      default:
        return type
    }
  }

  const pendingMeetings = meetings.filter(m => m.status === 'pending')
  const upcomingMeetings = meetings.filter(m => m.status === 'confirmed')
  const pastMeetings = meetings.filter(m => ['cancelled', 'completed'].includes(m.status))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-[#12261f] mb-2">
          Meeting Management
        </h1>
        <p className="text-[#4a5a55]">
          Review and manage client meeting requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-900">{pendingMeetings.length}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </Card>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-green-900">{upcomingMeetings.length}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-900">
                {meetings.filter(m => m.status === 'completed').length}
              </p>
            </div>
            <Video className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-900">
                {meetings.filter(m => m.status === 'cancelled').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingMeetings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#12261f] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Pending Requests ({pendingMeetings.length})
          </h2>
          
          {pendingMeetings.map((meeting) => (
            <Card key={meeting._id} className="p-6 border-2 border-amber-200">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status.toUpperCase()}
                      </span>
                      <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        {getMeetingTypeLabel(meeting.type)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Client Information</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#2D6A4F]" />
                            <span className="text-sm font-medium">{meeting.userName || 'Unknown User'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#2D6A4F]" />
                            <span className="text-sm">{meeting.userEmail || 'No email'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Requested Date & Time</p>
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4 text-[#2D6A4F]" />
                          <span className="font-medium">
                            {meeting.requestedDate 
                              ? new Date(meeting.requestedDate).toLocaleDateString('en-AU', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Flexible'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {meeting.notes && (
                      <div className="mb-4 p-3 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Client Notes</p>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{meeting.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedMeeting?._id === meeting._id ? (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="confirmedDate">Confirmed Date</Label>
                        <Input
                          id="confirmedDate"
                          type="date"
                          value={actionForm.confirmedDate}
                          onChange={(e) => setActionForm({ ...actionForm, confirmedDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmedTime">Confirmed Time</Label>
                        <Input
                          id="confirmedTime"
                          type="time"
                          value={actionForm.confirmedTime}
                          onChange={(e) => setActionForm({ ...actionForm, confirmedTime: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="meetingLink">Meeting Link *</Label>
                      <Input
                        id="meetingLink"
                        type="url"
                        value={actionForm.meetingLink}
                        onChange={(e) => setActionForm({ ...actionForm, meetingLink: e.target.value })}
                        placeholder="https://meet.google.com/xxx-yyyy-zzz or https://zoom.us/j/123456789"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminNotes">Admin Notes (optional)</Label>
                      <Textarea
                        id="adminNotes"
                        value={actionForm.adminNotes}
                        onChange={(e) => setActionForm({ ...actionForm, adminNotes: e.target.value })}
                        placeholder="Any additional information for the client..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleAction(meeting._id, 'confirm')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirm Meeting
                      </Button>
                      <Button
                        onClick={() => handleAction(meeting._id, 'cancel')}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Request
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedMeeting(null)
                          setActionForm({ action: '', confirmedDate: '', confirmedTime: '', meetingLink: '', adminNotes: '' })
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <Button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                    >
                      Review & Respond
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upcoming Confirmed Meetings */}
      {upcomingMeetings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#12261f] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Confirmed Meetings ({upcomingMeetings.length})
          </h2>
          
          {upcomingMeetings.map((meeting) => (
            <Card key={meeting._id} className="p-6 border-2 border-green-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status.toUpperCase()}
                    </span>
                    <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {getMeetingTypeLabel(meeting.type)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Client</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#2D6A4F]" />
                        <span className="text-sm font-medium">{meeting.userName || 'Unknown'}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Confirmed Date & Time</p>
                      <div className="flex items-center gap-2 text-green-700">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {meeting.confirmedDate 
                            ? new Date(meeting.confirmedDate).toLocaleDateString('en-AU', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'TBD'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Meeting Link</p>
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                      >
                        <Video className="w-4 h-4" />
                        Join Link
                      </a>
                    </div>
                  </div>

                  {meeting.notes && (
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{meeting.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <details className="space-y-4">
          <summary className="text-xl font-semibold text-[#12261f] cursor-pointer flex items-center gap-2 mb-4">
            Past Meetings ({pastMeetings.length})
          </summary>
          
          {pastMeetings.map((meeting) => (
            <Card key={meeting._id} className="p-4 border-[#DCE5E1]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status.toUpperCase()}
                    </span>
                    <span className="text-sm">{getMeetingTypeLabel(meeting.type)}</span>
                    <span className="text-sm text-gray-500">• {meeting.userName || 'Unknown'}</span>
                    <span className="text-sm text-gray-500">
                      • {new Date(meeting.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </details>
      )}

      {meetings.length === 0 && (
        <Card className="p-12 border-[#DCE5E1] text-center">
          <Calendar className="w-16 h-16 text-[#4a5a55] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-[#12261f] mb-2">
            No meeting requests yet
          </h3>
          <p className="text-[#4a5a55]">
            Meeting requests from clients will appear here
          </p>
        </Card>
      )}
    </div>
  )
}
