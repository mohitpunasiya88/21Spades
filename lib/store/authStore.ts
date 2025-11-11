'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, SignUpData, LoginData, OTPData } from '@/types/auth'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/app/routes/route'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  sendOtp: (data: OTPData) => Promise<void>
  login: (data: LoginData) => Promise<void>
  signup: (data: SignUpData) => Promise<void>
  verifyOTP: (data: OTPData) => Promise<void>
  logout: () => void
  getUser: () => Promise<void>
  updateUser: (data: User) => Promise<void>
  deleteUser: (data: User) => Promise<void>
  checkAuth: () => boolean
}

export interface Post {
  _id: string
  author: {
    _id: string
    name: string
    username: string
    profilePicture?: string
  } | null
  text?: string
  postUrl?: string
  category?: {
    _id: string
    name: string
    slug: string
  } | null
  originalPost?: {
    _id: string
    text?: string
    postUrl?: string
    author?: {
      _id: string
      name: string
      username: string
      profilePicture?: string
    }
    likesCount?: number
    commentsCount?: number
    repostsCount?: number
    sharesCount?: number
    savesCount?: number
  } | null
  likesCount?: number
  commentsCount?: number
  repostsCount?: number
  sharesCount?: number
  savesCount?: number
  isLiked?: boolean
  isShared?: boolean
  isSaved?: boolean
  isReposted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreatePostData {
  text?: string
  postUrl?: string
  categoryId?: string
}

export interface CommentData {
  text: string
  parentCommentId?: string
}

export interface RepostData {
  text?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface Comment {
  _id: string
  author: {
    _id: string
    name: string
    username: string
    profilePicture?: string
  }
  text: string
  likesCount: number
  repliesCount: number
  isLiked?: boolean
  parentComment?: string | null
  createdAt: string
  updatedAt: string
}

interface FeedState {
  posts: Post[]
  isLoading: boolean
  pagination: Pagination | null
  getPosts: (params?: { categoryId?: string; page?: number; limit?: number }) => Promise<void>
  getPost: (id: string) => Promise<Post | null>
  createPost: (data: CreatePostData) => Promise<void>
  updatePost: (id: string, data: CreatePostData) => Promise<void>
  deletePost: (id: string) => Promise<void>
  likePost: (id: string) => Promise<void>
  commentPost: (id: string, data: CommentData) => Promise<void>
  getComments: (postId: string, params?: { page?: number; limit?: number; parentCommentId?: string }) => Promise<{ comments: Comment[]; pagination: Pagination }>
  repostPost: (id: string, data?: RepostData) => Promise<void>
  sharePost: (id: string) => Promise<void>
  savePost: (id: string) => Promise<void>
  getSavedPosts: () => Promise<void>
}

export interface Category {
  _id: string
  name: string
  slug: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface CategoriesState {
  categories: Category[]
  isLoading: boolean
  getCategories: () => Promise<void>
}

interface MarketCap {
  id: string,
  symbol: string,
  name: string,
  marketCap: number,
  currentPrice: number,
  priceChange24h: number,
  priceChangePercentage24h: number,
  sparkline: number[],
}
interface MarketDataState {
  isLoading: boolean
  value: number,
  coinAmount: number,
  coinCurrency: string,
  coinSymbol: string,
  marketCap:MarketCap | null,
  getFeedGreedIndex: () => Promise<void>
  getCoinPrice: (coin: string) => Promise<void>
  getMarketCap: (coin: string) => Promise<void>
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data: LoginData) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('POST', authRoutes.login, data )
          console.log('response99999999', response)
          if (response.success) {
            // Save token to localStorage
            if (response.data.token) {
              localStorage.setItem('token', response.data.token)
            }
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signup: async (data: SignUpData & { countryCode?: string }) => {
        console.log('signup', data)
        set({ isLoading: true })
        try {
          // Transform frontend data to match backend API expectations
          const payload = {
            name: data.name.trim(),
            username: data.username.trim().toLowerCase(),
            email: data.email.trim().toLowerCase(),
            phoneNumber: data.phone?.trim() || undefined,
            countryCode: data.countryCode || '+91', // Use countryCode from form or default to '+91'
            password: data.password,
          }
          
          const response = await apiCaller('POST', authRoutes.signup, payload)
          console.log('Signup222', response)
          if (response.success) {
            // Save token to localStorage
            if (response.data.token) {
              localStorage.setItem('token', response.data.token)
            }
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            })
          }
         
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      verifyOTP: async (data: OTPData | { phoneNumber: string; countryCode?: string; otp: string }) => {
        set({ isLoading: true })
        try {
          // Transform data to match backend API expectations
          let payload: { phoneNumber: string; countryCode: string; otp: string }
          
          if ('phoneNumber' in data) {
            // New format: phoneNumber and countryCode are already separated
            payload = {
              phoneNumber: data.phoneNumber.trim(),
              countryCode: (data.countryCode || '+91').trim(),
              otp: data.otp.trim(),
            }
          } else {
            // Legacy format: extract phoneNumber and countryCode from phone
            const phone = data.phone.trim()
            if (phone.startsWith('+91')) {
              payload = {
                phoneNumber: phone.substring(3).trim(), // Remove '+91'
                countryCode: '+91',
                otp: data.otp.trim(),
              }
            } else {
              // Try to extract country code
              const match = phone.match(/^\+?(\d{1,3})(.+)$/)
              if (match) {
                payload = {
                  phoneNumber: match[2].trim(),
                  countryCode: `+${match[1]}`,
                  otp: data.otp.trim(),
                }
              } else {
                payload = {
                  phoneNumber: phone.replace(/^\+/, '').trim(),
                  countryCode: '+91',
                  otp: data.otp.trim(),
                }
              }
            }
          }
          
          console.log('verifyOTP payload:', payload)
          const response = await apiCaller('POST', authRoutes.verifyOtp, payload)
          console.log('response44444', response)
          if (response.success) {
            // Save token to localStorage
            if (response.data.token) {
              localStorage.setItem('token', response.data.token)
            }
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      sendOtp: async (data: OTPData | { countryCode: string; phoneNumber: string }) => {
        set({ isLoading: true })
        try {
          // Transform data to match backend API expectations
          const payload = 'phoneNumber' in data 
            ? { countryCode: data.countryCode, phoneNumber: data.phoneNumber }
            : { phoneNumber: data.phone, countryCode: '+91' } // Default country code if not provided
          
          const response = await apiCaller('POST', authRoutes.sendOtp, payload )
          console.log('response333333', response)
          if (response.success) {
            // OTP send response doesn't include user data
            // User will be authenticated after OTP verification
            set({
              isLoading: false,
            })
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          const response =  await apiCaller('POST', authRoutes.logout )
          console.log('response6666666', response)
          // Clear token and user data regardless of API response
          localStorage.removeItem('token')
          set({
            user: null,
            isAuthenticated: false,
          })
        } catch (error) {
          // Even if API call fails, clear local auth
          localStorage.removeItem('token')
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
          throw error
        }
      },

      getUser: async () => {
        try {
          const response = await apiCaller('GET', authRoutes.getUser )
          console.log('response7777777', response)
          if (response.success) {
            set({ user: response.data.user })
          }
        }
        catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      updateUser: async (data: User) => {
        try {
          const response = await apiCaller('PUT', authRoutes.updateUser, data )
          console.log('response8888888', response)
          if (response.success) {
            set({ user: response.data.user })
          }
        }
        catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      deleteUser: async (data: User) => {

        try {
          const response = await apiCaller('DELETE', authRoutes.deleteUser, data )
          console.log('response9999999', response)
          if (response.success) {
            set({ user: response.data.user })
          }
        }
        catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      checkAuth: () => {
        // Check if user exists and token is present
        const hasUser = get().user !== null
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('token') !== null
        const authenticated = hasUser && hasToken
        if (authenticated !== get().isAuthenticated) {
          set({ isAuthenticated: authenticated })
        }
        return authenticated
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)


export const useFeedStore = create<FeedState>()(
  (set, get) => ({
      posts: [],
      isLoading: false,
      pagination: null,

      getPosts: async (params?: { categoryId?: string; page?: number; limit?: number }) => {
        set({ isLoading: true })
        try {
          const queryParams = new URLSearchParams()
          if (params?.categoryId) queryParams.append('categoryId', params.categoryId)
          if (params?.page) queryParams.append('page', params.page.toString())
          if (params?.limit) queryParams.append('limit', params.limit.toString())
          
          const url = queryParams.toString() 
            ? `${authRoutes.getPosts}?${queryParams.toString()}`
            : authRoutes.getPosts

          const response = await apiCaller('GET', url)
          console.log('getPosts response', response)
          if (response.success) {
            set({ 
              posts: response.data.posts || [],
              pagination: response.data.pagination || null,
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Error fetching posts:', error)
          set({ isLoading: false })
          throw error
        }
      },

      getPost: async (id: string) => {
        try {
          const response = await apiCaller('GET', `${authRoutes.getPost}/${id}`)
          console.log('getPost response', response)
          if (response.success) {
            return response.data.post
          }
          return null
        } catch (error) {
          console.error('Error fetching post:', error)
          throw error
        }
      },

      createPost: async (data: CreatePostData) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('POST', authRoutes.createPost, data)
          console.log('createPost response', response)
          if (response.success) {
            // Refresh posts after creating
            await get().getPosts()
          }
        } catch (error) {
          console.error('Error creating post:', error)
          set({ isLoading: false })
          throw error
        }
      },

      updatePost: async (id: string, data: CreatePostData) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('PUT', `${authRoutes.updatePost}/${id}`, data)
          console.log('updatePost response', response)
          if (response.success) {
            // Update the post in the list
            const posts = get().posts
            const updatedPosts = posts.map(post => 
              post._id === id ? { ...post, ...response.data.post } : post
            )
            set({ posts: updatedPosts, isLoading: false })
          }
        } catch (error) {
          console.error('Error updating post:', error)
          set({ isLoading: false })
          throw error
        }
      },

      deletePost: async (id: string) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('DELETE', `${authRoutes.deletePost}/${id}`)
          console.log('deletePost response', response)
          if (response.success) {
            // Remove post from list
            const posts = get().posts
            set({ posts: posts.filter(post => post._id !== id), isLoading: false })
          }
        } catch (error) {
          console.error('Error deleting post:', error)
          set({ isLoading: false })
          throw error
        }
      },

      likePost: async (id: string) => {
        try {
          const response = await apiCaller('POST', `${authRoutes.likePost}/${id}/like`)
          console.log('likePost response', response)
          if (response.success) {
            // Update the post in the list
            const posts = get().posts
            const updatedPosts = posts.map(post => 
              post._id === id 
                ? { 
                    ...post, 
                    likesCount: response.data.likesCount,
                    isLiked: response.data.isLiked 
                  } 
                : post
            )
            set({ posts: updatedPosts })
          }
        } catch (error) {
          console.error('Error liking post:', error)
          throw error
        }
      },

      commentPost: async (id: string, data: CommentData) => {
        try {
          const response = await apiCaller('POST', `${authRoutes.commentPost}/${id}/comment`, data)
          console.log('commentPost response', response)
          if (response.success) {
            // Update the post in the list
            const posts = get().posts
            const updatedPosts = posts.map(post => 
              post._id === id 
                ? { ...post, commentsCount: (post.commentsCount || 0) + 1 } 
                : post
            )
            set({ posts: updatedPosts })
          }
        } catch (error) {
          console.error('Error commenting on post:', error)
          throw error
        }
      },

      getComments: async (postId: string, params?: { page?: number; limit?: number; parentCommentId?: string }) => {
        try {
          const queryParams = new URLSearchParams()
          if (params?.page) queryParams.append('page', params.page.toString())
          if (params?.limit) queryParams.append('limit', params.limit.toString())
          if (params?.parentCommentId) queryParams.append('parentCommentId', params.parentCommentId)
          
          const url = queryParams.toString() 
            ? `${authRoutes.getComments}/${postId}/comments?${queryParams.toString()}`
            : `${authRoutes.getComments}/${postId}/comments`

          const response = await apiCaller('GET', url)
          console.log('getComments response', response)
          if (response.success) {
            return {
              comments: response.data.comments || [],
              pagination: response.data.pagination || null
            }
          }
          return { comments: [], pagination: null }
        } catch (error) {
          console.error('Error fetching comments:', error)
          throw error
        }
      },

      repostPost: async (id: string, data?: RepostData) => {
        try {
          // Send data if text is provided, otherwise send empty object for valid JSON
          const requestData = data?.text ? { text: data.text } : {}
          const response = await apiCaller('POST', `${authRoutes.repostPost}/${id}/repost`, requestData)
          console.log('repostPost response', response)
          if (response.success) {
            // Update the post in the list with new repost count
            const posts = get().posts
            const updatedPosts = posts.map(post => 
              post._id === id 
                ? { 
                    ...post, 
                    repostsCount: response.data.repostsCount || (post.repostsCount || 0) + 1,
                    isReposted: response.data.isReposted || true
                  } 
                : post
            )
            set({ posts: updatedPosts })
          }
        } catch (error) {
          console.error('Error reposting:', error)
          throw error
        }
      },

      sharePost: async (id: string) => {
        try {
          const response = await apiCaller('POST', `${authRoutes.sharePost}/${id}/share`)
          console.log('sharePost response', response)
          if (response.success) {
            // Update the post in the list
            const posts = get().posts
            const updatedPosts = posts.map(post => 
              post._id === id 
                ? { ...post, sharesCount: response.data.sharesCount } 
                : post
            )
            set({ posts: updatedPosts })
          }
        } catch (error) {
          console.error('Error sharing post:', error)
          throw error
        }
      },

      savePost: async (id: string) => {
        try {
          const response = await apiCaller('POST', `${authRoutes.savePost}/${id}/save`)
          console.log('savePost response', response)
          if (response.success) {
            // Update the post in the list
            const posts = get().posts
            const updatedPosts = posts.map(post => 
              post._id === id 
                ? { 
                    ...post, 
                    savesCount: response.data.savesCount,
                    isSaved: response.data.isSaved 
                  } 
                : post
            )
            set({ posts: updatedPosts })
          }
        } catch (error) {
          console.error('Error saving post:', error)
          throw error
        }
      },

      getSavedPosts: async () => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('GET', authRoutes.getSavedPosts)
          console.log('getSavedPosts response', response)
          if (response.success) {
            set({ 
              posts: response.data.posts || [],
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Error fetching saved posts:', error)
          set({ isLoading: false })
          throw error
        }
      },
    })
)

export const useCategoriesStore = create<CategoriesState>()(
  (set, get) => ({
      categories: [],
      isLoading: false,

      getCategories: async () => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('GET', authRoutes.categories)
          console.log('getCategories response', response)
          if (response.success) {
            set({ 
              categories: response.data.categories || response.data || [],
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Error fetching categories:', error)
          set({ isLoading: false })
          throw error
        }
      },
    })
)


export const useMarketDataStore = create<MarketDataState>()(
  (set, get) => ({
      isLoading: false,
      value: 0,
      coinAmount: 0,
      coinCurrency: '',
      coinSymbol: '',
      marketCap: null,
      getFeedGreedIndex: async () => {
        try {
          const response = await apiCaller('GET', authRoutes.getFeedGreedIndex )
          if (response.success) {
            set({ 
              value: response.data.value,
            })
          }
        }
        catch (error) {
          throw error
        }
      },
      getCoinPrice: async (coin: string) => {
        try {
          const response = await apiCaller('GET', `${authRoutes.getCoinPrice}/${coin}`)
          if (response.success) {
            set({ 
              coinAmount: response.data.amount,
              coinCurrency: response.data.currency, 
              coinSymbol: response.data.symbol
            })
          }
        }
        catch (error) {
          throw error
        }
      },
      getMarketCap: async (coin: string) => {
        try {
          const response = await apiCaller('GET', `${authRoutes.getMarketCap}/${coin}`)
          if (response.success) {
            set({ marketCap: response.data as MarketCap || null })
          }
        }
        catch (error) {
          throw error
        }
      },
    })
)
