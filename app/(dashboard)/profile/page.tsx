
"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthStore, useMarketDataStore } from "@/lib/store/authStore"
import { Button, Form, Input, Select, Tabs, Dropdown, Spin, Modal, Switch, DatePicker } from "antd"
import { useMessage } from "@/lib/hooks/useMessage"
import { Share2, Camera, MessageSquareText, ChevronDown, Search, Calendar, X } from "lucide-react"
import defaultCoverImage from "@/public/assets/BgCover.png"
import card21Img from "@/public/assets/21-card-img.png"
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { countryCodes } from '@/lib/constants/countryCodes'
import { apiCaller } from "@/app/interceptors/apicall/apicall"
import authRoutes from "@/lib/routes"
import { useWallet } from "@/app/hooks/useWallet"
import dayjs, { Dayjs } from "dayjs"
import collectionOneImage from "@/components/assets/image21.png"
import { CONTRACTS } from "@/app/utils/contracts/contractConfig"
import { useNFTCollection } from "@/app/hooks/contracts/useNFTCollection"
import { useMarketplace } from "@/app/hooks/contracts/useMarketplace"
import { ethers } from "ethers"

const countries = [
  "United States",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
]

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const { user, getProfile, getProfileByUserId, updateProfile, incrementProfileView } = useAuthStore()
  const { message } = useMessage()
  const [editing, setEditing] = useState(false)
  const isViewingOtherUser = userId && userId !== user?.id && userId !== (user as any)?._id
  const [activeTab, setActiveTab] = useState('About')
  const router = useRouter()
  const { address } = useWallet()
  const { setApprovalForAll, isApproved } = useNFTCollection();
  const {createPutOnSaleSignature, auctionNonceStatus} = useMarketplace();


  // NFTs state
  const [nfts, setNfts] = useState<any[]>([])
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)
  const [nftStatusFilter, setNftStatusFilter] = useState<number | null>(null) // 1: minted, 2: approved, 3: put_on_sale
  const [updatingNFTId, setUpdatingNFTId] = useState<string | null>(null) // Track which NFT is being updated
  const [resettingNFTId, setResettingNFTId] = useState<string | null>(null) // Track which NFT is being reset
  const [form] = Form.useForm()
  
  // Put on Sale Modal States
  const [isPutOnSaleModalOpen, setIsPutOnSaleModalOpen] = useState(false)
  const [selectedNFTForSale, setSelectedNFTForSale] = useState<any>(null)
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [fixedPrice, setFixedPrice] = useState<string>("")
  const [postToFeed, setPostToFeed] = useState<boolean>(true)
  const [freeMinting, setFreeMinting] = useState<boolean>(false)
  const [putOnMarketplace, setPutOnMarketplace] = useState<boolean>(true)
  const [unlockOncePurchased, setUnlockOncePurchased] = useState<boolean>(false)
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [selectedCollectionAddress, setSelectedCollectionAddress] = useState<string>("")
  const [startingDate, setStartingDate] = useState<Dayjs | null>(null)
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null)
  const [collections, setCollections] = useState<any[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  const { getCoinPrice, coinAmount } = useMarketDataStore()
  // const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [countryCode, setCountryCode] = useState('+1')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    country: "",
    location: "",
    profession: "",
    joined: "",
    website: "",
    phone: "",
    links: {
      facebook: "https://t.me/+XyKl3RHYu-QxNWMx",
      instagram: "https://www.instagram.com/21spades.io",
      x: "https://twitter.com/@21SpadesDPR",
    },
    stats: {
      posts: 0,
      projects: 0,
      contributions: 0,
    },
    bio: "",
    interests: [] as string[],
    coverPicture: defaultCoverImage.src,
    avatar: "/post/card-21.png",
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
        setCountrySearchQuery('')
      }
    }

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCountryDropdown])

  // Fetch profile data on component mount and when userId changes
  useEffect(() => {
    fetchProfileData()
    // incrementProfileView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Fetch NFTs when NFTs tab is active
  useEffect(() => {
    if (activeTab === 'NFTs') {
      fetchUserNFTs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userId, address])

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

  // Fetch collections for Put on Sale modal
  const fetchCollections = useCallback(async () => {
    try {
      setIsLoadingCollections(true)
      const walletAddress = address || ""

      const queryParams = new URLSearchParams()
      if (walletAddress) {
        queryParams.append('walletAddress', walletAddress)
      }
      queryParams.append('page', '1')
      queryParams.append('limit', '100')
      queryParams.append('blocked', 'false')

      const url = `${authRoutes.getCollections}?${queryParams.toString()}`

      const [userCollectionsResponse, systemCollectionResponse] = await Promise.all([
        apiCaller('GET', url, null, true),
        apiCaller('GET', authRoutes.getSystemCollection, null, true).catch(() => null)
      ])

      const allCollections: any[] = []

      if (systemCollectionResponse?.success && systemCollectionResponse?.data) {
        const systemCollection = systemCollectionResponse.data.collection || systemCollectionResponse.data
        if (systemCollection) {
          allCollections.push(systemCollection)
        }
      }

      if (userCollectionsResponse.success && userCollectionsResponse.data) {
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
  }, [address])

  // Fetch user NFTs (both created and purchased)
  const fetchUserNFTs = async () => {
    try {
      setIsLoadingNFTs(true)

      // Use the my-nfts endpoint to get all NFTs owned by current user
      const response = await apiCaller('GET', authRoutes.getMyNFTs, null, true)

      let allNFTs: any[] = []

      if (response.success && response.data) {
        const nftsData = Array.isArray(response.data)
          ? response.data
          : (response.data.items || response.data.nfts || response.data.data || [])

        // Use data directly from my-nfts endpoint without additional API calls
        allNFTs = nftsData.map((nft: any) => ({
          ...nft,
          nftStatus: nft.nftStatus || 1
        }))
      }

      setNfts(allNFTs)
    } catch (error: any) {
      console.error('Error fetching user NFTs:', error)
      message.error('Failed to fetch NFTs')
      setNfts([])
    } finally {
      setIsLoadingNFTs(false)
    }
  }

  // Filter NFTs by status
  const filteredNFTs = useMemo(() => {
    if (nftStatusFilter === null) {
      return nfts
    }
    return nfts.filter(nft => nft.nftStatus === nftStatusFilter)
  }, [nfts, nftStatusFilter])

  // Helper function to safely parse date from timestamp
  const parseDateFromTimestamp = (timestamp: any): Dayjs | null => {
    if (!timestamp) return null
    
    try {
      const numTimestamp = Number(timestamp)
      if (isNaN(numTimestamp) || numTimestamp <= 0) return null
      
      const date = dayjs.unix(numTimestamp)
      // Check if date is valid
      if (!date.isValid()) return null
      
      return date
    } catch (error) {
      console.error('Error parsing date:', error)
      return null
    }
  }

  // Open Put on Sale Modal
  const handleOpenPutOnSaleModal = async (nft: any, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    
    setSelectedNFTForSale(nft)
    
    // Fetch collections
    await fetchCollections()
    
    // Pre-fill form with existing NFT data
    const existingPrice = nft.price ? nft.price.toString() : "0"
    setFixedPrice(existingPrice)
    
    // Set collection from NFT
    const nftCollectionId = nft.collectionId?._id || nft.collectionId?.id || nft.collectionId
    const nftCollectionAddress = nft.collectionId?.collectionAddress || ""
    setSelectedCollection(nftCollectionId || "")
    setSelectedCollectionAddress(nftCollectionAddress)
      // Ensure marketplace approval for this collection before minting / API call
    
    // Set auction type based on existing data
    if (nft.auctionType === 1) {
      setSelectedMethod("Fixed Rate")
      // Clear dates for Fixed Rate
      setStartingDate(null)
      setExpirationDate(null)
    } else if (nft.auctionType === 2) {
      setSelectedMethod("Time Auction")
      // Set dates if available and valid
      const startingDateParsed = parseDateFromTimestamp(nft.startingTime)
      const expirationDateParsed = parseDateFromTimestamp(nft.endingTime)
      
      setStartingDate(startingDateParsed)
      setExpirationDate(expirationDateParsed)
    } else {
      setSelectedMethod("")
      // Clear dates for None
      setStartingDate(null)
      setExpirationDate(null)
    }
    
    // Set toggles from existing data
    setPostToFeed(nft.postToFeed !== false)
    setFreeMinting(nft.isLazyMint === true)
    setPutOnMarketplace(true) // Default to true for put on sale
    setUnlockOncePurchased(nft.isUnlockable === true)
    
    setIsPutOnSaleModalOpen(true)
  }

  // Close Put on Sale Modal
  const handleClosePutOnSaleModal = () => {
    setIsPutOnSaleModalOpen(false)
    setSelectedNFTForSale(null)
    setSelectedMethod("")
    setFixedPrice("")
    setPostToFeed(true)
    setFreeMinting(false)
    setPutOnMarketplace(true)
    setUnlockOncePurchased(false)
    setSelectedCollection("")
    setSelectedCollectionAddress("")
    setStartingDate(null)
    setExpirationDate(null)
  }

  // Calculate USDT equivalent
  const convertedUsdtValue = useMemo(() => {
    const avaxValue = parseFloat(fixedPrice)
    const avaxRate = Number(coinAmount)

    if (!fixedPrice || isNaN(avaxValue) || !avaxRate) {
      return ""
    }

    return (avaxValue * avaxRate).toFixed(2)
  }, [fixedPrice, coinAmount])
// cons
  // Handle Update NFT (Put on Sale)
  const handleUpdateNFT = async () => {
    console.log("selectedNFTForSale1111111111111", selectedNFTForSale)
    // return;
    if (!selectedNFTForSale) return

    // Validation
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
    if (!selectedCollection) {
      message.error("Please select a collection")
      return
    }

    const nftId = selectedNFTForSale._id || selectedNFTForSale.id
    if (!nftId) {
      message.error("NFT ID not found")
      return
    }

    setUpdatingNFTId(nftId)

    try {
      // Map auction type
      let auctionType = 0
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

      // Calculate total days for auction
      const totalDays = selectedMethod === "Time Auction" && expirationDate
        ? Math.ceil((expirationDate.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0


      // call hooks

      const priceString = fixedPrice && fixedPrice.trim() !== "" ? fixedPrice : "0"


      const marketplaceAddress = CONTRACTS.ERC721Marketplace.address
      try {
        const hasApproval = await isApproved(address as string, marketplaceAddress, selectedCollectionAddress)
        if (!hasApproval) {
          await setApprovalForAll(marketplaceAddress, true, selectedCollectionAddress)
        }
      } catch (approvalError) {
        console.error("❌ Error while ensuring marketplace approval:", approvalError)
        message.error("Failed to set marketplace approval. Please try again.")
        return
      }

      // 2 hook

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
     const UpdatedNonce = nonceResponse.data.nonce; 

     var salePayload = {
      tokenId: selectedNFTForSale.nftId, // this is the token id of the nft
      erc721: selectedCollectionAddress, // this is the erc721 collection address of the nft
      priceEth: priceString, // Use exact string value to preserve precision (no scientific notation)
      nonce: UpdatedNonce, // get nonce by hook of useMarketplace
      erc20Token: selectedNFTForSale.erc20Token || "0x0000000000000000000000000000000000000000", // 0x0000000000000000000000000000000000000000 for native token or erc20 token address 
      auctionType: auctionType, // 1 (Fixed Price) for fixed price, 2 (Auction) for auction 
      startingTime:startingTime, // this is the starting time  of the nft Auction type 2 sale in seconds
      endingTime:endingTime, // this is the ending time of the nft Auction type 2 sale in seconds
      sign: "", // this is the signature of the sale which will be generate in next step
    }
//  payload.erc20Token = salePayload.erc20Token;
 let signature;
     // 
     try {
      
      if(auctionType === 1){
         signature = await createPutOnSaleSignature(
       BigInt(salePayload.tokenId),
       salePayload.erc721,
       ethers.parseEther(salePayload.priceEth),
       BigInt(UpdatedNonce),
       salePayload.erc20Token,
       auctionType,
       BigInt(0),
       BigInt(0),
 
     );
  
     }else if(auctionType === 2 && endingTime && startingTime){
        signature = await createPutOnSaleSignature(
       BigInt(salePayload.tokenId),
       salePayload.erc721,
       ethers.parseEther(salePayload.priceEth),
       BigInt(`${UpdatedNonce}`),
       salePayload.erc20Token,
       auctionType,
       BigInt(startingTime),
       BigInt(endingTime),
 
     );
    
 
     }
    } catch (error) {
      console.error("❌ Error creating sale:", error)
      throw error
    }

      // call hooks above


      // Prepare update payload
      const payload: any = {
        price: priceString,
        totalDays: totalDays,
        putOnSale: putOnMarketplace ? 1 : 0,
        auctionType: auctionType,
        startingTime: startingTime,
        endingTime: endingTime,
        isLazyMint: freeMinting,
        isUnlockable: unlockOncePurchased,
        postToFeed: postToFeed,
        collectionId: selectedCollection,
        nonce: UpdatedNonce,
        signature: signature?.signature,
      }

      // Remove undefined fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key]
        }
      })

      // Call update API
      const response = await apiCaller('PUT', `${authRoutes.updateNFT}/${nftId}`, payload, true)

      if (response.success) {
        message.success("NFT updated successfully!")
        
        // Update local state
        setNfts(prevNfts =>
          prevNfts.map(nft =>
            (nft._id || nft.id) === nftId
              ? {
                  ...nft,
                  price: payload.price,
                  auctionType: payload.auctionType,
                  startingTime: payload.startingTime,
                  endingTime: payload.endingTime,
                  putOnSale: payload.putOnSale,
                  nftStatus: payload.putOnSale ? 3 : nft.nftStatus,
                }
              : nft
          )
        )

        handleClosePutOnSaleModal()
      } else {
        message.error(response.message || "Failed to update NFT")
      }
    } catch (error: any) {
      console.error("❌ Error updating NFT:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update NFT"
      message.error(errorMessage)
    } finally {
      setUpdatingNFTId(null)
    }
  }

  // Reset NFT status to 1 (Minted) from Put on Sale
  const handleNFTStatus = async (nftId: string, nftStatus: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

    const status = nftStatus === 1 ? 2 : 1;

    try {
      setResettingNFTId(nftId)

      // Reset NFT status to 1 (Minted) using reset-status endpoint
      // Endpoint automatically resets to status 1, no payload needed
      const resetResponse = await apiCaller('PUT', `${authRoutes.resetNFTStatus}/${nftId}/reset-status`, { status }, true)

      if (resetResponse.success) {
        message.success('NFT status reset to "Minted"')

        // Update local state
        setNfts(prevNfts =>
          prevNfts.map(nft =>
            (nft._id || nft.id) === nftId
              ? { ...nft, nftStatus: status, putOnSale: 0 }
              : nft
          )
        )
      } else {
        message.error(resetResponse.message || 'Failed to reset NFT status')
      }
    } catch (error: any) {
      console.error('Error resetting NFT status:', error)
      message.error(error?.response?.data?.message || error?.message || 'Failed to reset NFT status')
    } finally {
      setResettingNFTId(null)
    }
  }

  // Update form phone field when profile.phone changes and editing is active
  useEffect(() => {
    if (editing && profile.phone) {
      form.setFieldsValue({
        phone: profile.phone,
      })
    }
  }, [editing, profile.phone, form])

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      // setProfileLoading(true)

      // If userId is provided and different from logged-in user, fetch that user's profile
      let profileData
      if (isViewingOtherUser && userId) {
        profileData = await getProfileByUserId(userId)
      } else {
        profileData = await getProfile()
      }

      if (profileData && profileData.user) {
        const userData = profileData.user

        // Format joined date
        let joinedDate = ""
        if (userData.createdAt) {
          const date = new Date(userData.createdAt)
          joinedDate = `Joined ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
        }

        const fallbackAvatar = isViewingOtherUser
          ? "/post/card-21.png"
          : user?.profilePicture || user?.avatar || "/post/card-21.png"

        setProfile({
          name: userData.name || user?.name || "",
          username: userData.username || user?.username || "",
          email: userData.email || user?.email || "",
          country: userData.country || "",
          location: userData.location || "",
          profession: userData.profession || "",
          joined: joinedDate,
          website: userData.website || "",
          phone: userData.phoneNumber || userData.phone || user?.phoneNumber || user?.phone || "",
          links: {
            facebook: userData.facebook || "",
            instagram: userData.instagram || "",
            x: userData.twitter || "",
          },
          stats: {
            posts: userData.profileView || 0,
            projects: userData.projects || 0,
            contributions: userData.contributions || 0,
          },
          bio: userData.bio || "",
          interests: Array.isArray(userData.interests)
            ? userData.interests
            : userData.interests ? [userData.interests] : [],
          coverPicture: userData.coverPicture || defaultCoverImage.src,
          avatar: userData.profilePicture || fallbackAvatar,
        })

        // Set country code from user data
        const userCountryCode = userData.countryCode || user?.countryCode || '+1'
        setCountryCode(userCountryCode)

        // Update form initial values
        form.setFieldsValue({
          name: userData.name || user?.name || "",
          username: userData.username || user?.username || "",
          email: userData.email || user?.email || "",
          country: userData.country || "",
          phone: userData.phoneNumber || userData.phone || "",
          profession: userData.profession || "",
          interests: Array.isArray(userData.interests)
            ? userData.interests
            : userData.interests ? [userData.interests] : [],
          bio: userData.bio || "",
        })
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      message.error(error?.response?.data?.message || 'Failed to fetch profile data')

      // Set fallback values from user store
      if (user) {
        const userCountryCode = user.countryCode || '+1'
        setCountryCode(userCountryCode)

        setProfile({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          country: user.country || "",
          location: "",
          profession: "",
          joined: "",
          website: "",
          phone: user.phoneNumber || user.phone || "",
          links: {
            facebook: user.facebook || "",
            instagram: user.instagram || "",
            x: user.twitter || "",
          },
          stats: {
            posts: user.profileView || 0,
            projects: user.projects || 0,
            contributions: user.contributions || 0,
          },
          bio: user?.bio || "",
          interests: Array.isArray(user?.interests)
            ? user.interests
            : user?.interests ? [user.interests] : [],
          coverPicture: defaultCoverImage.src,
          avatar: user.avatar || user.profilePicture || "/post/card-21.png",
        })
      }
    } finally {
      // setProfileLoading(false)
      console.log('Profile data fetched successfully')
    }
  }

  const existingPhoneNormalizedMemo = useMemo(() => {
    const existingPhoneRaw = profile.phone || user?.phoneNumber || user?.phone || ''
    return existingPhoneRaw.replace(/\D/g, '')
  }, [profile.phone, user?.phoneNumber, user?.phone])

  const onSave = async () => {
    try {
      setSaving(true)
      const values = await form.validateFields()

      // Extract phone number - use countryCode from state (selected from dropdown)
      let phoneNumber = ""
      const selectedCountryCode = countryCode || user?.countryCode || "+1"

      const existingPhoneNormalized = existingPhoneNormalizedMemo

      if (values.phone) {
        // Remove any non-digit characters from phone number
        phoneNumber = values.phone.replace(/\D/g, '')
      }

      // Convert interests to array - Select with mode="multiple" returns array
      let interestsArray: string[] = []
      if (values.interests) {
        if (Array.isArray(values.interests)) {
          interestsArray = values.interests.filter((i: any) => i) // Remove empty values
        } else if (typeof values.interests === 'string') {
          interestsArray = values.interests.split(",").map((i: string) => i.trim()).filter((i: string) => i)
        }
      } else {
        // If no interests selected, use existing user interests or empty array
        interestsArray = Array.isArray(user?.interests) ? user.interests : []
      }

      const currentValues = {
        name: profile.name || user?.name || "",
        username: profile.username || user?.username || "",
        email: profile.email || user?.email || "",
        country: profile.country || user?.country || "",
        phone: existingPhoneNormalized,
        profession: profile.profession || "",
        bio: profile.bio || user?.bio || "",
        interests: Array.isArray(profile.interests) ? profile.interests : (profile.interests ? [profile.interests] : []),
      }

      const normalizedNewPhone = phoneNumber
      const normalizedInterests = interestsArray

      const arraysEqual = (a: string[], b: string[]) => {
        if (a.length !== b.length) return false
        const sortedA = [...a].sort()
        const sortedB = [...b].sort()
        return sortedA.every((value, index) => value === sortedB[index])
      }

      const fieldsChanged: string[] = []
      if ((values.name || "") !== currentValues.name) fieldsChanged.push('name')
      if ((values.username || "") !== currentValues.username) fieldsChanged.push('username')
      if ((values.email || "") !== currentValues.email) fieldsChanged.push('email')
      if ((values.country || "") !== currentValues.country) fieldsChanged.push('country')
      if ((values.profession || "") !== currentValues.profession) fieldsChanged.push('profession')
      if ((values.bio || "") !== currentValues.bio) fieldsChanged.push('bio')
      if (!arraysEqual(normalizedInterests, currentValues.interests)) fieldsChanged.push('interests')
      const isPhoneCleared = values.phone === undefined || values.phone === null || values.phone === ''
      if (isPhoneCleared) {
        if (currentValues.phone !== '') fieldsChanged.push('phoneNumber')
      } else if (normalizedNewPhone !== currentValues.phone) {
        fieldsChanged.push('phoneNumber')
      }

      if (fieldsChanged.length === 0) {
        message.info("You haven't changed anything yet.")
        setSaving(false)
        return
      }

      // Prepare profile update payload as per API requirements
      const updatePayload: Record<string, any> = {
        email: values.email || user?.email || "",
        name: values.name || "",
        username: values.username || "",
        countryCode: selectedCountryCode || user?.countryCode || "+1",
        country: values.country || user?.country || "",
        interests: interestsArray.length > 0 ? interestsArray : (user?.interests || []),
        portfolio: user?.portfolio || "",
        facebook: user?.facebook || profile.links.facebook || "",
        instagram: user?.instagram || profile.links.instagram || "",
        discord: user?.discord || "",
        twitter: user?.twitter || profile.links.x || "",
        bio: values.bio || "",
        profilePicture: user?.profilePicture || user?.avatar || profile.avatar || "",
        projects: user?.projects || profile.stats.projects || 0,
        contributions: user?.contributions || profile.stats.contributions || 0,
        profileView: user?.profileView || profile.stats.posts || 0,
      }

      if (isPhoneCleared) {
        updatePayload.phoneNumber = ''
      } else if (phoneNumber && phoneNumber !== existingPhoneNormalized) {
        updatePayload.phoneNumber = phoneNumber
      }

      // Call profile update API
      await updateProfile(updatePayload)

      // Update local profile state
      setProfile(prev => ({
        ...prev,
        name: updatePayload.name,
        username: updatePayload.username,
        email: updatePayload.email,
        country: updatePayload.country,
        bio: updatePayload.bio,
        interests: interestsArray, // Keep as array
        links: {
          facebook: updatePayload.facebook,
          instagram: updatePayload.instagram,
          x: updatePayload.twitter,
        },
        stats: {
          posts: updatePayload.profileView,
          projects: updatePayload.projects,
          contributions: updatePayload.contributions,
        },
      }))

      message.success("Profile saved successfully!")
      setEditing(false)

      // Refresh profile data
      await fetchProfileData()
    } catch (e: any) {
      console.error('Profile update error:', e)
      const errorMessage = e?.response?.data?.message || e?.message || 'Failed to update profile. Please try again.'
      message.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size should be less than 5MB')
      return
    }

    try {
      setUploadingAvatar(true)

      // Convert to base64 for preview
      const base64 = await fileToBase64(file)
      setAvatarPreview(base64)

      // Update profile with new avatar
      await updateProfile({
        email: profile.email || user?.email || "",
        name: profile.name || user?.name || "",
        username: profile.username || user?.username || "",
        phoneNumber: user?.phoneNumber || "",
        countryCode: user?.countryCode || "+1",
        country: profile.country || user?.country || "",
        interests: Array.isArray(profile.interests) ? profile.interests : (user?.interests || []),
        portfolio: user?.portfolio || "",
        facebook: profile.links.facebook || user?.facebook || "",
        instagram: profile.links.instagram || user?.instagram || "",
        discord: user?.discord || "",
        twitter: profile.links.x || user?.twitter || "",
        bio: profile.bio || user?.bio || "",
        profilePicture: base64, // In production, upload to server and get URL
        projects: profile.stats.projects || user?.projects || 0,
        contributions: profile.stats.contributions || user?.contributions || 0,
        profileView: profile.stats.posts || user?.profileView || 0,
      })

      // Update local state
      setProfile(prev => ({ ...prev, avatar: base64 }))
      message.success('Avatar updated successfully!')
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      message.error('Failed to upload avatar. Please try again.')
    } finally {
      setUploadingAvatar(false)
      // Reset input
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ''
      }
    }
  }

  // Handle cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      message.error('Image size should be less than 10MB')
      return
    }

    try {
      setUploadingCover(true)

      // Convert to base64 for preview
      const base64 = await fileToBase64(file)
      setCoverPreview(base64)

      // Update profile with new cover
      await updateProfile({
        email: profile.email || user?.email || "",
        name: profile.name || user?.name || "",
        username: profile.username || user?.username || "",
        phoneNumber: user?.phoneNumber || "",
        countryCode: user?.countryCode || "+1",
        country: profile.country || user?.country || "",
        interests: Array.isArray(profile.interests) ? profile.interests : (user?.interests || []),
        portfolio: user?.portfolio || "",
        facebook: profile.links.facebook || user?.facebook || "",
        instagram: profile.links.instagram || user?.instagram || "",
        discord: user?.discord || "",
        twitter: profile.links.x || user?.twitter || "",
        bio: profile.bio || user?.bio || "",
        profilePicture: user?.profilePicture || user?.avatar || profile.avatar || "",
        coverPicture: base64,
        projects: profile.stats.projects || user?.projects || 0,
        contributions: profile.stats.contributions || user?.contributions || 0,
        profileView: profile.stats.posts || user?.profileView || 0,
      })

      // Update local state
      setProfile(prev => ({ ...prev, coverPicture: base64 }))
      message.success('Cover image updated successfully!')
    } catch (error: any) {
      console.error('Error uploading cover:', error)
      message.error('Failed to upload cover image. Please try again.')
    } finally {
      setUploadingCover(false)
      // Reset input
      if (coverInputRef.current) {
        coverInputRef.current.value = ''
      }
    }
  }

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value || ''
    const normalized = value.replace(/\D/g, '')
    if (normalized && normalized === existingPhoneNormalizedMemo) {
      message.warning('This phone number is already saved on your profile.')
    }
  }

  // Handle edit button click - populate form with current profile data
  const handleEditClick = async () => {
    setEditing(true) // Set editing mode first

    // Fetch latest profile data to ensure we have the most up-to-date phone number and country code
    try {
      const profileData = await getProfile()
      if (profileData && profileData.user) {
        const userData = profileData.user

        // Set country code from latest user data
        const userCountryCode = userData.countryCode || user?.countryCode || countryCode || '+1'
        setCountryCode(userCountryCode)

        // Get phone number - prioritize what is already shown on profile, then latest API/user store
        const phoneNumber =
          profile.phone ||
          userData.phoneNumber ||
          userData.phone ||
          user?.phoneNumber ||
          user?.phone ||
          ""

        // Convert interests to array format for the form
        let interestsArray: string[] = []
        if (profile.interests) {
          if (Array.isArray(profile.interests)) {
            interestsArray = profile.interests
          }
        } else if (userData.interests) {
          interestsArray = Array.isArray(userData.interests) ? userData.interests : []
        } else if (user?.interests) {
          interestsArray = Array.isArray(user.interests) ? user.interests : []
        }

        // Use setTimeout to ensure form is ready
        setTimeout(() => {
          form.setFieldsValue({
            name: profile.name,
            username: profile.username,
            email: profile.email,
            country: profile.country,
            phone: phoneNumber,
            profession: profile.profession,
            interests: interestsArray,
            bio: profile.bio,
          })
        }, 0)
      } else {
        // Fallback to existing logic if profile fetch fails
        let interestsArray: string[] = []
        if (profile.interests) {
          if (Array.isArray(profile.interests)) {
            interestsArray = profile.interests
          }
        } else if (user?.interests) {
          interestsArray = Array.isArray(user.interests) ? user.interests : []
        }

        const userCountryCode = user?.countryCode || countryCode || '+1'
        setCountryCode(userCountryCode)

        const phoneNumber = profile.phone || user?.phoneNumber || user?.phone || ""

        setTimeout(() => {
          form.setFieldsValue({
            name: profile.name,
            username: profile.username,
            email: profile.email,
            country: profile.country,
            phone: phoneNumber,
            profession: profile.profession,
            interests: interestsArray,
            bio: profile.bio,
          })
        }, 0)
      }
    } catch (error) {
      console.error('Error fetching profile for edit:', error)
      // Fallback to existing logic
      let interestsArray: string[] = []
      if (profile.interests) {
        if (Array.isArray(profile.interests)) {
          interestsArray = profile.interests
        }
      } else if (user?.interests) {
        interestsArray = Array.isArray(user.interests) ? user.interests : []
      }

      const userCountryCode = user?.countryCode || countryCode || '+1'
      setCountryCode(userCountryCode)

      const phoneNumber = profile.phone || user?.phoneNumber || user?.phone || ""

      setTimeout(() => {
        form.setFieldsValue({
          name: profile.name,
          username: profile.username,
          email: profile.email,
          country: profile.country,
          phone: phoneNumber,
          profession: profile.profession,
          interests: interestsArray,
          bio: profile.bio,
        })
      }, 0)
    }
  }

  // if (profileLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-[#020019]">
  //       <Spin size="large" />
  //     </div>
  //   )
  // }

  return (
    <div className="px-4 md:px-6 py-6 mt-4 space-y-4 md:space-y-6 bg-[#020019] font-exo2">
      {/* Main Profile Container */}
      <div className="relative rounded-xl overflow-hidden ">
        {/* Header / Cover Banner */}
        <div className="relative h-40 md:h-56 w-full bg-gradient-to-r from-purple-800/30 to-yellow-500/10 overflow-hidden">
          {/* Cover image upload button - Only show for own profile */}
          {!isViewingOtherUser && (
            <>
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-4 right-4 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors flex items-center gap-2 text-sm"
                disabled={uploadingCover}
              >
                <Camera size={16} />
                {uploadingCover ? 'Uploading...' : 'Change Cover'}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </>
          )}
          {/* Fallback cover image */}
          {(!uploadingCover && (coverPreview || profile.coverPicture)) ? (
            <img
              src={coverPreview || profile.coverPicture}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              onError={(e) => {
                console.error("Cover image error – using fallback");
                e.currentTarget.src = defaultCoverImage.src;
              }}
            />
          ) : !uploadingCover ? (
            <Image
              src={defaultCoverImage.src}
              alt="Cover"
              fill
              priority
              className="object-cover rounded-xl"
              sizes="100vw"
            />
          ) : null}

          {/* Overlapping 21 Spade Cards - Right Side */}
          <div className="absolute top-1/2 md:top-3/5 right-6 md:right-20 lg:right-28 -translate-y-1/2 flex items-center z-10">

            {/* Card 1 - Back */}
            <div className="relative w-14 h-20 sm:w-14 sm:h-20 md:w-20 md:h-32 lg:w-24 lg:h-36 -mr-8 sm:-mr-8 md:-mr-14">
              <Image
                src="/assets/21-card-img.png"
                alt="21 Card"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>

            {/* Card 2 - Middle */}
            <div className="relative w-16 h-24 sm:w-16 sm:h-24 md:w-24 md:h-36 lg:w-28 lg:h-44 z-20">
              <Image
                src="/assets/21-card-img.png"
                alt="21 Card"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>

            {/* Card 3 - Front */}
            <div className="relative w-16 h-24 sm:w-14 sm:h-20 md:w-20 md:h-32 lg:w-24 lg:h-36 -ml-8 sm:-ml-8 md:-ml-14">
              <Image
                src="/assets/21-card-img.png"
                alt="21 Card"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>

          </div>

          {/* Social Media Icons on Right Side */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
            <a
              href={profile.links.instagram || "https://www.instagram.com/21spades.io"}
              target={profile.links.instagram ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 bg-black/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xl text-white" />
            </a>
            <a
              href={profile.links.x || "https://twitter.com/@21SpadesDPR"}
              target={profile.links.x ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="text-xl text-white" />
            </a>
            <a
              href={profile.links.facebook || "https://t.me/+XyKl3RHYu-QxNWMx"}
              target={profile.links.facebook ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-xl text-white" />
            </a>
          </div>
        </div>

        {/* Profile Picture - Far Left, Overlapping Banner */}
        <div className="relative px-1 md:px-2 -mt-24 md:-mt-28">
          <div className="relative flex-shrink-0 w-[120px] h-[120px] md:w-[160px] md:h-[160px]">
            <div className="relative w-full h-full rounded-full p-[1px] md:p-[3px] shadow-xl" style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}>
              {(() => {
                const hasAvatarImage = Boolean((avatarPreview || profile.avatar)?.trim())
                const fallbackSrc = '/post/card-21.png'
                const avatarSrc = hasAvatarImage ? (avatarPreview || profile.avatar) : fallbackSrc
                return (
                  <div
                    className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
                    style={
                      hasAvatarImage
                        ? undefined
                        : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                    }
                  >
                    <img
                      src={avatarSrc}
                      alt="Profile avatar"
                      className={`w-full h-full ${hasAvatarImage ? 'object-cover' : 'object-contain'}`}
                      onError={(e) => {
                        e.currentTarget.src = fallbackSrc
                      }}
                    />
                  </div>
                )
              })()}
            </div>
            {/* Avatar upload button - Only show for own profile */}
            {!isViewingOtherUser && (
              <>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Change avatar"
                  className="absolute bottom-3 right-1 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#884DFF] text-white shadow-lg border-2 border-[#884DFF] hover:bg-[#7A3FEF] transition-colors disabled:opacity-50"
                  disabled={uploadingAvatar}
                >
                  {/* {uploadingAvatar ? (
                    <Spin size="small" />
                  ) : ( */}
                  <Camera size={16} />
                  {/* )} */}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Action Bar - Below Banner, Dark Background, Positioned Right of Profile Picture */}
        <div className="px-4 md:px-6 py-4 ml-0 md:ml-[180px]">
          <div className="flex items-center justify-end ">
            <div className="flex items-center gap-3">
              {!editing && (
                <>
                  <Button className="!text-white !bg-gradient-to-r !from-[#2B007F] !to-[#4E00E5] !border-none !rounded-full !px-6 !h-10 !text-sm md:!text-base !font-semibold shadow-lg hover:!brightness-110">
                    Follow
                  </Button>
                  <Button
                    className="!w-10 !h-10 !rounded-full !bg-white/5 !border !border-white/30 !text-white hover:!bg-white/10"
                    icon={<MessageSquareText size={18} />}
                    aria-label="Message"
                  />
                  <Button
                    className="!w-10 !h-10 !rounded-full !bg-white/5 !border !border-white/30 !text-white hover:!bg-white/10"
                    icon={<Share2 size={18} />}
                    aria-label="Share"
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 ml-2">
              {!editing && !isViewingOtherUser && (
                <Button
                  className="!text-white !border-white !bg-[#FFFFFF1A] hover:!bg-[#FFFFFF1A] !rounded-full !px-4 !h-10 flex items-center gap-2"
                  onClick={handleEditClick}
                >
                  <span className="md:inline">Edit Profile</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* User Info Section - Below Action Bar */}
        <div className="">
          <div className="ml-0 ">
            <div className="space-y-2 md:space-y-3">
              <div className="text-white text-xl md:text-2xl font-semibold leading-tight">{profile.name || "Anonymous"}</div>
              <div className="text-[#9BA3AF] text-sm md:text-base">@{profile.username || "username"}</div>
              <div className="flex flex-wrap gap-4 text-xs md:text-sm text-[#9BA3AF]">
                <span>
                  <span className="text-white font-semibold">0</span> Followers
                </span>
                <span>
                  <span className="text-white font-semibold">0</span> Following
                </span>
              </div>
              {profile.bio && (
                <p className="text-[#C3C7D0] text-sm md:text-base max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Tabs Section with Full Width Border */}
      <div className="-mx-4 md:-mx-6 px-4 md:px-6 border-b border-white/10">
        <div className="py-4 sm:py-6">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto">
            {/* {['About', 'Posts', 'Portfolio'].map((tab) => ( */}
            {['About', 'Posts', 'Portfolio', 'NFTs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm sm:text-base font-medium transition-colors font-exo2 whitespace-nowrap ${activeTab === tab
                  ? 'text-white border-b-2 border-[#7E6BEF] pb-2'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      {!editing ? (
        <div className="pb-24 md:pb-6">
          {activeTab === 'About' && (
            <>
              {/* Personal Details */}
              <div className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] mb-6">
                <div className="px-5 py-4 text-[24px] text-white font-semibold">
                  Personal Details
                </div>
                <div className="p-5 text-sm">
                  <div className="">
                    <Field label="Name:" value={`${profile.name} @${profile.username}`} />
                    <div className="border-b border-[#2A2F4A]"></div>
                    <Field label="Email:" value={profile.email} />
                    <div className="border-b border-[#2A2F4A]"></div>
                    <Field label="Country:" value={profile.country} />
                    <div className="border-b border-[#2A2F4A]"></div>
                    <Field
                      label="Interests:"
                      value={Array.isArray(profile.interests)
                        ? profile.interests.join(", ")
                        : profile.interests || ""}
                    />
                    <div className="border-b border-[#2A2F4A]"></div>
                    <Field label="User Since:" value={profile.joined} />
                  </div>
                </div>
              </div>

              {/* Links + Stats */}
              {/* <div className="space-y-6">
              
                <div className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] mb-6">
                  <div className="px-5 py-4 text-[24px] text-white font-[700]">
                    Stats
                  </div>
                  <div className="p-5">
                    <Field label="Posts Views:" value={profile.stats.posts} />
                    <div className="border-b border-[#2A2F4A]"></div>
                    <Field label="Projects:" value={profile.stats.projects} />
                    <div className="border-b border-[#2A2F4A]"></div>
                    <Field label="Contributions:" value={profile.stats.contributions} />
                  </div>
                </div>
              </div> */}
            </>
          )}

          {activeTab === 'NFTs' && (
            <div className="space-y-6">
              {/* Filter Section */}
              <div className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-semibold">Filter by Status</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setNftStatusFilter(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${nftStatusFilter === null
                      ? 'bg-[#7E6BEF] text-white'
                      : 'bg-[#1A183A] text-gray-400 hover:text-white'
                      }`}
                  >
                    All
                  </button>
                  {/* <button
                    onClick={() => setNftStatusFilter(1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      nftStatusFilter === 1
                        ? 'bg-[#7E6BEF] text-white'
                        : 'bg-[#1A183A] text-gray-400 hover:text-white'
                    }`}
                  >
                    Minted
                  </button>
                  <button
                    onClick={() => setNftStatusFilter(2)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      nftStatusFilter === 2
                        ? 'bg-[#7E6BEF] text-white'
                        : 'bg-[#1A183A] text-gray-400 hover:text-white'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setNftStatusFilter(3)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      nftStatusFilter === 3
                        ? 'bg-[#7E6BEF] text-white'
                        : 'bg-[#1A183A] text-gray-400 hover:text-white'
                    }`}
                  >
                    Put on Sale
                  </button> */}
                </div>
              </div>

              {/* NFTs Grid */}
              {isLoadingNFTs ? (
                <div className="flex justify-center items-center py-20">
                  <Spin size="large" />
                </div>
              ) : filteredNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredNFTs.map((nft) => {
                    const nftId = nft._id || nft.id
                    const nftName = nft.itemName || nft.name || 'Unnamed NFT'
                    const nftImage = nft.imageUrl || nft.image || '/assets/card-icon.png'
                    const nftPrice = nft.price ? `${nft.price} AVAX` : '0 AVAX'
                    const statusLabel = nft.nftStatus === 1 ? 'Minted' : nft.nftStatus === 2 ? 'Approved' : nft.nftStatus === 3 ? 'Put on Sale' : 'Unknown'
                    const collectionId = nft.collectionId?._id || nft.collectionId?.id || nft.collectionId || ''

                    return (
                      <div
                        key={nftId}
                        className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] overflow-hidden hover:border-[#7E6BEF] transition-colors relative"
                      >
                        <div
                          // onClick={() => {
                          //   if (nftId) {
                          //     const url = collectionId 
                          //       ? `/marketplace/nft/${nftId}?collectionId=${collectionId}`
                          //       : `/marketplace/nft/${nftId}`
                          //     router.push(url)
                          //   }
                          // }}
                          className="relative w-full aspect-square bg-gradient-to-b from-[#4F01E6] to-[#020019] cursor-pointer"
                        >
                          <Image
                            src={nftImage}
                            alt={nftName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/card-icon.png'
                            }}
                          />
                          {nft.isPurchased && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/80 text-white text-xs font-semibold rounded">
                              Purchased
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4
                            onClick={() => {
                              if (nftId) {
                                const url = collectionId 
                                  ? `/marketplace/nft/${nftId}?collectionId=${collectionId}`
                                  : `/marketplace/nft/${nftId}`
                                router.push(url)
                              }
                            }}
                            className="text-white font-semibold text-sm mb-1 truncate cursor-pointer hover:text-[#7E6BEF] transition-colors"
                          >
                            {nftName}
                          </h4>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#7E6BEF] text-xs font-medium">{statusLabel}</span>
                            <span className="text-gray-400 text-xs">{nftPrice}</span>
                          </div>
                          {/* Action Buttons - Only show for own profile */}
                          {!isViewingOtherUser && (
                            <div className="flex gap-2 mt-2">
                              {/* Put on Sale Button - Show only for approved (status 2) NFTs */}
                              {nft.nftStatus === 2 && (
                                <Button
                                  type="primary"
                                  size="small"
                                  loading={updatingNFTId === nftId}
                                  onClick={(e) => handleOpenPutOnSaleModal(nft, e)}
                                  className="!flex-1 !bg-[#7E6BEF] !border-none !text-white !rounded-lg !h-8 !text-xs !font-semibold hover:!bg-[#6C5AE8] transition-colors"
                                >
                                  {updatingNFTId === nftId ? 'Updating...' : 'Put on Sale...'}
                                </Button>
                              )}
                              {/* Reset Status Button - Show only for NFTs that are already on sale (status 3) */}
                              {nft.nftStatus === 1 && (
                                <Button
                                  type="default"
                                  size="small"
                                  loading={resettingNFTId === nftId}
                                  onClick={(e) => handleNFTStatus(nftId, nft?.nftStatus, e)}
                                  className="!flex-1 !bg-[#1A183A] !border !border-[#7E6BEF] !text-white !rounded-lg !h-8 !text-xs !font-semibold hover:!bg-[#2A1F4A] transition-colors"
                                >
                                  {resettingNFTId === nftId ? 'Resetting...' : 'Reset to Minted'}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] p-12 text-center">
                  <p className="text-gray-400 text-lg">No NFTs found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {nftStatusFilter !== null
                      ? `No NFTs with status "${nftStatusFilter === 1 ? 'Minted' : nftStatusFilter === 2 ? 'Approved' : nftStatusFilter === 3 ? 'Put on Sale' : 'Unknown'}"`
                      : 'This user has no NFTs yet'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] mb-12 font-exo2 pb-6">
          <div className="px-5 pt-4 text-[24px] text-white font-semibold pb-4">
            Your Profile
          </div>
          <p className="px-5 py-2 text-[#9BA3AF] text-[12px] font-[500]">
            Please update your profile settings here
          </p>
          <div className="w-full h-px bg-[#2A2F4A] my-4"></div>
          <div className="p-5">
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                name: profile.name || user?.name || "",
                username: profile.username || user?.username || "",
                email: profile.email || user?.email || "",
                country: profile.country || user?.country || "",
                phone: profile?.phone || user?.phoneNumber || user?.phone || "",
                profession: profile.profession || "",
                interests: Array.isArray(profile.interests)
                  ? profile.interests
                  : profile.interests ? [profile.interests] : [],
                bio: profile.bio || user?.bio || "",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item
                  label={<span className="text-white text-sm">Display Name</span>}
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Display Name"
                    className="!bg-[#0B0926] !border !border-[#FFFFFF1A] !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="text-white text-sm">User Name</span>}
                  name="username"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="User Name"
                    className="!bg-[#0B0926] !border !border-[#FFFFFF1A] !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white text-sm ">Email-ID</span>}
                  name="email"
                  rules={[{ type: "email", required: true }]}
                >
                  <Input
                    placeholder="Email-ID"
                    className="!bg-[#0B0926] !border !border-[#FFFFFF1A] !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="text-white text-sm">Country</span>}
                  name="country"
                >
                  <Select
                    showSearch
                    suffixIcon={<span className="text-white">▼</span>}
                    options={countries.map((c) => ({ value: c, label: c }))}
                    placeholder="Select Country"
                    className="!bg-[#0B0926] !text-white !rounded-lg !h-12 !border !border-none !outline-none [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border !border-none [&_.ant-select-selector]:!bg-[#0B0926] [&_.ant-select-selector]:!text-white [&_.ant-select-selector]:!placeholder-[#6B7280] [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!justify-center [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!align-center [&_.ant-select-selection-placeholder]:!block  [&_.ant-select-selection-placeholder]:!z-10 [&_.ant-select-selection-placeholder]:!text-[#6B7280] [&_.ant-select-placeholder]:!text-white/60 [&_.ant-select-arrow]:!text-white [&_.ant-select-selection-item]:!text-white"
                    dropdownStyle={{
                      backgroundColor: "#0B0926",
                      // border: "1px solid #FFFFFF1A",
                      borderRadius: "12px",
                    }}
                    dropdownRender={(menu) => (
                      <div
                        className="bg-[#0B0926] text-white [&_.ant-select-item]:!bg-[#0B0926] [&_.ant-select-item]:!text-white [&_.ant-select-item-option-active]:!bg-[#1A183A] [&_.ant-select-item-option-selected]:!bg-[#1A183A] [&_.ant-select-item-option-selected]:!text-white"
                      >
                        {menu}
                      </div>
                    )}
                    style={{ color: "white", borderColor: "#FFFFFF1A !important" }}
                  />
                </Form.Item>


                <Form.Item
                  label={<span className="text-white text-sm">Phone No.</span>}
                  className="col-span-1 sm:col-span-2"
                >
                  <div className="flex items-center gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-2 px-3 py-2.5 border border-[#FFFFFF1A] rounded-xl bg-[#0B0926] text-white hover:bg-[#1A183A] transition-colors min-w-[110px] justify-between h-12"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{countryCodes.find(c => c.code === countryCode)?.flag || '🇺🇸'}</span>
                          <span className="text-sm font-exo2">{countryCode}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-hidden flex flex-col bg-[#0B0926] border border-[#FFFFFF1A] rounded-xl shadow-2xl z-50">
                          {/* Search Input */}
                          <div className="p-2 border-b border-[#FFFFFF1A] sticky top-0 bg-[#0B0926]">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search country..."
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full pl-10 pr-3 py-2 bg-[#1A183A] border border-[#FFFFFF1A] rounded-lg text-white text-sm font-exo2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Country List */}
                          <div className="overflow-y-auto scrollbar-hide flex-1">
                            <div className="p-2">
                              {countryCodes
                                .filter((country) => {
                                  const query = countrySearchQuery.toLowerCase()
                                  return (
                                    country.country.toLowerCase().includes(query) ||
                                    country.code.includes(query) ||
                                    country.flag.includes(query)
                                  )
                                })
                                .map((country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                      setCountryCode(country.code)
                                      setShowCountryDropdown(false)
                                      setCountrySearchQuery('')
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1A183A] transition-colors ${countryCode === country.code ? 'bg-[#4A01D8]/30' : ''
                                      }`}
                                  >
                                    <span className="text-xl">{country.flag}</span>
                                    <span className="text-white text-sm font-exo2 flex-1 text-left">
                                      {country.code}
                                    </span>
                                    {countryCode === country.code && (
                                      <span className="text-purple-400 text-xs">✓</span>
                                    )}
                                  </button>
                                ))}
                              {countryCodes.filter((country) => {
                                const query = countrySearchQuery.toLowerCase()
                                return (
                                  country.country.toLowerCase().includes(query) ||
                                  country.code.includes(query) ||
                                  country.flag.includes(query)
                                )
                              }).length === 0 && (
                                  <div className="px-4 py-3 text-gray-400 text-sm font-exo2 text-center">
                                    No country found
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Input */}
                    <Form.Item
                      name="phone"
                      noStyle
                      normalize={(value) => value ? value.replace(/\D/g, '') : value}
                    >
                      <Input
                        placeholder="Enter phone number"
                        className="flex-1 !bg-[#0B0926] !border !border-[#FFFFFF1A] !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
                        type="tel"
                        maxLength={15}
                        onBlur={handlePhoneBlur}
                      />
                    </Form.Item>
                  </div>
                </Form.Item>

                <Form.Item
                  label={<span className="text-white text-sm">Interest</span>}
                  name="interests"
                  className="col-span-1 sm:col-span-2"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    suffixIcon={<span className="text-white">▼</span>}
                    placeholder="Select Categories"
                    className="!bg-[#0B0926] !border !border-[#FFFFFF1A] text-white !text-white !rounded-xl placeholder:text-[#6B7280] !outline-none [&_.ant-select-selector]:!border !border-[#FFFFFF1A] [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!justify-center [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!align-center [&_.ant-select-selection-placeholder]:!text-[#6B7280] [&_.ant-select-selector]:!bg-[#0B0926] [&_.ant-select-selection-item]:!bg-[#1A183A] [&_.ant-select-selection-item]:!text-white [&_.ant-select-selection-item]:!border-none [&_.ant-select-selection-item]:!flex [&_.ant-select-selection-item]:!items-center [&_.ant-select-selection-item]:!my-1 [&_.ant-select-selection-item-remove]:!text-white [&_.ant-select-selection-item-remove:hover]:!text-white [&_.ant-select-arrow]:!text-white"
                    dropdownStyle={{
                      backgroundColor: "#0B0926",
                      // border: "1px solid #FFFFFF1A",
                      borderRadius: "12px",
                      color: "white !important",
                    }}
                    dropdownRender={(menu) => (
                      <div
                        className="bg-[#0B0926] text-white "
                      >
                        {/* Override each dropdown item */}
                        <div className="[&_.ant-select-item]:!bg-[#0B0926] [&_.ant-select-item]:!text-white [&_.ant-select-item-option-active]:!bg-[#1A183A] [&_.ant-select-item-option-selected]:!bg-[#1A183A] [&_.ant-select-item-option-selected]:!text-white">
                          {menu}
                        </div>
                      </div>
                    )}
                    style={{ color: "white !important" }}
                    options={[
                      { value: "DeFi", label: "DeFi" },
                      { value: "NFTs", label: "NFTs" },
                      { value: "Layer2", label: "Layer2" },
                      { value: "CryptoGaming", label: "CryptoGaming" },
                      { value: "technology", label: "Technology" },
                      { value: "crypto", label: "Crypto" },
                      { value: "web3", label: "Web3" },
                    ]}
                  />
                </Form.Item>


                <Form.Item
                  label={<span className="text-white text-sm">Your Bio</span>}
                  name="bio"
                  className="col-span-1 sm:col-span-2"
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Bio"
                    className="!bg-[#0B0926] !border !border-[#FFFFFF1A] !text-white !rounded-xl !p-4 [&_.ant-input]:!placeholder-[#6B7280] [&_.ant-input]:!text-white [&_.ant-input::placeholder]:!text-[#6B7280]"
                    maxLength={325}
                    showCount={{
                      formatter: ({ count }) => (
                        <span className="text-[#6B7280] text-xs">
                          {325 - count} characters remaining
                        </span>
                      ),
                    }}
                  />
                </Form.Item>
              </div>
            </Form>
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                className="!text-white !bg-[#FFFFFF1A] !rounded-full !px-6 !h-11"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="!text-white !rounded-full !px-8 !h-11"
                onClick={onSave}
                loading={saving}
                disabled={saving}
                style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* footer fixed */}
      <div className="p-4 mt-4 bg-[#020019] border-t border-[#2A2F4A] fixed bottom-0 left-0 right-0 w-full">
        <div className="flex items-center justify-between">
          <div className="text-[#FFFFFF] text-[12px] md:text-[16px] font-[500]">© 2025 21 Spades. All Rights Reserved.</div>
          <div className="text-[#FFFFFF] text-[12px] md:text-[16px] font-[500]">
            <a href="#" className="mr-2 hover:underline ">Marketplace</a>
            <a href="#" className="mr-2 hover:underline ">License</a>
            <a href="#" className="hover:underline ">Terms of Use</a>
          </div>
        </div>
      </div>

      {/* Put on Sale Modal */}
      <Modal
        open={isPutOnSaleModalOpen}
        onCancel={handleClosePutOnSaleModal}
        footer={null}
        centered
        width={800}
        className="put-on-sale-modal"
        styles={{
          content: {
            background: '#090721',
            borderRadius: '16px',
            border: '1px solid #6B7280',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <div className="space-y-6 font-exo2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-b from-[#5A21FF] to-[#7E6BEF] bg-clip-text text-transparent">
              Put NFT on Sale
            </h2>
            <button
              onClick={handleClosePutOnSaleModal}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Select Method */}
          <div className="w-full">
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
          <div>
            <h2 className="text-white text-sm font-medium mb-2">
              Price (AVAX)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#9BA3AF] text-xs font-semibold mb-2">Enter AVAX Price</p>
                <div className="h-12 bg-[#0B0926] border border-[#A3AED033] rounded-lg flex items-center justify-between px-4">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fixedPrice || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setFixedPrice(value)
                      }
                    }}
                    onKeyPress={(e) => {
                      const char = String.fromCharCode(e.which || e.keyCode)
                      if (!/[0-9.]/.test(char) && !e.ctrlKey && !e.metaKey && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab' && e.key !== 'Enter') {
                        e.preventDefault()
                      }
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
                <div className="h-12 bg-[#0B0926] border border-[#A3AED033] rounded-lg flex items-center justify-between px-4">
                  <span className="text-white text-base font-semibold">
                    {convertedUsdtValue ? convertedUsdtValue : "0.00"}
                  </span>
                  <span className="text-[#6B7280] text-sm">USDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Auction Date Fields */}
          {selectedMethod === "Time Auction" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Starting Date & Time */}
                <div>
                  <h2 className="text-white text-sm font-medium mb-2">Starting Date & Time</h2>
                  <DatePicker
                    value={startingDate && startingDate.isValid() ? startingDate : null}
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
                    className="!w-full !h-12 [&_.ant-picker-input]:!bg-[#0B0926] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input]:!font-exo2 [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#0B0926] !border-[#A3AED033] !rounded-lg [&_.ant-picker-suffix]:!text-white"
                    popupClassName="date-picker-custom [&_.ant-picker-dropdown]:!bg-[#090721] [&_.ant-picker-panel]:!bg-[#090721] [&_.ant-picker-header]:!bg-[#090721] [&_.ant-picker-header]:!border-[#A3AED033] [&_.ant-picker-content]:!bg-[#090721] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF] [&_.ant-picker-time-panel]:!bg-[#090721] [&_.ant-picker-time-panel-column]:!bg-[#090721] [&_.ant-picker-time-panel-cell]:!text-white [&_.ant-picker-time-panel-cell-selected]:!bg-[#5A21FF] [&_.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-header-view]:!text-white [&_.ant-picker-month-btn]:!text-white [&_.ant-picker-year-btn]:!text-white [&_.ant-picker-decade-btn]:!text-white [&_.ant-picker-time-panel-column>li]:!text-white [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected]:!bg-[#5A21FF] [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected]:!text-white [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-time-panel-column>li:hover]:!bg-[#5A21FF]/30 [&_.ant-picker-week-panel-header]:!bg-[#090721] [&_.ant-picker-week-panel-header>th]:!text-white [&_thead.ant-picker-week-panel-header>tr>th]:!text-white [&_thead.ant-picker-week-panel-header>tr>th>span]:!text-white [&_.ant-picker-week-panel-header>th>span]:!text-white [&_.ant-picker-week-panel-row>th]:!text-white"
                    suffixIcon={<Calendar className="h-4 w-4 text-white" />}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  />
                </div>

                {/* Expiration Date & Time */}
                <div>
                  <h2 className="text-white text-sm font-medium mb-2">Expiration Date & Time</h2>
                  <DatePicker
                    value={expirationDate && expirationDate.isValid() ? expirationDate : null}
                    onChange={(date) => setExpirationDate(date)}
                    showTime={{
                      format: 'HH:mm',
                      minuteStep: 1,
                    }}
                    disabledDate={(current) => {
                      if (!current) return false
                      if (current < dayjs().startOf('day')) return true
                      if (startingDate && startingDate.isValid() && current < startingDate.startOf('day')) return true
                      return false
                    }}
                    disabledTime={(current) => {
                      if (!current || !startingDate || !startingDate.isValid()) return {}
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
                    className="!w-full !h-12 [&_.ant-picker-input]:!bg-[#0B0926] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input]:!font-exo2 [&_.ant-picker-input>input::placeholder]:!text-[#6B7280] !bg-[#0B0926] !border-[#A3AED033] !rounded-lg [&_.ant-picker-suffix]:!text-white"
                    popupClassName="date-picker-custom [&_.ant-picker-dropdown]:!bg-[#090721] [&_.ant-picker-panel]:!bg-[#090721] [&_.ant-picker-header]:!bg-[#090721] [&_.ant-picker-header]:!border-[#A3AED033] [&_.ant-picker-content]:!bg-[#090721] [&_.ant-picker-cell]:!text-white [&_.ant-picker-cell-in-view.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-cell-in-view.ant-picker-cell-today_.ant-picker-cell-inner]:!border-[#5A21FF] [&_.ant-picker-time-panel]:!bg-[#090721] [&_.ant-picker-time-panel-column]:!bg-[#090721] [&_.ant-picker-time-panel-cell]:!text-white [&_.ant-picker-time-panel-cell-selected]:!bg-[#5A21FF] [&_.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-header-view]:!text-white [&_.ant-picker-month-btn]:!text-white [&_.ant-picker-year-btn]:!text-white [&_.ant-picker-decade-btn]:!text-white [&_.ant-picker-time-panel-column>li]:!text-white [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected]:!bg-[#5A21FF] [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected]:!text-white [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!bg-[#5A21FF] [&_.ant-picker-time-panel-column>li.ant-picker-time-panel-cell-selected_.ant-picker-time-panel-cell-inner]:!text-white [&_.ant-picker-time-panel-column>li:hover]:!bg-[#5A21FF]/30 [&_.ant-picker-week-panel-header]:!bg-[#090721] [&_.ant-picker-week-panel-header>th]:!text-white [&_thead.ant-picker-week-panel-header>tr>th]:!text-white [&_thead.ant-picker-week-panel-header>tr>th>span]:!text-white [&_.ant-picker-week-panel-header>th>span]:!text-white [&_.ant-picker-week-panel-row>th]:!text-white"
                    suffixIcon={<Calendar className="h-4 w-4 text-white" />}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Toggle Options */}
          <div>
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

          {/* Choose Collection */}
          <div>
            <h2 className="text-white text-sm font-medium mb-2">Collection <span className="text-[#884DFF] text-2xl">*</span></h2>
            <p className="text-[#A3AED0] text-xs mb-4">Choose a collection.</p>

            <div
              className={collections.length > 4 ? "collections-scroll pr-2" : ""}
              style={{
                height: collections.length > 4 ? '300px' : 'auto',
                maxHeight: collections.length > 4 ? '300px' : 'none',
                overflowY: collections.length > 4 ? 'auto' : 'visible',
                overflowX: 'hidden',
                scrollbarWidth: collections.length > 4 ? 'thin' : 'none',
                scrollbarColor: collections.length > 4 ? '#5A21FF #0B0926' : 'transparent transparent',
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
                {isLoadingCollections ? (
                  <div className="col-span-5 text-center py-8">
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

                    return (
                      <button
                        key={collectionId}
                        type="button"
                        onClick={() => {
                          setSelectedCollection(collectionId)
                          setSelectedCollectionAddress(collectionAddress)
                        }}
                        className={`group relative flex h-full overflow-hidden rounded-2xl duration-300 border-2 ${
                          isSelected
                            ? "border-[#6C4DFF] shadow-[0_12px_30px_rgba(108,77,255,0.35)]"
                            : "border-transparent hover:border-[#6C4DFF]/60"
                        }`}
                      >
                        <div className="relative h-[120px] sm:h-[140px] w-full rounded-xl sm:rounded-2xl">
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
                          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3">
                            <p className="text-white text-xs sm:text-sm font-semibold truncate">{collectionName}</p>
                            <p className="text-[10px] sm:text-xs text-[#C5C9FF]/80">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="col-span-5 text-center py-8">
                    <p className="text-[#9BA3AF]">No collections found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleClosePutOnSaleModal}
              className="!flex-1 !h-12 !bg-transparent !border-[#6B7280] !text-white !rounded-xl hover:!bg-[#1a1a2e]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateNFT}
              loading={updatingNFTId === (selectedNFTForSale?._id || selectedNFTForSale?.id)}
              disabled={updatingNFTId === (selectedNFTForSale?._id || selectedNFTForSale?.id)}
              className="!flex-1 !h-12 !bg-gradient-to-r !from-[#5A21FF] !to-[#7E6BEF] !border-none !text-white !rounded-xl hover:!opacity-90 !font-semibold"
            >
              {updatingNFTId === (selectedNFTForSale?._id || selectedNFTForSale?.id) ? 'Updating...' : 'Update Item'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between py-2">
      <div className="text-[#FFFFFFB2] text-[16px] font-[500] mb-1">{label}</div>
      <div className="text-[#FFFFFFB2] text-[16px] font-[500]">{value ?? "-"}</div>
    </div>
  )
}