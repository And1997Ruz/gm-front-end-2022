import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Joi from "joi";
import jwtDecode from "jwt-decode";
import { joiResolver } from "@hookform/resolvers/joi";
import { loadUsers } from "../store/reducers/usersSlice";
import { setCurrentUser } from "../store/reducers/currentUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Token } from "../types";
import Popup from "./Popup";
import { RootState } from "../store";
import PulseLoader from "react-spinners/PulseLoader";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImgPreview, setSelectedImgPreview] = useState<string | null>();
  const [selectedFilesFormatError, setSelectedFilesFormatError] =
    useState<boolean>(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const [responseError, setResponseError] = useState("");
  const [popupActive, setPopupActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [authToken, setAuthToken] = useState<string>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formSchema = Joi.object({
    name: Joi.string().min(2).max(20).required().messages({
      "string.empty": "Имя пользователя не может быть пустым",
      "string.min": `Имя пользователя не может быть короче 2 символов`,
      "string.max": `Имя пользователя не может быть длиннее 20 символов`,
      "any.required": `Поле обязательно для заполнения`,
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .min(5)
      .max(30)
      .required()
      .messages({
        "string.email": "Введите адрес эл.почты корректного формата",
        "string.empty": "Адрес эл.почты не может быть пустым",
        "string.min": `Адрес эл.почты не может быть короче 5 символов`,
        "string.max": `Адрес эл.почты не может быть длиннее 30 символов`,
        "any.required": `Поле обязательно для заполнения`,
      }),
    phone: Joi.string()
      .pattern(/^[0-9+]+$/)
      .min(8)
      .max(15)
      .required()
      .messages({
        "string.empty": "Номер телефона не может быть пустым",
        "string.pattern.base": "Номер телефона может состоять только из цифр",
        "string.min": `Номер телефона не может быть короче 8 символов`,
        "string.max": `Номер телефона не может быть длиннее 15 символов`,
        "any.required": `Поле обязательно для заполнения`,
      }),
    password: Joi.string().min(5).max(250).required().messages({
      "string.empty": "Пароль не может быть пустым",
      "string.min": `Пароль не может быть короче 5 символов`,
      "string.max": `Пароль не может быть длиннее 250 символов`,
      "any.required": `Поле обязательно для заполнения`,
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: joiResolver(formSchema),
  });

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

  useEffect(() => {
    if (selectedFile) {
      if (
        selectedFile.type !== "image/jpg" &&
        selectedFile.type !== "image/jpeg" &&
        selectedFile.type !== "image/png"
      ) {
        setSelectedFilesFormatError(true);
        return;
      }
    }
  }, [selectedFile]);

  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;
  const onSubmit = async (data: FormData) => {
    if (selectedFilesFormatError) return;
    setIsLoading(true);
    window.scrollTo(0, 0);
    try {
      const res = await axios.post(
        `${baseUrl}/api/users`,
        JSON.stringify({ ...data }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile as File);
        await axios.post(`${baseUrl}/api/upload/profile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            userid: res.data._id,
          },
        });
      }

      localStorage.setItem("jwt", res.headers["x-auth-token"]);
      const users = await axios.get(`${baseUrl}/api/users`);
      dispatch(loadUsers(users.data));
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        if (e.target.files && e.target.files[0])
          setSelectedImgPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleFileReset = () => {
    setSelectedImgPreview(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
    setSelectedFile(undefined);
    setSelectedFilesFormatError(false);
  };

  const handleInputClick = () => {
    const input = document.getElementById("choose_file");
    if (input) input.click();
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
              <p className="form_text">Имя пользователя</p>
              <input className="form_input" type="text" {...register("name")} />
              {errors.name && (
                <p className="form_error_msg">{errors.name.message}</p>
              )}
            </div>
            <div className="form_unit">
              <p className="form_text">Адрес электронной почты</p>
              <input
                className="form_input"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="form_error_msg">{errors.email.message}</p>
              )}
            </div>
            <div className="form_unit">
              <p className="form_text">Номер телефона</p>
              <input
                className="form_input"
                type="text"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="form_error_msg">{errors.phone.message}</p>
              )}
            </div>
            <div className="form_unit">
              <p className="form_text">Пароль</p>
              <input
                className="form_input"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="form_error_msg">{errors.password.message}</p>
              )}
            </div>
            <div className="form_unit">
              <p className="form_text">Добавьте фотографию</p>
              <input
                type="file"
                onChange={handleFileSelect}
                id="choose_file"
                accept="image/*"
                ref={fileUploadRef}
                style={{ display: "none" }}
              />
              <div
                tabIndex={0}
                className="custom_file_input_small"
                onClick={handleInputClick}
              >
                <img
                  className="custom_file_input_small_icon"
                  src="/add_photo_icon.svg"
                  alt="add_photo"
                />
                Выбрать файл
              </div>
            </div>
            {selectedImgPreview && (
              <div className="selectedImgPreview_container">
                <div className="selectedImgPreview_wrapper">
                  <img
                    src={selectedImgPreview}
                    alt=""
                    className="selectedImgPreview"
                  />
                </div>
                <img
                  src="cross.svg"
                  alt="search_icon"
                  className="cross_icon_img"
                  onClick={handleFileReset}
                />
              </div>
            )}
            {selectedFilesFormatError && (
              <p className="form_error_msg">
                Выберите файлы поддерживаемого формата: "jpeg", "jpg", "png"
              </p>
            )}
            <input type="submit" className="form_submit" value="Сохранить" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
