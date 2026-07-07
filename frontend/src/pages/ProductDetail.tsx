import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productService } from '../services/productService'
import { Product } from '../types'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useToast } from '../components/Toast'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    isActive: true,
  })

  useEffect(() => {
    if (id) {
      loadProduct(id)
    }
  }, [id])

  const loadProduct = async (productId: string) => {
    try {
      setIsLoading(true)
      const data = await productService.getProductById(productId)
      setProduct(data)
      setEditFormData({
        name: data.name,
        description: data.description || '',
        basePrice:
          typeof data.basePrice === 'string'
            ? data.basePrice
            : data.basePrice.toString(),
        isActive: data.isActive,
      })
      setError('')
    } catch (err) {
      setError('Failed to load product details')
      console.error('Error loading product:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(numPrice)
  }

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setEditFormData({
      ...editFormData,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      setIsUpdating(true)
      setError('')

      const updateData = {
        name: editFormData.name.trim(),
        description: editFormData.description.trim() || undefined,
        basePrice: parseFloat(editFormData.basePrice),
        isActive: editFormData.isActive,
      }

      await productService.updateProduct(product.id, updateData)
      showToast({ type: 'success', title: 'Product updated successfully!' })
      loadProduct(product.id)
      setIsEditing(false)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to update product'
      setError(errorMessage)
      console.error('Error updating product:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return

    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return
    }

    try {
      await productService.deleteProduct(product.id)
      showToast({ type: 'success', title: 'Product deleted successfully!' })
      navigate('/products')
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to delete product'
      setError(errorMessage)
      console.error('Error deleting product:', err)
    }
  }

  const handleCancelEdit = () => {
    if (product) {
      setEditFormData({
        name: product.name,
        description: product.description || '',
        basePrice:
          typeof product.basePrice === 'string'
            ? product.basePrice
            : product.basePrice.toString(),
        isActive: product.isActive,
      })
    }
    setIsEditing(false)
    setError('')
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
          <p className="text-sm text-gray-600 mt-1">
            {isEditing ? 'Edit product information' : 'View and manage product'}
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
        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Product Code</h3>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {product.productCode}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span
                  className={`inline-flex mt-1 px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                    product.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Product Name</h3>
              <p className="text-lg text-gray-900 mt-1">{product.name}</p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Base Price</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPrice(product.basePrice)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                <p className="text-gray-900 mt-1">
                  {new Date(product.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Product Code
                </h3>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {product.productCode}
                  <span className="text-xs text-gray-500 ml-2">
                    (Cannot be changed)
                  </span>
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="editIsActive"
                  checked={editFormData.isActive}
                  onChange={handleEditChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isUpdating}
                />
                <label
                  htmlFor="editIsActive"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Active (available for orders)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="basePrice"
                  value={editFormData.basePrice}
                  onChange={handleEditChange}
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProductDetail