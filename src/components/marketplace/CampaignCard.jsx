import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ExternalLink } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function CampaignCard({ campaign, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  const getCategoryIcon = (category) => {
    const icons = {
      'Fundraising': '💰',
      'Volunteer Drive': '🤝',
      'Awareness': '📢',
      'Local Event': '🎉',
      'Education': '📚',
      'Food Security': '🥫',
      'Blood Drive': '🩸',
      'Urgent': '⚡'
    }
    return icons[category] || '💡'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Fundraising': 'bg-emerald-500/20 text-emerald-300',
      'Volunteer Drive': 'bg-blue-500/20 text-blue-300',
      'Awareness': 'bg-purple-500/20 text-purple-300',
      'Local Event': 'bg-pink-500/20 text-pink-300',
      'Education': 'bg-indigo-500/20 text-indigo-300',
      'Food Security': 'bg-amber-500/20 text-amber-300',
      'Blood Drive': 'bg-red-500/20 text-red-300',
      'Urgent': 'bg-orange-500/20 text-orange-300'
    }
    return colors[category] || 'bg-slate-500/20 text-slate-300'
  }

  const progressPercent = Math.min(
    (campaign.current_progress / campaign.goal_value) * 100,
    100
  )

  const getGoalLabel = () => {
    const labels = {
      'views': `${campaign.current_progress.toLocaleString()} / ${campaign.goal_value.toLocaleString()} Views`,
      'donations': `$${campaign.current_progress.toLocaleString()} / $${campaign.goal_value.toLocaleString()} Raised`,
      'advocates': `${campaign.current_progress} / ${campaign.goal_value} Creators Joined`
    }
    return labels[campaign.goal_type] || 'Campaign Progress'
  }

  const getRewardLabel = () => {
    if (campaign.reward_type === 'service_hours') {
      return `Earn: ${campaign.reward_value} Community Service Hours`
    } else if (campaign.reward_type === 'micro_grant') {
      return `Bounty: $${campaign.reward_value} Micro-Grant`
    } else if (campaign.reward_type === 'portfolio_feature') {
      return `Perk: ${campaign.reward_value}`
    }
    return 'Claim Campaign'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full">
        
        {/* Header Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
          
          {/* Category Badges - Top Left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getCategoryColor(campaign.category)}`}>
              <span>{getCategoryIcon(campaign.category)}</span>
              <span className="hidden sm:inline">{campaign.category}</span>
            </div>
            {campaign.status === 'active' && (
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-300">
                Active
              </div>
            )}
          </div>

          {/* Status Badge - Top Right */}
          {campaign.org_verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-full text-xs text-blue-300 font-semibold">
              <CheckCircle size={14} />
              Verified
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-80">
          
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {campaign.title}
          </h3>

          {/* Organization */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
            <div>
              <p className="text-sm font-semibold text-white">{campaign.org_name}</p>
              {campaign.org_verified && <p className="text-xs text-blue-400">Verified Partner</p>}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">
            {campaign.description}
          </p>

          {/* Progress Meter */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Campaign Goal</label>
              <span className="text-xs text-slate-400">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
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
            <p className="text-xs text-slate-400 mt-1">{getGoalLabel()}</p>
          </div>

          {/* Reward Block */}
          <div className="border-t border-slate-700 pt-3 mt-auto">
            <p className="text-sm font-bold text-emerald-400 mb-3">
              {getRewardLabel()}
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="primary"
                size="sm"
                className="w-full text-center"
              >
                Claim Campaign <ExternalLink size={14} className="ml-1" />
              </Button>
            </motion.div>
            {!isHovered && (
              <p className="text-xs text-slate-500 text-center py-2">
                Click to learn more
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
