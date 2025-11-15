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

export function useNFT() {
  const { call, execute, ...rest } = useContract();

  // Mint a new NFT
  const mint = useCallback(async (params: MintParams) => {
    return execute('ERC721Mintable', 'mint', 11155111,"", [
      params.tokenURI,
      params.royalty,
      params.to,
    ], {
      value: ethers.parseEther("0.00001"),
    });
  }, [execute]);

  // Lazy mint an NFT (mint on first purchase)
  const lazyMint = useCallback(async (params: LazyMintParams) => {
    return execute('ERC721Mintable', 'lazyMint', 11155111,"", [
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
  const getTokenURI = useCallback(async (tokenId: BigNumberish) => {
    return call('ERC721Mintable', 'tokenURI', 11155111,"", [tokenId]);
  }, [call]);

  // Get token royalty info
  const getRoyaltyInfo = useCallback(async (tokenId: BigNumberish, salePrice: BigNumberish) => {
    return call('ERC721Mintable', 'royaltyInfo', 11155111,"", [tokenId, salePrice]);
  }, [call]);

  // Get owner of a token
  const getOwnerOf = useCallback(async (tokenId: BigNumberish) => {
    return call('ERC721Mintable', 'ownerOf', 11155111,"", [tokenId]);
  }, [call]);

  // Check if an address is an approved operator for a token
  const isApproved = useCallback(async (owner: string, operator: string) => {
    return call('ERC721Mintable', 'isApprovedForAll', 11155111,"", [owner, operator]);
  }, [call]);

  // Set approval for all tokens
  const setApprovalForAll = useCallback(async (operator: string, approved: boolean) => {
    return execute('ERC721Mintable', 'setApprovalForAll', 11155111,"", [operator, approved]);
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
