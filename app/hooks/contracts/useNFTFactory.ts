import { useCallback } from 'react';
import { BigNumberish, ethers } from 'ethers';
import { useContract } from './useContract';

type CreateCollectionParams = {
  name: string;
  symbol: string;
  contractURI: string;
  tokenURIPrefix: string;
  royaltyLimit: number;
};

export function useNFTFactory() {
  const { call, execute,getGasLimit, ...rest } = useContract();

  // Mint a new NFT
  const createCollection = useCallback(async (params: CreateCollectionParams): Promise<ethers.TransactionReceipt> => {
      const gas = await getGasLimit(
      'ERC721Factory', 'createCollection', 11155111, "",
      [params.name, params.symbol, params.contractURI, params.tokenURIPrefix, params.royaltyLimit],

    );
    const receipt=  await execute('ERC721Factory', 'createCollection', 11155111,"", [
      params.name,
      params.symbol,
      params.contractURI,
      params.tokenURIPrefix,
      params.royaltyLimit,
    ],
    {
      gasLimit: gas,
    });
    return receipt
  }, [execute,getGasLimit]);

  const setMintableAddress = useCallback(async (address: string) => {
    return execute('ERC721Factory', 'setMintableAddress', 11155111,"", [address]);
  }, [execute]);

  const getAllCollection = useCallback(async () => {
    return call('ERC721Factory', 'getAllCollection', 11155111,"",);
  }, [call]);

  const getUserCollection = useCallback(async (address: string) => {
    return call('ERC721Factory', 'getUserCollection', 11155111,"", [address]);
  }, [call]);

  const getMintableAddress = useCallback(async () => {
    return call('ERC721Factory', 'getMintableAddress', 11155111,"",);
  }, [call]);

  return {
    createCollection,
    setMintableAddress,
    getAllCollection,
    getUserCollection,
    getMintableAddress,
    ...rest,
  };
}
