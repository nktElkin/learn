import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
    return (
        <header className="bg-amber-400 pt-5 pb-4 px-4 md:flex md:justify-between">
            <div className="text-center flex flex-col gap-2 sm:text-left sm:items-baseline sm:py-0 md:justify-between">
                <Link to="/" className="uppercase tracking-widest">🚀 Reactive Pizza</Link>
                <SearchOrder/>
            </div>
            <div>
                <Username/>
            </div>
        </header>
    )
}

export default Header;
