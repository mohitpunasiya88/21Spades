'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle2, RefreshCcwIcon, X } from 'lucide-react'
import { useFeedStore } from '@/lib/store/authStore'

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
  }
}

export default function FeedPost({ post }: FeedPostProps) {
  const { likePost, sharePost, savePost, commentPost, getComments, repostPost } = useFeedStore()
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
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [localComments, setLocalComments] = useState(post.comments)
  const [loadingComments, setLoadingComments] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isReposting, setIsReposting] = useState(false)
  
  const handleLike = async () => {
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

  const handleRepost = async () => {
    // Prevent if already reposted or currently reposting
    if (reposted || isReposting) return
    
    setIsReposting(true)
    try {
      await repostPost(post.id)
      setReposted(true)
      // Update repost count from API response
      const updatedPost = useFeedStore.getState().posts.find(p => p._id === post.id)
      if (updatedPost) {
        setLocalReposts(updatedPost.repostsCount || 0)
        setReposted(updatedPost.isReposted || true)
      } else {
        setLocalReposts(localReposts + 1)
      }
    } catch (error) {
      console.error('Error reposting:', error)
      // Don't set reposted on error
    } finally {
      setIsReposting(false)
    }
  }

  const handleShare = async () => {
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
    setShowComments(true)
    // Load comments when modal opens
    setLoadingComments(true)
    try {
      const result = await getComments(post.id)
      setComments(result.comments)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
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
      
      // Refresh comments if modal is open
      if (showComments) {
        setLoadingComments(true)
        try {
          const result = await getComments(post.id)
          setComments(result.comments)
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
  return (
    <div className="rounded-xl sm:rounded-2xl border border-[#FFFFFF33] bg-[#090721] p-4 sm:p-6 md:p-8 font-exo2">
      {/* Top Header */}
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

      {/* Text */}
      {post.content && <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed break-words">{post.content}</p>}

      {/* Media */}
      {post.image && (
        <div className="overflow-hidden rounded-lg sm:rounded-xl w-full mb-3 sm:mb-4">
          <img src={post.image} alt="Post Image" className="w-full h-auto object-cover" />
      </div>
      )}
      <div className="border-b-2 border-[#FFFFFF33] mb-2 sm:mb-3 p-1 sm:p-2" ></div>
      {/* Actions */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-2 md:gap-3 text-gray-400 flex-wrap">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 ${liked ? 'text-[#FF5500]' : ''
            }`}
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={liked ? '#FF5500' : 'none'} />
          <span className="text-xs sm:text-sm">{localLikes >= 1000 ? (localLikes / 1000).toFixed(1) + 'k' : localLikes}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[16px] sm:h-[19px] bg-[#6B757E4D] hidden sm:block" />
        {/* <div className='border-s-4'></div> */}
        <button 
          onClick={handleCommentClick}
          className="flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 hover:text-blue-400"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localComments}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[16px] sm:h-[19px] bg-[#6B757E4D] hidden sm:block" />
        <button 
          onClick={handleRepost}
          disabled={reposted || isReposting}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed ${reposted ? 'text-green-400' : 'hover:text-green-400'}`}
        >
          <RefreshCcwIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localReposts}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[16px] sm:h-[19px] bg-[#6B757E4D] hidden sm:block" />
        <button 
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed hover:text-green-400"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">{localShares}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[16px] sm:h-[19px] bg-[#6B757E4D] hidden sm:block" />
        <button 
          onClick={handleSave}
          className={`flex items-center gap-1 sm:gap-2 bg-[#FFFFFF0D] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 ${saved ? 'text-yellow-400' : 'hover:text-yellow-400'}`}
        >
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" fill={saved ? 'currentColor' : 'none'} />
          <span className="text-xs sm:text-sm">{localSaves}</span>
        </button>
      </div>

      {/* Comment Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#090721] rounded-xl sm:rounded-2xl border border-[#FFFFFF33] w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#FFFFFF33]">
              <h2 className="text-white text-lg sm:text-xl font-semibold">Comments</h2>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Comment Form */}
            <div className="p-4 sm:p-6 border-b border-[#FFFFFF33]">
              <form onSubmit={handleSubmitComment} className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-[#FFFFFF08] border border-[#FFFFFF33] rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {loadingComments ? (
                <div className="text-center text-gray-400 py-4 text-sm sm:text-base">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="text-center text-gray-400 py-4 text-sm sm:text-base">No comments yet. Be the first to comment!</div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        {comment.author?.profilePicture ? (
                          <img 
                            src={comment.author.profilePicture} 
                            alt={comment.author.username} 
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" 
                          />
                        ) : (
                          <span className="text-white text-[10px] sm:text-xs font-semibold">
                            {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {comment.author?.username || 'Unknown'}
                          </span>
                          <span className="text-gray-500 text-[10px] sm:text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm break-words">{comment.text}</p>
                        <div className="flex items-center gap-3 sm:gap-4 mt-1.5 sm:mt-2">
                          <button className="text-gray-500 hover:text-purple-400 text-[10px] sm:text-xs">
                            Like ({comment.likesCount || 0})
                          </button>
                          {comment.repliesCount > 0 && (
                            <span className="text-gray-500 text-[10px] sm:text-xs">
                              {comment.repliesCount} replies
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

