// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {PriceConvertor} from './PriceConvertor.sol';
import {AggregatorV3Interface} from './AggregatorV3Interface.sol';

contract FractionalNft is ERC20, Ownable, ERC721Holder {

    using PriceConvertor for uint256;
    //nft structure
    struct NFTInfo {
        uint16 tokenId;
        uint256 shares; 
        bool forSale;
        uint256 salePrice;
        bool redeemable;
    }

    //pricefeed
    AggregatorV3Interface private s_priceFeed;

    mapping(uint256 => uint256) public tokenIdToPrice;
    
    //keep track of a collection's nft and its data
    mapping(address => mapping(uint16 => NFTInfo)) public nftCollections;

    //events
    event Initialized(address collection, uint16 tokenId, uint256 shares);
    event PutForSale(address collection, uint16 tokenId, uint256 price);
    event Purchased(address collection, uint16 tokenId, address buyer);
    event Redeemed(address collection, uint16 tokenId, address redeemer, uint256 amount);
    event PurchasedShare(address collection,uint16 tokenId, address buyer,uint256 shareAmount);

    constructor(address initialOwner,address priceFeed) ERC20("Angle Token", "ANT")  Ownable(initialOwner) {
        initialOwner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }
  
   //initialize an nft collection
   //fractionalizing the nft
    function initialize(address _collection, uint16 _tokenId, uint256 _amount) external onlyOwner {
        require(_amount > 0, "Can't initialize zero amount");
        require(nftCollections[_collection][_tokenId].shares == 0, "Already initialized");

        IERC721 collection = IERC721(_collection);
        collection.safeTransferFrom(msg.sender, address(this), _tokenId);

        nftCollections[_collection][_tokenId] = NFTInfo({
            tokenId: _tokenId,
            shares: _amount,
            forSale: false,
            salePrice: 0,
            redeemable: false
        });

        _mint(msg.sender, _amount);

        emit Initialized(_collection, _tokenId, _amount);
    }
    
    //put a specific nft for sale
    function putForSale(address _collection, uint16 _tokenId, uint256 price) external onlyOwner {
        NFTInfo storage nft = nftCollections[_collection][_tokenId];
        require(nft.shares > 0, "NFT not initialized");

        nft.forSale = true;
        nft.salePrice = price;
        tokenIdToPrice[_tokenId] += price;
        emit PutForSale(_collection, _tokenId, price);
    }
   
   //purchase a full nft 
    function purchase(address _collection, uint16 _tokenId) external payable {
        NFTInfo storage nft = nftCollections[_collection][_tokenId];
        require(nft.forSale, "Not for sale");
        require(msg.value.getConversionRate(s_priceFeed) >= nft.salePrice, "Not enough ether to purchase");

        IERC721(_collection).transferFrom(address(this), msg.sender, _tokenId);

        nft.forSale = false;
        nft.redeemable = true;

        emit Purchased(_collection, _tokenId, msg.sender);
    }
    

    //purchase some shares of a specific nft
    function purchaseShare(address _collection, uint16 _tokenId, uint256 shareAmount) external payable {
        NFTInfo storage nft = nftCollections[_collection][_tokenId];
        require(nft.forSale, "Not for sale");
        require(shareAmount > 0 && shareAmount <= nft.shares, "Invalid share amount");

        uint256 sharePrice = (nft.salePrice * shareAmount) / nft.shares;
        require(msg.value >= sharePrice, "Not enough ether to purchase shares");

        _mint(msg.sender, shareAmount);
        nft.shares -= shareAmount;

        if (nft.shares == 0) {
            nft.forSale = false;
            nft.redeemable = true;
            IERC721(_collection).transferFrom(address(this), msg.sender, _tokenId);
        }

        emit PurchasedShare(_collection, _tokenId, msg.sender, shareAmount);
    }

    //redeem your nft after purchasing 
    function redeem(address _collection, uint16 _tokenId, uint256 _amount) external {
        NFTInfo storage nft = nftCollections[_collection][_tokenId];
        require(nft.redeemable, "Redemption not available");

        uint256 totalEther = address(this).balance;
        uint256 amountToRedeem = _amount * totalEther / totalSupply();

        _burn(msg.sender, _amount);
        
        (bool sent, ) = payable(msg.sender).call{value: amountToRedeem}("");
        require(sent, "Failed to send Ether");

        emit Redeemed(_collection, _tokenId, msg.sender, amountToRedeem);
    }
}
