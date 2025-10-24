describe('Создание заказа', () => {
  beforeEach(() => {
    cy.fixture('data').then((data) => {
      cy.clearLocalStorage();

      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: { success: true, data: data.ingredients }
      }).as('getIngredients');

      cy.intercept('GET', 'api/auth/user', {
        statusCode: 200,
        body: data.user
      }).as('getUser');

      cy.intercept('POST', 'api/auth/login', {
        statusCode: 200,
        body: data.loginResponse
      }).as('login');

      cy.intercept('POST', 'api/orders', {
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
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();

    // Добавляем начинку
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941] button').click();

    // Добавляем соус
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0942] button').click();

    // Проверяем, что все ингредиенты добавлены в конструктор
    cy.get('[data-cy=constructor-bun-top]').should('be.visible');
    cy.get('[data-cy=constructor-bun-bottom]').should('be.visible');
    cy.get('[data-cy=constructor-ingredients]').should('contain', 'Биокотлета');
    cy.get('[data-cy=constructor-ingredients]').should(
      'contain',
      'Соус Spicy-X'
    );

    // Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy=order-button]').click();
    cy.wait('@createOrder');
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=order-number]').should('contain', '12345');

    // Проверяем текст в модальном окне
    cy.get('[data-cy=order-status]').should(
      'contain',
      'Ваш заказ начали готовить'
    );

    cy.get('[data-cy=modal-close]').click();

    // Проверяем, что конструктор очистился после создания заказа
    cy.get('[data-cy=constructor-bun-top]').should('contain', 'Выберите булки');
    cy.get('[data-cy=constructor-bun-bottom]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy=constructor-ingredients]').should(
      'contain',
      'Выберите начинку'
    );
    cy.get('[data-cy=constructor-price]').should('contain', '0');
  });

  it('не должен позволить создать заказ без булки', () => {
    // Добавляем только начинку без булки
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941] button').click();

    cy.get('[data-cy=order-button]').click();

    // Проверяем, что модальное окно не открылось
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('должен показать модальное окно заказа и корректно его закрыть', () => {
    // Создаем заказ
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();

    cy.get('[data-cy=order-button]').click();
    cy.wait('@createOrder');

    // Проверяем модальное окно
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=order-number]').should('be.visible');
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    // Создаем еще один заказ для проверки закрытия по overlay
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();

    cy.get('[data-cy=order-button]').click();
    cy.wait('@createOrder');

    // Закрываем по overlay
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('должен показать индикатор загрузки при создании заказа', () => {
    cy.intercept('POST', 'api/orders', (req) => {
      req.reply({
        delay: 2000,
        statusCode: 200,
        body: { success: true, name: 'Test Order', order: { number: 12345 } }
      });
    }).as('createOrderDelayed');

    // Добавляем булку в заказ
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();
    cy.get('[data-cy=order-button]').click();

    // Проверяем, что показывается индикатор загрузки
    cy.get('[data-cy=loading-spinner]').should('be.visible');

    // Ждем завершения запроса
    cy.wait('@createOrderDelayed');

    // Проверяем, что индикатор загрузки исчез
    cy.get('[data-cy=loading-spinner]').should('not.exist');
  });

  it('не должен позволить создать заказ неавторизованному пользователю', () => {
    // Очищаем токены авторизации
    cy.clearLocalStorage();

    // Перехватываем запрос проверки пользователя и возвращаем ошибку 401
    cy.intercept('GET', 'api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'not authorized' }
    }).as('getUserUnauthorized');

    // Добавляем булку
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();

    // Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy=order-button]').click();

    // Проверяем, что происходит редирект на страницу входа
    cy.url().should('include', '/login');
  });
});
