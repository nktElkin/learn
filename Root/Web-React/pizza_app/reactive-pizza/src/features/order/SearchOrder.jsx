import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    function handleSubmit(e){
        e.preventDefault();
        if(!query) return
        navigate('/order/' + query);
        setQuery('');
    }
    return (
        <form action="" onSubmit={handleSubmit}>
            <input className="transition-all opacity-50 duration-300 rounded-lg px-2 w-full sm:max-w-fit tracking-wide md:min-w-max focus:outline-none focus:ring focus:opacity-100 focus:ring-white focus:ring-offset-2" type="text" placeholder="Write your order number " value={query} onChange={(e) => setQuery(e.target.value)}/>            
        </form>
    )
}

export default SearchOrder;
