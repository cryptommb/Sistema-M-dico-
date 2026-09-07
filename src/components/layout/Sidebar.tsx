import React from 'react';
import {
  Activity,
  Calendar,
  Users,
  FileText,
  Landmark,
  MessageSquare,
  Package,
  ShieldCheck,
  Stethoscope,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    appointments,
    patients,
    whatsAppMessages,
    bankStatements,
    stockItems
  } = useApp();

  const todayStr = '2026-09-07';
  const todayAppointmentsCount = appointments.filter(a => a.date === todayStr).length;
  const pendingApprovalsCount = whatsAppMessages.filter(m => m.status === 'Pendente de Aprovação').length;
  const pendingReconciliationCount = bankStatements.filter(s => !s.reconciled).length;
  const lowStockCount = stockItems.filter(s => s.quantity <= s.minQuantity).length;

  const navItems = [
    {
      id: 'agenda',
      label: 'Agenda Médica',
      description: 'Consultas e horários',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : undefined,
      badgeColor: 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
    },
    {
      id: 'pacientes',
      label: 'Pacientes',
      description: 'Cadastros e histórico',
      icon: Users,
      badge: patients.length,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700'
    },
    {
      id: 'prontuario',
      label: 'Prontuário',
      description: 'Atendimento e modelos',
      icon: Stethoscope
    },
    {
      id: 'financeiro',
      label: 'Financeiro Operacional',
      description: 'Caixa, bancos & conciliação',
      icon: Landmark,
      badge: pendingReconciliationCount > 0 ? `${pendingReconciliationCount}` : undefined,
      badgeColor: 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp & Avisos',
      description: 'Confirmações e lembretes',
      icon: MessageSquare,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
      badgeColor: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
    },
    {
      id: 'estoque',
      label: 'Estoque e Kits',
      description: 'Insumos e procedimentos',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} baixo` : undefined,
      badgeColor: 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
    },
    {
      id: 'termos',
      label: 'Termos & Aceites',
      description: 'Consentimentos e LGPD',
      icon: ShieldCheck
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 h-full select-none">
      {/* Brand Header */}
      <div className="p-4.5 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-xs">
          <Activity className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm tracking-tight">SISTEMA MÉDICO</span>
          <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">ERP Clínico & Financeiro</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Módulos Principais
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer group ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isActive ? (
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 opacity-0" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="truncate">
                  <div className="text-xs leading-none mb-0.5 truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">
                    {item.description}
                  </div>
                </div>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3.5 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px] mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Horário de Atendimento</span>
          </div>
          <div className="text-slate-400 text-[10px] space-y-0.5 leading-tight">
            <div>Manhã: 08:00 às 12:00</div>
            <div>Tarde: 14:00 às 18:00</div>
            <div className="text-indigo-300 font-medium pt-0.5">Consultas de 1h</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

