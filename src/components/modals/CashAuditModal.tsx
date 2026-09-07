import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Calculator, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CashAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashAuditModal: React.FC<CashAuditModalProps> = ({ isOpen, onClose }) => {
  const { cashDrawerBalance, performCashAudit, currentUser } = useApp();

  const [countedStr, setCountedStr] = useState<string>(cashDrawerBalance.toFixed(2));
  const [justification, setJustification] = useState<string>('');
  const [createAdjustment, setCreateAdjustment] = useState<boolean>(true);

  if (!isOpen) return null;

  const counted = parseFloat(countedStr) || 0;
  const expected = cashDrawerBalance;
  const difference = counted - expected;
  const hasDiff = Math.abs(difference) > 0.009;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performCashAudit(counted, justification, hasDiff ? createAdjustment : false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Conferência do Caixa Físico</h2>
              <p className="text-xs text-slate-500">Auditoria manual do numerário disponível</p>
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
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>Responsável pela auditoria:</span>
              <span className="font-semibold text-slate-700">{currentUser.name}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
              <span className="text-sm font-medium text-slate-700">Saldo Esperado pelo Sistema:</span>
              <span className="text-lg font-bold text-slate-900">
                R$ {expected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Valor Físico Efetivamente Contado (R$) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                R$
              </div>
              <input
                type="number"
                step="0.01"
                value={countedStr}
                onChange={e => setCountedStr(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Comparativo de diferença conforme PRD 9.7 */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              !hasDiff
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                : difference > 0
                ? 'bg-amber-50/80 border-amber-200 text-amber-800'
                : 'bg-rose-50/80 border-rose-200 text-rose-800'
            }`}
          >
            {!hasDiff ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-semibold">
                {!hasDiff ? 'Caixa Conferido: Sem Divergência' : difference > 0 ? 'Sobra de Caixa Identificada' : 'Falta de Caixa Identificada'}
              </div>
              <div className="flex items-center gap-2">
                <span>Diferença apurada:</span>
                <span className="font-bold text-sm">
                  {difference >= 0 ? '+' : ''} R$ {difference.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {hasDiff && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Justificativa da Divergência *
                </label>
                <textarea
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  placeholder="Ex: Troco arredondado em atendimento anterior ou pendência de comprovante de café..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createAdjustment}
                  onChange={e => setCreateAdjustment(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="text-xs text-slate-700">
                  <span className="font-semibold block">Lançar ajuste de caixa automático</span>
                  <span className="text-slate-500">
                    Gera movimentação corretiva no histórico para alinhar o saldo do sistema ao valor físico.
                  </span>
                </div>
              </label>
            </div>
          )}

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
              Registrar Conferência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
