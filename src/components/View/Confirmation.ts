import { Component } from '../base/Component'
import { IEvents } from '../base/Events'
import { ensureElement } from '../../utils/utils'

interface IConfirmation {
  total: number
}

export class Confirmation extends Component<IConfirmation> {
  protected totalCostElement: HTMLElement
  protected closeButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.totalCostElement = ensureElement<HTMLElement>('.order-success__description', container)
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container)
    
    this.closeButton.addEventListener('click', () => {
      events.emit('order:completed')
    })
  }

  set total(value: number) {
    this.totalCostElement.textContent = `Списано ${value} синапсов`
  }
}
