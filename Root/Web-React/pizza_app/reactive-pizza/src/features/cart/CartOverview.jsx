import { Link, useNavigate } from "react-router-dom";

function CartOverview() {
  
  
  return (
    <div className="bg-stone-800 text-stone-200 text-sm px-4 py-4 flex items-start justify-between uppercase sm:flex-col sm:text-xl">
      <p className="px-2 space-x-6">
        <span >23 pizzas at</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart" className="font-semibold px-2 max-w-fit rounded-lg duration-300 ease-linear  hover:bg-stone-200"><span className="transition-colors hover:text-zinc-800 items-baseline">Open cart &rarr;</span></Link>
    </div>
  );
}

export default CartOverview;
