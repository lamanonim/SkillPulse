import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Directions from './pages/Directions';
import Test from './pages/Test';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* aşağıdakı səhifələr yalnız login olmuş istifadəçi üçündür */}
          <Route element={<ProtectedRoute />}>
            <Route path="/directions" element={<Directions />} />
            <Route path="/test/:direction" element={<Test />} />
            <Route path="/result" element={<Result />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} SkillPulse</div>
      </footer>
    </>
  );
}
