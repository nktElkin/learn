import { useSelector } from "react-redux";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

function countInCart(cart,id){
  const item = cart.find((item) => item.pizzaId === id)
  console.log(item?.quantity)
  if(item) return item?.quantity; 
}
function MenuItem({ pizza }) {
  const cart = useSelector((state) => state.cart.cart);
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const quantity = countInCart(cart, id);


  function handleAddToCart(e){
    e.preventDefault();
    // choosing of required action
    console.log(id)

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
                ? <div>x{quantity} <Button type='small' onClick={handleAddToCart}>+</Button> <Button type='small' onClick={handleAddToCart}>-</Button></div>:<Button type='small' onClick={handleAddToCart}>Add to cart</Button> }  
            </div>
          : <p className="uppercase font-bold text-stone-300">Sold out</p>}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
