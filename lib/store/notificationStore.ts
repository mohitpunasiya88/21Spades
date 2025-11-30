"use client"

import { create } from 'zustand'
import { apiCaller } from '@/app/interceptors/apicall/apicall'

export type NotificationType =
    | 'post_like'
    | 'post_comment'
    | 'like'
    | 'comment'
    | string

export interface NotificationItem {
    _id: string
    user?: string
    type?: NotificationType
    actor?: {
        _id?: string
        name?: string
        username?: string
        profilePicture?: string
        avatar?: string
    } | null
    post?: {
        _id?: string
        text?: string
    } | null
    comment?: {
        _id?: string
        text?: string
        content?: string
    } | null
    isRead?: boolean
    readAt?: string | null
    createdAt?: string
    updatedAt?: string
    [key: string]: any
}

interface NotificationState {
    items: NotificationItem[]
    unreadCount: number
    page: number
    limit: number
    hasMore: boolean
    loading: boolean
    error?: string | null

    // actions
    fetchInitial: (limit?: number) => Promise<void>
    fetchMore: () => Promise<void>
    refresh: () => Promise<void>
    reset: () => void
    markAllAsRead: () => Promise<void>
}

// Helpers to extract items and metadata regardless of envelope
const extractItems = (payload: any): NotificationItem[] => {
    // direct arrays
    if (Array.isArray(payload)) return payload as NotificationItem[]

    // common envelopes
    const d = payload?.data
    if (Array.isArray(payload?.notifications)) return payload.notifications as NotificationItem[]
    if (Array.isArray(d?.notifications)) return d.notifications as NotificationItem[]
    if (Array.isArray(payload?.items)) return payload.items as NotificationItem[]
    if (Array.isArray(d?.items)) return d.items as NotificationItem[]
    if (Array.isArray(payload?.result)) return payload.result as NotificationItem[]

    // paginated structures
    if (Array.isArray(d?.docs)) return d.docs as NotificationItem[]
    if (Array.isArray(d?.results)) return d.results as NotificationItem[]
    if (Array.isArray(d?.rows)) return d.rows as NotificationItem[]
    return []
}

const extractMeta = (payload: any) => {
    const d = payload?.data ?? {}
    const unread = d?.unreadCount ?? payload?.unreadCount ?? payload?.count ?? payload?.totalUnread
    const total = d?.pagination?.total ?? d?.total ?? payload?.total ?? payload?.items?.total
    const page = d?.pagination?.page ?? d?.page
    const limit = d?.pagination?.limit ?? d?.limit
    const pages = d?.pagination?.pages ?? d?.pages
    const hasMore = typeof pages === 'number' && typeof page === 'number' ? page < pages
        : typeof total === 'number' && typeof limit === 'number' ? (extractItems(payload).length < total) : undefined
    return { unread, total, hasMore }
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    items: [],
    unreadCount: 0,
    page: 1,
    limit: 5,
    hasMore: true,
    loading: false,
    error: null,

    fetchInitial: async (limit) => {
        const lmt = limit ?? get().limit
        set({ loading: true, error: null, page: 1 })
        try {
            const res = await apiCaller('GET', `notifications?page=1&limit=${lmt}`)
            const items = extractItems(res)
            const meta = extractMeta(res)
            const unread = meta.unread as number | undefined
            const total = meta.total as number | undefined
            const hasMore = typeof meta.hasMore === 'boolean' ? meta.hasMore : (typeof total === 'number' ? items.length < total : items.length === lmt)
            set({ items, unreadCount: typeof unread === 'number' ? unread : items.filter(n => n?.isRead === false).length, hasMore, page: 1, limit: lmt })
        } catch (e: any) {
            set({ error: e?.message || 'Failed to load notifications' })
        } finally {
            set({ loading: false })
        }
    },

    fetchMore: async () => {
        const { loading, hasMore, page, limit, items } = get()
        if (loading || !hasMore) return
        set({ loading: true, error: null })
        try {
            const nextPage = page + 1
            const res = await apiCaller('GET', `notifications?page=${nextPage}&limit=${limit}`)
            const more = extractItems(res)
            const meta = extractMeta(res)
            const total = meta.total as number | undefined
            const nextItems = [...items, ...more]
            const nextHasMore = typeof meta.hasMore === 'boolean' ? meta.hasMore : (typeof total === 'number' ? nextItems.length < total : more.length === limit)
            set({ items: nextItems, page: nextPage, hasMore: nextHasMore })
        } catch (e: any) {
            set({ error: e?.message || 'Failed to load more notifications', hasMore: false })
        } finally {
            set({ loading: false })
        }
    },

    refresh: async () => {
        // refresh current first page (used for pull-to-refresh or reopen)
        await get().fetchInitial(get().limit)
    },

    markAllAsRead: async () => {
        const { items, unreadCount } = get()
        // If already all read, don't make API call
        if (unreadCount === 0) return
        
        try {
            // Try to mark all as read via API
            try {
                await apiCaller('PUT', 'notifications/mark-read')
            } catch (e) {
                // If API endpoint doesn't exist, try alternative
                try {
                    await apiCaller('POST', 'notifications/mark-all-read')
                } catch (e2) {
                    console.error('Error marking notifications as read:', e2)
                }
            }
            
            // Update local state - mark all items as read
            const updatedItems = items.map(item => ({
                ...item,
                isRead: true,
                readAt: new Date().toISOString()
            }))
            
            set({ 
                items: updatedItems, 
                unreadCount: 0 
            })
        } catch (e: any) {
            console.error('Error marking notifications as read:', e)
            // Even if API fails, update local state
            const updatedItems = items.map(item => ({
                ...item,
                isRead: true,
                readAt: new Date().toISOString()
            }))
            set({ 
                items: updatedItems, 
                unreadCount: 0 
            })
        }
    },

    reset: () => set({ items: [], unreadCount: 0, page: 1, hasMore: true, loading: false, error: null }),
}))
