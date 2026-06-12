import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Agenda from './pages/Agenda';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Faturamento from './pages/Faturamento';
import Atendimentos from './pages/Atendimentos';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/agenda" replace />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/faturamento" element={<Faturamento />} />
          <Route path="/atendimentos" element={<Atendimentos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
