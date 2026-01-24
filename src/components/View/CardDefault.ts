import { Component } from '../base/Component'
import { ensureElement } from '../../utils/utils'

export interface ICardData {
  title: string
  price: number | null
}

export abstract class CardDefault extends Component<ICardData> {
  protected title: HTMLElement
  protected price: HTMLElement

  constructor(container: HTMLElement) {
    super(container)
    this.title = ensureElement<HTMLElement>('.card__title', container)
    this.price = ensureElement<HTMLElement>('.card__price', container)
  }

  set TitleValue(value: string) {
    this.title.textContent = value
  }

  set PriceValue(value: number | null) {
    if (value === null) {
      this.price.textContent = 'Бесценно'
    } else {
      this.price.textContent = `${value} синапсов`
    }
  }
}
