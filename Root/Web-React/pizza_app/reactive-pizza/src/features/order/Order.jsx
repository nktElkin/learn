// Test ID: IIDSAT

import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import CartItem from "../cart/CartItem";
import { useEffect } from "react";
import UpdatePrioButton from "../../ui/UpdatePrioButton";

function Order() {
  const order = useLoaderData();

  // const fetcher  = useFetcher();

  // useEffect(fetcher.load)
  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center text-sm">
        <p className="text-2xl text-stone-700">Order number: {id}</p>
        <div className="flex gap-2 [&_*]:uppercase [&_*]:text-stone-50 [&_*]:px-3 [&_*]:py-1 [&_*]:rounded-lg">
          {priority && <span className="bg-gradient-to-r from-cyan-500 from-10% to-blue-500">Prioritized</span>}
          <span className="bg-green-400">{status} order</span>
        </div>
      </div>

      <div className="bg-stone-200 text-stone-800 text-sm px-4 py-4 flex justify-between uppercase">
        <p>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>

      <div>
        <ul className="divide-y">
          {cart.map((item) => (
            <CartItem key={item.pizzaId} item={item} />
          ))}
        </ul>
      </div>

      <div className="bg-stone-200 text-stone-800 text-sm px-4 py-4 flex items-start justify-between uppercase sm:flex-col">
        <p>Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p>To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
      {!priority && <UpdatePrioButton order={order}/>}
    </div>
  );
}

export async function loader({params}){
  const res = await getOrder(params.orderId);
  return res;
}

export default Order;
