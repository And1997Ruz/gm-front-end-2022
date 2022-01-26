import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loadUsers } from "../store/reducers/usersSlice";
import { RootState } from "../store";
import { User } from "../types";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import PulseLoader from "react-spinners/PulseLoader";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const formSchemaWithPassword = Joi.object({
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

const formSchemaWithoutPassword = Joi.object({
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
  password: Joi.string().allow(null, ""),
});

const EditUserForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [oldPasswordChecked, setOldPasswordChecked] = useState(false);
  const users = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.currentUser);
  const currentUser = users.find((user: User) => user._id === userId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: joiResolver(
      oldPasswordChecked ? formSchemaWithoutPassword : formSchemaWithPassword
    ),
    defaultValues: {
      name: currentUser ? currentUser.name : "",
      phone: currentUser ? currentUser.phone : "",
      email: currentUser ? currentUser.email : "",
      password: "",
    },
  });

  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    try {
      await axios.patch(
        `${baseUrl}/api/users/${userId}`,
        JSON.stringify({
          ...data,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const users = await axios.get(`${baseUrl}/api/users`);
      dispatch(loadUsers(users.data));
      setIsLoading(false);
      setTimeout(() => {
        navigate("/profile");
      }, 10);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
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
          <Link to="/profile">
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
                disabled={oldPasswordChecked}
                style={{
                  cursor: oldPasswordChecked ? "not-allowed" : "",
                  backgroundColor: oldPasswordChecked ? "#ededed" : "",
                  border: oldPasswordChecked ? "1px solid #dbdbdb" : "",
                }}
                type="password"
                {...register("password")}
              />

              {errors.password && !oldPasswordChecked && (
                <p className="form_error_msg">{errors.password.message}</p>
              )}
              <div className="form_unit_checkbox">
                <input
                  type="checkbox"
                  style={{ margin: "0 5px", cursor: "pointer" }}
                  onChange={() => {
                    setOldPasswordChecked((prev) => !prev);
                  }}
                />
                Оставить предыдущий пароль
              </div>
            </div>
            <input type="submit" className="form_submit" value="Сохранить" />
          </form>
        </div>
      )}
    </div>
  );
};

export default EditUserForm;
