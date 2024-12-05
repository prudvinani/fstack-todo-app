import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Signup } from './Signup';
import { LoginPage } from './Login';
import { Toaster } from 'sonner';
import Home from './Home';
import Lockdata from './Lockdata';
import { ThemeProvider } from './components/theme-provider';

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const isLoggedin = !!localStorage.getItem('token');
  return isLoggedin ? element : <Navigate to="/" />;
};

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const isLoggedin = !!localStorage.getItem('token');
  return isLoggedin ? <Navigate to="/home" /> : element;
};

const App = () => {
  return (

    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
 <BrowserRouter>
      <Toaster richColors />
      <Routes>
        {/* Protected Routes */}
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
     

        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
        <Route path="/" element={<PublicRoute element={<Lockdata />} />} />

        

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>

    </ThemeProvider>
   
  );
};

export default App;
