import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentType } from '../../types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  defaultTime
}) => {
  const { patients, currentUser, availableUsers, addAppointment } = useApp();

  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState<string>(
    currentUser.role === 'medico' ? currentUser.id : availableUsers.find(u => u.role === 'medico')?.id || availableUsers[0]?.id || ''
  );
  const [date, setDate] = useState<string>(defaultDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(defaultTime || '09:00');
  const [type, setType] = useState<AppointmentType>('Primeira Consulta');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [notes, setNotes] = useState<string>('');
  const [registerFinancial, setRegisterFinancial] = useState<boolean>(true);
  const [financialAmount, setFinancialAmount] = useState<number>(350.00);
  const [financialStatus, setFinancialStatus] = useState<'Pendente' | 'Pago' | 'Cortesia'>('Pendente');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = patients.find(p => p.id === patientId);
    const selectedDoctor = availableUsers.find(u => u.id === doctorId);

    if (!selectedPatient || !selectedDoctor) return;

    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date,
      time,
      durationMinutes,
      type,
      status: 'Agendado', // Fluxo do PRD 5.1: Cria como Agendado, independente de pagamento
      notes,
      financialStatus: registerFinancial ? financialStatus : undefined,
      financialAmount: registerFinancial ? financialAmount : 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Novo Agendamento</h2>
              <p className="text-xs text-slate-500">Agende consultas de forma rápida e simplificada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Paciente *
            </label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
              required
            >
              {patients.map(pat => (
                <option key={pat.id} value={pat.id}>
                  {pat.name} — {pat.phone} (CPF: {pat.cpf})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Profissional Médico *
              </label>
              <select
                value={doctorId}
                onChange={e => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {availableUsers.filter(u => u.role === 'medico').map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.crm})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tipo de Atendimento
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as AppointmentType)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Primeira Consulta">Primeira Consulta</option>
                <option value="Retorno">Retorno</option>
                <option value="Procedimento">Procedimento</option>
                <option value="Exame">Exame</option>
                <option value="Urgência">Urgência</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Data *
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Horário *
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Duração (min)
              </label>
              <select
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>1 hora (padrão)</option>
                <option value={90}>1h 30 min</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Observações Opcionais
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Paciente solicitou orientações para exames em jejum..."
              rows={2}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Registro financeiro opcional da consulta (PRD Seção 9.3) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                Registro Financeiro Operacional (Opcional)
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={registerFinancial}
                  onChange={e => setRegisterFinancial(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Ativar registro
              </label>
            </div>

            {registerFinancial && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={financialAmount}
                    onChange={e => setFinancialAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Situação Inicial</label>
                  <select
                    value={financialStatus}
                    onChange={e => setFinancialStatus(e.target.value as 'Pendente' | 'Pago' | 'Cortesia')}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Cortesia">Cortesia (Gratuito)</option>
                  </select>
                </div>
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-2">
              * O agendamento é criado imediatamente e não depende de pagamento.
            </p>
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
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
