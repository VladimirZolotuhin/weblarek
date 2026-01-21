import type { IProduct } from '../../types'

export class Cart {
  private addedProduct: IProduct[] = []

  getItems(): IProduct[] {
    return this.addedProduct
  }

  addToCart(addedProduct: IProduct): void {
    this.addedProduct.push(addedProduct)
  }

  removeFromCart(productID: string): void {
    this.addedProduct = this.addedProduct.filter(
      (product) => product.id !== productID,
    )
  }

  removeAllItems(): void {
    this.addedProduct = []
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
