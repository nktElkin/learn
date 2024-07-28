import { useState } from "react";
import { Form, redirect, useActionData, useNavigate, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import store from "../../store";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseCartPrice = useSelector(getTotalCartPrice);
  const totalCartPrice = withPriority ? baseCartPrice * 1.2 : baseCartPrice;
  const isSubmiting = navigation.state === 'submitting';

  const formErrors = useActionData();
  const {username, address, position, status: fetchingStatus, error: userGeolocationError} = useSelector((state) => state.user)
  const isLoadingPosition = fetchingStatus === 'loading'; 
  let userAddress = address
  // const userAddress = useSelector((state) => state.user.address);
  const cart = useSelector(getCart);

  // if(cart.length === 0){
  //   navigate('/menu');
  //   return null;
  // }

  return (
    <div className="flex flex-col">
      <h2 className="text-xl ">Ready to order? Letqs go!</h2>

      <Form method="POST" className="space-y-2">
        <div className="flex gap-2">
          <label>First Name</label>
          <input type="text" name="customer" placeholder="Franklin" defaultValue={username} required className="input validated"/>
        </div>

        <div  className="flex gap-2">
          <label>Phone number</label>
          <input type="tel" name="phone" minLength='6' required placeholder="(+420) 12-345-67-89" className="input validated "/>
        </div>
        {formErrors?.phone && <div className="bg-red-300 opacity-70 px-2 w-fit rounded-lg "> {formErrors?.phone}</div>}  

        <div className={`space-x-2 ${isLoadingPosition ? 'opacity-40' : ''}`}>
          <label>Address</label>
          <div className="inline">
            <input type="text" name="address" defaultValue={userAddress.split(', ')[0]} required placeholder="City street, 17" className="input validated grow"/>
              <Button type='small_transparent' className="lowercase text-sm" disabled={isLoadingPosition} onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress());
                userAddress = address;
              }
            }><span className="text-xs">find me</span></Button>
          </div>
        </div>
            {userGeolocationError && <div className="bg-red-300 opacity-70 px-2 w-fit rounded-lg "> {userGeolocationError}</div>}  

        <div className="space-x-2">
          <input
            className="accent-amber-400 h-4 w-4"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to start reactive engine?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position ? `${position.latitude},${position.longitude}` : null} />
            <Button disabled={isSubmiting} type={withPriority ? 'reactive' : 'regular'}>
             {isSubmiting ? 'Packing it...' : `Order now $${totalCartPrice}`}
            </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const errors = {};
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // serialize data for send creating order
  const order = { ...data, cart: JSON.parse(data.cart), priority: data.priority === 'true' };

  // form validation
  if (!isValidPhone(order.phone)) errors.phone = 'Phone number is not valid';
  if (Object.keys(errors).length != 0) return errors;

  // place new order
  const res = await createOrder(order);
  if (!res) return;
  // redirect to order page once it's successfully created
  store.dispatch(clearCart());
  return redirect('/order/' + res.id);
}

export default CreateOrder;
