import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";

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
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';

  const formErrors = useActionData();
  const username = useSelector((state) => state.user.username)
  const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div className="mx-2">
      <h2 className="text-xl ">Ready to order? Letqs go!</h2>

      <Form method="POST" className="space-y-2">
        <div className="flex gap-2">
          <label>First Name</label>
          <input type="text" name="customer" placeholder="Franklin" defaultValue={username} required className="input validated"/>
        </div>

        <div  className="flex gap-2">
          <label>Phone number</label>
          
            <input type="tel" name="phone" minLength='6' required placeholder="(+420) 12-345-67-89" className="input validated "/>
            {formErrors?.phone && <span> {formErrors?.phone}</span>}  
    
        </div>

        <div className="space-x-2">
          <label>Address</label>
          <div className="inline">
            <input type="text" name="address" required placeholder="City street, 17" className="input validated grow"/>
          </div>
        </div>

        <div className="space-x-2">
          <input
            className="accent-amber-400 h-4 w-4"
            type="checkbox"
            name="priority"
            id="priority"
          // value={withPriority}
          // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to start reactive engine?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <Button disabled={isSubmiting}>
             {isSubmiting ? 'Packing it...' : 'Order now'}
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
  const order = { ...data, cart: JSON.parse(data.cart), priority: data.priority === 'on' };

  // form validation
  if (!isValidPhone(order.phone)) errors.phone = 'Phone number is not valid';
  if (Object.keys(errors).length) return errors;

  // place new order
  const res = await createOrder(order);
  if (!res) return;
  // redirect to order page once it's successfully created
  console.log(res);
  return redirect('/order/' + res.id);
}

export default CreateOrder;
