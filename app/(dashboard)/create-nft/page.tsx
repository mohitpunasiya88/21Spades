
"use client"

import { useState, useRef, useEffect } from "react"
import { Button, Input, Upload, Select, Switch, InputNumber, Modal, DatePicker } from "antd"
import { useMessage } from "@/lib/hooks/useMessage"
import dayjs, { Dayjs } from "dayjs"
import { Upload as UploadIcon, X, Plus, CloudUpload, Calendar } from "lucide-react"
import Image from "next/image"
import { useAuthStore } from "@/lib/store/authStore"
import { useMarketDataStore } from "@/lib/store/authStore"
import { apiCaller } from "@/app/interceptors/apicall/apicall"
import authRoutes from "@/lib/routes"
import tigercarImage from "@/components/assets/tigercar.jpg"
import collectionOneImage from "@/components/assets/image21.png"
import collectionTwoImage from "@/components/assets/image22.png"
import spadesImage from "@/components/assets/Spades-image-21.png"
import spadesImageRight from "@/components/assets/Spades-left-Right.png"
import { useWallet } from "@/app/hooks/useWallet"
import { useNFTFactory } from "@/app/hooks/contracts/useNFTFactory"
import { useNFTCollection } from "@/app/hooks/contracts/useNFTCollection"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useContract } from "@/app/hooks/contracts/useContract"

const { TextArea } = Input

export default function CreateNFTPage() {
  const { user } = useAuthStore()
  const {address } = useWallet();
  const { message } = useMessage()
  const { ready, authenticated, createWallet, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const { getCoinPrice, coinAmount } = useMarketDataStore()
  const [selectedMethod, setSelectedMethod] = useState("Fixed Rate")
  const [title, setTitle] = useState("test")
  const [description, setDescription] = useState("test")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fixedPrice, setFixedPrice] = useState<number | null>(0.002 )
  const [size, setSize] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [royalties, setRoyalties] = useState<number | null>(50)
  const [redeemCode, setRedeemCode] = useState<string>("")
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [selectedCollectionAddress, setSelectedCollectionAddress] = useState<string>("") // I need this to pass the collection address to the mint function you can addujset thise by manage in backend


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

  const { getEventFromTx } = useContract()

  // Collections state
  const [collections, setCollections] = useState<any[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)

  // Fetch collections from API
  const fetchCollections = async () => {
    try {
      setIsLoadingCollections(true)
      const walletAddress = address|| ""

      // Build query params
      const queryParams = new URLSearchParams()
      if (walletAddress) {
        queryParams.append('walletAddress', walletAddress)
      }
      
      queryParams.append('page', '1')
      queryParams.append('limit', '100')
      queryParams.append('blocked', 'false')

      const url = `${authRoutes.getCollections}?${queryParams.toString()}`

      const response = await apiCaller('GET', url, null, true)

      if (response.success && response.data) {
        // Handle both array and object with collections property
        const collectionsData = Array.isArray(response.data)
          ? response.data
          : (response.data.collections || response.data.data || [])
        setCollections(collectionsData)
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
    // Validation
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
    if (!selectedCollection) {
      message.error("Please select or create a collection")
      return
    }
    if ((fixedPrice === null || fixedPrice === undefined) && selectedMethod !== "Open For Bids") {
      message.error("Please enter a fixed price")
      return
    }
    if (selectedMethod === "Time Auction" && !expirationDate) {
      message.error("Please select an expiration date")
      return
    }

    // Hardcoded wallet address for testing
    const walletAddress = address
    // if (!walletAddress) {
    //   message.error("Wallet address not found. Please connect your wallet.")
    //   return
    // }


    let loadingMessage: any = null
    try {

      // Convert file to base64 data URL
      const fileToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      const imageUrl = await fileToDataURL(uploadedFile)

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

      loadingMessage = message.loading("Creating NFT...", 0)
      try {
        /// fix the token URL we need url of pinata i
        const response = await mint({
          to: address as string,
          tokenURI:  "test/pinata", //payload.imageUrl,
          royalty: payload.royalty,
        },selectedCollectionAddress)

        payload.nftId = Number(response[0].args.tokenId).toString()
       
       
       debugger;
        console.log("📡 Response success:", response)
        console.log("📡 Response data tokenId:", response[0].args.tokenId)
      } catch (error) {
        console.error("❌ Error creating NFT:", error)
      }


      const apiUrl = authRoutes.createNFT

      const response = await apiCaller('POST', apiUrl, payload, true)

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


  const {
    createCollection,
    setMintableAddress: setMintableAddressContract,
    getAllCollection,
    getUserCollection,
    getMintableAddress,
    isLoading,
    error,
  } = useNFTFactory();
  
  const {mint} = useNFTCollection();

  const [collectionParams, setCollectionParams] = useState({
    name: '',
    symbol: '',
    contractURI: '',
    tokenURIPrefix: '',
    royaltyLimit: 100,
  });

  const handleCreateCollection = async () => {
    console.log("🚀 handleCreateCollection called")

    // Check if Privy is ready
    // if (!ready) {
    //   message.info("Please wait, wallet is initializing...");
    //   return;
    // }

    // // Check if user is authenticated
    // if (!authenticated) {
    //   message.info("Please login first");
    //   login();
    //   return;
    // }

    // Check if embedded wallet exists
    let embeddedWallet = wallets.find((w: any) => w.walletClientType === 'privy');
    if (!embeddedWallet) {
      const hideLoading = message.loading("Creating your wallet...", 0);
      try {
        await createWallet();
        hideLoading();
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
    let collectionAddress = ""

    try {
      const result = await createCollection({
        name: collectionParams.name,
        symbol: collectionParams.symbol,
        contractURI: collectionParams.contractURI,
        tokenURIPrefix: collectionParams.tokenURIPrefix,
        royaltyLimit: collectionParams.royaltyLimit,
      });
      const events = await getEventFromTx(
      'ERC721Factory', result as any, 'CollectionCreated', 11155111, "",
    );
   


    
     


      message.success("Collection created successfully!");
      console.log("✅ Collection created:", events[0].args.collection);
      collectionAddress = events[0].args.collection;
      

      // events[0].args.collection save this in db these is need for create the NFT

    // todo save the collection address in db these is need for create the NFT
    // todo save this address via event listener via backend websocket event listener in collecttion api 
      

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

      // Convert file to base64 data URL (temporary solution - replace with actual file upload endpoint if available)
      const fileToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      const imageUrl = await fileToDataURL(collectionFile)

      // Generate slug from token symbol (not display name)
      const collectionSlug = tokenSymbol
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Prepare payload according to API schema
      const payload = {
        // walletAddress: walletAddress,
        walletAddress: address,
        collectionAddress: collectionAddress,
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

      const collectionLoadingMessage = message.loading("Creating collection...", 0)

      // Call API
      const response = await apiCaller('POST', authRoutes.createCollection, payload, true)

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

      } else {
        console.error("❌ API returned success: false", response)

        // Check if error is related to slug - check multiple possible fields
        const errorMessage = response.message || response.error || response.data?.message || response.data?.error || ""

        // More comprehensive slug error detection
        const lowerErrorMessage = errorMessage.toLowerCase()
        if (
          lowerErrorMessage.includes("slug") ||
          lowerErrorMessage.includes("collection slug") ||
          lowerErrorMessage.includes("already exists") ||
          lowerErrorMessage.includes("unique slug")
        ) {
          setSymbolError(errorMessage)
        } else {
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


      // More comprehensive slug error detection
      const lowerErrorMessage = errorMessage.toLowerCase()
      if (
        lowerErrorMessage.includes("slug") ||
        lowerErrorMessage.includes("collection slug") ||
        lowerErrorMessage.includes("already exists") ||
        lowerErrorMessage.includes("unique slug")
      ) {
        setSymbolError(errorMessage)
      } else {
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
    <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-4 mt-4 sm:mt-6 md:mt-8 mx-2 sm:mx-4 bg-[#090721] font-exo2 min-h-screen rounded-xl">
      {/* Banner */}
      <div className="relative rounded-xl  overflow-hidden bg-gradient-to-r from-[#4F01E6] to-[#020019] h-[120px] md:h-[160px]">
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

      <div className="">
        {/* Upload File */}
        <div className="p-4 sm:p-6">
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-2">Upload File</h2>
          <p className="text-[#9BA3AF] text-xs sm:text-sm mb-3 sm:mb-4">File type supported PNG, GIF,WEBP,MP3,MP4 ; (MAX500MB)</p>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 w-full sm:w-[70%] md:w-[50%] border-dashed border-[#2A2F4A] rounded-xl p-6 sm:p-8 md:p-12 bg-[#0B0926] text-center cursor-pointer hover:border-[#5A21FF] transition-colors"
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

        {/* Title */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">
            Title
          </h2>
          <Input
            placeholder="e.g: Crypto Hunks"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="!bg-[#090721]  !border-[#A3AED033] !font-exo2 !text-white !h-12 !rounded-lg placeholder:!text-[#6B7280]"
          />
        </div>

        {/* Description */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">
            Description
          </h2>
          <TextArea
            placeholder="e.g: This is very limited item"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="!bg-[#090721] !border-[#A3AED033] !font-exo2 !text-white !rounded-lg placeholder:!text-[#6B7280] sm:!min-h-[120px]"
          />
        </div>

        {/* Size (Instead) */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">
            Size (Instead)
          </h2>
          <Input
            placeholder="e.g: Width x height"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="!bg-[#090721] !border-[#A3AED033] !font-exo2 !text-white !h-12 !rounded-lg placeholder:!text-[#6B7280]"
          />
        </div>

        {/* Category */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">Category</h2>
          <Select
            placeholder="Select Category"
            value={category || undefined}
            onChange={(v) => setCategory(v)}
            className="!w-full category-select [&_.ant-select-selector]:!bg-[#090721] [&_.ant-select-selector]:!border-[#A3AED033] [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selection-placeholder]:!text-[#6B7280] [&_.ant-select-selection-item]:!text-white [&_.ant-select-arrow]:!text-white"
            popupClassName="category-select-dropdown"
            suffixIcon={<span className="text-white">▼</span>}
            options={categories.map((c) => ({ label: c, value: c }))}
            getPopupContainer={(trigger) => trigger.parentElement || document.body}
          />
        </div>

        {/* Royalties */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">Royalties</h2>
          <div className="relative">
            <InputNumber
              value={royalties as number | null}
              onChange={(v) => setRoyalties(typeof v === "number" ? v : null)}
              placeholder="Maximum is 50%"
              className="!w-full !h-12 !bg-[#090721] !border-[#A3AED033] !font-exo2 !text-white !rounded-lg [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input]:!placeholder:text-[#6B7280] [&_.ant-input-number-input]:!pr-8"
              min={0}
              max={50}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm">%</span>
          </div>
        </div>

        {/* Redeem Code */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">
            Redeem Code
          </h2>
          <Input
            placeholder="Enter direct key or code to redeem or link to the file"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            className="!bg-[#090721] !border-[#A3AED033] !font-exo2 !text-white !h-12 !rounded-lg placeholder:!text-[#6B7280]"
          />
        </div>

        {/* Select Method */}
        <div className="p-4 sm:p-6 font-exo2 w-full sm:w-[70%] md:w-[50%] lg:w-[40%]">
          <h2 className="text-white text-sm font-medium mb-3">
            Select Method
          </h2>
          <div className="flex gap-3 sm:gap-5">
            <button
              onClick={() => setSelectedMethod("Fixed Rate")}
              className={`flex-1 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedMethod === "Fixed Rate"
                  ? "bg-white text-[#090721]"
                  : "bg-transparent text-white border border-[#A3AED033] hover:border-white"
              }`}
            >
              Fixed Rate
            </button>
            <button
              onClick={() => setSelectedMethod("Time Auction")}
              className={`flex-1 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedMethod === "Time Auction"
                  ? "bg-white text-[#090721]"
                  : "bg-transparent text-white border border-[#A3AED033] hover:border-white"
              }`}
            >
              Auction
            </button>
          </div>
        </div>

        {/* Price (Avax) */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">
            Price (Avax)
          </h2>
          <div className="relative">
            <InputNumber
              value={fixedPrice !== null && fixedPrice !== undefined ? fixedPrice : undefined}
              onChange={(v) => {
                if (v === null || v === undefined) {
                  return
                }
                const numValue = typeof v === "number" ? v : parseFloat(String(v))
                if (!isNaN(numValue) && numValue >= 0) {
                  setFixedPrice(numValue)
                  lastValidFixedPriceRef.current = numValue
                }
              }}
              onBlur={() => {
                if (fixedPrice !== null && fixedPrice !== undefined) {
                  lastValidFixedPriceRef.current = fixedPrice
                }
              }}
              placeholder="Enter the price"
              className="!w-full !h-12 !bg-[#090721] !border-[#A3AED033] !font-exo2 !text-white !rounded-lg [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input::placeholder]:!text-[#6B7280] [&_.ant-input-number-input]:!pr-16"
              min={0}
              precision={2}
              controls={false}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">USDC</span>
          </div>
        </div>

        {/* Time Auction Date Fields */}
        {selectedMethod === "Time Auction" && (
          <div className="p-4 sm:p-6 font-exo2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Starting Date */}
              <div>
                <h2 className="text-white text-sm font-medium mb-2">Starting Date</h2>
                <DatePicker
                  value={startingDate}
                  onChange={(date) => setStartingDate(date)}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day')
                  }}
                  format="DD/MM/YYYY"
                  placeholder="Select starting date"
                  className="!w-full !h-12 [&_.ant-picker-input]:!bg-[#090721] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input]:!font-exo2 [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#090721] !border-[#A3AED033] !rounded-lg [&_.ant-picker-suffix]:!text-white"
                  popupClassName="[&_.ant-picker-dropdown]:!bg-[#090721] [&_.ant-picker-panel]:!bg-[#090721] [&_.ant-picker-header]:!bg-[#090721] [&_.ant-picker-header]:!border-[#A3AED033] [&_.ant-picker-content]:!bg-[#090721] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF]"
                  suffixIcon={<Calendar className="h-4 w-4 text-white" />}
                  getPopupContainer={(trigger) => trigger.parentElement || document.body}
                />
              </div>

              {/* Expiration Date */}
              <div>
                <h2 className="text-white text-sm font-medium mb-2">Expiration Date</h2>
                <DatePicker
                  value={expirationDate}
                  onChange={(date) => setExpirationDate(date)}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day')
                  }}
                  format="DD/MM/YYYY"
                  placeholder="Select ending date"
                  className="!w-full !h-12 [&_.ant-picker-input]:!bg-[#090721] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input]:!font-exo2 [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#090721] !border-[#A3AED033] !rounded-lg [&_.ant-picker-suffix]:!text-white"
                  popupClassName="[&_.ant-picker-dropdown]:!bg-[#090721] [&_.ant-picker-panel]:!bg-[#090721] [&_.ant-picker-header]:!bg-[#090721] [&_.ant-picker-header]:!border-[#A3AED033] [&_.ant-picker-content]:!bg-[#090721] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF]"
                  suffixIcon={<Calendar className="h-4 w-4 text-white" />}
                  getPopupContainer={(trigger) => trigger.parentElement || document.body}
                />
              </div>
            </div>
          </div>
        )}

       

        {/* Toggle Options */}
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Post To Feed */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-sm sm:text-base font-[400] mb-1">Post To Feed</h3>
                <p className="text-[#A3AED0] text-xs sm:text-sm">Item will display in Feed</p>
              </div>
              <Switch
                checked={postToFeed}
                onChange={setPostToFeed}
                className="[&.ant-switch-checked]:!bg-[#4E00E5]"
                style={{
                  backgroundColor: postToFeed ? '#4E00E5' : undefined
                }}
              />
            </div>

            {/* Free Minting */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-sm sm:text-base font-[400] mb-1">Free Minting</h3>
                <p className="text-[#A3AED0] text-xs sm:text-sm">Buyer will pay gas fees for minting</p>
              </div>
              <Switch
                checked={freeMinting}
                onChange={setFreeMinting}
                className="[&_.ant-switch-checked]:!bg-[#4E00E5]"
                style={{
                  backgroundColor: freeMinting ? '#4E00E5' : undefined
                }}
              />
            </div>

            {/* Put on marketplace */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-sm sm:text-base font-[400] mb-1">Put on marketplace</h3>
                <p className="text-[#A3AED0] text-xs sm:text-sm">You'll receive bids on this item</p>
              </div>
              <Switch
                checked={putOnMarketplace}
                onChange={setPutOnMarketplace}
                className="[&_.ant-switch-checked]:!bg-[#4E00E5]"
                style={{
                  backgroundColor: putOnMarketplace ? '#4E00E5' : undefined
                }}
              />
            </div>

            {/* Unlock once purchased */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-sm sm:text-base font-[400] mb-1">Unlock once purchased</h3>
                <p className="text-[#A3AED0] text-xs sm:text-sm">Content will be unlocked after successful transaction</p>
              </div>
              <Switch
                checked={unlockOncePurchased}
                onChange={setUnlockOncePurchased}
                className="[&_.ant-switch-checked]:!bg-[#4E00E5]"
                style={{
                  backgroundColor: unlockOncePurchased ? '#4E00E5' : undefined
                }}
              />
            </div>
          </div>
        </div>
      </div>

       {/* Choose/Create Collection */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">Collection</h2>
          <p className="text-[#A3AED0] text-xs mb-4">Choose an existing collection or create a new one.</p>

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
                  : "border-[#2A2F4A] text-[#A3AED0] hover:border-[#6C4DFF] hover:text-white"
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
                  <p className="text-[#A3AED0]">Loading collections...</p>
                </div>
              ) : collections.length > 0 ? (
                collections.map((collection) => {
                  const collectionId = collection._id || collection.collectionId || collection.id
                  const collectionAddress = collection.collectionAddress 
                  const isSelected = selectedCollection === collectionId
                  const collectionImage = collection.imageUrl || collection.coverPhoto || collectionOneImage
                  const collectionName = collection.collectionName || collection.name || "Unnamed Collection"
                 
                  const itemCount = collection.totalCollectionNfts || collection.totalNfts || 0
                 
                  const handleCollectionClick = () => {
                    if (isSelected) {
                      // If already selected, deselect it
                      setSelectedCollection("")
                      setSelectedCollectionAddress("")
                    } else {
                      // Select this collection
                      setSelectedCollection(collectionId)
                      setSelectedCollectionAddress(collectionAddress)
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
                      className={`group relative flex h-full overflow-hidden rounded-2xl duration-300 border-2 ${isSelected
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

      {/* Create Item Button */}
      <div className="p-4 sm:p-6 font-exo2">
        <Button
          onClick={handleCreateItem}
          className="!w-full !h-12 font-exo2 !bg-gradient-to-b !from-[#4F01E6] !to-[#25016E] !border-none !text-white !rounded-full !text-base !font-semibold hover:!opacity-90 transition-opacity"
        >
          Create Item
        </Button>
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
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-b from-[#5A21FF] to-[#7E6BEF] bg-clip-text text-transparent">
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
              className={`!bg-[#0B0926] !text-white !h-12 !rounded-xl placeholder:!text-[#6B7280] ${symbolError
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