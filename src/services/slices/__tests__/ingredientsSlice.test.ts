import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

// Мокаем апи
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

import { getIngredientsApi } from '@api';

const mockedGetIngredientsApi = getIngredientsApi as jest.MockedFunction<
  typeof getIngredientsApi
>;

describe('Слайс ингредиентов', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
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
    },
    {
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
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние при пустом действии', () => {
    const result = ingredientsReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Загрузка ингредиентов', () => {
    it('должен установить loading в true при ожидании загрузки', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.items).toEqual([]);
    });

    it('должен установить loading в false и обновить данные при успешной загрузке', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.items).toEqual(mockIngredients);
    });

    it('должен установить loading в false и обновить ошибку при неудачной загрузке', () => {
      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('должен установить сообщение об ошибке по умолчанию, если оно не предоставлено', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
      expect(state.items).toEqual([]);
    });
  });
});
