import type { IProduct } from '../../types'
import type { IEvents } from '../base/Events'

export class Cart {
  private addedProduct: IProduct[] = []

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.addedProduct
  }

  addToCart(addedProduct: IProduct): void {
    this.addedProduct.push(addedProduct)
    this.events.emit('cart:changed')
  }

  removeFromCart(productID: string): void {
    this.addedProduct = this.addedProduct.filter(
      (product) => product.id !== productID,
    )
    this.events.emit('cart:changed')
  }

  removeAllItems(): void {
    this.addedProduct = []
    this.events.emit('cart:changed')
  }

  getTotalCost(): number {
    return this.addedProduct.reduce(
      (total, product) =>
        typeof product.price === 'number' ? total + product.price : total,
      0,
    )
  }

  getAmountOfItems(): number {
    return this.addedProduct.length
  }

  isAvailable(productID: string): boolean {
    return this.addedProduct.some((product) => product.id === productID)
  }
}

export default Cart
