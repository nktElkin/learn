import { Link } from "react-router-dom";

function CartOverview() {
  return (
    <div className="bg-stone-700 text-stone-200 px-10">
      <p className="px-2">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart" className="px-2 rounded-lg duration-300  hover:bg-stone-200"><span className="transition-all duration-300 ease-in-out hover:text-zinc-800">Open cart &rarr;</span></Link>
    </div>
  );
}

export default CartOverview;
