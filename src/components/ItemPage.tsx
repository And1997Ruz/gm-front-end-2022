import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loadItems } from "../store/reducers/itemsSlice";
import { Item, User } from "../types";
import { RootState } from "../store";
import NavBar from "./NavBar";
import ItemSmallContainer from "./ItemSmallContainer";
import Popup from "./Popup";
import PulseLoader from "react-spinners/PulseLoader";

const ItemPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<string>(
    "/defaultPicture.png"
  );
  const [deletedPhotoId, setDeletedPhotoId] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [popupActive, setPopupActive] = useState(false);
  const [popupAction, setPopupAction] = useState<string | undefined>();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [selectedFilesFormatError, setSelectedFilesFormatError] =
    useState<boolean>(false);
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

  const [item, setItem] = useState<Item | undefined>();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const items = useSelector((state: RootState) => state.items);
  const seller = useSelector((state: RootState) => state.users).find(
    (seller: User) => seller._id === item?.seller._id
  );
  useEffect(() => {
    setItem(items.find((item: Item) => item._id === params.id));
  }, [items, params]);
  useEffect(() => {
    if (item?.itemPicture && item.itemPicture.length > 0) {
      setSelectedPicture(`${baseUrl}${item.itemPicture[0]}`);
    } else {
      setSelectedPicture("/defaultPicture.png");
    }
  }, [item, baseUrl]);

  const itemPictures = item?.itemPicture;
  const otherItemsFromSeller = items.filter(
    (i: Item) => i.seller._id === item?.seller._id && i._id !== item._id
  );

  const uploadImage = useCallback(async () => {
    if (!selectedFile) return;
    if (selectedFile && selectedFile?.length > 0) {
      if (selectedFilesFormatError) return;
      if (!item) return;
      try {
        setIsLoading(true);
        if (selectedFile && selectedFile?.length > 0) {
          const formData = new FormData();
          Array.from(selectedFile).forEach((file) => {
            formData.append("file", file);
          });
          await axios.post(`${baseUrl}/api/upload/item`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              itemId: item?._id,
            },
          });
        }
        const items = await axios.get(`${baseUrl}/api/items`);
        setSelectedFile(undefined);
        if (fileUploadRef.current) fileUploadRef.current.value = "";
        dispatch(loadItems(items.data));
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        console.log(error);
      }
    }
  }, [baseUrl, item, dispatch, selectedFile, selectedFilesFormatError]);
  useEffect(() => {
    uploadImage();
  }, [selectedFile, uploadImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setSelectedFile(files);

    if (selectedFilesFormatError) return;
  };

  const handleDeleteItem = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${baseUrl}/api/items/${params.id}`);
      const items = await axios.get(`${baseUrl}/api/items`);
      dispatch(loadItems(items.data));
      setIsLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 10);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleDeletePhoto = async () => {
    if (popupAction !== "deletePhoto") return;
    if (item?.itemPicture) {
      try {
        setIsLoading(true);
        await axios.post(`${baseUrl}/api/deleteFile`, {
          filePath: deletedPhotoId,
          itemId: item._id,
        });
        const items = await axios.get(`${baseUrl}/api/items`);
        setPopupAction(undefined);
        dispatch(loadItems(items.data));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  const handleCustomFileInputClick = () => {
    if (selectedFilesFormatError) return;
    const input = document.getElementById("item_page_add_photo");
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
        <div>
          <Popup
            active={popupActive}
            resetAction={() => setPopupAction(undefined)}
            setActive={setPopupActive}
            action={
              popupAction === "deleteItem"
                ? handleDeleteItem
                : handleDeletePhoto
            }
          >
            {popupAction === "deleteItem" &&
              "Вы уверены, что хотите удалить эту страницу?"}
            {popupAction === "deletePhoto" &&
              "Вы уверены, что хотите удалить эту фотографию?"}
          </Popup>
          <NavBar />
          {item && (
            <>
              <div className="item_page">
                <div className="item_page_main">
                  <div className="header_container">
                    <h1 className="item_page_header">{item.name}</h1>
                    {currentUser === seller?._id && (
                      <div className="edit_container">
                        <img
                          className="delete_icon"
                          src="/trash_can_icon.svg"
                          alt=""
                          draggable={false}
                          onClick={() => {
                            setPopupActive(true);
                            setPopupAction("deleteItem");
                          }}
                        />

                        <img
                          className="edit_icon"
                          src="/gear_icon.svg"
                          alt=""
                          draggable={false}
                          onClick={() => navigate(`/item/edit/${params.id}`)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="item_page_pictures_container">
                    {itemPictures && (
                      <div className="item_page_picture_small_container">
                        {itemPictures.map((path: string, idx: number) => (
                          <div
                            key={idx}
                            className="item_page_picture_small_wrapper"
                          >
                            <img
                              src={
                                `${baseUrl}${path}`
                                  ? `${baseUrl}${path}`
                                  : "/defaultPicture.png"
                              }
                              alt=""
                              className={`item_page_picture_small image_skeleton
                      ${
                        selectedPicture === baseUrl + path
                          ? "item_page_picture_small_active image_skeleton"
                          : "item_page_picture_small_inactive image_skeleton"
                      }`}
                              onClick={() => setSelectedPicture(baseUrl + path)}
                            />
                            {item.seller._id === currentUser && (
                              <>
                                <img
                                  className="delete_photo_icon"
                                  src="/delete_photo_icon.svg"
                                  alt=""
                                  draggable={false}
                                  onClick={() => {
                                    setPopupActive(true);
                                    setDeletedPhotoId(path);
                                    setPopupAction("deletePhoto");
                                    handleDeletePhoto();
                                  }}
                                />
                              </>
                            )}
                          </div>
                        ))}
                        {itemPictures.length < 3 &&
                          item.seller._id === currentUser && (
                            <div className="item_page_picture_small item_page_picture_small_inactive">
                              <div
                                className="add_photo_placeholder"
                                onClick={handleCustomFileInputClick}
                              >
                                <img
                                  src="/add_photo_icon.svg"
                                  alt=""
                                  className="add_photo_icon"
                                />
                              </div>

                              <input
                                type="file"
                                id="item_page_add_photo"
                                style={{ display: "none" }}
                                onChange={handleFileSelect}
                                accept="image/*"
                                ref={fileUploadRef}
                              />
                            </div>
                          )}

                        {selectedFilesFormatError && (
                          <div className="item_page_error_msg_container">
                            <p className="form_error_msg_item_page">
                              Выберите файлы поддерживаемого формата: "jpeg",
                              "jpg", "png"{" "}
                            </p>
                            <img
                              className="cross_icon cross_icon_red"
                              src="/cross_red.svg"
                              alt=""
                              onClick={() => {
                                setSelectedFilesFormatError(false);
                                setSelectedFile(undefined);
                                if (fileUploadRef.current)
                                  fileUploadRef.current.value = "";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="item_page_picture_big">
                      <img
                        src={selectedPicture}
                        alt=""
                        className="item_page_picture_big"
                      />
                    </div>
                  </div>
                  <div className="item_page_info">
                    <div className="item_page_info_group">
                      <div className="item_page_info_label">Цена:</div>
                      <div className="item_page_info_content">{`${item.price} рублей`}</div>
                    </div>
                    <div className="item_page_info_group_desc">
                      <div className="item_page_info_label">Описание:</div>
                      <div className="item_page_info_content">
                        {item.description}
                      </div>
                    </div>
                    <div className="item_page_info_group">
                      <div className="item_page_info_label">
                        Дата публикации:
                      </div>
                      <div className="item_page_info_content">
                        {item.dateOfPost}
                      </div>
                    </div>
                    <div className="item_page_info_group">
                      <div className="item_page_info_label">Категория:</div>
                      <div className="item_page_info_content">
                        {item.category.name}
                      </div>
                    </div>
                  </div>
                </div>
                {seller && (
                  <div className="item_page_side">
                    <div className="item_page_info_label">
                      Данные о продавце:
                    </div>
                    <div className="seller_card">
                      <img
                        src={
                          seller.userPicture
                            ? `${baseUrl}${seller.userPicture}`
                            : "/defaultPicture.png"
                        }
                        alt=""
                        className="nav_bar_profile_img image_skeleton"
                      />
                      <div className="nav_bar_profile_name">{seller.name}</div>
                    </div>
                    <div className="seller_card">
                      <img
                        src="/phone_icon.jpg"
                        alt=""
                        className="nav_bar_profile_img image_skeleton"
                      />
                      <div className="nav_bar_profile_name">{seller.phone}</div>
                    </div>
                    <div className="seller_card">
                      <img
                        src="/email_icon.png"
                        alt=""
                        className="nav_bar_profile_img image_skeleton"
                      />
                      <div className="nav_bar_profile_name">{seller.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {item && (
            <>
              {otherItemsFromSeller.length > 0 ? (
                <div className="other_items_label">
                  Другие предложения от данного продавца
                </div>
              ) : (
                <div className="other_items_label">
                  От данного продавца нет других предложений
                </div>
              )}

              <ItemSmallContainer
                pageLimit={9}
                items={otherItemsFromSeller}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemPage;
