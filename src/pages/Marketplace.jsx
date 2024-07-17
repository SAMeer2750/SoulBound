import React, { useState, useEffect } from "react";
import NFTcard from "../components/NFTcard";
import "./Marketplace.css";
import NFTmodal from "./NFTmodal";
import axios from "axios";

function Marketplace({ contract, isConnected, account }) {
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contract) {
      getAllNFTs();
    }
  }, [contract, isConnected, account]);

  const getAllNFTs = async () => {
    setIsLoading(true);

    let sbts = []
    const totalSupply = await contract.getTotalCount();
    console.log(parseInt(totalSupply)-2);

    for(let i = 2 ; i< parseInt(totalSupply); i++){

      sbts.push(i+1);
    }
    setNfts(sbts);

    setIsLoading(false);
  };

  const fetchNFTMetadata = async (tokenURI) => {
    try {
      const response = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      return null;
    }
  };

  useEffect(() => {

    const fetchNFTDetails = async () => { 
      setIsLoading(true);
      const updatedNFTs = await Promise.all(
        nfts.map(async (nft) => {
          console.log(`-----`,nft -2);
          const uri = await contract.tokenURI(nft);
          console.log(uri);
          const metadata = await fetchNFTMetadata(uri);
          console.log("Metadata for tokenId", nft, ":", metadata);
          const owner = await contract.ownerOf(nft);
          return { ...nft, metadata,nft,owner };
        })
      );
      setIsLoading(false);
      console.log("Updated NFTs:", updatedNFTs);
      setNfts(updatedNFTs);
    };

    const fetchNFTs = async () => {
      if (nfts.length > 0 && !nfts[0].metadata) {
        await fetchNFTDetails();
      }
    };

    fetchNFTs();
  }, [nfts]);

  return (
    <>
      <div className="Marketplace">
        {isConnected && !isLoading && nfts.length > 0 ? (
          <p className="trending">Trending NFTs 🔥</p>
        ) : null}
        <div className="NFTitems">
          {isConnected && nfts.length > 0 ? (
            <>
              {isLoading ? (
                <>
                  <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div className="overlay"></div>
                </>
              ) : (
                nfts
                  .slice(0)
                  .reverse()
                  .map((nft) => (
                    <React.Fragment key={nft}>
                      {isConnected && nft.metadata ? (
                        <NFTcard
                          id={nft.nft.toString()}
                          title={nft.metadata.name}
                          description={nft.metadata.description}
                          img={`https://ipfs.io/ipfs/${nft.metadata.imageCID}`}
                          setSelectedNFT={setSelectedNFT}
                          nft={nft}
                          owner={nft.owner}
                        />
                      ) : null}
                    </React.Fragment>
                  ))
              )}
            </>
          ) : (
            <>
              <div className="pageTitle">
                <p className="heading">
                  "Step into the captivating realm of Soul-Bound, where a
                  kaleidoscope of breathtaking NFTs awaits to mesmerize your
                  senses. By IGNITUS NETWORKS"
                </p>
              </div>
              <p className="connectWalletMsg">
                Connect your wallet in order to see your NFTs.
              </p>
            </>
          )}
        </div>
        {selectedNFT && (
          <>
            <NFTmodal
              nft={selectedNFT}
              contract={contract}
              setSelectedNFT={setSelectedNFT}
              
            />
            <div className="overlay" onClick={() => setSelectedNFT(null)}></div>
          </>
        )}
      </div>
    </>
  );
}

export default Marketplace;
