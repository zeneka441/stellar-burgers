import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders } = useSelector((state) => state.feeds);

  const ordersList = orders?.orders || [];
  const feed = {
    total: orders?.total || 0,
    totalToday: orders?.totalToday || 0
  };

  const readyOrders = getOrders(ordersList, 'done');

  const pendingOrders = getOrders(ordersList, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
