import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AgendaView } from './components/agenda/AgendaView';
import { PatientsView } from './components/pacientes/PatientsView';
import { MedicalRecordsView } from './components/prontuario/MedicalRecordsView';
import { FinancialView } from './components/financeiro/FinancialView';
import { WhatsAppView } from './components/comunicacao/WhatsAppView';
import { InventoryView } from './components/estoque/InventoryView';
import { ConsentsView } from './components/termos/ConsentsView';

import { NewAppointmentModal } from './components/modals/NewAppointmentModal';
import { NewPatientModal } from './components/modals/NewPatientModal';
import { CashAuditModal } from './components/modals/CashAuditModal';
import { InternalTransferModal } from './components/modals/InternalTransferModal';
import { NewTransactionModal } from './components/modals/NewTransactionModal';

const AppContent: React.FC = () => {
  const { activeTab, setSelectedPatientId } = useApp();

  // Modals state
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [appointmentDefaultDate, setAppointmentDefaultDate] = useState<string | undefined>();
  const [appointmentDefaultTime, setAppointmentDefaultTime] = useState<string | undefined>();

  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isCashAuditOpen, setIsCashAuditOpen] = useState(false);
  const [isInternalTransferOpen, setIsInternalTransferOpen] = useState(false);
  const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

  const handleOpenNewAppointment = (defaultDate?: string, defaultTime?: string) => {
    setAppointmentDefaultDate(defaultDate);
    setAppointmentDefaultTime(defaultTime);
    setIsNewAppointmentOpen(true);
  };

  const handleOpenNewAppointmentForPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsNewAppointmentOpen(true);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Dark theme */}
      <Sidebar />

      {/* Main Content Area with Header & Footer */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header onOpenNewAppointment={() => handleOpenNewAppointment()} />

        <main className="flex-1 p-6 overflow-y-auto min-w-0 bg-slate-50/60">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'agenda' && (
              <AgendaView onOpenNewAppointment={handleOpenNewAppointment} />
            )}

            {activeTab === 'pacientes' && (
              <PatientsView
                onOpenNewPatient={() => setIsNewPatientOpen(true)}
                onOpenNewAppointmentForPatient={handleOpenNewAppointmentForPatient}
              />
            )}

            {activeTab === 'prontuario' && <MedicalRecordsView />}

            {activeTab === 'financeiro' && (
              <FinancialView
                onOpenNewTransaction={() => setIsNewTransactionOpen(true)}
                onOpenCashAudit={() => setIsCashAuditOpen(true)}
                onOpenInternalTransfer={() => setIsInternalTransferOpen(true)}
              />
            )}

            {activeTab === 'whatsapp' && <WhatsAppView />}

            {activeTab === 'estoque' && <InventoryView />}

            {activeTab === 'termos' && <ConsentsView />}
          </div>
        </main>

        {/* Footer Status Bar */}
        <footer className="h-9 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-500 font-medium uppercase tracking-widest shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Versão 1.0.4-PRO • Servidor Operando</span>
          </div>
          <div className="hidden sm:block">Sincronizado: Hoje, 2026-09-07</div>
          <div>CFM / LGPD Compliance • ID: CLINIC-01</div>
        </footer>
      </div>

      {/* Global Modals */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        defaultDate={appointmentDefaultDate}
        defaultTime={appointmentDefaultTime}
      />

      <NewPatientModal
        isOpen={isNewPatientOpen}
        onClose={() => setIsNewPatientOpen(false)}
      />

      <CashAuditModal
        isOpen={isCashAuditOpen}
        onClose={() => setIsCashAuditOpen(false)}
      />

      <InternalTransferModal
        isOpen={isInternalTransferOpen}
        onClose={() => setIsInternalTransferOpen(false)}
      />

      <NewTransactionModal
        isOpen={isNewTransactionOpen}
        onClose={() => setIsNewTransactionOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
