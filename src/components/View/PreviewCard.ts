import { CardDefault } from './CardDefault'
import { IEvents } from '../base/Events'
import { IProduct } from '../../types'
import { ensureElement } from '../../utils/utils'
import { CDN_URL } from '../../utils/constants'
import { categoryMap } from '../../utils/constants'

export class PreviewCard extends CardDefault {
  protected descriptionElement: HTMLElement
  protected cardButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container)
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', container)
    
    this.cardButton.addEventListener('click', () => {
      const productId = container.dataset.id
      if (productId) {
        events.emit('card:button:clicked', { id: productId })
      }
    })
  }

  set description(value: string) {
    this.descriptionElement.textContent = value
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value
  }

  set isButtonDisabled(value: boolean) {
    this.cardButton.disabled = value
  }

  render(data: Partial<IProduct>): HTMLElement {
    if (data.id) {
      this.container.dataset.id = data.id
    }
    if (data.title) {
      this.TitleValue = data.title
    }
    if (data.price !== undefined) {
      this.PriceValue = data.price
    }
    if (data.description) {
      this.description = data.description
    }
    if (data.image) {
      const imageElement = ensureElement<HTMLImageElement>('.card__image', this.container)
      this.setImage(imageElement, CDN_URL + data.image, data.title || '')
    }
    if (data.category) {
      const categoryElement = ensureElement<HTMLElement>('.card__category', this.container)
      categoryElement.textContent = data.category
      const categoryClass = categoryMap[data.category as keyof typeof categoryMap] || 'card__category_other'
      categoryElement.className = `card__category ${categoryClass}`
    }
    return this.container
  }
}
