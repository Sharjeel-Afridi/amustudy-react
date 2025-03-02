import ReactDOM from 'react-dom/client'
// import {Provider} from "react-redux";
import App from './App.jsx';
import Post from "./pages/Post/Post.jsx";
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Settings.jsx';
import Settings from './pages/Settings.jsx';
import Event from './pages/Event.tsx';
import { UserProvider } from "./utils/UserContext";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import './index.css'
import NewFormPage from './pages/formpage.jsx';
import CreateEvent from './pages/CreateEvent.tsx';
import EventsList from './pages/EventsList.tsx';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      // <Provider store={appStore}>
      <Outlet />
      // </Provider>
    ),
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: "/post/:postId",
        element: <Post />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path:"/signup",
        element: <Signup />
      },
      {
        path:"/new",
        element:<NewFormPage />
      },
      {
        path: "/setting",
        element: <Settings />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/event/:eventId",
        element: <Event />
      },
      {
        path: "/events",
        element: <EventsList />
      },
      {
        path: "/create",
        element: <CreateEvent />
      }
    ]
  }
])



const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <UserProvider>
      {/* <DarkModeProvider> */}
          <RouterProvider router={appRouter}/>
      {/* </DarkModeProvider> */}
  </UserProvider>
  );
