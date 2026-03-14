import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/HomePage';
import PeoplePage from './pages/PeoplePage';
import Layout from './pages/Outlet';

export const App = () => {
  return (
    <div data-cy="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="people">
            <Route index element={<PeoplePage />} />
            <Route path=":slug" element={<PeoplePage />} />
          </Route>
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<h1 className="title">Page not found</h1>} />
        </Route>
      </Routes>
    </div>
  );
};
