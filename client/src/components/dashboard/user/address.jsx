import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, FormProvider } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MapPin, Edit3, Save, X, Home } from 'lucide-react'
import { addAddress as addAddressApi } from '../../../services/operations/authApi'

function Address() {
  const dispatch = useDispatch()
  const { address, loading } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)

  const methods = useForm()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods

  // Populate form with existing address when entering edit mode
  useEffect(() => {
    if (isEditing && address) {
      setValue('houseNo', address.houseNo || '')
      setValue('street', address.street || '')
      setValue('Address', address.Address || '')
      setValue('city', address.city || '')
      setValue('state', address.state || '')
      setValue('pincode', address.postalCode || '')
      setValue('country', address.country || '')
    }
  }, [isEditing, address, setValue])

  const onSubmit = async (data) => {
    dispatch(addAddressApi(data, token))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const hasAddress = address && (address.houseNo || address.city || address.state)

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-zinc-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-gradient-to-r from-yellow-600 to-indigo-600">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">My Address</h1>
          <p className="text-zinc-400">Manage your delivery address</p>
        </div>
      </div>

      {/* Address Card */}
      <Card className="border-zinc-800 bg-zinc-950 text-zinc-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Home className="w-5 h-5" />
              {hasAddress ? 'Saved Address' : 'No Address Found'}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {hasAddress ? 'Your current delivery address' : 'Add an address for faster checkout'}
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800 text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {hasAddress ? 'Edit' : 'Add Address'}
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {isEditing ? (
            /* Edit/Add Form */
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="houseNo" className="text-white">House No.</Label>
                    <Input
                      id="houseNo"
                      placeholder="Enter house number"
                      className="bg-black border-zinc-800 focus-visible:ring-white"
                      {...register('houseNo', { required: 'House No. is required' })}
                    />
                    {errors.houseNo && <span className="text-red-500 text-sm">{errors.houseNo.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-white">Street</Label>
                    <Input
                      id="street"
                      placeholder="Enter street name"
                      className="bg-black border-zinc-800 focus-visible:ring-white"
                      {...register('street', { required: 'Street is required' })}
                    />
                    {errors.street && <span className="text-red-500 text-sm">{errors.street.message}</span>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="Address" className="text-white">Full Address</Label>
                    <Input
                      id="Address"
                      placeholder="Enter complete address"
                      className="bg-black border-zinc-800 focus-visible:ring-white"
                      {...register('Address', {
                        required: 'Full address is required',
                        minLength: { value: 5, message: 'Address must be at least 5 characters' }
                      })}
                    />
                    {errors.Address && <span className="text-red-500 text-sm">{errors.Address.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      className="bg-black border-zinc-800 focus-visible:ring-white"
                      {...register('city', { required: 'City is required' })}
                    />
                    {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-white">State</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      className="bg-black border-zinc-800 focus-visible:ring-white"
                      {...register('state', { required: 'State is required' })}
                    />
                    {errors.state && <span className="text-red-500 text-sm">{errors.state.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-white">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="Enter pincode"
                      className="bg-black border-zinc-800 focus-visible:ring-white"
                      {...register('pincode', {
                        required: 'Pincode is required',
                        pattern: { value: /^[1-9][0-9]{5}$/, message: 'Enter a valid 6-digit pincode' }
                      })}
                    />
                    {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-white">Country</Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      defaultValue="India"
                      className="bg-black border-zinc-800 focus-visible:ring-white"
                      {...register('country', { required: 'Country is required' })}
                    />
                    {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-white hover:bg-gray-200 text-black font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Address
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-zinc-700 hover:bg-zinc-800 text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </FormProvider>
          ) : hasAddress ? (
            /* Display Address */
            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <Home className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-lg font-medium text-white">
                      {address.houseNo && `${address.houseNo}, `}
                      {address.street}
                    </p>
                    {address.Address && (
                      <p className="text-zinc-400">{address.Address}</p>
                    )}
                    <p className="text-zinc-400">
                      {address.city}, {address.state} - {address.postalCode}
                    </p>
                    <p className="text-zinc-500">{address.country || 'India'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Address State */
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No address saved yet</h3>
              <p className="text-zinc-400 mb-6">
                Add your delivery address to make checkout faster and easier.
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-yellow-600 to-indigo-600 hover:from-yellow-700 hover:to-indigo-700 text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Add Your Address
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Address