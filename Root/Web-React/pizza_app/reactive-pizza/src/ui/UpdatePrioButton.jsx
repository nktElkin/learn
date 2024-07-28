import { useFetcher } from "react-router-dom";
import Button from "./Button";
import { updateOrder } from "../services/apiRestaurant";

function UpdatePrioButton({order}) {
    const fetcher = useFetcher();
    return (
        <fetcher.Form method="PATCH" className="text-right">
            <Button type='reactive'>Update priority</Button>
        </fetcher.Form>
    )
}

export default UpdatePrioButton;

export async function action({request, params}) {
    const data = {priority: true}
    await updateOrder(params.orderId, data)
    return null;
}
