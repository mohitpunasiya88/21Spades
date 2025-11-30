'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FeedPost from '@/components/Dashboard/FeedPost'
import { Image as ImageIcon, Laugh, LayoutGrid, ChevronDown, X, SidebarIcon } from 'lucide-react'
import FeedRightSidebar from '@/components/Layout/FeedRightSidebar'
import { Badge, Drawer, Select } from 'antd'
import { useCategoriesStore, useFeedStore, useAuthStore, type Post } from '@/lib/store/authStore'
import EmojiPicker from 'emoji-picker-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useMessage } from '@/lib/hooks/useMessage'
import LoginRequiredModal from '@/components/Common/LoginRequiredModal'
import Tooltip from '@/components/Common/Tooltip'
import "@/components/Dashboard/style.css"
import { Ddrop } from '@/components/Ddrop'

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
  return `${Math.floor(diffInSeconds / 604800)}w`
}

// Transform API Post to FeedPost props
function normalizePrice(value: unknown) {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

function transformPost(post: Post) {
  // Check if this is a repost (has originalPost)
  const isRepost = !!post.originalPost
  const originalPost = post.originalPost
  
  // Normalize media arrays for original and regular posts
  const originalPostImages =
    (originalPost as any)?.postUrls && Array.isArray((originalPost as any).postUrls) && (originalPost as any).postUrls.length > 0
      ? (originalPost as any).postUrls as string[]
      : originalPost?.postUrl
      ? [originalPost.postUrl]
      : []

  const postImages =
    (post as any)?.postUrls && Array.isArray((post as any).postUrls) && (post as any).postUrls.length > 0
      ? (post as any).postUrls as string[]
      : post.postUrl
      ? [post.postUrl]
      : []
  
  // For reposts, the repost author is the post author (not original post author)
  const repostAuthor = post.author || {
    _id: 'unknown',
    name: 'Unknown User',
    username: 'unknown',
    profilePicture: undefined
  }

  // For reposts, prepare original post data
  // Note: We need to get the original post's createdAt from the API response
  // For now, we'll use a placeholder - the API should include this in originalPost
  const originalPostData = isRepost && originalPost ? {
    id: originalPost._id,
    username: originalPost.author?.username || originalPost.author?.name || 'Unknown User',
    verified: true,
    timeAgo: formatTimeAgo((originalPost as any).createdAt || post.createdAt || new Date().toISOString()),
    walletAddress: originalPost.author?._id ? originalPost.author._id.slice(-8) : 'unknown',
    profilePicture: originalPost.author?.profilePicture,
    content: originalPost.text || '',
    image: originalPostImages[0] || '/post/post.png',
    images: originalPostImages,
    likes: originalPost.likesCount || 0,
    comments: originalPost.commentsCount || 0,
    shares: originalPost.sharesCount || 0,
    reposts: originalPost.repostsCount || 0,
    saves: originalPost.savesCount || 0,
    price: normalizePrice(originalPost.nft?.price),
    currency: originalPost.nft?.currency || 'AVAX',
  } : undefined

  // For regular posts, use post data directly
  const displayPost = isRepost ? {
    text: '', // Repost caption is in post.text
    postUrl: '',
    images: originalPostImages,
    likesCount: originalPost?.likesCount || 0,
    commentsCount: originalPost?.commentsCount || 0,
    sharesCount: originalPost?.sharesCount || 0,
    savesCount: originalPost?.savesCount || 0,
    repostsCount: post.repostsCount || 0,
  } : {
    text: post.text || '',
    postUrl: post.postUrl || '',
    images: postImages,
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    sharesCount: post.sharesCount || 0,
    savesCount: post.savesCount || 0,
    repostsCount: post.repostsCount || 0,
  }

  return {
    id: post._id, // Keep repost post ID for tracking
    originalPostId: isRepost && originalPost ? originalPost._id : undefined, // Store original post ID for likes
    authorId: repostAuthor._id, // Add author ID for ownership check
    username: repostAuthor.username || repostAuthor.name || 'Unknown User',
    verified: true, // You can add verified field to user model later
    timeAgo: formatTimeAgo(post.createdAt || new Date().toISOString()),
    walletAddress: repostAuthor._id ? repostAuthor._id.slice(-8) : 'unknown',
    profilePicture: repostAuthor.profilePicture,
    content: displayPost.text,
    image: displayPost.postUrl || (displayPost.images && displayPost.images[0]) || '',
    images: displayPost.images,
    likes: displayPost.likesCount,
    comments: displayPost.commentsCount,
    shares: displayPost.sharesCount,
    reposts: displayPost.repostsCount,
    saves: displayPost.savesCount,
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
    isReposted: post.isReposted || false,
    // NFT price data - extract from post.nft.price
    price: normalizePrice(isRepost ? originalPost?.nft?.price : post.nft?.price),
    currency: isRepost ? (originalPost?.nft?.currency || 'AVAX') : (post.nft?.currency || 'AVAX'),
    nft: isRepost ? (originalPost?.nft || undefined) : (post.nft || undefined),
    // Repost specific data
    repostCaption: isRepost ? (post.text || '') : undefined,
    originalPost: originalPostData,
  }
}


const POSTS_PER_PAGE = 10

export default function FeedPage() {
  const { posts, isLoading, isLoadingMore, hasMore, getPosts, createPost, prependPost } = useFeedStore()
  const { categories, getCategories } = useCategoriesStore()
  const { user } = useAuthStore()
  const { message } = useMessage()
  const isAuthenticated = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All') // For filtering posts
  const [postCategory, setPostCategory] = useState<string | undefined>(undefined) // For post creation
  const [isFilterCategoriesOpen, setIsFilterCategoriesOpen] = useState(false) // For filtering
  const filterCategoriesRef = useRef<HTMLDivElement>(null)
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    // 5-12: Good Morning
    if (hour >= 5 && hour < 12) {
      return { label: 'Good Morning', icon: '☀️' }
    }
    // 12-17: Good Afternoon
    if (hour >= 12 && hour < 17) {
      return { label: 'Good Afternoon', icon: '🌤️' }
    }
    // 17-21: Good Evening
    if (hour >= 17 && hour < 21) {
      return { label: 'Good Evening', icon: '🌆' }
    }
    // 21-5: Good Night (21 to 23 and 0 to 4)
    return { label: 'Good Night', icon: '🌙' }
  }, [])

  // Mobile right sidebar state
  const [isMobileRightSidebarOpen, setIsMobileRightSidebarOpen] = useState(false)
  const [page, setPage] = useState(1)
  
  // Post creation state
  const [postText, setPostText] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [postProgress, setPostProgress] = useState(0)
  const [postStatus, setPostStatus] = useState<'posting' | 'finished' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const postsSectionRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Prepare categories list with "All" option at the beginning
  const categoriesList = useMemo(() => {
    const allCategories = categories.filter(cat => cat.isActive).map(cat => cat.name)
    return ['All', ...allCategories]
  }, [categories])

  // Categories list for post creation (without 'All' option)
  const postCategoriesList = useMemo(() => {
    return categories.filter(cat => cat.isActive).map(cat => cat.name)
  }, [categories])

  // Countdown (dummy target ~ 3 days later)
  const target = useMemo(() => Date.now() + 3 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000 + 38 * 60 * 1000, [])
  const [remaining, setRemaining] = useState(target - Date.now())
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])
  const dd = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hh = Math.floor((remaining / (60 * 60 * 1000)) % 24)
  const mm = Math.floor((remaining / (60 * 1000)) % 60)

  const activeCategoryId = useMemo(() => {
    return selectedCategory === 'All'
      ? undefined
      : categories.find(cat => cat.name === selectedCategory)?._id
  }, [selectedCategory, categories])

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
  }, [getCategories])

  // Fetch posts when category changes
  useEffect(() => {
    setPage(1)
    getPosts({ 
      categoryId: activeCategoryId,
      page: 1,
      limit: POSTS_PER_PAGE,
      forceRefresh: true
    })
  }, [activeCategoryId, getPosts])

  const loadMorePosts = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    getPosts({
      categoryId: activeCategoryId,
      page: nextPage,
      limit: POSTS_PER_PAGE,
      append: true
    })
  }, [activeCategoryId, getPosts, hasMore, isLoading, isLoadingMore, page])

  useEffect(() => {
    const currentRef = loadMoreRef.current
    if (!currentRef) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts()
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    )
    observer.observe(currentRef)
    return () => {
      observer.unobserve(currentRef)
    }
  }, [loadMorePosts, posts.length, hasMore])

  // Close filter categories dropdown and emoji picker on outside click
  useEffect(() => {
    if (!isFilterCategoriesOpen && !isEmojiPickerOpen) return

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Close filter categories dropdown
      if (isFilterCategoriesOpen && filterCategoriesRef.current && !filterCategoriesRef.current.contains(target)) {
        setIsFilterCategoriesOpen(false)
      }
      
      // Close emoji picker - check if click is outside the emoji picker container
      if (isEmojiPickerOpen && emojiPickerRef.current) {
        const isClickInsidePicker = emojiPickerRef.current.contains(target)
        // Check if click is on the emoji button (to allow toggle)
        const emojiButton = emojiPickerRef.current.querySelector('button')
        const isClickOnButton = emojiButton && emojiButton.contains(target)
        
        // Close if click is outside the picker container, but allow button clicks to toggle
        if (!isClickInsidePicker || (isClickOnButton && isEmojiPickerOpen)) {
          // Don't close if clicking the button (let the onClick handler toggle it)
          if (!isClickOnButton) {
            setIsEmojiPickerOpen(false)
          }
        }
      }
    }
    
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isFilterCategoriesOpen, isEmojiPickerOpen])

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      setSelectedImages(prev => [...prev, ...newFiles])
      
      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            setImagePreviews(prev => [...prev, reader.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
    // Reset input to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    if (textInputRef.current) {
      const input = textInputRef.current
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const newText = postText.substring(0, start) + emoji + postText.substring(end)
      setPostText(newText)
      // Set cursor position after emoji
      setTimeout(() => {
        input.focus()
        input.setSelectionRange(start + emoji.length, start + emoji.length)
      }, 0)
    } else {
      setPostText(prev => prev + emoji)
    }
  }

  // Handle post submission
  const handlePostSubmit = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    // Validate: must have text or image
    if (!postText.trim() && imagePreviews.length === 0) {
      message.error('Please add text or an image to post')
      return
    }

    // Validate: must select a category
    if (!postCategory) {
      message.warning('Please select a category before posting')
      return
    }

    setIsPosting(true)
    setPostStatus('posting')
    setPostProgress(0)

    // Simulate smooth progress
    const progressInterval = setInterval(() => {
      setPostProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval)
          return 85
        }
        // Smooth increment: start fast, slow down as we approach 85%
        const increment = (85 - prev) * 0.15 + Math.random() * 3
        return Math.min(85, prev + increment)
      })
    }, 150)

    try {
      // Get category ID if a category is selected for post creation
      const categoryId = postCategory 
        ? categories.find(cat => cat.name === postCategory)?._id
        : undefined

      const createdPost = await createPost({
        text: postText.trim() || undefined,
        // Backend now supports multiple media URLs via postUrls
        // We send all selected images; backend can decide how to store them
        postUrls: imagePreviews.length > 0 ? imagePreviews : undefined,
        categoryId: categoryId,
      })
      
      if (createdPost) {
        const createdCategoryName = createdPost.category?.name
        if (
          selectedCategory === 'All' ||
          !createdCategoryName ||
          createdCategoryName === selectedCategory ||
          createdPost.category?._id === activeCategoryId
        ) {
          prependPost(createdPost)
        }
      }

      // Complete progress
      clearInterval(progressInterval)
      setPostProgress(100)
      setPostStatus('finished')

      // Reset form after successful post
      setPostText('')
      setSelectedImages([])
      setImagePreviews([])
      setPostCategory(undefined)
      
      // Scroll to posts section after posts are updated
      setTimeout(() => {
        if (postsSectionRef.current) {
          postsSectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 300)

      // Hide progress indicator after 2 seconds
      setTimeout(() => {
        setPostStatus(null)
        setPostProgress(0)
      }, 2000)
    } catch (error: any) {
      clearInterval(progressInterval)
      console.error('Error creating post:', error)
      setPostStatus(null)
      setPostProgress(0)
      alert(error?.response?.data?.message || error?.message || 'Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 relative mt-10 md:mt-0 lg:mt-0 xl:mt-0">
      {/* Mobile Floating Button for Right Sidebar */}
      <button
        onClick={() => setIsMobileRightSidebarOpen(true)}
        className="lg:hidden z-20 fixed top-16 sm:top-20 md:top-24 right-6 text-white position-fixed p-2 rounded-full transition-all duration-300  border-1 border-[#FFFFFF36] fixed"
        style={{
                 background: 'radial-gradient(155.24% 166.13% at 50% 100%, #4E00E5 0%, #020019 100%)'

                }}
        aria-label="Open sidebar"
      >
        {/* <SidebarIcon className="w-6 h-6" /> */}
        Side Bar
      </button>

      {/* Mobile Right Sidebar Drawer */}
      <Drawer
        title=""
        placement="right"
        onClose={() => setIsMobileRightSidebarOpen(false)}
        open={isMobileRightSidebarOpen}
        width={320}
        styles={{
          header: {
            display: 'none',
          },
          body: {
            background: '#020019',
            padding: 0,
          },
          footer: {
            display: 'none',
          },
          
          
        }}
      >
        <FeedRightSidebar />
      </Drawer>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 md:gap-6 font-audiowide">
        {/* Left column */}
        <div className="p-2 sm:p-3 md:p-4">
          <h1 className="text-white text-xl sm:text-2xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl" aria-hidden="true">
              {greeting.icon}
            </span>
            <span>
              {isAuthenticated && user
                ? `${greeting.label}, ${user.name || user.username || ''}`.trim()
                : greeting.label} 👋🏼
            </span>
          </h1>

          {/* Input bar (pixel matched) */}
          <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
            <div className="relative flex-shrink-0">
              <div
                className="flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden p-1.5 sm:p-2"
                style={{
                  background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)'
                }}
              >
                {/* Avatar */}
                <img src="/post/card-21.png" alt="Avatar" className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] object-contain" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 bg-[#FFFFFF08] rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 w-full">
                <input
                  ref={textInputRef}
                  type="text"
                  placeholder="What's New?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="bg-transparent border-none outline-none text-white placeholder-[#FFFFFF4D] flex-1 text-sm font-exo2 w-full"
                />
              </div>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-1 transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Helper row */}
              <div className="p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-[11px] sm:text-[13px]">
                <div className="flex items-center flex-wrap gap-2 sm:gap-4 md:gap-6">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-[#FFFFFF4D] hidden xs:inline">Images</span>
                    <span className="text-[#FFFFFF4D] xs:hidden">Photos</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  {/* dot in center */}
                  <div className="w-1 h-1 rounded-full bg-[#FFFFFF4D]" />
                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Laugh className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-[#FFFFFF4D]">Emoji</span>
                    </button>
                    
                    {/* Emoji Picker Component */}
                    {isEmojiPickerOpen && (
                      <div className="absolute top-full left-0 mt-2 z-50">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            handleEmojiSelect(emojiData.emoji)
                            setIsEmojiPickerOpen(false)
                          }}
                          width={360}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#FFFFFF4D]" />
                  {/* Categories Dropdown */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                    <Select
                      value={postCategory}
                      onChange={(value) => setPostCategory(value)}
                      placeholder="Categories"
                      className="categories-select"
                      suffixIcon={<ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />}
                      style={{
                        minWidth: '100px',
                      }}
                      classNames={{
                        popup: {
                          root: "categories-select-dropdown",
                        },
                      }}
                      optionLabelProp="label"
                      optionRender={(option) => (
                        <div className="flex items-center justify-between w-full">
                          <span>{option.data.value}</span>
                          {option.data.value === postCategory && (
                            <span className="text-green-400 text-sm font-bold ml-2">✓</span>
                          )}
                        </div>
                      )}
                      options={postCategoriesList.map((cat) => ({
                        label: cat, // Simple label for trigger display (no checkmark)
                        value: cat,
                      }))}
                    />
                  </div>
                </div>
                {(() => {
                  const isDisabled = isPosting || (!postText.trim() && imagePreviews.length === 0) || !postCategory
                  let tooltipMessage = ''
                  
                  if (isDisabled && !isPosting) {
                    if (!postCategory) {
                      tooltipMessage = 'Please select a category'
                    } else if (!postText.trim() && imagePreviews.length === 0) {
                      tooltipMessage = 'Please add text or an image to post'
                    }
                  }
                  
                  return (
                    <Tooltip message={tooltipMessage} disabled={!tooltipMessage || isPosting}> 
                      <button 
                        onClick={handlePostSubmit} 
                        disabled={isDisabled} 
                        className="bg-white text-black text-[16px] sm:text-base md:text-[18px] font-[600] px-8 sm:px-8 py-1 rounded-full shadow font-exo2 whitespace-nowrap w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                      > 
                        {isPosting ? 'Posting...' : 'Post'} 
                      </button> 
                    </Tooltip> 
                  ) 
                })()} 
              </div> 
              
              {/* Progress Indicator */} 
              {postStatus && ( 
                <div className="mt-3 space-y-2"> 
                  <div className="flex items-center justify-between text-xs sm:text-sm"> 
                    <span className="text-white font-exo2 font-medium"> 
                      {postStatus === 'posting' ? 'Posting...' : 'Finished'} 
                    </span> 
                    <span className="text-gray-400 font-exo2"> 
                      {Math.round(postProgress)}% 
                    </span> 
                  </div> 
                  <div className="w-full h-1.5 bg-[#FFFFFF10] rounded-full overflow-hidden"> 
                    <div 
                      className="h-full bg-gradient-to-r from-[#4F01E6] to-[#7E6BEF] transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, postProgress))}%` }}
                    /> 
                  </div> 
                </div> 
              )} 
            </div> 
          </div> 

          <div className="border-b-1 border-[#FFFFFF33] mb-4" ></div> 
          <Ddrop /> 
          
          {/* Explore Feed Section */} 
          <div ref={postsSectionRef} className="mb-4 sm:mb-6"> 
            <div className="mb-2 sm:mb-3"> 
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 font-audiowide" style={{
                textShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
                letterSpacing: '0.5px' 
              }}> 
                Explore Feed 
              </h2> 
              <p className="text-gray-300 text-sm sm:text-base font-exo2 leading-relaxed">Explore Feed, the premier Web3 marketplace for securely buying, selling, and trading digital assets.</p>
            </div> 

            {/* Category Filter Tabs */} 
            <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 justify-center"> 
              {categoriesList.map((cat) => ( 
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-colors border-b-2 text-sm sm:text-base flex-shrink-0 ${selectedCategory === cat
                      ? 'text-purple-400 border-purple-500' 
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                    }`} 
                > 
                  {cat} 
                </button> 
              ))} 
            </div> 

            {/* Feed Posts */}
            <div className="space-y-4"> 
              {isLoading ? (
                <div className="text-center text-gray-400 py-8">Loading posts...</div> 
              ) : posts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No posts found</div>
              ) : (
                posts
                  .filter((post) => post && post._id) // Filter out invalid posts
                  .map((post) => (
                    <FeedPost key={post._id} post={transformPost(post)} />
                  ))
              )}
              <div ref={loadMoreRef} className="h-1" />
              {isLoadingMore && (
                <div className="text-center text-gray-400 py-4 text-sm">Loading more posts...</div>
              )}
              {!hasMore && posts.length > 0 && (
                <div className="text-center text-gray-500 py-4 text-xs uppercase tracking-wide">
                  You&apos;re all caught up
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        {/* in phone it will be show small button on top right on click it will open sidebar */}
        <div className="hidden lg:block lg:w-[360px]">
          <FeedRightSidebar />
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="You are not logged in. Please login to continue."
      />
    </div>
  )
}

