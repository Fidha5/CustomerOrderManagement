import apiClient from './api'
import { CreateOrderDto, UpdateOrderDto, OrderQueryParams, Order, PaginatedResponse } from '../types'

export const orderService = {
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', orderData)
    return response.data
  },

  async getOrders(params?: OrderQueryParams): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', { params })
    return response.data
  },

  async getStatistics(): Promise<any> {
    const response = await apiClient.get<any>('/orders/statistics')
    return response.data
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${id}`)
    return response.data
  },

  async updateOrder(id: string, orderData: UpdateOrderDto): Promise<Order> {
    const response = await apiClient.put<Order>(`/orders/${id}`, orderData)
    return response.data
  },

  async deleteOrder(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/orders/${id}`)
    return response.data
  },
}