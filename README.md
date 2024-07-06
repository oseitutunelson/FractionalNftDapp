# FractionalNftDapp
A web3 application for making fractional nfts
Unlock the potential of your digital assets with
this innovative platform. Create fractional NFTs,
allowing you to share ownership of unique
digital items with others. Easily list your
fractionalized NFTs for sale and engage in a new
era of collaborative ownership. 

# Overview
The contract enables the fractional ownership and trading of NFTs. It allows the owner to initialize NFTs from various collections, set them for sale, and enables users to purchase fractional shares or the entire NFT. Users can also redeem their shares for Ether once the NFT is fully purchased.

## Features

- Initialize NFTs: Fractionalize NFTs into a specified number of shares.
- Put NFTs for Sale: Set a specific NFT for sale with a specified price.
- Purchase Shares: Buy fractional shares of a specific NFT.
- Purchase Full NFT: Buy the entire NFT by paying the full sale price.
- Redeem Shares: Redeem shares for Ether after the NFT has been fully purchased.

## Contract Structure
- Contracts and Libraries Used
- ERC20: Standard interface for ERC20 tokens.
- IERC721: Standard interface for ERC721 NFTs.
- Ownable: Contract module which provides a basic access control mechanism.
- ERC721Holder: Provides safe handling of ERC721 tokens.

## Main Contract: FractionalNft


* State Variables
- nftCollections: Mapping to keep track of a collection's NFTs and their data.

* Structs
- NFTInfo: Contains details about each NFT (tokenId, shares, forSale status, salePrice, redeemable status).
* Events
- Initialized: Emitted when an NFT is initialized.
- PutForSale: Emitted when an NFT is put up for sale.
- Purchased: Emitted when an NFT is fully purchased.
- PurchasedShare: Emitted when shares of an NFT are purchased.
- Redeemed: Emitted when shares are redeemed for Ether.

## Functions

* initialize
- Initializes an NFT by fractionalizing it into the specified number of shares. Transfers the NFT to the contract and mints the shares to the owner.
```
function initialize(address _collection, uint16 _tokenId, uint256 _amount) external onlyOwner

```

* putForSale
- Puts a specific NFT up for sale at the specified price.

```
function putForSale(address _collection, uint16 _tokenId, uint256 price) external onlyOwner

```
* Purchase
- Allows a user to purchase the entire NFT by paying the full sale price.
```
function purchase(address _collection, uint16 _tokenId) external payable

```
* purchaseShare
- Allows a user to purchase a specified number of shares of an NFT.

```
function purchaseShare(address _collection, uint16 _tokenId, uint256 shareAmount) external payable

```

* redeem
- Allows a user to redeem their shares for Ether once the NFT is fully purchased and redeemable.

## Nft Contract

- Allows you to create your own collection of nfts

## Frontend Interaction

To interact with the contract from a frontend application, you can use web3.js or ethers.js. 

## Conclusion
This Fractional NFT contract provides a robust solution for fractionalizing NFTs and enabling fractional ownership. By integrating this contract with a frontend application, users can easily interact with the contract to buy, sell, and redeem NFT shares.