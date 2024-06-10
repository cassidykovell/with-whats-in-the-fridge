import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Authentication from './pages/Authentication';
import Fridge from './pages/Fridge';
import FeedPage from './pages/FeedPage';
import Ai from './pages/AiPage'

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
        element: <Profile />,
      },
      {
        path: 'login',
        element: <Authentication />,
      },
      {
        path: 'fridge',
        element: <Fridge />,
      },
      {
        path: 'ai',
        element: <Ai />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />
);
