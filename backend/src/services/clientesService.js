const clientesRepository = require('../repositories/clientesRepository');

const clientesService = {
  listar: (nome) => {
    if (nome) return clientesRepository.findByNome(nome);
    return clientesRepository.findAll();
  },

  buscarPorId: (id) => {
    const cliente = clientesRepository.findById(id);
    if (!cliente) throw new Error('Cliente não encontrado');
    return cliente;
  },

  criar: (data) => {
    if (!data.nome || !data.nome.trim())
      throw new Error('Nome do cliente é obrigatório');
    return clientesRepository.create({
      nome: data.nome.trim(),
      telefone: data.telefone?.trim() || '',
      email: data.email?.trim() || '',
    });
  },

  atualizar: (id, data) => {
    const existe = clientesRepository.findById(id);
    if (!existe) throw new Error('Cliente não encontrado');
    if (data.nome !== undefined && !data.nome.trim())
      throw new Error('Nome do cliente não pode ser vazio');
    return clientesRepository.update(id, {
      ...(data.nome && { nome: data.nome.trim() }),
      ...(data.telefone !== undefined && { telefone: data.telefone.trim() }),
      ...(data.email !== undefined && { email: data.email.trim() }),
    });
  },

  excluir: (id) => {
    const existe = clientesRepository.findById(id);
    if (!existe) throw new Error('Cliente não encontrado');
    clientesRepository.delete(id);
  },
};

module.exports = clientesService;
