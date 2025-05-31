import React from 'react'

const About = () => {
    return (
        <div className='support container section'>
            <div className="sectionContainer">

                <div className="titleDiv">
                    <small>Brené Brown</small>
                    <h2>
                        Connection is why we're here; it is what gives purpose and meaning to our lives
                    </h2>
                    <p>A place to grow, share, and support each other every step of the way.</p>
                </div>

                <div className="infoDiv grid">
                    <div className="textDiv grid">
                        <div className="singleInfo">
                            <span className="number colorOne">01</span>
                            <h4>
                                Empowerment Through Connection
                            </h4>
                            <p>
                                EduSister creates a supportive community where female students uplift and guide each other through academic challenges and personal growth.
                            </p>
                        </div>
                        <div className="singleInfo">
                            <span className="number colorTwo">02</span>
                            <h4>
                                Emotional Well-Being
                            </h4>
                            <p>
                                Our platform offers safe spaces and tools designed to nurture mental health, encouraging open expression and self-care.
                            </p>
                        </div>
                        <div className="singleInfo">
                            <span className="number colorThree">03</span>
                            <h4>
                                Holistic Growth
                            </h4>
                            <p>
                                From mentorship to mood tracking and peer support, EduSister equips sisters with resources to thrive both inside and outside the classroom.
                            </p>
                        </div>
                    </div>

                    <div className="articleDiv">
                        <div className="founders-note">
                            <p>
                                When I started university, I often found myself yearning for a safe space —
                                to be seen, to speak freely, to rest without guilt.
                            </p>
                            <p>
                                I realized I wasn’t alone. Many young women were quietly carrying the weight
                                of academic pressure, spiritual searching, and emotional exhaustion — with nowhere soft to land.
                            </p>
                            <p>
                                Here, every part of your story is welcome — the joy, the questions,
                                the quiet victories, and even the days you don’t feel like showing up.
                            </p>
                            <p>
                                Let this be your space. <br />
                                <strong>To breathe. To grow. To belong.</strong>
                            </p>
                            <p className="signature">
                                With love,<br />
                                <strong>Kristina & Cindy</strong><br />
                                <em>One of you — always</em>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default About
