"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { MessageSquare, Loader2, Send, Mail, User, Clock, CheckCircle2, Circle } from "lucide-react"

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)

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
          toUserId: selectedMessage.fromUserId,
          message: replyText,
          subject: `Re: ${selectedMessage.subject || 'Your inquiry'}`
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

  const unreadMessages = messages.filter(m => !m.read && m.fromRole === 'user')
  const allUserMessages = messages.filter(m => m.fromRole === 'user')

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
          Messages
        </h1>
        <p className="text-[#4a5a55]">
          View and respond to user messages
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-[#12261f]">{allUserMessages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#2D6A4F]" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Unread Messages</p>
              <p className="text-3xl font-bold text-[#12261f]">{unreadMessages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <Mail className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-[#DCE5E1]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4a5a55] mb-1">Read Messages</p>
              <p className="text-3xl font-bold text-[#12261f]">{allUserMessages.length - unreadMessages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Unread Messages Section */}
      {unreadMessages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#12261f] flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-600" />
            Unread Messages ({unreadMessages.length})
          </h2>

          {unreadMessages.map((message) => (
            <Card key={message._id} className="p-6 border-2 border-amber-200 bg-amber-50/30">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-sm font-medium flex items-center gap-1">
                        <Circle className="w-3 h-3 fill-amber-600" />
                        UNREAD
                      </span>
                      {message.subject && (
                        <span className="text-sm font-semibold text-[#12261f]">{message.subject}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-[#4a5a55] mb-1">From</p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#2D6A4F]" />
                          <span className="text-sm font-medium text-[#12261f]">{message.fromUserName || 'Unknown User'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-4 h-4 text-[#2D6A4F]" />
                          <span className="text-sm text-[#4a5a55]">{message.fromUserEmail || 'No email'}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-[#4a5a55] mb-1">Sent</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#2D6A4F]" />
                          <span className="text-sm text-[#12261f]">
                            {new Date(message.createdAt).toLocaleDateString('en-AU', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white border border-[#DCE5E1]">
                      <p className="text-sm text-[#12261f] whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                </div>

                {selectedMessage?._id === message._id ? (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-[#12261f] mb-2 block">Reply to {message.fromUserName}</label>
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
                      <Send className="w-4 h-4 mr-2" />
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

      {/* All Messages Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#12261f]">
          All Messages
        </h2>

        {allUserMessages.length > 0 ? (
          allUserMessages.map((message) => (
            <Card key={message._id} className={`p-6 border-[#DCE5E1] ${!message.read ? 'bg-blue-50/30' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!message.read ? (
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
                    <User className="w-4 h-4 text-[#2D6A4F]" />
                    <span className="text-sm font-medium text-[#12261f]">{message.fromUserName || 'Unknown'}</span>
                    <span className="text-sm text-[#4a5a55]">• {message.fromUserEmail}</span>
                  </div>

                  <p className="text-sm text-[#4a5a55] line-clamp-2">{message.message}</p>
                </div>

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
              User messages will appear here
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
                <span className="text-sm font-medium">{selectedMessage.fromUserName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2D6A4F]" />
                <span className="text-sm text-[#4a5a55]">{selectedMessage.fromUserEmail}</span>
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
    </div>
  )
}
