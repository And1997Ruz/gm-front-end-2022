import React from "react";

interface Props {
  hidden: boolean;
}

const NothingFound: React.FC<Props> = ({ hidden }) => {
  return (
    <div className="nothing_found_wrapper">
      <img
        src="nothing_found.jpg"
        alt="nothing found"
        className="nothing_found_img"
        hidden={hidden}
      />
    </div>
  );
};

export default NothingFound;
