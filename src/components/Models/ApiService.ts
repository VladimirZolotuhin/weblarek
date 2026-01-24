import type { IApi, IOrder, IOrderResponse, IProduct } from '../../types'

export class ApiService {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      const data = await this.api.get<{ items: IProduct[] }>('/product')
      return data.items
    } catch (error) {
      return []
    }
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', order)
  }
}

export default ApiService
