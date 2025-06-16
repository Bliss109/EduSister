import React from 'react'
import HeroSection from '../components/Journal/HeroSection'
import StepsToJournal from '../components/Journal/StepsToJournal'
import MockPreview from '../components/Journal/MockPreview'
import Footer from '../components/Footer/Footer'


const HomeJournalPage = () => {
  return (
    <div className='main-content'>
      <HeroSection />
      <StepsToJournal />
      <MockPreview />
      <Footer />

    </div>
  )
}

export default HomeJournalPage
