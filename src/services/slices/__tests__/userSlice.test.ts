import userReducer, {
  register,
  login,
  fetchUser,
  logout,
  updateUser
} from '../userSlice';
import { TUser } from '@utils-types';

// Мокаем апи и куки
jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

// Мокаем локалстор
const localStorageMock = {
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Слайс пользователя', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен возвращать начальное состояние при пустом действии', () => {
    const result = userReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('Регистрация', () => {
    it('должен установить loading в true при ожидании регистрации', () => {
      const action = { type: register.pending.type };
      const state = userReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен установить данные пользователя при успешной регистрации', () => {
      const action = {
        type: register.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен установить ошибку при неудачной регистрации', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: register.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен установить ошибку по умолчанию при регистрации без сообщения', () => {
      const action = {
        type: register.rejected.type,
        payload: undefined
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('Авторизация', () => {
    it('должен установить loading в true при ожидании авторизации', () => {
      const action = { type: login.pending.type };
      const state = userReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен установить данные пользователя при успешной авторизации', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен установить ошибку при неудачной авторизации', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: login.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен установить ошибку по умолчанию при авторизации без сообщения', () => {
      const action = {
        type: login.rejected.type,
        payload: undefined
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('Получение данных пользователя', () => {
    it('должен установить loading в true при ожидании получения данных', () => {
      const action = { type: fetchUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен установить данные пользователя при успешном получении', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен очистить данные пользователя и отметить проверку авторизации при ошибке', () => {
      const action = {
        type: fetchUser.rejected.type,
        payload: 'Failed to fetch user'
      };
      const state = userReducer(
        { ...initialState, loading: true, user: mockUser },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.user).toBe(null);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('Выход из системы', () => {
    it('должен очистить данные пользователя при выходе', () => {
      const action = { type: logout.fulfilled.type };
      const state = userReducer(
        { ...initialState, user: mockUser, isAuthChecked: true },
        action
      );

      expect(state.user).toBe(null);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('Обновление данных пользователя', () => {
    it('должен установить loading в true при ожидании обновления', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен обновить данные пользователя при успешном обновлении', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(
        { ...initialState, loading: true, user: mockUser },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });

    it('должен установить ошибку при неудачном обновлении', () => {
      const errorMessage = 'Update failed';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен установить ошибку по умолчанию при обновлении без сообщения', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: undefined
      };
      const state = userReducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка обновления данных');
    });
  });
});
