import { useSelector } from "react-redux";

function Username() {
    const username = useSelector((state) => state.user.username)
    if(!username) return;
    return (
        <div className="hidden test-sm font-semibold md:block p-5 bg-white rounded-lg">
            <p>{username}</p>
        </div>
    )
}

export default Username;
