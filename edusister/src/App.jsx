import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import About from './components/About/About'
import MentorSection from './components/Mentor/MentorSection'
import ResourcesSection from './components/Resources/ResourceSection'
import Newsletter from './components/Newsletter/Newsletter'
import Footer from './components/Footer/Footer'
import BackToTop from './components/BackToTop/BackToTop'
import Signup from './Signup';
import Login from './Login';
import './global.css';

const App = () => {
  return (
    <div>
      <Navbar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={
          <>
            <About />
            <MentorSection />
            <ResourcesSection />
            <Newsletter />
            <Footer />
            <BackToTop />
          </>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Header />
        <About />
        <MentorSection />
        <ResourcesSection />
        <Newsletter />
        <Footer />
        <BackToTop />
      </main>
    </div>
  );
}

export default App;
