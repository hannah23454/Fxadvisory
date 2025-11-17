// components/admin/tabs/NewslettersTab.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Mail, TrendingUp, Target, Calendar, Users } from 'lucide-react';
import { PerformanceMetrics, Newsletter } from "../types";

interface NewslettersTabProps {
  metrics: PerformanceMetrics;
  onCreateNewsletter: () => void;
}

const mockNewsletters: Newsletter[] = [
  { 
    name: "Weekly FX Insights", 
    status: "Scheduled", 
    date: "Nov 20, 2025", 
    recipients: 1108, 
    openRate: 68.2 
  },
  { 
    name: "Market Commentary", 
    status: "Sent", 
    date: "Nov 13, 2025", 
    recipients: 1095, 
    openRate: 71.5 
  },
  { 
    name: "Regulatory Updates", 
    status: "Draft", 
    date: "Nov 27, 2025", 
    recipients: 856, 
    openRate: null 
  },
];

const personalizationSettings = [
  {
    title: "Topic-Based Personalization",
    description: "Users receive content based on their selected topics",
    active: true
  },
  {
    title: "Currency-Based Filtering",
    description: "Show only relevant currency pair updates",
    active: true
  },
  {
    title: "Automated Scheduling",
    description: "Send newsletters automatically every week",
    active: true
  }
];

export default function NewslettersTab({ metrics, onCreateNewsletter }: NewslettersTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter Management</h2>
          <p className="text-gray-500 mt-1">Manage personalized newsletter campaigns</p>
        </div>
        <Button onClick={onCreateNewsletter} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Newsletter
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.newsletter_subscribers}
              </div>
              <div className="text-sm text-gray-600">Total Subscribers</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">67.5%</div>
              <div className="text-sm text-gray-600">Open Rate</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">42.3%</div>
              <div className="text-sm text-gray-600">Click Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Newsletter Campaigns */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Newsletter Campaigns</h3>
        <div className="space-y-3">
          {mockNewsletters.map((campaign, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 gap-4"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {campaign.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {campaign.recipients} recipients
                  </span>
                  {campaign.openRate && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {campaign.openRate}% open rate
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  campaign.status === 'Sent' ? 'bg-green-100 text-green-700' :
                  campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {campaign.status}
                </span>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Personalization Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Personalization Settings</h3>
        <div className="space-y-4">
          {personalizationSettings.map((setting, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{setting.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">Active</span>
                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}