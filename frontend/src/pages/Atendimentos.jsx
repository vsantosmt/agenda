import { useState, useEffect, useCallback } from 'react';
import { atendimentosApi } from '../services/api';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const formatarDataHora = (d) =>
  new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const formatarMoeda = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export default function Atendimentos() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ observacoes: '', fotos: [] });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [busca, setBusca] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await atendimentosApi.listar();
      setAtendimentos(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const filtrados = atendimentos.filter((a) => {
    const cliente = a.agendamento?.cliente?.nome?.toLowerCase() || '';
    const servico = a.agendamento?.servico?.nome?.toLowerCase() || '';
    const q = busca.toLowerCase();
    return cliente.includes(q) || servico.includes(q);
  });

  const abrirEditar = (at) => {
    setEditando(at);
    setForm({ observacoes: at.observacoes || '', fotos: at.fotos || [] });
  };

  const handleFotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setForm((f) => ({ ...f, fotos: [...f.fotos, ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removerFoto = (idx) => {
    setForm((f) => ({ ...f, fotos: f.fotos.filter((_, i) => i !== idx) }));
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await atendimentosApi.atualizar(editando.id, form);
      setEditando(null);
      carregar();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const excluir = async () => {
    setDeleting(true);
    try {
      await atendimentosApi.excluir(confirmDelete.id);
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
        <h1 className="page-title">Atendimentos</h1>
      </div>

      <div className="filtros-bar">
        <input
          type="search"
          className="form-input search-input"
          placeholder="🔍 Buscar por cliente ou serviço..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={carregar} />}

      {!loading && !error && (
        <>
          <p className="result-count">{filtrados.length} atendimento(s)</p>

          {filtrados.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum atendimento registrado ainda.</p>
              <p className="empty-hint">
                Marque um agendamento como atendido na tela de Agenda.
              </p>
            </div>
          ) : (
            <div className="card-list">
              {filtrados.map((at) => {
                const ag = at.agendamento;
                return (
                  <div key={at.id} className="card card--atendimento">
                    <div className="card-left">
                      <div className="card-time">
                        {ag ? formatarDataHora(ag.dataHora) : '—'}
                      </div>
                      <span className="badge badge--success">Atendido</span>
                    </div>
                    <div className="card-body">
                      <p className="card-title">{ag?.cliente?.nome || '—'}</p>
                      <p className="card-subtitle">{ag?.servico?.nome || '—'}</p>
                      {ag?.servico?.valor && (
                        <p className="card-value">{formatarMoeda(ag.servico.valor)}</p>
                      )}
                      {at.fotos?.length > 0 && (
                        <p className="card-fotos-count">📷 {at.fotos.length} foto(s)</p>
                      )}
                      {at.observacoes && (
                        <p className="card-obs">{at.observacoes}</p>
                      )}
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn--sm btn--ghost"
                        onClick={() => setDetalhe(at)}
                      >
                        Ver detalhes
                      </button>
                      <button
                        className="btn btn--sm btn--ghost"
                        onClick={() => abrirEditar(at)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => setConfirmDelete(at)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal de detalhes */}
      {detalhe && (
        <Modal title="Detalhes do Atendimento" onClose={() => setDetalhe(null)} size="lg">
          <div className="atendimento-detalhe">
            <div className="detalhe-info-grid">
              <div>
                <span className="detalhe-label">Cliente</span>
                <span className="detalhe-value">{detalhe.agendamento?.cliente?.nome || '—'}</span>
              </div>
              <div>
                <span className="detalhe-label">Serviço</span>
                <span className="detalhe-value">{detalhe.agendamento?.servico?.nome || '—'}</span>
              </div>
              <div>
                <span className="detalhe-label">Valor</span>
                <span className="detalhe-value">
                  {detalhe.agendamento?.servico?.valor
                    ? formatarMoeda(detalhe.agendamento.servico.valor)
                    : '—'}
                </span>
              </div>
              <div>
                <span className="detalhe-label">Data e Hora</span>
                <span className="detalhe-value">
                  {detalhe.agendamento ? formatarDataHora(detalhe.agendamento.dataHora) : '—'}
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <span className="detalhe-label">Observações</span>
              <p className="detalhe-obs">{detalhe.observacoes || 'Sem observações.'}</p>
            </div>

            {detalhe.fotos?.length > 0 && (
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <span className="detalhe-label">Fotos ({detalhe.fotos.length})</span>
                <div className="foto-preview-grid">
                  {detalhe.fotos.map((f, i) => (
                    <img key={i} src={f} alt={`Foto ${i + 1}`} className="foto-preview foto-preview--lg" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal de edição */}
      {editando && (
        <Modal title="Editar Atendimento" onClose={() => setEditando(null)}>
          <form onSubmit={salvar} className="form">
            <div className="atendimento-info">
              <p><strong>Cliente:</strong> {editando.agendamento?.cliente?.nome}</p>
              <p><strong>Serviço:</strong> {editando.agendamento?.servico?.nome}</p>
            </div>
            <div className="form-group">
              <label className="form-label">Observações</label>
              <textarea
                className="form-textarea"
                value={form.observacoes}
                onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Adicionar fotos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="form-input"
                onChange={handleFotoUpload}
              />
              {form.fotos.length > 0 && (
                <div className="foto-preview-grid">
                  {form.fotos.map((f, i) => (
                    <div key={i} className="foto-preview-wrapper">
                      <img src={f} alt={`Foto ${i + 1}`} className="foto-preview" />
                      <button
                        type="button"
                        className="foto-remove"
                        onClick={() => removerFoto(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setEditando(null)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message="Excluir este registro de atendimento? O agendamento não será removido."
          onConfirm={excluir}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
