// Константы событий для взаимодействия между компонентами
export const Actions = {
  // События данных
  PRODUCT_RECEIVED: 'product:received',
  CUSTOMER_UPDATE: 'customer:update',
  
  // События интерфейса
  CART_OPEN: 'cart:open',
  MODAL_CLOSE: 'modal:close',
  CARD_OPEN: 'card:open',
  CART_UPDATE: 'cart:update',
  CARD_BUTTON_CLICKED: 'card:button:clicked',
  CART_ITEM_REMOVE: 'cart:item:remove',
  
  // События заказа
  MAKE_ORDER: 'order:make',
  DATA_SUBMIT: 'order:data:submit',
  CONFIRM_ORDER: 'order:confirm',
  ORDER_COMPLETED: 'order:completed',
  
  // События формы
  PAYMENT_CHOSEN: 'payment:chosen',
  ADDRESS_INPUT: 'address:input',
  EMAIL_INPUT: 'email:input',
  PHONE_INPUT: 'phone:input',
} as const

export type ActionType = typeof Actions[keyof typeof Actions]
