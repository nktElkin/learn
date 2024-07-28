// import { useDispatch, useSelector } from "react-redux";
import { useDispatch, useSelector } from 'react-redux';
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import {addItem, decreaseItemQuantity, getCurrentQuantityById, increaseItemQuantity}  from "../cart/cartSlice";


function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const quantity = useSelector(getCurrentQuantityById(id));
  // const quantity = 0


  function handleAddToCart(e){
      e.preventDefault();
      const newItem = {
        pizzaId: id,
        name,
        quantity: 1,
        unitPrice,
        totalPrice: unitPrice * 1
      };
      // choosing of required action
      dispatch(addItem(newItem))
  }

  return (
    <li className="flex flex-row gap-4 py-2 sm:items-stretch">
      <img src={imageUrl} alt={name} className={`w-1/3 ${soldOut ? 'opacity-40 grayscale' : ''}`}/>
      <div className={`flex flex-col grow ${soldOut ? 'text-stone-300' : ''}`}>
        <p className="text-xl">{name}</p>
        <p className="capitalize">{ingredients.join(', ')}</p>
        <div className="mt-auto">
          {!soldOut 
          ?<div className="flex flex-row justify-between">
              <p>{formatCurrency(unitPrice)}</p> {quantity 
                ? <div>x{quantity} <Button type='small' onClick={() => dispatch(increaseItemQuantity(id))}>+</Button> <Button type='small' onClick={() => dispatch(decreaseItemQuantity(id))}>-</Button></div>:<Button type='small' onClick={handleAddToCart}>Add to cart</Button> }  
            </div>
          : <p className="uppercase font-bold text-stone-300">Sold out</p>}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
