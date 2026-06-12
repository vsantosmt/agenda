import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/agenda', label: 'Agenda' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/atendimentos', label: 'Atendimentos' },
  { to: '/faturamento', label: 'Faturamento' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-brand">Agenda Pro</span>
        <button className="sidebar-close" onClick={onClose} aria-label="Fechar menu">
          ✕
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
            onClick={onClose}
          >
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p className="sidebar-footer-text">v1.0.0 — Dados em memória</p>
      </div>
    </aside>
  );
}
