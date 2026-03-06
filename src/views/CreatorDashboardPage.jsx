import React from 'react'
import { useNavigate } from 'react-router-dom'
import CreatorDashboard from '../components/creator/CreatorDashboard'

// Mock creator data
const MOCK_CREATOR = {
  creator_id: 'creator-001',
  username: 'sarahmakes',
  display_name: 'Sarah',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  bio: 'Content creator passionate about social impact | TikTok & Instagram',
  follower_count: 42500,
  engagement_rate: 3.8,
  
  claimed_campaigns: [
    {
      campaign_id: '1',
      org_name: 'Mighty Writers',
      title: 'Help Us Hit 50k Views for Winter Coat Drive',
      claimed_at: new Date('2024-12-15').toISOString(),
      status: 'in_progress',
      current_views: 28000,
      target_views: 50000,
      reward_type: 'service_hours',
      reward_earned: 5,
      submission_date: null
    },
    {
      campaign_id: '2',
      org_name: 'Community Food Bank',
      title: 'Urgent: Help Us Reach 100k Local Views for Food Drive',
      claimed_at: new Date('2024-12-10').toISOString(),
      status: 'in_progress',
      current_views: 18300,
      target_views: 100000,
      reward_type: 'micro_grant',
      reward_earned: null,
      submission_date: null
    },
    {
      campaign_id: '3',
      org_name: 'Red Cross Local Chapter',
      title: 'Blood Drive Campaign',
      claimed_at: new Date('2024-12-01').toISOString(),
      status: 'submitted',
      current_views: 62000,
      target_views: 75000,
      reward_type: 'service_hours',
      reward_earned: 8,
      submission_date: new Date('2024-12-20').toISOString()
    },
    {
      campaign_id: '4',
      org_name: 'Youth Mentorship Alliance',
      title: 'Shine a Spotlight on Youth Leadership Programs',
      claimed_at: new Date('2024-11-15').toISOString(),
      status: 'completed',
      current_views: 52000,
      target_views: 45000,
      reward_type: 'portfolio_feature',
      reward_earned: 1,
      submission_date: new Date('2024-12-05').toISOString()
    }
  ],
  
  total_views_generated: 42300,
  total_engagement: 1607,
  active_campaigns_count: 2,
  completed_campaigns_count: 1,
  
  total_service_hours_earned: 13,
  total_micro_grants_earned: 0,
  total_portfolio_features: 1,
  
  view_history: [
    { date: new Date('2024-12-10').toISOString(), views: 8000 },
    { date: new Date('2024-12-12').toISOString(), views: 12500 },
    { date: new Date('2024-12-15').toISOString(), views: 18200 },
    { date: new Date('2024-12-17').toISOString(), views: 22100 },
    { date: new Date('2024-12-20').toISOString(), views: 28500 },
    { date: new Date('2024-12-22').toISOString(), views: 32800 },
    { date: new Date('2024-12-25').toISOString(), views: 38100 },
    { date: new Date('2024-12-27').toISOString(), views: 42300 }
  ]
}

export default function CreatorDashboardPage() {
  const navigate = useNavigate()

  const handleNavigate = (route) => {
    // TODO: Implement actual navigation routing
    console.log('Navigate to:', route)
    // navigate(`/${route}`)
  }

  return <CreatorDashboard creator={MOCK_CREATOR} onNavigate={handleNavigate} />
}
