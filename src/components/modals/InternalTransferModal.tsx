import React, { useState } from 'react';
import { X, ArrowLeftRight, Landmark, Wallet, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InternalTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InternalTransferModal: React.FC<InternalTransferModalProps> = ({ isOpen, onClose }) => {
  const { bankAccounts, cashDrawerBalance, transferBetweenBankAndCash } = useApp();

  const [direction, setDirection] = useState<'caixa_para_banco' | 'banco_para_caixa'>('caixa_para_banco');
  const [bankAccountId, setBankAccountId] = useState<string>(bankAccounts[0]?.id || '');
  const [amountStr, setAmountStr] = useState<string>('500.00');
  const [description, setDescription] = useState<string>('Depósito de sangria de caixa');

  if (!isOpen) return null;

  const amount = parseFloat(amountStr) || 0;
  const selectedBank = bankAccounts.find(b => b.id === bankAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !bankAccountId) return;

    transferBetweenBankAndCash(direction, bankAccountId, amount, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Transferência Interna</h2>
              <p className="text-xs text-slate-500">Movimentação entre Caixa Físico e Banco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-indigo-50/60 border border-indigo-100 text-indigo-900 p-3 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Regra Contábil do Consultório (PRD 9.8)</p>
              <p className="text-indigo-700/90">
                Transferências internas não alteram o resultado financeiro nem geram receita/despesa dupla. Apenas transferem a custódia do recurso.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Sentido da Movimentação
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDirection('caixa_para_banco');
                  setDescription('Depósito de numerário físico no banco');
                }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  direction === 'caixa_para_banco'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                  Caixa → Banco
                </span>
                <span className="text-[11px] text-slate-500">Depósito de dinheiro no banco</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDirection('banco_para_caixa');
                  setDescription('Saque bancário para suprimento de caixa');
                }}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  direction === 'banco_para_caixa'
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                  Banco → Caixa
                </span>
                <span className="text-[11px] text-slate-500">Saque p/ fundo de troco</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Conta Bancária Envolvida *
            </label>
            <select
              value={bankAccountId}
              onChange={e => setBankAccountId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              required
            >
              {bankAccounts.map(b => (
                <option key={b.id} value={b.id}>
                  {b.bankName} (Ag. {b.agency} - C/C {b.accountNumber}) — Saldo: R$ {b.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Valor da Transferência (R$) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                R$
              </div>
              <input
                type="number"
                step="0.01"
                value={amountStr}
                onChange={e => setAmountStr(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Disponível em caixa físico no momento: R$ {cashDrawerBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descrição / Motivo
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              Realizar Transferência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
