import React, { useEffect, useState } from 'react';
import '../../main.scss';
import avatar0 from '../../assets/avatar0.jpg';
import avatar1 from '../../assets/avatar1.jpg';
import avatar2 from '../../assets/avatar2.jpg';
import avatar3 from '../../assets/avatar3.jpg';
import avatar4 from '../../assets/avatar4.jpg';
import avatar5 from '../../assets/avatar5.jpg';

const testimonials = [
  {
    quote: "Before EduSister, I felt like I had to carry everything on my own. Now I have a mentor who listens, understands, and cheers me on.",
    img: avatar0,
    name: 'Amina, 21',
  },
  {
    quote: "Sometimes you just need one person to say, ‘me too’ — that’s what I found here.",
    img: avatar1,
    name: 'Zuri, 20',
  },
  {
    quote: "This space made me feel seen. For the first time, I didn’t have to explain why I was tired. My mentor just got it.",
    img: avatar2,
    name: 'Tasha, 22',
  },
  {
    quote: "EduSister gave me more than a mentor — I found a sisterhood that understands the silent battles.",
    img: avatar3,
    name: 'Leah, 23',
  },
  {
    quote: "I used to hide my burnout. Now, I have gentle accountability and someone who checks in — genuinely.",
    img: avatar4,
    name: 'Irene, 24',
  },
  {
    quote: "My mentor encouraged me to rest, not just hustle. That shift changed everything.",
    img: avatar5,
    name: 'Nyambura, 22',
  },
];

const HeroTestimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const rotate = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 2000);

    return () => clearInterval(rotate);
  }, []);

  const { quote, img, name } = testimonials[index];

  return (
    <div className="hero-testimonials">
      <div className="testimonial-card">
        <img className="testimonial-img" src={img} alt={name} />
        <blockquote>{`“${quote}”`}</blockquote>
        <p className="testimonial-name">{name}</p>
      </div>
    </div>
  );
};

export default HeroTestimonials;
