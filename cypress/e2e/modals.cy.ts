describe('Модальные окна', () => {
  beforeEach(() => {
    cy.fixture('data').then((data) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: { success: true, data: data.ingredients }
      }).as('getIngredients');
    });

    cy.visit('/');

    cy.wait('@getIngredients');
  });

  describe('Модальное окно деталей ингредиента', () => {
    it('должно открыть модальное окно при клике на ингредиент', () => {
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]').click();

      cy.get('[data-cy=modal]').should('be.visible');

      cy.get('[data-cy=modal-title]').should('contain', 'Детали ингредиента');

      cy.get('[data-cy=ingredient-name]').should(
        'contain',
        'Краторная булка N-200i'
      );

      // Проверяем, что отображается ингредиент
      cy.get('[data-cy=ingredient-image]')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', 'bun-02-large.png');

      // Проверяем пищевую ценность
      cy.get('[data-cy=ingredient-calories]').should('contain', '420');
      cy.get('[data-cy=ingredient-proteins]').should('contain', '80');
      cy.get('[data-cy=ingredient-fat]').should('contain', '24');
      cy.get('[data-cy=ingredient-carbohydrates]').should('contain', '53');
    });

    it('должно закрыть модальное окно при клике на крестик', () => {
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]').click();

      cy.get('[data-cy=modal]').should('be.visible');

      cy.get('[data-cy=modal-close]').click();

      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]').click();

      cy.get('[data-cy=modal]').should('be.visible');

      cy.get('[data-cy=modal-overlay]').click({ force: true });

      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должно закрыть модальное окно при нажатии Escape', () => {
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]').click();

      cy.get('[data-cy=modal]').should('be.visible');

      cy.get('body').type('{esc}');

      cy.get('[data-cy=modal]').should('not.exist');
    });

    it('должно отображать корректные данные для разных типов ингредиентов', () => {
      // Булочка
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]').click();
      cy.get('[data-cy=ingredient-name]').should(
        'contain',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy=modal-close]').click();

      // Начинка
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]').click();
      cy.get('[data-cy=ingredient-name]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
      cy.get('[data-cy=modal-close]').click();

      // Соус
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0942]').click();
      cy.get('[data-cy=ingredient-name]').should('contain', 'Соус Spicy-X');
      cy.get('[data-cy=modal-close]').click();
    });
  });
});
