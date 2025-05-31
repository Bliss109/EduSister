import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import About from './components/About/About'
import MentorSection from './components/Mentor/MentorSection'

const App = () => {
  return (
    <div>
      <Navbar />
      <main className='main-content'>
        <Header />
        <About />
        <MentorSection />
      </main>
    </div>
  )
}

export default App
