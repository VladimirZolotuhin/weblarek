import type { ICustomer } from '../../types'

export class Customer {
  private customerInfo: ICustomer = {
    payment: null,
    email: null,
    phone: null,
    address: null,
  }

  setCustomerInfo(customerInfo: Partial<ICustomer>): void {
    if (customerInfo.payment !== undefined) {
      this.customerInfo.payment = customerInfo.payment
    }
    if (customerInfo.email !== undefined) {
      this.customerInfo.email = customerInfo.email
    }
    if (customerInfo.address !== undefined) {
      this.customerInfo.address = customerInfo.address
    }
    if (customerInfo.phone !== undefined) {
      this.customerInfo.phone = customerInfo.phone
    }
  }

  getCustomerInfo(): ICustomer {
    return this.customerInfo
  }

  eraseCustomerInfo(): void {
    this.customerInfo = {
      payment: null,
      email: null,
      phone: null,
      address: null,
    }
  }

  isCorrect(): { [key in keyof ICustomer]?: string } {
    let errors: { [key in keyof ICustomer]?: string } = {}
    if (!this.customerInfo.payment) {
      errors.payment = 'Не выбран тип оплаты'
    }
    if (!this.customerInfo.email) {
      errors.email = 'Не указан email-адрес'
    }
    if (!this.customerInfo.address) {
      errors.address = 'Не указан адрес покупателя'
    }
    if (!this.customerInfo.phone) {
      errors.phone = 'Не указан номер телефона'
    }

    return errors
  }
}

export default Customer
