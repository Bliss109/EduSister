import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import About from './components/About/About'

const App = () => {
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: '250px' }}>
        <Header />
        <About />
      </main>
    </div>
  )
}

export default App
