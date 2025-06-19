import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { showAllCategory } from "../../../services/operations/categoryApi"
import ImageUploader from "./ImageUploader";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../services/operations/productApi"
import { SyncLoader } from "react-spinners";
const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm()
  const dispatch = useDispatch();
  const [category, setCategory] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.product);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await showAllCategory(); // Adjust the API endpoint as needed
        setCategory(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, [])


  useEffect(() => {
    register("images", {
      required: "At least one image is required",
      validate: (files) => files.length > 0 || "At least one image is required",
    });
  }, [register]);

  
  const onSubmit = async (data) => {
    try {
      const { name, description, price, stock, category, tags, images } = data;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("tags", tags);

      // 👇 Append all selected images under the same key
      Array.from(images).forEach((img) => {
        formData.append("image", img);
      });

      await dispatch(createProduct(formData, token));
      reset();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  if (loading) {
    return (
    <div className="flex justify-center items-center mx-auto text-white">
      <SyncLoader color="#FFFFFF" />
    </div>
    )
  }

  return (
    <div className="min-h-screen min-w-[40%] mx-auto bg-black text-white p-10 mt-20">
      <h2 className="text-3xl font-bold mb-8 border-b border-zinc-800 pb-4">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            placeholder="Enter product name"
            className="bg-zinc-900 text-white border-zinc-700 focus-visible:ring-white"
            {...register("name", { required: "Product name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            className="bg-zinc-900 text-white border-zinc-700 focus-visible:ring-white"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            placeholder="Enter stock quantity"
            className="bg-zinc-900 text-white border-zinc-700 focus-visible:ring-white"
            {...register("stock", { required: "Stock is required" })}
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            placeholder="e.g. tech, gadgets, latest"
            className="bg-zinc-900 text-white border-zinc-700 focus-visible:ring-white"
            {...register("tags")}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="bg-zinc-900 text-white border border-zinc-700 focus-visible:ring-white w-full"
            defaultValue=""
            {...register("category", { required: "Category is required" })}
          >
            <option value="" disabled>
              -- Select a category --
            </option>
            {category.map((cat, id) => (
              <option key={id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>


        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the product..."
            rows={5}
            className="bg-zinc-900 text-white border-zinc-700 focus-visible:ring-white"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Product Images</Label>
          <ImageUploader
            error={errors.images?.message}
            onImagesChange={(files) => {
              setValue("images", files, { shouldValidate: true });
            }}
          />
        </div>



        <Button
          type="submit"
          className="bg-white text-black hover:bg-zinc-300 transition-all font-semibold"
          disabled={loading}
        >
          Add Product
        </Button>
      </form>
    </div>
  )
}

export default AddProduct
