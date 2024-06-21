import React from "react";
import "./NFTcard.css";

function NFTcard({
  id,
  title,
  description,
  img,
  setSelectedNFT,
  nft,
  owner
}) {
  const handleClick = () => {
    setSelectedNFT(nft);
  };

  return (
    <div className="NFTcard" onClick={handleClick}>
      <div className="image">
        {/* eslint-disable-next-line */}
        <img src={img} />
      </div>
      <div className="details">
        <div className="left">
          <p className="title">{title}</p>
          <p className="address">
            {owner.slice(0, 6) + "..." + owner.slice(38, 42)}
          </p>
        </div>
        <div className="right">
          <p className="id">#{id}</p>
          <p className="Sbt">Sbt</p>
        </div>
      </div>
    </div>
  );
}

export default NFTcard;
