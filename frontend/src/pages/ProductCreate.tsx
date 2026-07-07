import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useToast } from '../components/Toast'

function ProductCreate() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    description: '',
    basePrice: '',
    isActive: true,
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    })
  }

  const validateForm = () => {
    if (!formData.productCode.trim()) {
      setError('Product code is required')
      return false
    }
    if (!formData.name.trim()) {
      setError('Product name is required')
      return false
    }
    if (!formData.basePrice || parseFloat(formData.basePrice) < 0) {
      setError('Valid base price is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const productData = {
        productCode: formData.productCode.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        basePrice: parseFloat(formData.basePrice),
        isActive: formData.isActive,
      }

      await productService.createProduct(productData)
      showToast({ type: 'success', title: 'Product created successfully!' })
      navigate('/products')
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to create product'
      setError(errorMessage)
      console.error('Error creating product:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new product for your catalog
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              placeholder="e.g., PROD-001"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier for the product
            </p>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Enterprise Software License"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the product..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Reference price for the product
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700"
            >
              Active (available for orders)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Product...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductCreate