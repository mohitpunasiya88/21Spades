'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle2, RefreshCcwIcon, Smile, Send, UserIcon, MoreVertical, Edit, Trash2, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFeedStore, useAuthStore } from '@/lib/store/authStore'
import { Avatar, Button, Collapse, Tooltip as AntTooltip, Steps, Carousel } from 'antd'
import EmojiPicker from 'emoji-picker-react'
import { useChatStore } from '@/lib/store/chatStore'
import { useAuth } from '@/lib/hooks/useAuth'
import LoginRequiredModal from '@/components/Common/LoginRequiredModal'
import RepostModal from '@/components/Common/RepostModal'
import SharefeedModal from '@/app/(dashboard)/feed/Sharefeed'
import { useMessage } from '@/lib/hooks/useMessage'
import Tooltip from '@/components/Common/Tooltip'

interface FeedPostProps {
  post: {
    id: string
    originalPostId?: string // For reposts, this is the original post ID
    authorId?: string // Author ID for ownership check
    username: string
    verified: boolean
    timeAgo: string
    walletAddress: string
    profilePicture?: string
    content: string
    image?: string
    images?: string[]
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
      _id?: string
      id?: string
      price?: number
      currency?: string
      collectionId?: string | {
        _id?: string
        id?: string
      }
      auctionType?: number
      startingTime?: number | string
      endingTime?: number | string
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
      image?: string
      images?: string[]
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

// Simple carousel component for post media using Ant Design Carousel
function PostMediaCarousel({
  images,
  maxHeight = 500,
}: {
  images: string[]
  maxHeight?: number
}) {
  const carouselRef = useRef<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!images || images.length === 0) return null

  const handlePrev = () => {
    carouselRef.current?.prev()
  }

  const handleNext = () => {
    carouselRef.current?.next()
  }

  const handleBeforeChange = (from: number, to: number) => {
    setCurrentSlide(to)
  }

  return (
    <div className="relative w-full mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden bg-black/40">
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={3000}
        dots={images.length > 1}
        infinite
        effect="scrollx"
        arrows={true}
        beforeChange={handleBeforeChange}
      >
        {images.map((image, index) => (
          <div key={`image-${index}-${image}`} className="flex items-center justify-center">
            <img
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-auto object-contain"
              style={{ maxHeight }}
              draggable={false}
            />
          </div>
        ))}
      </Carousel>
      
      {images.length > 1 && (
        <>
          {/* Counter top-right - shows current/total format */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] sm:text-xs font-medium z-10">
            {currentSlide + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  )
}

// Helper function to render text with clickable links
const renderTextWithLinks = (text: string) => {
  if (!text) return null
  
  // URL regex pattern - matches http, https, www, and common domains
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/gi
  
  const parts: (string | React.ReactNode)[] = []
  let lastIndex = 0
  let match
  
  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    
    // Add the link
    let url = match[0]
    let displayUrl = url
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    // Truncate long URLs for display
    if (displayUrl.length > 50) {
      displayUrl = displayUrl.substring(0, 47) + '...'
    }
    
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#7E6BEF] hover:text-[#9B8AFF] underline break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {displayUrl}
      </a>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  return parts.length > 0 ? <>{parts}</> : text
}

export default function FeedPost({ post }: FeedPostProps) {
  const router = useRouter()
  const { likePost, sharePost, savePost, commentPost, getComments, repostPost, likeComment, postLikes, updatePost, deletePost } = useFeedStore()
  const { searchUsers, searchedUsers, clearSearchedUsers } = useChatStore()
  const { user: currentUser } = useAuthStore()
  const { message } = useMessage()
  const isAuthenticated = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [updateText, setUpdateText] = useState(post.content)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)
  const updateImageInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Check if current user is the owner - handle both id and _id formats
  const currentUserId = currentUser?.id || (currentUser as any)?._id
  const postAuthorId = post.authorId
  
  // Also try to get authorId from store if not in props
  const storePost = useFeedStore((state) => state.posts.find((p) => p._id === post.id))
  const authorIdFromStore = storePost?.author?._id
  
  const finalAuthorId = postAuthorId || authorIdFromStore
  const isOwner = currentUserId && finalAuthorId && String(currentUserId) === String(finalAuthorId)

  // Sync updateText and reset image when modal opens/closes
  useEffect(() => {
    if (showUpdateModal) {
      setUpdateText(post.content)
      setNewImageFile(null)
      setNewImagePreview(null)
      setRemoveCurrentImage(false)
    }
  }, [showUpdateModal, post.content])

  // Handle image selection for update
  const handleUpdateImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    // Reset input to allow selecting same file again
    if (updateImageInputRef.current) {
      updateImageInputRef.current.value = ''
    }
  }

  // Handle remove image
  const handleRemoveUpdateImage = () => {
    setNewImageFile(null)
    setNewImagePreview(null)
    setRemoveCurrentImage(false)
  }

  // Handle remove current image
  const handleRemoveCurrentImage = () => {
    setRemoveCurrentImage(true)
    setNewImageFile(null)
    setNewImagePreview(null)
  }
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
  
  // Auction time calculation
  const [isAuctionLive, setIsAuctionLive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  
  // Parse timestamp helper
  const parseTime = (timeValue: number | string | undefined): number | null => {
    if (timeValue === undefined || timeValue === null || timeValue === '') return null
    if (typeof timeValue === 'string') {
      const numericValue = Number(timeValue)
      if (!isNaN(numericValue) && isFinite(numericValue)) {
        // It's a numeric string, treat as timestamp
        if (timeValue.length <= 10) { // Likely seconds
          return numericValue * 1000
        } else { // Likely milliseconds
          return numericValue
        }
      } else {
        // Try parsing as date string
        const parsed = new Date(timeValue).getTime()
        return isNaN(parsed) ? null : parsed
      }
    } else if (typeof timeValue === 'number') {
      if (timeValue.toString().length <= 10) { // Likely seconds
        return timeValue * 1000
      } else { // Already in milliseconds
        return timeValue
      }
    }
    return null
  }
  
  // Calculate auction time
  useEffect(() => {
    const auctionType = post.nft?.auctionType
    const startingTime = post.nft?.startingTime
    const endingTime = post.nft?.endingTime
    
    console.log('🔍 FeedPost Auction Debug:', {
      postId: post.id,
      auctionType,
      startingTime,
      endingTime,
      'auctionType type': typeof auctionType,
      'startingTime type': typeof startingTime,
      'endingTime type': typeof endingTime,
      'isAuction (auctionType === 2)': Number(auctionType) === 2,
      'nft object': post.nft,
    })
    
    if (Number(auctionType) !== 2) {
      console.log('❌ Not an auction (auctionType !== 2), clearing state')
      setIsAuctionLive(false)
      setTimeRemaining('')
      return
    }
    
    const checkAuctionStatus = () => {
      const now = Date.now()
      const startTime = parseTime(startingTime)
      const endTime = parseTime(endingTime)
      
      console.log('⏰ Auction Time Calculation:', {
        now,
        startTime,
        endTime,
        'startTime formatted': startTime ? new Date(startTime).toLocaleString() : null,
        'endTime formatted': endTime ? new Date(endTime).toLocaleString() : null,
        'now formatted': new Date(now).toLocaleString(),
      })
      
      if (!startTime && !endTime) {
        setIsAuctionLive(false)
        setTimeRemaining('')
        return
      }
      
      // Check if auction has ended
      if (endTime && now >= endTime) {
        console.log('✅ Auction Ended')
        setIsAuctionLive(false)
        setTimeRemaining('Ended')
        return
      }
      
      // Check if auction hasn't started yet (scheduled)
      if (startTime && now < startTime) {
        setIsAuctionLive(false)
        const timeUntilStart = startTime - now
        const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60))
        
        let timeStr = ''
        if (days > 0) {
          timeStr = `${days}d ${hours}h`
        } else if (hours > 0) {
          timeStr = `${hours}h ${minutes}m`
        } else if (minutes > 0) {
          timeStr = `${minutes}m`
        } else {
          timeStr = 'Starting soon'
        }
        
        console.log('⏳ Auction Scheduled - Starts in:', timeStr)
        setTimeRemaining(timeStr)
        return
      }
      
      // Auction is live (now is between start and end, or after start if no end)
      setIsAuctionLive(true)
      
      // Calculate time remaining until end
      if (endTime && endTime > now) {
        const timeUntilEnd = endTime - now
        const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000)
        
        let timeStr = ''
        if (days > 0) {
          timeStr = `${days}d ${hours}h`
        } else if (hours > 0) {
          timeStr = `${hours}h ${minutes}m`
        } else if (minutes > 0) {
          timeStr = `${minutes}m ${seconds}s`
        } else if (seconds > 0) {
          timeStr = `${seconds}s`
        } else {
          timeStr = 'Ending soon'
        }
        
        console.log('🟢 Auction Live - Ends in:', timeStr, { isAuctionLive: true, timeRemaining: timeStr })
        setTimeRemaining(timeStr)
      } else if (!endTime) {
        // No end time but auction is live
        console.log('🟢 Auction Live - No end time')
        setTimeRemaining('')
      } else {
        console.log('🟢 Auction Live - Ending soon')
        setTimeRemaining('Ending soon')
      }
    }
    
    checkAuctionStatus()
    const intervalId = setInterval(checkAuctionStatus, 1000)
    return () => clearInterval(intervalId)
  }, [post.nft?.auctionType, post.nft?.startingTime, post.nft?.endingTime])
  const [isReposting, setIsReposting] = useState(false)
  const [showRepostModal, setShowRepostModal] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)
  const [mentionQuery, setMentionQuery] = useState('')
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionStartPos, setMentionStartPos] = useState<number | null>(null)
  const mentionDropdownRef = useRef<HTMLDivElement | null>(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  
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
    // Debug logs - only log when post price data actually changes (not on every render)
    useEffect(() => {
      const currentRawPrice = post.price !== undefined && post.price !== null 
        ? post.price 
        : (post.nft?.price !== undefined && post.nft?.price !== null ? post.nft?.price : undefined)
      
      const currentNumericPrice = currentRawPrice !== undefined && currentRawPrice !== null
        ? (typeof currentRawPrice === 'string' ? parseFloat(currentRawPrice) : typeof currentRawPrice === 'number' ? currentRawPrice : undefined)
        : undefined
      
      const currentHasPrice = currentNumericPrice !== undefined && currentNumericPrice !== null && typeof currentNumericPrice === 'number' && !Number.isNaN(currentNumericPrice) && currentNumericPrice >= 0
      
      const currentFormattedPrice = currentHasPrice 
        ? (currentNumericPrice >= 1 ? currentNumericPrice.toFixed(2) : currentNumericPrice.toFixed(4)) 
        : ''
      
      const currentPriceCurrency = post.currency || post.nft?.currency || 'AVAX'
      
    
    }, [post.id, post.price, post.nft?.price, post.currency, post.nft?.currency])
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

  const handleShare = () => {
    // Only open the Share modal; no API call here
    setIsShareModalOpen(true)
  }

  // const handleSave = async () => {
  //   if (!isAuthenticated) {
  //     setShowLoginModal(true)
  //     return
  //   }

  //   const newSaved = !saved
  //   const isRepost = !!post.originalPostId

  //   // For reposts, don't do optimistic update - wait for API response
  //   if (!isRepost) {
  //     setSaved(newSaved)
  //     setLocalSaves(newSaved ? localSaves + 1 : Math.max(0, localSaves - 1))
  //   }

  //   try {
  //     // For reposts, save the original post, otherwise save the current post
  //     const postIdToSave = post.originalPostId || post.id
  //     await savePost(postIdToSave)

  //     // Update from store - the savePost function already updated the store
  //     const allPosts = useFeedStore.getState().posts

  //     if (isRepost && post.originalPostId) {
  //       // For reposts, find the original post in the store (which was just updated by savePost)
  //       const originalPost = allPosts.find(p => p._id === post.originalPostId)
  //       if (originalPost) {
  //         setLocalSaves(originalPost.savesCount || 0)
  //         setSaved(originalPost.isSaved || false)
  //       }
  //     } else {
  //       // For regular posts, find the updated post
  //       const updatedPost = allPosts.find(p => p._id === post.id)
  //       if (updatedPost) {
  //         setLocalSaves(updatedPost.savesCount || 0)
  //         setSaved(updatedPost.isSaved || false)
  //       }
  //     }
  //   } catch (error) {
  //     // Revert on error
  //     if (!isRepost) {
  //       setSaved(!newSaved)
  //       setLocalSaves(post.saves)
  //     }
  //     console.error('Error saving post:', error)
  //   }
  // }

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
      
      // Handle menu dropdown
      if (showMenu && menuRef.current && !menuRef.current.contains(target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleDocClick)
    return () => {
      document.removeEventListener('mousedown', handleDocClick)
    }
  }, [isEmojiPickerOpen, showMentionSuggestions, showMenu])

  const handleUpdatePost = async () => {
    if (!updateText.trim() && !post.image && !newImagePreview && !removeCurrentImage) {
      message.error('Post cannot be empty')
      return
    }
    
    setIsUpdating(true)
    try {
      // Determine image URL:
      // - If new image selected, use new image preview
      // - If removeCurrentImage is true, set to undefined (remove image)
      // - Otherwise, keep existing image
      let imageUrl: string | undefined
      if (newImagePreview) {
        imageUrl = newImagePreview
      } else if (removeCurrentImage) {
        imageUrl = undefined
      } else {
        imageUrl = post.image || undefined
      }
      
      await updatePost(post.id, {
        text: updateText.trim() || undefined,
        postUrl: imageUrl,
        // Keep first image in postUrls for compatibility with new backend
        postUrls: imageUrl ? [imageUrl] : post.image ? [post.image] : undefined,
      })
      message.success('Post updated successfully')
      setShowUpdateModal(false)
      setUpdateText(post.content)
      setNewImageFile(null)
      setNewImagePreview(null)
      setRemoveCurrentImage(false)
    } catch (error: any) {
      console.error('Error updating post:', error)
      message.error(error?.response?.data?.message || 'Failed to update post')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeletePost = async () => {
    setIsDeleting(true)
    try {
      await deletePost(post.id)
      message.success('Post deleted successfully')
      setShowDeleteModal(false)
    } catch (error: any) {
      console.error('Error deleting post:', error)
      message.error(error?.response?.data?.message || 'Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }
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
          onClick={() => {
            if (post.authorId) {
              router.push(`/profile?userId=${post.authorId}`)
            }
          }}
          className="flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden p-1.5 sm:p-2 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          style={
            post.profilePicture
              ? undefined
              : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
          }
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
        <div className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => {
            if (post.authorId) {
              router.push(`/profile?userId=${post.authorId}`)
            }
          }}>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-white font-semibold truncate text-sm sm:text-base">{post.username}</span>
            {/* {post.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />} */}
            <img src="/post/verify-white.png" alt="" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">{post.timeAgo}</span>
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs truncate">{post.walletAddress}</p>
        </div>
        
        {/* Three-dot menu - Show for all posts, disabled for non-owners */}
        <Tooltip 
          message={!isOwner ? "You can only edit or delete your own posts" : ""} 
          disabled={isOwner}
        >
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (isOwner) {
                  setShowMenu(!showMenu)
                }
              }}
              disabled={!isOwner}
              className={`p-1.5 flex flex-col items-center gap-0.5 transition-opacity ${
                isOwner 
                  ? 'hover:opacity-80 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              aria-label="Post options"
            >
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            </button>
            
            {showMenu && isOwner && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a2e] border border-[#FFFFFF33] rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setUpdateText(post.content)
                    setShowUpdateModal(true)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Update this post</span>
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true)
                    setShowMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors border-t border-[#FFFFFF33]"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </Tooltip>
      </div>

      {/* Repost Caption - Only show if it's a repost and has caption */}
      {isRepost && post.repostCaption && (
        <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed break-words">
          {renderTextWithLinks(post.repostCaption)}
        </p>
      )}

      {/* Embedded Original Post - Show if it's a repost */}
      {isRepost && post.originalPost ? (
        <div className="rounded-lg sm:rounded-xl border border-[#4F01E6] bg-[#090721] p-3 sm:p-4 mb-3 sm:mb-4">
          {/* Original Post Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div
              className="flex items-center justify-center w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full overflow-hidden p-1 sm:p-1.5 flex-shrink-0"
              style={
                post.originalPost.profilePicture
                  ? undefined
                  : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
              }
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
            <p className="text-white/90 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed break-words">
              {renderTextWithLinks(post.originalPost.content)}
            </p>
          )}

          {/* Original Post Media */}
          {(() => {
            const images = post.originalPost?.images && post.originalPost.images.length > 0
              ? post.originalPost.images
              : post.originalPost?.image
              ? [post.originalPost.image]
              : []

            if (!images.length) return null

            return <PostMediaCarousel images={images} maxHeight={400} />
          })()}
        </div>
      ) : (
        <>
          {/* Regular Post Text - Only show if not a repost */}
          {post.content && (
            <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed break-words">
              {renderTextWithLinks(post.content)}
            </p>
          )}

          {/* Regular Post Media - Only show if not a repost */}
          {(() => {
            const images = (post.images && post.images.length > 0)
              ? post.images
              : post.image
              ? [post.image]
              : []

            if (!images.length) return null

            return <PostMediaCarousel images={images} maxHeight={500} />
          })()}
        </>
      )}
      
      {/* Auction Status Section - Show if auction type */}
      {(() => {
        const isAuction = Number(post.nft?.auctionType) === 2
        const shouldShow = isAuction && (timeRemaining || timeRemaining === 'Ended' || isAuctionLive)
        
        console.log('🎨 Auction Status Render Check:', {
          postId: post.id,
          isAuction,
          auctionType: post.nft?.auctionType,
          timeRemaining,
          isAuctionLive,
          shouldShow,
          'nft object': post.nft,
        })
        
        if (!shouldShow) {
          console.log('❌ Not rendering auction status - conditions not met')
          return null
        }
        
        console.log('✅ Rendering auction status section')
        
        return (
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2 flex-wrap">
          {/* Left side: Live Badge */}
          {isAuctionLive ? (
            <span className="inline-flex items-center gap-1 text-[#33E030] text-[11px] font-semibold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#33E030] animate-pulse" />
              Live
            </span>
          ) : timeRemaining === 'Ended' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-gray-400 bg-gray-400/10 border border-gray-400/30 text-xs font-semibold font-exo2">
              Auction Ended
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/40 text-[11px] font-semibold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
              Scheduled
            </span>
          )}
          
          {/* Right side: Time Display */}
          {isAuctionLive && timeRemaining ? (
            // Live Auction - Show end time
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#FFB600] bg-[#FFB600]/10 border border-[#FFB600]/30 text-xs font-semibold font-exo2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB600] animate-pulse" />
              Ends in {timeRemaining}
            </span>
          ) : timeRemaining && timeRemaining !== 'Ended' ? (
            // Scheduled Auction - Show start time
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 text-xs font-semibold font-exo2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
              Starts in {timeRemaining}
            </span>
          ) : timeRemaining === 'Ended' ? null : (
            // Live but no time data
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#33E030] bg-[#33E030]/10 border border-[#33E030]/30 text-xs font-semibold font-exo2">
              Live Auction
            </span>
          )}
        </div>
        )
      })()}
      
      {!isOwner && hasPrice && (
        <div className="flex items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Price Section - Single line format: "Price: 1.34 AVAX" */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-gray-400 text-sm sm:text-base font-exo2">Price:</span>
            <span className="text-white text-base sm:text-lg md:text-xl font-bold font-exo2">
              {formattedPrice}
            </span>
            <span className="text-red-500 text-sm sm:text-base font-exo2 font-semibold">
              {priceCurrency}
            </span>
          </div>
          
          {/* Buy Button - Only show if post is not owned by current user */}
          
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowLoginModal(true)
                  return
                }
                
                // Extract NFT ID and collection ID from post data
                const nftId = post.nft?._id || post.nft?.id
                const collectionId = typeof post.nft?.collectionId === 'string' 
                  ? post.nft.collectionId 
                  : post.nft?.collectionId?._id || post.nft?.collectionId?.id
                
                if (nftId && collectionId) {
                  router.push(`/marketplace/nft/${nftId}?collectionId=${collectionId}`)
                } else {
                  message.error('NFT information not available')
                }
              }}
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_rgba(79,1,230,0.6)] hover:shadow-[#4F01E6] active:scale-95 text-sm sm:text-base whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              Buy
            </button>
          {/* )} */}
        </div>
      )}
      
      <div className="border-b border-[#6B757E4D] mb-2 sm:mb-3" />
      {/* Actions */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-2 md:gap-3 text-gray-400 flex-wrap">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] cursor-pointer ${liked ? 'text-[#FF5500]' : ''}`}
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={liked ? '#FF5500' : 'none'} />
          <span className="text-xs sm:text-sm">{localLikes >= 1000 ? (localLikes / 1000).toFixed(1) + 'k' : localLikes}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" />
        {/* <div className='border-s-4'></div> */}
        <button
          onClick={handleCommentClick}
          className="flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] hover:text-blue-400 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localComments}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" />
        <button
          onClick={handleRepost}
          disabled={reposted || isReposting}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${reposted ? 'text-green-400' : 'hover:text-green-400'}`}
        >
          <RefreshCcwIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localReposts}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" />
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] disabled:opacity-50 disabled:cursor-not-allowed hover:text-green-400 cursor-pointer"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localShares}</span>
        </button>
        {/* vertical line */}
        {/* <div className="w-px h-[18px] bg-[#6B757E4D] hidden sm:block" /> */}
        {/* <button
          onClick={handleSave}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border border-[#FFFFFF1A] hover:bg-[#131035] ${saved ? 'text-yellow-400' : 'hover:text-yellow-400'} cursor-pointer`}
        >
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" fill={saved ? 'currentColor' : 'none'} />
          <span className="text-xs sm:text-sm">{localSaves}</span>
        </button> */}
      </div>

      {/* Comments Accordion */}
      <div className="mt-3 sm:mt-4 w-full">
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
                  <div className="flex items-start gap-3 ml-0 sm:ml-10 md:ml-10">
                    {/* Comment Icon */}
                    <div className="w-7 h-7 flex-shrink-0 mt-1">
                      <svg width="18" height="18" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.2153 12H23.7847C24.4876 12 25.0939 12 25.5934 12.0408C26.1205 12.0838 26.6448 12.1789 27.1493 12.436C27.9019 12.8195 28.5139 13.4314 28.8974 14.184C29.1544 14.6885 29.2495 15.2128 29.2926 15.74C29.3334 16.2394 29.3334 16.8458 29.3333 17.5486V21.2617C29.3333 21.8466 29.3334 22.3512 29.3049 22.7689C29.2749 23.2087 29.2089 23.6485 29.0289 24.0831C28.6229 25.0632 27.8442 25.8419 26.8641 26.2479C26.4295 26.4279 25.9896 26.4939 25.5498 26.5239C25.4801 26.5287 25.4079 26.5326 25.3333 26.5359V28C25.3333 28.4964 25.0576 28.9517 24.6176 29.1817C24.1777 29.4116 23.6465 29.3781 23.2389 29.0948L20.337 27.0773C19.89 26.7665 19.7996 26.7098 19.7142 26.6711C19.6157 26.6265 19.5121 26.5941 19.4058 26.5745C19.3135 26.5575 19.2069 26.5524 18.6626 26.5524H16.2153C15.5124 26.5524 14.9061 26.5524 14.4066 26.5116C13.8795 26.4686 13.3552 26.3735 12.8507 26.1164C12.0981 25.7329 11.4861 25.121 11.1026 24.3683C10.8456 23.8638 10.7505 23.3395 10.7074 22.8124C10.6666 22.313 10.6666 21.7066 10.6667 21.0038V17.5486C10.6666 16.8457 10.6666 16.2394 10.7074 15.74C10.7505 15.2128 10.8456 14.6885 11.1026 14.184C11.4861 13.4314 12.0981 12.8195 12.8507 12.436C13.3552 12.1789 13.8795 12.0838 14.4066 12.0408C14.9061 12 15.5124 12 16.2153 12Z" fill="#4FCAA7" />
                        <path d="M17.6551 5.49055e-07H7.67831C6.60502 -1.594e-05 5.71919 -2.9544e-05 4.9976 0.0589265C4.24814 0.12016 3.5592 0.251579 2.91209 0.5813C1.90856 1.09262 1.09266 1.90852 0.581338 2.91205C0.251617 3.55917 0.120198 4.2481 0.0589648 4.99757C8.33968e-06 5.71916 2.23285e-05 6.60498 3.93357e-05 7.67827L1.94675e-05 14.0278C-0.000158234 14.6166 -0.00029016 15.053 0.0563514 15.4396C0.397864 17.7711 2.22892 19.6022 4.5604 19.9437C4.65572 19.9577 4.71515 19.9934 4.74078 20.0148L4.74078 22.1185C4.74072 22.482 4.74067 22.8385 4.76603 23.1253C4.78856 23.3799 4.84757 23.9075 5.22239 24.3447C5.64022 24.832 6.2666 25.0892 6.90637 25.0361C7.48028 24.9884 7.89296 24.6545 8.08795 24.4892C8.14349 24.4421 8.20102 24.3906 8.26011 24.3359C8.13668 23.8549 8.08064 23.4089 8.04965 23.0296C7.99969 22.4182 7.99986 21.7118 8.00002 21.0603V17.4922C7.99986 16.8407 7.99969 16.1343 8.04965 15.5228C8.10619 14.8308 8.24613 13.9165 8.72666 12.9734C9.36581 11.719 10.3857 10.6991 11.6401 10.06C12.5832 9.57946 13.4975 9.43953 14.1895 9.38298C14.8009 9.33303 15.5073 9.3332 16.1588 9.33335H23.8412C24.3288 9.33323 24.8471 9.33311 25.3334 9.354V7.67824C25.3334 6.60496 25.3334 5.71915 25.2744 4.99757C25.2132 4.2481 25.0818 3.55917 24.7521 2.91205C24.2407 1.90852 23.4249 1.09263 22.4213 0.5813C21.7742 0.251579 21.0853 0.12016 20.3358 0.0589265C19.6142 -2.9544e-05 18.7284 -1.594e-05 17.6551 5.49055e-07Z" fill="#4FCAA7" />
                      </svg>
                    </div>

                    {/* Comments */}
                    <div className="w-full ">
                      <div className={`flex-1 flex flex-col ${comments && comments.length > 0 ? 'h-[100px] overflow-y-auto' : ''} gap-8 scrollbar-hide`}>
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
                      <div className="mt-1">
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
      {/* Share Modal */}
      <SharefeedModal open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />

      {/* Update Post Modal */}
      {showUpdateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            // Prevent closing modal when clicking outside during update
            if (!isUpdating && e.target === e.currentTarget) {
              setShowUpdateModal(false)
              setUpdateText(post.content)
              setNewImageFile(null)
              setNewImagePreview(null)
              setRemoveCurrentImage(false)
            }
          }}
        >
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <button
              onClick={() => {
                if (!isUpdating) {
                  setShowUpdateModal(false)
                  setUpdateText(post.content)
                  setNewImageFile(null)
                  setNewImagePreview(null)
                  setRemoveCurrentImage(false)
                }
              }}
              disabled={isUpdating}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
                isUpdating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="p-6 sm:p-8">
              <h2 className="text-white text-2xl sm:text-3xl font-exo2 font-bold mb-4 text-center">
                Update Post
              </h2>
              
              <textarea
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-black/40 border border-gray-600 rounded-lg px-4 py-3 text-white font-exo2 text-base focus:outline-none focus:ring-1 focus:ring-[#7E6BEF] focus:border-[#7E6BEF] resize-none min-h-[120px]"
                disabled={isUpdating}
              />
              
              {/* Image Upload Section */}
              <div className="mt-4 space-y-3">
                {/* New Image Preview */}
                {newImagePreview && (
                  <div className="relative">
                    <img
                      src={newImagePreview}
                      alt="New post image"
                      className="w-full h-auto rounded-lg max-h-[300px] object-contain"
                    />
                    <button
                      onClick={handleRemoveUpdateImage}
                      disabled={isUpdating}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                
                {/* Current Image (if no new image selected and not removed) */}
                {!newImagePreview && !removeCurrentImage && post.image && (
                  <div className="relative">
                    <img
                      src={post.image}
                      alt="Current post image"
                      className="w-full h-auto rounded-lg max-h-[300px] object-contain"
                    />
                    <button
                      onClick={handleRemoveCurrentImage}
                      disabled={isUpdating}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <p className="text-gray-400 text-xs mt-2 text-center">Click remove to delete or upload new to replace</p>
                  </div>
                )}
                
                {/* Upload Image Button */}
                {!newImagePreview && (
                  <button
                    type="button"
                    onClick={() => updateImageInputRef.current?.click()}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-600 rounded-lg bg-black/40 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm font-exo2">
                      {(post.image && !removeCurrentImage) ? 'Change Image' : 'Add Image'}
                    </span>
                  </button>
                )}
                
                {/* Hidden File Input */}
                <input
                  ref={updateImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpdateImageSelect}
                  className="hidden"
                  disabled={isUpdating}
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (!isUpdating) {
                      setShowUpdateModal(false)
                      setUpdateText(post.content)
                      setNewImageFile(null)
                      setNewImagePreview(null)
                      setRemoveCurrentImage(false)
                    }
                  }}
                  disabled={isUpdating}
                  className="flex-1 py-3 rounded-full border border-gray-600 bg-[#1A1A2E] text-white font-exo2 font-semibold text-sm hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePost}
                  disabled={isUpdating || (!updateText.trim() && !post.image && !newImagePreview && !removeCurrentImage)}
                  className="flex-1 py-3 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUpdating && (
                    <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="p-6 sm:p-8">
              <h2 className="text-white text-2xl sm:text-3xl font-exo2 font-bold mb-2 text-center">
                Delete Post
              </h2>
              
              <p className="text-white/90 text-sm text-center sm:text-base font-exo2 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full border border-gray-600 bg-[#1A1A2E] text-white font-exo2 font-semibold text-sm hover:bg-white/5 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-exo2 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting && (
                    <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}