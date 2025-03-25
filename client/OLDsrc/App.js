/* Import de composant */
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';

/* Import de page */
import Header from './pages/components/Header';
import Home from './pages/Home';
import PrestationsMain from './pages/PrestationsMain'
import ArticlesMain from './pages/ArticlesMain'

import UsersManager from './pages/OLDalpinAdmin/UsersManager'
import ArticlesManager from './pages/OLDalpinAdmin/ArticlesManager'
import PrestationDetail from './pages/PrestationDetail'

import AdminPrestationDetail from './pages/OLDalpinAdmin/AdminPrestationDetail'
import PrestationsManager from './pages/OLDalpinAdmin/PrestationsManager'
import PrestationEdit from './pages/admin/PrestationEdit'
import PrestationCreate from './pages/admin/PrestationCreate'

function App() {
  
  const location = useLocation();
  const [key, setKey] = useState(0);
  
  // Force re-render when location changes
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
    console.log('Location changed to:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="App">
      <Header />
      <div className="container" key={key}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prestations" element={<PrestationsMain />} />
          <Route path="/prestations/:id" element={<PrestationDetail />} />
          <Route path="/articles" element={<ArticlesMain />} />
          <Route path="/admin/users" element={<UsersManager />} />
          <Route path="/admin/articles" element={<ArticlesManager />} />
          <Route path="/admin/prestations" element={<PrestationsManager />} />
          <Route path="/admin/prestations/:id" element={<AdminPrestationDetail />} />
          <Route path="/admin/prestations/edit/:id" element={<PrestationEdit />} />
          <Route path="/admin/prestations/new" element={<PrestationCreate />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;