import type { IProduct } from '../../types'

export class Product {
  protected items: IProduct[] = []
  protected selectedItem: IProduct | null = null

  setItem(items: IProduct[]): void {
    this.items = items
  }

  getItem(): IProduct[] {
    return this.items
  }

  getItemByID(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id)
  }

  setSelectedItem(chosenItem: IProduct | null): void {
    this.selectedItem = chosenItem
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem
  }
}

export default Product
