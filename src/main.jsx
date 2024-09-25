import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Landingpage from './pages/Landingpage.jsx';
import CreateAcct from './pages/CreateAcct.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './user/Dashboard.jsx';
import Bank from './Withdrawal/Bank.jsx';
import Binance from './Withdrawal/Binance.jsx';
import Bitcoin from './Withdrawal/Bitcoin.jsx';
import Paypal from './Withdrawal/Paypal.jsx';
import Skrill from './Withdrawal/Skrill.jsx';
import Cards from './user/Cards.jsx';
import Kyc from './user/kyc.jsx';
import Profile from './user/profile.jsx';
import AdminDashboard from './user/AdminDashboard.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Dispute from './user/Dispute.jsx';
const router = createBrowserRouter([
  {path: '/', element: <Landingpage/>},
  {path: '/DashBoard', element: <Dashboard/>},
  {path: '/SignUp', element: <CreateAcct/>},
  {path: '/SignIn', element: <Login/>},
  {path: '/Withdrawal', element: <Bank/>},
  {path: '/Binance', element: <Binance/>},
  {path: '/Bitcoin', element: <Bitcoin/>},
  {path: '/Paypal', element: <Paypal/>},
  {path: '/Skrill', element: <Skrill/>},
  {path: '/Cards', element: <Cards/>},
  {path: '/Kyc', element: <Kyc/>},
  {path: '/Profile', element: <Profile/>},
  {path: '/admin', element: <AdminDashboard/>},
  {path: '/AboutUs', element: <AboutUs/>},
  {path: '/dispute', element: <Dispute/>}
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
