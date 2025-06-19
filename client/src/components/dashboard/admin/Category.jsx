import React, { useState ,useEffect } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import {useForm } from "react-hook-form";
import { createCategory,showAllCategory,deleteCategory } from '../../../services/operations/categoryApi';
import {useSelector} from "react-redux";
const Category = () => {


  const{register,handleSubmit,formState:{errors},reset}=useForm();
  const [loading, setLoading] = useState(false);
  const [categories,setCategories] = useState([]);
  const {token} = useSelector((state)=>state.auth);


  const onSubmit = async(data)=>{
    setLoading(true);
    try{
      console.log(data);
      const response = await createCategory(data.name,token);
      console.log(response)
      setCategories(response.data.response);
    }catch(error){
      console.error("Error submitting category:", error);
    }
    setLoading(false);
    reset()
  }
  


  const deletecategory = async(name)=>{
    setLoading(true);
    try{
      console.log(name)
        const response = await deleteCategory(name,token);
        setCategories(response.data.finalResponse);
    }catch(error){
      console.error("Error deleting category:", error);
    }
    setLoading(false);
  }



  
  useEffect(()=>{
    const fetchCategories = async()=>{
      setLoading(true);
      try{
        const response = await showAllCategory();
        setCategories(response.data.data);
      }catch(error){
        console.error("Error fetching categories:", error);
      }
      setLoading(false);
    }
    fetchCategories();
  },[])
  
  if(loading){
    return <div>Loading</div>
  }
return (
  <div className="mx-auto bg-black min-h-fit my-auto text-white flex justify-center py-10 px-10">
    <div className="w-full max-w-3xl bg-[#0f0f0f] rounded-xl border border-[#2a2a2a] p-8 ">
      <h1 className="text-3xl font-semibold mb-6">Manage Categories</h1>

      {/* Add Category */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
      >
        <div className="w-full">
          <input
            type="text"
            placeholder="New category name"
            className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] border border-[#333] text-white placeholder-gray-500 focus:outline-none focus:ring-[1.5px] focus:ring-white"
            {...register("name", { required: "Category name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-white text-black font-medium px-4 py-2 rounded-md hover:bg-neutral-200 transition"
        >
          <PlusCircle size={18} /> Add
        </button>
      </form>

      {/* Category List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {categories.length === 0 ? (
          <p className="text-gray-400">No categories yet.</p>
        ) : (
          categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-[#1a1a1a] px-4 py-3 rounded-md border border-[#2a2a2a]"
            >
              <p className="text-white text-sm">{cat.name}</p>
              <div className="flex gap-3 text-gray-400">
                
                <Trash2
                  size={18}
                  className="cursor-pointer hover:text-red-500 transition"
                  onClick={() => deletecategory(cat.name)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

};

export default Category
