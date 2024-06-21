import React, { useEffect, useState } from "react";
import "./NFTmodal.css";
import { ethers } from "ethers";

function NFTmodal({ nft, contract, setSelectedNFT}) {
  

  return (
    <div className="NFTmodal">
      <div className="upperContent">
        <div className="left">
          <img src={`https://ipfs.io/ipfs/${nft.metadata.imageCID}`} alt="" />
        </div>
        <div className="right">
          <p className="title">
            {nft.metadata.name} #{nft.nft.toString()}
          </p>

          <hr />

          <div className="column">
            <div className="column1">
              <p className="c1Content">
                Token ID: {nft.nft.toString()}
              </p>
              <p className="c1Content">
                Owner: {nft.owner.slice(0, 6) + "..." + nft.owner.slice(38, 42)}
              </p>
            </div>
            <div className="column2">
              <p className="c2Content">Token Standars: ERC-721 (SoulBound)</p>
            </div>
          </div>
          
          <hr />
          <p className="description">{nft.metadata.description}</p>
        </div>
      </div>
    </div>
  );
}

export default NFTmodal;
