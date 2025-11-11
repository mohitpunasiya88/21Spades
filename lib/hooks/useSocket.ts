'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (!token) {
      console.log('No token found, skipping socket connection')
      return
    }

    tokenRef.current = token

    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    const handleConnect = () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    const handleConnectError = (error: Error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    }

    newSocket.on('connect', handleConnect)
    newSocket.on('disconnect', handleDisconnect)
    newSocket.on('connect_error', handleConnectError)

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.off('connect', handleConnect)
      newSocket.off('disconnect', handleDisconnect)
      newSocket.off('connect_error', handleConnectError)
      newSocket.close()
      setSocket(null)
      setIsConnected(false)
    }
  }, [])

  // Reconnect if token changes
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if (token && token !== tokenRef.current && socket) {
      socket.auth = { token }
      socket.connect()
    }
  }, [socket])

  return { socket, isConnected }
}

