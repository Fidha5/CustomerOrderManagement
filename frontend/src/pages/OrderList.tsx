import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { Order, OrderQueryParams } from '../types'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'

function OrderList() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    loadOrders()
  }, [pagination.page, statusFilter, dateFilter, customDateFrom, customDateTo])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const params: OrderQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
      }

      if (search) {
        params.search = search
      }

      if (statusFilter) {
        params.statusId = parseInt(statusFilter)
      }

      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0]
        params.dateFrom = today
        params.dateTo = today
      } else if (dateFilter === 'week') {
        const now = new Date()
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0]
        params.dateFrom = weekAgo
      } else if (dateFilter === 'month') {
        const now = new Date()
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0]
        params.dateFrom = monthAgo
      } else if (dateFilter === 'custom' && customDateFrom && customDateTo) {
        params.dateFrom = customDateFrom
        params.dateTo = customDateTo
      }

      const response = await orderService.getOrders(params)
      setOrders(response.data)
      setPagination(response.pagination)
    } catch (err) {
      setError('Failed to load orders')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination({ ...pagination, page: 1 })
    loadOrders()
  }

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'PENDING':
        return 'bg-orange-100 text-orange-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage your customer orders</p>
        </div>
        <button
          onClick={() => navigate('/orders/create')}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Create Order
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row flex-wrap gap-4">
          <div className="flex-1 min-w-full sm:min-w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, Customer Name..."
              aria-label="Search orders"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPagination({ ...pagination, page: 1 })
              }}
              aria-label="Filter by order status"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="1">Draft</option>
              <option value="2">Pending</option>
              <option value="3">Confirmed</option>
              <option value="4">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={dateFilter}
              onChange={(e) => {
                const value = e.target.value
                setDateFilter(value)
                setShowCustomDate(value === 'custom')
                setPagination({ ...pagination, page: 1 })
              }}
              aria-label="Filter by date range"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Search
          </button>

          {(statusFilter || dateFilter || search) && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatusFilter('')
                setDateFilter('')
                setCustomDateFrom('')
                setCustomDateTo('')
                setShowCustomDate(false)
                setPagination({ ...pagination, page: 1 })
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          )}
        </form>
      </div>

      {/* Active Filters */}
      {(search || statusFilter || dateFilter) && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-600">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              Search: "{search}"
              <button
                onClick={() => setSearch('')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              Status: {statusFilter === '1' ? 'Draft' : statusFilter === '2' ? 'Pending' : statusFilter === '3' ? 'Confirmed' : 'Cancelled'}
              <button
                onClick={() => setStatusFilter('')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {dateFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              Date: {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : dateFilter === 'month' ? 'This Month' : 'Custom'}
              <button
                onClick={() => {
                  setDateFilter('')
                  setShowCustomDate(false)
                }}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Custom Date Range */}
      {showCustomDate && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPagination({ ...pagination, page: 1 })
                loadOrders()
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Apply Date Range
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <LoadingSkeleton count={5} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            message={search || statusFilter || dateFilter ? "Try adjusting your filters or search criteria" : "Create your first order to get started"}
            actionLabel="Create Order"
            onAction={() => navigate('/orders/create')}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]" role="table" aria-label="Orders list">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        <div className="sm:hidden">
                          <div className="font-medium">{order.customer?.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status?.name || '')}`}>
                              {order.status?.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{formatCurrency(order.totalAmount)}</div>
                        </div>
                        <div className="hidden sm:block">{order.customer?.name}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm hidden sm:table-cell">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status?.name || '')}`}>
                          {order.status?.name}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  <div className="sm:hidden">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="hidden sm:block">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} orders
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-gray-600 text-sm hidden sm:block">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OrderList