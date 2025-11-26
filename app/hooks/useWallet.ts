// Update the imports at the top of the file
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';

export function useWallet() {
  const { ready, authenticated, user, login, logout, linkEmail, linkGoogle, linkTwitter, unlinkEmail, unlinkGoogle, unlinkTwitter, unlinkDiscord, unlinkGithub, unlinkApple, unlinkLinkedIn } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [walletAddresses, setWalletAddresses] = useState<any>([]);

  // Get the embedded wallet
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
  const embeddedWallets = wallets.filter(wallet => wallet.walletClientType === 'privy');



  // Initialize provider and signer
  useEffect(() => {
    const init = async () => {
      try {
        if (embeddedWallet && embeddedWallets.length > 0) {

          embeddedWallets.forEach(wallet => {
            
            setWalletAddresses(wallet.address);
          })
          // Use getEthereumProvider to get the provider
          const ethereumProvider = await embeddedWallet.getEthereumProvider();
          const provider = new ethers.BrowserProvider(ethereumProvider);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();
          const balance = await provider.getBalance(address);
          setProvider(provider);
          setSigner(signer);
          setAddress(address);
          setChainId(Number(network.chainId));
          setBalance(ethers.formatEther(balance));
          
          // Set up event listeners
          const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
              // Handle account disconnection
              setAddress(null);
            } else if (accounts[0] !== address) {
              setAddress(accounts[0]);
            }
          };
          
          const handleChainChanged = (chainId: string) => {
            setChainId(parseInt(chainId, 16));
            window.location.reload();
          };
          
          ethereumProvider.on('accountsChanged', handleAccountsChanged);
       
          
          return () => {
            ethereumProvider.removeListener('accountsChanged', handleAccountsChanged);
          };
        }
      } catch (err) {
        console.error('Failed to initialize wallet:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (ready && embeddedWallet) {
      init();
    } else {
      setIsLoading(false);
    }
  }, [ready, authenticated, embeddedWallet]);

  // Sign a message
  const signMessage = useCallback(async (message: string) => {
    if (!signer) {
      throw new Error('No signer available');
    }
    return signer.signMessage(message);
  }, [signer]);

  // Sign a transaction
  const signTransaction = useCallback(async (transaction: ethers.TransactionRequest) => {
    if (!signer) {
      throw new Error('No signer available');
    }
    return signer.signTransaction(transaction);
  }, [signer]);

  // Send a transaction
  const sendTransaction = useCallback(async (transaction: ethers.TransactionRequest) => {
    if (!signer) {
      throw new Error('No signer available');
    }
    const tx = await signer.sendTransaction(transaction);
    return tx.wait();
  }, [signer]);

  // Connect to a different network
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!window.ethereum) {
      throw new Error('No ethereum provider found');
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        throw new Error(`Chain with ID ${chainId} not found. Please add it to your wallet.`);
      }
      throw switchError;
    }
  }, []);

  return {
    // State
    isConnected: !!address,
    address,
    walletAddresses,
    chainId,
    balance,
    provider,
    signer,
    isLoading,
    error,
    user,
    
    // Authentication
    login,
    logout,
    linkEmail,
    linkGoogle,
    linkTwitter,
    unlinkEmail,
    unlinkGoogle,
    unlinkTwitter,
    unlinkDiscord,
    unlinkGithub,
    unlinkApple,
    unlinkLinkedIn,
    
    // Wallet operations
    signMessage,
    signTransaction,
    sendTransaction,
    switchNetwork,
  };
}