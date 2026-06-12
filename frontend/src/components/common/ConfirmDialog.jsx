import Modal from './Modal';

export default function ConfirmDialog({ message, onConfirm, onCancel, loading }) {
  return (
    <Modal title="Confirmar ação" onClose={onCancel} size="sm">
      <p className="confirm-message">{message}</p>
      <div className="modal-actions">
        <button className="btn btn--secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button className="btn btn--danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Aguarde...' : 'Confirmar'}
        </button>
      </div>
    </Modal>
  );
}
