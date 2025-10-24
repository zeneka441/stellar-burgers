describe('Конструктор бургера', () => {
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

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Находим булку и добавляем в конструктор
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.get('[data-cy=constructor-bun-top]').should(
        'contain',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy=constructor-bun-bottom]').should(
        'contain',
        'Краторная булка N-200i'
      );

      // Проверяем, что цена обновилась (булка x2)
      cy.get('[data-cy=constructor-price]').should('contain', '2510');
    });

    it('должен добавить начинку в конструктор', () => {
      // Добавляем котлету
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941] button').click();

      // Проверяем, что котлета появилась в списке начинок
      cy.get('[data-cy=constructor-ingredients]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );

      // Проверяем счетчик ингедиента
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]').should(
        'contain',
        '1'
      );
    });

    it('должен добавить соус в конструктор', () => {
      // Добавляем соус
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0942] button').click();

      // Проверяем, что соус появился в списке начинок
      cy.get('[data-cy=constructor-ingredients]').should(
        'contain',
        'Соус Spicy-X'
      );
    });

    it('должен корректно подсчитывать общую стоимость', () => {
      // Добавляем булку
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();

      // Добавляем котлету
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941] button').click();

      // Добавляем соус
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0942] button').click();

      // Проверяем итоговую стоимость: булка (1255*2) + котлета (424) + соус (90) = 3024
      cy.get('[data-cy=constructor-price]').should('contain', '3024');
    });

    it('должен заменить булку при добавлении новой', () => {
      // Добавляем первую булку
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c] button').click();

      // Проверяем, что первая булка добавилась
      cy.get('[data-cy=constructor-bun-top]').should(
        'contain',
        'Краторная булка N-200i'
      );

      // Добавляем вторую булку
      cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0944] button').click();

      // Проверяем, что булка заменилась
      cy.get('[data-cy=constructor-bun-top]').should(
        'contain',
        'Традиционная галактическая булочка'
      );
      cy.get('[data-cy=constructor-bun-bottom]').should(
        'contain',
        'Традиционная галактическая булочка'
      );

      // Проверяем, что цена обновилась (новая булка x2)
      cy.get('[data-cy=constructor-price]').should('contain', '180');
    });
  });
});
