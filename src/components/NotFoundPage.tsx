import React from "react";
import NavBar from "./NavBar";

import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <NavBar />
      <div className="not_found_page_main">
        <img className="nothing_found_img" src="/nothing_found.jpg" alt="" />
        <div
          className="nav_bar_offer_btn"
          style={{ margin: "20px 0 0 15px" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Вернуться на главную
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
