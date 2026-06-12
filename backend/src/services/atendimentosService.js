const atendimentosRepository = require('../repositories/atendimentosRepository');
const agendamentosRepository = require('../repositories/agendamentosRepository');
const clientesRepository = require('../repositories/clientesRepository');
const servicosRepository = require('../repositories/servicosRepository');

const _enriquecer = (atendimento) => {
  const agendamento = agendamentosRepository.findById(atendimento.agendamentoId);
  if (!agendamento) return atendimento;
  return {
    ...atendimento,
    agendamento: {
      ...agendamento,
      cliente: clientesRepository.findById(agendamento.clienteId),
      servico: servicosRepository.findById(agendamento.servicoId),
    },
  };
};

const atendimentosService = {
  listar: () => {
    return atendimentosRepository.findAll().map(_enriquecer);
  },

  buscarPorId: (id) => {
    const atendimento = atendimentosRepository.findById(id);
    if (!atendimento) throw new Error('Atendimento não encontrado');
    return _enriquecer(atendimento);
  },

  buscarPorAgendamento: (agendamentoId) => {
    const atendimento = atendimentosRepository.findByAgendamentoId(agendamentoId);
    if (!atendimento) return null;
    return _enriquecer(atendimento);
  },

  criar: (data) => {
    if (!data.agendamentoId) throw new Error('Agendamento é obrigatório');

    const agendamento = agendamentosRepository.findById(data.agendamentoId);
    if (!agendamento) throw new Error('Agendamento não encontrado');

    const jaExiste = atendimentosRepository.findByAgendamentoId(data.agendamentoId);
    if (jaExiste) throw new Error('Já existe um atendimento para este agendamento');

    const novo = atendimentosRepository.create({
      agendamentoId: data.agendamentoId,
      fotos: Array.isArray(data.fotos) ? data.fotos : [],
      observacoes: data.observacoes?.trim() || '',
    });

    // Marca agendamento como atendido automaticamente
    agendamentosRepository.update(data.agendamentoId, { status: 'atendido' });

    return _enriquecer(novo);
  },

  atualizar: (id, data) => {
    const existe = atendimentosRepository.findById(id);
    if (!existe) throw new Error('Atendimento não encontrado');

    const atualizado = atendimentosRepository.update(id, {
      ...(Array.isArray(data.fotos) && { fotos: data.fotos }),
      ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
    });

    return _enriquecer(atualizado);
  },

  excluir: (id) => {
    const existe = atendimentosRepository.findById(id);
    if (!existe) throw new Error('Atendimento não encontrado');
    atendimentosRepository.delete(id);
  },
};

module.exports = atendimentosService;
