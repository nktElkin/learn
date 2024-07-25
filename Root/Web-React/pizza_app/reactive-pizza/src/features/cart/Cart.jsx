import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function Cart() {
  const username = useSelector((state) => state.user.username)
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart)

  return (
    <div className='flex flex-col gap-2 mx-2'>
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>
      {username && <h2 className='font-bold'>Your cart, {username}</h2>}
      
      <ul className='divide-y'>
        {cart.map((el) => (<CartItem item={el} key={el.key} />))}
      </ul>

      <div className='flex flex-row gap-4 justify-between mt-6 sm:justify-start'>
        <Button to='/order/new'>Order my pizza</Button>
        <Button to='/cart' type='transparent' >Clear cart</Button>
      </div>
    </div>
  );
}

export default Cart;
