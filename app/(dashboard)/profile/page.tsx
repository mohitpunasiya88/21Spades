
"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/authStore"
import { Button, Form, Input, Select, Tabs, Dropdown, Spin } from "antd"
import { useMessage } from "@/lib/hooks/useMessage"
import { Share2, Camera, MessageSquareText, ChevronDown, Search } from "lucide-react"
import defaultCoverImage from "@/components/assets/profile-bg.jpg"
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { countryCodes } from '@/lib/constants/countryCodes'
import { apiCaller } from "@/app/interceptors/apicall/apicall"
import authRoutes from "@/lib/routes"
import { useWallet } from "@/app/hooks/useWallet"

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
  
  // NFTs state
  const [nfts, setNfts] = useState<any[]>([])
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)
  const [nftStatusFilter, setNftStatusFilter] = useState<number | null>(null) // 1: minted, 2: approved, 3: put_on_sale
  const [updatingNFTId, setUpdatingNFTId] = useState<string | null>(null) // Track which NFT is being updated
  const [resettingNFTId, setResettingNFTId] = useState<string | null>(null) // Track which NFT is being reset
  const [form] = Form.useForm()
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

  // Update NFT status to "Put on Sale" (3)
  const handlePutOnSale = async (nftId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    
    try {
      setUpdatingNFTId(nftId)
      
      // Update NFT status to 3 (Put on Sale) - send nftStatus field
      const updatePayload = {
        nftStatus: 3,
        putOnSale: 1
      }

      const updateResponse = await apiCaller('PUT', `${authRoutes.updateNFT}/${nftId}`, updatePayload, true)
      
      if (updateResponse.success) {
        message.success('NFT status updated to "Put on Sale"')
        
        // Update local state
        setNfts(prevNfts => 
          prevNfts.map(nft => 
            (nft._id || nft.id) === nftId 
              ? { ...nft, nftStatus: 3, putOnSale: 1 }
              : nft
          )
        )
      } else {
        message.error(updateResponse.message || 'Failed to update NFT status')
      }
    } catch (error: any) {
      console.error('Error updating NFT status:', error)
      message.error(error?.response?.data?.message || error?.message || 'Failed to update NFT status')
    } finally {
      setUpdatingNFTId(null)
    }
  }

  // Reset NFT status to 2 (Approved) from Put on Sale
  const handleResetStatus = async (nftId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    
    try {
      setResettingNFTId(nftId)
      
      // Reset NFT status to 2 (Approved) using reset-status endpoint
      // Backend expects nftStatus field in payload
      const resetPayload = {
        nftStatus: 2
      }
      
      const resetResponse = await apiCaller('PUT', `${authRoutes.resetNFTStatus}/${nftId}/reset-status`, resetPayload, true)
      
      if (resetResponse.success) {
        message.success('NFT status reset to "Approved"')
        
        // Update local state
        setNfts(prevNfts => 
          prevNfts.map(nft => 
            (nft._id || nft.id) === nftId 
              ? { ...nft, nftStatus: 2, putOnSale: 0 }
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
          avatar: userData.profilePicture || user?.profilePicture || user?.avatar || "/post/card-21.png",
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
        
        // Get phone number - prioritize API response
        const phoneNumber = userData.phoneNumber || userData.phone || profile.phone || user?.phoneNumber || user?.phone || ""
        
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
        <div className="relative h-40 md:h-48 w-full bg-gradient-to-r from-purple-800/30 to-yellow-500/10">
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
          {!uploadingCover && (coverPreview || profile.coverPicture) ? (
            <img
              src={coverPreview || profile.coverPicture}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover opacity-90 rounded-xl"
              onError={(e) => {
                console.error('Cover image error, using fallback:', e)
                e.currentTarget.src = defaultCoverImage.src
              }}
            />
          ) : !uploadingCover ? (
            <Image
              src={defaultCoverImage.src}
              alt="Cover"
              fill
              priority
              className="object-cover opacity-90 rounded-xl"
              sizes="100vw"
            />
          ) : null}

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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      nftStatusFilter === null
                        ? 'bg-[#7E6BEF] text-white'
                        : 'bg-[#1A183A] text-gray-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
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
                  </button>
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

                    return (
                      <div
                        key={nftId}
                        className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] overflow-hidden hover:border-[#7E6BEF] transition-colors relative"
                      >
                        <div 
                          onClick={() => nftId && router.push(`/marketplace/nft/${nftId}`)}
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
                            onClick={() => nftId && router.push(`/marketplace/nft/${nftId}`)}
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
                                  onClick={(e) => handlePutOnSale(nftId, e)}
                                  className="!flex-1 !bg-[#7E6BEF] !border-none !text-white !rounded-lg !h-8 !text-xs !font-semibold hover:!bg-[#6C5AE8] transition-colors"
                                >
                                  {updatingNFTId === nftId ? 'Updating...' : 'Put on Sale'}
                                </Button>
                              )}
                              {/* Reset Status Button - Show only for NFTs that are already on sale (status 3) */}
                              {nft.nftStatus === 3 && (
                                <Button
                                  type="default"
                                  size="small"
                                  loading={resettingNFTId === nftId}
                                  onClick={(e) => handleResetStatus(nftId, e)}
                                  className="!flex-1 !bg-[#1A183A] !border !border-[#7E6BEF] !text-white !rounded-lg !h-8 !text-xs !font-semibold hover:!bg-[#2A1F4A] transition-colors"
                                >
                                  {resettingNFTId === nftId ? 'Resetting...' : 'Reset to Approved'}
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
                phone: profile.phone || user?.phoneNumber || user?.phone || "",
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
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1A183A] transition-colors ${
                                      countryCode === country.code ? 'bg-[#4A01D8]/30' : ''
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