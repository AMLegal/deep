// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact vadim@sovereignnature.com
contract DeepLink is ERC721, ERC721Burnable, Ownable {
    constructor() ERC721("DeepLink", "DLK") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://link.sovereignnature.com/api/";
    }

    function safeMint(
        address to,
        uint256 tokenId,
        string memory _elementId,
        string memory _conservationId
    ) public onlyOwner {
        _elementIds[tokenId] = _elementId;
        _conservationIds[tokenId] = _conservationId;

        _safeMint(to, tokenId);
    }

    mapping(uint256 => string) private _elementIds;

    function elementId(uint256 tokenId) public view returns (string memory) {
        string memory _elementId = _elementIds[tokenId];

        return _elementId;
    }

    mapping(uint256 => string) private _conservationIds;

    function conservationId(uint256 tokenId) public view returns (string memory) {
        string memory _conservationId = _conservationIds[tokenId];

        return _conservationId;
    }
}
