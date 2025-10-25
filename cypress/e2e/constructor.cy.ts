import {
  INGREDIENT_IDS,
  INGREDIENT_NAMES,
  SELECTORS,
  TEXTS,
  API_ENDPOINTS
} from '../constants';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.fixture('data').then((data) => {
      cy.intercept('GET', API_ENDPOINTS.INGREDIENTS, {
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
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should(
        'contain',
        INGREDIENT_NAMES.CRATER_BUN
      );
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should(
        'contain',
        INGREDIENT_NAMES.CRATER_BUN
      );

      // Проверяем, что цена обновилась (булка x2)
      cy.get(SELECTORS.CONSTRUCTOR_PRICE).should('contain', '2510');
    });

    it('должен добавить начинку в конструктор', () => {
      // Добавляем котлету
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BIO_CUTLET))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Проверяем, что котлета появилась в списке начинок
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should(
        'contain',
        INGREDIENT_NAMES.BIO_CUTLET
      );

      // Проверяем счетчик ингредиента
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BIO_CUTLET)).should(
        'contain',
        '1'
      );
    });

    it('должен добавить соус в конструктор', () => {
      // Добавляем соус
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.SPICY_SAUCE))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Проверяем, что соус появился в списке начинок
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should(
        'contain',
        INGREDIENT_NAMES.SPICY_SAUCE
      );
    });

    it('должен корректно подсчитывать общую стоимость', () => {
      // Добавляем булку
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Добавляем котлету
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BIO_CUTLET))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Добавляем соус
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.SPICY_SAUCE))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Проверяем итоговую стоимость: булка (1255*2) + котлета (424) + соус (90) = 3024
      cy.get(SELECTORS.CONSTRUCTOR_PRICE).should('contain', '3024');
    });

    it('должен заменить булку при добавлении новой', () => {
      // Добавляем первую булку
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Проверяем, что первая булка добавилась
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should(
        'contain',
        INGREDIENT_NAMES.CRATER_BUN
      );

      // Добавляем вторую булку
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.GALACTIC_BUN))
        .find('button')
        .contains(TEXTS.ADD_BUTTON)
        .click();

      // Проверяем, что булка заменилась
      cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should(
        'contain',
        INGREDIENT_NAMES.GALACTIC_BUN
      );
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should(
        'contain',
        INGREDIENT_NAMES.GALACTIC_BUN
      );

      // Проверяем, что цена обновилась (новая булка x2)
      cy.get(SELECTORS.CONSTRUCTOR_PRICE).should('contain', '180');
    });
  });
});
