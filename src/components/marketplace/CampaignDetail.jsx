import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Download,
  Users,
  TrendingUp,
  Award,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import Button from '../ui/Button'

export default function CampaignDetail({ campaign, onBack, onClaim }) {
  const [expandedSections, setExpandedSections] = useState({
    requirements: false,
    assets: false,
    creatorReqs: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const progressPercent = Math.min(
    (campaign.current_progress / campaign.goal_value) * 100,
    100
  )

  const getGoalLabel = () => {
    const labels = {
      'views': `Views`,
      'donations': `Donations`,
      'advocates': `Creators`
    }
    return labels[campaign.goal_type] || 'Progress'
  }

  const getRewardLabel = () => {
    if (campaign.reward_type === 'service_hours') {
      return `${campaign.reward_value} Community Service Hours`
    } else if (campaign.reward_type === 'micro_grant') {
      return `$${campaign.reward_value} Micro-Grant`
    } else if (campaign.reward_type === 'portfolio_feature') {
      return campaign.reward_value
    }
    return 'Claim Campaign'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
        <img
          src={campaign.image_url}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
        
        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          {/* Top Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur transition-colors"
            >
              ← Back to Marketplace
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg backdrop-blur text-emerald-300 font-semibold">
              <CheckCircle size={18} />
              Active
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 line-clamp-2">
              {campaign.title}
            </h1>
            <p className="text-slate-300">
              by <span className="font-bold text-white">{campaign.org_name}</span>
              {campaign.org_verified && (
                <CheckCircle size={16} className="inline ml-2 text-blue-400" />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
          >
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <TrendingUp size={16} />
              Campaign Progress
            </h3>
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-emerald-400">
                  {progressPercent.toFixed(0)}%
                </span>
                <span className="text-sm text-slate-400">{getGoalLabel()}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    progressPercent >= 75
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                      : 'bg-gradient-to-r from-orange-500 to-amber-400'
                  }`}
                />
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              {campaign.current_progress.toLocaleString()} / {campaign.goal_value.toLocaleString()} {getGoalLabel()}
            </p>
          </motion.div>

          {/* Reward Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-6 border border-emerald-700/50"
          >
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Award size={16} />
              Your Reward
            </h3>
            <p className="text-2xl font-bold text-emerald-400 mb-2">
              {getRewardLabel()}
            </p>
            <p className="text-sm text-slate-400">
              Earned upon successful content submission and approval
            </p>
          </motion.div>
        </div>

        {/* Mission Brief */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg p-6 border border-blue-700/50 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Mission Brief</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            {campaign.mission_statement}
          </p>
          <div className="bg-slate-900 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-slate-400 mb-2">Specific Call-to-Action:</p>
            <p className="text-lg text-blue-400 font-bold">{campaign.target_cta}</p>
          </div>
        </motion.div>

        {/* Content Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-lg border border-slate-700 mb-8 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('requirements')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <h2 className="text-xl font-bold">Content Requirements</h2>
            {expandedSections.requirements ? (
              <ChevronUp size={24} />
            ) : (
              <ChevronDown size={24} />
            )}
          </button>
          
          {expandedSections.requirements && (
            <div className="border-t border-slate-700 p-6 bg-slate-900/30">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Do's */}
                <div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    ✓ Do's
                  </h3>
                  <ul className="space-y-2">
                    {campaign.do_list.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <span className="text-emerald-400 font-bold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                    ✕ Don'ts
                  </h3>
                  <ul className="space-y-2">
                    {campaign.dont_list.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300">
                        <span className="text-red-400 font-bold mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Assets & Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-lg border border-slate-700 mb-8 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('assets')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <h2 className="text-xl font-bold">Assets & Resources</h2>
            {expandedSections.assets ? (
              <ChevronUp size={24} />
            ) : (
              <ChevronDown size={24} />
            )}
          </button>

          {expandedSections.assets && (
            <div className="border-t border-slate-700 p-6 bg-slate-900/30 grid md:grid-cols-2 gap-4">
              {campaign.assets_links.google_drive && (
                <a
                  href={campaign.assets_links.google_drive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                >
                  <Download size={20} className="text-slate-400 group-hover:text-white" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Google Drive Folder</p>
                    <p className="text-xs text-slate-400">Logos, B-roll, Assets</p>
                  </div>
                  <ExternalLink size={16} className="text-slate-400" />
                </a>
              )}

              {campaign.assets_links.logos && (
                <a
                  href={campaign.assets_links.logos}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                >
                  <Download size={20} className="text-slate-400 group-hover:text-white" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Official Logos</p>
                    <p className="text-xs text-slate-400">PNG, SVG formats</p>
                  </div>
                  <ExternalLink size={16} className="text-slate-400" />
                </a>
              )}

              {campaign.assets_links.b_roll && (
                <a
                  href={campaign.assets_links.b_roll}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                >
                  <Download size={20} className="text-slate-400 group-hover:text-white" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">B-Roll Footage</p>
                    <p className="text-xs text-slate-400">4K video clips</p>
                  </div>
                  <ExternalLink size={16} className="text-slate-400" />
                </a>
              )}

              {campaign.assets_links.talking_points && (
                <a
                  href={campaign.assets_links.talking_points}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                >
                  <Download size={20} className="text-slate-400 group-hover:text-white" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Talking Points</p>
                    <p className="text-xs text-slate-400">Script suggestions</p>
                  </div>
                  <ExternalLink size={16} className="text-slate-400" />
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Creator Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-lg border border-slate-700 mb-8 overflow-hidden"
        >
          <button
            onClick={() => toggleSection('creatorReqs')}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <h2 className="text-xl font-bold">Creator Requirements</h2>
            {expandedSections.creatorReqs ? (
              <ChevronUp size={24} />
            ) : (
              <ChevronDown size={24} />
            )}
          </button>

          {expandedSections.creatorReqs && (
            <div className="border-t border-slate-700 p-6 bg-slate-900/30 space-y-4">
              <div className="flex items-start gap-4">
                <Users size={20} className="text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white mb-1">Minimum Followers</p>
                  <p className="text-slate-400">
                    {campaign.creator_requirements.min_followers.toLocaleString()}+ followers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <TrendingUp size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white mb-1">Minimum Engagement Rate</p>
                  <p className="text-slate-400">
                    {campaign.creator_requirements.min_engagement_rate}% average engagement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Award size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white mb-1">Experience Level</p>
                  <p className="text-slate-400">
                    {campaign.creator_requirements.experience_level}+
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Organization Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700"
        >
          <h2 className="text-lg font-bold mb-4">About {campaign.org_name}</h2>
          <p className="text-slate-300 mb-4">{campaign.description}</p>
          {campaign.org_website && (
            <a
              href={campaign.org_website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Visit Website
              <ExternalLink size={16} />
            </a>
          )}
        </motion.div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-950/80 border-t border-slate-700 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex-1"
          >
            Back to Marketplace
          </Button>
          <Button
            variant="primary"
            onClick={onClaim}
            className="flex-1"
          >
            Claim This Campaign
          </Button>
        </div>
      </div>
    </div>
  )
}
