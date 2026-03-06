import React, { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import CampaignCard from './CampaignCard'
import Input from '../ui/Input'

// Mock campaign data
const MOCK_CAMPAIGNS = [
  {
    campaign_id: '1',
    org_id: 'org1',
    org_name: 'Mighty Writers',
    org_verified: true,
    title: 'Help Us Hit 50k Views for Winter Coat Drive',
    category: 'Fundraising',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=400&fit=crop',
    description: 'We need creative TikTok content to promote our winter coat distribution to vulnerable families.',
    goal_type: 'views',
    goal_value: 50000,
    current_progress: 28000,
    reward_type: 'service_hours',
    reward_value: 5,
    status: 'active'
  },
  {
    campaign_id: '2',
    org_id: 'org2',
    org_name: 'Community Food Bank',
    org_verified: true,
    title: 'Urgent: Help Us Reach 100k Local Views for Food Drive',
    category: 'Food Security',
    image_url: 'https://images.unsplash.com/photo-1532996122724-8f3c19fd7d4f?w=500&h=400&fit=crop',
    description: 'Join our mission to end hunger. Create short, impactful videos showing our impact.',
    goal_type: 'views',
    goal_value: 100000,
    current_progress: 45000,
    reward_type: 'micro_grant',
    reward_value: 50,
    status: 'active'
  },
  {
    campaign_id: '3',
    org_id: 'org3',
    org_name: 'Youth Mentorship Alliance',
    org_verified: true,
    title: 'Shine a Spotlight on Youth Leadership Programs',
    category: 'Education',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    description: 'Showcase the inspiring stories of the young leaders in our program.',
    goal_type: 'advocates',
    goal_value: 20,
    current_progress: 12,
    reward_type: 'portfolio_feature',
    reward_value: 'Official LinkedIn Recommendation',
    status: 'active'
  },
  {
    campaign_id: '4',
    org_id: 'org4',
    org_name: 'Red Cross Local Chapter',
    org_verified: true,
    title: 'UR​GENT: Blood Drive Campaign',
    category: 'Urgent',
    image_url: 'https://images.unsplash.com/photo-1579154204601-01d3cc5b0b20?w=500&h=400&fit=crop',
    description: 'Critical blood shortage. Help us reach donors in your community.',
    goal_type: 'views',
    goal_value: 75000,
    current_progress: 62000,
    reward_type: 'service_hours',
    reward_value: 8,
    status: 'active'
  },
  {
    campaign_id: '5',
    org_id: 'org5',
    org_name: 'Community Garden Coalition',
    org_verified: false,
    title: 'Join Our Local Community Garden',
    category: 'Local Event',
    image_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=400&fit=crop',
    description: 'Create content about our community garden initiative and get people involved!',
    goal_type: 'advocates',
    goal_value: 15,
    current_progress: 8,
    reward_type: 'portfolio_feature',
    reward_value: 'Featured on our social media channels',
    status: 'active'
  },
  {
    campaign_id: '6',
    org_id: 'org1',
    org_name: 'Mighty Writers',
    org_verified: true,
    title: 'Reading Challenge Summer Campaign',
    category: 'Education',
    image_url: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=500&h=400&fit=crop',
    description: 'Help us promote summer reading to kids in underserved neighborhoods.',
    goal_type: 'views',
    goal_value: 30000,
    current_progress: 18500,
    reward_type: 'micro_grant',
    reward_value: 75,
    status: 'active'
  },
  {
    campaign_id: '7',
    org_id: 'org6',
    org_name: 'Clean Streets Now',
    org_verified: true,
    title: 'Documentary-Style Content for Urban Cleanup',
    category: 'Awareness',
    image_url: 'https://images.unsplash.com/photo-1532996122724-8f3c19fd7d4f?w=500&h=400&fit=crop',
    description: 'Show the impact of our urban cleaning initiative in short-form videos.',
    goal_type: 'views',
    goal_value: 40000,
    current_progress: 21000,
    reward_type: 'service_hours',
    reward_value: 6,
    status: 'active'
  },
  {
    campaign_id: '8',
    org_id: 'org7',
    org_name: 'Mental Health Matters',
    org_verified: true,
    title: 'Break the Stigma Mental Health Awareness',
    category: 'Awareness',
    image_url: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=500&h=400&fit=crop',
    description: 'Share powerful stories of mental health recovery and support.',
    goal_type: 'advocates',
    goal_value: 25,
    current_progress: 15,
    reward_type: 'micro_grant',
    reward_value: 60,
    status: 'active'
  },
  {
    campaign_id: '9',
    org_id: 'org2',
    org_name: 'Community Food Bank',
    org_verified: true,
    title: 'Holiday Toy Drive Social Campaign',
    category: 'Fundraising',
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=400&fit=crop',
    description: 'Create fun, festive content promoting our toy drive for families in need.',
    goal_type: 'views',
    goal_value: 60000,
    current_progress: 35000,
    reward_type: 'service_hours',
    reward_value: 7,
    status: 'active'
  }
]

const CATEGORIES = [
  'Fundraising',
  'Volunteer Drive',
  'Awareness',
  'Local Event',
  'Education',
  'Food Security',
  'Blood Drive',
  'Urgent'
]

const REWARD_TYPES = [
  { value: 'service_hours', label: 'Service Hours' },
  { value: 'micro_grant', label: 'Micro-Grants' },
  { value: 'portfolio_feature', label: 'Portfolio Features' }
]

export default function CampaignMarketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedRewardType, setSelectedRewardType] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Filter and search logic
  const filteredCampaigns = useMemo(() => {
    let filtered = [...MOCK_CAMPAIGNS]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.org_name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(c => selectedCategories.includes(c.category))
    }

    // Reward type filter
    if (selectedRewardType) {
      filtered = filtered.filter(c => c.reward_type === selectedRewardType)
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.campaign_id - a.campaign_id)
    } else if (sortBy === 'progress') {
      const percentA = (a.current_progress / a.goal_value) * 100
      const percentB = (b.current_progress / b.goal_value) * 100
      filtered.sort((a, b) => percentB - percentA)
    } else if (sortBy === 'reward') {
      filtered.sort((a, b) => {
        const rewardA = typeof a.reward_value === 'number' ? a.reward_value : 0
        const rewardB = typeof b.reward_value === 'number' ? b.reward_value : 0
        return rewardB - rewardA
      })
    }

    return filtered
  }, [searchQuery, selectedCategories, selectedRewardType, sortBy])

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedRewardType('')
    setSearchQuery('')
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategories.length > 0 ||
    selectedRewardType !== ''

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-slate-400">
            Discover campaigns from verified non-profits and amplify real-world impact.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-6">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Search
                </label>
                <Input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="progress">Most Progress</option>
                  <option value="reward">Highest Reward</option>
                </select>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Impact Category
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-slate-300 group-hover:text-white transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reward Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Reward Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="reward"
                      value=""
                      checked={selectedRewardType === ''}
                      onChange={() => setSelectedRewardType('')}
                      className="w-4 h-4 text-emerald-500 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-slate-300 group-hover:text-white transition-colors">
                      All Types
                    </span>
                  </label>
                  {REWARD_TYPES.map(reward => (
                    <label key={reward.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="reward"
                        value={reward.value}
                        checked={selectedRewardType === reward.value}
                        onChange={() => setSelectedRewardType(reward.value)}
                        className="w-4 h-4 text-emerald-500 cursor-pointer"
                      />
                      <span className="ml-3 text-sm text-slate-300 group-hover:text-white transition-colors">
                        {reward.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold text-white transition-colors"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content - Campaign Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6">
              <p className="text-slate-400">
                Showing {filteredCampaigns.length} of {MOCK_CAMPAIGNS.length} campaigns
              </p>
            </div>

            {/* Campaign Grid */}
            {filteredCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map(campaign => (
                  <CampaignCard
                    key={campaign.campaign_id}
                    campaign={campaign}
                    onClick={() => {
                      // TODO: Navigate to campaign detail page
                      console.log('Campaign clicked:', campaign.campaign_id)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-800/30 rounded-lg border border-slate-700">
                <Search size={48} className="text-slate-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">
                  No campaigns found
                </h3>
                <p className="text-slate-400 text-center max-w-sm">
                  Try adjusting your filters or search terms to find campaigns that match your interests.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
