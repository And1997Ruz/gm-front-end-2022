import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { setCurrentUser } from "../store/reducers/currentUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Token } from "../types";
import { RootState } from "../store";
import Popup from "./Popup";
import PulseLoader from "react-spinners/PulseLoader";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [popupActive, setPopupActive] = useState(false);
  const [authToken, setAuthToken] = useState<string>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const currentUser = useSelector((state: RootState) => state.currentUser);

  useEffect(() => {
    if (!authToken) return;
    const user: Token = jwtDecode(authToken);
    dispatch(setCurrentUser(user._id));
    navigate("/");
  }, [authToken, dispatch, navigate]);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  });

  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    try {
      const res = await axios.post(
        `${baseUrl}/api/login`,
        JSON.stringify({ ...data }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("jwt", res.data);
      const token = localStorage.getItem("jwt");
      if (token) {
        setAuthToken(token);
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (error.response.status === 400) {
        setResponseError(error.response.data.message);
        setPopupActive(true);
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="loading_wrapper">
          <PulseLoader
            speedMultiplier={0.5}
            color="#BDB8B8"
            loading={isLoading}
            margin={10}
          />
        </div>
      ) : (
        <div className="form_page">
          <Popup active={popupActive} setActive={setPopupActive}>
            {responseError}
          </Popup>
          <Link to="/">
            <p className="go_back_link">Вернуться назад</p>
          </Link>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="form_container"
          >
            <h1 className="form_info">Заполните форму</h1>

            <div className="form_unit">
              <p className="form_text">Адрес электронной почты</p>
              <input
                className="form_input"
                type="email"
                {...register("email")}
              />
            </div>

            <div className="form_unit">
              <p className="form_text">Пароль</p>
              <input
                className="form_input"
                type="password"
                {...register("password")}
              />
            </div>

            <input type="submit" className="form_submit" value="Сохранить" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
