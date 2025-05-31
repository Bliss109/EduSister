import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'

const App = () => {
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: '250px' }}>
        <Header />
      </main>
    </div>
  )
}

export default App
