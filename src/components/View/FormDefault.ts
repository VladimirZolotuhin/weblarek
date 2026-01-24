import { Component } from '../base/Component'
import { ensureElement } from '../../utils/utils'

export abstract class FormDefault extends Component<{ isButtonDisabled: boolean; errorMessage: string }> {
  protected submitButton: HTMLButtonElement
  protected errorsElement: HTMLElement

  constructor(container: HTMLElement) {
    super(container)
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container)
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container)
  }

  set isButtonDisabled(value: boolean) {
    this.submitButton.disabled = value
  }

  set errorMessage(message: string) {
    this.errorsElement.textContent = message
  }
}
