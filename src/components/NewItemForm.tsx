import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadItems } from "../store/reducers/itemsSlice";
import { RootState } from "../store";
import { Category } from "../types";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Popup from "./Popup";
import PulseLoader from "react-spinners/PulseLoader";

interface FormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  sellerId: string;
}

const NewItemForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilesPreview, setSelectedFilesPreview] = useState<string[]>(
    []
  );
  const [selectedFilesFormatError, setSelectedFilesFormatError] =
    useState<boolean>(false);

  const [popupActive, setPopupActive] = useState(false);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const currentUser = useSelector((state: RootState) => state.currentUser);

  const navigate = useNavigate();

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
      "number.base":
        "Цена должна содержать только цифры и не может быть пустой",
      "number.empty": "Укажите цену",
      "number.min": "Цена не может быть отрицательной",
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
  const categories = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch();

  const [selectFormValue, setSelectFormValue] = useState(
    "61a15181a03c12e38fc1862a"
  );

  const [selectedFile, setSelectedFile] = useState<FileList>();
  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      for (let i = 0; i < selectedFile.length; i++) {
        const file = selectedFile.item(i);
        if (file && file.type) {
          if (
            file.type !== "image/jpg" &&
            file.type !== "image/jpeg" &&
            file.type !== "image/png"
          ) {
            setSelectedFilesFormatError(true);
            return;
          }
        }
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
        `${baseUrl}/api/items`,
        JSON.stringify({
          ...data,
          categoryId: selectFormValue,
          userId: currentUser,
          dateOfPost: new Date().toLocaleDateString("ru-RU"),
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (selectedFile && selectedFile?.length > 0) {
        const formData = new FormData();
        Array.from(selectedFile).forEach((file) => {
          formData.append("file", file);
        });
        await axios.post(`${baseUrl}/api/upload/item`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            itemId: res.data._id,
          },
        });
      }
      const items = await axios.get(`${baseUrl}/api/items`);
      dispatch(loadItems(items.data));
      navigate("/");
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = e.target.files;
    if (files.length > 3) {
      setPopupActive(true);
      e.target.value = "";
      setSelectedFile(undefined);
      setSelectedFilesPreview([]);
      return;
    }
    setSelectedFile(files);
    const filePreviews = Array.from(files).map((file: File) =>
      URL.createObjectURL(file)
    );
    setSelectedFilesPreview(filePreviews);
  };

  const handleFileReset = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    setSelectedFilesPreview([]);
    if (fileUploadRef.current) fileUploadRef.current.value = "";
    setSelectedFile(undefined);
    setSelectedFilesFormatError(false);
  };

  const handleSelectInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectFormValue(e.target.value);
  };

  const handleInputClick = () => {
    if (selectedFilesFormatError) return;
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
            Выберите не более 3-х фотографий
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

            <div className="form_unit">
              <p className="form_text">Добавьте до 3 фотографий</p>
              <input
                type="file"
                onChange={handleFileSelect}
                id="choose_file"
                accept="image/*"
                ref={fileUploadRef}
                multiple
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
                  alt=""
                />
                Выбрать файлы
              </div>
            </div>
            {selectedFilesPreview.length > 0 && (
              <div className="selectedImgPreview_container">
                {selectedFilesPreview.map((file: string, idx: number) => (
                  <div className="selectedImgPreview_wrapper" key={idx}>
                    <img
                      src={file}
                      alt=""
                      className="selectedImgPreview"
                      draggable={false}
                    />
                  </div>
                ))}
                <img
                  src="cross.svg"
                  alt=""
                  className="cross_icon_img"
                  onClick={(e) => handleFileReset(e)}
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

export default NewItemForm;
