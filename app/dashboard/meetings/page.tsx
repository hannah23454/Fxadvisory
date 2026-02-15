"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Calendar, Clock, Loader2, Video, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default function MeetingsPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [meetings, setMeetings] = useState<any[]>([])
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '15min-consult' as '15min-consult' | 'pricing' | 'loom-meeting',
    requestedDate: '',
    requestedTime: '',
    reason: '',
    notes: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const requestedDateTime = new Date(`${formData.requestedDate}T${formData.requestedTime}`)
      
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          requestedDate: requestedDateTime,
          notes: `${formData.reason}\n\n${formData.notes}`
        })
      })

      if (res.ok) {
        toast.success('Meeting request submitted successfully')
        setFormData({
          type: '15min-consult',
          requestedDate: '',
          requestedTime: '',
          reason: '',
          notes: ''
        })
        setShowRequestForm(false)
        loadMeetings()
      } else {
        toast.error('Failed to submit meeting request')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('An error occurred')
    }
    setSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'cancelled':
        return <XCircle className="w-5 h-5" />
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case '15min-consult':
        return '15-Minute Consultation'
      case 'pricing':
        return 'Pricing Discussion'
      case 'loom-meeting':
        return 'Loom Video Meeting'
      default:
        return type
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
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#12261f] mb-2">
            Meetings & Consultations
          </h1>
          <p className="text-[#4a5a55]">
            Schedule and manage your meetings with FX advisors
          </p>
        </div>
        <Button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Request Meeting
        </Button>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <Card className="p-6 border-[#2D6A4F] border-2">
          <h3 className="text-lg font-semibold text-[#12261f] mb-4">
            Request a Meeting
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Meeting Type *</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="mt-1 w-full px-3 py-2 border border-[#DCE5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                required
              >
                <option value="15min-consult">15-Minute Consultation (Quick Questions)</option>
                <option value="pricing">Pricing Discussion (Get a Quote)</option>
                <option value="loom-meeting">Loom Video Meeting (Detailed Discussion)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestedDate">Preferred Date *</Label>
                <Input
                  id="requestedDate"
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="requestedTime">Preferred Time *</Label>
                <Input
                  id="requestedTime"
                  type="time"
                  value={formData.requestedTime}
                  onChange={(e) => setFormData({ ...formData, requestedTime: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Meeting Reason *</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., Discuss hedging strategy for EUR exposure"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any specific topics or questions you'd like to discuss..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRequestForm(false)}
                className="border-[#DCE5E1]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Meetings List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#12261f]">
          Your Meetings
        </h2>
        
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <Card key={meeting._id} className="p-6 border-[#DCE5E1]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${getStatusColor(meeting.status)}`}>
                      {getStatusIcon(meeting.status)}
                      <span className="text-sm font-medium capitalize">{meeting.status}</span>
                    </div>
                    <span className="text-sm px-3 py-1 rounded-full bg-[#E8EEEB] text-[#2D6A4F]">
                      {getMeetingTypeLabel(meeting.type)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[#4a5a55] mb-1">Requested Date & Time</p>
                      <div className="flex items-center gap-2 text-[#12261f]">
                        <Calendar className="w-4 h-4 text-[#2D6A4F]" />
                        <span className="font-medium">
                          {meeting.requestedDate 
                            ? new Date(meeting.requestedDate).toLocaleDateString('en-AU', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'To be scheduled'}
                        </span>
                      </div>
                      {meeting.requestedDate && (
                        <div className="flex items-center gap-2 text-[#12261f] mt-1">
                          <Clock className="w-4 h-4 text-[#2D6A4F]" />
                          <span>
                            {new Date(meeting.requestedDate).toLocaleTimeString('en-AU', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {meeting.confirmedDate && (
                      <div>
                        <p className="text-xs text-[#4a5a55] mb-1">Confirmed Date & Time</p>
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">
                            {new Date(meeting.confirmedDate).toLocaleDateString('en-AU', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {meeting.notes && (
                    <div className="mb-4">
                      <p className="text-xs text-[#4a5a55] mb-1">Notes</p>
                      <p className="text-sm text-[#12261f] whitespace-pre-wrap">{meeting.notes}</p>
                    </div>
                  )}

                  {meeting.meetingLink && meeting.status === 'confirmed' && (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900 mb-1">
                            Meeting Link Ready
                          </p>
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-700 hover:text-green-800 underline"
                          >
                            {meeting.meetingLink}
                          </a>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => window.open(meeting.meetingLink, '_blank')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Join Meeting
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#DCE5E1]">
                    <span className="text-xs text-[#4a5a55]">
                      Requested: {new Date(meeting.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 border-[#DCE5E1] text-center">
            <Calendar className="w-16 h-16 text-[#4a5a55] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-[#12261f] mb-2">
              No meetings scheduled
            </h3>
            <p className="text-[#4a5a55] mb-4">
              Request a meeting with your FX advisor to get started
            </p>
            <Button
              onClick={() => setShowRequestForm(true)}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Request Your First Meeting
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
