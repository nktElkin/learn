import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  const menu =useLoaderData()
  return (
    <>
    <h1>Menu</h1>
    {menu.map(el => <MenuItem key={el.id} pizza={el} />)} 
    </>
  );
}

export async function loader(){
  const res = await getMenu();
  return res;
}

export default Menu;
