import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import "./UploadNFTForm.css";

const UploadNFTForm = ({ contract }) => {
  const [nftName, setNFTName] = useState("");
  const [nftDescription, setNFTDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const imageUploadResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "6aa6d618629828969cf8",
            pinata_secret_api_key: "a1eef6f14dfda8c8b486563f61d272990549429ebdfb1fbbad5d6ab8e7ac39c7",
          },
        }
      );
      console.log('img done');

      const nftData = {
        name: nftName,
        description: nftDescription,
        imageCID: imageUploadResponse.data.IpfsHash,
      };

      const nftUploadResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        nftData,
        {
          headers: {
            pinata_api_key: "6aa6d618629828969cf8",
            pinata_secret_api_key: "a1eef6f14dfda8c8b486563f61d272990549429ebdfb1fbbad5d6ab8e7ac39c7",
          },
        }
      );

      console.log("NFT done");

        const tx = await contract.mint(
          nftUploadResponse.data.IpfsHash
      );

      await tx.wait();

      setNFTName("");
      setNFTDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading and minting NFT:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="UploadNFTForm">
        <form onSubmit={handleFormSubmit}>
          <label>
            <p className="head"> NFT Name : </p>
            <input
              className="input"
              type="text"
              value={nftName}
              onChange={(e) => setNFTName(e.target.value)}
              required
            />
          </label>
          <div className="space"></div>
          <label>
            <p className="head"> NFT Description : </p>
            <textarea
              value={nftDescription}
              onChange={(e) => setNFTDescription(e.target.value)}
              required
            />
          </label>
          <div className="space"></div>
          <div className="space"></div>
          <label>
            <p className="head"> Image : </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </label>
          <div className="space"></div>
          <hr />
          <div className="space"></div>
          <div className="submitbtn">
            <button class="btn" type="submit" disabled={loading}>
              <svg>
                <defs>
                  <linearGradient id="gradiant">
                    <stop stop-color="#FF8282" offset="0%"></stop>
                    <stop stop-color="#E178ED" offset="100%"></stop>
                  </linearGradient>
                </defs>
                <rect
                  height="50"
                  width="150"
                  stroke="url(#gradiant)"
                  fill="none"
                ></rect>
              </svg>
              <span>{loading ? "Uploading..." : "Submit"}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadNFTForm;
