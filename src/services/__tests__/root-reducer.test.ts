import rootReducer from '../root-reducer';
import { configureStore } from '@reduxjs/toolkit';

describe('Корневой редьюсер', () => {
  it('должен инициализироваться с правильным начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    // Проверяем, что все слайсы присутствуют в корневом состоянии
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('userOrders');
    expect(state).toHaveProperty('orderDetails');
  });

  it('должен иметь правильную структуру начального состояния', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    // Проверяем структуру состояний слайсов
    expect(state.burgerConstructor).toHaveProperty('bun', null);
    expect(state.burgerConstructor).toHaveProperty('ingredients', []);

    expect(state.ingredients).toHaveProperty('items', []);
    expect(state.ingredients).toHaveProperty('loading', false);
    expect(state.ingredients).toHaveProperty('error', null);
  });

  it('должен возвращать то же состояние при вызове с неизвестным действием', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    const nextState = rootReducer(initialState, {
      type: 'ANOTHER_UNKNOWN_ACTION'
    });

    expect(nextState).toEqual(initialState);
  });
});
