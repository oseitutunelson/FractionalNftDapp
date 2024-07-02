//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

/**
 * @title  Nft  Contract
 * @author Owusu Nelson Osei Tutu
 * @notice A nft contract with additional features such as tokenURI
 */

import {ERC721URIStorage,ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Nft is ERC721URIStorage,Ownable{
   constructor(string memory name, string memory symbol,address initialOwner) ERC721(name,symbol) Ownable(initialOwner){}

   function mint(address _to,uint256 tokenId,string calldata _uri) external onlyOwner{
     _mint(_to,tokenId);
     _setTokenURI(tokenId,_uri);
   }
}
