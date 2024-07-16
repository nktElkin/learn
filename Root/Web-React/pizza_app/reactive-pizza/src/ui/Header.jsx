import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
    return (
        <header className="bg-amber-400">
            <Link to="/">Reactive Pizza</Link>
            <SearchOrder/>
            {/* <Link to="/menu">Menu</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/order/new">Create order</Link> */}
        </header>
    )
}

export default Header;
