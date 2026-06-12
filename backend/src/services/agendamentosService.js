const agendamentosRepository = require('../repositories/agendamentosRepository');
const clientesRepository = require('../repositories/clientesRepository');
const servicosRepository = require('../repositories/servicosRepository');

const STATUS_VALIDOS = ['agendado', 'atendido', 'cancelado'];

const agendamentosService = {
  listar: (filtros) => {
    const agendamentos = agendamentosRepository.findAll(filtros);
    return agendamentos.map((a) => ({
      ...a,
      cliente: clientesRepository.findById(a.clienteId),
      servico: servicosRepository.findById(a.servicoId),
    }));
  },

  buscarPorId: (id) => {
    const agendamento = agendamentosRepository.findById(id);
    if (!agendamento) throw new Error('Agendamento não encontrado');
    return {
      ...agendamento,
      cliente: clientesRepository.findById(agendamento.clienteId),
      servico: servicosRepository.findById(agendamento.servicoId),
    };
  },

  criar: (data) => {
    if (!data.clienteId) throw new Error('Cliente é obrigatório');
    if (!data.servicoId) throw new Error('Serviço é obrigatório');
    if (!data.dataHora) throw new Error('Data e hora são obrigatórios');

    const clienteExiste = clientesRepository.findById(data.clienteId);
    if (!clienteExiste) throw new Error('Cliente não encontrado');

    const servicoExiste = servicosRepository.findById(data.servicoId);
    if (!servicoExiste) throw new Error('Serviço não encontrado');

    const novo = agendamentosRepository.create({
      clienteId: data.clienteId,
      servicoId: data.servicoId,
      dataHora: data.dataHora,
      observacoes: data.observacoes?.trim() || '',
      status: 'agendado',
    });

    return {
      ...novo,
      cliente: clienteExiste,
      servico: servicoExiste,
    };
  },

  atualizar: (id, data) => {
    const existe = agendamentosRepository.findById(id);
    if (!existe) throw new Error('Agendamento não encontrado');

    if (data.status && !STATUS_VALIDOS.includes(data.status))
      throw new Error(`Status inválido. Use: ${STATUS_VALIDOS.join(', ')}`);

    if (data.clienteId) {
      const c = clientesRepository.findById(data.clienteId);
      if (!c) throw new Error('Cliente não encontrado');
    }
    if (data.servicoId) {
      const s = servicosRepository.findById(data.servicoId);
      if (!s) throw new Error('Serviço não encontrado');
    }

    const atualizado = agendamentosRepository.update(id, {
      ...(data.clienteId && { clienteId: data.clienteId }),
      ...(data.servicoId && { servicoId: data.servicoId }),
      ...(data.dataHora && { dataHora: data.dataHora }),
      ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
      ...(data.status && { status: data.status }),
    });

    return {
      ...atualizado,
      cliente: clientesRepository.findById(atualizado.clienteId),
      servico: servicosRepository.findById(atualizado.servicoId),
    };
  },

  excluir: (id) => {
    const existe = agendamentosRepository.findById(id);
    if (!existe) throw new Error('Agendamento não encontrado');
    agendamentosRepository.delete(id);
  },
};

module.exports = agendamentosService;
