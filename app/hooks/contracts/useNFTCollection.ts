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
  const { call, execute,getGasLimit, getEventFromTx, ...rest } = useContract();

  // Mint a new NFT
  const mint = useCallback(async (params: MintParams, contractAddress?: string) => {
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
      throw new Error('Invalid collection contract address passed to mint');
    }
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
    const response = await execute('ERC721Collection', 'mint', 11155111, contractAddress, [
     params.tokenURI,
      params.royalty,
      params.to,
    ], {
      value: mintCharges,
      gasLimit: gas,
    });
    const event = await getEventFromTx("ERC721Collection",response as any,"Transfer",11155111,contractAddress);
    return event;
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
    // Validate addresses before calling
    if (!owner || !operator || !contractAddress) {
      console.warn('isApproved: Missing required addresses', { owner, operator, contractAddress });
      return false;
    }
    
    if (!ethers.isAddress(owner) || !ethers.isAddress(operator) || !ethers.isAddress(contractAddress)) {
      console.warn('isApproved: Invalid address format', { owner, operator, contractAddress });
      return false;
    }

    try {
      const result = await call('ERC721Collection', 'isApprovedForAll', 11155111, contractAddress, [owner, operator]);
      // Ensure result is boolean
      return Boolean(result);
    } catch (error: any) {
      // If contract call fails (e.g., contract not deployed, invalid address, etc.), default to false
      console.warn('isApproved: Contract call failed, defaulting to false', error?.message || error);
      return false;
    }
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
