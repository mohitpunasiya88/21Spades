'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle2, RefreshCcwIcon, Smile, Send, UserIcon } from 'lucide-react'
import { useFeedStore, useAuthStore } from '@/lib/store/authStore'
import { Avatar, Button, Collapse, Tooltip, Steps } from 'antd'
import EmojiPicker from 'emoji-picker-react'
import { useChatStore } from '@/lib/store/chatStore'
import { useAuth } from '@/lib/hooks/useAuth'
import LoginRequiredModal from '@/components/Common/LoginRequiredModal'
import RepostModal from '@/components/Common/RepostModal'

interface FeedPostProps {
  post: {
    id: string
    originalPostId?: string // For reposts, this is the original post ID
    username: string
    verified: boolean
    timeAgo: string
    walletAddress: string
    profilePicture?: string
    content: string
    image: string
    likes: number
    comments: number
    shares: number
    reposts?: number
    saves: number
    isLiked?: boolean
    isSaved?: boolean
    isReposted?: boolean
    price?: number
    currency?: string
    nft?: {
      price?: number
      currency?: string
    }
    // For reposts - original post data
    repostCaption?: string // Caption added when reposting
    originalPost?: {
      id: string
      username: string
      verified: boolean
      timeAgo: string
      walletAddress: string
      profilePicture?: string
      content: string
      image: string
      likes: number
      comments: number
      shares: number
      reposts?: number
      saves: number
      price?: number
      currency?: string
    }
  }
}

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

export default function FeedPost({ post }: FeedPostProps) {
  const { likePost, sharePost, savePost, commentPost, getComments, repostPost, likeComment, postLikes } = useFeedStore()
  const { searchUsers, searchedUsers, clearSearchedUsers } = useChatStore()
  const { user: currentUser } = useAuthStore()
  const isAuthenticated = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [liked, setLiked] = useState(post.isLiked || false)
  const [saved, setSaved] = useState(post.isSaved || false)
  const [localLikes, setLocalLikes] = useState(post.likes)
  const [localSaves, setLocalSaves] = useState(post.saves)
  const [localShares, setLocalShares] = useState(post.shares)
  const [localReposts, setLocalReposts] = useState(post.reposts || 0)
  const [reposted, setReposted] = useState(post.isReposted || false)
  // Update repost state when post data changes
  useEffect(() => {
    if (post.isReposted !== undefined) {
      setReposted(post.isReposted)
    }
    if (post.reposts !== undefined) {
      setLocalReposts(post.reposts)
    }
  }, [post.isReposted, post.reposts])
  const [activeKey, setActiveKey] = useState<string | string[]>([])
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [localComments, setLocalComments] = useState(post.comments)
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentsPage, setCommentsPage] = useState(1)
  // Show 3-4 initially (use 4), then paginate with 10 subsequently
  const INITIAL_COMMENTS_LIMIT = 4
  const COMMENTS_LIMIT = 10
  const [hasMoreComments, setHasMoreComments] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [commentsTotal, setCommentsTotal] = useState<number | null>(null)
  const [commentsTotalPages, setCommentsTotalPages] = useState<number | null>(null)
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null)
  // const likerNamePool = ['Benjamin', 'Ava', 'Noah', 'Mia', 'Ethan', 'Liam']
  // const likerInitialPool = ['B', 'A', 'N', 'M', 'E', 'L']
  // const displayedLikerCount = Math.min(Math.max(localLikes, 1), likerNamePool.length)
  // const likerDisplayData = Array.from({ length: displayedLikerCount }).map((_, idx) => ({
  //   name: likerNamePool[idx % likerNamePool.length],
  //   initial: likerInitialPool[idx % likerInitialPool.length],
  //   color: ['#F97316', '#8B5CF6', '#FACF5A', '#22D3EE', '#10B981', '#3B82F6'][idx % 6],
  // }))
  const [likers, setLikers] = useState<any[]>([])
  const [likersTotal, setLikersTotal] = useState<number>(0)
  const [isSharing, setIsSharing] = useState(false)
  const [isReposting, setIsReposting] = useState(false)
  const [showRepostModal, setShowRepostModal] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const [mentionQuery, setMentionQuery] = useState('')
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionStartPos, setMentionStartPos] = useState<number | null>(null)
  const mentionDropdownRef = useRef<HTMLDivElement | null>(null)
  
  // Check if this is a repost
  const isRepost = !!post.originalPost
  
  // Get price from post.price or post.nft.price
  const rawPrice = post.price !== undefined && post.price !== null 
    ? post.price 
    : (post.nft?.price !== undefined && post.nft?.price !== null ? post.nft?.price : undefined)
  
  // Convert to number if it's a string
  const numericPrice = rawPrice !== undefined && rawPrice !== null
    ? (typeof rawPrice === 'string' ? parseFloat(rawPrice) : typeof rawPrice === 'number' ? rawPrice : undefined)
    : undefined
  
  // Check if we have a valid numeric price
  const hasPrice = numericPrice !== undefined && numericPrice !== null && typeof numericPrice === 'number' && !Number.isNaN(numericPrice) && numericPrice >= 0
  
  // Format the price
  const formattedPrice = hasPrice 
    ? (numericPrice >= 1 ? numericPrice.toFixed(2) : numericPrice.toFixed(4)) 
    : ''
  
  // Get currency
  const priceCurrency = post.currency || post.nft?.currency || 'AVAX'
  
  // Debug logs - remove after fixing
  console.log('FeedPost Debug:', {
    postId: post.id,
    'post.price': post.price,
    'post.nft?.price': post.nft?.price,
    rawPrice,
    numericPrice,
    hasPrice,
    formattedPrice,
    priceCurrency
  })

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    const newLiked = !liked
    const isRepost = !!post.originalPostId

    // For reposts, don't do optimistic update - wait for API response
    if (!isRepost) {
      setLiked(newLiked)
      setLocalLikes(newLiked ? localLikes + 1 : Math.max(0, localLikes - 1))
    }

    try {
      // For reposts, like the original post, otherwise like the current post
      const postIdToLike = post.originalPostId || post.id
      await likePost(postIdToLike)

      // Update from store - the likePost function already updated the store
      const allPosts = useFeedStore.getState().posts

      if (isRepost && post.originalPostId) {
        // For reposts, find the original post in the store (which was just updated by likePost)
        const originalPost = allPosts.find(p => p._id === post.originalPostId)
        if (originalPost) {
          setLocalLikes(originalPost.likesCount || 0)
          setLiked(originalPost.isLiked || false)
        }
      } else {
        // For regular posts, find the updated post
        const updatedPost = allPosts.find(p => p._id === post.id)
        if (updatedPost) {
          setLocalLikes(updatedPost.likesCount || 0)
          setLiked(updatedPost.isLiked || false)
        }
      }
    } catch (error) {
      // Revert on error
      if (!isRepost) {
        setLiked(!newLiked)
        setLocalLikes(post.likes)
      }
      console.error('Error liking post:', error)
    }
  }

  const handleToggleCommentLike = async (commentId: string, index: number) => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    try {
      const res = await likeComment(commentId)
      setComments(prev => {
        const next = [...prev]
        if (next[index]) {
          next[index] = { ...next[index], isLiked: res.isLiked, likesCount: res.likesCount }
        }
        return next
      })
    } catch (e) {
      console.error('Error toggling comment like:', e)
    }
  }

  const handleRepost = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    // Prevent if already reposted or currently reposting
    if (reposted || isReposting) return

    // Open repost modal
    setShowRepostModal(true)
  }

  const handleRepostSubmit = async (caption: string) => {
    setIsReposting(true)
    try {
      // Call repostPost with caption (empty string if no caption)
      await repostPost(post.id, { text: caption || undefined })
      setReposted(true)
      // Update repost count from API response
      const updatedPost = useFeedStore.getState().posts.find(p => p._id === post.id)
      if (updatedPost) {
        setLocalReposts(updatedPost.repostsCount || 0)
        setReposted(updatedPost.isReposted || true)
      } else {
        setLocalReposts(localReposts + 1)
      }
      // Refresh posts to show the new repost
      await useFeedStore.getState().getPosts()
    } catch (error) {
      console.error('Error reposting:', error)
      throw error // Re-throw so modal can handle it
    } finally {
      setIsReposting(false)
    }
  }

  const handleShare = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    // Prevent multiple rapid clicks
    if (isSharing) return

    setIsSharing(true)
    try {
      await sharePost(post.id)
      // Update share count from API response
      const updatedPost = useFeedStore.getState().posts.find(p => p._id === post.id)
      if (updatedPost) {
        setLocalShares(updatedPost.sharesCount || 0)
      }
    } catch (error) {
      console.error('Error sharing post:', error)
    } finally {
      // Add small delay to prevent rapid clicking
      setTimeout(() => {
        setIsSharing(false)
      }, 1000)
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    const newSaved = !saved
    const isRepost = !!post.originalPostId

    // For reposts, don't do optimistic update - wait for API response
    if (!isRepost) {
      setSaved(newSaved)
      setLocalSaves(newSaved ? localSaves + 1 : Math.max(0, localSaves - 1))
    }

    try {
      // For reposts, save the original post, otherwise save the current post
      const postIdToSave = post.originalPostId || post.id
      await savePost(postIdToSave)

      // Update from store - the savePost function already updated the store
      const allPosts = useFeedStore.getState().posts

      if (isRepost && post.originalPostId) {
        // For reposts, find the original post in the store (which was just updated by savePost)
        const originalPost = allPosts.find(p => p._id === post.originalPostId)
        if (originalPost) {
          setLocalSaves(originalPost.savesCount || 0)
          setSaved(originalPost.isSaved || false)
        }
      } else {
        // For regular posts, find the updated post
        const updatedPost = allPosts.find(p => p._id === post.id)
        if (updatedPost) {
          setLocalSaves(updatedPost.savesCount || 0)
          setSaved(updatedPost.isSaved || false)
        }
      }
    } catch (error) {
      // Revert on error
      if (!isRepost) {
        setSaved(!newSaved)
        setLocalSaves(post.saves)
      }
      console.error('Error saving post:', error)
    }
  }

  const handleCommentClick = async () => {
    // Toggle accordion
    const currentKeys = Array.isArray(activeKey) ? activeKey : activeKey ? [activeKey] : []
    const isOpen = currentKeys.includes('comments')
    if (isOpen) {
      setActiveKey([])
    } else {
      // Check authentication before loading comments
      if (!isAuthenticated) {
        setShowLoginModal(true)
        return
      }
      setActiveKey(['comments'])
      // Load first page when accordion opens
      setLoadingComments(true)
      try {
        const result = await getComments(post.id, { page: 1, limit: 10 } as any)
        const fetched = (result as any)?.data?.comments ?? (result as any)?.comments ?? []
        const pagination = (result as any)?.data?.pagination ?? (result as any)?.pagination
        setComments(fetched)
        setCommentsPage(1)
        if (pagination) {
          setCommentsTotal(pagination.total ?? null)
          setCommentsTotalPages(pagination.pages ?? null)
          setHasMoreComments(pagination.page < pagination.pages)
        }
        // Fetch post likers
        try {
          const likeRes = await postLikes(post.id, 1, 20)
          const users = likeRes?.users ?? []
          const total = likeRes?.pagination?.total ?? users.length
          setLikers(users)
          setLikersTotal(total)
        } catch (e) {
          console.error('Error fetching post likers:', e)
          setLikers([])
          setLikersTotal(0)
        }
      } catch (error) {
        console.error('Error loading comments:', error)
      } finally {
        setLoadingComments(false)
      }
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    
    if (!commentText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await commentPost(post.id, { text: commentText.trim() })
      setCommentText('')

      // Update comment count from store
      const updatedPost = useFeedStore.getState().posts.find(p => p._id === post.id)
      if (updatedPost) {
        setLocalComments(updatedPost.commentsCount || localComments + 1)
      } else {
        setLocalComments(localComments + 1)
      }

      // Refresh comments list if accordion is open (refetch first page)
      const currentKeys = Array.isArray(activeKey) ? activeKey : activeKey ? [activeKey] : []
      if (currentKeys.includes('comments')) {
        setLoadingComments(true)
        try {
          const result = await getComments(post.id, { page: 1, limit: 10 } as any)
          const fetched = (result as any)?.data?.comments ?? (result as any)?.comments ?? []
          const pagination = (result as any)?.data?.pagination ?? (result as any)?.pagination
          setComments(fetched)
          setCommentsPage(1)
          if (pagination) {
            setCommentsTotal(pagination.total ?? null)
            setCommentsTotalPages(pagination.pages ?? null)
            setHasMoreComments(pagination.page < pagination.pages)
          } else {
            setHasMoreComments(fetched.length >= 10)
          }
        } catch (error) {
          console.error('Error refreshing comments:', error)
        } finally {
          setLoadingComments(false)
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Load more comments (next page)
  const loadMoreComments = async () => {
    if (isLoadingMore || !hasMoreComments) return
    
    // Check authentication before loading more comments
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    
    setIsLoadingMore(true)
    try {
      const nextPage = commentsPage + 1
      const result = await getComments(post.id, { page: nextPage, limit: COMMENTS_LIMIT } as any)
      const dataObj = (result as any)?.data ?? result
      const fetched = dataObj?.comments ?? []
      const pagination = dataObj?.pagination
      if (fetched.length > 0) {
        setComments(prev => [...prev, ...fetched])
        setCommentsPage(nextPage)
        if (pagination) {
          setCommentsTotal(pagination.total ?? commentsTotal)
          setCommentsTotalPages(pagination.pages ?? commentsTotalPages)
          setHasMoreComments(pagination.page < pagination.pages)
        } else {
          setHasMoreComments(fetched.length >= COMMENTS_LIMIT)
        }
      } else {
        setHasMoreComments(false)
      }
    } catch (error) {
      console.error('Error loading more comments:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Attach intersection observer to sentinel to auto-load next page
  useEffect(() => {
    // Only observe when comments accordion is open and more pages remain
    const isOpen = Array.isArray(activeKey) ? activeKey.includes('comments') : activeKey === 'comments'
    if (!isOpen || !hasMoreComments) return
    const sentinel = loadMoreSentinelRef.current
    if (!sentinel) return
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        loadMoreComments()
      }
    }, { root: null, rootMargin: '400px 0px 400px 0px', threshold: 0.2 })
    io.observe(sentinel)
    return () => {
      io.disconnect()
    }
  }, [activeKey, commentsPage, hasMoreComments, comments.length])

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      
      // Handle emoji picker
      if (isEmojiPickerOpen && emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
        setIsEmojiPickerOpen(false)
      }
      
      // Handle mention dropdown
      if (showMentionSuggestions && mentionDropdownRef.current && !mentionDropdownRef.current.contains(target)) {
        setShowMentionSuggestions(false)
        setMentionQuery('')
        setMentionStartPos(null)
      }
    }
    document.addEventListener('mousedown', handleDocClick)
    return () => {
      document.removeEventListener('mousedown', handleDocClick)
    }
  }, [isEmojiPickerOpen, showMentionSuggestions])
  // Format relative time from ISO date string (e.g., 1h, 2d)
  const formatRelativeTime = (isoDate?: string) => {
    if (!isoDate) return ''
    const created = new Date(isoDate).getTime()
    const now = Date.now()
    const diffSeconds = Math.max(0, Math.floor((now - created) / 1000))
    if (diffSeconds < 60) return `${diffSeconds}s`
    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) return `${diffMinutes}m`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d`
  }

  // Handle comment input change with mention detection
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart || 0
    
    setCommentText(value)
    
    // Find the last @ before cursor
    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')
    
    if (lastAtIndex !== -1) {
      // Check if there's a space between @ and cursor (if so, stop suggesting)
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      if (textAfterAt.includes(' ')) {
        setShowMentionSuggestions(false)
        setMentionQuery('')
        setMentionStartPos(null)
        clearSearchedUsers()
        return
      }
      
      // Extract query after @
      const query = textAfterAt
      setMentionQuery(query)
      setMentionStartPos(lastAtIndex)
      setShowMentionSuggestions(true)
      
      // Search users
      if (query.length > 0) {
        searchUsers(query)
      } else {
        clearSearchedUsers()
      }
    } else {
      setShowMentionSuggestions(false)
      setMentionQuery('')
      setMentionStartPos(null)
      clearSearchedUsers()
    }
  }
  
  // Handle user selection from mention dropdown
  const handleUserSelect = (username: string) => {
    if (mentionStartPos === null) return
    
    // Replace @query with @username
    const before = commentText.slice(0, mentionStartPos)
    const after = commentText.slice(mentionStartPos + mentionQuery.length + 1)
    const newText = `${before}@${username} ${after}`
    
    setCommentText(newText)
    setShowMentionSuggestions(false)
    setMentionQuery('')
    setMentionStartPos(null)
    clearSearchedUsers()
  }

  // Render comment text with mentions and URLs stylized to match design
  const renderCommentText = (text?: string) => {
    if (!text) return null
    const regex = /(https?:\/\/[^\s]+)|(\bwww\.[^\s]+)|(\B@[a-zA-Z0-9_]+)/g
    const parts: any[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(text)) !== null) {
      const [full, httpUrl, wwwUrl, mention] = match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
        )
      }
      if (httpUrl || wwwUrl) {
        const url = httpUrl || `https://${wwwUrl}`
        parts.push(
          <a
            key={`u-${match.index}`}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-[#3B82F6] hover:underline"
          >
            {full}
          </a>
        )
      } else if (mention) {
        parts.push(
          <span key={`m-${match.index}`} className="text-[#3B82F6]">{mention}</span>
        )
      }
      lastIndex = match.index + full.length
    }
    if (lastIndex < text.length) {
      parts.push(<span key={`t-end`}>{text.slice(lastIndex)}</span>)
    }
    return parts
  }

  return (
    <div className="rounded-xl sm:rounded-2xl border border-[#FFFFFF33] bg-[#090721] p-4 sm:p-6 md:p-8 font-exo2">

      {/* Top Header - Show repost author if it's a repost */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div
          className="flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden p-1.5 sm:p-2 flex-shrink-0"
          style={{
            background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)'
          }}
        >
          {/* Avatar */}
          {post.profilePicture ? (
            <img
              src={post.profilePicture}
              alt={post.username}
              className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full object-cover"
            />
          ) : (
            <img src="/post/card-21.png" alt="Avatar" className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] object-contain" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-white font-semibold truncate text-sm sm:text-base">{post.username}</span>
            {/* {post.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />} */}
            <img src="/post/verify-white.png" alt="" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">{post.timeAgo}</span>
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs truncate">{post.walletAddress}</p>
        </div>
      </div>

      {/* Repost Caption - Only show if it's a repost and has caption */}
      {isRepost && post.repostCaption && (
        <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed break-words">{post.repostCaption}</p>
      )}

      {/* Embedded Original Post - Show if it's a repost */}
      {isRepost && post.originalPost ? (
        <div className="rounded-lg sm:rounded-xl border border-[#4F01E6] bg-[#090721] p-3 sm:p-4 mb-3 sm:mb-4">
          {/* Original Post Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div
              className="flex items-center justify-center w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full overflow-hidden p-1 sm:p-1.5 flex-shrink-0"
              style={{
                background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)'
              }}
            >
              {post.originalPost.profilePicture ? (
                <img
                  src={post.originalPost.profilePicture}
                  alt={post.originalPost.username}
                  className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] rounded-full object-cover"
                />
              ) : (
                <img src="/post/card-21.png" alt="Avatar" className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] object-contain" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-white font-semibold truncate text-xs sm:text-sm">{post.originalPost.username}</span>
                <img src="/post/verify-white.png" alt="" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-gray-500 text-xs whitespace-nowrap">{post.originalPost.timeAgo}</span>
              </div>
              <p className="text-gray-500 text-[10px] truncate">{post.originalPost.walletAddress}</p>
            </div>
          </div>

          {/* Original Post Content */}
          {post.originalPost.content && (
            <p className="text-white/90 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed break-words">{post.originalPost.content}</p>
          )}

          {/* Original Post Media */}
          {post.originalPost.image && (
            <div className="overflow-hidden rounded-lg w-full">
              <img
                src={post.originalPost.image}
                alt="Original Post Image"
                className="w-full h-auto object-fill max-h-[400px]"
                style={{ display: 'block' }}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Regular Post Text - Only show if not a repost */}
          {post.content && <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed break-words">{post.content}</p>}

          {/* Regular Post Media - Only show if not a repost */}
          {post.image && (
            <div className="overflow-hidden rounded-lg sm:rounded-xl w-full mb-3 sm:mb-4">
              <img
                src={post.image}
                alt="Post Image"
                className="w-full h-auto object-fill max-h-[500px]"
                style={{ display: 'block' }}
              />
            </div>
          )}
        </>
      )}
      
      {/* Price and Buy Button Section - Only show if price exists */}
      {hasPrice && (
        <div className="flex items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 p-3 sm:p-4 bg-[#FFFFFF08] rounded-lg sm:rounded-xl border border-[#FFFFFF1A]">
          {/* Price Section */}
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs sm:text-sm font-exo2 mb-1">Price</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-white text-base sm:text-lg md:text-xl font-bold font-exo2">
                {formattedPrice}
              </span>
              <span className="text-gray-300 text-sm sm:text-base font-exo2">
                {priceCurrency}
              </span>
            </div>
          </div>
          
          {/* Buy Button */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setShowLoginModal(true)
                return
              }
              // TODO: Implement buy functionality
              console.log('Buy clicked for post:', post.id, 'Price:', post.price)
            }}
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            Buy
          </button>
        </div>
      )}
      
      <div className="border-b border-[#6B757E4D] mb-2 sm:mb-3" />
      {/* Actions */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-2 md:gap-3 text-gray-400 flex-wrap">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] ${liked ? 'text-[#FF5500]' : ''}`}
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={liked ? '#FF5500' : 'none'} />
          <span className="text-xs sm:text-sm">{localLikes >= 1000 ? (localLikes / 1000).toFixed(1) + 'k' : localLikes}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" />
        {/* <div className='border-s-4'></div> */}
        <button
          onClick={handleCommentClick}
          className="flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] hover:text-blue-400"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localComments}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" />
        <button
          onClick={handleRepost}
          disabled={reposted || isReposting}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] disabled:opacity-50 disabled:cursor-not-allowed ${reposted ? 'text-green-400' : 'hover:text-green-400'}`}
        >
          <RefreshCcwIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localReposts}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" />
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] disabled:opacity-50 disabled:cursor-not-allowed hover:text-green-400"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localShares}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" />
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] ${saved ? 'text-yellow-400' : 'hover:text-yellow-400'}`}
        >
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" fill={saved ? 'currentColor' : 'none'} />
          <span className="text-xs sm:text-sm">{localSaves}</span>
        </button>
      </div>

      {/* Comments Accordion */}
      <div className="mt-3 sm:mt-4">
        <Collapse
          bordered={false}
          activeKey={activeKey}
          onChange={setActiveKey}
          ghost
          items={[
            {
              key: 'comments',
              label: (
                ''
              ),
              children: (
                <div className="space-y-8">

                  {/* --- Likes Section --- */}
                  {/* {localLikes > 0 && ( */}
                  <div className="flex items-start gap-3">
                    {/* Like Icon */}
                    <div className="w-8 h-8 flex-shrink-0">
                      <img src="/assets/Solid.png" alt="Heart" className="w-8 h-8 object-contain" />
                    </div>

                    {/* Avatars + Like Text */}
                    <div className="flex flex-col gap-2">
                      {/* Avatars group */}
                      <Avatar.Group maxCount={6} size={30}>
                        {(likers.length > 0 ? likers : []).slice(0, 6).map((item: any, idx: number) => {
                          const color = ['#F97316', '#8B5CF6', '#FACF5A', '#22D3EE', '#10B981', '#3B82F6'][idx % 6]
                          const isAPI = !!item?.user
                          const name = isAPI ? (item.user.name || item.user.username || 'User') : item.name
                          const initial = isAPI ? ((item.user.name?.[0] || item.user.username?.[0] || 'U').toUpperCase()) : item.initial
                          const src = isAPI ? item.user.profilePicture : undefined
                          return (
                            <Avatar
                              key={`${name}-${idx}`}
                              src={src}
                              style={{
                                backgroundColor: '#0F1035',
                                border: `2px solid ${color}`,
                                color: color,
                                fontWeight: 600,
                              }}
                            >
                              {!src && initial}
                            </Avatar>
                          )
                        })}
                      </Avatar.Group>

                      {/* Like paragraph */}
                      <p className="text-gray-300  border-l border-[#6B757E4D] pl-3 text-sm mt-1">
                        {(() => {
                          const firstName = (likers[0]?.user?.name || likers[0]?.user?.username) ?? post.username
                          const total = likersTotal || localLikes || 0
                          const others = Math.max(0, total - 1)
                          return (
                            <>
                              <span className="font-semibold text-white">{firstName}</span>
                              {others > 0 ? (
                                <>
                                  <span className="text-gray-400"> and </span>
                                  <span className="font-semibold text-white">{others}</span>
                                  <span className="text-gray-400"> {others === 1 ? 'other' : 'others'} liked your article</span>
                                </>
                              ) : (
                                <span className="text-gray-400"> liked your article</span>
                              )}
                              <span className="text-gray-500 ml-2 text-xs">
                                {post.timeAgo?.endsWith('.') ? post.timeAgo : `${post.timeAgo}.`}
                              </span>
                            </>
                          )
                        })()}
                      </p>
                    </div>
                  </div>
                  {/* )} */}

                  {/* --- Comments Section --- */}
                  <div className="flex items-start gap-3 ml-10">
                    {/* Comment Icon */}
                    <div className="w-7 h-7 flex-shrink-0 mt-1">
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.2153 12H23.7847C24.4876 12 25.0939 12 25.5934 12.0408C26.1205 12.0838 26.6448 12.1789 27.1493 12.436C27.9019 12.8195 28.5139 13.4314 28.8974 14.184C29.1544 14.6885 29.2495 15.2128 29.2926 15.74C29.3334 16.2394 29.3334 16.8458 29.3333 17.5486V21.2617C29.3333 21.8466 29.3334 22.3512 29.3049 22.7689C29.2749 23.2087 29.2089 23.6485 29.0289 24.0831C28.6229 25.0632 27.8442 25.8419 26.8641 26.2479C26.4295 26.4279 25.9896 26.4939 25.5498 26.5239C25.4801 26.5287 25.4079 26.5326 25.3333 26.5359V28C25.3333 28.4964 25.0576 28.9517 24.6176 29.1817C24.1777 29.4116 23.6465 29.3781 23.2389 29.0948L20.337 27.0773C19.89 26.7665 19.7996 26.7098 19.7142 26.6711C19.6157 26.6265 19.5121 26.5941 19.4058 26.5745C19.3135 26.5575 19.2069 26.5524 18.6626 26.5524H16.2153C15.5124 26.5524 14.9061 26.5524 14.4066 26.5116C13.8795 26.4686 13.3552 26.3735 12.8507 26.1164C12.0981 25.7329 11.4861 25.121 11.1026 24.3683C10.8456 23.8638 10.7505 23.3395 10.7074 22.8124C10.6666 22.313 10.6666 21.7066 10.6667 21.0038V17.5486C10.6666 16.8457 10.6666 16.2394 10.7074 15.74C10.7505 15.2128 10.8456 14.6885 11.1026 14.184C11.4861 13.4314 12.0981 12.8195 12.8507 12.436C13.3552 12.1789 13.8795 12.0838 14.4066 12.0408C14.9061 12 15.5124 12 16.2153 12Z" fill="#4FCAA7" />
                        <path d="M17.6551 5.49055e-07H7.67831C6.60502 -1.594e-05 5.71919 -2.9544e-05 4.9976 0.0589265C4.24814 0.12016 3.5592 0.251579 2.91209 0.5813C1.90856 1.09262 1.09266 1.90852 0.581338 2.91205C0.251617 3.55917 0.120198 4.2481 0.0589648 4.99757C8.33968e-06 5.71916 2.23285e-05 6.60498 3.93357e-05 7.67827L1.94675e-05 14.0278C-0.000158234 14.6166 -0.00029016 15.053 0.0563514 15.4396C0.397864 17.7711 2.22892 19.6022 4.5604 19.9437C4.65572 19.9577 4.71515 19.9934 4.74078 20.0148L4.74078 22.1185C4.74072 22.482 4.74067 22.8385 4.76603 23.1253C4.78856 23.3799 4.84757 23.9075 5.22239 24.3447C5.64022 24.832 6.2666 25.0892 6.90637 25.0361C7.48028 24.9884 7.89296 24.6545 8.08795 24.4892C8.14349 24.4421 8.20102 24.3906 8.26011 24.3359C8.13668 23.8549 8.08064 23.4089 8.04965 23.0296C7.99969 22.4182 7.99986 21.7118 8.00002 21.0603V17.4922C7.99986 16.8407 7.99969 16.1343 8.04965 15.5228C8.10619 14.8308 8.24613 13.9165 8.72666 12.9734C9.36581 11.719 10.3857 10.6991 11.6401 10.06C12.5832 9.57946 13.4975 9.43953 14.1895 9.38298C14.8009 9.33303 15.5073 9.3332 16.1588 9.33335H23.8412C24.3288 9.33323 24.8471 9.33311 25.3334 9.354V7.67824C25.3334 6.60496 25.3334 5.71915 25.2744 4.99757C25.2132 4.2481 25.0818 3.55917 24.7521 2.91205C24.2407 1.90852 23.4249 1.09263 22.4213 0.5813C21.7742 0.251579 21.0853 0.12016 20.3358 0.0589265C19.6142 -2.9544e-05 18.7284 -1.594e-05 17.6551 5.49055e-07Z" fill="#4FCAA7" />
                      </svg>
                    </div>

                    {/* Comments */}
                    <div className="w-full ">
                      <div className="flex-1 flex flex-col h-[200px] overflow-y-auto gap-8 scrollbar-hide">
                        {comments && comments.length > 0 ? (
                          comments.map((comment: any, idx: number) => (
                            <div key={idx} className="relative flex gap-3">
                              {/* Avatar with connecting line */}
                              <div className="relative flex flex-col items-center">
                                <Avatar
                                  size={32}
                                  src={comment?.author?.profilePicture}
                                  style={{
                                    backgroundColor: '#FACC15',
                                    border: '2px solid #FACC15',
                                  }}
                                >
                                  {!comment?.author?.profilePicture &&
                                    (comment?.author?.name?.[0]?.toUpperCase() ||
                                      comment?.author?.username?.[0]?.toUpperCase() ||
                                      'U')}
                                </Avatar>

                                {/* Connecting vertical line (only if not last comment) */}
                                {idx < comments.length - 1 && (
                                  <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[1.5px] bg-[#6B757E]" style={{ height: 'calc(100% - 40px)' }} />
                                )}
                              </div>

                              {/* Comment Content */}
                              <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start">
                                  <p className="text-gray-300 text-[15px] leading-6">
                                    <span className="font-semibold text-white text-base">
                                      {comment?.author?.name || comment?.author?.username || 'User'}
                                    </span>{' '}
                                    <span className="text-gray-400">commented</span>{' '}
                                    <span className="text-gray-500 text-sm">
                                      {formatRelativeTime(comment?.createdAt)}.
                                    </span>
                                  </p>

                                  {/* Like Icon */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCommentLike(comment?._id, idx)}
                                    className="flex flex-col items-center text-center cursor-pointer"
                                    aria-label="Like comment"
                                  >
                                    <Heart
                                      className="w-4 h-4 text-[#FF7A1A]"
                                      fill={comment?.isLiked ? '#F97316' : 'none'}
                                    />
                                    <span className="text-[#9AA4B2] text-xs font-semibold">
                                      {comment?.likesCount ?? 0}
                                    </span>
                                  </button>
                                </div>

                                {/* Comment Text */}
                                <p className="text-[#FCFCFC] text-[15px] font-[400] leading-[1.75] ml-[4px] font-exo2 mr-6">
                                  {renderCommentText(comment?.text)}
                                </p>

                                {/* Replies Section */}
                                {comment?.replies?.length > 0 && (
                                  <div className="mt-4 ml-10 flex flex-col gap-4 font-exo2">
                                    {comment.replies.map((reply: any, i: number) => (
                                      <div key={i} className="relative flex gap-3">
                                        {/* Reply Avatar with connecting line */}
                                        <div className="relative flex flex-col items-center">
                                          <Avatar
                                            size={20}
                                            src={reply?.author?.profilePicture}
                                            style={{
                                              backgroundColor: '#8B5CF6',
                                              border: '2px solid #8B5CF6',
                                            }}
                                          >
                                            {!reply?.author?.profilePicture &&
                                              (reply?.author?.name?.[0]?.toUpperCase() ||
                                                reply?.author?.username?.[0]?.toUpperCase() ||
                                                'U')}
                                          </Avatar>

                                          {/* Connecting line between replies */}
                                          {i < comment.replies.length - 1 && (
                                            <div
                                              className="absolute top-[34px] left-1/2 -translate-x-1/2 w-[1.5px] bg-[#6B757E]"
                                              style={{ height: 'calc(100% - 34px)' }}
                                            />
                                          )}
                                        </div>

                                        {/* Reply Content */}
                                        <div className="flex-1 flex justify-between items-start font-exo2">
                                          <div>
                                            <p className="text-gray-300 text-sm leading-6 font-exo2">
                                              <span className="font-semibold text-white">
                                                {reply?.author?.name || reply?.author?.username || 'User'}
                                              </span>{' '}
                                              <span className="text-gray-400">replied</span>{' '}
                                              <span className="text-gray-500 text-xs font-exo2">
                                                {formatRelativeTime(reply?.createdAt)}.
                                              </span>
                                            </p>
                                            <p className="text-[#FCFCFC] text-[12px] leading-[1.75] ml-[4px] w-[90%] font-exo2">
                                              {renderCommentText(reply?.text)}
                                            </p>
                                          </div>

                                          <div className="flex flex-col items-center">
                                            <Heart
                                              className="w-4 h-4 text-[#FF7A1A]"
                                              fill={reply?.isLiked ? '#F97316' : 'none'}
                                            />
                                            <span className="text-[#9AA4B2] text-xs font-semibold">
                                              {reply?.likesCount ?? 0}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-300 text-[15px] font-[400] leading-[1.75] ml-[4px] font-exo2 mr-6">
                            No comments yet.
                          </p>
                        )}
                      </div>


                      {/* comment Input Section */}
                      <div className="mt-4">
                        <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
                          {/* User Profile Picture */}
                          <Avatar
                            src={currentUser?.profilePicture || currentUser?.avatar}
                            size={30}
                            style={{ backgroundColor: '#8B5CF6' }}
                          >
                            {!currentUser?.profilePicture && !currentUser?.avatar && (
                              currentUser?.username?.charAt(0).toUpperCase() || currentUser?.name?.charAt(0).toUpperCase() || 'U'
                            )}
                          </Avatar>

                          {/* Input Field with Emoji Icon Inside */}
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={commentText}
                              onChange={handleCommentChange}
                              placeholder="Write a comment"
                              className="w-full rounded-full px-4 py-2 pr-12 text-white placeholder-gray-500 focus:outline-none text-sm"
                              disabled={isSubmitting}
                            />
                            
                            {/* User Mention Suggestions Dropdown */}
                            {showMentionSuggestions && searchedUsers.length > 0 && (
                              <div 
                                ref={mentionDropdownRef}
                                className="absolute left-0 bottom-full mb-2 w-full max-w-xs bg-[#1a1a2e] border border-[#FFFFFF33] rounded-lg shadow-lg max-h-48 overflow-y-auto z-50"
                              >
                                {searchedUsers.map((user) => (
                                  <button
                                    key={user._id}
                                    type="button"
                                    onClick={() => handleUserSelect(user.username)}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a3e] transition-colors text-left"
                                  >
                                    <Avatar
                                      size={32}
                                      src={user.profilePicture}
                                      style={{
                                        backgroundColor: '#8B5CF6',
                                        border: '2px solid #8B5CF6',
                                      }}
                                    >
                                      {!user.profilePicture && (user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U')}
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm font-semibold truncate">
                                        {user.name || user.username}
                                      </p>
                                      <p className="text-gray-400 text-xs truncate">@{user.username}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                            {/* Emoji Icon Inside Input - Right Side */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2" ref={emojiPickerRef}>
                              <button
                                type="button"
                                onClick={() => setIsEmojiPickerOpen(v => !v)}
                                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                aria-label="Add emoji"
                              >
                                <Smile className="w-5 h-5" />
                              </button>
                              {isEmojiPickerOpen && (
                                <div className="absolute top-full right-0 mt-2 z-50">
                                  <EmojiPicker
                                    onEmojiClick={(emojiData) => {
                                      setCommentText(prev => prev + (emojiData.emoji || ''))
                                      setIsEmojiPickerOpen(false)
                                    }}
                                    width={360}
                                    height={400}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Send Button */}
                          <button
                            type="submit"
                            disabled={!commentText.trim() || isSubmitting}
                            className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:bg-gray-100 flex-shrink-0"
                          >
                            {isSubmitting ? 'Sending...' : 'Send'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
      
      {/* Login Required Modal */}
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="You need to be logged in to perform this action. Please login to continue."
      />

      {/* Repost Modal */}
      <RepostModal
        isOpen={showRepostModal}
        onClose={() => setShowRepostModal(false)}
        onRepost={handleRepostSubmit}
        isReposting={isReposting}
        post={{
          username: post.username,
          timeAgo: post.timeAgo,
          profilePicture: post.profilePicture,
          content: post.content,
          image: post.image,
        }}
      />
    </div>
  )
}

