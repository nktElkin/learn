import { Outlet, useNavigation } from 'react-router-dom';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header'; 
import Loader from './Loader';
function AppLayout() {
    const navigation = useNavigation();
    console.log(navigation.state)
    const isLoading = navigation.state === 'loading'
    return (
        <div className='grid grid-rows-[auto_1fr_auto] h-screen min-w-80'>
                <Header/>
            {isLoading && <Loader/>}
            {!isLoading && <>
            <div className="overflow-scroll">
                <main className='max-w-3xl my-2 mx-auto'>
                    <Outlet/>
                </main>
            </div>
                <CartOverview/>
            
            </>}
        </div>
    )
}

export default AppLayout;
