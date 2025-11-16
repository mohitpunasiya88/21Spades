// Contract ABIs and addresses
import ERC721Marketplace from './abi/ERC721Marketplace.sol/ERC721MarketPlace.json';
import ERC721Mintable from './abi/ERC721Mintable.sol/ERC721Mintable.json';
import ERC721Factory from './abi/ERC721Factory.sol/ERC721Factory.json';
import ERC721Collection from './abi/ERC721Collection.sol/ERC721Collection.json';

export const CONTRACTS = {
  ERC721Marketplace: {
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
    abi: ERC721Marketplace,
  },
  ERC721Mintable: {
    address: process.env.NEXT_PUBLIC_ERC721_MINTABLE_ADDRESS || '',
    abi: ERC721Mintable,
  },
  ERC721Factory: {
    address: process.env.NEXT_PUBLIC_ERC721_FACTORY_ADDRESS || '',
    abi: ERC721Factory,
  },
  ERC721Collection: {
    address: process.env.NEXT_PUBLIC_ERC721_COLLECTION_ADDRESS || '',
    abi: ERC721Collection,
  },
  // Add other contracts as needed
} as const;

export type ContractName = keyof typeof CONTRACTS;
