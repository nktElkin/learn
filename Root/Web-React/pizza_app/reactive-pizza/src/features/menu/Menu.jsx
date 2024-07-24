import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  const menu =useLoaderData()
  return (
    <div className="px-2 md:px-0">
    <h1>Menu</h1>
    <div className="flex flex-col">
      {menu.map(el => <MenuItem key={el.id} pizza={el} />)} 
    </div>
    </div>
  );
}

export async function loader(){
  const res = await getMenu();
  return res;
}

export default Menu;
