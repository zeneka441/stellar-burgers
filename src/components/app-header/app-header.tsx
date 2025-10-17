import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from '@ui/app-header/app-header.module.css';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} ${isActive('/') ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={`${styles.link} ${isActive('/feed') ? styles.link_active : ''}`}
          >
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <Link
            to='/profile'
            className={`${styles.link} ${isActive('/profile') ? styles.link_active : ''}`}
          >
            <ProfileIcon
              type={isActive('/profile') ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>
              {user?.name || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
