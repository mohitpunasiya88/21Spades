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
    const { wallets } = useWallets();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [transaction, setTransaction] = useState<ethers.TransactionResponse | null>(null);

    // Get the embedded wallet
    const embeddedWallet = wallets.find((wallet: any) => wallet.walletClientType === 'privy');

    // Get a contract instance
    const getContract = useCallback(async (contractName: ContractName, chainId?: number) => {
        if (!embeddedWallet) {
            throw new Error('Wallet not connected');
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
    }, [embeddedWallet]);

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
        const embeddedWallet: any = wallets.find((w: any) => w.walletClientType === 'privy');
        if (!embeddedWallet) throw new Error('Wallet not connected');
        const ethProvider = await embeddedWallet.getEthereumProvider();
        const provider = new ethers.BrowserProvider(ethProvider);
        return provider.getSigner();
    }, [wallets]);
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
            
            const signer = await getSigner();
            if (contractName === 'ERC721Collection') {
                contract = new ethers.Contract(
                    contractAddress as string,
                    CONTRACTS[contractName].abi.abi,
                    signer
                );

            } else {
                contract = await getContract(contractName, chainId, );
            }

            const tx = await contract[method](...args, {
                ...overrides,
                value: overrides.value || 0,
                gasLimit: overrides.gasLimit || 500000,
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

    // Estimate gas for a contract method
 const getGasLimit = useCallback(async (
  contractName: ContractName,
  method: string,
  chainId?: number,
  contractAddress?: string | undefined,
  args: any[] = [],
  overrides: ethers.Overrides = {}
): Promise<bigint> => {
  try {
    setError(null);

    let contract: ethers.Contract;
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

    // ethers v6: method first, then .estimateGas
    const contractMethod = (contract as any)[method];

    if (typeof contractMethod !== 'function') {
      throw new Error(`Method ${method} not found on contract ${contractName}`);
    }

    if (typeof contractMethod.estimateGas !== 'function') {
      throw new Error(`estimateGas is not available for method ${method} on ${contractName}`);
    }

    const gas: bigint = await contractMethod.estimateGas(
      ...args,
      {
        ...overrides,
        // only provide a default if value is not passed
        ...(overrides.value === undefined ? { value: 0 } : {}),
      }
    );

    return gas;
  } catch (err) {
    const error = err as Error;
    setError(error);
    throw error;
  }
}, [getContract, getSigner]);



const getEventFromTx = useCallback(
  async (
    contractName: ContractName,
    receipt: ethers.TransactionReceipt | null,
    eventName: string,
    chainId?: number,
    contractAddress?: string
  ): Promise<any[]> => {
    try {
      setError(null);

      if (!embeddedWallet) {
        throw new Error("Wallet not connected");
      }

      if (chainId) {
        await embeddedWallet.switchChain(chainId);
      }

      const ethProvider = await embeddedWallet.getEthereumProvider();
      const provider = new ethers.BrowserProvider(ethProvider);

      const contractConfig = CONTRACTS[contractName];
      if (!contractConfig && !contractAddress) {
        throw new Error(`Contract ${contractName} not found and no address provided`);
      }
debugger
      const address = contractAddress ==="" ? contractConfig.address : contractAddress;
 
      if(!address){
        throw new Error("contract address is undefined ");
      }
      const iface = new ethers.Interface(contractConfig.abi.abi);

      // Get the tx receipt
 

      const events: any[] = [];
      if (!receipt) {
        throw new Error("Transaction receipt not found");
      }
      // Parse all logs for this contract address
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== address.toLowerCase()) continue;

        try {
          const parsed = iface.parseLog(log);

          if (parsed && parsed.name === eventName) {
            events.push({
              name: parsed.name,
              args: parsed.args,        // decoded params
              fragment: parsed.fragment,
              signature: parsed.signature,
              topic: parsed.topic,
              logIndex: (log as any).index ?? (log as any).logIndex,
              transactionHash: receipt.hash,
              blockNumber: receipt.blockNumber,
              rawLog: log
            });
          }
        } catch {
          // parseLog will throw if log doesn't match any event in ABI – ignore those
        }
      }

      if (!events.length) {
        throw new Error(
          `Event ${eventName} not found in transaction ${receipt.hash} for contract ${address}`
        );
      }

      return events; // you can also return events[0] if you only expect one
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  },
  [embeddedWallet, setError]
);



    return {
        call,
        execute,
        getGasLimit,
        getEventFromTx,
        isLoading,
        error,
        transaction,
        isConnected: !!embeddedWallet,
        wallet: embeddedWallet,
    };
}
