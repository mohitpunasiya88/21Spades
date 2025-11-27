import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'

type WalletLogPayload = {
  walletAddress?: string | null
  hash?: string | null
  chainId?: string | number | null
}

const normalizeChainId = (chainId?: string | number | null) => {
  if (chainId === null || chainId === undefined) return undefined
  return typeof chainId === 'number' ? chainId.toString() : chainId
}

export const logWalletActivity = async ({ walletAddress, hash, chainId }: WalletLogPayload) => {
  try {
    if (!walletAddress || !hash) return
    const normalizedChainId = normalizeChainId(chainId)
    if (!normalizedChainId) return

    await apiCaller(
      'POST',
      authRoutes.walletAddresses,
      {
        walletAddress,
        hash,
        chainId: normalizedChainId,
      },
      true,
    )
  } catch (error) {
    console.error('Failed to log wallet transaction', error)
  }
}


