import { CardDefault } from './CardDefault'
import { IProduct } from '../../types'
import { ensureElement } from '../../utils/utils'
import { CDN_URL } from '../../utils/constants'
import { categoryMap } from '../../utils/constants'

export class CatalogCard extends CardDefault {
  protected image: HTMLImageElement
  protected category: HTMLElement

  constructor(container: HTMLElement, protected onClick: () => void) {
    super(container)
    this.image = ensureElement<HTMLImageElement>('.card__image', container)
    this.category = ensureElement<HTMLElement>('.card__category', container)
    
    container.addEventListener('click', () => {
      this.onClick()
    })
  }

  set categoryValue(value: string) {
    this.category.textContent = value
    const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other'
    this.category.className = `card__category ${categoryClass}`
  }

  set imageSrc(src: string) {
    this.setImage(this.image, CDN_URL + src, this.title.textContent || '')
  }

  render(data: Partial<IProduct>): HTMLElement {
    if (data.title) {
      this.titleValue = data.title
    }
    if (data.price !== undefined) {
      this.priceValue = data.price
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
