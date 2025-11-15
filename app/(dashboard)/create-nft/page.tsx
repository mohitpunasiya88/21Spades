
"use client"

import { useState, useRef, useEffect } from "react"
import { Button, Input, Upload, Select, Switch, InputNumber, Modal, DatePicker, message } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Upload as UploadIcon, X, Plus, CloudUpload, Calendar } from "lucide-react"
import Image from "next/image"
import { useAuthStore } from "@/lib/store/authStore"
import { useMarketDataStore } from "@/lib/store/authStore"
import { apiCaller } from "@/app/interceptors/apicall/apicall"
import authRoutes from "@/app/routes/route"
import tigercarImage from "@/components/assets/tigercar.jpg"
import collectionOneImage from "@/components/assets/image21.png"
import collectionTwoImage from "@/components/assets/image22.png"
import spadesImage from "@/components/assets/Spades-image-21.png"
import spadesImageRight from "@/components/assets/Spades-left-Right.png"
import { useWallet } from "@/app/hooks/useWallet"
import { useNFTFactory } from "@/app/hooks/contracts/useNFTFactory"
import { usePrivy, useWallets } from "@privy-io/react-auth"

const { TextArea } = Input

export default function CreateNFTPage() {
  const { user } = useAuthStore()
  const { getCoinPrice, coinAmount } = useMarketDataStore()
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
  // Time Auction date fields
  const [startingDate, setStartingDate] = useState<Dayjs | null>(null)
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastValidFixedPriceRef = useRef<number | null>(null)
  
  // Create Collection Modal States
  const [isCreateCollectionModalOpen, setIsCreateCollectionModalOpen] = useState(false)
  const [collectionFile, setCollectionFile] = useState<File | null>(null)
  const [collectionPreviewUrl, setCollectionPreviewUrl] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [collectionDescription, setCollectionDescription] = useState("")
  const [symbolError, setSymbolError] = useState<string>("")
  const collectionFileInputRef = useRef<HTMLInputElement>(null)

  // Collections state
  const [collections, setCollections] = useState<any[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)

  // Fetch collections from API
  const fetchCollections = async () => {
    try {
      setIsLoadingCollections(true)
      const walletAddress = user?.walletAddress || ""
      
      // Build query params
      const queryParams = new URLSearchParams()
      if (walletAddress) {
        queryParams.append('walletAddress', walletAddress)
      }
      queryParams.append('page', '1')
      queryParams.append('limit', '100')
      queryParams.append('blocked', 'false')
      
      const url = `${authRoutes.getCollections}?${queryParams.toString()}`
      console.log("📡 Fetching collections from:", url)
      
      const response = await apiCaller('GET', url, null, true)
      console.log("📦 Collections response:", response)
      
      if (response.success && response.data) {
        // Handle both array and object with collections property
        const collectionsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.collections || response.data.data || [])
        setCollections(collectionsData)
        console.log("✅ Collections loaded:", collectionsData.length)
      } else {
        console.warn("⚠️ No collections found or invalid response")
        setCollections([])
      }
    } catch (error: any) {
      console.error("❌ Error fetching collections:", error)
      setCollections([])
    } finally {
      setIsLoadingCollections(false)
    }
  }

  // Fetch collections on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCollections()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Fetch AVAX price in USD
  useEffect(() => {
    const fetchAvaxPrice = async () => {
      try {
        await getCoinPrice('AVAX')
      } catch (error) {
        console.error("Error fetching AVAX price:", error)
      }
    }
    fetchAvaxPrice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const methods = ["Fixed Rate", "Time Auction", "Open For Bids"]
  const categories = ["Art", "Collectibles", "Photography", "Music", "Sports"]

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

  const handleCreateItem = async () => {
    console.log("🚀 handleCreateItem called")
    console.log("📋 Form state:", {
      uploadedFile: !!uploadedFile,
      title,
      description,
      selectedCollection,
      fixedPrice,
      selectedMethod,
      expirationDate,
      walletAddress: user?.walletAddress
    })
    
    // Validation
    if (!uploadedFile) {
      console.log("❌ Validation failed: No file uploaded")
      message.error("Please upload a file")
      return
    }
    if (!title.trim()) {
      console.log("❌ Validation failed: No title")
      message.error("Please enter a title")
      return
    }
    if (!description.trim()) {
      console.log("❌ Validation failed: No description")
      message.error("Please enter a description")
      return
    }
    if (!selectedCollection) {
      console.log("❌ Validation failed: No collection selected")
      message.error("Please select or create a collection")
      return
    }
    if ((fixedPrice === null || fixedPrice === undefined) && selectedMethod !== "Open For Bids") {
      console.log("❌ Validation failed: No fixed price")
      message.error("Please enter a fixed price")
      return
    }
    if (selectedMethod === "Time Auction" && !expirationDate) {
      console.log("❌ Validation failed: No expiration date for Time Auction")
      message.error("Please select an expiration date")
      return
    }

    // Hardcoded wallet address for testing
    const walletAddress = user?.walletAddress || "1234567890"
    // if (!walletAddress) {
    //   console.log("❌ Validation failed: No wallet address")
    //   message.error("Wallet address not found. Please connect your wallet.")
    //   return
    // }
    
    console.log("✅ All validations passed, proceeding with API call...")

    let loadingMessage: any = null
    try {
      console.log("📝 Starting NFT creation process...")
      
      // Convert file to base64 data URL
      const fileToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      console.log("🖼️ Converting file to data URL...")
      const imageUrl = await fileToDataURL(uploadedFile)
      console.log("✅ File converted, length:", imageUrl.length)

      // Determine media type
      const mediaType = uploadedFile.type.startsWith("image/") 
        ? "image" 
        : uploadedFile.type.startsWith("video/") 
        ? "video" 
        : uploadedFile.type.startsWith("audio/") 
        ? "audio" 
        : "image"

      // Determine animation URL (for videos)
      const animationUrl = mediaType === "video" ? imageUrl : undefined
      const ipfsAnimationUrl = mediaType === "video" ? "" : undefined

      // Map auction type
      let auctionType = 0 // Default: Fixed Rate
      if (selectedMethod === "Time Auction") {
        auctionType = 1
      } else if (selectedMethod === "Open For Bids") {
        auctionType = 2
      }

      // Calculate starting and ending times
      let startingTime: string | undefined
      let endingTime: string | undefined
      
      if (selectedMethod === "Time Auction") {
        if (startingDate) {
          startingTime = startingDate.toISOString()
        }
        if (expirationDate) {
          endingTime = expirationDate.toISOString()
        }
      }

      // Calculate total days for auction (if Time Auction)
      const totalDays = selectedMethod === "Time Auction" && expirationDate
        ? Math.ceil((expirationDate.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0

      // Prepare payload according to API schema
      const payload: any = {
        collectionId: selectedCollection,
        royalty: royalties || 0,
        walletAddress: walletAddress,
        itemName: title,
        itemDescription: description,
        ipfsHash: "", // Will be set by backend or IPFS upload
        imageUrl: imageUrl, // Using data URL for now
        imageIPFS: "", // Will be set by backend
        size: size || "",
        property: "", // Not in form, can be added later
        tokenQty: 1,
        price: fixedPrice || 0,
        totalDays: totalDays,
        putOnSale: putOnMarketplace ? 1 : 0,
        hashCode: "", // Will be generated by backend
        categoryId: category || "",
        nftStatus: 1,
        isLazyMint: freeMinting,
        signature: "", // Will be generated by backend
        jsonIpfs: "", // Will be set by backend
        auctionType: auctionType,
        startingTime: startingTime,
        endingTime: endingTime,
        isMultiple: false,
        owners: [walletAddress],
        isUnlockable: unlockOncePurchased,
        chainIndex: 1,
        blocked: false,
        creator: {
          walletAddress: walletAddress,
          name: user?.name || "",
          profilePicture: user?.profilePicture || "",
        },
        subCategory: category || "",
        mediaType: mediaType,
        animationUrl: animationUrl,
        ipfsAnimationUrl: ipfsAnimationUrl,
        attributes: [], // Can be added later if needed
        onSaleData: {},
        postToFeed: postToFeed,
      }

      // Remove undefined fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key]
        }
      })

      console.log("📦 Payload prepared:", {
        ...payload,
        imageUrl: payload.imageUrl?.substring(0, 50) + "...",
        animationUrl: payload.animationUrl?.substring(0, 50) + "...",
      })

      loadingMessage = message.loading("Creating NFT...", 0)

      const apiUrl = authRoutes.createNFT
      console.log("🌐 Calling API:", apiUrl)
      console.log("🌐 Full API URL will be:", apiUrl)
      console.log("📤 Sending payload size:", JSON.stringify(payload).length, "bytes")
      
      const response = await apiCaller('POST', apiUrl, payload, true)
      console.log("📡 API Response received:", response)
      console.log("📡 Response success:", response?.success)
      console.log("📡 Response data:", response?.data)

      message.destroy(loadingMessage as any)

      if (response.success) {
        message.success(response.message || "NFT created successfully!")
        
        // Reset form
        setUploadedFile(null)
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
        setTitle("")
        setDescription("")
        setFixedPrice(null)
        setSize("")
        setCategory("")
        setRoyalties(null)
        setSelectedCollection("")
        setExpirationDate(null)
        setStartingDate(null)
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        
        console.log("✅ NFT created:", response.data)
      } else {
        console.error("❌ API returned success: false", response)
        message.error(response.message || "Failed to create NFT")
      }
    } catch (error: any) {
      console.error("❌ Error creating NFT:", error)
      console.error("❌ Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      })
      
      if (loadingMessage) {
        message.destroy(loadingMessage as any)
      }
      const errorMessage = error?.response?.data?.message || error?.message || "An error occurred"
      message.error(errorMessage)
    }
  }

  // Collection Modal Handlers
  const handleCollectionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        message.error("File size must be less than 500MB")
        return
      }
      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      if (!validTypes.includes(file.type)) {
        message.error("Invalid file type. Please upload PNG, JPEG, or JPG")
        return
      }
      setCollectionFile(file)
      const url = URL.createObjectURL(file)
      setCollectionPreviewUrl(url)
    }
  }

  const handleCollectionDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleCollectionDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        message.error("File size must be less than 500MB")
        return
      }
      const validTypes = ["image/png", "image/jpeg", "image/jpg"]
      if (!validTypes.includes(file.type)) {
        message.error("Invalid file type. Please upload PNG, JPEG, or JPG")
        return
      }
      setCollectionFile(file)
      const url = URL.createObjectURL(file)
      setCollectionPreviewUrl(url)
    }
  }

  const handleRemoveCollectionFile = () => {
    setCollectionFile(null)
    if (collectionPreviewUrl) {
      URL.revokeObjectURL(collectionPreviewUrl)
      setCollectionPreviewUrl(null)
    }
    if (collectionFileInputRef.current) {
      collectionFileInputRef.current.value = ""
    }
  }
  const { address, isConnected, login, linkGoogle } = useWallet();
  const { ready, authenticated, createWallet, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  
  const {
    createCollection,
    setMintableAddress: setMintableAddressContract,
    getAllCollection,
    getUserCollection,
    getMintableAddress,
    isLoading,
    error,
  } = useNFTFactory();

  const [collectionParams, setCollectionParams] = useState({
    name: '',
    symbol: '',
    contractURI: '',
    tokenURIPrefix: '',
    royaltyLimit: 100,
  });

  const handleCreateCollection = async () => {
    console.log("🚀 handleCreateCollection called")
    debugger;
    // Check if Privy is ready
    // if (!ready) {
    //   message.info("Please wait, wallet is initializing...");
    //   return;
    // }
    console.log("🔑 Authenticated:", authenticated)
    
    // // Check if user is authenticated
    // if (!authenticated) {
    //   message.info("Please login first");
    //   login();
    //   return;
    // }
    
    // Check if embedded wallet exists
    let embeddedWallet = wallets.find((w: any) => w.walletClientType === 'privy');
    console.log("🔑 Embedded wallet:", embeddedWallet)
    if (!embeddedWallet) {
      const hideLoading = message.loading("Creating your wallet...", 0);
      try {
        await createWallet();
        hideLoading();
        console.log("🔑 Wallet created")
        // Wait for wallet to appear in wallets array (polling with longer wait)
        let walletFound = false;
        let attempts = 0;
        const maxAttempts = 30; // 15 seconds max wait (500ms * 30)
        
        message.info("Waiting for wallet to be ready...");
        
        while (attempts < maxAttempts && !walletFound) {
          await new Promise(resolve => setTimeout(resolve, 500));
          // Re-check wallets array - it should update reactively
          const currentWallets = wallets;
          embeddedWallet = currentWallets.find((w: any) => w.walletClientType === 'privy');
          if (embeddedWallet) {
            walletFound = true;
            message.success("Wallet created successfully!");
            // Give React hooks time to update (especially useWallets in useContract)
            await new Promise(resolve => setTimeout(resolve, 2000));
            break;
          }
          attempts++;
        }
        
        if (!walletFound) {
          message.error("Wallet creation is taking longer than expected. Please refresh the page and try again.");
          return;
        }
      } catch (error: any) {
        hideLoading();
        console.error("Error creating wallet:", error);
        message.error(error?.message || "Failed to create wallet. Please try again.");
        return;
      }
    }
    
    // Final check before proceeding - ensure wallet is still available
    embeddedWallet = wallets.find((w: any) => w.walletClientType === 'privy');
    if (!embeddedWallet) {
      message.error("Wallet not available. Please try again.");
      return;
    }

    // Validate inputs first
    if (!collectionFile) {
      message.error("Please upload a file")
      return
    }
    if (!displayName.trim()) {
      message.error("Please enter a display name")
      return
    }
    if (!tokenSymbol.trim()) {
      message.error("Please enter a token symbol")
      return
    }
    if (!collectionDescription.trim()) {
      message.error("Please enter a description")
      return
    }
    
    // Final wallet check before proceeding with transaction
    const finalWalletCheck = wallets.find((w: any) => w.walletClientType === 'privy');
    if (!finalWalletCheck) {
      message.error("Wallet connection lost. Please refresh and try again.");
      return;
    }
    
    try {
      const result = await createCollection({
        name: collectionParams.name,
        symbol: collectionParams.symbol,
        contractURI: collectionParams.contractURI,
        tokenURIPrefix: collectionParams.tokenURIPrefix,
        royaltyLimit: collectionParams.royaltyLimit,
      });
      
      message.success("Collection created successfully!");
      console.log("✅ Collection created:", result);
      
      // Reset form and close modal on success
      setCollectionFile(null);
      if (collectionPreviewUrl) {
        URL.revokeObjectURL(collectionPreviewUrl);
        setCollectionPreviewUrl(null);
      }
      setDisplayName("");
      setTokenSymbol("");
      setCollectionDescription("");
      setIsCreateCollectionModalOpen(false);
    } catch (error: any) {
      console.error("❌ Error creating collection:", error);
      const errorMessage = error?.message || "Failed to create collection. Please try again.";
      message.error(errorMessage);
    }
    try {
      console.log("📝 Starting collection creation process...")
      
      // Convert file to base64 data URL (temporary solution - replace with actual file upload endpoint if available)
      const fileToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      console.log("🖼️ Converting file to data URL...")
      const imageUrl = await fileToDataURL(collectionFile)
      console.log("✅ File converted, length:", imageUrl.length)
      
      // Generate slug from token symbol (not display name)
      const collectionSlug = tokenSymbol
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Prepare payload according to API schema
      const payload = {
        // walletAddress: walletAddress,
        walletAddress: '1234567890',
        collectionName: displayName,
        collectionDescription: collectionDescription,
        collectionIpfs: "", // Will be set by backend or IPFS upload
        imageUrl: imageUrl, // Using data URL for now - replace with actual URL after file upload
        coverPhoto: imageUrl, // Using same image for cover photo - can be changed later
        isActive: true,
        collectionSlug: collectionSlug,
        isVerified: false,
        isMultiple: false,
        blocked: false,
        floorPrice: "0",
        chainIndex: 1,
        totalCollectionNfts: 0
      }

      console.log("📦 Payload prepared:", {
        ...payload,
        imageUrl: payload.imageUrl.substring(0, 50) + "...", // Log only first 50 chars
        coverPhoto: payload.coverPhoto.substring(0, 50) + "..."
      })

      const collectionLoadingMessage = message.loading("Creating collection...", 0)

      console.log("🌐 Calling API:", authRoutes.createCollection)
      // Call API
      const response = await apiCaller('POST', authRoutes.createCollection, payload, true)
      console.log("📡 API Response:", response)

      // Destroy loading message
      message.destroy(collectionLoadingMessage as any)

      if (response.success) {
        // Show success message from API or default
        message.success(response.message || "Collection created successfully!")
        
        // Reset form and close modal
        setCollectionFile(null)
        if (collectionPreviewUrl) {
          URL.revokeObjectURL(collectionPreviewUrl)
          setCollectionPreviewUrl(null)
        }
        setDisplayName("")
        setTokenSymbol("")
        setCollectionDescription("")
        setIsCreateCollectionModalOpen(false)
        
        // Refresh collections list
        await fetchCollections()
        
        console.log("✅ Collection created:", response.data)
      } else {
        console.error("❌ API returned success: false", response)
        
        // Check if error is related to slug - check multiple possible fields
        const errorMessage = response.message || response.error || response.data?.message || response.data?.error || ""
        console.log("🔍 Error message for slug check:", errorMessage)
        
        // More comprehensive slug error detection
        const lowerErrorMessage = errorMessage.toLowerCase()
        if (
          lowerErrorMessage.includes("slug") || 
          lowerErrorMessage.includes("collection slug") ||
          lowerErrorMessage.includes("already exists") ||
          lowerErrorMessage.includes("unique slug")
        ) {
          console.log("✅ Setting symbol error:", errorMessage)
          setSymbolError(errorMessage)
        } else {
          console.log("❌ Not a slug error, clearing symbol error")
          setSymbolError("")
        }
        
        // Show error message from API
        message.error(response.message || "Failed to create collection")
      }
    } catch (error: any) {
      console.error("❌ Error creating collection:", error)
      console.error("❌ Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      })
      
      // Destroy loading message
      // if (collectionLoadingMessage) {
      //   message.destroy(collectionLoadingMessage as any)
      // }
      
      // Check if error is related to slug - check multiple possible fields
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        error?.message || 
        error?.error ||
        ""
      
      console.log("🔍 Error message from catch block for slug check:", errorMessage)
      console.log("🔍 Full error response:", error?.response?.data)
      
      // More comprehensive slug error detection
      const lowerErrorMessage = errorMessage.toLowerCase()
      if (
        lowerErrorMessage.includes("slug") || 
        lowerErrorMessage.includes("collection slug") ||
        lowerErrorMessage.includes("already exists") ||
        lowerErrorMessage.includes("unique slug")
      ) {
        console.log("✅ Setting symbol error from catch:", errorMessage)
        setSymbolError(errorMessage)
      } else {
        console.log("❌ Not a slug error, clearing symbol error")
        setSymbolError("")
      }
      
      // Show error from API response or generic error
      const collectionErrorMessage = error?.response?.data?.message || error?.message || "An error occurred"
      message.error(collectionErrorMessage)
    }
  }

  const handleCloseCollectionModal = () => {
    setIsCreateCollectionModalOpen(false)
    // Reset form on close
    setCollectionFile(null)
    if (collectionPreviewUrl) {
      URL.revokeObjectURL(collectionPreviewUrl)
      setCollectionPreviewUrl(null)
    }
    setDisplayName("")
    setTokenSymbol("")
    setCollectionDescription("")
    setSymbolError("")
  }

  const handleTokenSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenSymbol(e.target.value)
    // Clear error when user starts typing
    if (symbolError) {
      setSymbolError("")
    }
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 mt-2 sm:mt-4 space-y-4 sm:space-y-6 bg-[#020019] font-exo2 min-h-screen">
      {/* Banner */}
      <div className="relative rounded-xl  overflow-hidden border border-[#4F01E6] bg-gradient-to-r from-[#4F01E6] to-[#020019] h-[120px] md:h-[160px]">
        <div className="absolute inset-0 overflow-hidden">
          {/* Left Spade - Pointing Right */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[20%] w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px]">
            <Image
              src={spadesImageRight}
              alt="Left spade accent"
              fill
              className="object-contain"
              style={{
                filter: 'blur(3px) brightness(1.5) contrast(1.3)',
                transform: 'rotate(0deg) scaleX(-1)',
              }}
            />
          </div>

          {/* Right Spade - Pointing Left */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px]">
            <Image
              src={spadesImageRight}
              alt="Right spade accent"
              fill
              className="object-contain"
              style={{
                filter: 'blur(3px) brightness(1.5) contrast(1.3)',
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-exo2 tracking-wider font-semibold">
            Tokenize an Asset
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column - Preview Item */}
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">Preview Item</h2>
            <p className="text-[#9BA3AF] text-xs sm:text-sm mb-3 sm:mb-4">Your NFT will look this</p>

            {/* NFT Preview Card */}
            <div className="relative rounded-xl overflow-hidden bg-[#0B0926] border border-[#2A2F4A]">
              {/* NFT Image */}
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={previewUrl || tigercarImage}
                  alt="NFT Preview"
                  fill
                  className="object-cover"
                />
                
                {/* NFT Details Overlay - Positioned at bottom of image */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                  <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
                    {title || "Tiger Neon #1"}
                  </h3>
                  
                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#5A21FF] bg-gradient-to-br from-[#5A21FF] to-[#7E6BEF] flex items-center justify-center flex-shrink-0">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Creator"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/assets/avatar.jpg"
                          alt="Creator"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-white text-xs sm:text-sm">
                      Creator <span className="font-semibold">{user?.name || "21Spades"}</span>
                    </span>
                  </div>
                  
                  {/* Highest Bid */}
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs sm:text-sm">Highest Bid</span>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm sm:text-base font-semibold">
                          {fixedPrice ? `${fixedPrice} AVAX` : "6.8 AVAX"}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E84142] to-[#C2181B] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                      </div>
                      {coinAmount > 0 && (
                        <span className="text-[#9BA3AF] text-xs">
                          ${((fixedPrice || 6.8) * coinAmount).toFixed(2)} USD
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="primary"
              htmlType="button"
              className="!w-full !mt-3 sm:!mt-4 !bg-gradient-to-r !from-[#5A21FF] !to-[#7E6BEF] !border-none !h-10 sm:!h-12 !text-sm sm:!text-base !font-semibold"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("🔘 Button clicked, calling handleCreateItem...")
                handleCreateItem()
              }}
            >
              Create Item
            </Button>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Upload File */}
          <div className="p-4 sm:p-6">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">Upload File</h2>
            <p className="text-[#9BA3AF] text-xs sm:text-sm mb-3 sm:mb-4">Drag or choose your file to upload</p>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#2A2F4A] rounded-xl p-6 sm:p-8 md:p-12 bg-[#0B0926] text-center cursor-pointer hover:border-[#5A21FF] transition-colors"
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
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl bg-[#5A21FF]/20 flex items-center justify-center">
                    <UploadIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#5A21FF]" />
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
          <div className="p-4 sm:p-6">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
              Select Method <span className="text-[#5A21FF]">*</span>
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {methods.map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-exo2 transition-all ${
                    selectedMethod === method
                      ? "bg-[#5A21FF] text-white border border-[#5A21FF]"
                      : "bg-transparent text-white border border-[#6B7280] hover:bg-[#4E00E5] hover:text-white hover:border-[#5A21FF]"
                    }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="p-4 sm:p-6">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
              Title <span className="text-[#5A21FF]">*</span>
            </h2>
            <Input
              placeholder="e.g: Crypto Hunks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="!bg-[#0B0926] !border-[#6B7280] !text-white !h-12 !rounded-xl placeholder:!text-[#6B7280]"
            />
          </div>

          {/* Description */}
          <div className="p-4 sm:p-6">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">
              Description <span className="text-[#5A21FF]">*</span>
            </h2>
            <TextArea
              placeholder="e.g: This is very limited item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="!bg-[#0B0926] !border-[#6B7280] !text-white !rounded-xl placeholder:!text-[#6B7280] sm:!min-h-[120px]"
            />
          </div>

          {/* Time Auction Date Fields */}
          {selectedMethod === "Time Auction" && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Starting Date */}
                <div>
                  <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">Starting Date</h2>
                   <DatePicker
                    value={startingDate}
                    onChange={(date) => setStartingDate(date)}
                    disabledDate={(current) => {
                      // Disable dates before today
                      return current && current < dayjs().startOf('day')
                    }}
                    format="DD/MM/YYYY"
                    placeholder="Select starting date"
                    className="!w-full !h-10 sm:!h-12 [&_.ant-picker-input]:!bg-[#0B0926] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#0B0926] !border-[#6B7280] !rounded-xl [&_.ant-picker-suffix]:!text-white"
                    popupClassName="[&_.ant-picker-dropdown]:!bg-[#0B0926] [&_.ant-picker-panel]:!bg-[#0B0926] [&_.ant-picker-header]:!bg-[#0B0926] [&_.ant-picker-header]:!border-[#6B7280] [&_.ant-picker-content]:!bg-[#0B0926] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF]"
                    suffixIcon={<Calendar className="h-4 w-4 text-white" />}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  />
                </div>

                {/* Expiration Date */}
                <div>
                  <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">Expiration Date</h2>
                  <DatePicker
                    value={expirationDate}
                    onChange={(date) => setExpirationDate(date)}
                    disabledDate={(current) => {
                      // Disable dates before today
                      return current && current < dayjs().startOf('day')
                    }}
                    format="DD/MM/YYYY"
                    placeholder="Select ending date"
                    className="!w-full !h-10 sm:!h-12 [&_.ant-picker-input]:!bg-[#0B0926] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#0B0926] !border-[#6B7280] !rounded-xl [&_.ant-picker-suffix]:!text-white"
                    popupClassName="[&_.ant-picker-dropdown]:!bg-[#0B0926] [&_.ant-picker-panel]:!bg-[#0B0926] [&_.ant-picker-header]:!bg-[#0B0926] [&_.ant-picker-header]:!border-[#6B7280] [&_.ant-picker-content]:!bg-[#0B0926] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF]"
                    suffixIcon={<Calendar className="h-4 w-4 text-white" />}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Input Fields - 2x2 Grid */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fixed Price */}
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">
                  Fixed Price <span className="text-[#5A21FF]">*</span>
                </h2>
                <div className="relative">
                <InputNumber
                    value={fixedPrice !== null && fixedPrice !== undefined ? fixedPrice : undefined}
                    onChange={(v) => {
                      console.log("InputNumber onChange:", v, typeof v)
                      if (v === null || v === undefined) {
                        // Keep current value, don't clear
                        return
                      }
                      
                      const numValue = typeof v === "number" ? v : parseFloat(String(v))
                      if (!isNaN(numValue) && numValue >= 0) {
                        setFixedPrice(numValue)
                        lastValidFixedPriceRef.current = numValue
                        console.log("✅ Fixed price updated to:", numValue)
                      } else {
                        // Invalid number, keep last valid value
                        if (lastValidFixedPriceRef.current !== null) {
                          setFixedPrice(lastValidFixedPriceRef.current)
                        }
                      }
                    }}
                    onBlur={() => {
                      // Ensure value is preserved on blur
                      if (fixedPrice !== null && fixedPrice !== undefined) {
                        lastValidFixedPriceRef.current = fixedPrice
                        console.log("💾 Saved fixed price on blur:", fixedPrice)
                      }
                    }}
                  placeholder="0"
                    className="!w-full !h-12 !bg-[#0B0926] !border-[#6B7280] !text-white !rounded-xl [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input]:!placeholder:text-[#6B7280] [&_.ant-input-number-input]:!pr-16"
                  min={0}
                    precision={2}
                    controls={true}
                />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm">AVAX</span>
                </div>
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
                  className="!bg-[#0B0926] !border-[#6B7280] !text-white !h-12 !rounded-xl placeholder:!text-[#6B7280]"
                />
              </div>

              {/* Category */}
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">Category</h2>
                <Select
                  placeholder="Select Category"
                  value={category || undefined}
                  onChange={(v) => setCategory(v)}
                  className="!w-full category-select [&_.ant-select-selector]:!bg-[#0B0926] [&_.ant-select-selector]:!border-[#6B7280] [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selection-placeholder]:!text-[#6B7280] [&_.ant-select-selection-item]:!text-white [&_.ant-select-arrow]:!text-white"
                  popupClassName="category-select-dropdown"
                  suffixIcon={<span className="text-white">▼</span>}
                  options={categories.map((c) => ({ label: c, value: c }))}
                  getPopupContainer={(trigger) => trigger.parentElement || document.body}
                />
              </div>

              {/* Royalties */}
              <div>
                <h2 className="text-white text-xl font-semibold mb-2">Royalties</h2>
                <div className="relative">
                <InputNumber
                  value={royalties as number | null}
                  onChange={(v) => setRoyalties(typeof v === "number" ? v : null)}
                  placeholder="Maximum is 50%"
                    className="!w-full !h-12 !bg-[#0B0926] !border-[#6B7280] !text-white !rounded-xl [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input]:!placeholder:text-[#6B7280] [&_.ant-input-number-input]:!pr-8"
                  min={0}
                  max={50}
                />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Choose/Create Collection */}
          <div className="p-4 sm:p-6">
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">Choose/Create your own Collection</h2>
            <p className="text-[#9BA3AF] text-xs sm:text-sm mb-4 sm:mb-5">Choose an existing collection or create a new one.</p>

            <div 
              className={collections.length > 2 ? "collections-scroll pr-2" : ""}
              style={{
                height: collections.length > 2 ? '200px' : 'auto',
                maxHeight: collections.length > 2 ? '250px' : 'none',
                overflowY: collections.length > 2 ? 'auto' : 'visible',
                overflowX: 'hidden',
                scrollbarWidth: collections.length > 2 ? 'thin' : 'none',
                scrollbarColor: collections.length > 2 ? '#5A21FF #0B0926' : 'transparent transparent',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
              {/* Create Collection Button - Always First */}
              <button
                type="button"
                onClick={() => setIsCreateCollectionModalOpen(true)}
                className={`group flex h-[120px] sm:h-[150px] w-full flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed transition-all duration-300 ${selectedCollection === "create-new"
                    ? "border-[#6C4DFF] text-white bg-[#120D39]"
                    : "border-[#2A2F4A] text-[#9BA3AF] hover:border-[#6C4DFF] hover:text-white"
                  }`}
              >
                <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#6C4DFF]/10 text-[#6C4DFF] mb-2 sm:mb-3 group-hover:bg-[#6C4DFF]/20">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span className="text-xs sm:text-sm font-semibold">Create Collection</span>
              </button>

              {/* Collections List */}
              {isLoadingCollections ? (
                <div className="col-span-2 text-center py-8">
                  <p className="text-[#9BA3AF]">Loading collections...</p>
                </div>
              ) : collections.length > 0 ? (
                collections.map((collection) => {
                  const collectionId = collection._id || collection.collectionId || collection.id
                  const isSelected = selectedCollection === collectionId
                  const collectionImage = collection.imageUrl || collection.coverPhoto || collectionOneImage
                  const collectionName = collection.collectionName || collection.name || "Unnamed Collection"
                  const itemCount = collection.totalCollectionNfts || collection.totalNfts || 0
                  
                  const handleCollectionClick = () => {
                    if (isSelected) {
                      // If already selected, deselect it
                      setSelectedCollection("")
                    } else {
                      // Select this collection
                      setSelectedCollection(collectionId)
                    }
                  }

                  const handleDeselectClick = (e: React.MouseEvent) => {
                    e.stopPropagation() // Prevent triggering the button click
                    setSelectedCollection("")
                  }
                  
                return (
                  <button
                      key={collectionId}
                    type="button"
                      onClick={handleCollectionClick}
                      className={`group relative flex h-full overflow-hidden rounded-2xl duration-300 border-2 ${
                        isSelected
                          ? "border-[#6C4DFF] shadow-[0_12px_30px_rgba(108,77,255,0.35)]"
                          : "border-transparent hover:border-[#6C4DFF]/60"
                      }`}
                    >
                      <div className="relative h-[120px] sm:h-[160px] w-full rounded-xl sm:rounded-2xl">
                      <Image
                          src={collectionImage}
                          alt={collectionName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 800px) 100vw, 33vw"
                          onError={(e) => {
                            // Fallback to default image if API image fails to load
                            e.currentTarget.src = collectionOneImage.src
                          }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0729]/20 to-[#0B0729]/90 opacity-90 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Cross Icon - Only show when selected */}
                        {isSelected && (
              <button
                type="button"
                            onClick={handleDeselectClick}
                            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#6C4DFF] text-white shadow-lg transition-all duration-200 hover:bg-[#5A21FF] hover:scale-110 active:scale-95"
                            aria-label="Deselect collection"
                          >
                            <X className="h-4 w-4" />
              </button>
                        )}
                        
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                          <p className="text-white text-sm sm:text-base font-semibold truncate">{collectionName}</p>
                          <p className="text-[10px] sm:text-xs text-[#C5C9FF]/80">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-[#9BA3AF]">No collections found. Create your first collection!</p>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Post To Feed */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-sm sm:text-base font-semibold mb-1">Post To Feed</h3>
                  <p className="text-[#9BA3AF] text-xs sm:text-sm">Item will display in Feed</p>
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
                  <h3 className="text-white text-sm sm:text-base font-semibold mb-1">Free Minting</h3>
                  <p className="text-[#9BA3AF] text-xs sm:text-sm">Buyer will pay gas fees for minting</p>
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
                  <h3 className="text-white text-sm sm:text-base font-semibold mb-1">Put on marketplace</h3>
                  <p className="text-[#9BA3AF] text-xs sm:text-sm">You'll receive bids on this item</p>
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
                  <h3 className="text-white text-sm sm:text-base font-semibold mb-1">Unlock once purchased</h3>
                  <p className="text-[#9BA3AF] text-xs sm:text-sm">Content will be unlocked after successful transaction</p>
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

      {/* Create Collection Modal */}
      <Modal
        open={isCreateCollectionModalOpen}
        onCancel={handleCloseCollectionModal}
        footer={null}
        centered
        width={600}
        className="create-collection-modal"
        styles={{
          content: {
            background: '#0B0926',
            borderRadius: '16px',
            border: '1px solid #6B7280',
            padding: '24px',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#5A21FF] to-[#7E6BEF] bg-clip-text text-transparent">
            Collection
          </h2>

          {/* Upload File Section */}
          <div>
            <div
              onDragOver={handleCollectionDragOver}
              onDrop={handleCollectionDrop}
              className="border-2 border-dashed border-[#6B7280] rounded-xl p-12 bg-[#020019] text-center cursor-pointer hover:border-[#5A21FF] transition-colors"
              onClick={() => collectionFileInputRef.current?.click()}
            >
              {collectionPreviewUrl ? (
                <div className="relative">
                  <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden mb-4">
                    <Image
                      src={collectionPreviewUrl}
                      alt="Collection preview"
                      width={400}
                      height={200}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveCollectionFile()
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <CloudUpload className="w-16 h-16 text-[#9BA3AF]" />
                  </div>
                  <p className="text-[#9BA3AF] text-base mb-2">Drag and Drop or Choose File</p>
                  <p className="text-[#6B7280] text-sm">(PNG, Jpeg, jpg; Max: 500MB)</p>
                </>
              )}
              <input
                ref={collectionFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleCollectionFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="text-[#9BA3AF] text-sm mb-2 block">Display Name</label>
            <Input
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="!bg-[#0B0926] !border-[#6B7280] !text-white !h-12 !rounded-xl placeholder:!text-[#6B7280]"
            />
          </div>

          {/* Symbol */}
          <div>
            <label className="text-[#9BA3AF] text-sm mb-2 block">Symbol</label>
            <Input
              placeholder="Enter Token Symbol"
              value={tokenSymbol}
              onChange={handleTokenSymbolChange}
              className={`!bg-[#0B0926] !text-white !h-12 !rounded-xl placeholder:!text-[#6B7280] ${
                symbolError 
                  ? "!border-red-500" 
                  : "!border-[#6B7280]"
              }`}
              status={symbolError ? "error" : undefined}
            />
            {symbolError && (
              <div className="mt-1">
                <p className="text-red-500 text-sm">{symbolError}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[#9BA3AF] text-sm mb-2 block">Description</label>
            <TextArea
              placeholder="Write down description"
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              rows={4}
              className="!bg-[#0B0926] !border-[#6B7280] !text-white !rounded-xl placeholder:!text-[#6B7280]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleCloseCollectionModal}
              className="!flex-1 !h-12 !bg-transparent !border-[#6B7280] !text-white !rounded-xl hover:!bg-[#1a1a2e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              className="!flex-1 !h-12 !bg-gradient-to-r !from-[#5A21FF] !to-[#7E6BEF] !border-none !text-white !rounded-xl hover:!opacity-90 !font-semibold"
            >
              Create Collection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}