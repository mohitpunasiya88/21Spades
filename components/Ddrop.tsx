"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Volume2, VolumeX, Play, Pause, X } from 'lucide-react'
import banner from './assets/D-Drop Banner.svg'

export const Ddrop = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handlePlayVideo = () => {
    setShowVideo(true)
    setIsPlaying(true)
  }

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setShowVideo(false)
    setIsPlaying(false)
  }

  // Update playing state when video plays/pauses
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [showVideo])

  if (!showVideo) {
    return (
      <div className="relative my-5 w-full aspect-[5/2] bg-[#0F0F23] overflow-hidden rounded-lg">
        <Image
          src={banner}
          alt="D-Drop Banner"
          fill
          priority
          className="object-cover w-full h-full"
        />
        <button
          onClick={handlePlayVideo}
          className="cursor-pointer absolute inset-0 z-10 flex items-center justify-center w-full h-full bg-black/20 hover:bg-black/30 transition-all duration-200 group"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 hover:bg-white group-hover:scale-110 transition-transform duration-200">
            <Play className="w-8 h-8 text-black ml-1" fill="black" />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div 
      className="relative my-5 w-full bg-[#0F0F23] overflow-hidden rounded-lg cursor-pointer"
      onClick={togglePlayPause}
    >
      <video
        ref={videoRef}
        src="/assets/D-drop Sample (1).mp4"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-auto pointer-events-none"
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Controls Container */}
      <div 
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 text-white"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="white" />
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 text-white"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        {/* Close/Back to Banner Button */}
        <button
          onClick={handleCloseVideo}
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 text-white"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}