'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'
import { useMessage } from '@/lib/hooks/useMessage'
import { Copy, Check, ArrowUp, ArrowDown, Search, Wallet } from 'lucide-react'
import SkeletonBox from '@/components/Common/SkeletonBox'

interface WalletAddress {
  _id: string
  walletAddress: string
  hash: string
  chainId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function WalletsPage() {
  const { message } = useMessage()
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [chainId, setChainId] = useState('')
  const [sort, setSort] = useState<string>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [searchInput, setSearchInput] = useState('')

  const fetchWalletAddresses = useCallback(async (
    page: number = 1,
    limit: number = 10,
    searchParam: string = '',
    chainIdParam: string = '',
    sortParam: string = 'createdAt',
    orderParam: 'asc' | 'desc' = 'desc'
  ) => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      queryParams.append('page', page.toString())
      queryParams.append('limit', limit.toString())
      queryParams.append('sort', sortParam)
      queryParams.append('order', orderParam)
      
      if (searchParam.trim()) {
        queryParams.append('search', searchParam.trim())
      }
      if (chainIdParam.trim()) {
        queryParams.append('chainId', chainIdParam.trim())
      }

      const url = `${authRoutes.walletAddresses}?${queryParams.toString()}`
      const response = await apiCaller('GET', url, null, true)

      if (response.success && response.data) {
        setWalletAddresses(response.data.walletAddresses || [])
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        })
      }
    } catch (error: any) {
      console.error('Error fetching wallet addresses:', error)
      message.error(error?.response?.data?.message || error?.message || 'Failed to fetch wallet addresses')
    } finally {
      setLoading(false)
    }
  }, [message])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Fetch data when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to page 1 when filters change
  }, [search, chainId, sort, order])

  useEffect(() => {
    fetchWalletAddresses(pagination.page, pagination.limit, search, chainId, sort, order)
  }, [pagination.page, pagination.limit, search, chainId, sort, order, fetchWalletAddresses])

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      message.success('Copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      message.error('Failed to copy')
    }
  }

  const truncateAddress = (address: string, startLength: number = 6, endLength: number = 4) => {
    if (address.length <= startLength + endLength) return address
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleSort = (field: string) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(field)
      setOrder('desc')
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sort !== field) return null
    return order === 'asc' ? (
      <ArrowUp className="w-3 h-3 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 inline" />
    )
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] bg-[#020019] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 font-audiowide">
          My Wallets
        </h1>

        {/* Search and Filter Section */}
        <div className="bg-gradient-to-br from-[#0F0F23] to-[#0A0A1A] rounded-xl border border-[#2A2F4A] shadow-lg shadow-black/30 p-5 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7E6BEF]" />
              <input
                type="text"
                placeholder="Search by wallet address or hash..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1A183A] border border-[#3A2F6A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7E6BEF]/50 focus:border-[#7E6BEF] transition-all duration-200 shadow-inner"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by Chain ID (e.g., 11155111)..."
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A183A] border border-[#3A2F6A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7E6BEF]/50 focus:border-[#7E6BEF] transition-all duration-200 shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0F0F23] to-[#0A0A1A] rounded-xl border border-[#2A2F4A] shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1A183A] via-[#1F1D3A] to-[#1A183A] border-b-2 border-[#3A2F6A]">
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#B8B5FF] cursor-pointer hover:text-white hover:bg-[#2A1F4A]/50 transition-all duration-200 group"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      <span>ID</span>
                      <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#B8B5FF] cursor-pointer hover:text-white hover:bg-[#2A1F4A]/50 transition-all duration-200 group"
                    onClick={() => handleSort('chainId')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Chain ID</span>
                      <SortIcon field="chainId" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#B8B5FF] cursor-pointer hover:text-white hover:bg-[#2A1F4A]/50 transition-all duration-200 group"
                    onClick={() => handleSort('walletAddress')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Wallet Address</span>
                      <SortIcon field="walletAddress" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#B8B5FF] cursor-pointer hover:text-white hover:bg-[#2A1F4A]/50 transition-all duration-200 group"
                    onClick={() => handleSort('hash')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Hash</span>
                      <SortIcon field="hash" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F4A]/50">
                {loading ? (
                  Array.from({ length: pagination.limit }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className={`${index % 2 === 0 ? 'bg-[#0F0F23]' : 'bg-[#0A0A1A]'}`}>
                      <td className="px-6 py-5">
                        <SkeletonBox width={40} height={20} radius={4} />
                      </td>
                      <td className="px-6 py-5">
                        <SkeletonBox width={80} height={20} radius={4} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <SkeletonBox width={150} height={20} radius={4} />
                          <SkeletonBox width={24} height={24} radius={4} />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <SkeletonBox width={150} height={20} radius={4} />
                          <SkeletonBox width={24} height={24} radius={4} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : walletAddresses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#1A183A] flex items-center justify-center mb-4">
                          <Wallet className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-base font-medium">No wallet addresses found</p>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  walletAddresses.map((wallet, index) => {
                    const rowId = `${wallet._id}-${index}`
                    const walletId = `${rowId}-wallet`
                    const hashId = `${rowId}-hash`
                    const displayIndex = (pagination.page - 1) * pagination.limit + index + 1

                    return (
                      <tr
                        key={wallet._id}
                        className={`${
                          index % 2 === 0 ? 'bg-[#0F0F23]' : 'bg-[#0A0A1A]'
                        } border-b border-[#2A2F4A]/30 hover:bg-gradient-to-r hover:from-[#1A183A] hover:to-[#1F1D3A] transition-all duration-200 group cursor-default`}
                      >
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold text-[#E0E0E0]">
                            {displayIndex}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#7E6BEF]/20 text-[#B8B5FF] border border-[#7E6BEF]/30">
                            {wallet.chainId}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#D1D5DB] font-mono tracking-wide">
                              {truncateAddress(wallet.walletAddress)}
                            </span>
                            <button
                              onClick={() => handleCopy(wallet.walletAddress, walletId)}
                              className="p-1.5 hover:bg-[#2A2F4A] rounded-md transition-all duration-200 hover:scale-110 active:scale-95 group/copy"
                              title="Copy full address"
                            >
                              {copiedId === walletId ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-[#7E6BEF] transition-colors" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#D1D5DB] font-mono tracking-wide">
                              {truncateAddress(wallet.hash)}
                            </span>
                            <button
                              onClick={() => handleCopy(wallet.hash, hashId)}
                              className="p-1.5 hover:bg-[#2A2F4A] rounded-md transition-all duration-200 hover:scale-110 active:scale-95 group/copy"
                              title="Copy full hash"
                            >
                              {copiedId === hashId ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-[#7E6BEF] transition-colors" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#1A183A] to-[#0F0F23] border-t-2 border-[#3A2F6A] flex items-center justify-between backdrop-blur-sm">
            <div className="text-sm text-gray-400 font-medium">
              Showing <span className="text-[#B8B5FF] font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="text-[#B8B5FF] font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total || 0)}</span> of{' '}
              <span className="text-[#B8B5FF] font-semibold">{pagination.total || 0}</span> results
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading || (pagination.pages || 0) === 0}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1A183A] to-[#2A1F4A] border border-[#3A2F6A] rounded-lg hover:from-[#2A1F4A] hover:to-[#3A2F6A] hover:border-[#7E6BEF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
              >
                Previous
              </button>
              <div className="px-4 py-2 bg-[#1A183A] border border-[#3A2F6A] rounded-lg">
                <span className="text-sm font-semibold text-[#B8B5FF]">
                  Page <span className="text-white">{pagination.page}</span> of <span className="text-white">{pagination.pages || 1}</span>
                </span>
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= (pagination.pages || 1) || loading || (pagination.pages || 0) === 0}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1A183A] to-[#2A1F4A] border border-[#3A2F6A] rounded-lg hover:from-[#2A1F4A] hover:to-[#3A2F6A] hover:border-[#7E6BEF] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

