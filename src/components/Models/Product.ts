import type { IProduct } from '../../types'
import type { IEvents } from '../base/Events'

export class Product {
  protected items: IProduct[] = []
  protected selectedItem: IProduct | null = null

  constructor(protected events: IEvents) {}

  setItem(items: IProduct[]): void {
    this.items = items
    this.events.emit('catalog:changed', { items: this.items })
  }

  getItem(): IProduct[] {
    return this.items
  }

  getItemByID(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id)
  }

  setSelectedItem(chosenItem: IProduct | null): void {
    this.selectedItem = chosenItem
    this.events.emit('preview:changed', { item: this.selectedItem })
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem
  }
}

export default Product
