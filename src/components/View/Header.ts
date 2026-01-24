import { Component } from '../base/Component'
import { IEvents } from '../base/Events'
import { ensureElement } from '../../utils/utils'

interface IHeader {
  counter: number
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement
  protected basketButton: HTMLElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container)
    this.basketButton = ensureElement<HTMLElement>('.header__basket', container)
    
    this.basketButton.addEventListener('click', () => {
      events.emit('cart:open')
    })
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value)
  }
}
