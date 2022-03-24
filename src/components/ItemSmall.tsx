import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  itemId: string;
  name: string;
  price: string;
  pictures: string[] | undefined;
  description: string;
}

const ItemSmall: React.FC<Props> = ({
  name,
  price,
  pictures,
  description,
  itemId,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPreviewIdx, setCurrentPreviewIdx] = useState<number>(0);
  const baseUrl = process.env.REACT_APP_BASE_SERVER_URL;

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setIsMobile(true);
    }
  }, []);

  const imgSrc =
    pictures && pictures.length > 0
      ? `${baseUrl}${pictures[currentPreviewIdx]}`
      : "/defaultPicture.png";

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="item_small" onClick={handleNavigate}>
      <div className="item_small_picture_container">
        <img
          src={imgSrc}
          alt=""
          className="item_small_picture image_skeleton"
        />
        {pictures && pictures.length > 1 && !isMobile && (
          <div className="pictureSelect_wrapper">
            {pictures.map((picture: string, idx: number) => (
              <div
                key={idx}
                className="pictureSelect_option_container"
                onMouseEnter={() => setCurrentPreviewIdx(idx)}
              >
                <div
                  className={`${
                    currentPreviewIdx === idx
                      ? "pictureSelect_option_active"
                      : "pictureSelect_option"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="item_small_info">
        <h1 className="item_small_info_name">{name}</h1>
        <h2 className="item_small_info_price">{price}</h2>
        <p className="item_small_info_description">{description}</p>
      </div>
    </div>
  );
};

export default ItemSmall;
