import './scss/styles.scss'

import { Cart } from './components/Models/Cart'
import { Customer } from './components/Models/Customer'
import { Product } from './components/Models/Product'
import { ApiService } from './components/Models/ApiService'
import { Api } from './components/base/Api'

import { apiProducts } from '../src/utils/data'
import { API_URL } from './utils/constants'

import { IApi, ICustomer, IOrder } from './types'

const productModel = new Product()
const cartModel = new Cart()
const customer = new Customer()

// Product  

productModel.setItem(apiProducts.items)

console.log('Все товары каталога:', productModel.getItem())

const exampleId = apiProducts.items[4]?.id
console.log('Поиск товара по id:', productModel.getItemByID(exampleId))

productModel.setSelectedItem(apiProducts.items[2])
console.log('Выбранный товар:', productModel.getSelectedItem())

// Cart 

cartModel.addToCart(apiProducts.items[1])
cartModel.addToCart(apiProducts.items[3])
cartModel.addToCart(apiProducts.items[0])

console.log('Содержимое корзины:', cartModel.getItems())

const idToRemove = cartModel.getItems()[1].id
console.log(`Удаляем позицию с id ${idToRemove}`)
cartModel.removeFromCart(idToRemove)

console.log('Корзина после удаления:', cartModel.getItems())

console.log('Итого стоимость:', cartModel.getTotalCost())
console.log('Количество позиций:', cartModel.getAmountOfItems())

const checkId1 = apiProducts.items[1].id
const checkId2 = apiProducts.items[5]?.id || 'несуществующий-id'

console.log(
  `Товар ${checkId1} есть в корзине?`,
  cartModel.isAvailable(checkId1),
)
console.log(
  `Товар ${checkId2} есть в корзине?`,
  cartModel.isAvailable(checkId2),
)

console.log('Очистка корзины...')
cartModel.removeAllItems()

console.log('Корзина после очистки:', cartModel.getItems())

// Customer 

const customerData1: ICustomer = {
  payment: 'online',
  email: 'user123@example.com',
  phone: '+79991234567',
  address: 'Москва, ул. Ленина, 10-42',
}

customer.setCustomerInfo(customerData1)
console.log('Данные покупателя:', customer.getCustomerInfo())
console.log('Валидация:', customer.isCorrect())

const customerData2: ICustomer = {
  payment: null,
  email: 'test@mail.ru',
  phone: '88005553535',
  address: null,
}

customer.setCustomerInfo(customerData2)
console.log('\nНеполные данные:', customer.getCustomerInfo())
console.log('Валидация:', customer.isCorrect())

customer.setCustomerInfo({ address: 'Казань, Кремль' })
console.log('После частичного обновления:', customer.isCorrect())

console.log('Сброс всех данных...')
customer.eraseCustomerInfo()
console.log('Текущее состояние:', customer.getCustomerInfo())

//  ApiService 

const apiInstance = new Api(API_URL) as unknown as IApi
const apiService = new ApiService(apiInstance)

console.log('Запрашиваем каталог товаров...')
apiService
  .getProducts()
  .then((products) => console.log('Получено товаров:', products.length))
  .catch((err) => console.error('Ошибка загрузки каталога:', err))

const orderExample: IOrder = {
  payment: 'cash',
  email: 'order@test.org',
  phone: '+78124567890',
  address: 'Санкт-Петербург, Невский 22',
  total: 5400,
  items: [
    'b0a13d7d-d18e-4c2f-a2e1-9f8c4e3d5f1a',
    'f7d2c9a1-8e4b-4c5d-9f6e-3a1b2c7d8e9f',
  ],
}

console.log('Отправка тестового заказа...')
apiService
  .postOrder(orderExample)
  .then((response) => console.log('Ответ сервера:', response))
  .catch((error) => console.log('Ошибка при отправке заказа:', error))
