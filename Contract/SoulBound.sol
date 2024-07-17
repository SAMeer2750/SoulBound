    // SPDX-License-Identifier: UNLICENSED
    pragma solidity 0.8.0;

    import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
    import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

    contract SoulBound is ERC721URIStorage {

        error SoulboundToken(uint256 tokenId);

        uint256 private s_totalCount = 0;

        constructor() ERC721("SoulboundToken", "SBT")  {}

        function mint(
            string memory uri
        ) external {
            s_totalCount++;
            _mint(msg.sender, s_totalCount);
            _setTokenURI(s_totalCount, uri);
        }

        function transferFrom(
            address from,
            address to,
            uint256 tokenId
        ) public override(ERC721, IERC721) {
            revert SoulboundToken(tokenId);
        }

        function safeTransferFrom(
            address from,
            address to,
            uint256 tokenId,
            bytes memory data
        ) public override(ERC721, IERC721) {
            revert SoulboundToken(tokenId);
        }

        function getTotalCount() external view returns (uint256) {
            return s_totalCount;
        }
        function getTokenUri(uint256 tokenId) external view returns (string memory){
            return tokenURI(tokenId);
        }
    }
