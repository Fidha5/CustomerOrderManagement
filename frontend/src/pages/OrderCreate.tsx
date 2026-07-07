import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { customerService } from '../services/customerService'
import { productService } from '../services/productService'
import { Customer, Product, CreateOrderDto, CreateOrderItemDto } from '../types'
import { useToast } from '../components/Toast'

function OrderCreate() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [orderData, setOrderData] = useState<CreateOrderDto>({
    customerId: '',
    items: [],
    taxAmount: 0,
    discountAmount: 0,
  })

  const [newItem, setNewItem] = useState<CreateOrderItemDto>({
    productId: '',
    quantity: 1,
    unitPrice: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [customersData, productsData] = await Promise.all([
        customerService.getCustomers(),
        productService.getProducts(undefined, true), // active only
      ])
      setCustomers(customersData)
      setProducts(productsData)
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotals = () => {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
    const taxAmount = orderData.taxAmount || 0
    const discountAmount = orderData.discountAmount || 0
    return {
      subtotal,
      total: subtotal + taxAmount - discountAmount,
    }
  }

  const handleAddItem = () => {
    if (!newItem.productId || newItem.quantity <= 0 || newItem.unitPrice < 0) {
      setError('Please fill in all item fields correctly')
      return
    }

    // Check for duplicate products
    if (orderData.items.some(item => item.productId === newItem.productId)) {
      setError('Product already added to order')
      return
    }

    setOrderData({
      ...orderData,
      items: [...orderData.items, { ...newItem }],
    })

    setNewItem({
      productId: '',
      quantity: 1,
      unitPrice: 0,
    })
    setError('')
  }

  const handleRemoveItem = (index: number) => {
    setOrderData({
      ...orderData,
      items: orderData.items.filter((_, i) => i !== index),
    })
  }

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setNewItem({
        ...newItem,
        productId,
        unitPrice: typeof product.basePrice === 'string' ? parseFloat(product.basePrice) : product.basePrice,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderData.customerId) {
      setError('Please select a customer')
      return
    }

    if (orderData.items.length === 0) {
      setError('Please add at least one item to the order')
      return
    }

    try {
      setIsSubmitting(true)
      const createdOrder = await orderService.createOrder(orderData)
      showToast({
        type: 'success',
        title: 'Order created successfully',
        message: `Order #${createdOrder.orderNumber} has been created`,
      })
      navigate(`/orders/${createdOrder.id}`)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create order'
      setError(errorMessage)
      showToast({
        type: 'error',
        title: 'Failed to create order',
        message: errorMessage,
      })
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const totals = calculateTotals()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Orders
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Customer Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                value={orderData.customerId}
                onChange={(e) => setOrderData({ ...orderData, customerId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.customerNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Date
              </label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                onChange={(e) => setOrderData({ ...orderData, orderDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {orderData.customerId && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              {(() => {
                const customer = customers.find(c => c.id === orderData.customerId)
                return customer ? (
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-gray-600">{customer.email}</p>
                    <p className="text-gray-600">{customer.phone}</p>
                  </div>
                ) : null
              })()}
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={orderData.notes || ''}
              onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add any notes about this order..."
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>

          {/* Add Item Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <select
                value={newItem.productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.productCode}) - {formatCurrency(product.basePrice)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Items List */}
          {orderData.items.length > 0 && (
            <div className="space-y-2">
              {orderData.items.map((item, index) => {
                const product = products.find(p => p.id === item.productId)
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {product?.name} ({product?.productCode})
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)} ={' '}
                        <span className="font-medium">{formatCurrency(item.quantity * item.unitPrice)}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax Amount:</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={orderData.taxAmount || ''}
                onChange={(e) => setOrderData({ ...orderData, taxAmount: parseFloat(e.target.value) || 0 })}
                className="w-32 px-3 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Discount Amount:</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={orderData.discountAmount || ''}
                onChange={(e) => setOrderData({ ...orderData, discountAmount: parseFloat(e.target.value) || 0 })}
                className="w-32 px-3 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderCreate