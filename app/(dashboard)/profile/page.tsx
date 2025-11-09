"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuthStore } from "@/lib/store/authStore"
import { Button, Form, Input, Select, Tabs, Avatar, message } from "antd"
import { Edit2, Share2, MoreHorizontal, Link, MessageCircle } from "lucide-react"

const countries = [
  "United States",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
]

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  const profile = {
    name: user?.name || "Spades",
    username: user?.username || "spades",
    email: user?.email || "spades21@gmail.com",
    country: "United States",
    location: "New York, USA",
    profession: "Crypto Enthusiast",
    joined: "Joined 16 Sep 2025",
    website: "spades.com",
    links: {
      facebook: "facebook.com/spades",
      instagram: "@spades21",
      x: "@X/TechPro",
    },
    stats: {
      posts: 1207,
      projects: 82,
      contributions: 93,
    },
    bio: "01 Ethereum, 04 Ordinals. Likes NFTs and Blockchain L2s. NFTs and Blockchain L2s, NFTs and Blockchain L2s, NFTs and Blockchain...",
    interests: "DeFi, NFTs, Layer2, CryptoGaming",
    cover: "/assets/card-bg.png",
    avatar: "/assets/avatar.jpg",
  }

  const onSave = async () => {
    try {
      const values = await form.validateFields()
      // Persist values to backend here
      message.success("Profile saved")
      setEditing(false)
    } catch (e) {
      // validation errors surfaced by antd
    }
  }

  return (
    <div className="px-6 py-6 mt-4 space-y-6 bg-[#020019] font-exo2">
      {/* Header / Cover */}
      <div className="relative rounded-xl overflow-hidden border border-[#2A2F4A] bg-[#0B0926]">
        <div className="relative h-48 w-full bg-gradient-to-r from-purple-800/30 to-yellow-500/10">
          {/* Fallback cover image */}
          <Image
            src={profile.cover}
            alt="Cover"
            fill
            priority
            className="object-cover opacity-90"
            sizes="100vw"
          />
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-10 left-6 z-100 ">
          <Avatar
            size={150}
            src={profile.avatar}
            className="!border-4 !border-[#884DFF] !shadow-md !w-[150px] !h-[150px] z-100"
          />
        </div>
      </div>

      {/* Identity row */}
      <div className="pt-12 px-1">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="text-white text-xl font-semibold">{profile.name}</div>
            <div className="text-[#9BA3AF] text-sm">@{profile.username}</div>
            <div className="flex flex-wrap gap-4 text-xs text-[#9BA3AF]">
              <span>
                <span className="text-white">0</span> Followers
              </span>
              <span>
                <span className="text-white">0</span> Following
              </span>
            </div>
            <div className="text-[#C3C7D0] text-sm max-w-3xl">
              {profile.bio}
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <Tabs
                defaultActiveKey="about"
                color="#884DFF"
                items={[
                  { key: "about", label: "About" },
                  { key: "posts", label: "Posts" },
                  { key: "portfolio", label: "Portfolio" },
                ]}
              />
              {/* horizontal line */}
              <div className="w-full h-px bg-[#2A2F4A] my-4"></div>
            </div>
          </div>
          {!editing && (
            <div className="flex gap-2">
              <Button type="primary" className="!bg-[#8B5CF6]">Follow</Button>
              <Button className="!text-white !border-[#2A2F4A] !bg-transparent" icon={<MessageCircle />}></Button>
            </div>
          )}
          {/* Actions top-right */}
          {/* <div className="absolute top-3 right-3 flex gap-2"> */}
            {!editing ? (
              <>
                <Button
                  size="middle"
                  className="!text-white !border-[#2A2F4A] !bg-[#0F0F23] hover:!bg-[#1a1938]"
                  onClick={() => setEditing(true)}
                  icon={<Edit2 size={16} />}
                >
                  Edit Profile
                </Button>

              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  className="!text-white !border-[#2A2F4A] !bg-transparent"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="primary" className="!bg-[#8B5CF6]" onClick={onSave}>
                  Save
                </Button>
              </div>
            )}
          {/* </div> */}
          <Button
            size="middle"
            className="!text-white border-none !bg-[#0F0F23] hover:!bg-[#1a1938]"
            icon={<Share2 size={16} />}
          />
          <Button
            size="middle"
            className="!text-white border-none !bg-[#0F0F23] hover:!bg-[#1a1938]"
            icon={<MoreHorizontal size={16} />}
          />
        </div>
      </div>

      {/* Content area */}
      {!editing ? (
        <div className="pb-6">
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
                <Field label="Interests:" value={profile.interests} />
                <div className="border-b border-[#2A2F4A]"></div>
                <Field label="User Since:" value={profile.joined} />
              </div>
            </div>
          </div>

          {/* Links + Stats */}
          <div className="space-y-6">
            {/* <div className="rounded-xl border border-[#2A2F4A] bg-[#0B0926]">
              <div className="px-5 py-4 border-b border-[#2A2F4A] text-white font-semibold">
                Links
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm text-[#C3C7D0]">
                <Field label="Website" value={profile.website} />
                <Field label="Facebook" value={profile.links.facebook} />
                <Field label="Instagram" value={profile.links.instagram} />
                <Field label="X (Twitter)" value={profile.links.x} />
              </div>
            </div> */}

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
                name: profile.name,
                username: profile.username,
                email: profile.email,
                country: profile.country,
                phone: "",
                profession: profile.profession,
                interests: profile.interests,
                bio: profile.bio,
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
                    showSearch
                    suffixIcon={<span className="text-white">▼</span>}
                    placeholder="Select Category"
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
      <div className="p-4 mt-4 bg-[#020019] border-t border-[#2A2F4A] fixed bottom-0 w-[80vw] ">
        <div className="flex items-center justify-between">
          <div className="text-[#FFFFFF] text-[16px] font-[500]">© 2025 21 Spades. All Rights Reserved.</div>
          <div className="text-[#FFFFFF] text-[16px] font-[500]">
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