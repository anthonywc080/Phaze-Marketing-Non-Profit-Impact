import React from 'react'
import Lottie from 'lottie-react'

export default function FeatureAnimation({ animationData, loop = false, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <Lottie animationData={animationData} loop={loop} />
    </div>
  )
}
