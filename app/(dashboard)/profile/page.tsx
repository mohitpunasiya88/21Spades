"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuthStore } from "@/lib/store/authStore"
import { Button, Form, Input, Select, Tabs, Avatar, message, Dropdown, Spin } from "antd"
import { Edit2, Share2, MoreHorizontal, Link, MessageCircle, Space, Camera, MessageSquareCode, MessageSquareText } from "lucide-react"
import defaultCoverImage from "@/components/assets/profile-bg.jpg"
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const countries = [
  "United States",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
]

export default function ProfilePage() {
  const { user, getProfile, updateProfile, incrementProfileView } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('Items')
  const [form] = Form.useForm()
  const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    country: "",
    location: "",
    profession: "",
    joined: "",
    website: "",
    links: {
      facebook: "",
      instagram: "",
      x: "",
    },
    stats: {
      posts: 0,
      projects: 0,
      contributions: 0,
    },
    bio: "",
    interests: [] as string[],
    cover: defaultCoverImage.src,
    avatar: "/assets/avatar.jpg",
  })

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData()
    incrementProfileView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      setProfileLoading(true)
      const profileData = await getProfile()
      
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
          cover: userData.cover || defaultCoverImage.src,
          avatar: userData.profilePicture || user?.profilePicture || user?.avatar || "/assets/avatar.jpg",
        })
        
        // Update form initial values
        form.setFieldsValue({
          name: userData.name || user?.name || "",
          username: userData.username || user?.username || "",
          email: userData.email || user?.email || "",
          country: userData.country || "",
          phone: userData.phone || userData.phoneNumber || "",
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
        setProfile({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          country: user.country || "",
          location: "",
          profession: "",
          joined: "",
          website: "",
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
          cover: defaultCoverImage.src,
          avatar: user.avatar || user.profilePicture || "/assets/avatar.jpg",
        })
      }
    } finally {
      setProfileLoading(false)
    }
  }

  const onSave = async () => {
    try {
      setSaving(true)
      const values = await form.validateFields()
      
      // Extract phone number and country code from phone field
      let phoneNumber = ""
      let countryCode = user?.countryCode || "+1"
      
      if (values.phone) {
        // If phone starts with country code, extract it
        if (values.phone.startsWith("+")) {
          const parts = values.phone.split(" ")
          if (parts.length > 1) {
            countryCode = parts[0]
            phoneNumber = parts.slice(1).join("")
          } else {
            phoneNumber = values.phone.replace(/^\+/, "")
          }
        } else {
          phoneNumber = values.phone
        }
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
      
      // Prepare profile update payload as per API requirements
      const updatePayload = {
        email: values.email || user?.email || "",
        name: values.name || "",
        username: values.username || "",
        phoneNumber: phoneNumber || user?.phoneNumber || "",
        countryCode: countryCode || user?.countryCode || "+1",
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
      
      console.log('Profile update payload:', updatePayload)
      
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

  // Handle edit button click - populate form with current profile data
  const handleEditClick = () => {
    // Convert interests to array format for the form
    let interestsArray: string[] = []
    if (profile.interests) {
      if (Array.isArray(profile.interests)) {
        interestsArray = profile.interests
      }
    } else if (user?.interests) {
      interestsArray = Array.isArray(user.interests) ? user.interests : []
    }
    
    form.setFieldsValue({
      name: profile.name,
      username: profile.username,
      email: profile.email,
      country: profile.country,
      phone: user?.phone || user?.phoneNumber || "",
      profession: profile.profession,
      interests: interestsArray,
      bio: profile.bio,
    })
    setEditing(true)
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020019]">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6 py-6 mt-4 space-y-4 md:space-y-6 bg-[#020019] font-exo2">
      {/* Main Profile Container */}
      <div className="relative rounded-xl overflow-hidden ">
        {/* Header / Cover Banner */}
        <div className="relative h-40 md:h-48 w-full bg-gradient-to-r from-purple-800/30 to-yellow-500/10">
          {/* Fallback cover image */}
          <Image
            src={profile.cover}
            alt="Cover"
            fill
            priority
            className="object-cover opacity-90 rounded-xl"
            sizes="100vw"
          />
          
          {/* Social Media Icons on Right Side */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 z-10">
            <a
              href={profile.links.instagram || "#"}
              target={profile.links.instagram ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 bg-black/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram className="text-xl text-black" />
            </a>
            <a
              href={profile.links.x || "#"}
              target={profile.links.x ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="text-xl text-black" />
            </a>
            <a
              href={profile.links.facebook || "#"}
              target={profile.links.facebook ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-xl text-black" />
            </a>
          </div>
        </div>

        {/* Profile Picture - Far Left, Overlapping Banner */}
        <div className="relative px-1 md:px-2-mt-24 md:-mt-28">
          <div className="relative flex-shrink-0 w-[120px] h-[120px] md:w-[160px] md:h-[160px]">
            <div className="relative w-full h-full rounded-full p-[1px] md:p-[3px] bg-gradient-to-br from-[#8D5AFE] to-[#B98CFF] shadow-xl">
              <Avatar
                size={160}
                src={profile.avatar}
                className="!rounded-full !w-full !h-full "
              />
            </div>
            <button
              aria-label="Change avatar"
              className="absolute bottom-3 right-1 flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#884DFF] text-white shadow-lg border-2 border-[#884DFF]"
            >
              <Camera size={16} />
            </button>
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
              {!editing ? (
                <>
                  <Button
                    className="!text-white !border-white !bg-[#FFFFFF1A] hover:!bg-[#FFFFFF1A] !rounded-full !px-4 !h-10 flex items-center gap-2  "
                    onClick={handleEditClick}
                  >
                    <span className="hidden md:inline">Edit Profile</span>
                  </Button>
                  {/* <Button
                    className="!w-10 !h-10 !rounded-full !bg-[#0F0F23] !text-white hover:!bg-[#1a1938]"
                    icon={<MoreHorizontal size={16} />}
                    aria-label="More options"
                  /> */}
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    className="!text-white !bg-[#FFFFFF1A]   !rounded-full !px-5 !h-10"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="!bg-[#FFFFFF1A] border border-white !rounded-full !px-6 !h-10"
                    onClick={onSave}
                    loading={saving}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
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
            {['About', 'Posts', 'Portfolio'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm sm:text-base font-medium transition-colors font-exo2 whitespace-nowrap ${
                  activeTab === tab
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
          <div className="space-y-6">
          
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
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#FFFFFF1A] bg-[#090721] mb-6 font-exo2 pb-6">
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
                phone: user?.phone || user?.phoneNumber || "",
                profession: profile.profession || "",
                interests: Array.isArray(profile.interests) 
                  ? profile.interests 
                  : profile.interests ? [profile.interests] : [],
                bio: profile.bio || user?.bio || "",
              }}
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Form.Item
                  label={<span className="text-white text-sm">Display Name</span>}
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Display Name"
                    className="!bg-[#0B0926] !border-none !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
                  />
                </Form.Item>
                <Form.Item
                  label={<span className="text-white text-sm">User Name</span>}
                  name="username"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="User Name"
                    className="!bg-[#0B0926] !border-none !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white text-sm">Email-ID</span>}
                  name="email"
                  rules={[{ type: "email", required: true }]}
                >
                  <Input
                    placeholder="Email-ID"
                    className="!bg-[#0B0926] !border-none !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
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
                    className="profile-select"
                    popupClassName="profile-select-dropdown"
                    dropdownStyle={{
                      backgroundColor: "#0B0926",
                      border: "1px solid #2a2a3e",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white text-sm">Phone No.</span>}
                  name="phone"
                  className="col-span-2"
                >
                  <Input
                    placeholder="Phone No."
                    className="!bg-[#0B0926] !border-none !text-white !rounded-xl !h-12 !px-4 placeholder:!text-[#6B7280]"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white text-sm">Interest</span>}
                  name="interests"
                  className="col-span-2"
                >
                  <Select
                    mode="multiple"
                    showSearch
                    suffixIcon={<span className="text-white">▼</span>}
                    placeholder="Select Categories"
                    className="profile-select"
                    popupClassName="profile-select-dropdown"
                    dropdownStyle={{
                      backgroundColor: "#0B0926",
                      border: "1px solid #2a2a3e",
                    }}
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
                  className="col-span-2"
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Bio"
                    className="!bg-[#0B0926] !border-none !text-white !rounded-xl !p-4 placeholder:!text-[#6B7280]"
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