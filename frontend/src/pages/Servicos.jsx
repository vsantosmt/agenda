import { useState, useEffect, useCallback } from 'react';
import { servicosApi } from '../services/api';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const FORM_INICIAL = { nome: '', valor: '', tempoMinutos: '' };

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const res = await servicosApi.listar();
      setServicos(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const abrirFormNovo = () => {
    setEditando(null);
    setForm(FORM_INICIAL);
    setFormError('');
    setShowForm(true);
  };

  const abrirFormEditar = (s) => {
    setEditando(s);
    setForm({ nome: s.nome, valor: String(s.valor), tempoMinutos: String(s.tempoMinutos) });
    setFormError('');
    setShowForm(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        nome: form.nome,
        valor: parseFloat(form.valor),
        tempoMinutos: parseInt(form.tempoMinutos, 10),
      };
      if (editando) {
        await servicosApi.atualizar(editando.id, payload);
      } else {
        await servicosApi.criar(payload);
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
      await servicosApi.excluir(confirmDelete.id);
      setConfirmDelete(null);
      carregar();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const totalServicos = servicos.length;
  const valorMedio = totalServicos
    ? servicos.reduce((acc, s) => acc + s.valor, 0) / totalServicos
    : 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Serviços</h1>
        <button className="btn btn--primary" onClick={abrirFormNovo}>
          + Novo Serviço
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total de serviços</p>
          <p className="stat-value">{totalServicos}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Valor médio</p>
          <p className="stat-value">R$ {valorMedio.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Mais caro</p>
          <p className="stat-value">
            {servicos.length
              ? `R$ ${Math.max(...servicos.map((s) => s.valor)).toFixed(2)}`
              : '—'}
          </p>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={carregar} />}

      {!loading && !error && (
        servicos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum serviço cadastrado.</p>
            <button className="btn btn--primary" onClick={abrirFormNovo}>
              Cadastrar serviço
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {servicos.map((s) => (
              <div key={s.id} className="card card--servico">
                <div className="card-servico-icon">✂️</div>
                <div className="card-body">
                  <p className="card-title">{s.nome}</p>
                  <p className="card-price">R$ {s.valor.toFixed(2)}</p>
                  <p className="card-duration">⏱ {s.tempoMinutos} minutos</p>
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn--sm btn--ghost"
                    onClick={() => abrirFormEditar(s)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn--sm btn--danger"
                    onClick={() => setConfirmDelete(s)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {showForm && (
        <Modal
          title={editando ? 'Editar Serviço' : 'Novo Serviço'}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={salvar} className="form">
            {formError && <div className="alert alert--danger">{formError}</div>}
            <div className="form-group">
              <label className="form-label">Nome do serviço *</label>
              <input
                type="text"
                className="form-input"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                required
                placeholder="Ex: Corte de Cabelo"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Valor (R$) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.valor}
                  onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duração (min) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.tempoMinutos}
                  onChange={(e) => setForm((f) => ({ ...f, tempoMinutos: e.target.value }))}
                  required
                  min="1"
                  placeholder="30"
                />
              </div>
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
          message={`Excluir o serviço "${confirmDelete.nome}"?`}
          onConfirm={excluir}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
