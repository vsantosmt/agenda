const atendimentosRepository = require('../repositories/atendimentosRepository');
const agendamentosRepository = require('../repositories/agendamentosRepository');
const servicosRepository = require('../repositories/servicosRepository');
const clientesRepository = require('../repositories/clientesRepository');

const faturamentoService = {
  getResumo: () => {
    const atendimentos = atendimentosRepository.findAll();
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0);
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);

    let faturamentoHoje = 0;
    let faturamentoMes = 0;
    let totalAtendimentosMes = 0;

    atendimentos.forEach((at) => {
      const agendamento = agendamentosRepository.findById(at.agendamentoId);
      if (!agendamento) return;
      const servico = servicosRepository.findById(agendamento.servicoId);
      if (!servico) return;

      const data = new Date(agendamento.dataHora);
      if (data >= inicioHoje && data <= fimHoje) faturamentoHoje += servico.valor;
      if (data >= inicioMes && data <= fimMes) {
        faturamentoMes += servico.valor;
        totalAtendimentosMes++;
      }
    });

    return {
      faturamentoHoje,
      faturamentoMes,
      totalAtendimentosMes,
      ticketMedio: totalAtendimentosMes > 0 ? faturamentoMes / totalAtendimentosMes : 0,
    };
  },

  getDiario: ({ dataInicio, dataFim } = {}) => {
    const atendimentos = atendimentosRepository.findAll();
    const mapaData = {};

    atendimentos.forEach((at) => {
      const agendamento = agendamentosRepository.findById(at.agendamentoId);
      if (!agendamento) return;
      const servico = servicosRepository.findById(agendamento.servicoId);
      if (!servico) return;

      const data = new Date(agendamento.dataHora);
      if (dataInicio && data < new Date(dataInicio)) return;
      if (dataFim && data > new Date(dataFim)) return;

      const chave = data.toISOString().split('T')[0];
      if (!mapaData[chave]) mapaData[chave] = { data: chave, valor: 0, quantidade: 0 };
      mapaData[chave].valor += servico.valor;
      mapaData[chave].quantidade++;
    });

    return Object.values(mapaData).sort((a, b) => a.data.localeCompare(b.data));
  },

  getMensal: ({ ano } = {}) => {
    const atendimentos = atendimentosRepository.findAll();
    const anoAlvo = parseInt(ano) || new Date().getFullYear();
    const mapaMes = {};

    for (let i = 1; i <= 12; i++) {
      const chave = `${anoAlvo}-${String(i).padStart(2, '0')}`;
      mapaMes[chave] = { mes: chave, valor: 0, quantidade: 0 };
    }

    atendimentos.forEach((at) => {
      const agendamento = agendamentosRepository.findById(at.agendamentoId);
      if (!agendamento) return;
      const servico = servicosRepository.findById(agendamento.servicoId);
      if (!servico) return;

      const data = new Date(agendamento.dataHora);
      if (data.getFullYear() !== anoAlvo) return;

      const chave = `${anoAlvo}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      mapaMes[chave].valor += servico.valor;
      mapaMes[chave].quantidade++;
    });

    return Object.values(mapaMes);
  },

  getDetalhado: ({ dataInicio, dataFim } = {}) => {
    const atendimentos = atendimentosRepository.findAll();
    const resultado = [];

    atendimentos.forEach((at) => {
      const agendamento = agendamentosRepository.findById(at.agendamentoId);
      if (!agendamento) return;
      const servico = servicosRepository.findById(agendamento.servicoId);
      const cliente = clientesRepository.findById(agendamento.clienteId);
      if (!servico || !cliente) return;

      const data = new Date(agendamento.dataHora);
      if (dataInicio && data < new Date(dataInicio)) return;
      if (dataFim && data > new Date(dataFim)) return;

      resultado.push({
        id: at.id,
        agendamentoId: agendamento.id,
        cliente: cliente.nome,
        servico: servico.nome,
        valor: servico.valor,
        dataHora: agendamento.dataHora,
        observacoes: at.observacoes,
      });
    });

    return resultado.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
  },
};

module.exports = faturamentoService;
