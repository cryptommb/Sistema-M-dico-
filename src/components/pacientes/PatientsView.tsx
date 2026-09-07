import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';

interface PatientsViewProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointmentForPatient: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  onOpenNewPatient,
  onOpenNewAppointmentForPatient
}) => {
  const {
    patients,
    appointments,
    medicalRecords,
    transactions,
    whatsAppMessages,
    setActiveTab,
    setSelectedPatientId,
    setSelectedAppointmentIdForRecord
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activePatientId, setActivePatientId] = useState<string>(patients[0]?.id || '');

  // Filter patients by name, CPF or phone
  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.cpf.includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  const selectedPatient = patients.find(p => p.id === activePatientId) || filteredPatients[0];

  // History related to selected patient (PRD 7.2)
  const patientAppointments = appointments.filter(a => a.patientId === selectedPatient?.id);
  const patientRecords = medicalRecords.filter(r => r.patientId === selectedPatient?.id);
  const patientTransactions = transactions.filter(t => t.patientId === selectedPatient?.id);
  const patientMessages = whatsAppMessages.filter(m => m.patientId === selectedPatient?.id);

  const handleStartMedicalRecord = () => {
    if (!selectedPatient) return;
    setSelectedPatientId(selectedPatient.id);
    setSelectedAppointmentIdForRecord(null);
    setActiveTab('prontuario');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Cadastro e Histórico de Pacientes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visão 360° unificada: consultas, prontuários, financeiro, termos e mensagens
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, CPF ou tel..."
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>

          <button
            onClick={onOpenNewPatient}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 flex justify-between items-center">
            <span>Pacientes Cadastrados ({filteredPatients.length})</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
            {filteredPatients.map(pat => {
              const isSelected = selectedPatient?.id === pat.id;
              const hasAllergies = pat.allergies && pat.allergies.length > 0 && pat.allergies[0] !== 'Nenhuma relatada';

              return (
                <div
                  key={pat.id}
                  onClick={() => setActivePatientId(pat.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600 text-indigo-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-sm text-slate-800">{pat.name}</div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </div>

                  <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {pat.phone}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      CPF: {pat.cpf} • {pat.gender === 'F' ? 'Feminino' : 'Masculino'}
                    </div>
                  </div>

                  {hasAllergies && (
                    <div className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold">
                      <AlertCircle className="w-3 h-3" />
                      Alergia: {pat.allergies?.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient 360° Detail & History (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPatient ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              {/* Header profile info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      Tipo Sang.: {selectedPatient.bloodType || 'A+'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span>Nasc: {selectedPatient.birthDate}</span>
                    <span>CPF: {selectedPatient.cpf}</span>
                    <span>Tel: {selectedPatient.phone}</span>
                    {selectedPatient.email && <span>E-mail: {selectedPatient.email}</span>}
                  </div>
                  {selectedPatient.address && (
                    <div className="text-xs text-slate-400 mt-1">
                      Endereço: {selectedPatient.address}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenNewAppointmentForPatient(selectedPatient.id)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    + Agendar
                  </button>
                  <button
                    onClick={handleStartMedicalRecord}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Abrir Prontuário
                  </button>
                </div>
              </div>

              {/* Sub-Tabs / Categorias do Histórico (PRD 7.2) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Histórico Integrado do Paciente (PRD Seção 7.2)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Consultas e Agendamentos */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Consultas & Agendamentos ({patientAppointments.length})
                      </span>
                    </div>

                    {patientAppointments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Nenhum agendamento registrado.</p>
                    ) : (
                      <div className="space-y-2">
                        {patientAppointments.map(apt => (
                          <div key={apt.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-xs">
                            <div className="flex justify-between items-center font-semibold">
                              <span>{apt.date} às {apt.time}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                {apt.status}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px] mt-0.5">
                              {apt.type} com {apt.doctorName}
                            </div>
                            {apt.notes && <div className="text-slate-400 text-[10px] italic mt-1">"{apt.notes}"</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Prontuários Médicos */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Prontuários Registrados ({patientRecords.length})
                      </span>
                    </div>

                    {patientRecords.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Nenhum atendimento clínico em prontuário.</p>
                    ) : (
                      <div className="space-y-2">
                        {patientRecords.map(rec => (
                          <div key={rec.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-xs">
                            <div className="flex justify-between items-center font-semibold text-slate-800">
                              <span>{rec.templateUsed || 'Atendimento Clínico'}</span>
                              <span className="text-slate-400 text-[11px]">{rec.date}</span>
                            </div>
                            <div className="text-slate-600 text-[11px] mt-1 line-clamp-2">
                              {rec.diagnosticHypothesis}
                            </div>
                            <div className="text-indigo-700 text-[10px] font-medium mt-1">
                              Assinado por {rec.doctorName} ({rec.doctorCrm})
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Registros Financeiros Relacionados */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Registros Financeiros ({patientTransactions.length})
                      </span>
                    </div>

                    {patientTransactions.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Nenhuma movimentação associada.</p>
                    ) : (
                      <div className="space-y-2">
                        {patientTransactions.map(tx => (
                          <div key={tx.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-xs flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-slate-800">{tx.description}</div>
                              <div className="text-[11px] text-slate-400">
                                {tx.date} • {tx.paymentMethod} • {tx.destinationName}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900">
                                R$ {tx.amount.toFixed(2)}
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">
                                {tx.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mensagens WhatsApp Disparadas */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        Mensagens WhatsApp ({patientMessages.length})
                      </span>
                    </div>

                    {patientMessages.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Nenhuma mensagem disparada.</p>
                    ) : (
                      <div className="space-y-2">
                        {patientMessages.map(msg => (
                          <div key={msg.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-xs">
                            <div className="flex justify-between items-center font-semibold text-slate-800">
                              <span>{msg.title}</span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                                msg.status === 'Enviado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {msg.status}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-1 line-clamp-2">"{msg.content}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Termos & Aceites de Consentimento (PRD 14) */}
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Termos de Consentimento e Aceites Digitais (PRD Seção 14)
                    </span>
                  </div>

                  {selectedPatient.consents && selectedPatient.consents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPatient.consents.map(c => (
                        <div key={c.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-slate-800">{c.termTitle}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Versão {c.version} • Aceito em: {c.acceptedAt} • Dispositivo: {c.ipOrDevice}
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Aceite Confirmado
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Nenhum termo de consentimento aceito registrado para este paciente ainda.
                    </p>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              Selecione um paciente na lista para visualizar seu histórico completo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
