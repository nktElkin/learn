import { Link, useNavigate } from "react-router-dom";

function LinkButton({children, to}) {
    const navigate = useNavigate();

    if(to==='-1') return(
        <button onClick={() => navigate(-1)} className="hover:text-stone-800 text-stone-500 hover:underline duration-150 ease-in-out ">
            {children}
        </button>
    );

    return (
        <Link to={to} className="hover:text-stone-800 text-stone-500 hover:underline duration-150 ease-in-out ">
            {children}
        </Link>
    )
}

export default LinkButton;
