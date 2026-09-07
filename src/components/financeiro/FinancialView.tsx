import React, { useState } from 'react';
import {
  Landmark,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  RefreshCw,
  FileCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinancialTransaction, BankStatementItem } from '../../types';

interface FinancialViewProps {
  onOpenNewTransaction: () => void;
  onOpenCashAudit: () => void;
  onOpenInternalTransfer: () => void;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  onOpenNewTransaction,
  onOpenCashAudit,
  onOpenInternalTransfer
}) => {
  const {
    bankAccounts,
    transactions,
    bankStatements,
    cashDrawerEntries,
    cashDrawerAudits,
    totalBankBalance,
    cashDrawerBalance,
    totalAvailability,
    totalMonthlyRevenue,
    totalMonthlyExpense,
    netResult,
    reconciliationSuggestions,
    reconcileStatementWithTransaction
  } = useApp();

  const [subTab, setSubTab] = useState<
    'visao_geral' | 'lancamentos' | 'bancos_extratos' | 'conciliacao_assistida' | 'caixa_fisico'
  >('visao_geral');

  const [selectedBankTab, setSelectedBankTab] = useState<string>(bankAccounts[0]?.id || '');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>('todos');

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    if (transactionTypeFilter === 'receita') return t.type === 'receita';
    if (transactionTypeFilter === 'despesa') return t.type === 'despesa';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-600" />
            Financeiro Operacional do Consultório
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão administrativa sem gateways: bancos, caixa físico, conciliação e disponibilidade
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenInternalTransfer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
            Transferência Banco ⇄ Caixa
          </button>

          <button
            onClick={onOpenCashAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            Conferir Caixa Físico
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs overflow-x-auto text-xs">
        <button
          onClick={() => setSubTab('visao_geral')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
            subTab === 'visao_geral' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Visão Geral & Disponibilidade
        </button>

        <button
          onClick={() => setSubTab('lancamentos')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
            subTab === 'lancamentos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Lançamentos (Receitas e Despesas)
        </button>

        <button
          onClick={() => setSubTab('bancos_extratos')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
            subTab === 'bancos_extratos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Contas Bancárias & Extratos
        </button>

        <button
          onClick={() => setSubTab('conciliacao_assistida')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            subTab === 'conciliacao_assistida'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Conciliação Assistida</span>
          {reconciliationSuggestions.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                subTab === 'conciliacao_assistida'
                  ? 'bg-indigo-800 text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {reconciliationSuggestions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('caixa_fisico')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
            subTab === 'caixa_fisico' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Caixa Físico & Conferência
        </button>
      </div>

      {/* SUB-TAB 1: VISÃO GERAL & DISPONIBILIDADE TOTAL (PRD 9.9) */}
      {subTab === 'visao_geral' && (
        <div className="space-y-6">
          {/* Disponibilidade Total Highlight Card (PRD Seção 9.9) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-6 rounded-xl shadow-md border border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
                  <Wallet className="w-4 h-4" />
                  Recurso Financeiro Total Imediato (PRD Seção 9.9)
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight">
                  R$ {totalAvailability.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-slate-300 mt-2 max-w-xl">
                  A <strong>Disponibilidade Total</strong> representa a soma dos recursos efetivamente disponíveis em bancos e caixa físico. Não se confunde com faturamento bruto ou lucro.
                </p>
              </div>

              {/* Sub-breakdown: Bancos + Caixa Físico */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/10">
                  <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
                    <Landmark className="w-3 h-3 text-indigo-300" />
                    Saldos Bancários
                  </div>
                  <div className="text-base font-bold text-white">
                    R$ {totalBankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-indigo-300 mt-0.5">
                    {bankAccounts.length} contas cadastradas
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/10">
                  <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
                    <Wallet className="w-3 h-3 text-indigo-300" />
                    Caixa Físico
                  </div>
                  <div className="text-base font-bold text-white">
                    R$ {cashDrawerBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-indigo-300 mt-0.5">
                    Numerário no consultório
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado Operacional Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Receitas Realizadas</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                R$ {totalMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Entradas de consultas e atendimentos</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Despesas Pagas</span>
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                R$ {totalMonthlyExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-rose-700 font-medium">Insumos, aluguel e custos operacionais</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                <span>Resultado Operacional Líquido</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-bold ${netResult >= 0 ? 'text-indigo-700' : 'text-rose-600'}`}>
                R$ {netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Receitas (-) Despesas do período</span>
            </div>
          </div>

          {/* Individual Bank Breakdown Grid */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contas Bancárias do Consultório (PRD Seção 9.4)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankAccounts.map(bank => (
                <div
                  key={bank.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs"
                      style={{ backgroundColor: bank.color }}
                    >
                      {bank.bankName.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{bank.bankName}</div>
                      <div className="text-xs text-slate-500">
                        Agência: {bank.agency} • C/C: {bank.accountNumber} ({bank.accountType})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-semibold">Saldo Atual</div>
                    <div className="text-base font-extrabold text-slate-900">
                      R$ {bank.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LANÇAMENTOS (RECEITAS E DESPESAS) */}
      {subTab === 'lancamentos' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Lançamentos Financeiros</span>
              <span className="text-xs text-slate-400">({filteredTransactions.length} registros)</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={transactionTypeFilter}
                onChange={e => setTransactionTypeFilter(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 cursor-pointer"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="receita">Somente Receitas</option>
                <option value="despesa">Somente Despesas</option>
              </select>

              <button
                onClick={onOpenNewTransaction}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Lançar
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTransactions.map(tx => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'receita'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {tx.type === 'receita' ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">{tx.description}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.paymentMethod}</span>
                      <span>•</span>
                      <span className="text-indigo-700 font-medium">{tx.destinationName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-extrabold ${
                      tx.type === 'receita' ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'receita' ? '+' : '-'} R${' '}
                    {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        tx.status === 'Pago'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                    {tx.reconciled && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                        Conciliado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CONTAS BANCÁRIAS & EXTRATOS (PRD 9.4) */}
      {subTab === 'bancos_extratos' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {bankAccounts.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBankTab(b.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedBankTab === b.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {b.bankName} (Saldo: R$ {b.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
              </button>
            ))}
          </div>

          {/* Extrato do banco selecionado */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
              <span>Extrato de Movimentações Bancárias</span>
              <span className="text-slate-400 font-normal">Dados sincronizados ou importados</span>
            </div>

            <div className="divide-y divide-slate-100">
              {bankStatements
                .filter(s => s.bankAccountId === selectedBankTab)
                .map(item => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 text-xs">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{item.description}</div>
                      <div className="text-slate-500 text-xs mt-0.5">
                        Data: {item.date} • Pagador/Favorecido: {item.payerOrReceiver || 'N/A'}{' '}
                        {item.documentNumber && `• Doc: ${item.documentNumber}`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-extrabold ${
                          item.amount > 0 ? 'text-emerald-700' : 'text-slate-800'
                        }`}
                      >
                        {item.amount > 0 ? '+' : ''} R${' '}
                        {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.reconciled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.reconciled ? 'Conciliado' : 'Pendente de Conciliação'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CONCILIAÇÃO BANCÁRIA ASSISTIDA (PRD Seção 9.5) */}
      {subTab === 'conciliacao_assistida' && (
        <div className="space-y-6">
          <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl flex items-start gap-3 text-xs text-sky-900">
            <AlertCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm mb-0.5">Como funciona a Conciliação Assistida (PRD Seção 9.5)</div>
              <p className="leading-relaxed text-sky-800">
                O sistema analisa os lançamentos dos extratos bancários e sugere correspondências com as consultas, receitas e registros do consultório por valor, data e pagador. <strong>Nenhuma conciliação é forçada automaticamente</strong>: você tem controle total para confirmar, ajustar ou recusar.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reconciliationSuggestions.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <div className="font-bold text-sm text-slate-800">Tudo Conciliado!</div>
                <div className="text-xs text-slate-400 mt-1">
                  Não existem lançamentos bancários pendentes de verificação no momento.
                </div>
              </div>
            ) : (
              reconciliationSuggestions.map(sug => {
                const stmt = sug.statementItem;
                const tx = sug.matchedTransaction;
                const apt = sug.matchedAppointment;

                return (
                  <div
                    key={sug.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">Sugestão de Correspondência</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sug.confidence === 'Alta'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sug.confidence === 'Média'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Confiança {sug.confidence}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 italic">{sug.reason}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Lado A: Extrato Bancário */}
                      <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                        <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Lançamento no Extrato Bancário
                        </div>
                        <div className="text-sm font-bold text-slate-800">{stmt.description}</div>
                        <div className="flex justify-between items-center text-slate-600 pt-1">
                          <span>Data: {stmt.date}</span>
                          <span className="font-extrabold text-sm text-slate-900">
                            {stmt.amount > 0 ? '+' : ''} R${' '}
                            {stmt.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        {stmt.payerOrReceiver && (
                          <div className="text-[11px] text-slate-400">Favorecido/Pagador: {stmt.payerOrReceiver}</div>
                        )}
                      </div>

                      {/* Lado B: Registro do Sistema */}
                      <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/40 text-xs space-y-1">
                        <div className="font-bold text-indigo-700 uppercase tracking-wider text-[10px]">
                          Registro Sugerido pelo Sistema
                        </div>
                        {tx ? (
                          <>
                            <div className="text-sm font-bold text-slate-800">{tx.description}</div>
                            <div className="flex justify-between items-center text-slate-600 pt-1">
                              <span>Data: {tx.date} • {tx.paymentMethod}</span>
                              <span className="font-extrabold text-sm text-indigo-800">
                                R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Destino registrado: {tx.destinationName} ({tx.status})
                            </div>
                          </>
                        ) : apt ? (
                          <>
                            <div className="text-sm font-bold text-slate-800">
                              Consulta de {apt.patientName} ({apt.type})
                            </div>
                            <div className="flex justify-between items-center text-slate-600 pt-1">
                              <span>Horário: {apt.date} às {apt.time}</span>
                              <span className="font-extrabold text-sm text-indigo-800">
                                R$ {apt.financialAmount?.toFixed(2)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="py-2 text-slate-400 italic">
                            Nenhum registro com valor idêntico encontrado automaticamente.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações da Conciliação */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          alert('Lançamento mantido pendente para revisão futura.');
                        }}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Ignorar por Enquanto
                      </button>

                      {tx && (
                        <button
                          onClick={() => reconcileStatementWithTransaction(stmt.id, tx.id)}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmar Conciliação
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CAIXA FÍSICO & CONFERÊNCIA (PRD 9.6, 9.7, 9.8) */}
      {subTab === 'caixa_fisico' && (
        <div className="space-y-6">
          {/* Caixa Físico Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                  Saldo Atual do Caixa Físico (Esperado pelo Sistema)
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  R$ {cashDrawerBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Valores em notas e moedas mantidos no consultório para troco e pequenas despesas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenInternalTransfer}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Transferir para Banco
                </button>

                <button
                  onClick={onOpenCashAudit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Conferir Caixa Físico
                </button>
              </div>
            </div>

            {/* Movimentações do Caixa Físico */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Movimentações em Dinheiro no Caixa Físico
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {cashDrawerEntries.map(entry => (
                  <div key={entry.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{entry.description}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {entry.date} às {entry.time} • Resp: {entry.responsibleUser}
                      </div>
                    </div>

                    <div
                      className={`text-sm font-extrabold ${
                        entry.amount >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {entry.amount >= 0 ? '+' : ''} R${' '}
                      {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico de Conferências / Auditorias (PRD 9.7) */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Histórico de Conferências do Caixa Físico (Auditorias Realizadas)
              </h4>

              {cashDrawerAudits.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Nenhuma conferência registrada ainda.</p>
              ) : (
                <div className="space-y-2">
                  {cashDrawerAudits.map(audit => (
                    <div
                      key={audit.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span>Conferência de Fechamento - {audit.date} às {audit.time}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              Math.abs(audit.difference) < 0.01
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {Math.abs(audit.difference) < 0.01 ? 'Sem Divergência' : 'Com Divergência'}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Esperado: R$ {audit.expectedBalance.toFixed(2)} | Contado fisicamente: R${' '}
                          {audit.countedBalance.toFixed(2)} (Resp: {audit.responsibleUser})
                        </div>
                        {audit.justification && (
                          <div className="text-slate-400 text-[10px] italic mt-0.5">
                            Justificativa: "{audit.justification}"
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            audit.difference === 0
                              ? 'text-emerald-700'
                              : audit.difference > 0
                              ? 'text-amber-700'
                              : 'text-rose-600'
                          }`}
                        >
                          Diferença: {audit.difference >= 0 ? '+' : ''} R$ {audit.difference.toFixed(2)}
                        </div>
                        {audit.adjustmentCreated && (
                          <span className="text-[10px] text-indigo-700 font-medium">Ajuste de caixa lançado</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
