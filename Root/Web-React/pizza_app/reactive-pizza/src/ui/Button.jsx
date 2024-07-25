import { Link } from "react-router-dom";

function Button({children, disabled = false, to, type='regular', onClick}) {
    const base = 'font-semibold uppercase max-w-fit rounded-lg duration-200 ease-linear focus:outline-none hover:bg-amber-200 focus:ring focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-20';
    const styles = {
        regular: base + ' py-3 px-4 sm:px-6 sm:py-4 bg-amber-400 ',
        small: base + ' px-1 sm:px-5 bg-amber-400 ',
        transparent: base + '  py-3 px-4 sm:px-6 sm:py-4',
        small_transparent: base + ' px-1 sm:px-5',
    };
    if(to) return (
        <Link to={to} className={styles[type]}>
            {children}
        </Link> 
    );

    if(onClick) return(
        <button disabled={disabled} onClick={onClick} className={styles[type]}>
            {children}
        </button>
    );
    
    return (
        <button disabled={disabled} className={styles[type]}>
            {children}
        </button>
    )
}

export default Button;
