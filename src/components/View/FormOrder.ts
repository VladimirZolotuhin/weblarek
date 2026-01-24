import { FormDefault } from './FormDefault'
import { IEvents } from '../base/Events'
import { PaymentType } from '../../types'
import { ensureElement } from '../../utils/utils'

export class FormOrder extends FormDefault {
  protected cashButton: HTMLButtonElement
  protected cardButton: HTMLButtonElement
  protected addressElement: HTMLInputElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container)
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container)
    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', container)
    
    this.cashButton.addEventListener('click', () => {
      this.payment = 'cash'
      events.emit('payment:chosen', { payment: 'cash' })
    })
    
    this.cardButton.addEventListener('click', () => {
      this.payment = 'online'
      events.emit('payment:chosen', { payment: 'online' })
    })
    
    this.addressElement.addEventListener('input', () => {
      events.emit('address:input', { address: this.addressElement.value })
    })
    
    container.addEventListener('submit', (e) => {
      e.preventDefault()
      events.emit('order:data:submit')
    })
  }

  set payment(value: PaymentType) {
    if (value === 'cash') {
      this.cashButton.classList.add('button_alt-active')
      this.cardButton.classList.remove('button_alt-active')
    } else if (value === 'online') {
      this.cardButton.classList.add('button_alt-active')
      this.cashButton.classList.remove('button_alt-active')
    } else {
      this.cashButton.classList.remove('button_alt-active')
      this.cardButton.classList.remove('button_alt-active')
    }
  }

  set address(value: string) {
    this.addressElement.value = value
  }
}
