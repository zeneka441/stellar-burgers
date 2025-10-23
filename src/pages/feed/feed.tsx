import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.feeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading) {
    return <Preloader />;
  }

  if (!orders || !orders.orders || orders.orders.length === 0) {
    return (
      <main style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Лента заказов пуста</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  return <FeedUI orders={orders.orders} handleGetFeeds={handleGetFeeds} />;
};
