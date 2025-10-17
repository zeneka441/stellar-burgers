import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderDetailsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const isFromProfile = location.pathname.includes('/profile/orders');

  const feedOrders = useSelector((state) => state.feeds.orders?.orders || []);
  const userOrders = useSelector((state) => state.userOrders.orders);
  const orderFromDetails = useSelector((state) => state.orderDetails.order);
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.items
  );

  const orderNumber = Number(number);
  const ordersToSearch = isFromProfile ? userOrders : feedOrders;
  const foundOrder = ordersToSearch.find(
    (order) => order.number === orderNumber
  );

  const orderData = foundOrder || orderFromDetails;

  useEffect(() => {
    if (number && !foundOrder) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, number, orderNumber, foundOrder]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
