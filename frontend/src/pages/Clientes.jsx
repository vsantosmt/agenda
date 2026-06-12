import { useState, useEffect, useCallback } from 'react';
import { clientesApi } from '../services/api';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const FORM_INICIAL = { nome: '', telefone: '', email: '' };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientesApi.listar();
      setClientes(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const filtrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.email?.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone?.includes(busca)
  );

  const abrirFormNovo = () => {
    setEditando(null);
    setForm(FORM_INICIAL);
    setFormError('');
    setShowForm(true);
  };

  const abrirFormEditar = (cliente) => {
    setEditando(cliente);
    setForm({ nome: cliente.nome, telefone: cliente.telefone || '', email: cliente.email || '' });
    setFormError('');
    setShowForm(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editando) {
        await clientesApi.atualizar(editando.id, form);
      } else {
        await clientesApi.criar(form);
      }
      setShowForm(false);
      carregar();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const excluir = async () => {
    setDeleting(true);
    try {
      await clientesApi.excluir(confirmDelete.id);
      setConfirmDelete(null);
      carregar();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn btn--primary" onClick={abrirFormNovo}>
          + Novo Cliente
        </button>
      </div>

      <div className="filtros-bar">
        <input
          type="search"
          className="form-input search-input"
          placeholder="🔍 Buscar por nome, email ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={carregar} />}

      {!loading && !error && (
        <>
          <p className="result-count">{filtrados.length} cliente(s) encontrado(s)</p>
          {filtrados.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum cliente cadastrado.</p>
              <button className="btn btn--primary" onClick={abrirFormNovo}>
                Cadastrar cliente
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => (
                    <tr key={c.id}>
                      <td className="td--name">{c.nome}</td>
                      <td>{c.telefone || '—'}</td>
                      <td>{c.email || '—'}</td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn btn--sm btn--ghost"
                            onClick={() => abrirFormEditar(c)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn--sm btn--danger"
                            onClick={() => setConfirmDelete(c)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showForm && (
        <Modal
          title={editando ? 'Editar Cliente' : 'Novo Cliente'}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={salvar} className="form">
            {formError && <div className="alert alert--danger">{formError}</div>}
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input
                type="text"
                className="form-input"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                required
                placeholder="Nome completo"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                type="tel"
                className="form-input"
                value={form.telefone}
                onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                placeholder="(11) 99999-0000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Salvando...' : editando ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Excluir o cliente "${confirmDelete.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={excluir}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
