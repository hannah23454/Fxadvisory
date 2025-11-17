// components/admin/tabs/TopicsTab.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff, Users, Calendar, Target } from 'lucide-react';
import { Topic } from "../types";

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
  if (topics.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Topic Management</h2>
            <p className="text-gray-500 mt-1">Manage topics that users can subscribe to</p>
          </div>
          <Button onClick={onAddTopic} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Topic
          </Button>
        </div>

        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Topics Yet</h3>
          <p className="text-gray-500 mb-4">Create your first topic to get started</p>
          <Button onClick={onAddTopic} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Topic
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Topic Management</h2>
          <p className="text-gray-500 mt-1">Manage topics that users can subscribe to</p>
        </div>
        <Button onClick={onAddTopic} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Topic
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900">{topic.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    topic.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {topic.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 capitalize">
                    {topic.category.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{topic.subscribers} subscribers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(topic.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full lg:w-auto">
                <Button
                  onClick={() => onToggleActive(topic.id, topic.is_active)}
                  variant="outline"
                  size="sm"
                  className={topic.is_active ? 'text-gray-600' : 'text-green-600 border-green-600'}
                >
                  {topic.is_active ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {topic.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  onClick={() => onEditTopic(topic)}
                  variant="outline"
                  size="sm"
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