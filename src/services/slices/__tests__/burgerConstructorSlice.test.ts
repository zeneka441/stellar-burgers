import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Мокаем uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234')
}));

describe('Слайс конструктора бургера', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 200,
    image: 'image.jpg',
    image_mobile: 'image_mobile.jpg',
    image_large: 'image_large.jpg'
  };

  const mockIngredient: TIngredient = {
    _id: '2',
    name: 'Мясо',
    type: 'main',
    proteins: 25,
    fat: 15,
    carbohydrates: 0,
    calories: 300,
    price: 500,
    image: 'meat.jpg',
    image_mobile: 'meat_mobile.jpg',
    image_large: 'meat_large.jpg'
  };

  const mockSauce: TIngredient = {
    _id: '3',
    name: 'Соус',
    type: 'sauce',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 50,
    price: 100,
    image: 'sauce.jpg',
    image_mobile: 'sauce_mobile.jpg',
    image_large: 'sauce_large.jpg'
  };

  describe('Добавление ингредиента', () => {
    it('должен добавить булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const newState = burgerConstructorReducer(initialState, action);

      expect(newState.bun).toEqual({
        ...mockBun,
        id: 'test-uuid-1234'
      });
      expect(newState.ingredients).toEqual([]);
    });

    it('должен заменить существующую булку при добавлении новой', () => {
      const stateWithBun = {
        bun: { ...mockBun, id: 'old-bun-id' } as TConstructorIngredient,
        ingredients: []
      };

      const newBun: TIngredient = {
        ...mockBun,
        _id: '4',
        name: 'Новая булка'
      };

      const action = addIngredient(newBun);
      const newState = burgerConstructorReducer(stateWithBun, action);

      expect(newState.bun).toEqual({
        ...newBun,
        id: 'test-uuid-1234'
      });
    });

    it('должен добавить ингредиент в массив ингредиентов', () => {
      const action = addIngredient(mockIngredient);
      const newState = burgerConstructorReducer(initialState, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual({
        ...mockIngredient,
        id: 'test-uuid-1234'
      });
    });

    it('должен добавить несколько ингредиентов в массив', () => {
      const stateWithIngredient = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'existing-id' } as TConstructorIngredient
        ]
      };

      const action = addIngredient(mockSauce);
      const newState = burgerConstructorReducer(stateWithIngredient, action);

      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[1]).toEqual({
        ...mockSauce,
        id: 'test-uuid-1234'
      });
    });
  });

  describe('Удаление ингредиента', () => {
    it('должен удалить ингредиент по ID', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'ingredient-1' } as TConstructorIngredient,
          { ...mockSauce, id: 'ingredient-2' } as TConstructorIngredient
        ]
      };

      const action = removeIngredient('ingredient-1');
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].id).toBe('ingredient-2');
    });

    it('не должен изменять состояние, если ID ингредиента не найден', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: 'ingredient-1' } as TConstructorIngredient
        ]
      };

      const action = removeIngredient('non-existent-id');
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0].id).toBe('ingredient-1');
    });
  });

  describe('Перемещение ингредиента вверх', () => {
    it('должен переместить ингредиент вверх в массиве', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          {
            ...mockIngredient,
            id: 'ingredient-1',
            name: 'Ingredient 1'
          } as TConstructorIngredient,
          {
            ...mockSauce,
            id: 'ingredient-2',
            name: 'Ingredient 2'
          } as TConstructorIngredient,
          {
            ...mockIngredient,
            id: 'ingredient-3',
            name: 'Ingredient 3'
          } as TConstructorIngredient
        ]
      };

      const action = moveIngredientUp(1);
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients[0].name).toBe('Ingredient 2');
      expect(newState.ingredients[1].name).toBe('Ingredient 1');
      expect(newState.ingredients[2].name).toBe('Ingredient 3');
    });

    it('не должен перемещать первый ингредиент вверх', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          {
            ...mockIngredient,
            id: 'ingredient-1',
            name: 'Ingredient 1'
          } as TConstructorIngredient,
          {
            ...mockSauce,
            id: 'ingredient-2',
            name: 'Ingredient 2'
          } as TConstructorIngredient
        ]
      };

      const action = moveIngredientUp(0);
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients[0].name).toBe('Ingredient 1');
      expect(newState.ingredients[1].name).toBe('Ingredient 2');
    });
  });

  describe('Перемещение ингредиента вниз', () => {
    it('должен переместить ингредиент вниз в массиве', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          {
            ...mockIngredient,
            id: 'ingredient-1',
            name: 'Ingredient 1'
          } as TConstructorIngredient,
          {
            ...mockSauce,
            id: 'ingredient-2',
            name: 'Ingredient 2'
          } as TConstructorIngredient,
          {
            ...mockIngredient,
            id: 'ingredient-3',
            name: 'Ingredient 3'
          } as TConstructorIngredient
        ]
      };

      const action = moveIngredientDown(0);
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients[0].name).toBe('Ingredient 2');
      expect(newState.ingredients[1].name).toBe('Ingredient 1');
      expect(newState.ingredients[2].name).toBe('Ingredient 3');
    });

    it('не должен перемещать последний ингредиент вниз', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          {
            ...mockIngredient,
            id: 'ingredient-1',
            name: 'Ingredient 1'
          } as TConstructorIngredient,
          {
            ...mockSauce,
            id: 'ingredient-2',
            name: 'Ingredient 2'
          } as TConstructorIngredient
        ]
      };

      const action = moveIngredientDown(1);
      const newState = burgerConstructorReducer(stateWithIngredients, action);

      expect(newState.ingredients[0].name).toBe('Ingredient 1');
      expect(newState.ingredients[1].name).toBe('Ingredient 2');
    });
  });

  describe('Очистка конструктора', () => {
    it('должен очистить все ингредиенты и булку', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        ingredients: [
          { ...mockIngredient, id: 'ingredient-1' } as TConstructorIngredient
        ]
      };

      const action = clearConstructor();
      const newState = burgerConstructorReducer(stateWithData, action);

      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toEqual([]);
    });
  });
});
