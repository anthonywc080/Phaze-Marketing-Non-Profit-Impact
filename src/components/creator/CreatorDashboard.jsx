import React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Award,
  Users,
  Zap,
  Target,
  Clock,
  Play,
  CheckCircle2,
  Settings,
  LogOut,
  ArrowRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Button from '../ui/Button'

export default function CreatorDashboard({ creator, onNavigate }) {
  const chartData = creator.view_history.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: item.views
  }))

  const totalProgressHours = creator.claimed_campaigns.reduce((sum, c) => {
    if (c.reward_type === 'service_hours') return sum + (c.reward_earned || 0)
    return sum
  }, 0)

  const totalProgressGrants = creator.claimed_campaigns.reduce((sum, c) => {
    if (c.reward_type === 'micro_grant') return sum + (c.reward_earned || 0)
    return sum
  }, 0)

  const topCampaigns = [...creator.claimed_campaigns]
    .sort((a, b) => (b.current_views || 0) - (a.current_views || 0))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {creator.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {creator.display_name}!</h1>
                <p className="text-slate-400">@{creator.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Creator Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Followers</p>
              <p className="text-lg font-bold">{creator.follower_count.toLocaleString()}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Engagement Rate</p>
              <p className="text-lg font-bold">{creator.engagement_rate}%</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Joined Campaigns</p>
              <p className="text-lg font-bold">{creator.claimed_campaigns.length}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Total Impact</p>
              <p className="text-lg font-bold text-emerald-400">{(creator.total_views_generated / 1000).toFixed(1)}k</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Views Generated</h3>
              <TrendingUp size={20} className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{(creator.total_views_generated / 1000).toFixed(1)}k</p>
            <p className="text-xs text-slate-400">total impact across campaigns</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-emerald-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Active Campaigns</h3>
              <Zap size={20} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{creator.active_campaigns_count}</p>
            <p className="text-xs text-slate-400">campaigns in progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-amber-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Service Hours</h3>
              <Clock size={20} className="text-amber-400" />
            </div>
            <p className="text-3xl font-bold mb-1">{creator.total_service_hours_earned}</p>
            <p className="text-xs text-slate-400">hours earned & verified</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-purple-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-400">Micro-Grants Earned</h3>
              <Award size={20} className="text-purple-400" />
            </div>
            <p className="text-3xl font-bold mb-1">${creator.total_micro_grants_earned}</p>
            <p className="text-xs text-slate-400">total earnings</p>
          </motion.div>
        </div>

        {/* Active Campaigns Section */}
        {creator.active_campaigns_count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap size={24} className="text-emerald-400" />
              Active Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creator.claimed_campaigns
                .filter(c => c.status === 'in_progress')
                .map((campaign, idx) => {
                  const progressPercent = (campaign.current_views / campaign.target_views) * 100
                  return (
                    <motion.div
                      key={campaign.campaign_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-white mb-1">{campaign.title}</h3>
                          <p className="text-sm text-slate-400">{campaign.org_name}</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full">
                          In Progress
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">Progress</span>
                          <span className="text-xs font-bold text-emerald-400">{progressPercent.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {campaign.current_views.toLocaleString()} / {campaign.target_views.toLocaleString()} views
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
            </div>
          </motion.div>
        )}

        {/* Impact Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-400" />
            Impact Over Time
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Performing Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award size={24} className="text-yellow-400" />
            Top Performing Campaigns
          </h2>
          <div className="space-y-4">
            {topCampaigns.map((campaign, idx) => (
              <div key={campaign.campaign_id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{campaign.title}</p>
                    <p className="text-sm text-slate-400">{campaign.org_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">
                    {(campaign.current_views / 1000).toFixed(1)}k
                  </p>
                  <p className="text-xs text-slate-400">views generated</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rewards Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Service Hours */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock size={20} className="text-amber-400" />
              Service Hours Progress
            </h3>
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-amber-400">{totalProgressHours}</span>
                <span className="text-sm text-slate-400">/ 20 hours</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                  style={{ width: `${Math.min((totalProgressHours / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {20 - totalProgressHours} hours until next milestone
            </p>
          </div>

          {/* Micro-Grants */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award size={20} className="text-purple-400" />
              Micro-Grants Progress
            </h3>
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-purple-400">${totalProgressGrants}</span>
                <span className="text-sm text-slate-400">/ $500 goal</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                  style={{ width: `${Math.min((totalProgressGrants / 500) * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              ${500 - totalProgressGrants} until next milestone
            </p>
          </div>
        </motion.div>

        {/* Portfolio Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Play size={24} className="text-pink-400" />
            Portfolio Assets
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-pink-400 mb-1">
                {creator.claimed_campaigns.filter(c => c.status === 'submitted').length}
              </p>
              <p className="text-sm text-slate-400">Videos Submitted</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-400 mb-1">
                {creator.claimed_campaigns.filter(c => c.status === 'completed').length}
              </p>
              <p className="text-sm text-slate-400">Campaigns Completed</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400 mb-1">
                {creator.claimed_campaigns.length * 2}
              </p>
              <p className="text-sm text-slate-400">Assets Delivered</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-950/80 border-t border-slate-700 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto flex gap-4">
          <Button
            variant="secondary"
            onClick={() => onNavigate('marketplace')}
            className="flex-1"
          >
            Explore More Campaigns
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate('profile')}
            className="flex-1"
          >
            View Full Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
