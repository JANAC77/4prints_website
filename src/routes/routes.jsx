import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/index.jsx';
import Login from '../pages/auth/login.jsx';
import Signup from '../pages/auth/signup.jsx';
import Otp from '../pages/auth/otp.jsx';
import ForgetPassword from '../pages/auth/forgetpassword.jsx';

import ProductsPage from '../pages/Products/ProductsPage.jsx';
import ProductDetailPage from '../pages/Product/ProductDetailPage.jsx';
import CategoryPage from '../pages/Category/CategoryPage.jsx';
import AccountPage from '../pages/Account/AccountPage.jsx';
import CartPage from '../pages/Cart/CartPage.jsx';
import WishlistPage from '../pages/Wishlist/WishlistPage.jsx';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  OTP: '/otp',
  FORGET_PASSWORD: '/forget-password',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:slug',
  CATEGORY: '/category/:slug',
  SUBCATEGORY: '/category/:slug/:subSlug',
  ACCOUNT: '/account',
  CART: '/cart',
  WISHLIST: '/wishlist',
};

export const routesConfig = [
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <Signup />,
  },
  {
    path: ROUTES.OTP,
    element: <Otp />,
  },
  {
    path: ROUTES.FORGET_PASSWORD,
    element: <ForgetPassword />,
  },
  {
    path: ROUTES.PRODUCTS,
    element: <ProductsPage />,
  },
  {
    path: ROUTES.PRODUCT_DETAIL,
    element: <ProductDetailPage />,
  },
  {
    path: ROUTES.CATEGORY,
    element: <CategoryPage />,
  },
  {
    path: ROUTES.SUBCATEGORY,
    element: <CategoryPage />,
  },
  {
    path: ROUTES.ACCOUNT,
    element: <AccountPage />,
  },
  {
    path: ROUTES.CART,
    element: <CartPage />,
  },
  {
    path: ROUTES.WISHLIST,
    element: <WishlistPage />,
  },
  {
    path: '*',
    element: <ProductsPage />,
  },
];

const AppRoutes = () => {
  return (
    <Routes>
      {routesConfig.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
