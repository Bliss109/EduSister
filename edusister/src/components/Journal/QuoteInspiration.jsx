// src/components/home/journaling/QuoteInspiration.jsx
import React from 'react';
import '../../main.css'

const QuoteInspiration = () => {
  return (
    <section className="quote-inspiration">
      <div className="quote-inspiration__content">
        <h3 className="quote-inspiration__quote">
          “Writing is the painting of the voice.”
        </h3>
        <p className="quote-inspiration__author">– Voltaire</p>
      </div>

      <div className="quote-inspiration__image">
        <img src="/illustrations/quote-girl.svg" alt="Reflective girl writing" />
      </div>
    </section>
  );
};

export default QuoteInspiration;
