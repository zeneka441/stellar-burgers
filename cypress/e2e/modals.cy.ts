import {
  INGREDIENT_IDS,
  INGREDIENT_NAMES,
  SELECTORS,
  TEXTS,
  API_ENDPOINTS
} from '../constants';

describe('Модальные окна', () => {
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

  describe('Модальное окно деталей ингредиента', () => {
    it('должно открыть модальное окно при клике на ингредиент', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN)).click();

      cy.get(SELECTORS.MODAL).should('be.visible');

      cy.get(SELECTORS.MODAL_TITLE).should('contain', TEXTS.INGREDIENT_DETAILS);

      cy.get(SELECTORS.INGREDIENT_NAME).should(
        'contain',
        INGREDIENT_NAMES.CRATER_BUN
      );

      // Проверяем, что отображается ингредиент
      cy.get(SELECTORS.INGREDIENT_IMAGE)
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', 'bun-02-large.png');

      // Проверяем пищевую ценность
      cy.get(SELECTORS.INGREDIENT_CALORIES).should('contain', '420');
      cy.get(SELECTORS.INGREDIENT_PROTEINS).should('contain', '80');
      cy.get(SELECTORS.INGREDIENT_FAT).should('contain', '24');
      cy.get(SELECTORS.INGREDIENT_CARBOHYDRATES).should('contain', '53');
    });

    it('должно закрыть модальное окно при клике на крестик', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN)).click();

      cy.get(SELECTORS.MODAL).should('be.visible');

      cy.get(SELECTORS.MODAL_CLOSE).click();

      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN)).click();

      cy.get(SELECTORS.MODAL).should('be.visible');

      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });

      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрыть модальное окно при нажатии Escape', () => {
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN)).click();

      cy.get(SELECTORS.MODAL).should('be.visible');

      cy.get('body').type('{esc}');

      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно отображать корректные данные для разных типов ингредиентов', () => {
      // Булочка
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.CRATER_BUN)).click();
      cy.get(SELECTORS.INGREDIENT_NAME).should(
        'contain',
        INGREDIENT_NAMES.CRATER_BUN
      );
      cy.get(SELECTORS.MODAL_CLOSE).click();

      // Начинка
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.BIO_CUTLET)).click();
      cy.get(SELECTORS.INGREDIENT_NAME).should(
        'contain',
        INGREDIENT_NAMES.BIO_CUTLET
      );
      cy.get(SELECTORS.MODAL_CLOSE).click();

      // Соус
      cy.get(SELECTORS.INGREDIENT(INGREDIENT_IDS.SPICY_SAUCE)).click();
      cy.get(SELECTORS.INGREDIENT_NAME).should(
        'contain',
        INGREDIENT_NAMES.SPICY_SAUCE
      );
      cy.get(SELECTORS.MODAL_CLOSE).click();
    });
  });
});
