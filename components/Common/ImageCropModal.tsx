"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Button } from "antd"
import { X } from "lucide-react"

interface ImageCropModalProps {
  open: boolean
  imageSrc: string
  onClose: () => void
  onCropComplete: (croppedImage: string) => void
  aspectRatio?: number
  cropShape?: "rect" | "round"
  title?: string
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

export default function ImageCropModal({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  cropShape = "rect",
  title = "Crop Image",
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.setAttribute("crossOrigin", "anonymous")
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    // react-easy-crop provides croppedAreaPixels in natural image coordinates
    // Set canvas size to match the cropped area
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped portion of the image
    // croppedAreaPixels are already in natural image coordinates
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"))
            return
          }
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        },
        "image/jpeg",
        0.95
      )
    })
  }

  const handleSave = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(croppedImage)
      onClose()
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-[#090721] rounded-2xl border border-[#FFFFFF1A] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#FFFFFF1A]">
          <h2 className="text-xl font-semibold text-white font-exo2">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-[500px] bg-[#0B0926]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape={cropShape}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                position: "relative",
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t border-[#FFFFFF1A]">
          <div className="space-y-4">
            {/* Zoom Control */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-exo2">
                Zoom: {Math.round(zoom * 100)}%
              </label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-[#1A183A] rounded-lg appearance-none cursor-pointer accent-[#7E6BEF]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                onClick={onClose}
                className="!px-6 !h-10 !bg-transparent !border-[#6B7280] !text-white !rounded-xl hover:!bg-[#1a1a2e] font-exo2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="!px-6 !h-10 !bg-gradient-to-r !from-[#5A21FF] !to-[#7E6BEF] !border-none !text-white !rounded-xl hover:!opacity-90 !font-semibold font-exo2"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

