"use client"

import { useState, useRef } from "react"
import { Button, Input, message, Upload, Select, Switch, InputNumber } from "antd"
import { Upload as UploadIcon, X, Plus } from "lucide-react"
import Image from "next/image"
import { useAuthStore } from "@/lib/store/authStore"
import tigercarImage from "@/components/assets/tigercar.jpg"
import collectionOneImage from "@/components/assets/image21.png"
import collectionTwoImage from "@/components/assets/image22.png"
import spadesImage from "@/components/assets/Spades-image-21.png"

const { TextArea } = Input

export default function CreateNFTPage() {
  const { user } = useAuthStore()
  const [selectedMethod, setSelectedMethod] = useState("Open For Bids")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fixedPrice, setFixedPrice] = useState<number | null>(null)
  const [size, setSize] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [royalties, setRoyalties] = useState<number | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [postToFeed, setPostToFeed] = useState<boolean>(true)
  const [freeMinting, setFreeMinting] = useState<boolean>(true)
  const [putOnMarketplace, setPutOnMarketplace] = useState<boolean>(true)
  const [unlockOncePurchased, setUnlockOncePurchased] = useState<boolean>(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const methods = ["Fixed Rate", "Time Auction", "Open For Bids"]
  const categories = ["Art", "Collectibles", "Photography", "Music", "Sports"]
  const collections = [
    { id: "col1", name: "Neon Tigers", image: collectionOneImage },
    { id: "col2", name: "Cyber Realm", image: collectionTwoImage },
  ] as const

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (500MB max)
      if (file.size > 500 * 1024 * 1024) {
        message.error("File size must be less than 500MB")
        return
      }

      // Check file type
      const validTypes = ["image/png", "image/gif", "image/webp", "audio/mpeg", "video/mp4"]
      if (!validTypes.includes(file.type)) {
        message.error("Invalid file type. Please upload PNG, GIF, WEBP, MP3, or MP4")
        return
      }

      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        message.error("File size must be less than 500MB")
        return
      }

      const validTypes = ["image/png", "image/gif", "image/webp", "audio/mpeg", "video/mp4"]
      if (!validTypes.includes(file.type)) {
        message.error("Invalid file type. Please upload PNG, GIF, WEBP, MP3, or MP4")
        return
      }

      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCreateItem = () => {
    if (!uploadedFile) {
      message.error("Please upload a file")
      return
    }
    if (!title.trim()) {
      message.error("Please enter a title")
      return
    }
    if (!description.trim()) {
      message.error("Please enter a description")
      return
    }

    // TODO: Implement NFT creation API call
    message.success("NFT created successfully!")
    console.log("Creating NFT:", {
      file: uploadedFile,
      method: selectedMethod,
      title,
      description,
      fixedPrice,
      size,
      category,
      royalties,
      selectedCollection,
      postToFeed,
      freeMinting,
      putOnMarketplace,
      unlockOncePurchased,
    })
  }

  return (
    <div className="px-4 md:px-6 py-6 mt-4 space-y-6 bg-[#020019] font-exo2 min-h-screen">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden border border-[#4F01E6] bg-gradient-to-r from-[#4F01E6] to-[#020019] py-8 md:py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[320px] md:h-[320px] opacity-80">
            <Image
              src={spadesImage}
              alt="Left spade accent"
              fill
              className="object-contain"
              style={{
                filter: 'blur(4px) brightness(1.6) contrast(1.35)',
                transform: ' rotate(90deg)',

                objectFit: 'cover',
                objectPosition: '100% 50%',
              }}
            />
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[320px] md:h-[320px] opacity-80">
            <Image
              src={spadesImage}
              alt="Right spade accent"
              fill
              className="object-contain mr-24"
              style={{
                filter: 'blur(4px) brightness(1.6) contrast(1.35)',
                transform: ' rotate(-90deg)',
                objectFit: 'cover',
                objectPosition: '100% 50%',
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-white text-2xl md:text-3xl font-exo2 tracking-wider">Tokenize an Asset</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Preview Item */}
        <div className="space-y-6">
          <div className=" p-6">
            <h2 className="text-white text-xl font-semibold mb-2">Preview Item</h2>
            <p className="text-[#9BA3AF] text-sm mb-4">Your NFT will look this</p>

            {/* NFT Preview Card */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={tigercarImage}
                alt="NFT Preview"
                className="w-full h-auto object-cover rounded-xl "
              />
            </div>

            <Button
              type="primary"
              className="!w-[336px] !mt-4 !bg-gradient-to-r !from-[#5A21FF] !to-[#7E6BEF] !border-none !h-12 !text-base !font-semibold"
              onClick={handleCreateItem}
            >
              Create Item
            </Button>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6">
          {/* Upload File */}
          <div className=" p-6">
            <h2 className="text-white text-xl font-semibold mb-2">Upload File</h2>
            <p className="text-[#9BA3AF] text-sm mb-4">Drag or choose your file to upload</p>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#2A2F4A] rounded-xl p-8 md:p-12 bg-[#0B0926] text-center cursor-pointer hover:border-[#5A21FF] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl && uploadedFile?.type.startsWith("image/") ? (
                <div className="relative">
                  <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden mb-4">
                    <Image
                      src={previewUrl}
                      alt="Uploaded file"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-[#5A21FF]/20 flex items-center justify-center">
                    <UploadIcon className="w-10 h-10 text-[#5A21FF]" />
                  </div>
                  <p className="text-[#9BA3AF] text-sm mb-2">
                    PNG, GIF, WEBP, MP3, MP4; MAX 500MB
                  </p>
                  <Button
                    type="primary"
                    className="!bg-[#FFFFFF1A] !p-4 !rounded-full  !mt-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    Upload
                  </Button>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/gif,image/webp,audio/mpeg,video/mp4"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Select Method */}
          <div className=" p-6">
            <h2 className="text-white text-xl font-semibold mb-2">
              Select Method <span className="text-red-500">*</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {methods.map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`px-6 py-3 rounded-full text-sm border-1 border-gray-500 hover:bg-[#4E00E5] hover:text-white hover:border-[#5A21FF] font-exo2 transition-all ${selectedMethod === method

                    }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className=" p-6">
            <h2 className="text-white text-xl font-semibold mb-2">
              Title <span className="text-red-500">*</span>
            </h2>
            <Input
              placeholder="e.g: Crypto Hunks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="!bg-[#0B0926] !border-[#2A2F4A] !text-white !h-12 !rounded-xl placeholder:!text-[#6B7280]"
            />
          </div>

          {/* Description */}
          <div className="p-6">
            <h2 className="text-white text-xl font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </h2>
            <TextArea
              placeholder="e.g: This is very limited item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="!bg-[#0B0926] !border-[#2A2F4A] !text-white !rounded-xl placeholder:!text-[#6B7280]"
            />
          </div>

          {/* Input Fields - 2x2 Grid */}
          <div className=" p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fixed Price */}
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">
                  Fixed Price <span className="text-red-500">*</span>
                </h2>
                <InputNumber
                  value={fixedPrice as number | null}
                  onChange={(v) => setFixedPrice(typeof v === "number" ? v : null)}
                  placeholder="0"
                  className="!w-full !h-12 !bg-[#0B0926] !border-[#2A2F4A] !text-white !rounded-xl [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input]:!placeholder:text-[#6B7280]"
                  addonAfter={<span className="text-white">AVAX</span>}
                  min={0}
                  stringMode
                />
              </div>

              {/* Size (Optional) */}
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">
                  Size <span className="text-[#9BA3AF] text-sm font-normal">(Optional)</span>
                </h2>
                <Input
                  placeholder="e.g: Width x height"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="!bg-[#0B0926] !border-[#2A2F4A] !text-white !h-8 !rounded-xl placeholder:!text-[#6B7280]"
                />
              </div>

              {/* Category */}
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">Category</h2>
                <Select
                  placeholder="Select Category"
                  value={category || undefined}
                  onChange={(v) => setCategory(v)}
                  className="!w-full category-select"
                  popupClassName="category-select-dropdown"
                  suffixIcon={<span className="text-white">▼</span>}
                  options={categories.map((c) => ({ label: c, value: c }))}
                  dropdownStyle={{
                    backgroundColor: "#0B0926",
                    border: "1px solid #2A2F4A",
                  }}
                />
              </div>

              {/* Royalties */}
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">Royalties</h2>
                <InputNumber
                  value={royalties as number | null}
                  onChange={(v) => setRoyalties(typeof v === "number" ? v : null)}
                  placeholder="Maximum is 50%"
                  className="!w-full !h-12 !bg-[#0B0926] !border-[#2A2F4A] !text-white !rounded-xl [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input]:!placeholder:text-[#6B7280]"
                  addonAfter={<span className="text-white">%</span>}
                  min={0}
                  max={50}
                />
              </div>
            </div>
          </div>

          {/* Choose/Create Collection */}
          <div className=" p-6">
            <h2 className="text-white text-xl font-semibold mb-2">Choose/Create your own Collection</h2>
            <p className="text-[#9BA3AF] text-sm mb-5">Choose an existing collection or create a new one.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {collections.map((collection) => {
                const isSelected = selectedCollection === collection.id
                return (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => setSelectedCollection(collection.id)}
                    className={`group relative flex h-full overflow-hidden rounded-2xl duration-300 ${isSelected
                      // ? "border-[#6C4DFF] shadow-[0_12px_30px_rgba(108,77,255,0.35)]"
                      // : "border-transparent hover:border-[#6C4DFF]/60"
                      }`}
                  >
                    <div className="relative h-[130px] w-full rounded-2xl">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 800px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0729]/20 to-[#0B0729]/90 opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-white text-base font-semibold">{collection.name}</p>
                        <p className="text-xs text-[#C5C9FF]/80">12 items</p>
                      </div>
                    </div>
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => setSelectedCollection("create-new")}
                className={`group flex h-[130px] w-full flex-col items-center justify-center rounded-2xl border border-dashed transition-all duration-300 ${selectedCollection === "create-new"
                  ? "border-[#6C4DFF] text-white bg-[#120D39]"
                  : "border-[#2A2F4A] text-[#9BA3AF] hover:border-[#6C4DFF] hover:text-white"
                  }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C4DFF]/10 text-[#6C4DFF] mb-3 group-hover:bg-[#6C4DFF]/20">
                  <Plus className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">Create Collection</span>
              </button>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Post To Feed */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Post To Feed</h3>
                  <p className="text-[#9BA3AF] text-sm">Item will display in Feed</p>
                </div>
                <Switch
                  checked={postToFeed}
                  onChange={setPostToFeed}
                  className="[&_.ant-switch-checked]:!bg-[#5A21FF]"
                />
              </div>

              {/* Free Minting */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Free Minting</h3>
                  <p className="text-[#9BA3AF] text-sm">Buyer will pay gas fees for minting</p>
                </div>
                <Switch
                  checked={freeMinting}
                  onChange={setFreeMinting}
                  className="[&_.ant-switch-checked]:!bg-[#5A21FF]"
                />
              </div>

              {/* Put on marketplace */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Put on marketplace</h3>
                  <p className="text-[#9BA3AF] text-sm">You'll receive bids on this item</p>
                </div>
                <Switch
                  checked={putOnMarketplace}
                  onChange={setPutOnMarketplace}
                  className="[&_.ant-switch-checked]:!bg-[#5A21FF]"
                />
              </div>

              {/* Unlock once purchased */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Unlock once purchased</h3>
                  <p className="text-[#9BA3AF] text-sm">Content will be unlocked after purchase</p>
                </div>
                <Switch
                  checked={unlockOncePurchased}
                  onChange={setUnlockOncePurchased}
                  className="[&_.ant-switch-checked]:!bg-[#5A21FF]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

