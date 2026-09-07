import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  UserCheck,
  Smartphone,
  Plus,
  Filter,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WhatsAppMessage, WhatsAppTriggerType } from '../../types';

export const WhatsAppView: React.FC = () => {
  const {
    whatsAppMessages,
    approveWhatsAppMessage,
    markWhatsAppMessageSent,
    createWhatsAppMessage,
    patients,
    currentUser
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showNewMessageModal, setShowNewMessageModal] = useState<boolean>(false);

  // New custom message state
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [triggerType, setTriggerType] = useState<WhatsAppTriggerType>('confirmacao_consulta');
  const [customTitle, setCustomTitle] = useState<string>('Confirmação de Horário de Atendimento');
  const [customContent, setCustomContent] = useState<string>(
    'Olá! Confirmamos sua consulta médica amanhã às 09:00 na Clínica Médica. Por favor responda com SIM para confirmar sua presença.'
  );
  const [isAutomated, setIsAutomated] = useState<boolean>(false);

  const filteredMessages = whatsAppMessages.filter(m => {
    if (statusFilter === 'pendente') return m.status === 'Pendente de Aprovação';
    if (statusFilter === 'pronto') return m.status === 'Pronto para Envio';
    if (statusFilter === 'enviado') return m.status === 'Enviado';
    return true;
  });

  const handleSendWhatsApp = (msg: WhatsAppMessage) => {
    const cleanPhone = msg.patientPhone.replace(/\D/g, '');
    const encoded = encodeURIComponent(msg.content);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    markWhatsAppMessageSent(msg.id);
  };

  const handleCreateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    createWhatsAppMessage({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone.replace(/\D/g, ''),
      triggerType,
      title: customTitle,
      content: customContent,
      isAutomated,
      scheduledFor: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    setShowNewMessageModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Comunicação via WhatsApp & Automação Híbrida
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmações, lembretes e orientações pré e pós-atendimento (PRD Seção 11)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 cursor-pointer"
          >
            <option value="todos">Todas as Mensagens</option>
            <option value="pendente">Pendentes de Aprovação</option>
            <option value="pronto">Prontas para Envio</option>
            <option value="enviado">Enviadas</option>
          </select>

          <button
            onClick={() => setShowNewMessageModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Mensagem
          </button>
        </div>
      </div>

      {/* Automação Híbrida Banner (PRD 11.2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 block text-sm">Disparos com 1 Clique</span>
            <p className="text-slate-500 mt-0.5 leading-relaxed">
              O sistema gera a mensagem personalizada e formata o link direto para o WhatsApp Web ou Desktop, permitindo envio imediato sem intermediários ou custo por disparo.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800 block text-sm">Fluxo de Aprovação Humana</span>
            <p className="text-slate-500 mt-0.5 leading-relaxed">
              A secretária ou o médico podem revisar e aprovar lembretes antes do envio real, garantindo segurança na comunicação clínica e médica.
            </p>
          </div>
        </div>
      </div>

      {/* Message Queue / List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
          <span>Fila de Comunicação ({filteredMessages.length})</span>
          <span className="text-slate-400 font-normal">
            As respostas dos pacientes continuam ocorrendo diretamente no WhatsApp normal.
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs italic">
              Nenhuma mensagem nesta categoria.
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div
                key={msg.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{msg.patientName}</span>
                    <span className="text-xs text-slate-400 font-normal">({msg.patientPhone})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        msg.status === 'Enviado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : msg.status === 'Pronto para Envio'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {msg.status}
                    </span>
                    {msg.isAutomated && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        Automático
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-700">{msg.title}</div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 font-normal">
                    "{msg.content}"
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-0.5">
                    <span>Programado para: {msg.scheduledFor}</span>
                    {msg.approvedBy && <span>• Aprovado por: {msg.approvedBy}</span>}
                    {msg.sentAt && <span>• Enviado em: {msg.sentAt}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                  {msg.status === 'Pendente de Aprovação' && (
                    <button
                      onClick={() => approveWhatsAppMessage(msg.id)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Aprovar Mensagem
                    </button>
                  )}

                  {msg.status !== 'Enviado' && (
                    <button
                      onClick={() => handleSendWhatsApp(msg)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Disparar no WhatsApp
                    </button>
                  )}

                  {msg.status === 'Enviado' && (
                    <button
                      onClick={() => handleSendWhatsApp(msg)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Reenviar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Preparar Nova Mensagem WhatsApp</h2>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMessage} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Paciente Destinatário *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                  required
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Finalidade do Aviso
                </label>
                <select
                  value={triggerType}
                  onChange={e => setTriggerType(e.target.value as WhatsAppTriggerType)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                >
                  <option value="confirmacao_consulta">Confirmação de Consulta</option>
                  <option value="lembrete_24h">Lembrete 24 Horas Antes</option>
                  <option value="orientacoes_pre">Orientações Pré-Consulta</option>
                  <option value="pos_atendimento">Orientações Pós-Atendimento</option>
                  <option value="personalizada">Mensagem Personalizada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Título Interno
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Texto da Mensagem *
                </label>
                <textarea
                  value={customContent}
                  onChange={e => setCustomContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoCheck"
                  checked={isAutomated}
                  onChange={e => setIsAutomated(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="autoCheck" className="text-xs text-slate-700 cursor-pointer">
                  Disparo imediato sem necessidade de aprovação posterior
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewMessageModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer shadow-xs"
                >
                  Salvar Mensagem na Fila
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
