import React from 'react'

function SocialLink() {
  return (
    <ul className="icon-list">
            <li className="icon-item">
              <a href="http://facebook.com"
                ><i className="fa-brands fa-facebook"> </i
              ></a>
            </li>
            <li className="icon-item">
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
            </li>
            <li className="icon-item">
              <a href="#"><i className="fa-brands fa-threads"></i></a>
            </li>
    </ul>
  );
}

export default SocialLink;
