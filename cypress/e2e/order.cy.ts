import {
  INGREDIENT_IDS,
  INGREDIENT_NAMES,
  SELECTORS,
  TEXTS,
  API_ENDPOINTS,
  ROUTES
} from '../constants';

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.fixture('data').then((data) => {
      cy.clearLocalStorage();

      cy.intercept('GET', API_ENDPOINTS.INGREDIENTS, {
        statusCode: 200,
        body: { success: true, data: data.ingredients }
      }).as('getIngredients');

      cy.intercept('GET', API_ENDPOINTS.AUTH_USER, {
        statusCode: 200,
        body: data.user
      }).as('getUser');

      cy.intercept('POST', API_ENDPOINTS.AUTH_LOGIN, {
        statusCode: 200,
        body: data.loginResponse
      }).as('login');

      cy.intercept('POST', API_ENDPOINTS.ORDERS, {
        statusCode: 200,
        body: data.order
      }).as('createOrder');
    });

    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'Bearer test-access-token');
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  it('должен создать заказ с полным бургером', () => {
    // Добавляем булку
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();

    // Добавляем начинку
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BIO_CUTLET))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();

    // Добавляем соус
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.SPICY_SAUCE))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();

    // Проверяем, что все ингредиенты добавлены в конструктор
    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('be.visible');
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('be.visible');
    cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain', 'Биокотлета');
    cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should(
      'contain',
      INGREDIENT_NAMES.SPICY_SAUCE
    );

    // Кликаем на кнопку "Оформить заказ"
    cy.get(SELECTORS.ORDER_BUTTON).click();
    cy.wait('@createOrder');
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get(SELECTORS.ORDER_NUMBER).should('contain', '12345');

    // Проверяем текст в модальном окне
    cy.get(SELECTORS.ORDER_STATUS).should('contain', TEXTS.ORDER_PREPARING);

    cy.get(SELECTORS.MODAL_CLOSE).click();

    // Проверяем, что конструктор очистился после создания заказа
    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('contain', TEXTS.SELECT_BUNS);
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should(
      'contain',
      TEXTS.SELECT_BUNS
    );
    cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should(
      'contain',
      TEXTS.SELECT_FILLING
    );
    cy.get(SELECTORS.CONSTRUCTOR_PRICE).should('contain', '0');
  });

  it('не должен позволить создать заказ без булки', () => {
    // Добавляем только начинку без булки
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BIO_CUTLET))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();

    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Проверяем, что модальное окно не открылось
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('должен показать модальное окно заказа и корректно его закрыть', () => {
    // Создаем заказ
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();

    cy.get(SELECTORS.ORDER_BUTTON).click();
    cy.wait('@createOrder');

    // Проверяем модальное окно
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get(SELECTORS.ORDER_NUMBER).should('be.visible');
    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    // Создаем еще один заказ для проверки закрытия по overlay
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();

    cy.get(SELECTORS.ORDER_BUTTON).click();
    cy.wait('@createOrder');

    // Закрываем по overlay
    cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('должен показать индикатор загрузки при создании заказа', () => {
    cy.intercept('POST', API_ENDPOINTS.ORDERS, (req) => {
      req.reply({
        delay: 2000,
        statusCode: 200,
        body: { success: true, name: 'Test Order', order: { number: 12345 } }
      });
    }).as('createOrderDelayed');

    // Добавляем булку в заказ
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Проверяем, что показывается индикатор загрузки
    cy.get(SELECTORS.LOADING_SPINNER).should('be.visible');

    // Ждем завершения запроса
    cy.wait('@createOrderDelayed');

    // Проверяем, что индикатор загрузки исчез
    cy.get(SELECTORS.LOADING_SPINNER).should('not.exist');
  });

  it('не должен позволить создать заказ неавторизованному пользователю', () => {
    // Очищаем токены авторизации
    cy.clearLocalStorage();

    // Перехватываем запрос проверки пользователя и возвращаем ошибку 401
    cy.intercept('GET', API_ENDPOINTS.AUTH_USER, {
      statusCode: 401,
      body: { success: false, message: 'not authorized' }
    }).as('getUserUnauthorized');

    // Добавляем булку
    cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
      .find('button')
      .contains(TEXTS.ADD_BUTTON)
      .click();

    // Кликаем на кнопку "Оформить заказ"
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Проверяем, что происходит редирект на страницу входа
    cy.url().should('include', ROUTES.LOGIN);
  });
});
