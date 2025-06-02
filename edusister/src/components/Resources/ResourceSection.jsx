import React, { useState } from 'react';
import '../../main.css'; // Make sure this path is correct

const resources = [
  {
    emoji: '📓',
    title: 'Self-Care Journal Template',
    description: 'A gentle journaling page to help you reflect, breathe, and reset. Print it out or copy the prompts into your notebook.',
    cta: 'Download PDF',
    link: '/assets/journal-template.pdf', // placeholder link
  },
  {
    emoji: '🗓️',
    title: 'Soft Study Planner',
    description: 'A flexible, non-overwhelming weekly planner designed to help you balance productivity and rest. Plan gently, one day at a time.',
    cta: 'Download Planner',
    link: '/assets/study-planner.pdf',
  },
  {
    emoji: '🎧',
    title: 'Soulful Study & Wellness Playlist',
    description: 'Curated sounds to soothe your heart and focus your mind — a playlist made for journaling, studying, or simply breathing.',
    cta: 'Listen on Spotify',
    link: 'https://open.spotify.com/playlist/yourplaylist',
  },
  {
    emoji: '🌿',
    title: 'Mindful Break Reminders',
    description: 'Gentle nudges throughout your day to pause, stretch, sip water, or breathe deeply. Perfect for study breaks or emotional resets.',
    cta: 'Set Up Reminders',
    link: 'https://www.notione.so/mindful-breaks-template', // Placeholder
  },
  {
    emoji: '✍🏾',
    title: 'Affirmation Cards for Students',
    description: 'Downloadable affirmation cards you can print or keep on your phone. Uplift your spirit with daily reminders of your strength.',
    cta: 'Download Cards',
    link: '/assets/student-affirmations.pdf', // Update this to your actual path
  },
];

const ResourcesSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="resources-section container">
      {/* IMPORTANT: Added animated-heading class and wrapped emoji in span */}
      <h2 className="animated-heading">
        <span className="heading-emoji">🧰</span> Resources & Tools
      </h2>
      <p className="intro-text">Gentle tools to support your journey — made with care, for your growth.</p>

      <div className="accordion">
        {resources.map((item, index) => (
          <div key={index} className={`accordion-item ${openIndex === index ? 'open' : ''}`}>
            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
              <span>{item.emoji}</span> {/* This emoji remains as is (for the accordion items) */}
              <h3>{item.title}</h3>
              <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
            </div>
            {openIndex === index && (
              <div className="accordion-body">
                <p>{item.description}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">{item.cta}</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResourcesSection;