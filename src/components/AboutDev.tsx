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
        <h2 className="aboutDev_content_header">Поддерживаемый функционал:</h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <p className="content">
              Регистрация и аутентификация пользователей проводится с помощью
              JWT токенов.
            </p>
          </li>
          <li>
            <p className="content">
              Пароли пользователей в базе данных хранятся в исключительно
              зашифрованном виде, подобным образом:
              <span
                style={{
                  width: "400px",
                  wordWrap: "break-word",
                }}
              >
                " $2b$10$H2OZFyHhf7keCUYixYwiIewbeD/ewJpV4FxqRMhtKMf3JTUQT3Wue"
              </span>
            </p>
          </li>
          <li>
            <p className="content">
              Для каждого предложения возможно загрузить до 3-х фотографий
            </p>
          </li>
          <li>
            <p className="content">
              Имеется фильтрация предложений по категsориям, а также с помощью
              поисковой строки
            </p>
          </li>
          <li>
            <p className="content">
              Большой массив данных разделяется на отдельные страницы для
              удобства пользователей
            </p>
          </li>
          <li>
            <p className="content">
              Во время подключения к серверу отображается индикатор загрузки
            </p>
          </li>
          <li>
            <p className="content">
              Пользователи имеют возможность редактировать и удалять свои
              предложения, а также свою страницу профайла
            </p>
          </li>
          <li>
            <p className="content">
              Дизайн адаптируется под любое используемое устройство (компьютер,
              планшет, смартфон)
            </p>
          </li>
        </ul>
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
