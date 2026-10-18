import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/posts" replace />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'posts',
        element: (
            <Posts />
          
        ),
      },
      {
        path: '*',
        element: <div className="text-center py-20 text-slate-500 font-bold">404 - الصفحة غير موجودة</div>,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}