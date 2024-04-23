module.exports = {
  //miscellaneous constants
  CHARGE: 'Charge',
  PAYMENT: 'Payment',
  DOWN_PAYMENT_AMOUNT: 6000,

  //contract.delinquency_stage constants
  CYCLE_1_REMINDER_1: 1,
  CYCLE_1_REMINDER_2: 2,
  CYCLE_2_REMINDER_1: 3,
  CYCLE_2_REMINDER_2: 4,
  CYCLE_3_REMINDER_1: 5,
  CYCLE_3_REMINDER_2: 6,
  TERMINATION_NOTICE: 7,

  //contract_status constants
  ACTIVE: 1,
  CANCELLED: 2,
  COMPLETED: 3,
  ON_HOLD: 4,
  CLIENT_ON_HOLD: 5,
  COLLECTIONS: 6,
  CONVERTED: 7,
  INITIATED: 8,
  ACTIVATED: 9,

  //contract_type_category constants
  HEALTH_PLAN: 1,
  PAYMENT_PLAN: 2,

  //contract_phase constants
  PENDING: 'pending',
  OPEN: 'open',
  FINALIZED: 'finalized',

  //payment_interval constants
  MONTHLY: 1,
  ANNUAL: 2,

  //contract_type_ids constants
  EMPLOYEE: Number(process.env.REACT_APP_EMPLOYEE_HP_CONTRACT_TYPE_ID),
  GENERIC_PAYMENT_PLAN: Number(process.env.REACT_APP_PAYMENT_PLAN_CONTRACT_TYPE_ID),

  //payment method category constants
  ACH: 'ach',
  TERMINAL: 'terminal',
  CARD: 'card',
  CASH: 'cash',
  CHECK: 'check',
  CARE_CREDIT: 'care_credit',

  //payment_status constants
  PROCESSING: 1,
  SUCCEEDED: 2,
  FAILED: 3,

  //payment_type constants
  ONE_TIME_PAYMENT: 1,
  RECURRING_PAYMENT: 2,
  CLINIC_CREDIT: 3,
  ADMIN_CREDIT: 4,
  REFUND: 5,
  MIGRATION_ADJUSTMENT: 6,
  CONVERSION_ADJUSTMENT: 7,

  //percentage_off constants
  FIFTY_PERCENT: 1,
  NINETY_PERCENT: 2,

  //pricing version constants
  V2: 2,
  V3: 3,

  //role constants
  CLIENT: 1,
  STAFF: 2,
  MANAGER: 3,

  //species constants
  CANINE: 1,
  FELINE: 2,

  //transaction_category constants
  DOWN_PAYMENT: 1,
  MONTHLY_PAYMENT: 2,
  FULL_PAYMENT: 3,
  REMAINING_BALANCE: 4,
  FEE: 6,
  MIGRATION: 7,
  SETUP_FEE: 8,

  //cancellation reasons
  NON_PAYMENT_MONTHLY: 1,
  NON_PAYMENT_ANNUAL: 2,
  DECEASED_IMMEDIATE: 3,
  DECEASED_PREVIOUS: 4,
  EMPLOYEE_PLAN: 5,
  REHOMED: 6,
  MOVED: 7,
  CANNOT_AFFORD: 8,
  BAD_VALUE: 9,
  UPSET_CLIENT: 10,
  FIRED_CLIENT: 11,

  //cancellation reason map
  CANCELLATION_REASON_MAP: [
    { name: 'Non-payment (Monthly)', value: 1 },
    { name: 'Non-payment (Annual)', value: 2 },
    { name: 'Deceased (Immediate)', value: 3 },
    { name: 'Deceased (Previous)', value: 4 },
    { name: 'Employee Plan', value: 5 },
    { name: 'Pet Re-Homed', value: 6 },
    { name: 'Owner Moved', value: 7 },
    { name: 'Owner Cannot Afford', value: 8 },
    { name: 'Owner Does Not See Value', value: 9 },
    { name: 'Owner Unhappy with Service', value: 10 },
    { name: 'Not a Good Fit for Clinic', value: 11 },
  ],

  //document types
  ESTIMATE: 1,
  AUTHORIZATION_FORM: 2,
  SURGERY_CONSENT_FORM: 3,
  EUTHANASIA_CONSENT_FORM: 4,
  HEALTH_PLAN_CONTRACT: 5,
  PAYMENT_PLAN_CONTRACT: 6,
  APPOINTMENT_SUMMARY: 7,

  DOCUMENT_TYPE_MAP: [
    { value: 1, name: 'Estimate', link: '/estimate-generator' },
    { value: 2, name: 'Authorization Form', link: '/authorization-form' },
    { value: 3, name: 'Surgery Consent Form', link: '/surgery-consent-form' },
    { value: 4, name: 'Euthanasia Consent Form', link: '/euthanasia-consent-form' },
    { value: 5, name: 'Health Plan Contract', link: '/health-plan-contract' },
    { value: 6, name: 'Payment Plan Contract', link: '/payment-plan-contract' },
    { value: 7, name: 'Appointment Summary', link: '/appointment-summary' },
  ],

  AUTH_STATEMENT_1: 'I verify that I am the owner or authorized agent of this pet.',
  AUTH_STATEMENT_2:
    'I authorize Twin Peaks Veterinary Clinic to administer medical/surgical treatment as necessary. I understand that Twin Peaks Veterinary Clinic will use its best efforts, according to the standards of veterinary practice, to treat my pet but that there is no guarantee of any particular outcome. I release Twin Peaks Veterinary Clinic, its veterinarians, and staff from any and all liability for the treatment of my pet, except due to gross negiligence or intentional misconduct.',
  AUTH_STATEMENT_3: `I authorize Twin Peaks Veterinary Clinic to provide necessary treatment in the event of an emergency, according to the veterinarian's best judgment. I accept responsibility for those charges.`,
  AUTH_STATEMENT_4:
    'I understand that payment for all services is due in full at the time my pet is released from the clinic.',
  AUTH_SX_STATEMENT_1:
    'I understand that my pet will be placed under general anesthesia for this procedure. I understand that complications are rare but possible with any use of anesthesia, even in apparently healthy animals. I have discussed my concerns with the veterinarian.',
  AUTH_SX_STATEMENT_2:
    'I understand that the procedure will not be performed today if the preoperative bloodwork detects issues that could cause anesthetic complications.',
};
