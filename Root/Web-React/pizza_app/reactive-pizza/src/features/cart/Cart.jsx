import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from './cartSlice';
import { clearCart } from './cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user.username)
  const cart = useSelector(getCart);

  function handlerClearCart() {
    dispatch(clearCart())
  }
  
  if(!cart.length) return(
    <div className='mt-6 flex flex-row justify-center'>
      <div className='flex flex-col gap-6'>
      <h1>Your cart is empty</h1>
      <Button to="/menu">&larr; Back to menu</Button>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-2 mx-2'>
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>
      {username && <h2 className='font-bold'>Your cart, {username}</h2>}
      
      <ul className='divide-y'>
        {cart.map((el) => (<CartItem item={el} key={el.key} />))}
      </ul>

      <div className='flex flex-row gap-4 justify-between mt-6 sm:justify-start'>
        <Button to='/order/new'>Order my pizza</Button>
        <Button type='transparent' onClick={handlerClearCart}>Clear cart</Button>
      </div>
    </div>
  );
}

export default Cart;
