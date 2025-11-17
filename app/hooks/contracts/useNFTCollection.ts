import { useCallback } from 'react';
import { BigNumberish, ethers } from 'ethers';
import { useContract } from './useContract';

type MintParams = {
  to: string;
  tokenURI: string;
  royalty: number;
};

type LazyMintParams = {
  to: string;
  tokenId: BigNumberish;
  tokenURI: string;
  royalty: number;
  signature: string;
};

export function useNFTCollection() {
  const { call, execute,getGasLimit, ...rest } = useContract();

  // Mint a new NFT
  const mint = useCallback(async (params: MintParams, contractAddress?: string) => {
    debugger;

    const mintCharges = await call('ERC721Mintable', 'mintingCharge', 11155111, contractAddress, []);

    const gas = await getGasLimit(
      'ERC721Collection', 'mint', 11155111, contractAddress, [
        params.tokenURI,
        params.royalty,
        params.to,
      ],
      {
        value: mintCharges
      }
    );
    return execute('ERC721Collection', 'mint', 11155111, contractAddress, [
     params.tokenURI,
      params.royalty,
      params.to,
    ], {
      value: mintCharges,
      gasLimit: gas,
    });
  }, [execute]);

  // Lazy mint an NFT (mint on first purchase)
  const lazyMint = useCallback(async (params: LazyMintParams, contractAddress?: string) => {
    return execute('ERC721Collection', 'lazyMint', 11155111, contractAddress, [
      {
        to: params.to,
        tokenId: params.tokenId,
        tokenURI: params.tokenURI,
        royalty: params.royalty,
      },
      params.signature,
    ]);
  }, [execute]);

  // Get token URI
  const getTokenURI = useCallback(async (tokenId: BigNumberish, contractAddress?: string) => {
    return call('ERC721Collection', 'tokenURI', 11155111, contractAddress, [tokenId]);
  }, [call]);

  // Get token royalty info
  const getRoyaltyInfo = useCallback(async (tokenId: BigNumberish, salePrice: BigNumberish, contractAddress?: string) => {
    return call('ERC721Collection', 'royaltyInfo', 11155111, contractAddress, [tokenId, salePrice]);
  }, [call]);

  // Get owner of a token
  const getOwnerOf = useCallback(async (tokenId: BigNumberish, contractAddress?: string) => {
    return call('ERC721Collection', 'ownerOf', 11155111, contractAddress, [tokenId]);
  }, [call]);

  // Check if an address is an approved operator for a token
  const isApproved = useCallback(async (owner: string, operator: string, contractAddress?: string) => {
    return call('ERC721Collection', 'isApprovedForAll', 11155111, contractAddress, [owner, operator]);
  }, [call]);

  // Set approval for all tokens
  const setApprovalForAll = useCallback(async (operator: string, approved: boolean, contractAddress?: string) => {
    return execute('ERC721Collection', 'setApprovalForAll', 11155111, contractAddress, [operator, approved]);
  }, [execute]);

  return {
    mint,
    lazyMint,
    getTokenURI,
    getRoyaltyInfo,
    getOwnerOf,
    isApproved,
    setApprovalForAll,
    ...rest,
  };
}
