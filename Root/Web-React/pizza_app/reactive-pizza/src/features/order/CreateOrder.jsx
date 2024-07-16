import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

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

  const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Letqs go!</h2>

      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" minLength='6' required />
            {formErrors?.phone && <span> {formErrors?.phone}</span>}
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button disabled={isSubmiting}>{isSubmiting ? 'Packing it...' : 'Order now'}</button>
        </div>
      </Form>
    </div>
  );
}

export async function action({request}){
  const errors = {};
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  // serialize data for send creating order
  const order = {...data, cart: JSON.parse(data.cart), priority: data.priority === 'on'};
  
  // form validation
  if(!isValidPhone(order.phone)) errors.phone = 'Phone number is not valid';
  if(Object.keys(errors).length) return errors;

  // place new order
  const res = await createOrder(order);
  if(!res) return;
  // redirect to order page once it's successfully created
  console.log(res);
  return redirect('/order/' + res.id);
}

export default CreateOrder;
