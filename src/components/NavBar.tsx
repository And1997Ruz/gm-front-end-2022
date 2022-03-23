import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router";
import { setSearchQuery } from "../store/reducers/searchQuery";
import { setCurrentUser } from "../store/reducers/currentUserSlice";

const NavBar: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 700 ? true : false
  );
  useEffect(() => {
    setNavOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 700 ? true : false;
      setIsMobile(isMobile);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const users = useSelector((state: RootState) => state.users);
  const currentUserId = useSelector((state: RootState) => state.currentUser);
  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = users.find((user) => user._id === currentUserId);
  const userPicture = currentUser
    ? currentUser.userPicture
      ? `${baseUrl}${currentUser.userPicture}`
      : "/defaultPicture.png"
    : undefined;

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem("jwt");
    navigate("/");
  };
  return (
    <div className="nav_bar_container">
      <div className="nav_bar">
        <div className="nav_bar_group1">
          <img
            src="/logo_small.jpg"
            alt=""
            className="logo_small"
            onClick={() => {
              navigate("/");
              dispatch(setSearchQuery(""));
              window.scrollTo(0, 0);
            }}
          />
          {navOpen ? (
            <img
              src="/nav_close.svg"
              alt=""
              className="nav_mobile_icon"
              onClick={() => setNavOpen((prev) => !prev)}
            />
          ) : (
            <img
              src="/nav_open.svg"
              alt=""
              className="nav_mobile_icon"
              onClick={() => setNavOpen((prev) => !prev)}
            />
          )}
        </div>
        <div
          className="nav_bar_group2"
          style={{
            maxHeight: navOpen ? "300px" : "0",
          }}
        >
          {!currentUser && (
            <>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="nav_bar_register_btn">Зарегистрироваться</div>
              </Link>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <div className="nav_bar_login_btn">Войти</div>
              </Link>
            </>
          )}
          {currentUser && (
            <>
              <Link
                to="/profile"
                style={{ textDecoration: "none", color: "black" }}
              >
                <div className="nav_bar_profile">
                  {currentUser && (
                    <img
                      src={userPicture}
                      alt=""
                      className="nav_bar_profile_img image_skeleton"
                    />
                  )}
                  <div className="nav_bar_profile_name">{currentUser.name}</div>
                </div>
              </Link>
              <div className="nav_bar_login_btn" onClick={handleLogout}>
                Выйти
              </div>
            </>
          )}

          <Link
            to={currentUser ? "/new-item" : "/login"}
            style={{ textDecoration: "none" }}
          >
            <div className="nav_bar_offer_btn">Разместить объявление </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
