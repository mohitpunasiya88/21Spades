"use client"

import { useEffect, useRef, useCallback } from 'react'
import { List, Avatar, Button, Spin, Empty } from 'antd'
import { useNotificationStore } from '@/lib/store/notificationStore'

interface NotificationDropdownProps {
  open: boolean
  onClose?: () => void
}

export default function NotificationDropdown({ open, onClose }: NotificationDropdownProps) {
  const {
    items,
    loading,
    hasMore,
    fetchInitial,
    fetchMore,
    markAllAsRead,
  } = useNotificationStore()

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && (!Array.isArray(items) || items.length === 0)) {
      fetchInitial(5)
    }
  }, [open])

  // Mark all notifications as read when dropdown opens
  useEffect(() => {
    if (open) {
      markAllAsRead()
    }
  }, [open, markAllAsRead])

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = container
    // Load more when user is within 50px of bottom
    if (scrollHeight - scrollTop - clientHeight < 50) {
      fetchMore()
    }
  }, [loading, hasMore, fetchMore])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const s = Math.floor(diff / 1000)
    if (s < 60) return `${s}s`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}d`
    const w = Math.floor(d / 7)
    if (w < 4) return `${w}w`
    const mo = Math.floor(d / 30)
    if (mo < 12) return `${mo}mo`
    const y = Math.floor(d / 365)
    return `${y}y`
  }

  const renderItem = (n: any) => {
    const actor = n?.actor || {}
    const name = actor?.username || actor?.name || 'User'
    const avatar = actor?.profilePicture || actor?.avatar || '/assets/avatar.jpg'
    let msg 
    if (n?.type === 'post_like' || n?.type === 'like') {
      msg = 'liked your post'
      if (n?.post?.text) msg += `: ${n.post.text}`
    } else if (n?.type === 'post_comment' || n?.type === 'comment') {
      const ctext = n?.comment?.text || n?.comment?.content
      msg = `commented${ctext ? `: ${ctext}` : ''}`
    } else {
      msg = 'performed an action'
    }
    const title = (
      <span className='!text-white'>
        <span className='!text-white' style={{ fontWeight: 600 }}>{name}</span> {msg}
      </span>
    )
    return (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={avatar} />}
          title={title}
          description={<span style={{ color: '#f5f8f8ff' }}>{timeAgo(n?.createdAt)}</span>}
        />
        {n?.isRead === false && <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#8B5CF6', display: 'inline-block' }} />}
      </List.Item>
    )
  }

  return (
    <div style={{ minWidth: 360, maxWidth: 420 }}>
      <div className="px-5 py-3 flex items-center justify-between text-white font-exo2 text-sm border-b bg-[#090721]">
       <div>Notifications</div>
          {onClose && (
          <Button size="small" type="default" onClick={onClose} className="!border-white/30 !text-white hover:!border-white/50 !bg-[#090721]">
            Close
          </Button>
        )}
        </div>
      <div 
        ref={scrollContainerRef}
        style={{ maxHeight: 320, overflow: 'auto' }} 
        className="scrollbar-hide bg-[#090721]"
      >
        {loading && (!Array.isArray(items) || items.length === 0) && (
          <div className="px-5 py-6 flex items-center gap-2 text-white "><Spin size="small" /> <span className="font-exo2 text-sm">Loading...</span></div>
        )}
        {!loading && (!Array.isArray(items) || items.length === 0) && (
          <div className="px-5 py-6"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-gray-300 text-sm">No notifications</span>} /></div>
        )}
        {Array.isArray(items) && items.length > 0 && (
          <>
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={renderItem}
              className="!px-2 !text-white"
            />
            {loading && items.length > 0 && (
              <div className="px-5 py-3 flex items-center justify-center gap-2 text-white">
                <Spin size="small" /> 
                <span className="font-exo2 text-sm">Loading more...</span>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <div className="px-5 py-3 text-center text-gray-400 text-xs font-exo2">
                No more notifications
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
