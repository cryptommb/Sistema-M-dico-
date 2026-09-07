import React, { useState } from 'react';
import { X, DollarSign, ArrowUpRight, ArrowDownRight, User, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, TransactionType } from '../../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const { bankAccounts, patients, addTransaction } = useApp();

  const [type, setType] = useState<TransactionType>('receita');
  const [description, setDescription] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('350.00');
  const [category, setCategory] = useState<string>('Consultas');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Pago' | 'Pendente'>('Pago');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [destination, setDestination] = useState<string>('bank_1');
  const [patientId, setPatientId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const amount = parseFloat(amountStr) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    let destinationName = 'Caixa Físico do Consultório';
    if (destination !== 'caixa_fisico') {
      const b = bankAccounts.find(acc => acc.id === destination);
      destinationName = b?.bankName || 'Conta Bancária';
    }

    const patient = patients.find(p => p.id === patientId);

    addTransaction({
      description,
      amount,
      type,
      category,
      date,
      status,
      paymentMethod,
      destination,
      destinationName,
      patientId: patient?.id,
      patientName: patient?.name,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type === 'receita' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Novo Lançamento Financeiro</h2>
              <p className="text-xs text-slate-500">Controle operacional de receitas e despesas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
          {/* Tipo de movimentação */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('receita');
                setCategory('Consultas');
              }}
              className={`py-2 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                type === 'receita'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              Receita (+ Entrada)
            </button>

            <button
              type="button"
              onClick={() => {
                setType('despesa');
                setCategory('Insumos e Estoque');
              }}
              className={`py-2 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                type === 'despesa'
                  ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              Despesa (- Saída)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descrição do Lançamento *
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={type === 'receita' ? 'Ex: Consulta Particular / Retorno...' : 'Ex: Compra de luvas e seringas...'}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={amountStr}
                onChange={e => setAmountStr(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Data do Registro *
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {type === 'receita' ? (
                  <>
                    <option value="Consultas">Consultas</option>
                    <option value="Procedimentos">Procedimentos</option>
                    <option value="Exames">Exames</option>
                    <option value="Outras Receitas">Outras Receitas</option>
                  </>
                ) : (
                  <>
                    <option value="Insumos e Estoque">Insumos e Estoque</option>
                    <option value="Instalações">Instalações / Aluguel</option>
                    <option value="Serviços Terceirizados">Serviços Terceirizados</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Impostos">Impostos</option>
                    <option value="Copa e Escritório">Copa e Escritório</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Situação
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'Pago' | 'Pendente')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Pago">Pago / Realizado</option>
                <option value="Pendente">Pendente / A Receber/Pagar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Pix">Pix</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Boleto">Boleto</option>
                <option value="Transferência Bancária">Transferência Bancária</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Conta de Destino / Origem
              </label>
              <select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="caixa_fisico">Caixa Físico do Consultório</option>
                {bankAccounts.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} (C/C {b.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {type === 'receita' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Vincular a Paciente (Opcional)
              </label>
              <select
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Sem vínculo com paciente específico</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (CPF: {p.cpf})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Observações Administrativas
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Número de recibo, NF ou observação de caixa..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Salvar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
