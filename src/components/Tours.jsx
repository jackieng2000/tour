import React from 'react'
import { tours } from "../data"
import Tour from "./Tour"
import Title from "./Title"

const Tours = () => {
  return (
    <article className="tours" id="tours">
      {/* <h2>featured <span className="text-secondary">tours</span></h2> */}
      <Title title = "featured" subtitle = "tours" />
     

      <div className="cards">

      {tours.map((tour) => (
          <Tour key = {tour.id} {...tour} 
          />
      ))}

      {/* <!-- card X 4 --> */}
        


          {/* <div className="card-img">
            <img src="./img/Tours-1.png" alt="" />
            <p>Aug 1st 2025</p>
          </div>

          <div className="card-content">
            <h3>adventure</h3>
            <p>Lorem ipsum dolor sit amet.</p>
            <ul>
              <li><i className="fa-solid fa-map"></i>China</li>
              <li>6 Days</li>
              <li>From $2100</li>
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="card-img">
            <img src="./img/Tours-4.png" alt="" />
            <p>Aug 1st 2025</p>
          </div>

          <div className="card-content">
            <h3>adventure</h3>
            <p>Lorem ipsum dolor sit amet.</p>
            <ul>
              <li><i className="fa-solid fa-map"></i>China</li>
              <li>6 Days</li>
              <li>From $2100</li>
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="card-img">
            <img src="./img/Tours-2.png" alt="" />
            <p>Aug 1st 2025</p>
          </div>
          <div className="card-content">
            <h3>adventure</h3>
            <p>Lorem ipsum dolor sit amet.</p>
            <ul>
              <li><i className="fa-solid fa-map"></i>China</li>
              <li>6 Days</li>
              <li>From $2100</li>
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="card-img">
            <img src="./img/Tours-3.png" alt="" />
            <p>Aug 1st 2025</p>
          </div>
          <div className="card-content">
            <h3>adventure</h3>
            <p>Lorem ipsum dolor sit amet.</p>
            <ul>
              <li><i className="fa-solid fa-map"></i>China</li>
              <li>6 Days</li>
              <li>From $2100</li>
            </ul>
          </div> */}
         </div>  

    </article>
  )
}

export default Tours
