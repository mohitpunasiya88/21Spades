'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import FeedPost from '@/components/Dashboard/FeedPost'
import { Image as ImageIcon, Laugh, LayoutGrid, ChevronDown, X, SidebarIcon } from 'lucide-react'
import FeedRightSidebar from '@/components/Layout/FeedRightSidebar'
import { Badge, Drawer } from 'antd'
import { useCategoriesStore, useFeedStore, type Post } from '@/lib/store/authStore'
import EmojiPicker from 'emoji-picker-react'

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
function transformPost(post: Post) {
  // Check if this is a repost (has originalPost)
  const isRepost = !!post.originalPost
  const originalPost = post.originalPost
  
  // For reposts, use original post data for display, but keep repost post ID for interactions
  const displayPost = isRepost && originalPost ? {
    text: originalPost.text || post.text || '',
    postUrl: originalPost.postUrl || post.postUrl || '',
    likesCount: originalPost.likesCount || post.likesCount || 0,
    commentsCount: originalPost.commentsCount || post.commentsCount || 0,
    sharesCount: originalPost.sharesCount || post.sharesCount || 0,
    savesCount: originalPost.savesCount || post.savesCount || 0,
    repostsCount: post.repostsCount || 0,
  } : {
    text: post.text || '',
    postUrl: post.postUrl || '',
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    sharesCount: post.sharesCount || 0,
    savesCount: post.savesCount || 0,
    repostsCount: post.repostsCount || 0,
  }

  // For reposts, use original post author, otherwise use repost author
  const author = (isRepost && originalPost?.author) 
    ? originalPost.author 
    : (post.author || {
        _id: 'unknown',
        name: 'Unknown User',
        username: 'unknown',
        profilePicture: undefined
      })

  return {
    id: post._id, // Keep repost post ID for tracking
    originalPostId: isRepost && originalPost ? originalPost._id : undefined, // Store original post ID for likes
    username: author.username || author.name || 'Unknown User',
    verified: true, // You can add verified field to user model later
    timeAgo: formatTimeAgo(post.createdAt || new Date().toISOString()),
    walletAddress: author._id ? author._id.slice(-8) : 'unknown',
    profilePicture: author.profilePicture,
    content: displayPost.text,
    image: displayPost.postUrl || '/post/post.png',
    likes: displayPost.likesCount,
    comments: displayPost.commentsCount,
    shares: displayPost.sharesCount,
    reposts: displayPost.repostsCount,
    saves: displayPost.savesCount,
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
    isReposted: post.isReposted || false,
  }
}


export default function FeedPage() {
  const { posts, isLoading, getPosts, createPost } = useFeedStore()
  const { categories, getCategories } = useCategoriesStore()
  const [selectedCategory, setSelectedCategory] = useState('All') // For filtering posts
  const [postCategory, setPostCategory] = useState('All') // For post creation
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false) // For post creation
  const [isFilterCategoriesOpen, setIsFilterCategoriesOpen] = useState(false) // For filtering
  const categoriesRef = useRef<HTMLDivElement>(null)
  const filterCategoriesRef = useRef<HTMLDivElement>(null)
  
  // Mobile right sidebar state
  const [isMobileRightSidebarOpen, setIsMobileRightSidebarOpen] = useState(false)
  
  // Post creation state
  const [postText, setPostText] = useState('')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  // Prepare categories list with "All" option at the beginning
  const categoriesList = useMemo(() => {
    const allCategories = categories.filter(cat => cat.isActive).map(cat => cat.name)
    return ['All', ...allCategories]
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

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
  }, [getCategories])

  // Fetch posts when category changes
  useEffect(() => {
    const categoryId = selectedCategory === 'All' 
      ? undefined 
      : categories.find(cat => cat.name === selectedCategory)?._id
    
    getPosts({ 
      categoryId,
      page: 1,
      limit: 20
    })
  }, [selectedCategory, categories, getPosts])

  // Close categories dropdown and emoji picker on outside click
  useEffect(() => {
    if (!isCategoriesOpen && !isFilterCategoriesOpen && !isEmojiPickerOpen) return

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Close post creation categories dropdown
      if (isCategoriesOpen && categoriesRef.current && !categoriesRef.current.contains(target)) {
        setIsCategoriesOpen(false)
      }
      
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
  }, [isCategoriesOpen, isFilterCategoriesOpen, isEmojiPickerOpen])

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
    // Validate: must have text or image
    if (!postText.trim() && imagePreviews.length === 0) {
      alert('Please add text or an image to post')
      return
    }

    setIsPosting(true)
    try {
      // Get category ID if a category is selected for post creation
      const categoryId = postCategory === 'All' 
        ? undefined 
        : categories.find(cat => cat.name === postCategory)?._id

      // Use first image preview URL if available (for now using data URL)
      // In production, you'd upload to S3 first and get the URL
      const postUrl = imagePreviews.length > 0 ? imagePreviews[0] : undefined

      await createPost({
        text: postText.trim() || undefined,
        postUrl: postUrl,
        categoryId: categoryId,
      })

      // Reset form after successful post
      setPostText('')
      setSelectedImages([])
      setImagePreviews([])
      setPostCategory('All')
      
      // Refresh posts to show the new post
      await getPosts({ 
        categoryId: categoryId,
        page: 1,
        limit: 20
      })
    } catch (error: any) {
      console.error('Error creating post:', error)
      alert(error?.response?.data?.message || error?.message || 'Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 relative">
      {/* Mobile Floating Button for Right Sidebar */}
      <button
        onClick={() => setIsMobileRightSidebarOpen(true)}
        className="lg:hidden fixed top-20 right-6 text-white position-fixed p-2 rounded-full  transition-all duration-300  border-2 border-purple-400/30 fixed"
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
            background: '#020019',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            display: 'none',
            top: '64px',
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 md:gap-6 font-exo2">
        {/* Left column */}
        <div className="p-2 sm:p-3 md:p-4">
          <h1 className="text-white text-xl sm:text-2xl font-semibold font-exo2 mb-3 md:mb-4">Hello Spades !</h1>

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
                    <span className="text-[#FFFFFF4D] hidden xs:inline">Image/Videos</span>
                    <span className="text-[#FFFFFF4D] xs:hidden">Photos/Videos</span>
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
                  <div className="relative" ref={categoriesRef}>
                    <button
                      onClick={() => setIsCategoriesOpen((v) => !v)}
                      className="flex items-center gap-1.5 sm:gap-2 text-orange-400 px-2 sm:px-3 py-1 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ backdropFilter: 'blur(4px)' }}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {postCategory === 'All' ? <span className="text-[#FFFFFFCC] text-xs sm:text-sm">Categories</span> : <span className="text-[#FFFFFFCC] text-xs sm:text-sm"> {postCategory} </span>}
                      <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 ml-0.5 sm:ml-1 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCategoriesOpen && (
                      <div
                        className="absolute left-0 mt-2 rounded-xl overflow-hidden z-50"
                        style={{
                          background: 'rgba(17, 24, 39, 0.98)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                          minWidth: '200px',
                        }}
                      >
                        {categoriesList.map((cat, index) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setPostCategory(cat)
                              setIsCategoriesOpen(false)
                            }}
                            className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center justify-between group"
                            style={{
                              borderBottom: index < categoriesList.length - 1 ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
                            }}
                          >
                            <span className="group-hover:text-purple-300 transition-colors">{cat}</span>
                            {cat === postCategory && (
                              <span className="text-green-400 text-sm font-bold">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handlePostSubmit}
                  disabled={isPosting || (!postText.trim() && imagePreviews.length === 0)}
                  className="bg-white text-[#020019] text-sm sm:text-base md:text-[18px] font-[600] px-3 sm:px-4 py-1 rounded-full shadow font-exo2 whitespace-nowrap w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-b-1 border-[#FFFFFF33] mb-4" ></div>

         
          {/* Explore Feed Section */}
          <div className="mb-4 sm:mb-6">
            <div className="mb-2 sm:mb-3">
              <h2 className="text-white text-lg sm:text-xl font-bold mb-1">Explore Feed</h2>
              <p className="text-gray-400 text-sm sm:text-base">Explore Feed, the premier Web3 marketplace for securely buying, selling, and trading digital assets.</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
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
            </div>
          </div>
        </div>

        {/* Right column */}
        {/* in phone it will be show small button on top right on click it will open sidebar */}
        <div className="hidden lg:block lg:w-[360px]">
          <FeedRightSidebar />
        </div>
      </div>
    </div>
  )
}

