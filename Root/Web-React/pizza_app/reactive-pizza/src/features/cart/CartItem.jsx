import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { decreaseItemQuantity, deleteItem, increaseItemQuantity } from "./cartSlice";

function CartItem({ item, view = 'order' }) {
  const dispatch = useDispatch();
  const { pizzaId, name, quantity, totalPrice } = item;

  function handleDelete() {
    deleteItem(pizzaId);
    // dispatch(deleteItem(pizzaId));
  }
  
  if (view === 'order') {
    return(
      <li className="py-2 flex justify-between"> 
        <p className="">
          {quantity}&times; {name}
        </p>
        <p>{formatCurrency(totalPrice)}</p>
    </li>
    )
  }

  return (
    <li className="py-2"> 
      <p className="">
        {quantity}&times; {name}
      </p>
      <div className="flex justify-between items-center">
        <p>{formatCurrency(totalPrice)}</p>
        {quantity > 1 ?
        <div className="gap-0">
          <Button type='small_transparent' onClick={() => dispatch(increaseItemQuantity(pizzaId))}>+</Button> <Button type='small_transparent' onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>-</Button>
        </div> :
        <>
          <Button type='small_transparent' onClick={() => dispatch(deleteItem(pizzaId))}>Delete</Button>
        </>
        }
      </div>
    </li>
  );
}

export default CartItem;
