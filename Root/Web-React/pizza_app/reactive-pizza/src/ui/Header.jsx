import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <Link to="/">Reactive Pizza</Link>
            {/* <Link to="/menu">Menu</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/order/new">Create order</Link> */}
        </div>
    )
}

export default Header;
