import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { Courses } from '../pages/Courses';
import { CourseDetails } from '../pages/CourseDetails';
import { ProgressAndCertificates } from '../pages/ProgressAndCertificates';
import { Checkout } from '../pages/Checkout';
import { CourseManagement } from '../pages/CourseManagement';
import { ModuleLessonManagement } from '../pages/ModuleLessonManagement';
import { LessonViewer } from '../pages/LessonViewer';
import { TrilhasManagement } from '../pages/TrilhasManagement';
import { CourseReview } from '../pages/CourseReview';
import { PlanosManagement } from '../pages/PlanosManagement';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token'); // Verifica se o token JWT foi salvo no login
  if (!token) {
    return <Navigate to="/login" replace />; // Expulsa para o login se não tiver token
  }
  return children;
};

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/progress" element={<ProgressAndCertificates />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/modules-lessons" element={<ModuleLessonManagement />} />
          <Route path="/lessons/:id" element={<LessonViewer />} />
          <Route path="/admin/trilhas" element={<TrilhasManagement />} />
          <Route path="/admin/planos" element={<PlanosManagement />} />
          <Route path="/reviews" element={<CourseReview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}