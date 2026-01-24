import { CardDefault } from './CardDefault'
import { IEvents } from '../base/Events'
import { IProduct } from '../../types'
import { ensureElement } from '../../utils/utils'

export class CartCard extends CardDefault {
  protected indexElement: HTMLElement
  protected deleteButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container)
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container)
    
    this.deleteButton.addEventListener('click', () => {
      const productId = container.dataset.id
      if (productId) {
        events.emit('cart:item:remove', { id: productId })
      }
    })
  }

  set index(value: number) {
    this.indexElement.textContent = String(value)
  }

  render(data: Partial<IProduct & { index?: number }>): HTMLElement {
    if (data.id) {
      this.container.dataset.id = data.id
    }
    if (data.title) {
      this.TitleValue = data.title
    }
    if (data.price !== undefined) {
      this.PriceValue = data.price
    }
    if (data.index !== undefined) {
      this.index = data.index
    }
    return this.container
  }
}
