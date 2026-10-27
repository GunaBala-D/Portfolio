import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Backdrop } from './components/Backdrop';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { ScrollManager } from './components/ScrollManager';
import { Home } from './pages/Home';

const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Backdrop />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
