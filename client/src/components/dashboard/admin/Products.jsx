import React, { useEffect, useState } from "react"
import { fetchAllProducts, deleteProduct, updateProduct } from "../../../services/operations/productApi"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Modal from "../../../components/common/Modal"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SyncLoader } from "react-spinners"
import { showAllCategory } from "../../../services/operations/categoryApi"

const Product = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.product)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [category, setCategory] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm()

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  useEffect(() => {
    const loadCategories = async () => {
      const res = await showAllCategory()
      setCategory(res.data.data)
    }
    loadCategories()
  }, [])

  const openModal = (id) => {
    const product = products.find((p) => p._id === id)
    setSelectedProduct(product)
    setExistingImages(product.images || [])
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    reset()
    setExistingImages([])
    setNewImages([])
  }

  const deleteHandler = async (id) => {
    await dispatch(deleteProduct(id, token))
    setDeleteModalOpen(false)
  }

  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url))
  }

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("productId", selectedProduct._id);

    if (data.name) formData.append("name", data.name);
    if (data.price) formData.append("price", data.price);
    if (data.stock) formData.append("stock", data.stock);
    if (data.tags) formData.append("tags", data.tags);
    if (data.category) formData.append("category", data.category);
    if (data.description) formData.append("description", data.description);

    formData.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((file) => {
      formData.append("image", file); 
    });


    await dispatch(updateProduct(formData, token))
    closeModal()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto text-white">
        <SyncLoader color="#FFFFFF" />
      </div>
    )
  }

  return (
    <div className="px-6 w-full mt-16 bg-black text-white">
      <h1 className="text-4xl font-semibold mb-8 my-8">Product Inventory</h1>
      <div className="flex items-center justify-between w-full max-w-7xl my-4">
        <div>Welcome back!</div>
        <button
          className="bg-primary rounded-md text-black p-2 text-sm font-bold"
          onClick={() => navigate("/dashboard/admin/add-product")}
        >
          Create Product
        </button>
      </div>

      <div className="w-full max-w-7xl mx-5 bg-[#1c1c1e] border border-[#797878] rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-white">
          <thead className="bg-black text-gray-400 text-xs uppercase font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-3">Product ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#575656]">
            {products?.map((product) => (
              <tr
                onClick={() => navigate(`/product/${product._id}`)}
                key={product._id}
                className="hover:bg-[#171718] transition-colors"
              >
                <td className="px-6 py-3">{product._id}</td>
                <td className="px-6 py-3">{product.name}</td>
                <td className="px-6 py-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-3 max-w-xs truncate text-gray-300">{product.description}</td>
                <td className="px-6 py-3">{product.category?.name}</td>
                <td className="px-6 py-3">₹{product.price}</td>
                <td className="px-6 py-3">{product.stock}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${product.stock > 0 ? "bg-green-300/10 text-green-400" : "bg-red-300/10 text-red-400"}`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-3 text-center flex gap-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-1.5 rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(product._id)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1.5 rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteId(product._id)
                      setDeleteModalOpen(true)
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products?.length === 0 && (
          <div className="text-center p-4 text-gray-400">No products found.</div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-semibold text-white mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder={selectedProduct?.name} className="bg-zinc-900 text-white border-zinc-700" {...register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" type="number" placeholder={selectedProduct?.price?.toString()} className="bg-zinc-900 text-white border-zinc-700" {...register("price")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" placeholder={selectedProduct?.stock?.toString()} className="bg-zinc-900 text-white border-zinc-700" {...register("stock")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" placeholder={selectedProduct?.tags?.join(", ")} className="bg-zinc-900 text-white border-zinc-700" {...register("tags")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" className="bg-zinc-900 text-white border border-zinc-700 w-full" defaultValue="" {...register("category")}>
              <option value="" disabled>{selectedProduct?.category?.name || "-- Select a category --"}</option>
              {category.map((cat, id) => (
                <option key={id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder={selectedProduct?.description} rows={5} className="bg-zinc-900 text-white border-zinc-700" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label>Existing Images</Label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt="" className="h-20 w-20 object-cover rounded" />
                  <button type="button" className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 py-0.5 rounded" onClick={() => removeExistingImage(url)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload New Images</Label>
            <input type="file" multiple accept="image/*" onChange={(e) => setNewImages(Array.from(e.target.files))} className="text-white" />
          </div>

          <Button type="submit" className="bg-white text-black hover:bg-zinc-300 font-semibold">Update Product</Button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Delete Product</h2>
          <p className="text-gray-400 mb-4">Are you sure you want to delete this product?</p>
          <Button className="bg-red-500 p-2 hover:bg-red-900" onClick={() => deleteHandler(deleteId)}>
            Delete it
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Product;
