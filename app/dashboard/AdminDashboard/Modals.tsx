// components/admin/Modals.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { Topic, Meeting } from "./types";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: Topic | null;
  onSave: (data: { name: string; category: string; is_active: boolean }) => void;
}

export function TopicModal({ isOpen, onClose, topic, onSave }: TopicModalProps) {
  const [name, setName] = useState(topic?.name || "");
  const [category, setCategory] = useState(topic?.category || "hedging");
  const [isActive, setIsActive] = useState(topic?.is_active ?? true);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a topic name");
      return;
    }
    onSave({ name, category, is_active: isActive });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {topic ? 'Edit Topic' : 'Add New Topic'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., Hedging Strategies"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="hedging">Hedging Strategies</option>
              <option value="market-analysis">Market Analysis</option>
              <option value="currency-pairs">Currency Pairs</option>
              <option value="regulatory">Regulatory Updates</option>
              <option value="treasury">Treasury Management</option>
              <option value="risk-management">Risk Management</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (visible to users)
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
            {topic ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onApprove: (loomLink: string) => void;
  onReject: (reason: string) => void;
}

export function MeetingModal({ isOpen, onClose, meeting, onApprove, onReject }: MeetingModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [loomLink, setLoomLink] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  if (!isOpen || !meeting) return null;

  const handleApprove = () => {
    if (!loomLink.trim()) {
      alert("Please enter a Loom meeting link");
      return;
    }
    onApprove(loomLink);
    setLoomLink("");
    setAction(null);
  };

  const handleReject = () => {
    onReject(rejectionReason || 'Not available at this time');
    setRejectionReason("");
    setAction(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Meeting Action</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!action ? (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">
              What would you like to do with this meeting request from{' '}
              <strong>{meeting.user?.user_metadata?.full_name}</strong>?
            </p>
            <Button 
              onClick={() => setAction('approve')} 
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Approve Meeting
            </Button>
            <Button 
              onClick={() => setAction('reject')} 
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Reject Meeting
            </Button>
          </div>
        ) : action === 'approve' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loom Meeting Link
              </label>
              <input
                type="url"
                value={loomLink}
                onChange={(e) => setLoomLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://loom.com/share/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the Loom link for this meeting
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setAction(null)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleApprove} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                Approve
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Provide a reason for rejection..."
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setAction(null)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleReject} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}