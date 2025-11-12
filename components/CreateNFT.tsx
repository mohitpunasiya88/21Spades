"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, Form, Input, Button, Select, Radio, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { Camera, Heart } from "lucide-react"
import Navbar from "@/components/Layout/Navbar"
import Sidebar from "@/components/Layout/Sidebar"

export default function CreateNFT() {
  const [form] = Form.useForm()
  const [fileUrl, setFileUrl] = useState<string>("")
  const [method, setMethod] = useState<string>("bids")

  const onUpload = (info: any) => {
    if (info.file) {
      const url = URL.createObjectURL(info.file.originFileObj || info.file)
      setFileUrl(url)
      message.success("File ready for preview")
    }
    return false
  }

  const onFinish = async () => {
    try {
      await form.validateFields()
      message.success("NFT form validated. Ready to create.")
    } catch {}
  }

  return (
    <div className="flex min-h-screen bg-[#020019] text-white font-exo2">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="rounded-xl bg-[#0B0926] border border-[#2A2F4A] p-4 md:p-6">
              <div className="h-28 md:h-32 w-full rounded-lg bg-gradient-to-r from-[#5A21FF]/30 to-[#FFD873]/20 flex items-center justify-center text-sm md:text-base font-semibold tracking-wide">
                CREATE SINGLE ITEM ON AVALANCHE
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                {/* Preview column */}
                <div className="lg:col-span-4">
                  <div className="text-[#9BA3AF] mb-3 text-sm">Preview Item</div>
                  <div className="rounded-xl bg-[#090721] border border-[#FFFFFF1A] p-4">
                    <div className="rounded-lg overflow-hidden bg-black/40 aspect-[3/4] relative">
                      {fileUrl ? (
                        <Image src={fileUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <Image src="/assets/nft-sample.jpg" alt="Preview" fill className="object-cover" />
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold">Tiger Neon #1</div>
                          <div className="text-xs text-[#9BA3AF]">by Spades</div>
                        </div>
                        <div className="flex items-center gap-1 text-[#C3C7D0] text-xs">
                          <Heart size={14} />
                          <span>24</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 !text-white !bg-gradient-to-r !from-[#2B007F] !to-[#4E00E5] !border-none !rounded-full !h-10">Create Item</Button>
                    </div>
                  </div>
                </div>

                {/* Form column */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upload */}
                    <div className="rounded-xl bg-[#090721] border border-[#FFFFFF1A] p-4 md:p-6">
                      <div className="text-[#9BA3AF] text-sm mb-3">Upload File</div>
                      <div className="rounded-lg border border-dashed border-[#2A2F4A] bg-[#0B0926] p-6">
                        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                          <div className="w-12 h-12 rounded-full bg-[#5A21FF]/20 text-[#C3C7D0] flex items-center justify-center">
                            <Camera size={20} />
                          </div>
                          <div className="text-xs text-[#9BA3AF]">PNG, GIF, WEBP, MP3, MP4 (Max 50MB)</div>
                          <Upload beforeUpload={onUpload} showUploadList={false} multiple={false} accept="image/*,video/*,audio/*">
                            <Button icon={<UploadOutlined />} className="!rounded-full">Upload</Button>
                          </Upload>
                        </div>
                      </div>
                    </div>

                    {/* Method */}
                    <div className="rounded-xl bg-[#090721] border border-[#FFFFFF1A] p-4 md:p-6">
                      <div className="text-[#9BA3AF] text-sm mb-3">Select Method</div>
                      <Radio.Group
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="flex gap-2 flex-wrap"
                      >
                        <Radio.Button value="fixed" className="!bg-transparent !text-white">Fixed Rate</Radio.Button>
                        <Radio.Button value="auction" className="!bg-transparent !text-white">Time Auction</Radio.Button>
                        <Radio.Button value="bids" className="!bg-transparent !text-white">Open For Bids</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>

                  {/* Details form */}
                  <div className="rounded-xl bg-[#090721] border border-[#FFFFFF1A] p-4 md:p-6 mt-6">
                    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="title" label={<span className="text-white text-sm">Title</span>} rules={[{ required: true }]}>                    
                          <Input placeholder="e.g. Crypto Hunks" className="!bg-[#0B0926] !border-none !text-white !rounded-xl !h-11 !px-4" />
                        </Form.Item>
                        <Form.Item name="price" label={<span className="text-white text-sm">Price</span>} rules={[{ required: true }]}> 
                          <Input placeholder="e.g. 0.25" className="!bg-[#0B0926] !border-none !text-white !rounded-xl !h-11 !px-4" />
                        </Form.Item>
                        <Form.Item name="royalties" label={<span className="text-white text-sm">Royalties (%)</span>}>
                          <Input placeholder="e.g. 5" className="!bg-[#0B0926] !border-none !text-white !rounded-xl !h-11 !px-4" />
                        </Form.Item>
                        <Form.Item name="category" label={<span className="text-white text-sm">Category</span>}>
                          <Select
                            placeholder="Select"
                            className="profile-select"
                            options={[
                              { value: "art", label: "Art" },
                              { value: "music", label: "Music" },
                              { value: "video", label: "Video" },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item name="description" label={<span className="text-white text-sm">Description</span>} className="md:col-span-2">
                          <Input.TextArea rows={4} placeholder="Write something..." className="!bg-[#0B0926] !border-none !text-white !rounded-xl !p-4" />
                        </Form.Item>
                      </div>

                      <div className="flex items-center justify-end gap-3 mt-2">
                        <Button className="!text-white !bg-transparent !border-[#2A2F4A] !rounded-full !h-10">Cancel</Button>
                        <Button htmlType="submit" type="primary" className="!bg-[#8B5CF6] !rounded-full !h-10">Create Item</Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
