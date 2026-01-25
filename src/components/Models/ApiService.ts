import type { IOrder, IOrderResponse, IProduct } from '../../types'
import { Api } from '../base/Api'

export class ApiService {
  private api: Api

  constructor(api: Api) {
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
