import { FormDefault } from './FormDefault'
import { IEvents } from '../base/Events'
import { ensureElement } from '../../utils/utils'

export class ContactsForm extends FormDefault {
  protected emailElement: HTMLInputElement
  protected phoneElement: HTMLInputElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', container)
    this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', container)
    
    this.emailElement.addEventListener('input', () => {
      events.emit('email:input', { email: this.emailElement.value })
    })
    
    this.phoneElement.addEventListener('input', () => {
      events.emit('phone:input', { phone: this.phoneElement.value })
    })
    
    container.addEventListener('submit', (e) => {
      e.preventDefault()
      events.emit('order:confirm')
    })
  }

  set email(value: string) {
    this.emailElement.value = value
  }

  set phone(value: string) {
    this.phoneElement.value = value
  }
}
