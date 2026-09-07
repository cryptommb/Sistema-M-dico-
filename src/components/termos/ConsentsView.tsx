import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  Clock,
  Smartphone,
  Plus,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConsentsView: React.FC = () => {
  const { patients, addPatientConsent, currentUser } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState<string>(
    'Consentimento Informado Geral de Atendimento e Tratamento de Dados (LGPD)'
  );
  const [termVersion, setTermVersion] = useState<string>('v2.1');
  const [deviceChannel, setDeviceChannel] = useState<string>('Totem Recepção Consultório');
  const [showToast, setShowToast] = useState<boolean>(false);

  const termTemplates = [
    {
      title: 'Consentimento Informado Geral de Atendimento e Tratamento de Dados (LGPD)',
      version: 'v2.1',
      summary:
        'Autorização para armazenamento de histórico de saúde em prontuário eletrônico e comunicações essenciais sobre agendamentos de acordo com a Lei 13.709/2018.'
    },
    {
      title: 'Termo de Consentimento para Procedimentos Injetáveis e Estéticos',
      version: 'v1.4',
      summary:
        'Esclarecimento sobre riscos previsíveis, cuidados pós-aplicação de toxina/preenchedores e orientações de repouso e retorno clínico.'
    },
    {
      title: 'Termo de Consentimento para Pequena Cirurgia / Biópsia Cutânea',
      version: 'v1.0',
      summary:
        'Orientações sobre anestesia local infiltrativa, incisão cirúrgica, pontos de sutura e cuidados com curativos.'
    },
    {
      title: 'Termo de Consentimento para Eletrocardiograma e Exames Diagnósticos',
      version: 'v1.2',
      summary:
        'Autorização para colocação de eletrodos precordiais e realização de exames gráficos na clínica.'
    }
  ];

  const handleRegisterConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    addPatientConsent(selectedPatientId, selectedTerm, termVersion, deviceChannel);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Consents history across all patients
  const allConsents = patients.flatMap(p =>
    (p.consents || []).map(c => ({
      ...c,
      patientName: p.name,
      patientPhone: p.phone,
      patientCpf: p.cpf
    }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Termos de Consentimento e Aceites Digitais
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro simplificado de aceite com versão, data/hora e confirmação do paciente (PRD Seção 14)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Register Consent Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            Coletar / Registrar Novo Aceite
          </h2>

          <form onSubmit={handleRegisterConsent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Paciente *
              </label>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                required
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (CPF: {p.cpf})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Modelo de Termo *
              </label>
              <select
                value={selectedTerm}
                onChange={e => {
                  setSelectedTerm(e.target.value);
                  const tpl = termTemplates.find(t => t.title === e.target.value);
                  if (tpl) setTermVersion(tpl.version);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                required
              >
                {termTemplates.map((t, idx) => (
                  <option key={idx} value={t.title}>
                    {t.title} ({t.version})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Canal / Dispositivo de Coleta
              </label>
              <select
                value={deviceChannel}
                onChange={e => setDeviceChannel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
              >
                <option value="Totem Recepção Consultório">Totem na Recepção do Consultório</option>
                <option value="Tablet Consultório Médico">Tablet no Consultório do Médico</option>
                <option value="Dispositivo Móvel - Link Seguro">Dispositivo Móvel do Paciente (Link Seguro)</option>
                <option value="Documento Físico Assinado e Digitalizado">Documento Físico Arquivado</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div>
                <strong>Responsável pelo registro:</strong> {currentUser.name}
              </div>
              <div>
                <strong>Registro temporal:</strong> Data e horário serão gerados com carimbo no ato do registro.
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar Aceite do Termo
            </button>
          </form>
        </div>

        {/* Right: History of Signed Terms (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center">
            <span>Histórico Geral de Aceites ({allConsents.length})</span>
            <span className="text-slate-400 font-normal">Auditoria e conformidade</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {allConsents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs italic">
                Nenhum termo registrado ainda.
              </div>
            ) : (
              allConsents.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 text-xs space-y-1 transition-colors">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{item.patientName}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                      Aceite Válido
                    </span>
                  </div>

                  <div className="text-slate-700 font-medium">{item.termTitle}</div>

                  <div className="text-slate-400 text-[11px] flex flex-wrap items-center gap-3 pt-0.5">
                    <span>Versão: {item.version}</span>
                    <span>•</span>
                    <span>Aceito em: {item.acceptedAt}</span>
                    <span>•</span>
                    <span>Canal: {item.ipOrDevice}</span>
                    <span>•</span>
                    <span>Médico: {item.doctorResponsible}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>Aceite de termo registrado e vinculado ao paciente com sucesso!</div>
        </div>
      )}
    </div>
  );
};
