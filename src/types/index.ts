export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T>(uri: string): Promise<T>
  post<T>(uri: string, data: unknown, method?: ApiPostMethods): Promise<T>
}

export interface IProduct {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}

export type PaymentType = 'online' | 'cash' | null

export interface ICustomer {
  payment: PaymentType
  email: string | null
  phone: string | null
  address: string | null
}

export interface IOrder extends ICustomer {
  total: number
  items: string[]
}

export interface IOrderResponse {
  id: string
  total: number
}
