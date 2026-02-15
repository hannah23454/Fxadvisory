"use client"

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { MessageSquare, Send, Loader2, Mail, User, Clock, CheckCircle2, Circle, Reply } from "lucide-react"

export default function MessagesPage() {
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState("")
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: ''
  })

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading messages:', error)
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.subject || !newMessage.content) {
      toast.error('Please fill in subject and message')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newMessage.subject,
          message: newMessage.content
        })
      })

      if (res.ok) {
        toast.success('Message sent successfully')
        setNewMessage({ subject: '', content: '' })
        setShowCompose(false)
        loadMessages()
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      console.error('Send message error:', error)
      toast.error('An error occurred')
    }
    setSending(false)
  }

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyText,
          subject: `Re: ${selectedMessage.subject || 'Your message'}`
        })
      })

      if (res.ok) {
        toast.success('Reply sent successfully')
        setReplyText("")
        
        // Mark original message as read
        await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: messageId, read: true })
        })
        
        loadMessages()
        setSelectedMessage(null)
      } else {
        toast.error('Failed to send reply')
      }
    } catch (error) {
      console.error('Reply error:', error)
      toast.error('An error occurred')
    }
    setSending(false)
  }

  const markAsRead = async (messageId: string) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageId, read: true })
      })

      if (res.ok) {
        loadMessages()
      }
    } catch (error) {
      console.error('Mark as read error:', error)
    }
  }

  const adminMessages = messages.filter(m => m.fromRole === 'admin')
  const unreadAdminMessages = adminMessages.filter(m => !m.read)

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
            Messages
          </h1>
          <p className="text-[#4a5a55]">
            Direct communication with your FX advisor
          </p>
        </div>
        <Button
          onClick={() => setShowCompose(!showCompose)}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-[#12261f]">{messages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#2D6A4F]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Unread from Advisor</p>
              <p className="text-3xl font-bold text-[#12261f]">{unreadAdminMessages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <Mail className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">From Advisor</p>
              <p className="text-3xl font-bold text-[#12261f]">{adminMessages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Compose Message */}
      {showCompose && (
        <Card className="p-6 border-[#DCE5E1]">
          <h3 className="text-lg font-semibold text-[#12261f] mb-4">
            Compose New Message
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                placeholder="Message subject"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Type your message here..."
                rows={6}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={sendMessage}
                disabled={sending}
                className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCompose(false)}
                className="border-[#DCE5E1]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Unread Messages from Advisor */}
      {unreadAdminMessages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#12261f] flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-600" />
            New Messages from Your Advisor ({unreadAdminMessages.length})
          </h2>

          {unreadAdminMessages.map((message) => (
            <Card key={message._id} className="p-6 border-2 border-amber-200 bg-amber-50/30">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-sm font-medium flex items-center gap-1">
                        <Circle className="w-3 h-3 fill-amber-600" />
                        NEW
                      </span>
                      {message.subject && (
                        <span className="text-sm font-semibold text-[#12261f]">{message.subject}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-4 h-4 text-[#2D6A4F]" />
                      <span className="text-sm font-medium text-[#12261f]">From: Your FX Advisor</span>
                      <Clock className="w-4 h-4 text-[#2D6A4F] ml-4" />
                      <span className="text-sm text-[#4a5a55]">
                        {new Date(message.createdAt).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="p-4 rounded-lg bg-white border border-[#DCE5E1]">
                      <p className="text-sm text-[#12261f] whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                </div>

                {selectedMessage?._id === message._id ? (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-[#12261f] mb-2 block">Reply to Advisor</label>
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        rows={4}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReply(message._id)}
                        disabled={sending}
                        className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                      >
                        {sending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Reply
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedMessage(null)
                          setReplyText("")
                        }}
                        className="border-[#DCE5E1]"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          markAsRead(message._id)
                          setSelectedMessage(null)
                        }}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4 flex gap-3">
                    <Button
                      onClick={() => setSelectedMessage(message)}
                      className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => markAsRead(message._id)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Read
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* All Messages */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#12261f]">
          Message History
        </h2>

        {messages.length > 0 ? (
          messages.map((message) => (
            <Card key={message._id} className={`p-6 border-[#DCE5E1] ${!message.read && message.fromRole === 'admin' ? 'bg-blue-50/30' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!message.read && message.fromRole === 'admin' ? (
                      <Circle className="w-3 h-3 fill-blue-600 text-blue-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    {message.subject && (
                      <span className="text-sm font-semibold text-[#12261f]">{message.subject}</span>
                    )}
                    <span className="text-xs text-[#4a5a55]">
                      {new Date(message.createdAt).toLocaleDateString('en-AU', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.fromRole === 'admin'
                        ? 'bg-[#2D6A4F]/10 text-[#2D6A4F] font-medium'
                        : 'bg-[#52796F]/10 text-[#52796F]'
                    }`}>
                      {message.fromRole === 'admin' ? 'From: Your Advisor' : 'From: You'}
                    </span>
                  </div>

                  <p className="text-sm text-[#4a5a55] line-clamp-2">{message.message}</p>
                </div>

                {message.fromRole === 'admin' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedMessage(message)
                        if (!message.read) {
                          markAsRead(message._id)
                        }
                      }}
                      className="border-[#DCE5E1]"
                    >
                      View & Reply
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 border-[#DCE5E1] text-center">
            <MessageSquare className="w-16 h-16 text-[#4a5a55] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-[#12261f] mb-2">
              No messages yet
            </h3>
            <p className="text-[#4a5a55]">
              Start a conversation with your FX advisor
            </p>
          </Card>
        )}
      </div>

      {/* Message Detail Modal/Panel - shown when viewing from All Messages */}
      {selectedMessage && messages.find(m => m._id === selectedMessage._id && m.read) && (
        <Card className="p-6 border-2 border-[#2D6A4F] fixed bottom-6 right-6 w-[500px] max-h-[600px] overflow-y-auto shadow-2xl z-50">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#12261f]">
                {selectedMessage.subject || 'Message'}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedMessage(null)
                  setReplyText("")
                }}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-2 pb-4 border-b border-[#DCE5E1]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#2D6A4F]" />
                <span className="text-sm font-medium">Your FX Advisor</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2D6A4F]" />
                <span className="text-sm text-[#4a5a55]">
                  {new Date(selectedMessage.createdAt).toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-[#12261f] whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-[#12261f] block">Reply</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleReply(selectedMessage._id)}
                  disabled={sending}
                  className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMessage(null)
                    setReplyText("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6 border-[#DCE5E1] bg-gradient-to-br from-[#E8EEEB] to-white">
        <h3 className="text-lg font-semibold text-[#12261f] mb-4">
          Need Immediate Assistance?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white justify-start"
            onClick={() => window.location.href = '/dashboard/meetings'}
          >
            📞 Request Meeting
          </Button>
          <Button
            variant="outline"
            className="border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white justify-start"
            onClick={() => setShowCompose(true)}
          >
            ✉️ Send New Message
          </Button>
        </div>
      </Card>
    </div>
  )
}
