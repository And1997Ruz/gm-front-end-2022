import React from "react";

interface Props {
  action?: () => void;
  resetAction?: (value: React.SetStateAction<string | undefined>) => void;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<Props> = ({
  children,
  active,
  setActive,
  action,
  resetAction,
}) => {
  return (
    <div className="popup_container">
      <div
        className={
          active ? "popup_wrapper popup_active" : "popup_wrapper popup_inactive"
        }
      >
        <div
          className={
            active
              ? "popup_content popup_content_active"
              : "popup_content popup_content_inactive"
          }
        >
          {children}
          {!action ? (
            <button className="popup_btn" onClick={() => setActive(false)}>
              Ок
            </button>
          ) : (
            <div>
              <button
                className="popup_btn"
                onClick={() => {
                  if (resetAction) resetAction(undefined);
                  setActive(false);
                }}
              >
                Нет
              </button>
              <button
                className="popup_btn"
                onClick={() => {
                  setActive(false);
                  action();
                }}
              >
                Да
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
