import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { CONTRACTS, ContractName } from '../../utils/contracts/contractConfig';

type ContractMethod = {
    name: string;
    args: any[];
    overrides?: ethers.Overrides;
};

type ContractCallOptions = {
    onSuccess?: (result: any) => void;
    onError?: (error: Error) => void;
};

export function useContract() {
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [transaction, setTransaction] = useState<ethers.TransactionResponse | null>(null);

    // Get the embedded wallet
    const embeddedWallet = wallets.find((wallet: any) => wallet.walletClientType === 'privy');

    // Get a contract instance
    const getContract = useCallback(async (contractName: ContractName, chainId?: number) => {
        if (!ready || !authenticated) {
            throw new Error('Please connect your wallet first');
        }
        if (!embeddedWallet) {
            throw new Error('Wallet not connected. Please connect your Privy wallet.');
        }

        if (chainId) {
            await embeddedWallet.switchChain(chainId);
        }
        const ethProvider = await embeddedWallet.getEthereumProvider();
        const provider = new ethers.BrowserProvider(ethProvider);

        ;
        const signer = await provider.getSigner();

        const contractConfig = CONTRACTS[contractName];
        if (!contractConfig) {
            throw new Error(`Contract ${contractName} not found`);
        }


        return new ethers.Contract(
            contractConfig.address,
            contractConfig.abi.abi,
            signer
        );
    }, [embeddedWallet, ready, authenticated]);

    // Call a read-only contract method
    const call = useCallback(async <T = any>(
        contractName: ContractName,
        method: string,
        chainId?: number,
        contractAddress?: string | undefined,
        args: any[] = [],
        options: ContractCallOptions = {}
    ): Promise<T> => {
        try {
            setIsLoading(true);
            setError(null);

            let contract: ethers.Contract;

            if (contractName === 'ERC721Collection') {
                contract = new ethers.Contract(
                    contractAddress as string,
                    CONTRACTS[contractName].abi.abi,

                );

            } else {
                contract = await getContract(contractName, chainId);
            }

            const result = await contract[method](...args);

            if (options.onSuccess) {
                options.onSuccess(result);
            }

            return result;
        } catch (err) {
            const error = err as Error;
            setError(error);
            if (options.onError) {
                options.onError(error);
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [getContract]);


    const getSigner = useCallback(async () => {
        if (!ready || !authenticated) {
            throw new Error('Please connect your wallet first');
        }
        // Get fresh wallets array - it's reactive from useWallets hook
        const currentWallets = wallets;
        const embeddedWallet: any = currentWallets.find((w: any) => w.walletClientType === 'privy');
        if (!embeddedWallet) {
            // Give it one more chance - wait a bit and check again
            await new Promise(resolve => setTimeout(resolve, 500));
            const retryWallets = wallets;
            const retryWallet = retryWallets.find((w: any) => w.walletClientType === 'privy');
            if (!retryWallet) {
                throw new Error('Wallet not connected. Please connect your Privy wallet.');
            }
            const ethProvider = await retryWallet.getEthereumProvider();
            const provider = new ethers.BrowserProvider(ethProvider);
            return provider.getSigner();
        }
        const ethProvider = await embeddedWallet.getEthereumProvider();
        const provider = new ethers.BrowserProvider(ethProvider);
        return provider.getSigner();
    }, [wallets, ready, authenticated]);
    // Execute a write contract method
    const execute = useCallback(async <T = any>(
        contractName: ContractName,
        method: string,
        chainId?: number,
        contractAddress?: string | undefined,
        args: any[] = [],
        overrides: ethers.Overrides = {},
        options: ContractCallOptions = {}
    ): Promise<ethers.ContractTransaction> => {
        try {
            setIsLoading(true);
            setError(null);
            let contract: ethers.Contract;
            // debugger
            const signer = await getSigner();
            if (contractName === 'ERC721Collection') {
                contract = new ethers.Contract(
                    contractAddress as string,
                    CONTRACTS[contractName].abi.abi,
                    signer
                );

            } else {
                contract = await getContract(contractName, chainId);
            }

            const tx = await contract[method](...args, {
                ...overrides,
                value: overrides.value || 0,
                // gasLimit: 500000, // Adjust based on your needs
            });

            setTransaction(tx);
            const receipt = await tx.wait();

            if (options.onSuccess) {
                options.onSuccess(receipt);
            }

            return receipt;
        } catch (err) {
            const error = err as Error;
            setError(error);
            if (options.onError) {
                options.onError(error);
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [getContract]);

    return {
        call,
        execute,
        isLoading,
        error,
        transaction,
        isConnected: !!embeddedWallet,
        wallet: embeddedWallet,
    };
}
