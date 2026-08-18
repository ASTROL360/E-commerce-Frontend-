import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Loading from './components/common/Loading';

const Home = lazy(() => import('./pages/Home'));
const ProductList = lazy(() => import('./pages/products/ProductList'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const Cart = lazy(() => import('./pages/cart/Cart'));
const Checkout = lazy(() => import('./pages/checkout/Checkout'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Orders = lazy(() => import('./pages/user/Orders'));
const OrderDetail = lazy(() => import('./pages/user/OrderDetail'));
const Addresses = lazy(() => import('./pages/user/Addresses'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const PaymentSuccess = lazy(() => import('./pages/payment/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/payment/PaymentCancel'));
const PaymentVerify = lazy(() => import('./pages/payment/PaymentVerify'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/payment/verify" element={<PaymentVerify />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>
      </Route>
    </Routes>
    </Suspense>
  )
}

export default App
