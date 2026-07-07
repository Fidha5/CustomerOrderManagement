import apiClient from './api'
import { Product } from '../types'

export const productService = {
  async getProducts(search?: string, activeOnly?: boolean): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products', {
      params: {
        ...(search && { search }),
        ...(activeOnly && { activeOnly: true }),
      },
    })
    return response.data
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  async createProduct(productData: any): Promise<Product> {
    const response = await apiClient.post<Product>('/products', productData)
    return response.data
  },

  async updateProduct(id: string, productData: any): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, productData)
    return response.data
  },

  async deleteProduct(id: string): Promise<Product> {
    const response = await apiClient.delete<Product>(`/products/${id}`)
    return response.data
  },
}