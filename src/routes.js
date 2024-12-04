import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Users from "./pages/Users";
import UserEdit, { userLoader } from "./pages/UserEdit";
import SignIn from "./pages/SignIn";

const requireAuth = () => {
  const token = localStorage.getItem('token'); // Verificar en localStorage
  if (!token) {
    throw new Response("Unauthorized", { status: 401 }); // Redirige si no hay token
  }
  return null; // Continuar si el token existe
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",  
    element: <SignIn />, 
  },
  {
    path: "/users",
    element: <Users />,
    loader: requireAuth, 
  },
  {
    path: "/users/:userId",
    element: <UserEdit />,
    loader: userLoader,
  },
]);

export default router;
