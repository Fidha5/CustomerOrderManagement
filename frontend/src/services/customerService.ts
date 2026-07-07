import apiClient from './api'
import { Customer } from '../types'

export const customerService = {
  async getCustomers(search?: string): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>('/customers', {
      params: search ? { search } : undefined,
    })
    return response.data
  },

  async getCustomerById(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`)
    return response.data
  },

  async createCustomer(customerData: any): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', customerData)
    return response.data
  },

  async updateCustomer(id: string, customerData: any): Promise<Customer> {
    const response = await apiClient.put<Customer>(`/customers/${id}`, customerData)
    return response.data
  },

  async deleteCustomer(id: string): Promise<Customer> {
    const response = await apiClient.delete<Customer>(`/customers/${id}`)
    return response.data
  },
}