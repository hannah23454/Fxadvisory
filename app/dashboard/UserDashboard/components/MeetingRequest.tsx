"use client";

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useI18n } from "@/components/i18n/i18n";

interface Props {
  userId?: string;
  onCreated?: (meeting: any) => void;
}

export default function MeetingRequest({ userId, onCreated }: Props) {
  const { t } = useI18n();
  const supabase = createClientComponentClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          user_id: userId,
          title,
          description,
          preferred_time: preferredTime,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request meeting');
      setSuccess(t('user_meeting_request_success'));
      setTitle('');
      setDescription('');
      setPreferredTime('');
      onCreated?.(data.meeting);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const minDateTime = new Date().toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-lg border shadow-sm space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{t('user_meeting_request_title')}</h3>
        {success && <span className="text-sm text-green-600">{success}</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {/* Horizontal layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('user_meeting_title_label')}</label>
          <input
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            required
            placeholder={t('user_meeting_title_placeholder')}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#BD6908]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('user_meeting_preferred_time_label')}</label>
          <input
            type="datetime-local"
            value={preferredTime}
            min={minDateTime}
            onChange={(e)=>setPreferredTime(e.target.value)}
            required
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#BD6908]"
          />
          <p className="text-xs text-gray-500 mt-1">{t('user_meeting_preferred_time_help')}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('user_meeting_description_label')}</label>
        <textarea
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          rows={3}
          placeholder={t('user_meeting_description_placeholder')}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#BD6908]"
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={()=>{ setTitle(''); setDescription(''); setPreferredTime(''); setError(null); setSuccess(null); }}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          {t('user_clear')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-md bg-[#BD6908] text-white font-medium hover:bg-[#a35a07] disabled:opacity-70"
        >
          {loading ? t('user_sending') : t('user_request_meeting')}
        </button>
      </div>
    </form>
  );
}
