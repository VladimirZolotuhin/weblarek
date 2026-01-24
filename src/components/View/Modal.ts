import { Component } from '../base/Component'
import { IEvents } from '../base/Events'
import { ensureElement } from '../../utils/utils'

interface IModal {
  modalContent: HTMLElement
}

export class Modal extends Component<IModal> {
  protected modalElement: HTMLElement
  protected closeButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    this.modalElement = container
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container)
    
    this.closeButton.addEventListener('click', () => {
      this.close()
    })
    
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.close()
      }
    })
  }

  set modalContent(content: HTMLElement) {
    const contentContainer = ensureElement<HTMLElement>('.modal__content', this.modalElement)
    contentContainer.replaceChildren(content)
  }

  open(content: HTMLElement): void {
    this.modalContent = content
    this.modalElement.classList.add('modal_active')
    document.body.classList.add('modal-open')
  }

  close(): void {
    this.modalElement.classList.remove('modal_active')
    document.body.classList.remove('modal-open')
    this.events.emit('modal:close')
  }
}
