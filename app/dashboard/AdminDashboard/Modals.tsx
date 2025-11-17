// components/admin/Modals.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { Topic, Meeting } from "./types";
import { useI18n } from "@/components/i18n/i18n";

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: Topic | null;
  onSave: (data: { name: string; category: string; is_active: boolean }) => void;
}

export function TopicModal({ isOpen, onClose, topic, onSave }: TopicModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState(topic?.name || "");
  const [category, setCategory] = useState(topic?.category || "hedging");
  const [isActive, setIsActive] = useState(topic?.is_active ?? true);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert(t('admin_modal_enter_topic_name'));
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
            {topic ? t('admin_modal_edit_topic_title') : t('admin_modal_add_topic_title')}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin_modal_topic_name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={t('admin_modal_topic_placeholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin_modal_category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="hedging">{t('admin_cat_hedging')}</option>
              <option value="market-analysis">{t('admin_cat_market_analysis')}</option>
              <option value="currency-pairs">{t('admin_cat_currency_pairs')}</option>
              <option value="regulatory">{t('admin_cat_regulatory')}</option>
              <option value="treasury">{t('admin_cat_treasury')}</option>
              <option value="risk-management">{t('admin_cat_risk_management')}</option>
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
              {t('admin_modal_active_visible')}
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} variant="outline" className="flex-1">
            {t('admin_modal_cancel')}
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
            {topic ? t('admin_modal_update') : t('admin_modal_create')}
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
  const { t } = useI18n();
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [loomLink, setLoomLink] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  if (!isOpen || !meeting) return null;

  const handleApprove = () => {
    if (!loomLink.trim()) {
      alert(t('admin_modal_enter_loom_link'));
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
          <h3 className="text-xl font-bold text-gray-900">{t('admin_modal_meeting_action')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!action ? (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">
              {t('admin_modal_what_do')} <strong>{meeting.user?.user_metadata?.full_name}</strong>?
            </p>
            <Button 
              onClick={() => setAction('approve')} 
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {t('admin_modal_approve_meeting')}
            </Button>
            <Button 
              onClick={() => setAction('reject')} 
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              {t('admin_modal_reject_meeting')}
            </Button>
          </div>
        ) : action === 'approve' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin_modal_loom_link_label')}
              </label>
              <input
                type="url"
                value={loomLink}
                onChange={(e) => setLoomLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('admin_modal_loom_placeholder')}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('admin_modal_loom_link_help')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setAction(null)} variant="outline" className="flex-1">
                {t('admin_back')}
              </Button>
              <Button onClick={handleApprove} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                {t('admin_approve')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin_rejection_reason')}
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
                {t('admin_back')}
              </Button>
              <Button onClick={handleReject} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                {t('admin_reject')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}