export type UserRole = 'medico' | 'secretaria';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  crm?: string;
  avatar?: string;
}

export type AppointmentStatus = 'Agendado' | 'Confirmado' | 'Atendido' | 'Cancelado' | 'Não compareceu';

export type AppointmentType = 'Primeira Consulta' | 'Retorno' | 'Procedimento' | 'Exame' | 'Urgência';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  financialStatus?: 'Pendente' | 'Pago' | 'Cortesia';
  financialAmount?: number;
  paymentMethod?: string;
  createdAt: string;
}

export interface PatientConsent {
  id: string;
  termTitle: string;
  version: string;
  acceptedAt: string;
  ipOrDevice?: string;
  doctorResponsible: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  birthDate: string;
  email: string;
  gender: 'M' | 'F' | 'Outro';
  bloodType?: string;
  allergies?: string[];
  address?: string;
  notes?: string;
  consents: PatientConsent[];
  createdAt: string;
}

export interface MedicalRecordTemplate {
  id: string;
  title: string;
  category: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExam: string;
  diagnosticHypothesis: string;
  prescriptionAndPlan: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  doctorId: string;
  doctorName: string;
  doctorCrm: string;
  date: string;
  time: string;
  templateUsed?: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExam: string;
  diagnosticHypothesis: string;
  cid10?: string;
  prescriptionAndPlan: string;
  usedKits?: string[];
  notes?: string;
}

export type TransactionType = 'receita' | 'despesa' | 'transferencia';
export type PaymentMethod = 'Dinheiro' | 'Pix' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'Transferência Bancária';
export type TransactionDestination = 'caixa_fisico' | string; // bankAccountId or 'caixa_fisico'

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  status: 'Pago' | 'Pendente' | 'Cancelado';
  paymentMethod: PaymentMethod;
  destination: TransactionDestination; // bankAccountId or 'caixa_fisico'
  destinationName: string;
  patientId?: string;
  patientName?: string;
  appointmentId?: string;
  reconciled?: boolean;
  notes?: string;
  createdAt: string;
}

export interface BankStatementItem {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  amount: number; // positive = credit/deposit, negative = debit/payment
  payerOrReceiver?: string;
  documentNumber?: string;
  reconciled: boolean;
  reconciledWithTransactionId?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  agency: string;
  accountNumber: string;
  accountType: 'Corrente' | 'Poupança';
  balance: number;
  color: string;
}

export interface ReconciliationSuggestion {
  id: string;
  statementItem: BankStatementItem;
  matchedTransaction?: FinancialTransaction;
  matchedAppointment?: Appointment;
  confidence: 'Alta' | 'Média' | 'Manual';
  reason: string;
}

export interface CashDrawerEntry {
  id: string;
  type: 'entrada' | 'saida' | 'ajuste' | 'transferencia';
  amount: number;
  description: string;
  responsibleUser: string;
  date: string;
  time: string;
  relatedTransactionId?: string;
}

export interface CashDrawerAudit {
  id: string;
  date: string;
  time: string;
  responsibleUser: string;
  expectedBalance: number;
  countedBalance: number;
  difference: number;
  justification?: string;
  adjustmentCreated: boolean;
}

export type WhatsAppTriggerType = 
  | 'confirmacao_consulta'
  | 'lembrete_24h'
  | 'orientacoes_pre'
  | 'pos_atendimento'
  | 'personalizada';

export interface WhatsAppMessage {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentId?: string;
  triggerType: WhatsAppTriggerType;
  title: string;
  content: string;
  status: 'Pendente de Aprovação' | 'Pronto para Envio' | 'Enviado' | 'Cancelado';
  isAutomated: boolean;
  scheduledFor: string;
  sentAt?: string;
  approvedBy?: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: 'mL' | 'ampola' | 'unidade' | 'caixa' | 'frasco' | 'par';
  location: string;
  costPerUnit: number;
}

export interface ProcedureKitItem {
  stockItemId: string;
  stockItemName: string;
  quantity: number;
  unit: string;
}

export interface ProcedureKit {
  id: string;
  name: string;
  description: string;
  specialty: string;
  items: ProcedureKitItem[];
}
