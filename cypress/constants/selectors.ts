export const SELECTORS = {
  INGREDIENT: (id: string) => `[data-cy=ingredient-${id}]`,
  ADD_INGREDIENT_BUTTON: 'data-cy=add-ingredient',

  CONSTRUCTOR_BUN_TOP: '[data-cy=constructor-bun-top]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-cy=constructor-bun-bottom]',
  CONSTRUCTOR_INGREDIENTS: '[data-cy=constructor-ingredients]',
  CONSTRUCTOR_PRICE: '[data-cy=constructor-price]',

  ORDER_BUTTON: '[data-cy=order-button]',

  MODAL: '[data-cy=modal]',
  MODAL_CLOSE: '[data-cy=modal-close]',
  MODAL_OVERLAY: '[data-cy=modal-overlay]',
  MODAL_TITLE: '[data-cy=modal-title]',

  INGREDIENT_NAME: '[data-cy=ingredient-name]',
  INGREDIENT_IMAGE: '[data-cy=ingredient-image]',
  INGREDIENT_CALORIES: '[data-cy=ingredient-calories]',
  INGREDIENT_PROTEINS: '[data-cy=ingredient-proteins]',
  INGREDIENT_FAT: '[data-cy=ingredient-fat]',
  INGREDIENT_CARBOHYDRATES: '[data-cy=ingredient-carbohydrates]',

  ORDER_NUMBER: '[data-cy=order-number]',
  ORDER_STATUS: '[data-cy=order-status]',

  LOADING_SPINNER: '[data-cy=loading-spinner]'
} as const;

export const TEXTS = {
  SELECT_BUNS: 'Выберите булки',
  SELECT_FILLING: 'Выберите начинку',
  ORDER_PREPARING: 'Ваш заказ начали готовить',
  ADD_BUTTON: 'Добавить',
  INGREDIENT_DETAILS: 'Детали ингредиента'
} as const;
