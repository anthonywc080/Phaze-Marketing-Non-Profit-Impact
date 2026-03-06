import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CampaignDetail from '../components/marketplace/CampaignDetail'

// Enhanced mock campaigns with detail page data
const MOCK_CAMPAIGNS_DETAIL = {
  '1': {
    campaign_id: '1',
    org_id: 'org1',
    org_name: 'Mighty Writers',
    org_verified: true,
    org_website: 'https://mightywriters.org',
    title: 'Help Us Hit 50k Views for Winter Coat Drive',
    category: 'Fundraising',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=500&fit=crop',
    description: 'Mighty Writers is an organization dedicated to amplifying the voices of underrepresented youth through creative writing. Our Winter Coat Drive provides warm clothing and mentorship to vulnerable families in Philadelphia.',
    mission_statement: 'We\'re running our annual Winter Coat Drive to get warm coats to 500 families in need. We need creative, eye-catching content on TikTok and Instagram that shows the impact of warm clothing and encourages our community to donate or volunteer.',
    target_cta: 'Click the link in bio to donate a coat or register as a volunteer packer',
    goal_type: 'views',
    goal_value: 50000,
    current_progress: 28000,
    reward_type: 'service_hours',
    reward_value: 5,
    status: 'active',
    do_list: [
      'Show real people receiving coats with genuine reactions',
      'Include captions with clear donation/volunteer links',
      'Use trending audio and hashtags (#WinterCoatDrive, #PhillyHelps)',
      'Film in well-lit environments for maximum visibility',
      'Keep videos between 15-60 seconds'
    ],
    dont_list: [
      'Don\'t ask for donations outside of the CTA provided',
      'Don\'t feature children\'s faces without parental consent forms',
      'Don\'t use our logo in a way that implies political affiliation',
      'Don\'t post duplicate content across platforms'
    ],
    assets_links: {
      google_drive: 'https://drive.google.com/drive/folders/example1',
      logos: 'https://drive.google.com/drive/folders/example1-logos',
      b_roll: 'https://drive.google.com/drive/folders/example1-broll',
      talking_points: 'https://docs.google.com/document/d/example1-points'
    },
    creator_requirements: {
      min_followers: 5000,
      min_engagement_rate: 3,
      experience_level: 'Beginner'
    },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  '2': {
    campaign_id: '2',
    org_id: 'org2',
    org_name: 'Community Food Bank',
    org_verified: true,
    org_website: 'https://communityfoodbank.org',
    title: 'Urgent: Help Us Reach 100k Local Views for Food Drive',
    category: 'Food Security',
    image_url: 'https://images.unsplash.com/photo-1532996122724-8f3c19fd7d4f?w=1200&h=500&fit=crop',
    description: 'Community Food Bank has been fighting food insecurity since 1982. We provide nutritious meals and groceries to over 50,000 people annually in our region.',
    mission_statement: 'We\'re in critical need of food donations and volunteers for our emergency food drive. The demand is at an all-time high, and we need your help spreading the word. Create short, impactful videos that showcase the real impact of food insecurity and inspire people to take action.',
    target_cta: 'Visit communityfoodbank.org/donate or text FOOD to 71777 to contribute',
    goal_type: 'views',
    goal_value: 100000,
    current_progress: 45000,
    reward_type: 'micro_grant',
    reward_value: 50,
    status: 'active',
    do_list: [
      'Tell personal stories of people we\'ve helped',
      'Show the scope of our operations (sorting, packing, distribution)',
      'Include specific call-to-action with donation links',
      'Use high-energy music and quick cuts',
      'Highlight the human side of food insecurity'
    ],
    dont_list: [
      'Don\'t create content that demeans or stereotypes people in need',
      'Don\'t post without prior approval of any featured individuals',
      'Don\'t make medical or nutritional claims',
      'Don\'t use footage that exposes our donors\' identities'
    ],
    assets_links: {
      google_drive: 'https://drive.google.com/drive/folders/example2',
      logos: 'https://drive.google.com/drive/folders/example2-logos',
      b_roll: 'https://drive.google.com/drive/folders/example2-broll',
      talking_points: 'https://docs.google.com/document/d/example2-points'
    },
    creator_requirements: {
      min_followers: 10000,
      min_engagement_rate: 2,
      experience_level: 'Intermediate'
    },
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  '3': {
    campaign_id: '3',
    org_id: 'org3',
    org_name: 'Youth Mentorship Alliance',
    org_verified: true,
    org_website: 'https://youthmentorshipalliance.org',
    title: 'Shine a Spotlight on Youth Leadership Programs',
    category: 'Education',
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=500&fit=crop',
    description: 'Youth Mentorship Alliance connects young people with professional mentors who guide them through personal and professional development. We serve 2,000+ students annually across 15 cities.',
    mission_statement: 'We want to showcase the incredible transformations of our youth mentees. Show their success stories, how mentorship changed their lives, and inspire other young people to join our program. Your authentic storytelling will help us reach more students who need guidance.',
    target_cta: 'Go to youthmentorshipalliance.org/join to sign up as a mentee or mentor',
    goal_type: 'advocates',
    goal_value: 20,
    current_progress: 12,
    reward_type: 'portfolio_feature',
    reward_value: 'Official LinkedIn Recommendation + Featured on our website',
    status: 'active',
    do_list: [
      'Feature real mentee testimonials and before/after stories',
      'Show genuine mentor-mentee relationships and interactions',
      'Highlight specific outcomes (college acceptances, job offers, confidence gains)',
      'Use inspirational music and positive messaging',
      'Include diverse representation of mentees and mentors'
    ],
    dont_list: [
      'Don\'t stage or dramatize stories',
      'Don\'t share personal contact information of mentees or mentors',
      'Don\'t make exaggerated claims about program results',
      'Don\'t use any content without explicit written permission'
    ],
    assets_links: {
      google_drive: 'https://drive.google.com/drive/folders/example3',
      logos: 'https://drive.google.com/drive/folders/example3-logos',
      b_roll: 'https://drive.google.com/drive/folders/example3-broll',
      talking_points: 'https://docs.google.com/document/d/example3-points'
    },
    creator_requirements: {
      min_followers: 15000,
      min_engagement_rate: 4,
      experience_level: 'Intermediate'
    },
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  '4': {
    campaign_id: '4',
    org_id: 'org4',
    org_name: 'Red Cross Local Chapter',
    org_verified: true,
    org_website: 'https://redcross.org',
    title: 'URGENT: Blood Drive Campaign',
    category: 'Urgent',
    image_url: 'https://images.unsplash.com/photo-1579154204601-01d3cc5b0b20?w=1200&h=500&fit=crop',
    description: 'The American Red Cross saves lives by providing blood products to hospitals and emergency services. We currently face critical blood shortages nationwide.',
    mission_statement: 'We have a critical blood shortage and need your help. Every donation saves three lives. We need creators to spread the word about blood drives in your community and encourage people to donate.',
    target_cta: 'Visit redcross.org/donate-blood to find a donation center near you',
    goal_type: 'views',
    goal_value: 75000,
    current_progress: 62000,
    reward_type: 'service_hours',
    reward_value: 8,
    status: 'active',
    do_list: [
      'Highlight the life-saving impact of blood donations',
      'Share facts about blood shortages and patient needs',
      'Feature testimonials from donors and patients',
      'Show the donation process to ease fears',
      'Emphasize the urgency while remaining positive'
    ],
    dont_list: [
      'Don\'t show graphic medical procedures',
      'Don\'t discourage people from donating',
      'Don\'t misrepresent donation requirements',
      'Don\'t use patient health information'
    ],
    assets_links: {
      google_drive: 'https://drive.google.com/drive/folders/example4',
      logos: 'https://drive.google.com/drive/folders/example4-logos',
      b_roll: 'https://drive.google.com/drive/folders/example4-broll',
      talking_points: 'https://docs.google.com/document/d/example4-points'
    },
    creator_requirements: {
      min_followers: 8000,
      min_engagement_rate: 2.5,
      experience_level: 'Beginner'
    },
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
}

export default function CampaignDetailPage() {
  const { campaignId } = useParams()
  const navigate = useNavigate()
  const [claimStatus, setClaimStatus] = useState(null)

  const campaign = MOCK_CAMPAIGNS_DETAIL[campaignId]

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Campaign Not Found</h1>
          <p className="text-slate-400 mb-6">The campaign you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  const handleClaim = () => {
    setClaimStatus('claimed')
    // TODO: Submit claim to backend API
    console.log('Campaign claimed:', campaignId)
    
    setTimeout(() => {
      navigate('/marketplace')
    }, 2000)
  }

  const handleBack = () => {
    navigate('/marketplace')
  }

  if (claimStatus === 'claimed') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-6xl">✓</div>
          <h1 className="text-4xl font-bold mb-2">Campaign Claimed!</h1>
          <p className="text-slate-400 mb-6">
            You've successfully claimed this campaign. Redirecting to marketplace...
          </p>
        </div>
      </div>
    )
  }

  return (
    <CampaignDetail
      campaign={campaign}
      onBack={handleBack}
      onClaim={handleClaim}
    />
  )
}
