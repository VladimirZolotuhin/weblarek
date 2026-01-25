import { CardDefault } from './CardDefault'
import { IProduct } from '../../types'
import { ensureElement } from '../../utils/utils'

export class CartCard extends CardDefault {
  protected indexElement: HTMLElement
  protected deleteButton: HTMLButtonElement

  constructor(container: HTMLElement, protected onDelete: () => void) {
    super(container)
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container)
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container)
    
    this.deleteButton.addEventListener('click', () => {
      this.onDelete()
    })
  }

  set index(value: number) {
    this.indexElement.textContent = String(value)
  }

  render(data: Partial<IProduct & { index?: number }>): HTMLElement {
    if (data.title) {
      this.titleValue = data.title
    }
    if (data.price !== undefined) {
      this.priceValue = data.price
    }
    if (data.index !== undefined) {
      this.index = data.index
    }
    return this.container
  }
}
