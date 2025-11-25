"use client"

import { create } from 'zustand'
import type { User, SignUpData, LoginData, OTPData } from '@/types/auth'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'

type PrivyUserLike = {
  id?: string
  userId?: string
  [key: string]: unknown
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  sendOtp: (data: OTPData) => Promise<void>
  login: (data: LoginData) => Promise<void>
  loginWithPrivy: (privyUser: unknown, accessToken?: string | null) => Promise<void>
  signup: (data: SignUpData) => Promise<void>
  verifyOTP: (data: OTPData) => Promise<void>
  logout: () => void
  getUser: () => Promise<void>
  updateUser: (data: User) => Promise<void>
  deleteUser: (data: User) => Promise<void>
  checkAuth: () => boolean
  
  // Profile management methods
  getProfile: () => Promise<any>
  getProfileByUserId: (userId: string) => Promise<any>
  updateProfile: (data: any) => Promise<void>
  incrementProfileView: () => Promise<void>
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
  nft?: {
    price?: number
    currency?: string
    [key: string]: any
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
    nft?: {
      price?: number
      currency?: string
      [key: string]: any
    } | null
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

interface PostCache {
  posts: Post[]
  pagination: Pagination | null
  timestamp: number
  categoryId?: string
  page?: number
  limit?: number
}

interface FeedState {
  posts: Post[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  currentPage: number
  limit: number
  pagination: Pagination | null
  postsCache: Map<string, PostCache>
  getPosts: (params?: { categoryId?: string; page?: number; limit?: number; forceRefresh?: boolean; append?: boolean }) => Promise<void>
  getPost: (id: string) => Promise<Post | null>
  createPost: (data: CreatePostData) => Promise<Post | null>
  prependPost: (post: Post) => void
  updatePost: (id: string, data: CreatePostData) => Promise<void>
  deletePost: (id: string) => Promise<void>
  likePost: (id: string) => Promise<void>
  commentPost: (id: string, data: CommentData) => Promise<void>
  getComments: (postId: string, params?: { page?: number; limit?: number; parentCommentId?: string }) => Promise<{ comments: Comment[]; pagination: Pagination }>
  repostPost: (id: string, data?: RepostData) => Promise<void>
  sharePost: (id: string) => Promise<void>
  savePost: (id: string) => Promise<void>
  getSavedPosts: () => Promise<void>
  likeComment: (id: string) => Promise<{ isLiked: boolean; likesCount: number }>
  postLikes: (id: string, page?: number, limit?: number) => Promise<{ users: any[]; pagination: Pagination | null }>
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

const mapPrivyUserToUser = (privyUser: unknown): User => {
  const privyUserAny = (privyUser ?? {}) as PrivyUserLike & {
    email?: { address?: string; verified?: boolean; name?: string }
    twitter?: { username?: string; profileImageUrl?: string; name?: string; verified?: boolean }
    username?: string
    name?: string
    displayName?: string
    avatar?: string
    nickname?: string
    google?: { email?: string; name?: string }
    linkedAccounts?: Array<{ email?: string; type?: string }>
  }

  const linkedAccountEmail = privyUserAny.linkedAccounts?.find((account) => account.email)?.email

  const emailAddressCandidates = [
    privyUserAny.email?.address,
    privyUserAny.email?.name,
    privyUserAny.google?.email,
    linkedAccountEmail,
  ].filter((value): value is string => Boolean(value && !value.endsWith('@privy.id')))

  const officialEmail = emailAddressCandidates[0]

  const derivedUsername =
    privyUserAny.twitter?.username ||
    privyUserAny.username ||
    (officialEmail ? officialEmail.split('@')[0] : '') ||
    (typeof privyUserAny.id === 'string' ? privyUserAny.id : '') ||
    (typeof privyUserAny.userId === 'string' ? privyUserAny.userId : '')

  const displayName =
    privyUserAny.name ||
    privyUserAny.displayName ||
    privyUserAny.twitter?.name ||
    privyUserAny.nickname ||
    (officialEmail ? officialEmail.split('@')[0] : '') ||
    'Privy User'

  const ensuredEmail = officialEmail || ''
  const privyId =
    (typeof privyUserAny.id === 'string' && privyUserAny.id) ||
    (typeof privyUserAny.userId === 'string' && privyUserAny.userId) ||
    ''
  
  const id =
    privyId ||
    derivedUsername ||
    ensuredEmail ||
    'unknown'

  return {
    id,
    name: displayName,
    username: derivedUsername,
    email: ensuredEmail,
    profilePicture: privyUserAny.twitter?.profileImageUrl || privyUserAny.avatar ,
    twitter: privyUserAny.twitter?.username,
    isVerified: Boolean(privyUserAny.twitter?.verified || privyUserAny.email?.verified),
    privyId, // Store Privy ID separately for backend lookup
  }
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
      user: (typeof window !== 'undefined' ? (() => {
        try {
          const raw = localStorage.getItem('user')
          return raw ? JSON.parse(raw) : null
        } catch {
          return null
        }
      })() : null),
      isAuthenticated: (typeof window !== 'undefined' ? localStorage.getItem('token') !== null : false),
      isLoading: false,

      login: async (data: LoginData) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('POST', authRoutes.login, data )
          if (response.success) {
            // Save token to localStorage
            if (response.data.token) {
              localStorage.setItem('token', response.data.token)
            }
            // Persist user to localStorage
            if (response.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user))
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

      loginWithPrivy: async (privyUser: unknown, accessToken?: string | null) => {
        set({ isLoading: true })
        try {
          const mappedUser = mapPrivyUserToUser(privyUser)
          // Prepare payload to send to backend API
          const payload = {
            privyId: mappedUser.privyId,
            email: mappedUser.email,
            name: mappedUser.name,
            username: mappedUser.username,
            profilePicture: mappedUser.profilePicture,
            twitter: mappedUser.twitter,
            isVerified: mappedUser.isVerified,
          }
          
          // Call backend API - MANDATORY: User will only be logged in if backend responds successfully
          const response = await apiCaller('POST', authRoutes.loginWithPrivy, payload, true)

          // ONLY login if backend returns success response
          if (response.success && response.data) {
            // Use backend token (required)
            const token = response.data?.token
            if (!token) {
              throw new Error('Backend did not return authentication token')
            }

            if (typeof window !== 'undefined') {
              localStorage.setItem('token', token)
              if (response.data?.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user))
              }
            }

            // Use backend user data (required)
            const backendUser = response.data?.user
            if (!backendUser) {
              throw new Error('Backend did not return user data')
            }

            set({
              user: backendUser,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            // Backend response was not successful - DO NOT LOGIN
            const errorMessage = response?.message || 'Backend authentication failed'
            console.error('Backend login failed:', errorMessage)
            set({ isLoading: false })
            throw new Error(errorMessage)
          }
        } catch (error: any) {
          console.error('Privy login failed - user will NOT be logged in:', error)
          // Clear any partial state
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
          // Re-throw error so UI can show error message
          throw error
        }
      },

      signup: async (data: SignUpData & { countryCode?: string }) => {
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
          if (response.success) {
            // Save token to localStorage
            if (response.data.token) {
              localStorage.setItem('token', response.data.token)
            }
            // Persist user to localStorage
            if (response.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user))
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
          
          const response = await apiCaller('POST', authRoutes.verifyOtp, payload)
          if (response.success) {
            // Save token to localStorage
            if (response.data.token) {
              localStorage.setItem('token', response.data.token)
            }
            // Persist user to localStorage
            if (response.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user))
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
          if (typeof window !== 'undefined') {
            // Clear all localStorage to remove any residual state
            localStorage.clear()
            // Best-effort: remove any persisted auth storage key if present
            try { localStorage.removeItem('auth-storage') } catch {}
            // Set a flag to prevent auto-login
            sessionStorage.setItem('explicit-logout', 'true')
          }
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      getUser: async () => {
        try {
          const response = await apiCaller('GET', authRoutes.getUser )
          if (response.success) {
            // Persist user to localStorage
            if (typeof window !== 'undefined' && response.data?.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user))
            }
            set({ user: response.data.user })
          }
        }
        catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      updateUser: async (data: User) => {
        set({ isLoading: true })
        try {
          // Get current user to preserve privyId
          const currentUser = get().user
          
          // Preserve privyId from current user if it exists (important for OAuth users)
          const payload = {
            ...data,
            privyId: data.privyId || currentUser?.privyId, // Preserve privyId - don't let it be removed
            // Also preserve id to ensure we're updating the correct user
            id: data.id || currentUser?.id,
          }
          
          const response = await apiCaller('PUT', authRoutes.updateUser, payload)
          
          if (response.success) {
            // Ensure privyId is preserved in the updated user
            const updatedUser = {
              ...response.data.user,
              privyId: response.data.user?.privyId || currentUser?.privyId,
            }
            // Persist updated user
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(updatedUser))
            }
            set({ user: updatedUser, isLoading: false })
          } else {
            set({ isLoading: false })
          }
        }
        catch (error) {
          console.error('Error updating user:', error)
          set({ isLoading: false })
          throw error
        }
      },

      deleteUser: async (data: User) => {

        try {
          const response = await apiCaller('DELETE', authRoutes.deleteUser, data )
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
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('token') !== null
        const authenticated = hasToken
        // Hydrate user from localStorage if token exists but user is null
        if (hasToken && !get().user && typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('user')
            if (raw) {
              const parsed = JSON.parse(raw)
              set({ user: parsed })
            }
          } catch {}
        }
        if (!hasToken && get().user) {
          set({ user: null })
        }
        if (authenticated !== get().isAuthenticated) {
          set({ isAuthenticated: authenticated })
        }
        return authenticated
      },

      // Profile management methods
      getProfile: async () => {
        try {
          const response = await apiCaller('GET', authRoutes.getProfile)
          if (response.success && response.data) {
            return response.data
          }
          return null
        } catch (error) {
          console.error('Error fetching profile:', error)
          throw error
        }
      },

      getProfileByUserId: async (userId: string) => {
        try {
          const response = await apiCaller('GET', `profile/${userId}`)
          if (response.success && response.data) {
            return response.data
          }
          return null
        } catch (error) {
          console.error('Error fetching profile by userId:', error)
          throw error
        }
      },

      updateProfile: async (data: any) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('PUT', authRoutes.profileUpdate, data)
          if (response.success) {
            // Update user in store if user data is returned
            if (response.data?.user) {
              const updatedUser = {
                ...response.data.user,
                id: response.data.user._id || response.data.user.id,
              }
              set({ user: updatedUser, isLoading: false })
            } else {
              set({ isLoading: false })
            }
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          console.error('Error updating profile:', error)
          set({ isLoading: false })
          throw error
        }
      },

      incrementProfileView: async () => {
        try {
          await apiCaller('POST', authRoutes.profileview)
          // Silently increment view, no need to show message
        } catch (error) {
          console.error('Error incrementing profile view:', error)
          // Don't throw error for view increment
        }
      },
    })
)

export const useFeedStore = create<FeedState>()(
  (set, get) => ({
      posts: [],
      isLoading: false,
      isLoadingMore: false,
      hasMore: true,
      currentPage: 1,
      limit: 10,
      pagination: null,
      postsCache: new Map<string, PostCache>(),

      getPosts: async (params?: { categoryId?: string; page?: number; limit?: number; forceRefresh?: boolean; append?: boolean }) => {
        const CACHE_DURATION = 60000 // 60 seconds cache duration
        const resolveHasMore = (paginationData: Pagination | null, receivedLength: number, currentPageValue: number, limValue: number) => {
          if (paginationData) {
            const paginationAny = paginationData as Pagination & { totalPages?: number; totalItems?: number }
            const totalPages = paginationAny.totalPages ?? paginationAny.pages
            if (typeof totalPages === 'number') {
              return currentPageValue < totalPages
            }
            const totalItems = paginationAny.totalItems ?? paginationAny.total
            if (typeof totalItems === 'number') {
              return currentPageValue * limValue < totalItems
            }
          }
          return receivedLength === limValue
        }
        const categoryId = params?.categoryId || 'all'
        const append = params?.append || false
        const limit = params?.limit || get().limit || 10
        const page = params?.page || (append ? get().currentPage + 1 : 1)
        
        // Create cache key from params
        const cacheKey = `${categoryId}_${page}_${limit}`
        
        // Check cache if not forcing refresh
        if (!append && !params?.forceRefresh) {
          const cache = get().postsCache.get(cacheKey)
          const now = Date.now()
          
          if (cache && (now - cache.timestamp) < CACHE_DURATION) {
            // Cache is valid, use cached data
            set({ 
              posts: cache.posts,
              pagination: cache.pagination,
              isLoading: false,
              hasMore: resolveHasMore(cache.pagination, cache.posts.length, page, limit),
              currentPage: page,
              limit
            })
            return
          }
        }
        
        if (append) {
          set({ isLoadingMore: true })
        } else {
          set({ isLoading: true })
        }
        try {
          const queryParams = new URLSearchParams()
          if (params?.categoryId) queryParams.append('categoryId', params.categoryId)
          if (params?.page) queryParams.append('page', params.page.toString())
          if (params?.limit || limit) queryParams.append('limit', (params?.limit || limit).toString())
          
          const url = queryParams.toString() 
            ? `${authRoutes.getPosts}?${queryParams.toString()}`
            : authRoutes.getPosts

          const response = await apiCaller('GET', url)
          if (response.success) {
            const posts = (response.data.posts || []) as Post[]
            const pagination = response.data.pagination || null
            const existingPosts = append ? get().posts : []
            const existingIds = new Set(existingPosts.map(post => post._id))
            const mergedPosts = append 
              ? [...existingPosts, ...posts.filter(post => !existingIds.has(post._id))]
              : posts
            
            const hasMore = resolveHasMore(pagination, posts.length, page, limit)
                        
            // Update cache only for non-append requests
            let newCache = get().postsCache
            if (!append) {
              newCache = new Map(get().postsCache)
              newCache.set(cacheKey, {
                posts,
                pagination,
                timestamp: Date.now(),
                categoryId: params?.categoryId,
                page,
                limit
              })
            }
            
            set({ 
              posts: mergedPosts,
              pagination,
              isLoading: false,
              isLoadingMore: false,
              postsCache: newCache,
              hasMore,
              currentPage: page,
              limit
            })
          }
        } catch (error) {
          console.error('Error fetching posts:', error)
          set({ isLoading: false, isLoadingMore: false })
          throw error
        }
      },

      getPost: async (id: string) => {
        try {
          const response = await apiCaller('GET', `${authRoutes.getPost}/${id}`)
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
        try {
          const response = await apiCaller('POST', authRoutes.createPost, data)
          if (response.success) {
            const newPost = response.data?.post as Post | undefined
            // Clear cache so future fetches get fresh data
            set({ postsCache: new Map() })
            return newPost || null
          }
          return null
        } catch (error) {
          console.error('Error creating post:', error)
          throw error
        }
      },

      prependPost: (post: Post) => {
        if (!post?._id) return
        set(state => {
          const existingIds = new Set<string>()
          const filteredPosts = state.posts.filter(existingPost => {
            if (existingPost?._id) {
              if (existingPost._id === post._id) {
                return false
              }
              if (existingIds.has(existingPost._id)) {
                return false
              }
              existingIds.add(existingPost._id)
            }
            return true
          })
          return {
            posts: [post, ...filteredPosts],
          }
        })
      },

      updatePost: async (id: string, data: CreatePostData) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('PUT', `${authRoutes.updatePost}/${id}`, data)
          if (response.success) {
            // Update the post in the list
            const posts = get().posts
            const updatedPosts = posts.map(post => 
              post._id === id ? { 
                ...post, 
                ...response.data.post,
                text: response.data.post?.text || data.text || post.text,
                postUrl: response.data.post?.postUrl || data.postUrl || post.postUrl,
              } : post
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

      likeComment: async (id: string) => {
        try {
          const response = await apiCaller('POST', `${authRoutes.likeComment}/${id}/like`)
          if (response.success) {
            return {
              isLiked: response.data.isLiked as boolean,
              likesCount: response.data.likesCount as number,
            }
          }
          throw new Error('Failed to like comment')
        } catch (error) {
          console.error('Error liking comment:', error)
          throw error
        }
      },

      postLikes: async (id: string, page?: number, limit?: number) => {
        try {
          const query = new URLSearchParams()
          if (page) query.append('page', String(page))
          if (limit) query.append('limit', String(limit))
          const url = query.toString()
            ? `${authRoutes.postLikes}/${id}/likes?${query.toString()}`
            : `${authRoutes.postLikes}/${id}/likes`
          const response = await apiCaller('GET', url)
          if (response.success) {
            return {
              users: response.data.users || [],
              pagination: response.data.pagination || null,
            }
          }
          throw new Error('Failed to get post likes')
        } catch (error) {
          console.error('Error getting post likes:', error)
          throw error
        }
      },

      commentPost: async (id: string, data: CommentData) => {
        try {
          const response = await apiCaller('POST', `${authRoutes.commentPost}/${id}/comment`, data)
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
