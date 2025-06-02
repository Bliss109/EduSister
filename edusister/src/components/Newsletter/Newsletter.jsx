import React, { useState } from 'react';
// Make sure to import main.css in your App.js or index.js
// Or if this component is directly importing it, uncomment the line below:
// import '../../main.css'; 

const NewsletterSignUp = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔐 Firebase integration goes here (later)
    // For now, just simulate submission
    console.log('Email submitted:', email);
    setSubmitted(true);
  };

  return (
    <div className="newsletter-section container">
      <h2>🌞 Receive Gentle Nudges</h2>
      <p>
        Soft encouragements, journal prompts, and soulful check-ins delivered to your inbox every morning. A little light, just for you.
      </p>

      {submitted ? (
        <p className="thank-you">Thank you for subscribing! 💌</p>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSignUp;