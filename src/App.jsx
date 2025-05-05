import {createBrowserRouter, createRoutesFromElements, RouterProvider ,Route} from 'react-router-dom';

//Pages
import Home from './pages/Home';
import SellOnHezmart from './pages/SellOnHezmart';

//Layouts
import BaseLayout from './layouts/BaseLayout';
// import GuestLayout from './layouts/GuestLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

//Auth Pages
import VendorRegister from './pages/auth/VendorRegister';
import CustomerRegister from './pages/auth/CustomerRegister'
import ConfirmEmail from './pages/auth/ConfirmEmail';
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword';


//Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ShopManager from './pages/admin/ShopManager';


//Vendor pages
import PendingVerification from './pages/vendor/PendingVerification';
import VendorDashboard from './pages/vendor/Dashboard'
import VendorProducts from './pages/vendor/ManageProducts'
import AddProduct from './pages/vendor/AddProduct';


//Others
import NotFound from './pages/NotFound';
import Error from './components/Error';
import { requireAuth } from './utils/protect';



function App() {


  const router = createBrowserRouter(createRoutesFromElements(
    <>

      <Route path='/' element={<BaseLayout />} errorElement={<Error />}>
        <Route index element={<Home />}></Route>
        <Route path='sell-on-hezmart' element={<SellOnHezmart />}></Route>
        <Route path='vendor-register' element={<VendorRegister />}></Route>
        <Route path='customer-register' element={<CustomerRegister />}></Route>
        <Route path='confirm-email' element={<ConfirmEmail />}></Route>

        <Route path='login' element={<Login />}></Route>
        <Route path='forgot-password' element={<ForgotPassword />}></Route>
        <Route path='resetPassword' element={<ResetPassword />}></Route>
       
      </Route>

      <Route path='/manage' element={<AuthenticatedLayout />} errorElement={<Error />}>
        {/* Admin Routes */}
        <Route path='admin' loader={async({ request }) => await requireAuth(request, 'admin')}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='vendors' element={<ShopManager />} />
        </Route>

        {/* Vendor Routes */}
        <Route path='vendor' loader={({ request }) => requireAuth(request, 'vendor')}>
          <Route path='dashboard' element={<VendorDashboard />} />
          <Route path='products' element={<VendorProducts />} />
          <Route path='add-product' element={<AddProduct />} ></Route>
        </Route>
       

      </Route>

      <Route path='pending_verification' element={<PendingVerification />}></Route>
      <Route path="*" element={<NotFound />} />

    </>
  ))

  return (
    <RouterProvider router={router} />
  )
}

export default App
