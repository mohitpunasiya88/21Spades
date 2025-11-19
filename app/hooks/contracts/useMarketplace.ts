import { useCallback } from 'react';
import { BigNumberish, BytesLike, ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallets } from '@privy-io/react-auth';
import { CONTRACTS } from '../../utils/contracts/contractConfig';

type Auction = {
  seller: string;
  currentBid: BigNumberish;
  highestBidder: string;
  auctionType: BigNumberish;
  startingPrice: BigNumberish;
  startingTime: BigNumberish;
  closingTime: BigNumberish;
  erc20Token: string;
};

type Brokerage = {
  seller: BigNumberish;
  buyer: BigNumberish;
};

type LazySellerVoucher = {
  to: string;
  royalty: number;
  tokenURI: string;
  nonce: BigNumberish;
  erc721: string;
  price: BigNumberish;
  erc20Token: string;
  sign: BytesLike;
};

type BuyerVoucher = {
  buyer: string;
  amount: BigNumberish;
  time: BigNumberish;
};

type BidInput = {
  _tokenId: BigNumberish;
  _erc721: string;
  amount: BigNumberish;
  bidder: string;
  _nonce: BigNumberish;
  sign: BytesLike;
  root: string;
  proof: string[];
};

export function useMarketplace() {
  const { call, execute, getGasLimit, ...rest } = useContract();
  const { wallets } = useWallets();
  const chainId = 11155111;

  const getSigner = useCallback(async () => {
    const embeddedWallet: any = wallets.find((w: any) => w.walletClientType === 'privy');
    if (!embeddedWallet) throw new Error('Wallet not connected');
    const ethProvider = await embeddedWallet.getEthereumProvider();
    const provider = new ethers.BrowserProvider(ethProvider);
    return provider.getSigner();
  }, [wallets]);

  const marketplaceAddress = CONTRACTS.ERC721Marketplace.address;

  const auctions = useCallback(async (erc721: string, tokenId: BigNumberish) => {
    return call('ERC721Marketplace', 'auctions', chainId,"", [erc721, tokenId]);
  }, [call]);



  const putSaleOff = useCallback(async (
    tokenId: BigNumberish,
    erc721: string,
    nonce: BigNumberish,
  ) => {
    return execute('ERC721Marketplace', 'putSaleOff', chainId,"", [tokenId, erc721, nonce]);
  }, [execute]);

  const getBrokerage = useCallback(async (erc20Token: string) => {
    return call('ERC721Marketplace', 'brokerage', chainId,"", [erc20Token]);
  }, [call]);

  const WETH = useCallback(async () => {
    return call('ERC721Marketplace', 'WETH', chainId,"",);
  }, [call]);

  const buy = useCallback(async (
    tokenId: BigNumberish, // nft id
    erc721: string, // collection address
    price: BigNumberish, // price
    nonce: BigNumberish, // nonce
    sign: BytesLike, // signature
    erc20Token: string, // erc20 token
    buyer: string, // buyer address
    overrides: ethers.Overrides = {},
  ) => {

          const gas = await getGasLimit(
      'ERC721Marketplace', 'buy', 11155111, "",
      [tokenId, erc721, price, nonce, sign, erc20Token, buyer],

    );
    return execute('ERC721Marketplace', 'buy', chainId,"", [tokenId, erc721, price, nonce, sign, erc20Token, buyer], { ...overrides, gasLimit: gas });
  }, [execute]);

  const buyBatch = useCallback(async (
    tokenId: BigNumberish,
    erc721: string,
    price: BigNumberish,
    nonce: BigNumberish,
    sign: BytesLike,
    erc20Token: string,
    buyer: string,
    root: string,
    proof: string[],
    overrides: ethers.Overrides = {},
  ) => {
    return execute('ERC721Marketplace', 'buyBatch', chainId,"",  [tokenId, erc721, price, nonce, sign, erc20Token, buyer, root, proof], overrides);
  }, [execute]);

  const bid = useCallback(async (
    tokenId: BigNumberish,
    erc721: string,
    amount: BigNumberish,
    bidder: string,
    auction: Auction,
    nonce: BigNumberish,
    sign: BytesLike,
    overrides: ethers.Overrides = {},
  ) => {
    const signer = await getSigner();
    
 const sellerAddr = await signer.getAddress();
      // Must match validateBidSign in helper: address(this), _auction.seller, _erc721, _tokenId, _nonce, _auction.startingPrice, _auction.startingTime, _auction.closingTime, _auction.erc20Token
     const message = ethers.solidityPackedKeccak256(
        [
          "address",
          "address",
          "address",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "address",
        ],
        [
          marketplaceAddress,
          sellerAddr,
          erc721,
          ethers.toBigInt(tokenId),
          ethers.toBigInt(nonce),
          ethers.toBigInt(auction.startingPrice),
          ethers.toBigInt(auction.startingTime),
          ethers.toBigInt(auction.closingTime),
          auction.erc20Token,
        ]
      );
    const recoveredAddress = ethers.verifyMessage(ethers.getBytes(message), sign as string);
    if (
      auction.erc20Token === ethers.ZeroAddress &&
      (overrides as any).value === undefined
    ) {
      const onChainAuction = (await auctions(erc721, tokenId)) as unknown as Auction;
      const amt = ethers.toBigInt(amount);
      const oneWei = ethers.toBigInt(1);
      let required = ethers.toBigInt(0);
      const hasOnChain = !!onChainAuction && onChainAuction.seller && onChainAuction.seller !== ethers.ZeroAddress;
      if (hasOnChain) {
        const currentBidBI = ethers.toBigInt(onChainAuction.currentBid);
        required = currentBidBI + oneWei;
      } else {
        const brokerCfg = (await getBrokerage(ethers.ZeroAddress)) as unknown as Brokerage;
        const dp = (await decimalPrecision()) as unknown as BigNumberish;
        const dpBI = ethers.toBigInt(dp);
        const buyerBps = ethers.toBigInt(brokerCfg.buyer);
        const start = ethers.toBigInt(auction.startingPrice);
        const denom = ethers.toBigInt(100) * dpBI;
        const initCurrent = start + (buyerBps * start) / denom;
        required = initCurrent + oneWei;
      }
      const sendValue = amt > required ? amt : required;
      overrides = { ...overrides, value: sendValue };
    }
    return execute('ERC721Marketplace', 'bid', chainId,"", [tokenId, erc721, amount, bidder, auction, nonce, sign], overrides);
  }, [execute]);

  const bidBatch = useCallback(async (
    auction: Auction,
    bidInput: BidInput,
    overrides: ethers.Overrides = {},
  ) => {
    return execute('ERC721Marketplace', 'bidBatch', chainId,"", [auction, bidInput], overrides);
  }, [execute]);

  const collect = useCallback(async (
    tokenId: BigNumberish,
    erc721: string,
  ) => {
    return execute('ERC721Marketplace', 'collect', chainId,"", [tokenId, erc721]);
  }, [execute]);

  const acceptOffer = useCallback(async (
    tokenId: BigNumberish,
    erc721: string,
    amount: BigNumberish,
    validTill: BigNumberish,
    bidder: string,
    erc20Token: string,
    nonce: BigNumberish,
    sign: BytesLike,
  ) => {
    return execute('ERC721Marketplace', 'acceptOffer', chainId,"", [tokenId, erc721, amount, validTill, bidder, erc20Token, nonce, sign]);
  }, [execute]);

  const cancelOffer = useCallback(async (
    tokenId: BigNumberish,
    erc721: string,
    amount: BigNumberish,
    validTill: BigNumberish,
    seller: string,
    erc20Token: string,
    nonce: BigNumberish,
    sign: BytesLike,
  ) => {
    return execute('ERC721Marketplace', 'cancelOffer', chainId,"", [tokenId, erc721, amount, validTill, seller, erc20Token, nonce, sign]);
  }, [execute]);

  const lazyMint = useCallback(async (
    collection: string,
    to: string,
    royalty: number,
    tokenURI: string,
    nonce: BigNumberish,
    price: BigNumberish,
    sign: BytesLike,
    buyer: string,
    overrides: ethers.Overrides = {},
  ) => {
    return execute('ERC721Marketplace', 'lazyMint', chainId,"", [collection, to, royalty, tokenURI, nonce, price, sign, buyer], overrides);
  }, [execute]);

  const acceptLazyOffer = useCallback(async (
    sellerVoucher: LazySellerVoucher,
    buyerVoucher: BuyerVoucher,
    nonce: BigNumberish,
    sign: BytesLike,
  ) => {
    return execute('ERC721Marketplace', 'acceptLazyOffer', chainId,"",   [sellerVoucher, buyerVoucher, nonce, sign]);
  }, [execute]);

  const lazyMintAuction = useCallback(async (
    sellerVoucher: {
      to: string;
      royalty: number;
      tokenURI: string;
      nonce: BigNumberish;
      erc721: string;
      startingPrice: BigNumberish;
      startingTime: BigNumberish;
      endingTime: BigNumberish;
      erc20Token: string;
    },
    buyerVoucher: BuyerVoucher,
    globalSign: BytesLike,
  ) => {
    return execute('ERC721Marketplace', 'lazyMintAuction', chainId,"", [sellerVoucher, buyerVoucher, globalSign]);
  }, [execute]);

  const auctionNonceStatus = useCallback(async (nonce: BigNumberish) => {
    return call('ERC721Marketplace', 'auctionNonceStatus', chainId,"", [nonce]);
  }, [call]);

  const broker = useCallback(async () => {
    return call('ERC721Marketplace', 'broker', chainId,"",);
  }, [call]);

  const decimalPrecision = useCallback(async () => {
    return call('ERC721Marketplace', 'decimalPrecision', chainId,"",);
  }, [call]);

  const createPutOnSaleSignature = useCallback(async (
    tokenId: BigNumberish,
    erc721: string,
    price: BigNumberish,
    nonce: BigNumberish,
    erc20Token: string,
    pricingType: 1 | 2,
    startingTime: BigNumberish,
    endingTime: BigNumberish,
  ) => {
    const signer = await getSigner();
    let message: string;
    if (pricingType !== 2) {
      message = ethers.solidityPackedKeccak256(
        ["address", "uint256", "address", "uint256", "uint256", "address"],
        [
          marketplaceAddress,
          ethers.toBigInt(tokenId),
          erc721,
          ethers.toBigInt(price),
          ethers.toBigInt(nonce),
          erc20Token,
        ]
      );
    } else {
      const sellerAddr = await signer.getAddress();
      // Must match validateBidSign in helper: address(this), _auction.seller, _erc721, _tokenId, _nonce, _auction.startingPrice, _auction.startingTime, _auction.closingTime, _auction.erc20Token
      message = ethers.solidityPackedKeccak256(
        [
          "address",
          "address",
          "address",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "uint256",
          "address",
        ],
        [
          marketplaceAddress,
          sellerAddr,
          erc721,
          ethers.toBigInt(tokenId),
          ethers.toBigInt(nonce),
          ethers.toBigInt(price),
          ethers.toBigInt(startingTime),
          ethers.toBigInt(endingTime),
          erc20Token,
        ]
      );
    }
    const signature = await signer.signMessage(ethers.getBytes(message));

    return { signature };
  }, [getSigner]);

  const createPutOnSaleBatchRootSignature = useCallback(async (
    root: string,
  ) => {
    const signer = await getSigner();
    const signature = await signer.signMessage(ethers.getBytes(root));
    return { signature };
  }, [getSigner]);



  return {
    auctions,
    putSaleOff,
    getBrokerage,
    WETH,
    buy,
    buyBatch,
    bid,
    bidBatch,
    collect,
    acceptOffer,
    cancelOffer,
    lazyMint,
    acceptLazyOffer,
    lazyMintAuction,
    auctionNonceStatus,
    broker,
    decimalPrecision,
    createPutOnSaleSignature,
    createPutOnSaleBatchRootSignature,
    ...rest,
  };
}
