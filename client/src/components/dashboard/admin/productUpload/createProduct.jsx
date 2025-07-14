import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { showAllCategory } from "../../../../services/operations/categoryApi"
import ImageUploader from "../ImageUploader"
import { useSelector, useDispatch } from "react-redux"
import { createProduct } from "../../../../services/operations/productApi"
import { SyncLoader } from "react-spinners"
import { apiConnector } from "../../../../services/apiConnector"

const BASE_URL = import.meta.env.VITE_BASE_URL

const AddProduct = () => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.product)

  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [aiResponse, setAiResponse] = useState(null)
  const [step, setStep] = useState(1)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    register("images", {
      required: "At least one image is required",
      validate: (files) => files.length > 0 || "At least one image is required",
    })
  }, [register])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await showAllCategory(dispatch)
        setCategories(response.data.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const callAiServices = async () => {
    try {
      setAiLoading(true)
      const formData = new FormData()
      images.forEach((img) => {
        formData.append("images", img)
      })

      const response = await apiConnector("POST", `${BASE_URL}ai/generate`, formData);
      console.log(response);
      if (response?.data) {
        const { description, category, tags } = response.data
        setValue("description", description)
        setValue("category", category)
        setValue("tags", tags.join(", "))
        setAiResponse(response.data)
        setStep(2)
      } else {
        console.error("No response from AI service.")
      }
    } catch (err) {
      console.error("Failed to call AI service:", err)
    } finally {
      setAiLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("price", data.price)
      formData.append("stock", data.stock)
      formData.append("category", data.category)
      formData.append("tags", data.tags)

      images.forEach((img) => {
        formData.append("image", img)
      })

      await dispatch(createProduct(formData, token))
      reset()
      setStep(1)
      setImages([])
      setAiResponse(null)
    } catch (error) {
      console.error("Error submitting product:", error)
    }
  }

  if (loading || aiLoading) {
    return (
      <div className="flex justify-center items-center mx-auto text-white min-h-screen">
        <SyncLoader color="#FFFFFF" />
      </div>
    )
  }
  return (
    <div className="h-fit min-w-[40%] mx-auto bg-black text-white p-10 mt-20">
      <h2 className="text-3xl font-bold mb-8 border-b border-zinc-800 pb-4">
        Add New Product
      </h2>

      {step === 1 && (
        <>
          <Label className="mb-10">Product Images</Label>
          <ImageUploader
            error={errors.images?.message}
            onImagesChange={(files) => {
              setImages(files)
              setValue("images", files, { shouldValidate: true })
            }}
          />
          <Button
            className="mt-6"
            onClick={callAiServices}
            disabled={images.length === 0}
          >
            Next (Generate with AI)
          </Button>
        </>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#0e0e0e] p-6 rounded-2xl shadow-xl space-y-6 border border-[#1f1f1f]"
        >
          <div>
            <Label className="text-gray-300 mb-2 block">Product Name</Label>
            <Input
              className="bg-[#1a1a1a] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-[#FEB714]"
              placeholder="Enter product name"
              {...register("name", { required: "Product name is required" })}
            />
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Description</Label>
            <Textarea
              className="bg-[#1a1a1a] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-[#FEB714]"
              rows={4}
              placeholder="Write a detailed description"
              {...register("description", { required: "Description is required" })}
            />
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Tags (comma-separated)</Label>
            <Input
              className="bg-[#1a1a1a] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-[#FEB714]"
              placeholder="e.g. streetwear, summer, cotton"
              {...register("tags", { required: "Tags are required" })}
            />
          </div>

          <div>
            <Label className="text-gray-300 mb-2 block">Category</Label>
            <select
              className="bg-[#1a1a1a] text-white border border-[#333] w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FEB714]"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <Label className="text-gray-300 mb-2 block">Price (₹)</Label>
              <Input
                type="number"
                className="bg-[#1a1a1a] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-[#FEB714]"
                placeholder="Enter price"
                {...register("price", { required: "Price is required" })}
              />
            </div>
            <div className="flex-1">
              <Label className="text-gray-300 mb-2 block">Stock</Label>
              <Input
                type="number"
                className="bg-[#1a1a1a] text-white border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-[#FEB714]"
                placeholder="Enter stock count"
                {...register("stock", { required: "Stock is required" })}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#FEB714] text-black hover:opacity-90 transition duration-200 font-semibold"
          >
            Add Product
          </Button>
        </form>
      )}

    </div>
  )
}

export default AddProduct
