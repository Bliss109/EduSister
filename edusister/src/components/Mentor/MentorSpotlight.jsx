import React from 'react'
import '../../main.css'

const MentorSpotlight = ({name, title, quote,tags, emoji}) => {
  return (
    <div className='mentor-card'>
      <div className="mentor-emoji">{emoji}</div>
      <h3 className="mentor-name">{name}</h3>
      <p className="mentor-title">{title}</p>
      <blockquote className="mentor-quote">"{quote}"</blockquote>
      <div className="mentor-tags">
        {
            tags.map((tag, i) =>(
             <span key={i}>{tag}</span>
            ))
        }
      </div>
    </div>
  )
}

export default MentorSpotlight
