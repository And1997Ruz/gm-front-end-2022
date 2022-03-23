import React, { useState, useEffect, useRef, useCallback } from "react";
import NavBar from "./NavBar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { loadUsers } from "../store/reducers/usersSlice";
import { setCurrentUser } from "../store/reducers/currentUserSlice";
import { Item, User } from "../types";
import { useNavigate } from "react-router";
import ItemSmallContainer from "./ItemSmallContainer";
import Popup from "./Popup";
import axios from "axios";
import { loadItems } from "../store/reducers/itemsSlice";
import PulseLoader from "react-spinners/PulseLoader";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 900 ? true : false
  );

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 900 ? true : false;
      setIsMobile(isMobile);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userId: string | null = useSelector(
    (state: RootState) => state.currentUser
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [popupActive, setPopupActive] = useState(false);
  const [popupAction, setPopupAction] = useState<string | undefined>();

  const users = useSelector((state: RootState) => state.users);
  const items = useSelector((state: RootState) => state.items);
  const currentUser = users.find((user: User) => user._id === userId);
  const currentUserItems = items.filter(
    (item: Item) => item.seller._id === userId
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [selectedFilesFormatError, setSelectedFilesFormatError] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [deletedPhotoId, setDeletedPhotoId] = useState<string | undefined>();

  useEffect(() => {
    if (selectedFile && selectedFile.type) {
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

  const uploadImage = useCallback(async () => {
    if (!selectedFile) return;
    if (selectedFile) {
      if (selectedFilesFormatError) return;
      if (!userId) return;
      try {
        setIsLoading(true);
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          await axios.post(`${baseUrl}/api/upload/profile`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              userid: userId,
            },
          });
        }
        const users = await axios.get(`${baseUrl}/api/users`);
        setSelectedFile(undefined);
        if (fileUploadRef.current) fileUploadRef.current.value = "";
        dispatch(loadUsers(users.data));
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        console.log(error);
      }
    }
  }, [baseUrl, userId, dispatch, selectedFile, selectedFilesFormatError]);

  useEffect(() => {
    uploadImage();
  }, [selectedFile, uploadImage]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setSelectedFile(files[0]);

    if (selectedFilesFormatError) return;
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${baseUrl}/api/users/${userId}`);
      const users = await axios.get(`${baseUrl}/api/users`);
      const items = await axios.get(`${baseUrl}/api/items`);
      dispatch(setCurrentUser(null));
      localStorage.removeItem("jwt");
      dispatch(loadUsers(users.data));
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
    try {
      setIsLoading(true);
      if (currentUser?.userPicture) {
        await axios.post(`${baseUrl}/api/deleteAvatar`, {
          filePath: deletedPhotoId,
          userId: userId,
        });
        const users = await axios.get(`${baseUrl}/api/users`);
        setPopupAction(undefined);
        dispatch(loadUsers(users.data));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
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
                ? handleDeleteUser
                : handleDeletePhoto
            }
          >
            {popupAction === "deleteItem" &&
              "Вы уверены, что хотите удалить эту страницу?"}
            {popupAction === "deletePhoto" &&
              "Вы уверены, что хотите удалить эту фотографию?"}
          </Popup>
          <NavBar />
          <div className="profile_page">
            <div className="profile_page_main_container">
              <div className="profile_page_picture_container">
                {currentUser?.userPicture ? (
                  <div className="profile_page_picture_container_within">
                    {!isMobile && (
                      <img
                        className="delete_photo_icon_profile"
                        src="/delete_photo_icon.svg"
                        alt=""
                        draggable={false}
                        onClick={() => {
                          setPopupActive(true);
                          setDeletedPhotoId(currentUser.userPicture);
                          setPopupAction("deletePhoto");
                          handleDeletePhoto();
                        }}
                      />
                    )}
                    <img
                      src={`${baseUrl}${currentUser.userPicture}`}
                      alt=""
                      className="profile_page_picture"
                    />
                  </div>
                ) : (
                  <div className="profile_page_picture_placeholder">
                    <div
                      className="add_photo_placeholder_profile"
                      onClick={handleCustomFileInputClick}
                    >
                      <img
                        src="/add_photo_icon.svg"
                        alt=""
                        className="add_photo_icon_profile"
                      />
                      <input
                        type="file"
                        id="item_page_add_photo"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                        accept="image/*"
                        ref={fileUploadRef}
                      />
                    </div>
                    {selectedFilesFormatError && (
                      <div className="item_page_error_msg_container">
                        <p className="form_error_msg_item_page">
                          Выберите файлы поддерживаемого формата: "jpeg", "jpg",
                          "png"{" "}
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
              </div>
              <div className="profile_page_user_info_container">
                <div className="edit_container_profile">
                  <h1 className="profile_page_user_info_header">
                    Ваши данные:
                  </h1>
                  <div>
                    {isMobile && currentUser && currentUser.userPicture && (
                      <img
                        className="delete_photo_icon_profile"
                        src="/delete_photo_icon.svg"
                        alt=""
                        draggable={false}
                        onClick={() => {
                          setPopupActive(true);
                          setDeletedPhotoId(currentUser.userPicture);
                          setPopupAction("deletePhoto");
                          handleDeletePhoto();
                        }}
                      />
                    )}
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
                      alt=" "
                      draggable={false}
                      onClick={() => navigate("/profile/edit")}
                    />
                  </div>
                </div>
                <div className="user_info_main_container">
                  {currentUser && (
                    <>
                      <div className="seller_card">
                        <img
                          src={
                            currentUser.userPicture
                              ? `${baseUrl}${currentUser.userPicture}`
                              : "/defaultPicture.png"
                          }
                          alt=""
                          className="nav_bar_profile_img image_skeleton"
                        />
                        <div className="nav_bar_profile_name">
                          {currentUser.name}
                        </div>
                      </div>
                      <div className="seller_card">
                        <img
                          src="/phone_icon.jpg"
                          alt=""
                          className="nav_bar_profile_img image_skeleton"
                        />
                        <div className="nav_bar_profile_name">
                          {currentUser.phone}
                        </div>
                      </div>
                      <div className="seller_card">
                        <img
                          src="/email_icon.png"
                          alt=""
                          className="nav_bar_profile_img image_skeleton"
                        />
                        <div className="nav_bar_profile_name">
                          {currentUser.email}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {currentUserItems && currentUserItems.length > 0 && (
              <div className="profile_page_items_container">
                <div className="profile_page_items_header_wrapper">
                  <h2 className="profile_page_items_header">
                    Ваши предложения
                  </h2>
                </div>
                <ItemSmallContainer
                  pageLimit={9}
                  items={currentUserItems}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
