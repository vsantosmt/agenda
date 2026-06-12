import { useState, useEffect, useCallback } from 'react';
import { agendamentosApi, clientesApi, servicosApi, atendimentosApi } from '../services/api';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const STATUS_LABEL = { agendado: 'Agendado', atendido: 'Atendido', cancelado: 'Cancelado' };
const STATUS_CLASS = { agendado: 'badge--warning', atendido: 'badge--success', cancelado: 'badge--danger' };

const dataParaInput = (d) => {
  const dt = new Date(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
};

const formatarDataHora = (d) =>
  new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const hojeISO = () => new Date().toISOString().split('T')[0];

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroData, setFiltroData] = useState(hojeISO());
  const [filtroStatus, setFiltroStatus] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [showAtendimentoForm, setShowAtendimentoForm] = useState(null); // agendamento
  const [atendimentoForm, setAtendimentoForm] = useState({ observacoes: '', fotos: [] });
  const [savingAt, setSavingAt] = useState(false);

  const [form, setForm] = useState({
    clienteId: '',
    servicoId: '',
    dataHora: '',
    observacoes: '',
  });

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filtroData) {
        params.dataInicio = `${filtroData}T00:00:00`;
        params.dataFim = `${filtroData}T23:59:59`;
      }
      if (filtroStatus) params.status = filtroStatus;

      const [ag, cl, sv] = await Promise.all([
        agendamentosApi.listar(params),
        clientesApi.listar(),
        servicosApi.listar(),
      ]);
      setAgendamentos(ag.data);
      setClientes(cl.data);
      setServicos(sv.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filtroData, filtroStatus]);

  useEffect(() => { carregar(); }, [carregar]);

  const abrirFormNovo = () => {
    setEditando(null);
    setForm({ clienteId: '', servicoId: '', dataHora: `${filtroData}T09:00`, observacoes: '' });
    setFormError('');
    setShowForm(true);
  };

  const abrirFormEditar = (ag) => {
    setEditando(ag);
    setForm({
      clienteId: ag.clienteId,
      servicoId: ag.servicoId,
      dataHora: dataParaInput(ag.dataHora),
      observacoes: ag.observacoes || '',
    });
    setFormError('');
    setShowForm(true);
  };

  const salvar = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editando) {
        await agendamentosApi.atualizar(editando.id, form);
      } else {
        await agendamentosApi.criar(form);
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
      await agendamentosApi.excluir(confirmDelete.id);
      setConfirmDelete(null);
      carregar();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const abrirAtendimento = (ag) => {
    setShowAtendimentoForm(ag);
    setAtendimentoForm({ observacoes: '', fotos: [] });
  };

  const handleFotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setAtendimentoForm((prev) => ({
          ...prev,
          fotos: [...prev.fotos, ev.target.result],
        }));
      reader.readAsDataURL(file);
    });
  };

  const salvarAtendimento = async (e) => {
    e.preventDefault();
    setSavingAt(true);
    try {
      await atendimentosApi.criar({
        agendamentoId: showAtendimentoForm.id,
        observacoes: atendimentoForm.observacoes,
        fotos: atendimentoForm.fotos,
      });
      setShowAtendimentoForm(null);
      carregar();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingAt(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Agenda</h1>
        <button className="btn btn--primary" onClick={abrirFormNovo}>
          + Novo Agendamento
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-bar">
        <div className="form-group form-group--inline">
          <label className="form-label">Data</label>
          <input
            type="date"
            className="form-input"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>
        <div className="form-group form-group--inline">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="agendado">Agendado</option>
            <option value="atendido">Atendido</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <button className="btn btn--ghost" onClick={() => setFiltroData(hojeISO())}>
          Hoje
        </button>
        <button className="btn btn--ghost" onClick={() => { setFiltroData(''); setFiltroStatus(''); }}>
          Ver tudo
        </button>
      </div>

      {/* Lista */}
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={carregar} />}
      {!loading && !error && agendamentos.length === 0 && (
        <div className="empty-state">
          <p>Nenhum agendamento encontrado para este filtro.</p>
          <button className="btn btn--primary" onClick={abrirFormNovo}>
            Criar agendamento
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="card-list">
          {agendamentos.map((ag) => (
            <div key={ag.id} className="card card--agenda">
              <div className="card-left">
                <div className="card-time">{formatarDataHora(ag.dataHora)}</div>
                <span className={`badge ${STATUS_CLASS[ag.status]}`}>
                  {STATUS_LABEL[ag.status]}
                </span>
              </div>
              <div className="card-body">
                <p className="card-title">{ag.cliente?.nome || '—'}</p>
                <p className="card-subtitle">{ag.servico?.nome || '—'}</p>
                {ag.servico?.valor && (
                  <p className="card-value">
                    R$ {ag.servico.valor.toFixed(2)} · {ag.servico.tempoMinutos} min
                  </p>
                )}
                {ag.observacoes && (
                  <p className="card-obs">{ag.observacoes}</p>
                )}
              </div>
              <div className="card-actions">
                <button
                  className="btn btn--sm btn--ghost"
                  onClick={() => abrirFormEditar(ag)}
                >
                  Editar
                </button>
                {ag.status === 'agendado' && (
                  <button
                    className="btn btn--sm btn--success"
                    onClick={() => abrirAtendimento(ag)}
                  >
                    ✓ Atender
                  </button>
                )}
                <button
                  className="btn btn--sm btn--danger"
                  onClick={() => setConfirmDelete(ag)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de formulário */}
      {showForm && (
        <Modal
          title={editando ? 'Editar Agendamento' : 'Novo Agendamento'}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={salvar} className="form">
            {formError && <div className="alert alert--danger">{formError}</div>}
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select
                className="form-select"
                value={form.clienteId}
                onChange={(e) => setForm((f) => ({ ...f, clienteId: e.target.value }))}
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Serviço *</label>
              <select
                className="form-select"
                value={form.servicoId}
                onChange={(e) => setForm((f) => ({ ...f, servicoId: e.target.value }))}
                required
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} — R$ {s.valor.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Data e Hora *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.dataHora}
                onChange={(e) => setForm((f) => ({ ...f, dataHora: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                className="form-textarea"
                value={form.observacoes}
                onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
                rows={3}
                placeholder="Detalhes adicionais..."
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
                {saving ? 'Salvando...' : editando ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de atendimento */}
      {showAtendimentoForm && (
        <Modal title="Registrar Atendimento" onClose={() => setShowAtendimentoForm(null)}>
          <form onSubmit={salvarAtendimento} className="form">
            <div className="atendimento-info">
              <p><strong>Cliente:</strong> {showAtendimentoForm.cliente?.nome}</p>
              <p><strong>Serviço:</strong> {showAtendimentoForm.servico?.nome}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Observações do atendimento</label>
              <textarea
                className="form-textarea"
                value={atendimentoForm.observacoes}
                onChange={(e) =>
                  setAtendimentoForm((f) => ({ ...f, observacoes: e.target.value }))
                }
                rows={4}
                placeholder="Descreva o atendimento realizado..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fotos (opcional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="form-input"
                onChange={handleFotoUpload}
              />
              {atendimentoForm.fotos.length > 0 && (
                <div className="foto-preview-grid">
                  {atendimentoForm.fotos.map((f, i) => (
                    <img key={i} src={f} alt={`Foto ${i + 1}`} className="foto-preview" />
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowAtendimentoForm(null)}
                disabled={savingAt}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn--success" disabled={savingAt}>
                {savingAt ? 'Salvando...' : '✓ Confirmar Atendimento'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Excluir o agendamento de "${confirmDelete.cliente?.nome}"?`}
          onConfirm={excluir}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
