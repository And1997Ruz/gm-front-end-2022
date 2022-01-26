import React from "react";
import { useNavigate } from "react-router";

const AboutDev = () => {
  const navigate = useNavigate();
  return (
    <div className="aboutDev_page">
      <div
        className="nav_bar_offer_btn aboutDev_btn"
        onClick={() => {
          navigate("/");
        }}
      >
        Вернуться на главную
      </div>
      <div className="aboutDev_page_container">
        <h1 className="aboutDev_header">
          General Market - это Full-Stack Web Application
        </h1>
        <h2 className="aboutDev_content_header">
          В процессе разработки использовались следующие технологии:
        </h2>
        <p className="content">
          HTML/CSS, TypeScript, React, Redux, NodeJs, Express, MongoDB, JWT
        </p>
        <div className="aboutDev_btn_container">
          <a
            href="https://github.com/And1997Ruz/gm-backend-2022"
            target="_blank"
            rel="noreferrer"
            className="dark_btn"
          >
            GitHub Back-End
          </a>
          <a
            href="https://github.com/And1997Ruz/gm-front-end-2022"
            target="_blank"
            rel="noreferrer"
            className="light_btn"
          >
            GitHub Front-End
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutDev;
