import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import CampaignCard from './CampaignCard'
import Input from '../ui/Input'
import { useApp } from '../../context/AppContext'
import { useFirebase } from '../../context/FirebaseContext'
import { claimTask } from '../../firebase/firestore'
import { useToast } from '../../context/ToastContext'

export default function CampaignMarketplace() {
  const { campaigns, campaignTasks } = useApp()
  const { userProfile } = useFirebase()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Use real campaigns if available, otherwise fall back to mock data
  const campaignsData = campaigns.length > 0 ? campaigns.map(campaign => ({
    campaign_id: campaign.id,
    org_id: campaign.nonprofitId,
    org_name: campaign.nonprofitName || 'Nonprofit',
    org_verified: true, // TODO: Add verification status
    title: campaign.title,
    category: campaign.category || 'General',
    image_url: campaign.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=400&fit=crop',
    description: campaign.description,
    goal_type: 'tasks', // TODO: Add proper goal types
    goal_value: campaignTasks.filter(t => t.campaignId === campaign.id).length,
    current_progress: campaignTasks.filter(t => t.campaignId === campaign.id && t.status === 'approved').length,
    reward_type: 'service_hours', // TODO: Add from tasks
    reward_value: 5, // TODO: Add from tasks
    status: campaign.status
  })) : []

  const filteredCampaigns = useMemo(() => {
    return campaignsData.filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.org_name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || campaign.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [campaignsData, searchQuery, selectedCategory])

  const categories = [...new Set(campaignsData.map(c => c.category))]

  const handleJoinCampaign = async (campaignId) => {
    if (!userProfile) {
      showToast('Please sign in to join campaigns', 'warning')
      return
    }

    // Find available task in this campaign
    const availableTask = campaignTasks.find(t => t.campaignId === campaignId && !t.studentId)
    if (!availableTask) {
      showToast('No available tasks in this campaign', 'warning')
      return
    }

    try {
      await claimTask(availableTask.id, userProfile.uid)
      showToast('Successfully joined campaign!', 'success')
    } catch (error) {
      showToast('Failed to join campaign', 'danger')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Marketplace</h1>
          <p className="text-slate-600">Discover campaigns and make an impact while building your portfolio</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="md:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.campaign_id}
              campaign={campaign}
              onJoin={() => handleJoinCampaign(campaign.campaign_id)}
            />
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No campaigns found matching your criteria</p>
            <p className="text-slate-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
