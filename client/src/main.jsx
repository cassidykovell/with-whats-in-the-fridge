import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import LandingPage from './pages/LandingPage';
import MyProfile from './pages/MyProfile';
import LogIn from './pages/LogIn';
import Fridge from './pages/Fridge';
import FeedPage from './pages/FeedPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'feed',
        element: <FeedPage />,
      },
      {
        path: 'profile',
        element: <MyProfile />,
      },
      {
        path: 'login',
        element: <LogIn />,
      },
      {
        path: 'fridge',
        element: <Fridge/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);