import { Component } from '../base/Component'
import { IEvents } from '../base/Events'
import { ensureElement } from '../../utils/utils'

interface ICart {
  listItems: HTMLElement[]
  totalPrice: number
  isToOrderButtonDisabled: boolean
}

export class Cart extends Component<ICart> {
  protected totalElement: HTMLElement
  protected toOrderButton: HTMLButtonElement
  protected cartList: HTMLElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.totalElement = ensureElement<HTMLElement>('.basket__price', container)
    this.toOrderButton = ensureElement<HTMLButtonElement>('.basket__button', container)
    this.cartList = ensureElement<HTMLElement>('.basket__list', container)
    
    this.toOrderButton.addEventListener('click', () => {
      events.emit('order:make')
    })
  }

  set isToOrderButtonDisabled(value: boolean) {
    this.toOrderButton.disabled = value
  }

  set listItems(list: HTMLElement[]) {
    if (list.length === 0) {
      this.cartList.innerHTML = '<li class="basket__item">Корзина пуста</li>'
    } else {
      this.cartList.replaceChildren(...list)
    }
  }

  set totalPrice(price: number) {
    this.totalElement.textContent = `${price} синапсов`
  }
}
