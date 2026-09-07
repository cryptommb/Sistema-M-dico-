import React, { useState } from 'react';
import { 
  Activity, 
  Wallet, 
  Landmark, 
  Shield, 
  UserCheck, 
  RefreshCw, 
  Plus, 
  Info,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenNewAppointment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewAppointment }) => {
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    totalBankBalance,
    cashDrawerBalance,
    totalAvailability,
    resetAllData
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAvailabilityDetail, setShowAvailabilityDetail] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0 z-30">
      {/* Left: View title & status indicator */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight uppercase">
          Visão Geral Operacional
        </h1>
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SISTEMA OPERACIONAL ATIVO</span>
        </div>
      </div>

      {/* Center: Disponibilidade Total Badge (PRD Seção 9.9) */}
      <div className="relative hidden lg:block">
        <button
          onClick={() => setShowAvailabilityDetail(!showAvailabilityDetail)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
        >
          <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Wallet className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Disponibilidade Total
              </span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-900 leading-none mt-0.5">
              R$ {totalAvailability.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </button>

        {showAvailabilityDetail && (
          <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-lg shadow-lg border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1">
            <div className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
              Composição da Disponibilidade (PRD 9.9)
            </div>
            <div className="py-2 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-slate-400" />
                  Saldos Bancários (Itaú + Santander):
                </span>
                <span className="font-semibold text-slate-900">
                  R$ {totalBankBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  Caixa Físico do Consultório:
                </span>
                <span className="font-semibold text-slate-900">
                  R$ {cashDrawerBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 leading-tight">
              * Não confundir com faturamento ou resultado do período. Representa o numerário imediatamente disponível.
            </p>
          </div>
        )}
      </div>

      {/* Right: Quick Action, User Role Switcher & Reset */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenNewAppointment}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Agendamento</span>
        </button>

        {/* Profile Switcher (PRD Seção 3: Médico vs Secretária) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 p-1 pr-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-md object-cover border border-slate-200"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${currentUser.role === 'medico' ? 'bg-indigo-500' : 'bg-blue-500'}`} />
                <span className="capitalize font-medium text-slate-600">
                  {currentUser.role === 'medico' ? 'Médico' : 'Secretária'}
                </span>
                {currentUser.crm && <span className="text-slate-400">({currentUser.crm})</span>}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Alternar Perfil (Simulação de Acesso)
              </div>
              {availableUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                    currentUser.id === user.id ? 'bg-indigo-50/70 text-indigo-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-md object-cover"
                  />
                  <div className="text-xs">
                    <div>{user.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {user.role === 'medico' ? `Médico — ${user.crm}` : 'Secretária / Recepção'}
                    </div>
                  </div>
                  {currentUser.id === user.id && (
                    <UserCheck className="w-4 h-4 text-indigo-600 ml-auto" />
                  )}
                </button>
              ))}
              <div className="p-2 border-t border-slate-100 mt-1">
                <button
                  onClick={() => {
                    if (confirm('Deseja restaurar todos os dados para o estado inicial demonstrativo?')) {
                      resetAllData();
                      setShowRoleDropdown(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Restaurar Dados Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
