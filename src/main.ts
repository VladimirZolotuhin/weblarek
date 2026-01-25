import './scss/styles.scss'

import { Cart as CartModel } from './components/Models/Cart'
import { Customer } from './components/Models/Customer'
import { Product } from './components/Models/Product'
import { ApiService } from './components/Models/ApiService'
import { Api } from './components/base/Api'
import { EventEmitter } from './components/base/Events'

import { API_URL } from './utils/constants'
import { cloneTemplate, ensureElement } from './utils/utils'

import { IProduct, IOrder } from './types'

// View-компоненты
import { Header } from './components/View/Header'
import { Gallery } from './components/View/Gallery'
import { Modal } from './components/View/Modal'
import { CatalogCard } from './components/View/CatalogCard'
import { PreviewCard } from './components/View/PreviewCard'
import { CartCard } from './components/View/CartCard'
import { Cart as CartView } from './components/View/Cart'
import { Confirmation } from './components/View/Confirmation'
import { FormOrder } from './components/View/FormOrder'
import { ContactsForm } from './components/View/ContactsForm'

// Брокер событий
const events = new EventEmitter()

// Модели (передаём events для генерации событий при изменении данных)
const productModel = new Product(events)
const cartModel = new CartModel(events)
const customerModel = new Customer(events)

// API
const apiService = new ApiService(new Api(API_URL))

// View-компоненты
const header = new Header(ensureElement<HTMLElement>('.header'), events)
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'), events)
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

// Текущие формы (для валидации через представления)
let currentOrderForm: FormOrder | null = null
let currentContactsForm: ContactsForm | null = null

// изменение каталога товаров
events.on('catalog:changed', ({ items }: { items: IProduct[] }) => {
  const cards = items.map((product) => {
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), () => {
      events.emit('card:open', { id: product.id })
    })
    return card.render(product)
  })
  gallery.catalog = cards
})

// изменение выбранного товара для просмотра
events.on('preview:changed', ({ item }: { item: IProduct | null }) => {
  if (!item) return

  const previewCard = new PreviewCard(cloneTemplate(cardPreviewTemplate), () => {
    events.emit('card:button:clicked', { id: item.id })
  })
  previewCard.render(item)

  const isInCart = cartModel.isAvailable(item.id)
  if (isInCart) {
    previewCard.buttonText = 'Удалить из корзины'
    previewCard.isButtonDisabled = false
  } else {
    previewCard.buttonText = item.price === null ? 'Недоступно' : 'В корзину'
    previewCard.isButtonDisabled = item.price === null
  }

  modal.open(previewCard.render({}))
})

// изменение содержимого корзины
events.on('cart:changed', () => {
  header.counter = cartModel.getAmountOfItems()
})

// изменение данных покупателя (валидация форм)
events.on('customer:changed', () => {
  // Валидация будет выполнена при открытии форм
})

// выбор карточки для просмотра
events.on('card:open', ({ id }: { id: string }) => {
  const product = productModel.getItemByID(id)
  if (product) {
    productModel.setSelectedItem(product)
  }
})

// нажатие кнопки покупки/удаления товара
events.on('card:button:clicked', ({ id }: { id: string }) => {
  const product = productModel.getItemByID(id)
  if (!product) return

  if (cartModel.isAvailable(product.id)) {
    cartModel.removeFromCart(product.id)
  } else {
    cartModel.addToCart(product)
  }

  modal.close()
})

// нажатие кнопки открытия корзины
events.on('cart:open', () => {
  renderCart()
})

// нажатие кнопки удаления товара из корзины
events.on('cart:item:remove', ({ id }: { id: string }) => {
  cartModel.removeFromCart(id)
  renderCart()
})

// нажатие кнопки оформления заказа
events.on('order:make', () => {
  renderOrderForm()
})

// выбор способа оплаты
events.on('payment:chosen', ({ payment }: { payment: 'online' | 'cash' }) => {
  customerModel.setCustomerInfo({ payment })
  if (currentOrderForm) {
    currentOrderForm.payment = payment
    validateOrderForm()
  }
})

// изменение адреса доставки
events.on('address:input', ({ address }: { address: string }) => {
  customerModel.setCustomerInfo({ address })
  validateOrderForm()
})

// нажатие кнопки перехода ко второй форме
events.on('order:data:submit', () => {
  const errors = customerModel.validate()
  if (!errors.payment && !errors.address) {
    renderContactsForm()
  }
})

// изменение email
events.on('email:input', ({ email }: { email: string }) => {
  customerModel.setCustomerInfo({ email })
  validateContactsForm()
})

// изменение телефона
events.on('phone:input', ({ phone }: { phone: string }) => {
  customerModel.setCustomerInfo({ phone })
  validateContactsForm()
})

// нажатие кнопки оплаты/завершения заказа
events.on('order:confirm', () => {
  const errors = customerModel.validate()
  if (Object.keys(errors).length > 0) return

  const customerData = customerModel.getCustomerInfo()
  const items = cartModel.getItems()

  const order: IOrder = {
    payment: customerData.payment!,
    email: customerData.email!,
    phone: customerData.phone!,
    address: customerData.address!,
    total: cartModel.getTotalCost(),
    items: items.filter(item => item.price !== null).map((item) => item.id),
  }

  apiService
    .postOrder(order)
    .then((response) => {
      const confirmation = new Confirmation(cloneTemplate(successTemplate), events)
      confirmation.total = response.total
      modal.open(confirmation.render())

      cartModel.removeAllItems()
      customerModel.eraseCustomerInfo()
    })
    .catch(() => {
      // Ошибка при отправке заказа
    })
})

// завершение заказа (закрытие окна успеха)
events.on('order:completed', () => {
  modal.close()
})

// закрытие модального окна
events.on('modal:close', () => {
  productModel.setSelectedItem(null)
  currentOrderForm = null
  currentContactsForm = null
})

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ РЕНДЕРИНГА

function renderCart(): void {
  const cartView = new CartView(cloneTemplate(basketTemplate), events)
  const items = cartModel.getItems()

  if (items.length === 0) {
    cartView.listItems = []
    cartView.isToOrderButtonDisabled = true
  } else {
    const cartCards = items.map((product, index) => {
      const card = new CartCard(cloneTemplate(cardBasketTemplate), () => {
        events.emit('cart:item:remove', { id: product.id })
      })
      return card.render({ ...product, index: index + 1 })
    })
    cartView.listItems = cartCards
    cartView.isToOrderButtonDisabled = false
  }

  cartView.totalPrice = cartModel.getTotalCost()
  modal.open(cartView.render())
}

function renderOrderForm(): void {
  currentOrderForm = new FormOrder(cloneTemplate(orderTemplate), events)

  const customerData = customerModel.getCustomerInfo()
  if (customerData.payment) {
    currentOrderForm.payment = customerData.payment
  }
  if (customerData.address) {
    currentOrderForm.address = customerData.address
  }

  validateOrderForm()
  modal.open(currentOrderForm.render())
}

function renderContactsForm(): void {
  currentContactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events)

  const customerData = customerModel.getCustomerInfo()
  if (customerData.email) {
    currentContactsForm.email = customerData.email
  }
  if (customerData.phone) {
    currentContactsForm.phone = customerData.phone
  }

  validateContactsForm()
  modal.open(currentContactsForm.render())
}

function validateOrderForm(): void {
  if (!currentOrderForm) return
  
  const errors = customerModel.validate()
  const paymentError = errors.payment
  const addressError = errors.address

  if (paymentError || addressError) {
    currentOrderForm.errorMessage = [paymentError, addressError].filter(Boolean).join(', ')
    currentOrderForm.isButtonDisabled = true
  } else {
    currentOrderForm.errorMessage = ''
    currentOrderForm.isButtonDisabled = false
  }
}

function validateContactsForm(): void {
  if (!currentContactsForm) return
  
  const errors = customerModel.validate()
  const emailError = errors.email
  const phoneError = errors.phone

  if (emailError || phoneError) {
    currentContactsForm.errorMessage = [emailError, phoneError].filter(Boolean).join(', ')
    currentContactsForm.isButtonDisabled = true
  } else {
    currentContactsForm.errorMessage = ''
    currentContactsForm.isButtonDisabled = false
  }
}

// Загрузка товаров с сервера
apiService
  .getProducts()
  .then((products) => {
    productModel.setItem(products)
  })
  .catch(() => {
    // Ошибка загрузки каталога
  })
