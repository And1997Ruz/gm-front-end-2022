import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loadItems } from "../store/reducers/itemsSlice";
import { RootState } from "../store";
import { Category, Item } from "../types";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import PulseLoader from "react-spinners/PulseLoader";

interface FormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  sellerId: string;
}

const formSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Название товара не может быть пустым",
    "string.min": `Название товара не может быть короче 2 символов`,
    "string.max": `Название товара не может быть длиннее 100 символов`,
    "any.required": `Поле обязательно для заполнения`,
  }),
  description: Joi.string().min(5).max(1000).required().messages({
    "string.empty": "Описание товара не может быть пустым",
    "string.min": `Описание товара должно содержать минимум 5 символов`,
    "string.max": `Описание товара должно содержать максимум 1000 символов`,
    "any.required": `Поле обязательно для заполнения`,
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Цена должна содержать только цифры и не может быть пустой",
    "number.empty": "Укажите цену",
    "number.min": "Цена не может быть отрицательной",
    "any.required": `Поле обязательно для заполнения`,
  }),
});

const EditItemForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const item = useSelector((state: RootState) => state.items).find(
    (item: Item) => item._id === params.id
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: joiResolver(formSchema),
    defaultValues: {
      name: item ? item.name : "",
      description: item ? item.description : "",
      price: item ? item.price : "",
    },
  });
  const [selectFormValue, setSelectFormValue] = useState(item?.category._id);

  const handleSelectInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectFormValue(e.target.value);
  };

  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    try {
      await axios.patch(
        `${baseUrl}/api/items/${params.id}`,
        JSON.stringify({
          ...data,
          categoryId: selectFormValue,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const items = await axios.get(`${baseUrl}/api/items`);
      dispatch(loadItems(items.data));
      setIsLoading(false);
      setTimeout(() => {
        navigate(`/item/${params.id}`);
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
          <Link to={`/item/${params.id}`}>
            <p className="go_back_link">Вернуться назад</p>
          </Link>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="form_container"
          >
            <h1 className="form_info">Заполните форму</h1>
            <div className="form_unit">
              <p className="form_text">Название товара</p>
              <input className="form_input" type="text" {...register("name")} />
              {errors.name && (
                <p className="form_error_msg">{errors.name.message}</p>
              )}
            </div>
            <div className="form_unit">
              <p className="form_text">Описание</p>
              <textarea
                className="form_input desc_input"
                {...register("description")}
              />
              {errors.description && (
                <p className="form_error_msg">{errors.description.message}</p>
              )}
            </div>
            <div className="form_unit">
              <p className="form_text">Цена</p>
              <input
                className="form_input"
                type="text"
                {...register("price")}
              />
              {errors.price && (
                <p className="form_error_msg">{errors.price.message}</p>
              )}
            </div>
            <div className="form_unit">
              <p className="form_text">Выберите категорию</p>
            </div>
            <select
              className="form_input_select"
              name="Категория"
              onChange={handleSelectInputChange}
              value={selectFormValue}
            >
              {categories.map((category: Category, idx: number) => (
                <option key={idx} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input type="submit" className="form_submit" value="Сохранить" />
          </form>
        </div>
      )}
    </div>
  );
};

export default EditItemForm;
