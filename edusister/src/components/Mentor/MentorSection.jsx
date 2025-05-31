import React from 'react'
import MentorSpotlight from './MentorSpotlight'
import '../../main.css'

const mentors = [
  {
    name: 'Amina Barasa',
    emoji: '🌻',
    title: 'Mental Health Advocate & Computer Science Major',
    quote: "You’re allowed to ask for help and still be strong.",
    tags: ['Mood Tracking', 'Safe Conversations', 'Peer Support'],
  },
  {
    name: 'Zuri Wanjiku',
    emoji: '🌸',
    title: 'International Relations student & journal lover',
    quote: 'Some days we carry books. Other days, books carry us. You’re not alone.',
    tags: ['Academic Pressure', 'Rest & Reflection', 'Mentorship'],
  },
  {
    name: 'Tasha Mwendwa',
    emoji: '🎧',
    title: 'Creative Thinker & SUMG Media Student',
    quote: 'Your voice matters — even when it shakes.',
    tags: ['Expression Through Journaling', 'Community Support', 'Self-Confidence'],
  },
  {
    name: "Irene Atieno",
    emoji: '🪴',
    title: 'Growth Coach & Electrical Engineer Major',
    quote: "Be patient with yourself. You’re still blooming.",
    tags: ['Mental Health', 'Routine Building', 'Gentle Accountability'],
  },
  {
    name: "Leah Mwikali",
    emoji: '🦋',
    title: 'Resilience Mentor & Culinary Student',
    quote: "It’s okay to pause — you don’t have to hustle through the healing.",
    tags: ['Burnout Support', 'Emotional Health', 'Self-Compassion'],
  },

  {
    name: "Nyambura Kendi",
    emoji: '🌼',
    title: 'Faith-Based Peer Guide & Law Student',
    quote: "You can be grounded in grace and still rise with power.",
    tags: ['Faith & Growth', 'Safe Conversations', 'Confidence Building'],
  }

]

const MentorSection = () => {
  return (
    <div className='mentor-section mentor-container'>
      <h2>🌟 Mentor Spotlight</h2>
      <p>Real sisters, real stories — meet the mentors walking beside you on this journey.</p>
      <div className="mentor-grid">
        {mentors.map((mentor, index) => (
          <MentorSpotlight key={index} {...mentor} />
        ))}
      </div>
    </div>
  )
}

export default MentorSection
