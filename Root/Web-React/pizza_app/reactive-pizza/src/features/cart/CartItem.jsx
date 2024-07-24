import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li className="py-2"> 
      <p className="">
        {quantity}&times; {name}
      </p>
      <div className="flex justify-between items-center">
        <p>{formatCurrency(totalPrice)}</p>
        <Button type='small_transparent'>Delete</Button>
      </div>
    </li>
  );
}

export default CartItem;
