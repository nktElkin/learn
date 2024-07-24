import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  return (
    <li className="flex flex-row gap-4 py-2 sm:items-stretch">
      <img src={imageUrl} alt={name} className={`w-1/3 ${soldOut ? 'opacity-40 grayscale' : ''}`}/>
      <div className={`flex flex-col ${soldOut ? 'text-stone-300' : ''}`}>
        <p className="text-xl">{name}</p>
        <p className="capitalize">{ingredients.join(', ')}</p>
        <div className="mt-auto">
          {!soldOut 
          ?<div className="flex flex-row justify-between">
            <p>{formatCurrency(unitPrice)}</p> <Button type='small'>Add to cart</Button> 
          </div>
          : <p className="uppercase font-bold text-stone-300">Sold out</p>}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
