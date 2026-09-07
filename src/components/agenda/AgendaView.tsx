import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Stethoscope,
  Plus,
  Filter,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';

interface AgendaViewProps {
  onOpenNewAppointment: (defaultDate?: string, defaultTime?: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({ onOpenNewAppointment }) => {
  const {
    appointments,
    updateAppointmentStatus,
    currentUser,
    setActiveTab,
    setSelectedPatientId,
    setSelectedAppointmentIdForRecord
  } = useApp();

  const [viewMode, setViewMode] = useState<'diaria' | 'semanal' | 'mensal'>('diaria');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-07'); // Default date for demo
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Time slots for clinical office (PRD 4.3: 08:00 às 12:00 e 14:00 às 18:00 com duração de 1h)
  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
  ];

  const daysOfWeek = [
    { date: '2026-09-07', label: 'Segunda', day: '07/09' },
    { date: '2026-09-08', label: 'Terça', day: '08/09' },
    { date: '2026-09-09', label: 'Quarta', day: '09/09' },
    { date: '2026-09-10', label: 'Quinta', day: '10/09' },
    { date: '2026-09-11', label: 'Sexta', day: '11/09' }
  ];

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Atendido':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Cancelado':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Não compareceu':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleStartConsultation = (apt: Appointment) => {
    setSelectedPatientId(apt.patientId);
    setSelectedAppointmentIdForRecord(apt.id);
    setActiveTab('prontuario');
  };

  const handleOpenWhatsApp = (apt: Appointment) => {
    const cleanPhone = apt.patientPhone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Olá ${apt.patientName}, confirmamos sua consulta com o ${apt.doctorName} no dia ${apt.date} às ${apt.time} na Clínica Médica. Aguardamos você!`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${text}`, '_blank');
  };

  // Filtered appointments for the active date / view
  const currentDayAppointments = appointments.filter(apt => {
    if (apt.date !== selectedDate) return false;
    if (statusFilter !== 'todos' && apt.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            Agenda de Atendimentos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Horários configurados: 08:00 às 12:00 e 14:00 às 18:00 (1 hora por consulta)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('diaria')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                viewMode === 'diaria' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode('semanal')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                viewMode === 'semanal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('mensal')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                viewMode === 'mensal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mês
            </button>
          </div>

          {/* Date Selector Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200/60 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-transparent border-none focus:outline-none cursor-pointer"
            />
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200/60 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="todos">Todos os Status</option>
            <option value="Agendado">Agendado</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Atendido">Atendido</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Não compareceu">Não compareceu</option>
          </select>

          <button
            onClick={() => onOpenNewAppointment(selectedDate)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Agendar
          </button>
        </div>
      </div>

      {/* VIEW: DIÁRIA */}
      {viewMode === 'diaria' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>Programação do Dia: {selectedDate}</span>
            <span className="text-slate-400 font-normal">
              {currentDayAppointments.length} agendamento(s) para esta data
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {timeSlots.map(time => {
              const apt = currentDayAppointments.find(a => a.time === time);
              return (
                <div
                  key={time}
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 transition-colors ${
                    apt ? 'bg-white hover:bg-slate-50/50' : 'bg-slate-50/30 hover:bg-slate-50'
                  }`}
                >
                  {/* Slot time */}
                  <div className="flex items-center gap-3 w-32 shrink-0 mb-2 md:mb-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {time}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">1 hora</span>
                  </div>

                  {/* Slot Content */}
                  {apt ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 items-center w-full">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{apt.patientName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                              apt.status
                            )}`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {apt.patientPhone}
                          </span>
                          <span className="text-indigo-600 font-medium">• {apt.type}</span>
                        </div>
                      </div>

                      {/* Notes / Financial */}
                      <div className="text-xs text-slate-600">
                        {apt.notes ? (
                          <p className="truncate max-w-xs italic text-slate-500">"{apt.notes}"</p>
                        ) : (
                          <span className="text-slate-400">Sem observações</span>
                        )}
                        {apt.financialAmount !== undefined && (
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            R$ {apt.financialAmount.toFixed(2)} ({apt.financialStatus || 'Pendente'})
                          </div>
                        )}
                      </div>

                      {/* Quick Actions (PRD: Alterar status, WhatsApp, Iniciar Atendimento) */}
                      <div className="flex items-center justify-start md:justify-end gap-2 flex-wrap">
                        {/* Status Switcher */}
                        <select
                          value={apt.status}
                          onChange={e => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                          className="text-[11px] font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer"
                        >
                          <option value="Agendado">Agendado</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="Atendido">Atendido</option>
                          <option value="Não compareceu">Não compareceu</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>

                        {/* WhatsApp Message */}
                        <button
                          onClick={() => handleOpenWhatsApp(apt)}
                          title="Enviar confirmação no WhatsApp"
                          className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden lg:inline">WhatsApp</span>
                        </button>

                        {/* Start Consultation (Doctor only / medical record) */}
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Atender</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between py-1">
                      <span className="text-xs text-slate-400 italic">Horário Livre</span>
                      <button
                        onClick={() => onOpenNewAppointment(selectedDate, time)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-dashed border-indigo-300 transition-colors cursor-pointer"
                      >
                        + Agendar Horário
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: SEMANAL */}
      {viewMode === 'semanal' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50 text-center py-3">
              {daysOfWeek.map(d => (
                <div
                  key={d.date}
                  onClick={() => {
                    setSelectedDate(d.date);
                    setViewMode('diaria');
                  }}
                  className={`cursor-pointer px-2 py-1 rounded-lg mx-2 transition-colors ${
                    selectedDate === d.date ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{d.label}</div>
                  <div className={`text-[11px] ${selectedDate === d.date ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {d.day}
                  </div>
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-100">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-5 divide-x divide-slate-100 min-h-[75px]">
                  {daysOfWeek.map(d => {
                    const apt = appointments.find(a => a.date === d.date && a.time === time);
                    return (
                      <div
                        key={d.date}
                        className={`p-2 transition-colors ${
                          apt ? 'bg-indigo-50/30' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-slate-400 mb-1">{time}</div>
                        {apt ? (
                          <div
                            onClick={() => handleStartConsultation(apt)}
                            className="bg-white p-2 rounded-lg border border-indigo-200/80 shadow-xs cursor-pointer hover:border-indigo-500 transition-all text-xs"
                          >
                            <div className="font-bold text-slate-800 truncate">{apt.patientName}</div>
                            <div className="text-[10px] text-indigo-600 font-medium truncate">{apt.type}</div>
                            <span
                              className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded border ${getStatusBadge(
                                apt.status
                              )}`}
                            >
                              {apt.status}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenNewAppointment(d.date, time)}
                            className="w-full h-8 text-[11px] text-slate-300 hover:text-indigo-600 hover:bg-indigo-50/50 rounded flex items-center justify-center transition-colors cursor-pointer"
                          >
                            + Vago
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MENSAL (Calendário Sintético) */}
      {viewMode === 'mensal' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800">Setembro de 2026</h2>
            <span className="text-xs text-slate-500">Clique em qualquer dia para ver a agenda diária</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(w => (
              <div key={w} className="font-bold text-slate-400 py-1">
                {w}
              </div>
            ))}

            {/* Empty slots for month start */}
            <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/40 text-slate-300">30</div>
            <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/40 text-slate-300">31</div>

            {/* Days 1 to 30 */}
            {Array.from({ length: 30 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-09-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
              const dayApts = appointments.filter(a => a.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setViewMode('diaria');
                  }}
                  className={`p-2 min-h-[60px] rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-800' : 'text-slate-700'}`}>
                    {dayNum}
                  </span>
                  {dayApts.length > 0 && (
                    <div className="mt-1">
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                        {dayApts.length} cons.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
