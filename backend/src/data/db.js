/**
 * Banco de dados em memória (mock).
 * Para migrar para um banco real (ex: PostgreSQL), substitua as operações
 * nos arquivos de repositório sem precisar alterar services ou controllers.
 */

const db = {
  clientes: [
    { id: '1', nome: 'Maria Silva', telefone: '(11) 99999-0001', email: 'maria@email.com' },
    { id: '2', nome: 'João Santos', telefone: '(11) 99999-0002', email: 'joao@email.com' },
    { id: '3', nome: 'Ana Oliveira', telefone: '(11) 99999-0003', email: 'ana@email.com' },
    { id: '4', nome: 'Carlos Pereira', telefone: '(11) 99999-0004', email: 'carlos@email.com' },
  ],

  servicos: [
    { id: '1', nome: 'Corte de Cabelo', valor: 50.0, tempoMinutos: 30 },
    { id: '2', nome: 'Coloração', valor: 150.0, tempoMinutos: 90 },
    { id: '3', nome: 'Manicure', valor: 35.0, tempoMinutos: 45 },
    { id: '4', nome: 'Pedicure', valor: 40.0, tempoMinutos: 50 },
    { id: '5', nome: 'Hidratação Capilar', valor: 80.0, tempoMinutos: 60 },
  ],

  agendamentos: [
    {
      id: '1',
      clienteId: '1',
      servicoId: '1',
      dataHora: '2026-06-12T09:00:00',
      observacoes: 'Cliente prefere franja curta',
      status: 'agendado',
    },
    {
      id: '2',
      clienteId: '2',
      servicoId: '3',
      dataHora: '2026-06-12T10:00:00',
      observacoes: '',
      status: 'atendido',
    },
    {
      id: '3',
      clienteId: '3',
      servicoId: '2',
      dataHora: '2026-06-12T14:00:00',
      observacoes: 'Coloração loiro',
      status: 'agendado',
    },
    {
      id: '4',
      clienteId: '4',
      servicoId: '4',
      dataHora: '2026-06-11T09:30:00',
      observacoes: '',
      status: 'atendido',
    },
    {
      id: '5',
      clienteId: '1',
      servicoId: '5',
      dataHora: '2026-06-11T11:00:00',
      observacoes: '',
      status: 'atendido',
    },
    {
      id: '6',
      clienteId: '2',
      servicoId: '1',
      dataHora: '2026-06-10T10:00:00',
      observacoes: '',
      status: 'atendido',
    },
    {
      id: '7',
      clienteId: '3',
      servicoId: '3',
      dataHora: '2026-06-10T15:00:00',
      observacoes: '',
      status: 'atendido',
    },
    {
      id: '8',
      clienteId: '4',
      servicoId: '2',
      dataHora: '2026-06-05T14:00:00',
      observacoes: '',
      status: 'atendido',
    },
    {
      id: '9',
      clienteId: '1',
      servicoId: '3',
      dataHora: '2026-06-03T10:00:00',
      observacoes: '',
      status: 'atendido',
    },
    {
      id: '10',
      clienteId: '2',
      servicoId: '5',
      dataHora: '2026-06-01T09:00:00',
      observacoes: '',
      status: 'atendido',
    },
  ],

  atendimentos: [
    {
      id: '1',
      agendamentoId: '2',
      fotos: [],
      observacoes: 'Manicure realizada, cliente satisfeita.',
    },
    {
      id: '2',
      agendamentoId: '4',
      fotos: [],
      observacoes: 'Pedicure realizada com esmaltação vermelha.',
    },
    {
      id: '3',
      agendamentoId: '5',
      fotos: [],
      observacoes: 'Hidratação realizada com máscara especial Keratina.',
    },
    {
      id: '4',
      agendamentoId: '6',
      fotos: [],
      observacoes: 'Corte e finalização com escova.',
    },
    {
      id: '5',
      agendamentoId: '7',
      fotos: [],
      observacoes: 'Manicure francesa solicitada pela cliente.',
    },
    {
      id: '6',
      agendamentoId: '8',
      fotos: [],
      observacoes: 'Coloração platinada realizada em 2 etapas.',
    },
    {
      id: '7',
      agendamentoId: '9',
      fotos: [],
      observacoes: 'Manicure gel com nail art.',
    },
    {
      id: '8',
      agendamentoId: '10',
      fotos: [],
      observacoes: 'Hidratação + ampola de reconstrução.',
    },
  ],
};

module.exports = db;
