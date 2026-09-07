import {
  UserProfile,
  Patient,
  Appointment,
  MedicalRecordTemplate,
  MedicalRecord,
  BankAccount,
  FinancialTransaction,
  BankStatementItem,
  CashDrawerEntry,
  CashDrawerAudit,
  WhatsAppMessage,
  StockItem,
  ProcedureKit
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'Dr. Marcelo Ramos',
    role: 'medico',
    email: 'marcelo.ramos@clinicamed.com.br',
    crm: 'CRM/SP 148.920',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user_2',
    name: 'Camila Duarte',
    role: 'secretaria',
    email: 'camila.duarte@clinicamed.com.br',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat_1',
    name: 'Ana Cláudia Siqueira',
    phone: '(11) 98452-1920',
    cpf: '284.195.408-11',
    birthDate: '1985-04-12',
    email: 'ana.siqueira@gmail.com',
    gender: 'F',
    bloodType: 'A+',
    allergies: ['Dipirona', 'Penicilina'],
    address: 'Av. Paulista, 1500 - Apto 82, São Paulo - SP',
    notes: 'Paciente hipertensa controlada. Preferência por horários matutinos.',
    consents: [
      {
        id: 'cst_1',
        termTitle: 'Consentimento Informado Geral de Atendimento e Tratamento de Dados (LGPD)',
        version: 'v2.1',
        acceptedAt: '2026-08-10 09:15',
        ipOrDevice: 'Totem Recepção Consultório',
        doctorResponsible: 'Dr. Marcelo Ramos'
      }
    ],
    createdAt: '2026-08-10'
  },
  {
    id: 'pat_2',
    name: 'Carlos Eduardo Nogueira',
    phone: '(11) 97103-8842',
    cpf: '351.802.918-44',
    birthDate: '1979-11-28',
    email: 'carlos.enogueira@outlook.com',
    gender: 'M',
    bloodType: 'O+',
    allergies: ['Nenhuma relatada'],
    address: 'Rua Bela Cintra, 890 - Consolação, São Paulo - SP',
    notes: 'Acompanhamento de rotina cardiológica e check-up preventivo.',
    consents: [
      {
        id: 'cst_2',
        termTitle: 'Consentimento Informado Geral de Atendimento e Tratamento de Dados (LGPD)',
        version: 'v2.1',
        acceptedAt: '2026-08-15 14:02',
        ipOrDevice: 'Dispositivo Móvel - Link Seguro',
        doctorResponsible: 'Dr. Marcelo Ramos'
      }
    ],
    createdAt: '2026-08-15'
  },
  {
    id: 'pat_3',
    name: 'Mariana Pires Vasconcellos',
    phone: '(11) 99312-4401',
    cpf: '419.663.128-59',
    birthDate: '1992-07-03',
    email: 'mariana.vasconcellos@hotmail.com',
    gender: 'F',
    bloodType: 'B+',
    allergies: ['Sulfas'],
    address: 'Rua Oscar Freire, 320, São Paulo - SP',
    notes: 'Realizou procedimento com aplicação de toxina botulínica no terço superior.',
    consents: [
      {
        id: 'cst_3',
        termTitle: 'Termo de Consentimento para Procedimentos Injetáveis e Estéticos',
        version: 'v1.4',
        acceptedAt: '2026-09-01 10:40',
        ipOrDevice: 'Tablet Consultório Dr. Marcelo',
        doctorResponsible: 'Dr. Marcelo Ramos'
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'pat_4',
    name: 'Roberto Mendes Alencar',
    phone: '(11) 98221-7763',
    cpf: '190.442.871-30',
    birthDate: '1968-02-19',
    email: 'roberto.alencar@empresa.com.br',
    gender: 'M',
    bloodType: 'AB+',
    allergies: ['Frutos do mar'],
    address: 'Alameda Santos, 1200, São Paulo - SP',
    notes: 'Diabetes tipo 2 e dislipidemia. Trazer exames laboratoriais na consulta.',
    consents: [],
    createdAt: '2026-09-02'
  },
  {
    id: 'pat_5',
    name: 'Juliana Castro Barreto',
    phone: '(11) 99182-3390',
    cpf: '388.291.038-72',
    birthDate: '1995-12-14',
    email: 'juliana.cbarreto@gmail.com',
    gender: 'F',
    bloodType: 'O-',
    allergies: ['Iodo'],
    address: 'Rua Augusta, 2400, São Paulo - SP',
    notes: 'Primeira consulta agendada para avaliação clínica.',
    consents: [],
    createdAt: '2026-09-05'
  }
];

// Reference today as 2026-09-07 (a Monday) to have full rich weekly and daily schedules
const TODAY = '2026-09-07';

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    patientId: 'pat_1',
    patientName: 'Ana Cláudia Siqueira',
    patientPhone: '(11) 98452-1920',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: TODAY,
    time: '08:00',
    durationMinutes: 60,
    type: 'Retorno',
    status: 'Atendido',
    notes: 'Retorno com mapa de pressão e exames de sangue recentes.',
    financialStatus: 'Pago',
    financialAmount: 350.00,
    paymentMethod: 'Pix',
    createdAt: '2026-09-01'
  },
  {
    id: 'apt_2',
    patientId: 'pat_2',
    patientName: 'Carlos Eduardo Nogueira',
    patientPhone: '(11) 97103-8842',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: TODAY,
    time: '09:00',
    durationMinutes: 60,
    type: 'Primeira Consulta',
    status: 'Confirmado',
    notes: 'Paciente confirmou presença via mensagem WhatsApp da secretária.',
    financialStatus: 'Pago',
    financialAmount: 450.00,
    paymentMethod: 'Cartão de Crédito',
    createdAt: '2026-09-02'
  },
  {
    id: 'apt_3',
    patientId: 'pat_3',
    patientName: 'Mariana Pires Vasconcellos',
    patientPhone: '(11) 99312-4401',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: TODAY,
    time: '10:00',
    durationMinutes: 60,
    type: 'Procedimento',
    status: 'Confirmado',
    notes: 'Aplicação de Toxina Botulínica facial (Kit reservado no estoque).',
    financialStatus: 'Pago',
    financialAmount: 1200.00,
    paymentMethod: 'Dinheiro',
    createdAt: '2026-09-03'
  },
  {
    id: 'apt_4',
    patientId: 'pat_4',
    patientName: 'Roberto Mendes Alencar',
    patientPhone: '(11) 98221-7763',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: TODAY,
    time: '11:00',
    durationMinutes: 60,
    type: 'Retorno',
    status: 'Agendado',
    notes: 'Aguardando confirmação telefônica ou mensagem.',
    financialStatus: 'Pendente',
    financialAmount: 350.00,
    createdAt: '2026-09-04'
  },
  {
    id: 'apt_5',
    patientId: 'pat_5',
    patientName: 'Juliana Castro Barreto',
    patientPhone: '(11) 99182-3390',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: TODAY,
    time: '14:00',
    durationMinutes: 60,
    type: 'Primeira Consulta',
    status: 'Confirmado',
    notes: 'Avaliação clínica geral.',
    financialStatus: 'Pendente',
    financialAmount: 450.00,
    createdAt: '2026-09-04'
  },
  {
    id: 'apt_6',
    patientId: 'pat_1',
    patientName: 'Ana Cláudia Siqueira',
    patientPhone: '(11) 98452-1920',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: '2026-09-08',
    time: '09:00',
    durationMinutes: 60,
    type: 'Exame',
    status: 'Agendado',
    notes: 'Eletrocardiograma de repouso.',
    financialStatus: 'Pendente',
    financialAmount: 200.00,
    createdAt: '2026-09-05'
  },
  {
    id: 'apt_7',
    patientId: 'pat_2',
    patientName: 'Carlos Eduardo Nogueira',
    patientPhone: '(11) 97103-8842',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: '2026-09-09',
    time: '15:00',
    durationMinutes: 60,
    type: 'Retorno',
    status: 'Agendado',
    notes: 'Acompanhamento do ajuste de dosagem medicamentosa.',
    financialStatus: 'Cortesia',
    financialAmount: 0.00,
    createdAt: '2026-09-05'
  },
  {
    id: 'apt_8',
    patientId: 'pat_3',
    patientName: 'Mariana Pires Vasconcellos',
    patientPhone: '(11) 99312-4401',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    date: '2026-09-10',
    time: '11:00',
    durationMinutes: 60,
    type: 'Retorno',
    status: 'Agendado',
    notes: 'Revisão pós-procedimento em 15 dias.',
    financialStatus: 'Cortesia',
    financialAmount: 0.00,
    createdAt: '2026-09-06'
  }
];

export const INITIAL_RECORD_TEMPLATES: MedicalRecordTemplate[] = [
  {
    id: 'tpl_1',
    title: 'Consulta Inicial (Clínica Geral)',
    category: 'Geral',
    chiefComplaint: 'Paciente refere fadiga, cansaço progressivo e episódios esporádicos de cefaleia.',
    historyOfPresentIllness: 'Início dos sintomas há aproximadamente 4 semanas. Nega febre, náuseas ou alterações visuais. Sem fatores de melhora evidentes.',
    physicalExam: 'BEG, LOTE, corado, hidratado, acianótico, anictérico.\nPA: 125x80 mmHg | FC: 74 bpm | SpO2: 98% em ar ambiente.\nACV: RCR em 2T, bulhas normofonéticas sem sopros.\nAR: MV presente bilateralmente, sem ruídos adventícios.\nAbdome: flácido, indolor à palpação superficial e profunda, RHA presentes.',
    diagnosticHypothesis: 'I10 - Hipertensão essencial (primária) em investigação / Fadiga crônica a esclarecer.',
    prescriptionAndPlan: '1. Solicitação de exames laboratoriais: Hemograma completo, Glicemia em jejum, Perfil lipídico, TSH, Ureia e Creatinina.\n2. MAPA 24h para elucidação diagnóstica de picos pressóricos.\n3. Orientações de higiene do sono e atividade física aeróbica 150 min/semana.\n4. Retorno em 20 dias com resultados.'
  },
  {
    id: 'tpl_2',
    title: 'Consulta de Retorno',
    category: 'Retorno',
    chiefComplaint: 'Retorno para avaliação de resultados de exames complementares.',
    historyOfPresentIllness: 'Paciente relata melhora sintomática após início das medidas recomendadas. Nega novos episódios de mal-estar.',
    physicalExam: 'PA: 120x80 mmHg | FC: 70 bpm | Peso: 74.5 kg | IMC: 23.8 kg/m².\nAusculta cardíaca e pulmonar normais.',
    diagnosticHypothesis: 'Z00.0 - Exame médico geral.',
    prescriptionAndPlan: '1. Manter plano terapêutico atual.\n2. Manutenção de hábitos saudáveis.\n3. Novo controle em 6 meses.'
  },
  {
    id: 'tpl_3',
    title: 'Procedimento / Injetáveis',
    category: 'Procedimentos',
    chiefComplaint: 'Queixa de rugas dinâmicas acentuadas em região frontal e glabelar.',
    historyOfPresentIllness: 'Sem contraindicações clínicas. Teste alérgico negativo. Termo de consentimento esclarecido assinado.',
    physicalExam: 'Pele íntegra, sem sinais inflamatórios ou infecciosos locais. Simetria facial preservada em repouso.',
    diagnosticHypothesis: 'L98.8 - Outros transtornos especificados da pele e do tecido subcutâneo.',
    prescriptionAndPlan: '1. Assepsia rigorosa com clorexidina alcoólica 0,5%.\n2. Aplicação de 50U de Toxina Botulínica (diluição padrão 1:1) distribuídas em glabela (20U), frontal (15U) e periocular (15U).\n3. Baixa de 1 Kit de Aplicação no estoque.\n4. Orientações pós-procedimento: Não deitar nas primeiras 4h, evitar atividades físicas intensas por 24h.\n5. Retorno em 15 dias para avaliação do resultado.'
  },
  {
    id: 'tpl_4',
    title: 'Acompanhamento Cardiológico',
    category: 'Especialidade',
    chiefComplaint: 'Acompanhamento de Hipertensão Arterial Sistêmica.',
    historyOfPresentIllness: 'Em uso regular de Losartana 50mg 1x ao dia. Refere boa adesão medicamentosa.',
    physicalExam: 'PA: 128x82 mmHg | FC: 68 bpm. Sem edemas em membros inferiores.',
    diagnosticHypothesis: 'I10 - Hipertensão essencial (primária).',
    prescriptionAndPlan: '1. Manter Losartana Potássica 50mg VO 1x/dia pela manhã.\n2. Redução de sódio na dieta.\n3. Retorno em 90 dias.'
  }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec_1',
    patientId: 'pat_1',
    patientName: 'Ana Cláudia Siqueira',
    appointmentId: 'apt_1',
    doctorId: 'user_1',
    doctorName: 'Dr. Marcelo Ramos',
    doctorCrm: 'CRM/SP 148.920',
    date: TODAY,
    time: '08:45',
    templateUsed: 'Consulta de Retorno',
    chiefComplaint: 'Retorno com mapa de pressão e exames laboratoriais.',
    historyOfPresentIllness: 'Paciente assintomática no momento. Relata boa tolerância à medicação prescrita no atendimento anterior. Trouxe diário de pressão arterial domiciliar.',
    physicalExam: 'BEG, corada, eupneica. PA: 122x78 mmHg, FC: 72 bpm. ACV e AR sem alterações. MMII sem edemas.',
    diagnosticHypothesis: 'I10 - Hipertensão arterial sistêmica controlada',
    cid10: 'I10',
    prescriptionAndPlan: '1. Manter Losartana Potássica 50mg 1 comp ao dia.\n2. Reavaliação laboratorial em 6 meses (Ureia, Creatinina, Eletrólitos).\n3. Retorno agendado para Dezembro/2026.',
    notes: 'Paciente orientada a manter prática de caminhadas matinais.'
  }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank_1',
    bankName: 'Banco Itaú S.A.',
    agency: '1432',
    accountNumber: '58920-4',
    accountType: 'Corrente',
    balance: 18450.00,
    color: '#EC7000'
  },
  {
    id: 'bank_2',
    bankName: 'Banco Santander Brasil',
    agency: '0450',
    accountNumber: '130098-1',
    accountType: 'Corrente',
    balance: 7200.00,
    color: '#CC0000'
  }
];

export const INITIAL_CASH_DRAWER_ENTRIES: CashDrawerEntry[] = [
  {
    id: 'cde_1',
    type: 'entrada',
    amount: 1200.00,
    description: 'Recebimento de Consulta / Procedimento em Dinheiro - Mariana Pires',
    responsibleUser: 'Camila Duarte',
    date: TODAY,
    time: '10:35',
    relatedTransactionId: 'tx_3'
  },
  {
    id: 'cde_2',
    type: 'saida',
    amount: 60.00,
    description: 'Compra de água mineral e itens de copa para recepção',
    responsibleUser: 'Camila Duarte',
    date: TODAY,
    time: '11:15'
  },
  {
    id: 'cde_3',
    type: 'entrada',
    amount: 250.00,
    description: 'Saldo inicial de abertura de caixa',
    responsibleUser: 'Camila Duarte',
    date: TODAY,
    time: '07:45'
  }
];

export const INITIAL_CASH_DRAWER_AUDITS: CashDrawerAudit[] = [
  {
    id: 'cda_1',
    date: '2026-09-05',
    time: '18:10',
    responsibleUser: 'Camila Duarte',
    expectedBalance: 1450.00,
    countedBalance: 1450.00,
    difference: 0.00,
    justification: 'Conferência de fechamento diário realizada com sucesso. Sem divergências.',
    adjustmentCreated: false
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx_1',
    description: 'Consulta Cardiológica / Retorno - Ana Cláudia Siqueira',
    amount: 350.00,
    type: 'receita',
    category: 'Consultas',
    date: TODAY,
    status: 'Pago',
    paymentMethod: 'Pix',
    destination: 'bank_1',
    destinationName: 'Banco Itaú S.A.',
    patientId: 'pat_1',
    patientName: 'Ana Cláudia Siqueira',
    appointmentId: 'apt_1',
    reconciled: true,
    createdAt: TODAY
  },
  {
    id: 'tx_2',
    description: 'Primeira Consulta Clínica - Carlos Eduardo Nogueira',
    amount: 450.00,
    type: 'receita',
    category: 'Consultas',
    date: TODAY,
    status: 'Pago',
    paymentMethod: 'Cartão de Crédito',
    destination: 'bank_2',
    destinationName: 'Banco Santander Brasil',
    patientId: 'pat_2',
    patientName: 'Carlos Eduardo Nogueira',
    appointmentId: 'apt_2',
    reconciled: false,
    createdAt: TODAY
  },
  {
    id: 'tx_3',
    description: 'Procedimento Facial Toxina - Mariana Pires Vasconcellos',
    amount: 1200.00,
    type: 'receita',
    category: 'Procedimentos',
    date: TODAY,
    status: 'Pago',
    paymentMethod: 'Dinheiro',
    destination: 'caixa_fisico',
    destinationName: 'Caixa Físico do Consultório',
    patientId: 'pat_3',
    patientName: 'Mariana Pires Vasconcellos',
    appointmentId: 'apt_3',
    reconciled: true,
    createdAt: TODAY
  },
  {
    id: 'tx_4',
    description: 'Aluguel do Consultório - Edifício Medical Center',
    amount: 3200.00,
    type: 'despesa',
    category: 'Instalações',
    date: '2026-09-05',
    status: 'Pago',
    paymentMethod: 'Boleto',
    destination: 'bank_1',
    destinationName: 'Banco Itaú S.A.',
    reconciled: true,
    createdAt: '2026-09-01'
  },
  {
    id: 'tx_5',
    description: 'Compra de Insumos Médicos - Distribuidora Cirúrgica Brasil',
    amount: 850.00,
    type: 'despesa',
    category: 'Insumos e Estoque',
    date: TODAY,
    status: 'Pago',
    paymentMethod: 'Transferência Bancária',
    destination: 'bank_1',
    destinationName: 'Banco Itaú S.A.',
    reconciled: false,
    createdAt: TODAY
  }
];

export const INITIAL_BANK_STATEMENTS: BankStatementItem[] = [
  {
    id: 'stmt_1',
    bankAccountId: 'bank_1',
    date: TODAY,
    description: 'PIX RECEBIDO - ANA CLAUDIA SIQUEIRA',
    amount: 350.00,
    payerOrReceiver: 'Ana Cláudia Siqueira',
    documentNumber: 'E982749817293',
    reconciled: true,
    reconciledWithTransactionId: 'tx_1'
  },
  {
    id: 'stmt_2',
    bankAccountId: 'bank_1',
    date: TODAY,
    description: 'TED PAGTO - DISTRIB CIRURGICA BRASIL',
    amount: -850.00,
    payerOrReceiver: 'Cirúrgica Brasil Ltda',
    documentNumber: 'DOC84920',
    reconciled: false
  },
  {
    id: 'stmt_3',
    bankAccountId: 'bank_1',
    date: '2026-09-05',
    description: 'PAGTO TITULO ITAU - ED MEDICAL CENTER',
    amount: -3200.00,
    payerOrReceiver: 'Condomínio Medical Center',
    documentNumber: 'BOL098124',
    reconciled: true,
    reconciledWithTransactionId: 'tx_4'
  },
  {
    id: 'stmt_4',
    bankAccountId: 'bank_2',
    date: TODAY,
    description: 'CREDITO LIQ CARTAO CIELO REF 06/09',
    amount: 432.00,
    payerOrReceiver: 'Cielo Pagamentos',
    documentNumber: 'CIELO99182',
    reconciled: false
  },
  {
    id: 'stmt_5',
    bankAccountId: 'bank_1',
    date: TODAY,
    description: 'PIX RECEBIDO - ROBERTO M ALENCAR',
    amount: 350.00,
    payerOrReceiver: 'Roberto Mendes Alencar',
    documentNumber: 'E00129381203',
    reconciled: false
  }
];

export const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'stk_1',
    name: 'Toxina Botulínica Tipo A 100U',
    category: 'Injetáveis',
    quantity: 8,
    minQuantity: 3,
    unit: 'frasco',
    location: 'Geladeira 01 - Prateleira A',
    costPerUnit: 480.00
  },
  {
    id: 'stk_2',
    name: 'Anestésico Lidocaína 2% com Epinefrina',
    category: 'Anestésicos',
    quantity: 14,
    minQuantity: 5,
    unit: 'frasco',
    location: 'Armário B - Gaveta 2',
    costPerUnit: 28.50
  },
  {
    id: 'stk_3',
    name: 'Seringas Descartáveis BD Ultrafine 1mL',
    category: 'Descartáveis',
    quantity: 120,
    minQuantity: 30,
    unit: 'unidade',
    location: 'Armário Principal - Caixa 4',
    costPerUnit: 1.80
  },
  {
    id: 'stk_4',
    name: 'Agulhas 30G x 4mm para Mesoterapia',
    category: 'Descartáveis',
    quantity: 200,
    minQuantity: 50,
    unit: 'unidade',
    location: 'Armário Principal - Caixa 5',
    costPerUnit: 0.95
  },
  {
    id: 'stk_5',
    name: 'Luvas Cirúrgicas Estéreis 7.5 (Pares)',
    category: 'EPIs',
    quantity: 45,
    minQuantity: 15,
    unit: 'par',
    location: 'Armário EPI',
    costPerUnit: 4.20
  },
  {
    id: 'stk_6',
    name: 'Fio de Sutura Mononylon 4-0 com Agulha',
    category: 'Cirúrgico',
    quantity: 18,
    minQuantity: 6,
    unit: 'unidade',
    location: 'Bancada de Procedimentos',
    costPerUnit: 7.50
  },
  {
    id: 'stk_7',
    name: 'Clorexidina Alcoólica 0,5% 500mL',
    category: 'Antissépticos',
    quantity: 4,
    minQuantity: 2,
    unit: 'frasco',
    location: 'Bancada de Procedimentos',
    costPerUnit: 18.00
  }
];

export const INITIAL_PROCEDURE_KITS: ProcedureKit[] = [
  {
    id: 'kit_1',
    name: 'Kit Aplicação de Toxina Botulínica Facial',
    description: 'Kit completo para aplicação de toxina botulínica no terço superior facial.',
    specialty: 'Dermatologia / Estética Médica',
    items: [
      { stockItemId: 'stk_1', stockItemName: 'Toxina Botulínica Tipo A 100U', quantity: 1, unit: 'frasco' },
      { stockItemId: 'stk_3', stockItemName: 'Seringas Descartáveis BD Ultrafine 1mL', quantity: 4, unit: 'unidade' },
      { stockItemId: 'stk_4', stockItemName: 'Agulhas 30G x 4mm para Mesoterapia', quantity: 6, unit: 'unidade' },
      { stockItemId: 'stk_5', stockItemName: 'Luvas Cirúrgicas Estéreis 7.5 (Pares)', quantity: 1, unit: 'par' }
    ]
  },
  {
    id: 'kit_2',
    name: 'Kit Pequena Cirurgia / Biópsia de Pele',
    description: 'Materiais esterilizados para excisão de lesão e sutura cutânea.',
    specialty: 'Cirurgia Ambulatorial',
    items: [
      { stockItemId: 'stk_2', stockItemName: 'Anestésico Lidocaína 2% com Epinefrina', quantity: 1, unit: 'frasco' },
      { stockItemId: 'stk_3', stockItemName: 'Seringas Descartáveis BD Ultrafine 1mL', quantity: 2, unit: 'unidade' },
      { stockItemId: 'stk_6', stockItemName: 'Fio de Sutura Mononylon 4-0 com Agulha', quantity: 2, unit: 'unidade' },
      { stockItemId: 'stk_5', stockItemName: 'Luvas Cirúrgicas Estéreis 7.5 (Pares)', quantity: 2, unit: 'par' }
    ]
  }
];

export const INITIAL_WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'msg_1',
    patientId: 'pat_2',
    patientName: 'Carlos Eduardo Nogueira',
    patientPhone: '5511971038842',
    appointmentId: 'apt_2',
    triggerType: 'confirmacao_consulta',
    title: 'Confirmação de Consulta - Hoje às 09:00',
    content: 'Olá Carlos Eduardo! Sua consulta com o Dr. Marcelo Ramos está agendada para hoje às 09:00 na Clínica Médica (Av. Paulista, 1500). Por favor, responda SIM para confirmar sua presença.',
    status: 'Enviado',
    isAutomated: true,
    scheduledFor: '2026-09-07 07:00',
    sentAt: '2026-09-07 07:02',
    approvedBy: 'Sistema Automático'
  },
  {
    id: 'msg_2',
    patientId: 'pat_4',
    patientName: 'Roberto Mendes Alencar',
    patientPhone: '5511982217763',
    appointmentId: 'apt_4',
    triggerType: 'confirmacao_consulta',
    title: 'Confirmação de Consulta - Hoje às 11:00',
    content: 'Olá Sr. Roberto Mendes! Confirmamos seu horário de retorno com o Dr. Marcelo Ramos hoje, 07/09, às 11:00. Lembramos de trazer os resultados dos exames laboratoriais.',
    status: 'Pendente de Aprovação',
    isAutomated: false,
    scheduledFor: '2026-09-07 08:00'
  },
  {
    id: 'msg_3',
    patientId: 'pat_5',
    patientName: 'Juliana Castro Barreto',
    patientPhone: '5511991823390',
    appointmentId: 'apt_5',
    triggerType: 'orientacoes_pre',
    title: 'Orientações Pré-Consulta Primeira Vez',
    content: 'Olá Juliana! Seja bem-vinda à nossa clínica. Sua primeira consulta é hoje às 14:00. Recomendamos chegar 15 minutos antes para cadastro de recepção e trazer documento com foto.',
    status: 'Pronto para Envio',
    isAutomated: false,
    scheduledFor: '2026-09-07 09:30',
    approvedBy: 'Camila Duarte'
  },
  {
    id: 'msg_4',
    patientId: 'pat_3',
    patientName: 'Mariana Pires Vasconcellos',
    patientPhone: '5511993124401',
    appointmentId: 'apt_3',
    triggerType: 'pos_atendimento',
    title: 'Orientações Pós-Procedimento Toxina Botulínica',
    content: 'Olá Mariana! Seguem as orientações pós-procedimento: evite massagear o local, não pratique exercícios físicos intensos nas próximas 24h e permaneça em posição ereta pelas próximas 4 horas. Qualquer dúvida estamos à disposição no WhatsApp.',
    status: 'Pronto para Envio',
    isAutomated: false,
    scheduledFor: '2026-09-07 11:15',
    approvedBy: 'Dr. Marcelo Ramos'
  }
];
