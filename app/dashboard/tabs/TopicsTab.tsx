// components/admin/tabs/TopicsTab.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff, Users, Calendar, Target } from 'lucide-react';
import { Topic } from "../AdminDashboard/types";
import { useI18n } from "@/components/i18n/i18n";

interface TopicsTabProps {
  topics: Topic[];
  onAddTopic: () => void;
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
}

export default function TopicsTab({
  topics,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onToggleActive
}: TopicsTabProps) {
  const { t } = useI18n();

  const catLabel = (cat: string) => {
    switch (cat) {
      case 'hedging':
        return t('admin_cat_hedging');
      case 'market-analysis':
        return t('admin_cat_market_analysis');
      case 'currency-pairs':
        return t('admin_cat_currency_pairs');
      case 'regulatory':
        return t('admin_cat_regulatory');
      case 'treasury':
        return t('admin_cat_treasury');
      case 'risk-management':
        return t('admin_cat_risk_management');
      default:
        return cat.replace('-', ' ');
    }
  };

  if (topics.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#12261f]">{t('admin_topic_management_title')}</h2>
            <p className="text-[#4a5a55] mt-1">{t('admin_topic_management_desc')}</p>
          </div>
          <Button onClick={onAddTopic} className="bg-[#bd6908] hover:bg-[#a35a07] text-white">
            <Plus className="w-4 h-4 mr-2" />
            {t('admin_add_topic')}
          </Button>
        </div>

        <Card className="p-12 text-center border border-[#dce5e1]">
          <Target className="w-16 h-16 text-[#dce5e1] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#12261f] mb-2">{t('admin_no_topics_title')}</h3>
          <p className="text-[#4a5a55] mb-4">{t('admin_no_topics_desc')}</p>
          <Button onClick={onAddTopic} className="bg-[#bd6908] hover:bg-[#a35a07] text-white">
            <Plus className="w-4 h-4 mr-2" />
            {t('admin_create_topic')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#12261f]">{t('admin_topic_management_title')}</h2>
          <p className="text-[#4a5a55] mt-1">{t('admin_topic_management_desc')}</p>
        </div>
        <Button onClick={onAddTopic} className="bg-[#bd6908] hover:bg-[#a35a07] text-white">
          <Plus className="w-4 h-4 mr-2" />
          {t('admin_add_topic')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="p-6 hover:shadow-md transition-shadow border border-[#dce5e1]">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-bold text-[#12261f]">{topic.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    topic.is_active ? 'bg-green-100 text-green-700' : 'bg-[#dce5e1] text-[#12261f]'
                  }`}>
                    {topic.is_active ? t('status_active') : t('status_inactive')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#dce5e1] text-[#12261f] capitalize">
                    {catLabel(topic.category)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#4a5a55]">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{topic.subscribers} {t('admin_subscribers')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{t('admin_created')} {new Date(topic.created_at).toISOString().slice(0,10)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full lg:w-auto">
                <Button
                  onClick={() => onToggleActive(topic.id, topic.is_active)}
                  variant="outline"
                  size="sm"
                  className={topic.is_active ? 'text-[#12261f] border-[#dce5e1]' : 'text-[#bd6908] border-[#bd6908]'}
                >
                  {topic.is_active ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {topic.is_active ? t('admin_deactivate') : t('admin_activate')}
                </Button>
                <Button
                  onClick={() => onEditTopic(topic)}
                  variant="outline"
                  size="sm"
                  className="border-[#dce5e1] text-[#12261f]"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDeleteTopic(topic.id)}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}