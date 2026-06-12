import { useState, useEffect, useCallback } from 'react';
import { faturamentoApi } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const formatarMoeda = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const formatarData = (d) => {
  const [ano, mes, dia] = d.split('-');
  return `${dia}/${mes}`;
};

const formatarMes = (m) => {
  const nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const [, mes] = m.split('-');
  return nomes[parseInt(mes) - 1];
};

const formatarDataHora = (d) =>
  new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const hojeISO = () => new Date().toISOString().split('T')[0];
const inicioMesISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
};

export default function Faturamento() {
  const [resumo, setResumo] = useState(null);
  const [dadosDiarios, setDadosDiarios] = useState([]);
  const [dadosMensais, setDadosMensais] = useState([]);
  const [detalhado, setDetalhado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewChart, setViewChart] = useState('diario'); // 'diario' | 'mensal'
  const [filtro, setFiltro] = useState({ dataInicio: inicioMesISO(), dataFim: hojeISO() });

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, diario, mensal, det] = await Promise.all([
        faturamentoApi.getResumo(),
        faturamentoApi.getDiario({ dataInicio: `${filtro.dataInicio}T00:00:00`, dataFim: `${filtro.dataFim}T23:59:59` }),
        faturamentoApi.getMensal({ ano: new Date().getFullYear() }),
        faturamentoApi.getDetalhado({ dataInicio: `${filtro.dataInicio}T00:00:00`, dataFim: `${filtro.dataFim}T23:59:59` }),
      ]);
      setResumo(res.data);
      setDadosDiarios(diario.data);
      setDadosMensais(mensal.data);
      setDetalhado(det.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => { carregar(); }, [carregar]);

  const totalPeriodo = dadosDiarios.reduce((acc, d) => acc + d.valor, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Faturamento</h1>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onRetry={carregar} />}

      {!loading && !error && resumo && (
        <>
          {/* Cards de resumo */}
          <div className="stats-grid stats-grid--4">
            <div className="stat-card stat-card--primary">
              <p className="stat-label">Hoje</p>
              <p className="stat-value">{formatarMoeda(resumo.faturamentoHoje)}</p>
            </div>
            <div className="stat-card stat-card--success">
              <p className="stat-label">Este mês</p>
              <p className="stat-value">{formatarMoeda(resumo.faturamentoMes)}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Atendimentos no mês</p>
              <p className="stat-value">{resumo.totalAtendimentosMes}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Ticket médio</p>
              <p className="stat-value">{formatarMoeda(resumo.ticketMedio)}</p>
            </div>
          </div>

          {/* Filtro de período */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-section-title">Filtrar período</div>
            <div className="filtros-bar filtros-bar--compact">
              <div className="form-group form-group--inline">
                <label className="form-label">De</label>
                <input
                  type="date"
                  className="form-input"
                  value={filtro.dataInicio}
                  onChange={(e) => setFiltro((f) => ({ ...f, dataInicio: e.target.value }))}
                />
              </div>
              <div className="form-group form-group--inline">
                <label className="form-label">Até</label>
                <input
                  type="date"
                  className="form-input"
                  value={filtro.dataFim}
                  onChange={(e) => setFiltro((f) => ({ ...f, dataFim: e.target.value }))}
                />
              </div>
              <div className="stat-badge">
                Total no período: <strong>{formatarMoeda(totalPeriodo)}</strong>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="chart-header">
              <span className="card-section-title">Faturamento por período</span>
              <div className="btn-group">
                <button
                  className={`btn btn--sm ${viewChart === 'diario' ? 'btn--primary' : 'btn--ghost'}`}
                  onClick={() => setViewChart('diario')}
                >
                  Diário
                </button>
                <button
                  className={`btn btn--sm ${viewChart === 'mensal' ? 'btn--primary' : 'btn--ghost'}`}
                  onClick={() => setViewChart('mensal')}
                >
                  Mensal
                </button>
              </div>
            </div>

            {viewChart === 'diario' && dadosDiarios.length === 0 && (
              <p className="chart-empty">Nenhum dado para o período selecionado.</p>
            )}
            {viewChart === 'mensal' && dadosMensais.every((d) => d.valor === 0) && (
              <p className="chart-empty">Nenhum dado para este ano.</p>
            )}

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={viewChart === 'diario' ? dadosDiarios : dadosMensais}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={viewChart === 'diario' ? 'data' : 'mes'}
                  tickFormatter={viewChart === 'diario' ? formatarData : formatarMes}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickFormatter={(v) => `R$${v}`} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [formatarMoeda(value), 'Faturamento']}
                  labelFormatter={viewChart === 'diario' ? (l) => `Dia: ${formatarData(l)}` : (l) => `Mês: ${formatarMes(l)}`}
                />
                <Bar
                  dataKey="valor"
                  fill="#0F172A"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela detalhada */}
          <div className="card">
            <div className="card-section-title">Atendimentos no período</div>
            {detalhado.length === 0 ? (
              <p className="chart-empty">Nenhum atendimento no período.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Cliente</th>
                      <th>Serviço</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalhado.map((d) => (
                      <tr key={d.id}>
                        <td>{formatarDataHora(d.dataHora)}</td>
                        <td>{d.cliente}</td>
                        <td>{d.servico}</td>
                        <td className="td--valor">{formatarMoeda(d.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}><strong>Total</strong></td>
                      <td className="td--valor">
                        <strong>{formatarMoeda(totalPeriodo)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
