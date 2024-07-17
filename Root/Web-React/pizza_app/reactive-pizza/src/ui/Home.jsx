import AppLayout from "./AppLayout";
import CreateUser from "../features/user/CreateUser";
import Username from "../features/user/Username";

function Home() {
  return (
    <div className="px-5 my-8 text-center flex-col space-y-5 sm:my-16">
      <h1 className="text-xl font-semibold text-center sm:text-3xl">
        The best pizza.
        <br />
        <span className="text-amber-400">
          Straight out of the oven, straight to you.
        </span>
      </h1>
      <CreateUser/>
    </div>
  );
}

export default Home;
