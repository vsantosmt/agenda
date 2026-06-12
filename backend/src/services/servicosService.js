const servicosRepository = require('../repositories/servicosRepository');

const servicosService = {
  listar: () => servicosRepository.findAll(),

  buscarPorId: (id) => {
    const servico = servicosRepository.findById(id);
    if (!servico) throw new Error('Serviço não encontrado');
    return servico;
  },

  criar: (data) => {
    if (!data.nome || !data.nome.trim())
      throw new Error('Nome do serviço é obrigatório');
    if (data.valor === undefined || data.valor === null || isNaN(Number(data.valor)))
      throw new Error('Valor do serviço é obrigatório');
    if (data.valor < 0) throw new Error('Valor não pode ser negativo');
    if (!data.tempoMinutos || data.tempoMinutos <= 0)
      throw new Error('Tempo estimado é obrigatório e deve ser positivo');

    return servicosRepository.create({
      nome: data.nome.trim(),
      valor: Number(data.valor),
      tempoMinutos: Number(data.tempoMinutos),
    });
  },

  atualizar: (id, data) => {
    const existe = servicosRepository.findById(id);
    if (!existe) throw new Error('Serviço não encontrado');

    const atualizado = {};
    if (data.nome !== undefined) {
      if (!data.nome.trim()) throw new Error('Nome não pode ser vazio');
      atualizado.nome = data.nome.trim();
    }
    if (data.valor !== undefined) {
      if (isNaN(Number(data.valor)) || Number(data.valor) < 0)
        throw new Error('Valor inválido');
      atualizado.valor = Number(data.valor);
    }
    if (data.tempoMinutos !== undefined) {
      if (Number(data.tempoMinutos) <= 0)
        throw new Error('Tempo deve ser positivo');
      atualizado.tempoMinutos = Number(data.tempoMinutos);
    }

    return servicosRepository.update(id, atualizado);
  },

  excluir: (id) => {
    const existe = servicosRepository.findById(id);
    if (!existe) throw new Error('Serviço não encontrado');
    servicosRepository.delete(id);
  },
};

module.exports = servicosService;
