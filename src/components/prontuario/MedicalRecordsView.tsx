import React, { useState } from 'react';
import {
  FileText,
  Save,
  CheckCircle2,
  Printer,
  Sparkles,
  User,
  Calendar,
  Clock,
  Package,
  AlertTriangle,
  History,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicalRecordTemplate } from '../../types';

export const MedicalRecordsView: React.FC = () => {
  const {
    patients,
    appointments,
    templates,
    medicalRecords,
    currentUser,
    procedureKits,
    selectedPatientId,
    setSelectedPatientId,
    selectedAppointmentIdForRecord,
    setSelectedAppointmentIdForRecord,
    addMedicalRecord,
    consumeKit
  } = useApp();

  const [activePatientId, setActivePatientId] = useState<string>(
    selectedPatientId || patients[0]?.id || ''
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [selectedKitId, setSelectedKitId] = useState<string>('');

  // Structured fields
  const [chiefComplaint, setChiefComplaint] = useState(templates[0]?.chiefComplaint || '');
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState(templates[0]?.historyOfPresentIllness || '');
  const [physicalExam, setPhysicalExam] = useState(templates[0]?.physicalExam || '');
  const [diagnosticHypothesis, setDiagnosticHypothesis] = useState(templates[0]?.diagnosticHypothesis || '');
  const [cid10, setCid10] = useState('I10');
  const [prescriptionAndPlan, setPrescriptionAndPlan] = useState(templates[0]?.prescriptionAndPlan || '');
  const [notes, setNotes] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const selectedPatient = patients.find(p => p.id === activePatientId) || patients[0];
  const patientPastRecords = medicalRecords.filter(r => r.patientId === selectedPatient?.id);

  // Apply template
  const handleApplyTemplate = (tpl: MedicalRecordTemplate) => {
    setSelectedTemplateId(tpl.id);
    setChiefComplaint(tpl.chiefComplaint);
    setHistoryOfPresentIllness(tpl.historyOfPresentIllness);
    setPhysicalExam(tpl.physicalExam);
    setDiagnosticHypothesis(tpl.diagnosticHypothesis);
    setPrescriptionAndPlan(tpl.prescriptionAndPlan);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const tpl = templates.find(t => t.id === selectedTemplateId);

    // Save record
    addMedicalRecord({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      appointmentId: selectedAppointmentIdForRecord || undefined,
      doctorId: currentUser.id,
      templateUsed: tpl?.title || 'Atendimento Livre',
      chiefComplaint,
      historyOfPresentIllness,
      physicalExam,
      diagnosticHypothesis,
      cid10,
      prescriptionAndPlan,
      usedKits: selectedKitId ? [selectedKitId] : [],
      notes
    });

    // If kit selected, consume items from stock (PRD 13.2)
    if (selectedKitId) {
      consumeKit(selectedKitId, selectedPatient.name);
    }

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Warning for Secretary Role (PRD 3.2: restrições ao prontuário clínico) */}
      {currentUser.role === 'secretaria' && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block">Acesso em Modo Administrativo (Perfil Secretária)</span>
            <span>
              Conforme as diretrizes do CRM e PRD Seção 3.2, o registro e a edição de condutas clínicas são privativos do médico responsável. Você pode visualizar informações administrativas.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Prontuário Eletrônico do Paciente
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modelos estruturados, anamnese, conduta, prescrição e controle de insumos
          </p>
        </div>

        {/* Patient Selector */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Paciente em Atendimento</div>
            <div className="text-xs font-bold text-slate-800">{selectedPatient?.name}</div>
          </div>

          <select
            value={activePatientId}
            onChange={e => {
              setActivePatientId(e.target.value);
              setSelectedPatientId(e.target.value);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.cpf})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace: Left Editor + Right Patient History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* Template Selector Bar (PRD Seção 8.2) */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Modelos de Prontuário Disponíveis
              </span>
              <span className="text-[11px] text-slate-400">Clique para carregar a estrutura</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {templates.map(tpl => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedTemplateId === tpl.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveRecord} className="space-y-5">
            {/* Queixa Principal */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                1. Queixa Principal (QP)
              </label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="Motivo principal da consulta relatado pelo paciente..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* História da Moléstia Atual / Anamnese */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                2. Anamnese & História da Moléstia Atual (HMA)
              </label>
              <textarea
                value={historyOfPresentIllness}
                onChange={e => setHistoryOfPresentIllness(e.target.value)}
                rows={3}
                placeholder="Evolução cronológica dos sintomas, antecedentes patológicos e medicações em uso..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Exame Físico */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                3. Exame Físico / Sinais Vitais
              </label>
              <textarea
                value={physicalExam}
                onChange={e => setPhysicalExam(e.target.value)}
                rows={3}
                placeholder="PA, FC, SpO2, Ausculta cardíaca, pulmonar e exame segmentar..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Hipótese Diagnóstica e CID-10 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  4. Hipótese Diagnóstica
                </label>
                <input
                  type="text"
                  value={diagnosticHypothesis}
                  onChange={e => setDiagnosticHypothesis(e.target.value)}
                  placeholder="Diagnóstico clínico ou sindrômico..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Código CID-10
                </label>
                <input
                  type="text"
                  value={cid10}
                  onChange={e => setCid10(e.target.value)}
                  placeholder="Ex: I10, Z00.0"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                />
              </div>
            </div>

            {/* Conduta Médica e Prescrição */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                5. Conduta Terapêutica & Prescrição Médica
              </label>
              <textarea
                value={prescriptionAndPlan}
                onChange={e => setPrescriptionAndPlan(e.target.value)}
                rows={4}
                placeholder="Medicamentos prescritos, posologia, solicitações de exames e orientações de retorno..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Baixa de Kit de Materiais / Estoque (PRD Seção 13.2) */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-indigo-600" />
                Vincular e Dar Baixa em Kit de Procedimento (PRD 13.2)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <select
                  value={selectedKitId}
                  onChange={e => setSelectedKitId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                >
                  <option value="">Nenhum kit utilizado neste atendimento</option>
                  {procedureKits.map(kit => (
                    <option key={kit.id} value={kit.id}>
                      {kit.name} ({kit.items.length} itens)
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500">
                  * Ao salvar o prontuário, os itens do kit (ampolas, agulhas, seringas) serão debitados automaticamente do estoque.
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Responsável: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.crm || 'CRM Ativo'})
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Visualizar / Imprimir
                </button>

                <button
                  type="submit"
                  disabled={currentUser.role === 'secretaria'}
                  className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer ${
                    currentUser.role === 'secretaria'
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Salvar Prontuário
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Sidebar: Historical Records of this Patient (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              Atendimentos Anteriores ({patientPastRecords.length})
            </h3>

            {patientPastRecords.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 italic">
                Nenhum prontuário registrado anteriormente para {selectedPatient?.name}.
              </div>
            ) : (
              <div className="space-y-3">
                {patientPastRecords.map(rec => (
                  <div
                    key={rec.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>{rec.templateUsed || 'Consulta'}</span>
                      <span className="text-[11px] text-slate-400">{rec.date} às {rec.time}</span>
                    </div>

                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-700">QP: </span>
                      {rec.chiefComplaint}
                    </div>

                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-700">HD: </span>
                      {rec.diagnosticHypothesis} {rec.cid10 && `(${rec.cid10})`}
                    </div>

                    <div className="pt-1 border-t border-slate-200/60 text-[10px] text-indigo-700 font-medium">
                      Médico: {rec.doctorName} - {rec.doctorCrm}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Success Toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <div>
            <div>Prontuário salvo com sucesso!</div>
            <div className="text-emerald-200 font-normal text-[11px]">
              {selectedKitId ? 'Baixa de kit de materiais efetuada no estoque.' : 'Atendimento concluído.'}
            </div>
          </div>
        </div>
      )}

      {/* Printable Prescription Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 border border-slate-200 space-y-6">
            <div className="border-b border-slate-200 pb-4 text-center">
              <h2 className="text-base font-bold text-slate-900">CLÍNICA MÉDICA INTEGRADA</h2>
              <p className="text-xs text-slate-500">Receituário e Prescrição Médica</p>
            </div>

            <div className="text-xs space-y-1">
              <div><strong>Paciente:</strong> {selectedPatient?.name}</div>
              <div><strong>CPF:</strong> {selectedPatient?.cpf}</div>
              <div><strong>Data do Atendimento:</strong> {new Date().toLocaleDateString('pt-BR')}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs whitespace-pre-wrap">
              {prescriptionAndPlan || 'Sem prescrição preenchida.'}
            </div>

            <div className="pt-8 text-center border-t border-slate-100">
              <div className="w-48 mx-auto border-b border-slate-400 mb-1"></div>
              <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500">{currentUser.crm || 'CRM Médico'}</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
              >
                Imprimir Documento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
