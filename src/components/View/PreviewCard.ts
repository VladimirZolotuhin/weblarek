import { CardDefault } from './CardDefault'
import { IProduct } from '../../types'
import { ensureElement } from '../../utils/utils'
import { CDN_URL } from '../../utils/constants'
import { categoryMap } from '../../utils/constants'

export class PreviewCard extends CardDefault {
  protected descriptionElement: HTMLElement
  protected cardButton: HTMLButtonElement
  protected imageElement: HTMLImageElement
  protected categoryElement: HTMLElement

  constructor(container: HTMLElement, protected onButtonClick: () => void) {
    super(container)
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container)
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', container)
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container)
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container)
    
    this.cardButton.addEventListener('click', () => {
      this.onButtonClick()
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

  set imageSrc(src: string) {
    this.setImage(this.imageElement, CDN_URL + src, this.title.textContent || '')
  }

  set categoryValue(value: string) {
    this.categoryElement.textContent = value
    const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other'
    this.categoryElement.className = `card__category ${categoryClass}`
  }

  render(data: Partial<IProduct>): HTMLElement {
    if (data.title) {
      this.titleValue = data.title
    }
    if (data.price !== undefined) {
      this.priceValue = data.price
    }
    if (data.description) {
      this.description = data.description
    }
    if (data.image) {
      this.imageSrc = data.image
    }
    if (data.category) {
      this.categoryValue = data.category
    }
    return this.container
  }
}
