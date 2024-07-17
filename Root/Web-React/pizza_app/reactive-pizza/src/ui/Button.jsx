import { Link } from "react-router-dom";

function Button({children, disabled = false, to = '/'}) {
    if(to) return (
        <Link to={to} className="bg-amber-400 font-semibold p-3 uppercase max-w-fit rounded-lg duration-200 ease-linear focus:outline-none hover:bg-amber-200 focus:ring focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-20">
            {children}
        </Link> 
    );

    return (
        <button disabled={disabled} className="bg-amber-400 font-semibold p-3 uppercase max-w-fit rounded-lg duration-200 ease-linear focus:outline-none hover:bg-amber-200 focus:ring focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-20">
            {children}
        </button>
    )
}

export default Button;
