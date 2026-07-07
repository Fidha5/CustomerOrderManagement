import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { Order } from '../types'
import { useToast } from '../components/Toast'

// Icons as components
const Icons = {
  ArrowLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Email: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Package: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Printer: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Rupee: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedStatus, setEditedStatus] = useState<number | null>(null)

  useEffect(() => {
    if (id) {
      loadOrder(id)
    }
  }, [id])

  const loadOrder = async (orderId: string) => {
    try {
      setIsLoading(true)
      const orderData = await orderService.getOrderById(orderId)
      setOrder(orderData)
      setEditedStatus(orderData.orderStatusId)
    } catch (err) {
      setError('Failed to load order details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!order || editedStatus === null) return

    try {
      setIsUpdating(true)
      await orderService.updateOrder(order.id, { orderStatusId: editedStatus })
      await loadOrder(order.id)
      setIsEditing(false)
      showToast({
        type: 'success',
        title: 'Order status updated',
        message: `Order #${order.orderNumber} status has been updated successfully`,
      })
    } catch (err) {
      const errorMessage = 'Failed to update order status'
      setError(errorMessage)
      showToast({
        type: 'error',
        title: 'Status update failed',
        message: errorMessage,
      })
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    if (!confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      setIsUpdating(true)
      await orderService.updateOrder(order.id, { orderStatusId: 4 }) // CANCELLED
      await loadOrder(order.id)
    } catch (err) {
      setError('Failed to cancel order')
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusConfig = (statusName: string) => {
    const configs: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700', icon: <Icons.Clock />, label: 'Draft' },
      PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Icons.Clock />, label: 'Pending' },
      CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <Icons.Check />, label: 'Confirmed' },
      CANCELLED: { bg: 'bg-rose-100', text: 'text-rose-700', icon: <Icons.X />, label: 'Cancelled' },
    }
    return configs[statusName] || configs.DRAFT
  }

  const getStatusTimeline = (currentStatus: string) => {
    const timeline = [
      { id: 1, name: 'DRAFT', label: 'Draft' },
      { id: 2, name: 'PENDING', label: 'Pending' },
      { id: 3, name: 'CONFIRMED', label: 'Confirmed' },
    ]

    const currentIndex = timeline.findIndex(t => t.name === currentStatus)

    return timeline.map((step, index) => ({
      ...step,
      completed: index < currentIndex,
      current: index === currentIndex,
      pending: index > currentIndex,
    }))
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
            <Icons.X />
          </div>
          <div>
            <h3 className="font-semibold text-rose-800">Error Loading Order</h3>
            <p className="text-rose-600">{error || 'Order not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(order.status?.name || '')
  const statusTimeline = getStatusTimeline(order.status?.name || '')

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <Icons.ArrowLeft />
            Back to Orders
          </button>

          <div className="flex items-center gap-3">
            {order.orderStatusId !== 4 && (
              <button
                onClick={handleCancelOrder}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Icons.X />
                Cancel Order
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              <Icons.Printer />
              Print
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Icons.Calendar />
                  {formatDate(order.createdAt)}
                </span>
                {order.updatedAt !== order.createdAt && (
                  <span>• Updated {formatDate(order.updatedAt)}</span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
              {statusConfig.icon}
              <span className="font-semibold">{statusConfig.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Order Progress</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                <Icons.Edit />
                {isEditing ? 'Cancel' : 'Edit Status'}
              </button>
            </div>

            {isEditing ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <select
                  value={editedStatus || ''}
                  onChange={(e) => setEditedStatus(parseInt(e.target.value))}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value={1}>Draft</option>
                  <option value={2}>Pending</option>
                  <option value={3}>Confirmed</option>
                  <option value={4}>Cancelled</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {statusTimeline.map((step, index) => (
                  <div key={step.id} className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.completed
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-600'
                          : step.current
                          ? 'bg-primary border-primary text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}>
                        {step.completed ? <Icons.Check /> : step.id}
                      </div>
                      {index < statusTimeline.length - 1 && (
                        <div className={`flex-1 h-0.5 transition-all ${
                          step.completed ? 'bg-emerald-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${
                      step.current ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icons.Package />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{item.product?.productCode}</p>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">"{item.notes}"</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(item.lineTotal)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order History */}
          {order.history && order.history.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h2>
              <div className="space-y-4">
                {order.history.map((history, index) => (
                  <div key={history.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icons.Clock />
                      </div>
                      {index < order.history!.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900 capitalize">
                        {history.changeType.replace('_', ' ').toLowerCase()}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{formatDateTime(history.changedAt)}</p>
                      {history.changedBy && (
                        <p className="text-sm text-gray-600 mt-1">by {history.changedBy}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icons.User />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium text-gray-900">{order.customer?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Customer Number</p>
                <p className="font-mono text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded inline-block">
                  {order.customer?.customerNumber}
                </p>
              </div>

              {order.customer?.email && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
                  >
                    <Icons.Email />
                    {order.customer.email}
                  </a>
                </div>
              )}

              {order.customer?.phone && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
                  >
                    <Icons.Phone />
                    {order.customer.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-medium text-emerald-600">
                  -{formatCurrency(order.discountAmount)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <div className="flex items-center gap-2">
                    <Icons.Rupee />
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(order.totalAmount).replace('₹', '')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
