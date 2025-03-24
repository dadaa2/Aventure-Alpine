/* Import de composant */
import './App.css';
import { Routes, Route } from 'react-router-dom'

/* Import de page */
import Header from './pages/components/Header';
import Home from './pages/Home';
import PrestationsMain from './pages/PrestationsMain'
import ArticlesMain from './pages/ArticlesMain'

import UsersManager from './pages/alpinAdmin/UsersManager'
import ArticlesManager from './pages/alpinAdmin/ArticlesManager'
import PrestationsManager from './pages/alpinAdmin/PrestationsManager'

function App() {

  return (
    <div className="App">
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prestations" element={<PrestationsMain />} />
          <Route path="/articles" element={<ArticlesMain />} />
          <Route path="/admin/users" element={<UsersManager />} />
          <Route path="/admin/articles" element={<ArticlesManager />} />
          <Route path="/admin/prestations" element={<PrestationsManager />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;