import React from 'react'

const About = () => {
  return (
   <section className="about" id="about">
      <h2>about <span className="text-secondary">us</span></h2>
      
      <div className="about-content">
        <div className="about-img">
          <img src="./img/about.png" alt="about" />
        </div>
        <div className="text">
          <h3>expolore the difference</h3>
          <p>Lorem ipsum dolor sit amet.</p>
          <p>Lorem ipsum dolor sit amet.</p>
          <a href="#" className="btn-about">read more</a>
        </div>
        </div>
  </section>
  )
}

export default About;
