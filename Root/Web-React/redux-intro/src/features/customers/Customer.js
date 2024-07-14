import { useDispatch, useSelector } from "react-redux";
import { updateName } from "./customerSlice";
function Customer() {
  const {name} = useSelector((store) => store.customer); 
  const dispatch =useDispatch();
  return (
    <div className="customer">
      <h2>👋 Welcome, {name}</h2><button className="btn resetName" onClick={() => {dispatch(updateName('%another new random name%'))}}>🔄</button> 
    </div>
  );
}

export default Customer;
