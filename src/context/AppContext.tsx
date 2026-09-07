import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Patient,
  Appointment,
  MedicalRecord,
  MedicalRecordTemplate,
  BankAccount,
  FinancialTransaction,
  BankStatementItem,
  CashDrawerEntry,
  CashDrawerAudit,
  WhatsAppMessage,
  StockItem,
  ProcedureKit,
  ReconciliationSuggestion,
  AppointmentStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_RECORD_TEMPLATES,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CASH_DRAWER_ENTRIES,
  INITIAL_CASH_DRAWER_AUDITS,
  INITIAL_TRANSACTIONS,
  INITIAL_BANK_STATEMENTS,
  INITIAL_STOCK_ITEMS,
  INITIAL_PROCEDURE_KITS,
  INITIAL_WHATSAPP_MESSAGES
} from '../data/initialData';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  availableUsers: UserProfile[];
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedAppointmentIdForRecord: string | null;
  setSelectedAppointmentIdForRecord: (id: string | null) => void;
  
  // Entities
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  templates: MedicalRecordTemplate[];
  bankAccounts: BankAccount[];
  transactions: FinancialTransaction[];
  bankStatements: BankStatementItem[];
  cashDrawerEntries: CashDrawerEntry[];
  cashDrawerAudits: CashDrawerAudit[];
  whatsAppMessages: WhatsAppMessage[];
  stockItems: StockItem[];
  procedureKits: ProcedureKit[];

  // Computed Financials
  totalBankBalance: number;
  cashDrawerBalance: number;
  totalAvailability: number;
  totalMonthlyRevenue: number;
  totalMonthlyExpense: number;
  netResult: number;

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'consents'>) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;

  addMedicalRecord: (rec: Omit<MedicalRecord, 'id' | 'doctorName' | 'doctorCrm' | 'date' | 'time'>) => MedicalRecord;
  addTemplate: (tpl: Omit<MedicalRecordTemplate, 'id'>) => void;

  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'createdAt'>) => FinancialTransaction;
  updateTransaction: (id: string, data: Partial<FinancialTransaction>) => void;

  addBankAccount: (account: Omit<BankAccount, 'id' | 'balance'>) => void;
  addBankStatementItem: (item: Omit<BankStatementItem, 'id' | 'reconciled'>) => void;
  
  reconcileStatementWithTransaction: (statementId: string, transactionId: string) => void;
  reconciliationSuggestions: ReconciliationSuggestion[];
  
  addCashDrawerEntry: (entry: Omit<CashDrawerEntry, 'id' | 'date' | 'time' | 'responsibleUser'>) => void;
  performCashAudit: (countedBalance: number, justification?: string, createAdjustment?: boolean) => CashDrawerAudit;
  transferBetweenBankAndCash: (direction: 'banco_para_caixa' | 'caixa_para_banco', bankAccountId: string, amount: number, description: string) => void;

  createWhatsAppMessage: (msg: Omit<WhatsAppMessage, 'id' | 'status'>) => WhatsAppMessage;
  approveWhatsAppMessage: (id: string) => void;
  markWhatsAppMessageSent: (id: string) => void;
  
  consumeKit: (kitId: string, patientName?: string) => void;
  updateStockQuantity: (itemId: string, newQuantity: number) => void;
  addStockItem: (item: Omit<StockItem, 'id'>) => void;

  addPatientConsent: (patientId: string, termTitle: string, version: string, ipOrDevice?: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'sistema_medico_data_v1';

function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<string>('agenda');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedAppointmentIdForRecord, setSelectedAppointmentIdForRecord] = useState<string | null>(null);

  // States
  const [patients, setPatients] = useState<Patient[]>(() => getInitialState('patients', INITIAL_PATIENTS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getInitialState('appointments', INITIAL_APPOINTMENTS));
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => getInitialState('records', INITIAL_MEDICAL_RECORDS));
  const [templates, setTemplates] = useState<MedicalRecordTemplate[]>(() => getInitialState('templates', INITIAL_RECORD_TEMPLATES));
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => getInitialState('bank_accounts', INITIAL_BANK_ACCOUNTS));
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => getInitialState('transactions', INITIAL_TRANSACTIONS));
  const [bankStatements, setBankStatements] = useState<BankStatementItem[]>(() => getInitialState('bank_statements', INITIAL_BANK_STATEMENTS));
  const [cashDrawerEntries, setCashDrawerEntries] = useState<CashDrawerEntry[]>(() => getInitialState('cash_entries', INITIAL_CASH_DRAWER_ENTRIES));
  const [cashDrawerAudits, setCashDrawerAudits] = useState<CashDrawerAudit[]>(() => getInitialState('cash_audits', INITIAL_CASH_DRAWER_AUDITS));
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(() => getInitialState('whatsapp_messages', INITIAL_WHATSAPP_MESSAGES));
  const [stockItems, setStockItems] = useState<StockItem[]>(() => getInitialState('stock_items', INITIAL_STOCK_ITEMS));
  const [procedureKits, setProcedureKits] = useState<ProcedureKit[]>(() => getInitialState('procedure_kits', INITIAL_PROCEDURE_KITS));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_patients`, JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_appointments`, JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_records`, JSON.stringify(medicalRecords));
  }, [medicalRecords]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_bank_accounts`, JSON.stringify(bankAccounts));
  }, [bankAccounts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_transactions`, JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_bank_statements`, JSON.stringify(bankStatements));
  }, [bankStatements]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_cash_entries`, JSON.stringify(cashDrawerEntries));
  }, [cashDrawerEntries]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_cash_audits`, JSON.stringify(cashDrawerAudits));
  }, [cashDrawerAudits]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_whatsapp_messages`, JSON.stringify(whatsAppMessages));
  }, [whatsAppMessages]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}_stock_items`, JSON.stringify(stockItems));
  }, [stockItems]);

  // Computed Financials (PRD Section 9.9: Disponibilidade Total = saldos bancários + caixa físico)
  const totalBankBalance = bankAccounts.reduce((acc, b) => acc + b.balance, 0);

  const cashDrawerBalance = cashDrawerEntries.reduce((acc, entry) => {
    if (entry.type === 'entrada') return acc + entry.amount;
    if (entry.type === 'saida') return acc - entry.amount;
    if (entry.type === 'ajuste') return acc + entry.amount;
    if (entry.type === 'transferencia') return acc + entry.amount; // can be negative or positive
    return acc;
  }, 0);

  const totalAvailability = totalBankBalance + cashDrawerBalance;

  const totalMonthlyRevenue = transactions
    .filter(t => t.type === 'receita' && t.status === 'Pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalMonthlyExpense = transactions
    .filter(t => t.type === 'despesa' && t.status === 'Pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const netResult = totalMonthlyRevenue - totalMonthlyExpense;

  // Assisted Bank Reconciliation (PRD Section 9.5)
  const reconciliationSuggestions: ReconciliationSuggestion[] = React.useMemo(() => {
    const unreconciledStatements = bankStatements.filter(s => !s.reconciled);
    const unreconciledTransactions = transactions.filter(t => !t.reconciled && t.status === 'Pago');

    const list: ReconciliationSuggestion[] = [];

    unreconciledStatements.forEach(stmt => {
      // Find matching transaction by absolute amount and date / name
      const stmtAbs = Math.abs(stmt.amount);
      const isCredit = stmt.amount > 0;

      const match = unreconciledTransactions.find(tx => {
        const typeMatches = isCredit ? tx.type === 'receita' : tx.type === 'despesa';
        const amountMatches = Math.abs(tx.amount - stmtAbs) < 0.01;
        return typeMatches && amountMatches;
      });

      if (match) {
        list.push({
          id: `sug_${stmt.id}_${match.id}`,
          statementItem: stmt,
          matchedTransaction: match,
          confidence: 'Alta',
          reason: `Valor idêntico (R$ ${stmtAbs.toFixed(2)}) e tipo compatível (${isCredit ? 'Recebimento' : 'Pagamento'}).`
        });
      } else {
        // Look for matching appointment
        const aptMatch = appointments.find(apt => 
          apt.financialAmount && Math.abs(apt.financialAmount - stmtAbs) < 0.01
        );
        if (aptMatch) {
          list.push({
            id: `sug_apt_${stmt.id}_${aptMatch.id}`,
            statementItem: stmt,
            matchedAppointment: aptMatch,
            confidence: 'Média',
            reason: `Valor de R$ ${stmtAbs.toFixed(2)} compatível com consulta de ${aptMatch.patientName}.`
          });
        } else {
          list.push({
            id: `sug_manual_${stmt.id}`,
            statementItem: stmt,
            confidence: 'Manual',
            reason: 'Lançamento bancário sem correspondência automática exata. Requer conferência manual.'
          });
        }
      }
    });

    return list;
  }, [bankStatements, transactions, appointments]);

  // Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'consents'>) => {
    const newPat: Patient = {
      ...patientData,
      id: `pat_${Date.now()}`,
      consents: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPat, ...prev]);
    return newPat;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAppointments(prev => [newApt, ...prev]);

    // Automatically prepare a WhatsApp reminder or confirmation message (PRD Section 11)
    const newMsg: WhatsAppMessage = {
      id: `msg_${Date.now()}`,
      patientId: aptData.patientId,
      patientName: aptData.patientName,
      patientPhone: aptData.patientPhone.replace(/\D/g, ''),
      appointmentId: newApt.id,
      triggerType: 'confirmacao_consulta',
      title: `Confirmação de Consulta - ${aptData.date} às ${aptData.time}`,
      content: `Olá ${aptData.patientName}! Sua consulta com ${aptData.doctorName} foi agendada para ${aptData.date} às ${aptData.time}. Por favor, responda SIM para confirmar sua presença.`,
      status: 'Pendente de Aprovação',
      isAutomated: false,
      scheduledFor: `${aptData.date} 08:00`
    };
    setWhatsAppMessages(prev => [newMsg, ...prev]);

    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const addMedicalRecord = (recData: Omit<MedicalRecord, 'id' | 'doctorName' | 'doctorCrm' | 'date' | 'time'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const newRecord: MedicalRecord = {
      ...recData,
      id: `rec_${Date.now()}`,
      doctorName: currentUser.name,
      doctorCrm: currentUser.crm || 'CRM/SP 148.920',
      date: dateStr,
      time: timeStr
    };

    setMedicalRecords(prev => [newRecord, ...prev]);

    // If linked to an appointment, mark appointment as Atendido (PRD Section 5.2)
    if (recData.appointmentId) {
      updateAppointmentStatus(recData.appointmentId, 'Atendido');
    }

    return newRecord;
  };

  const addTemplate = (tplData: Omit<MedicalRecordTemplate, 'id'>) => {
    const newTpl: MedicalRecordTemplate = {
      ...tplData,
      id: `tpl_${Date.now()}`
    };
    setTemplates(prev => [...prev, newTpl]);
  };

  const addTransaction = (txData: Omit<FinancialTransaction, 'id' | 'createdAt'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: `tx_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTransactions(prev => [newTx, ...prev]);

    // If destination is bank, update bank account balance if paid
    if (newTx.status === 'Pago') {
      if (newTx.destination === 'caixa_fisico') {
        const entry: CashDrawerEntry = {
          id: `cde_${Date.now()}`,
          type: newTx.type === 'receita' ? 'entrada' : 'saida',
          amount: newTx.amount,
          description: newTx.description,
          responsibleUser: currentUser.name,
          date: newTx.date,
          time: new Date().toTimeString().slice(0, 5),
          relatedTransactionId: newTx.id
        };
        setCashDrawerEntries(prev => [entry, ...prev]);
      } else {
        // update bank balance
        setBankAccounts(prev => prev.map(b => {
          if (b.id === newTx.destination) {
            const diff = newTx.type === 'receita' ? newTx.amount : -newTx.amount;
            return { ...b, balance: b.balance + diff };
          }
          return b;
        }));
      }
    }

    return newTx;
  };

  const updateTransaction = (id: string, data: Partial<FinancialTransaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const addBankAccount = (accData: Omit<BankAccount, 'id' | 'balance'>) => {
    const newAcc: BankAccount = {
      ...accData,
      id: `bank_${Date.now()}`,
      balance: 0.00
    };
    setBankAccounts(prev => [...prev, newAcc]);
  };

  const addBankStatementItem = (itemData: Omit<BankStatementItem, 'id' | 'reconciled'>) => {
    const newItem: BankStatementItem = {
      ...itemData,
      id: `stmt_${Date.now()}`,
      reconciled: false
    };
    setBankStatements(prev => [newItem, ...prev]);
  };

  const reconcileStatementWithTransaction = (statementId: string, transactionId: string) => {
    setBankStatements(prev => prev.map(s => s.id === statementId ? { ...s, reconciled: true, reconciledWithTransactionId: transactionId } : s));
    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, reconciled: true } : t));
  };

  const addCashDrawerEntry = (entryData: Omit<CashDrawerEntry, 'id' | 'date' | 'time' | 'responsibleUser'>) => {
    const now = new Date();
    const entry: CashDrawerEntry = {
      ...entryData,
      id: `cde_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      responsibleUser: currentUser.name
    };
    setCashDrawerEntries(prev => [entry, ...prev]);
  };

  const performCashAudit = (countedBalance: number, justification?: string, createAdjustment?: boolean) => {
    const now = new Date();
    const expected = cashDrawerBalance;
    const diff = countedBalance - expected;

    const audit: CashDrawerAudit = {
      id: `cda_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      responsibleUser: currentUser.name,
      expectedBalance: expected,
      countedBalance: countedBalance,
      difference: diff,
      justification: justification || 'Conferência física realizada',
      adjustmentCreated: !!createAdjustment
    };

    setCashDrawerAudits(prev => [audit, ...prev]);

    if (createAdjustment && Math.abs(diff) > 0.001) {
      const adjustmentEntry: CashDrawerEntry = {
        id: `cde_adj_${Date.now()}`,
        type: 'ajuste',
        amount: diff,
        description: `Ajuste de conferência física de caixa (${diff > 0 ? '+' : ''}R$ ${diff.toFixed(2)}) - ${justification || 'Regularização'}`,
        responsibleUser: currentUser.name,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5)
      };
      setCashDrawerEntries(prev => [adjustmentEntry, ...prev]);
    }

    return audit;
  };

  // Internal Transfer (PRD Section 9.8): Transferências entre banco e caixa físico não geram receita nem despesa
  const transferBetweenBankAndCash = (
    direction: 'banco_para_caixa' | 'caixa_para_banco',
    bankAccountId: string,
    amount: number,
    description: string
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const bank = bankAccounts.find(b => b.id === bankAccountId);
    const bankName = bank?.bankName || 'Conta Bancária';

    if (direction === 'caixa_para_banco') {
      // Depósito de dinheiro físico no banco
      // 1. Reduz caixa físico
      setCashDrawerEntries(prev => [
        {
          id: `cde_tr_${Date.now()}`,
          type: 'transferencia',
          amount: -amount,
          description: `Transferência Interna: Depósito de caixa físico para ${bankName} (${description})`,
          responsibleUser: currentUser.name,
          date: dateStr,
          time: timeStr
        },
        ...prev
      ]);
      // 2. Aumenta banco
      setBankAccounts(prev => prev.map(b => b.id === bankAccountId ? { ...b, balance: b.balance + amount } : b));
      // 3. Extrato bancário
      setBankStatements(prev => [
        {
          id: `stmt_tr_${Date.now()}`,
          bankAccountId,
          date: dateStr,
          description: `DEP DINHEIRO CAIXA FISICO - ${description.toUpperCase()}`,
          amount: amount,
          payerOrReceiver: 'Caixa Físico Consultório',
          reconciled: true
        },
        ...prev
      ]);
    } else {
      // Saque bancário para suprimento de caixa físico
      // 1. Aumenta caixa físico
      setCashDrawerEntries(prev => [
        {
          id: `cde_tr_${Date.now()}`,
          type: 'transferencia',
          amount: amount,
          description: `Transferência Interna: Suprimento vindo de ${bankName} (${description})`,
          responsibleUser: currentUser.name,
          date: dateStr,
          time: timeStr
        },
        ...prev
      ]);
      // 2. Reduz banco
      setBankAccounts(prev => prev.map(b => b.id === bankAccountId ? { ...b, balance: b.balance - amount } : b));
      // 3. Extrato bancário
      setBankStatements(prev => [
        {
          id: `stmt_tr_${Date.now()}`,
          bankAccountId,
          date: dateStr,
          description: `SAQUE / TED P/ CAIXA FISICO - ${description.toUpperCase()}`,
          amount: -amount,
          payerOrReceiver: 'Caixa Físico Consultório',
          reconciled: true
        },
        ...prev
      ]);
    }
  };

  const createWhatsAppMessage = (msgData: Omit<WhatsAppMessage, 'id' | 'status'>) => {
    const newMsg: WhatsAppMessage = {
      ...msgData,
      id: `msg_${Date.now()}`,
      status: msgData.isAutomated ? 'Pronto para Envio' : 'Pendente de Aprovação'
    };
    setWhatsAppMessages(prev => [newMsg, ...prev]);
    return newMsg;
  };

  const approveWhatsAppMessage = (id: string) => {
    setWhatsAppMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'Pronto para Envio', approvedBy: currentUser.name } : m));
  };

  const markWhatsAppMessageSent = (id: string) => {
    const now = new Date();
    setWhatsAppMessages(prev => prev.map(m => m.id === id ? { 
      ...m, 
      status: 'Enviado', 
      sentAt: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}` 
    } : m));
  };

  // Inventory kit consumption (PRD Section 13.2: baixa automática de itens relacionados)
  const consumeKit = (kitId: string, patientName?: string) => {
    const kit = procedureKits.find(k => k.id === kitId);
    if (!kit) return;

    setStockItems(prev => {
      const updated = [...prev];
      kit.items.forEach(kitItem => {
        const itemIdx = updated.findIndex(s => s.id === kitItem.stockItemId);
        if (itemIdx >= 0) {
          updated[itemIdx] = {
            ...updated[itemIdx],
            quantity: Math.max(0, updated[itemIdx].quantity - kitItem.quantity)
          };
        }
      });
      return updated;
    });
  };

  const updateStockQuantity = (itemId: string, newQuantity: number) => {
    setStockItems(prev => prev.map(s => s.id === itemId ? { ...s, quantity: Math.max(0, newQuantity) } : s));
  };

  const addStockItem = (itemData: Omit<StockItem, 'id'>) => {
    const newItem: StockItem = {
      ...itemData,
      id: `stk_${Date.now()}`
    };
    setStockItems(prev => [...prev, newItem]);
  };

  const addPatientConsent = (patientId: string, termTitle: string, version: string, ipOrDevice?: string) => {
    const now = new Date();
    const newConsent = {
      id: `cst_${Date.now()}`,
      termTitle,
      version,
      acceptedAt: `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`,
      ipOrDevice: ipOrDevice || 'Consultório - Assinatura Digital',
      doctorResponsible: currentUser.name
    };

    setPatients(prev => prev.map(p => p.id === patientId ? {
      ...p,
      consents: [newConsent, ...(p.consents || [])]
    } : p));
  };

  const resetAllData = () => {
    localStorage.clear();
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setTemplates(INITIAL_RECORD_TEMPLATES);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBankStatements(INITIAL_BANK_STATEMENTS);
    setCashDrawerEntries(INITIAL_CASH_DRAWER_ENTRIES);
    setCashDrawerAudits(INITIAL_CASH_DRAWER_AUDITS);
    setWhatsAppMessages(INITIAL_WHATSAPP_MESSAGES);
    setStockItems(INITIAL_STOCK_ITEMS);
    setProcedureKits(INITIAL_PROCEDURE_KITS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: INITIAL_USERS,
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        selectedAppointmentIdForRecord,
        setSelectedAppointmentIdForRecord,
        patients,
        appointments,
        medicalRecords,
        templates,
        bankAccounts,
        transactions,
        bankStatements,
        cashDrawerEntries,
        cashDrawerAudits,
        whatsAppMessages,
        stockItems,
        procedureKits,
        totalBankBalance,
        cashDrawerBalance,
        totalAvailability,
        totalMonthlyRevenue,
        totalMonthlyExpense,
        netResult,
        addPatient,
        updatePatient,
        addAppointment,
        updateAppointmentStatus,
        updateAppointment,
        addMedicalRecord,
        addTemplate,
        addTransaction,
        updateTransaction,
        addBankAccount,
        addBankStatementItem,
        reconcileStatementWithTransaction,
        reconciliationSuggestions,
        addCashDrawerEntry,
        performCashAudit,
        transferBetweenBankAndCash,
        createWhatsAppMessage,
        approveWhatsAppMessage,
        markWhatsAppMessageSent,
        consumeKit,
        updateStockQuantity,
        addStockItem,
        addPatientConsent,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
