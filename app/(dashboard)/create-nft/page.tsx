"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button, Input, Upload, Select, Switch, InputNumber, Modal, DatePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Upload as UploadIcon, X, Plus, CloudUpload, Calendar, Signature } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthStore, useCategoriesStore, useMarketDataStore } from "@/lib/store/authStore"
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
import { useMarketplace } from "@/app/hooks/contracts/useMarketplace"
import { useMessage } from "@/lib/hooks/useMessage"
import { ethers } from "ethers"
import { CONTRACTS } from "@/app/utils/contracts/contractConfig"
import { logWalletActivity } from "@/lib/utils/logWalletActivity"

const { TextArea } = Input

export default function CreateNFTPage() {
const { user } = useAuthStore()
  const {address, chainId } = useWallet();
  const { message } = useMessage()
  const router = useRouter()
  const { ready, authenticated, createWallet, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const { getCoinPrice, coinAmount } = useMarketDataStore()
  const { categories: categoryEntities, getCategories, isLoading: categoriesLoading } = useCategoriesStore()
  const [selectedMethod, setSelectedMethod] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fixedPrice, setFixedPrice] = useState<string>("")
  const [size, setSize] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [royalties, setRoyalties] = useState<number | null>(null)
  const [redeemCode, setRedeemCode] = useState<string>("")
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [selectedCollectionAddress, setSelectedCollectionAddress] = useState<string>("") // I need this to pass the collection address to the mint function you can addujset thise by manage in backend
  const [isCreatingNFT, setIsCreatingNFT] = useState<boolean>(false)
  const resolvedChainId = chainId ?? Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? '11155111')

  const [postToFeed, setPostToFeed] = useState<boolean>(true)
  const [freeMinting, setFreeMinting] = useState<boolean>(false)
  const [putOnMarketplace, setPutOnMarketplace] = useState<boolean>(true)
  const [unlockOncePurchased, setUnlockOncePurchased] = useState<boolean>(false)
  // Time Auction date fields
  const [startingDate, setStartingDate] = useState<Dayjs | null>(null)
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastValidFixedPriceRef = useRef<string>("")

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

      // Fetch both user collections and system collection in parallel
      const [userCollectionsResponse, systemCollectionResponse] = await Promise.all([
        apiCaller('GET', url, null, true),
        apiCaller('GET', authRoutes.getSystemCollection, null, true).catch(() => null) // Don't fail if system collection doesn't exist
      ])

      const allCollections: any[] = []

      // Add system collection first (if available)
      if (systemCollectionResponse?.success && systemCollectionResponse?.data) {
        const systemCollection = systemCollectionResponse.data.collection || systemCollectionResponse.data
        if (systemCollection) {
          allCollections.push(systemCollection)
        }
      }

      // Add user collections
      if (userCollectionsResponse.success && userCollectionsResponse.data) {
        // Handle both array and object with collections property
        const collectionsData = Array.isArray(userCollectionsResponse.data)
          ? userCollectionsResponse.data
          : (userCollectionsResponse.data.collections || userCollectionsResponse.data.data || [])
        allCollections.push(...collectionsData)
      }

      setCollections(allCollections)
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

  useEffect(() => {
    if (!categoryEntities.length) {
      void getCategories()
    }
  }, [categoryEntities.length, getCategories])

  const categoryOptions = useMemo(() => {
    return categoryEntities
      .filter((cat: any) => cat?.isActive !== false)
      .map((cat: any) => ({
        id: cat?._id || cat?.id || cat?.categoryId || cat?.slug || cat?.name || '',
        label: cat?.name || cat?.categoryName || 'Untitled Category',
        raw: cat,
      }))
      .filter((item) => item.id)
  }, [categoryEntities])

  const selectedCategoryMeta = useMemo(() => {
    return categoryOptions.find((option) => option.id === category)?.raw
  }, [categoryOptions, category])

  const convertedUsdtValue = useMemo(() => {
    const avaxValue = parseFloat(fixedPrice)
    const avaxRate = Number(coinAmount)

    if (!fixedPrice || isNaN(avaxValue) || !avaxRate) {
      return ""
    }

    return (avaxValue * avaxRate).toFixed(2)
  }, [fixedPrice, coinAmount])

  const getImageDimensions = (file: File): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(null)
        return
      }

      const img = document.createElement('img')
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }

      img.src = url
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Get image dimensions if it's an image
      if (file.type.startsWith("image/")) {
        const dimensions = await getImageDimensions(file)
        if (dimensions) {
          setSize(`${dimensions.width} x ${dimensions.height}`)
        } else {
          setSize("")
        }
      } else {
        // For non-image files, clear the size
        setSize("")
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
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

      // Get image dimensions if it's an image
      if (file.type.startsWith("image/")) {
        const dimensions = await getImageDimensions(file)
        if (dimensions) {
          setSize(`${dimensions.width} x ${dimensions.height}`)
        } else {
          setSize("")
        }
      } else {
        // For non-image files, clear the size
        setSize("")
      }
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

  const { mint, setApprovalForAll, isApproved } = useNFTCollection();
  const {createPutOnSaleSignature, auctionNonceStatus} = useMarketplace();
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
    if (!selectedCollectionAddress) {
      message.error("Selected collection address is missing. Please reselect the collection.")
      return
    }
    if ((!fixedPrice || fixedPrice.trim() === "") && selectedMethod === "Fixed Rate") {
      message.error("Please enter a fixed price")
      return
    }
    if (selectedMethod === "Time Auction") {
      if (!startingDate) {
        message.error("Please select a starting date and time")
        return
      }
      if (!expirationDate) {
        message.error("Please select an expiration date and time")
        return
      }
      if (expirationDate.isBefore(startingDate) || expirationDate.isSame(startingDate)) {
        message.error("Expiration date and time must be after starting date and time")
        return
      }
    }

    // Hardcoded wallet address for testing
    const walletAddress = address
    if (!walletAddress) {
      message.error("Wallet address not found. Please connect your wallet.")
      return
    }

    setIsCreatingNFT(true)
    let loadingMessage: any = null
    try {
      // loadingMessage = message.loading("Creating NFT...", 0)
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

      // Map auction type based on selected method
      let auctionType = 0 // Default: None/Not Selected
      if (selectedMethod === "Fixed Rate") {
        auctionType = 1
      } else if (selectedMethod === "Time Auction") {
        auctionType = 2
      }

      // Calculate starting and ending times
      let startingTime: string | undefined
      let endingTime: string | undefined

      if (selectedMethod === "Time Auction") {
        if (startingDate) {
          startingTime = Math.floor(startingDate.toDate().getTime() / 1000).toString()
        }
        if (expirationDate) {
          endingTime = Math.floor(expirationDate.toDate().getTime() / 1000).toString()
        }
      }

      // Calculate total days for auction (if Time Auction)
      const totalDays = selectedMethod === "Time Auction" && expirationDate
        ? Math.ceil((expirationDate.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0

      // Prepare payload according to API schema
      let payload: any = {
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
        price: fixedPrice ? parseFloat(fixedPrice) || 0 : 0,
        totalDays: totalDays,
        putOnSale: putOnMarketplace ? 1 : 0,
        hashCode: "", // Will be generated by backend
        categoryId: selectedCategoryMeta?._id || selectedCategoryMeta?.id || category || "",
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
        subCategory: selectedCategoryMeta?.name || selectedCategoryMeta?.categoryName || category || "",
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

      try {
        /// fix the token URL we need url of pinata i
        const response = await mint({
          to: address as string,
          tokenURI:  "test/pinata", //payload.imageUrl,
          royalty: payload.royalty,
        },selectedCollectionAddress)
const idsssss = Number(response[0].args.tokenId).toString()
        payload.nftId = Number(response[0].args.tokenId).toString()
        const mintTxHash = Array.isArray(response) ? response[0]?.transactionHash : undefined
        await logWalletActivity({
          walletAddress,
          hash: mintTxHash,
          chainId: resolvedChainId,
        })
      } catch (error) {
        console.error("❌ Error creating NFT:", error)
        throw error
      }

      // Ensure marketplace approval for this collection before minting / API call
      const marketplaceAddress = CONTRACTS.ERC721Marketplace.address
      try {
        const hasApproval = await isApproved(walletAddress, marketplaceAddress, selectedCollectionAddress)
        if (!hasApproval) {
          await setApprovalForAll(marketplaceAddress, true, selectedCollectionAddress)
        }
      } catch (approvalError) {
        console.error("❌ Error while ensuring marketplace approval:", approvalError)
        message.error("Failed to set marketplace approval. Please try again.")
        return
      }

      
     //todo
      /// list nft for sale (exppected a sale model at backend to store the sale details)

       // we need to get the nonce from the counter of sales or number of sales from backend like i put nft on sale once
      //  so the nonce will be 1+previous nonce then for next sale it will be 2+previous nonce and so on create nonce api in backend get_nonce_from_api, 
      //  and pass the nonce to the salePayload
      // In cotract we have diffent type of nonce for sale and auction (so create 3 different api for each type of nonce 
      // 1. lazyMintNonceStatus
      // 2. auctionNonceStatus // cuurent I am using this for sale
      // 3. isOfferNonceProcessed)
       //await get_nonce_from_api()
  let isValid = true;
let nonceResponse = null;

while (isValid) {
  // GET API call
  nonceResponse = await apiCaller('GET', `${authRoutes.getNonce}`, null, true);

  // Validate nonce
  isValid = await auctionNonceStatus(nonceResponse.data.nonce);

  // If still invalid → again call GET
  if (isValid) {
    await new Promise(res => setTimeout(res, 500)); // optional: 0.5s delay
  }
}
payload.nonce = nonceResponse.data.nonce; 
      if(payload.putOnSale && payload.nftId){
      // Use the exact string value to avoid scientific notation issues
      const priceString = fixedPrice && fixedPrice.trim() !== "" ? fixedPrice : "0"
      
      const salePayload = {
        tokenId: payload.nftId, // this is the token id of the nft
        erc721: selectedCollectionAddress, // this is the erc721 collection address of the nft
        priceEth: priceString, // Use exact string value to preserve precision (no scientific notation)
        nonce: nonceResponse.data.nonce, // get nonce by hook of useMarketplace
        erc20Token: payload.erc20Token || "0x0000000000000000000000000000000000000000", // 0x0000000000000000000000000000000000000000 for native token or erc20 token address 
        auctionType: payload.auctionType, // 1 (Fixed Price) for fixed price, 2 (Auction) for auction 
        startingTime: payload.startingTime, // this is the starting time  of the nft Auction type 2 sale in seconds
        endingTime: payload.endingTime, // this is the ending time of the nft Auction type 2 sale in seconds
        sign: "", // this is the signature of the sale which will be generate in next step
      }
   payload.erc20Token = salePayload.erc20Token;
   

      /// generate signature for sale
      try {
      
        if(payload.auctionType === 1){
       const signature = await createPutOnSaleSignature(
      BigInt(salePayload.tokenId),
      salePayload.erc721,
      ethers.parseEther(salePayload.priceEth),
      BigInt(nonceResponse.data.nonce),
      salePayload.erc20Token,
      payload.auctionType,
      BigInt(0),
      BigInt(0),

    );
    salePayload.sign = signature.signature;

    payload.signature = signature.signature;
    }else if(payload.auctionType === 2 && payload.endingTime && payload.startingTime){
      const signature = await createPutOnSaleSignature(
      BigInt(salePayload.tokenId),
      salePayload.erc721,
      ethers.parseEther(salePayload.priceEth),
      BigInt(`${nonceResponse.data.nonce}`),
      salePayload.erc20Token,
      payload.auctionType,
      BigInt(payload.startingTime),
      BigInt(payload.endingTime),

    );
    salePayload.sign = signature.signature;
    payload.signature = signature.signature;
    payload.erc20Token = salePayload.erc20Token;

    }
      } catch (error) {
        console.error("❌ Error creating sale:", error)
        throw error
      }
   

      //todo send salePayload to backend
      // const saleApiUrl = authRoutes.createSale
      // const saleResponse = await apiCaller('POST', saleApiUrl, salePayload, true)
 }

      const apiUrl = authRoutes.createNFT
     

      const response = await apiCaller('POST', apiUrl, payload, true)

      if (loadingMessage) {
        message.destroy(loadingMessage as any)
      }

      if (response.success) {
        message.success(response.message || "NFT created successfully!")
        router.push("/marketplace")

        // Reset form completely
        setUploadedFile(null)
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
        setTitle("")
        setDescription("")
        setFixedPrice("")
        setSize("")
        setCategory("")
        setRoyalties(null)
        setRedeemCode("")
        setSelectedCollection("")
        setSelectedCollectionAddress("")
        setPostToFeed(true)
        setFreeMinting(false)
        setPutOnMarketplace(true)
        setUnlockOncePurchased(false)
        setStartingDate(null)
        setExpirationDate(null)
        setSelectedMethod("")

        // Clear file input
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
      let friendlyMessage = error?.response?.data?.message || error?.reason || error?.shortMessage || error?.message || "An error occurred"
      if (
        (error?.code === 'CALL_EXCEPTION' && (error?.action === 'estimateGas' || /estimateGas/i.test(error?.message))) ||
        /missing revert data/i.test(error?.message || '')
      ) {
        friendlyMessage = "Transaction simulation failed. It would likely revert. Please check your inputs (price, timings, nonce), selected collection, and network, then try again."
      }
      message.error(friendlyMessage)
    } finally {
      setIsCreatingNFT(false)
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
  
  

  const [collectionParams, setCollectionParams] = useState({
    name: '',
    symbol: '',
    contractURI: '',
    tokenURIPrefix: '',
    royaltyLimit: 100,
  });

  const handleCreateCollection = async () => {

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
      await logWalletActivity({
        walletAddress: address,
        hash: result?.hash,
        chainId: resolvedChainId,
      })


    
     


      message.success("Collection created successfully!");
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

      // const collectionLoadingMessage = message.loading("Creating collection...", 0)

      // Call API
      const response = await apiCaller('POST', authRoutes.createCollection, payload, true)

      // Destroy loading message
      // message.destroy(collectionLoadingMessage as any)

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

  const checkSymbolAvailability = async (symbol: string) => {
    if (!symbol || !symbol.trim()) {
      setSymbolError("")
      return
    }

    try {
      // Generate slug from token symbol
      const collectionSlug = symbol
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if collection with this slug/symbol exists
      const response = await apiCaller('GET', `${authRoutes.getCollections}?slug=${collectionSlug}`, null, true)
      
      if (response.success && response.data) {
        const collections = Array.isArray(response.data) ? response.data : (response.data.collections || response.data.data || [])
        const existingCollection = collections.find((col: any) => 
          col.collectionSlug?.toLowerCase() === collectionSlug.toLowerCase() ||
          col.symbol?.toLowerCase() === symbol.toLowerCase()
        )
        
        if (existingCollection) {
          setSymbolError("Symbol already exists. Please use a unique symbol.")
        } else {
          setSymbolError("")
        }
      } else {
        setSymbolError("")
      }
    } catch (error: any) {
      // If error checking, don't show error - let it be validated on submit
      console.error("Error checking symbol availability:", error)
      setSymbolError("")
    }
  }

  const handleSymbolBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const symbol = e.target.value.trim()
    if (symbol) {
      await checkSymbolAvailability(symbol)
    } else {
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
              sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 280px, 320px"
              priority
              loading="eager"
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
              sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 280px, 320px"
              priority
              loading="eager"
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
          <p className="text-[#9BA3AF] text-xs sm:text-sm mb-3 sm:mb-4">File type supported PNG, GIF, WEBP, MP3, MP4 ; (MAX 500MB)</p>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 w-[70%] sm:w-[80%] md:w-[50%] border-dashed rounded-xl p-4 sm:p-8 md:p-12 bg-[#0B0926] text-center transition-colors ${
              previewUrl 
                ? 'border-[#2A2F4A] cursor-default' 
                : 'border-[#2A2F4A] cursor-pointer hover:border-[#5A21FF]'
            }`}
            onClick={!previewUrl ? () => fileInputRef.current?.click() : undefined}
          >
            {previewUrl && uploadedFile ? (
              <div className="relative w-full">
                {uploadedFile.type.startsWith("image/") ? (
                  <div className="relative w-full rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Uploaded file"
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg object-contain max-h-[500px]"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile()
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
                      <p className="text-white text-lg mb-2">{uploadedFile.name}</p>
                      <p className="text-gray-400 text-sm">{uploadedFile.type}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFile()
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl bg-[#5A21FF]/20 flex items-center justify-center">
                  <CloudUpload className="w-8 h-8 sm:w-10 sm:h-10 text-[#5A21FF]" />
                </div>
                <p className="text-[#9BA3AF] text-sm mb-2">
                  Drag and drop your file here or browse
                </p>
                <Button
                  type="primary"
                  className="!bg-[#FFFFFF1A] !border-none !p-4 !rounded-full !mt-4 !text-white hover:!bg-[#FFFFFF2A]"
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
            Title <span className="text-[#884DFF] text-2xl">*</span>
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
            Description <span className="text-[#884DFF] text-2xl">*</span>
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
            Size
          </h2>
          <Input
            placeholder="e.g: Width x height"
            value={size}
            disabled={true}
            className="!bg-[#090721] !border-[#A3AED033] !font-exo2 !text-white !h-12 !rounded-lg placeholder:!text-[#6B7280] !cursor-not-allowed"
          />
        </div>

        {/* Category and Royalties */}
        <div className="p-4 sm:p-6 font-exo2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <h2 className="text-white text-sm font-medium mb-2">Category</h2>
              <Select
                placeholder={categoriesLoading ? "Loading categories..." : "Select Category"}
                value={category || undefined}
                onChange={(v) => setCategory(v)}
                loading={categoriesLoading}
                className="!w-full category-select [&_.ant-select-selector]:!bg-[#090721] [&_.ant-select-selector]:!border-[#A3AED033] [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selection-placeholder]:!text-[#6B7280] [&_.ant-select-selection-item]:!text-white [&_.ant-select-arrow]:!text-white"
                classNames={{
                  popup: {
                    root: "category-select-dropdown",
                  },
                }}
                suffixIcon={<span className="text-white">▼</span>}
                options={categoryOptions.map((option) => ({
                  label: option.label,
                  value: option.id,
                }))}
                notFoundContent={categoriesLoading ? "Fetching..." : "No categories"}
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
              />
            </div>

            {/* Royalties */}
            <div>
              <h2 className="text-white text-sm font-medium mb-2">Royalties</h2>
              <div className="h-12 bg-[#090721] border border-[#A3AED033] rounded-lg flex items-center px-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={royalties !== null ? royalties.toString() : ""}
                    onChange={(e) => {
                      const value = e.target.value
                      // Only allow numbers and one decimal point
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        if (value === "") {
                          setRoyalties(null)
                        } else {
                          const numValue = parseFloat(value)
                          if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
                            setRoyalties(numValue)
                          } else if (value === "." || value === "0.") {
                            // Allow typing decimal point
                            setRoyalties(null)
                          }
                        }
                      }
                    }}
                    onKeyPress={(e) => {
                      // Only allow numbers, decimal point, and control keys
                      const char = String.fromCharCode(e.which || e.keyCode)
                      if (!/[0-9.]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab' && e.key !== 'Enter') {
                        e.preventDefault()
                      }
                      // Prevent multiple decimal points
                      if (char === '.' && (e.currentTarget.value.includes('.') || e.currentTarget.value === '')) {
                        e.preventDefault()
                      }
                    }}
                    placeholder="Enter Royalties"
                    className="bg-transparent border-none outline-none text-white text-base font-semibold font-exo2 placeholder:text-[#6B7280]"
                    style={{ 
                      width: royalties !== null && royalties.toString() && royalties.toString().length > 0
                        ? `${Math.max(18, royalties.toString().length * 7 + 4)}px` 
                        : '120px',
                      minWidth: '18px',
                      maxWidth: royalties !== null && royalties.toString() && royalties.toString().length > 0 ? '50px' : '120px'
                    }}
                  />
                  <span className="text-white text-sm ml-1">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Redeem Code */}
        {/* <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">
            Redeem Code
          </h2>
          <Input
            placeholder="Enter direct key or code to redeem or link to the file"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            className="!bg-[#090721] !border-[#A3AED033] !font-exo2 !text-white !h-12 !rounded-lg placeholder:!text-[#6B7280]"
          />
        </div> */}

        {/* Select Method */}
        <div className="p-4 sm:p-6 font-exo2 w-full sm:w-[70%] md:w-[50%] lg:w-[40%]">
          <h2 className="text-white text-sm font-medium mb-3">
            Select Method <span className="text-[#884DFF] text-2xl">*</span>
          </h2>
          <div className="flex gap-3 sm:gap-5">
            <button
              onClick={() => setSelectedMethod("")}
              className={`flex-1 px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedMethod === ""
                  ? "bg-white text-black"
                  : "bg-transparent text-white border border-[#A3AED033] hover:border-white"
              }`}
            >
              None
            </button>
            <button
              onClick={() => setSelectedMethod("Fixed Rate")}
              className={`flex-1 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedMethod === "Fixed Rate"
                  ? "bg-white text-black"
                  : "bg-transparent text-white border border-[#A3AED033] hover:border-white"
              }`}
            >
              Fixed Rate
            </button>
            <button
              onClick={() => setSelectedMethod("Time Auction")}
              className={`flex-1 px-4 sm:px-6 py-4 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedMethod === "Time Auction"
                  ? "bg-white text-black"
                  : "bg-transparent text-white border border-[#A3AED033] hover:border-white"
              }`}
            >
              Auction
            </button>
          </div>
        </div>

        {/* Price (AVAX) */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">
            Price (AVAX)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[#9BA3AF] text-xs font-semibold mb-2">Enter AVAX Price</p>
              <div className="h-12 bg-[#090721] border border-[#A3AED033] rounded-lg flex items-center justify-between px-4">
                <input
                  type="text"
                  inputMode="decimal"
                  value={fixedPrice || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow numbers and one decimal point
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setFixedPrice(value)
                      if (value && !isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
                        lastValidFixedPriceRef.current = value
                      } else if (value === "") {
                        lastValidFixedPriceRef.current = ""
                      }
                    }
                  }}
                  onKeyPress={(e) => {
                    // Only allow numbers, decimal point, and control keys
                    const char = String.fromCharCode(e.which || e.keyCode)
                    if (!/[0-9.]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab' && e.key !== 'Enter') {
                      e.preventDefault()
                    }
                    // Prevent multiple decimal points
                    if (char === '.' && (e.currentTarget.value.includes('.') || e.currentTarget.value === '')) {
                      e.preventDefault()
                    }
                  }}
                  placeholder="Enter the price"
                  className="flex-1 bg-transparent border-none outline-none text-white text-base font-semibold font-exo2 placeholder:text-[#6B7280] pr-2"
                />
                <span className="text-[#6B7280] text-sm">AVAX</span>
              </div>
            </div>
            <div>
              <p className="text-[#9BA3AF] text-xs font-semibold mb-2">USDT Equivalent</p>
              <div className="h-12 bg-[#090721] border border-[#A3AED033] rounded-lg flex items-center justify-between px-4">
                <span className="text-white text-base font-semibold">
                  {convertedUsdtValue ? convertedUsdtValue : "0.00"}
                </span>
                <span className="text-[#6B7280] text-sm">USDT</span>
              </div>
              {/* <p className="text-[#6B7280] text-[11px] mt-2">
                Live AVAX price: {coinAmount ? `$${Number(coinAmount).toFixed(2)} USD / AVAX` : "Fetching..."}
              </p> */}
            </div>
          </div>
        </div>

        {/* Time Auction Date Fields */}
        {selectedMethod === "Time Auction" && (
          <div className="p-4 sm:p-6 font-exo2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Starting Date & Time */}
              <div>
                <h2 className="text-white text-sm font-medium mb-2">Starting Date & Time</h2>
                <DatePicker
                  value={startingDate}
                  onChange={(date) => setStartingDate(date)}
                  showTime={{
                    format: 'HH:mm',
                    minuteStep: 1,
                  }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day')
                  }}
                  disabledTime={(current) => {
                    if (!current) return {}
                    const now = dayjs()
                    if (current.isSame(now, 'day')) {
                      return {
                        disabledHours: () => {
                          const hours = []
                          for (let i = 0; i < now.hour(); i++) {
                            hours.push(i)
                          }
                          return hours
                        },
                        disabledMinutes: (selectedHour: number) => {
                          if (selectedHour === now.hour()) {
                            const minutes = []
                            for (let i = 0; i <= now.minute(); i++) {
                              minutes.push(i)
                            }
                            return minutes
                          }
                          return []
                        },
                      }
                    }
                    return {}
                  }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Select starting date & time"
                  className="!w-full !h-12 [&_.ant-picker-input]:!bg-[#090721] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input]:!font-exo2 [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#090721] !border-[#A3AED033] !rounded-lg [&_.ant-picker-suffix]:!text-white"
                  popupClassName="[&_.ant-picker-dropdown]:!bg-[#090721] [&_.ant-picker-panel]:!bg-[#090721] [&_.ant-picker-header]:!bg-[#090721] [&_.ant-picker-header]:!border-[#A3AED033] [&_.ant-picker-content]:!bg-[#090721] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF] [&_.ant-picker-time-panel]:!bg-[#090721] [&_.ant-picker-time-panel-column]:!bg-[#090721] [&_.ant-picker-time-panel-cell]:!text-white [&_.ant-picker-time-panel-cell-selected]:!bg-[#5A21FF] [&_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-header-view]:!text-white [&_.ant-picker-month-btn]:!text-white [&_.ant-picker-year-btn]:!text-white [&_.ant-picker-decade-btn]:!text-white [&_.ant-picker-time-panel-column>li]:!text-white [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected]:!text-white [&_.ant-picker-time-panel-column>li:hover]:!bg-[#5A21FF]/30"
                  suffixIcon={<Calendar className="h-4 w-4 text-white" />}
                  getPopupContainer={(trigger) => trigger.parentElement || document.body}
                />
              </div>

              {/* Expiration Date & Time */}
              <div>
                <h2 className="text-white text-sm font-medium mb-2">Expiration Date & Time</h2>
                <DatePicker
                  value={expirationDate}
                  onChange={(date) => setExpirationDate(date)}
                  showTime={{
                    format: 'HH:mm',
                    minuteStep: 1,
                  }}
                  disabledDate={(current) => {
                    if (!current) return false
                    // Disable past dates
                    if (current < dayjs().startOf('day')) return true
                    // If starting date is selected, disable dates before starting date
                    if (startingDate && current < startingDate.startOf('day')) return true
                    return false
                  }}
                  disabledTime={(current) => {
                    if (!current || !startingDate) return {}
                    // If same day as starting date, disable times before starting time
                    if (current.isSame(startingDate, 'day')) {
                      return {
                        disabledHours: () => {
                          const hours = []
                          for (let i = 0; i < startingDate.hour(); i++) {
                            hours.push(i)
                          }
                          return hours
                        },
                        disabledMinutes: (selectedHour: number) => {
                          if (selectedHour === startingDate.hour()) {
                            const minutes = []
                            for (let i = 0; i <= startingDate.minute(); i++) {
                              minutes.push(i)
                            }
                            return minutes
                          }
                          return []
                        },
                      }
                    }
                    // If today, disable past times
                    const now = dayjs()
                    if (current.isSame(now, 'day')) {
                      return {
                        disabledHours: () => {
                          const hours = []
                          for (let i = 0; i < now.hour(); i++) {
                            hours.push(i)
                          }
                          return hours
                        },
                        disabledMinutes: (selectedHour: number) => {
                          if (selectedHour === now.hour()) {
                            const minutes = []
                            for (let i = 0; i <= now.minute(); i++) {
                              minutes.push(i)
                            }
                            return minutes
                          }
                          return []
                        },
                      }
                    }
                    return {}
                  }}
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Select ending date & time"
                  className="!w-full !h-12 [&_.ant-picker-input]:!bg-[#090721] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input]:!font-exo2 [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#090721] !border-[#A3AED033] !rounded-lg [&_.ant-picker-suffix]:!text-white"
                  popupClassName="[&_.ant-picker-dropdown]:!bg-[#090721] [&_.ant-picker-panel]:!bg-[#090721] [&_.ant-picker-header]:!bg-[#090721] [&_.ant-picker-header]:!border-[#A3AED033] [&_.ant-picker-content]:!bg-[#090721] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF] [&_.ant-picker-time-panel]:!bg-[#090721] [&_.ant-picker-time-panel-column]:!bg-[#090721] [&_.ant-picker-time-panel-cell]:!text-white [&_.ant-picker-time-panel-cell-selected]:!bg-[#5A21FF] [&_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-header-view]:!text-white [&_.ant-picker-month-btn]:!text-white [&_.ant-picker-year-btn]:!text-white [&_.ant-picker-decade-btn]:!text-white [&_.ant-picker-time-panel-column>li]:!text-white [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected]:!text-white [&_.ant-picker-time-panel-column>li:hover]:!bg-[#5A21FF]/30"
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
                  backgroundColor: postToFeed ? '#4E00E5' : '#26017059',
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
                  backgroundColor: freeMinting ? '#4E00E5' : '#26017059'
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
                  backgroundColor: putOnMarketplace ? '#4E00E5' : '#26017059'
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
                  backgroundColor: unlockOncePurchased ? '#4E00E5' : '#26017059'
                }}
              />
            </div>
          </div>
        </div>
      </div>

       {/* Choose/Create Collection */}
        <div className="p-4 sm:p-6 font-exo2">
          <h2 className="text-white text-sm font-medium mb-2">Collection <span className="text-[#884DFF] text-2xl">*</span></h2>
          <p className="text-[#A3AED0] text-xs mb-4">Choose an existing collection or create a new one.</p>

          <div
            className={collections.length > 4 ? "collections-scroll pr-2" : ""}
            style={{
              height: collections.length > 4 ? '400px' : 'auto',
              maxHeight: collections.length > 4 ? '500px' : 'none',
              overflowY: collections.length > 4 ? 'auto' : 'visible',
              overflowX: 'hidden',
              scrollbarWidth: collections.length > 4 ? 'thin' : 'none',
              scrollbarColor: collections.length > 4 ? '#5A21FF #0B0926' : 'transparent transparent',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
              {/* Collections List - First 4 */}
              {isLoadingCollections ? (
                <div className="col-span-5 text-center py-8">
                  <p className="text-[#A3AED0]">Loading collections...</p>
                </div>
              ) : collections.length > 0 ? (
                <>
                  {collections?.map((collection) => {
                  const collectionId = collection._id || collection.collectionId || collection.id
                  const collectionAddress = collection.collectionAddress 
                  const isSelected = selectedCollection === collectionId
                  const collectionImage = collection.imageUrl || collection.coverPhoto || collectionOneImage
                  const collectionName = collection.collectionName || collection.name || "Unnamed Collection"
                 
                  const itemCount = collection.totalCollectionNfts || collection.totalNfts || 0
                 
                  const handleCollectionClick = () => {
                  
                      // Select this collection
                      setSelectedCollection(collectionId)
                      setSelectedCollectionAddress(collectionAddress)
                    
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
                      <div className="relative h-[180px] sm:h-[200px] w-full rounded-xl sm:rounded-2xl">
                        <Image
                          src={collectionImage}
                          alt={collectionName}
                          fill
                          className="object-cover rounded-xl sm:rounded-2xl"
                          sizes="(max-width: 800px) 100vw, 20vw"
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
                  })}

                  {/* Create Collection Button - 5th in first row */}
                  <button
                    type="button"
                    onClick={() => setIsCreateCollectionModalOpen(true)}
                    className={`group flex h-[180px] sm:h-[200px] w-full flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed transition-all duration-300 ${selectedCollection === "create-new"
                      ? "border-[#6C4DFF] text-white bg-[#120D39]"
                      : "border-[#2A2F4A] text-[#A3AED0] hover:border-[#6C4DFF] hover:text-white"
                      }`}
                  >
                    <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#6C4DFF]/10 text-[#6C4DFF] mb-2 sm:mb-3 group-hover:bg-[#6C4DFF]/20">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold">Create Collection</span>
                  </button>

                  {/* Remaining Collections - 5 per row */}
                  {collections.slice(4).map((collection) => {
                    const collectionId = collection._id || collection.collectionId || collection.id
                    const collectionAddress = collection.collectionAddress 
                    const isSelected = selectedCollection === collectionId
                    const collectionImage = collection.imageUrl || collection.coverPhoto || collectionOneImage
                    const collectionName = collection.collectionName || collection.name || "Unnamed Collection"
                   
                    const itemCount = collection.totalCollectionNfts || collection.totalNfts || 0
                   
                    const handleCollectionClick = () => {
                      if (isSelected) {
                        setSelectedCollection("")
                        setSelectedCollectionAddress("")
                      } else {
                        setSelectedCollection(collectionId)
                        setSelectedCollectionAddress(collectionAddress)
                      }
                    }

                    const handleDeselectClick = (e: React.MouseEvent) => {
                      e.stopPropagation()
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
                        <div className="relative h-[180px] sm:h-[200px] w-full rounded-xl sm:rounded-2xl">
                          <Image
                            src={collectionImage}
                            alt={collectionName}
                            fill
                            className="object-cover rounded-xl sm:rounded-2xl"
                            sizes="(max-width: 800px) 100vw, 20vw"
                            onError={(e) => {
                              e.currentTarget.src = collectionOneImage.src
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0729]/20 to-[#0B0729]/90 opacity-90 group-hover:opacity-100 transition-opacity" />

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
                  })}
                </>
              ) : (
                <>
                  <div className="col-span-4 text-center py-8 flex items-center justify-center">
                    <p className="text-[#9BA3AF]">No collections found. Create your first collection!</p>
                  </div>
                  {/* Create Collection Button - When no collections */}
                  <button
                    type="button"
                    onClick={() => setIsCreateCollectionModalOpen(true)}
                    className={`group flex h-[180px] sm:h-[200px] w-full flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-dashed transition-all duration-300 ${selectedCollection === "create-new"
                      ? "border-[#6C4DFF] text-white bg-[#120D39]"
                      : "border-[#2A2F4A] text-[#A3AED0] hover:border-[#6C4DFF] hover:text-white"
                      }`}
                  >
                    <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#6C4DFF]/10 text-[#6C4DFF] mb-2 sm:mb-3 group-hover:bg-[#6C4DFF]/20">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold">Create Collection</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      {/* Create Item Button */}
      <div className="p-4 sm:p-6 font-exo2">
        <Button
          onClick={handleCreateItem}
          disabled={isCreatingNFT}
          loading={isCreatingNFT}
          className="!w-full !h-12 font-exo2 !bg-gradient-to-b !from-[#4F01E6] !to-[#25016E] !border-none !text-white !rounded-full !text-base !font-semibold hover:!opacity-90 transition-opacity disabled:!opacity-50"
        >
          {isCreatingNFT ? "Creating NFT..." : "Create Item"}
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
              onBlur={handleSymbolBlur}
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