export type PersistOrderPayload = {
  applicant: {
    name: string;
    email: string;
    phone: string;
    residentialStreet?: string;
    residentialCity?: string;
    residentialState?: string;
    residentialZip?: string;
  };
  order: {
    serviceType: string;
    status: string;
    approvedAt: string;
  };
  llc: {
    legalName: string;
    state: string;
    businessActivityLabel: string;
    principalStreet: string;
    principalCity: string;
    principalState: string;
    principalZip: string;
    principalSameAsApplicantAddress?: boolean;
    managementType: string;
    memberCount: number;
  };
  members: Array<{
    fullName: string;
    address: string;
    ownershipPercentage: string;
  }>;
  registeredAgent: {
    choice: string | null;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  einDetails?: {
    reasonForApplying: string | null;
    entityType: string | null;
    responsiblePartyName: string;
    responsiblePartyPassportNumber: string;
    startDate: string;
    fiscalClosingMonth: string;
  };
  generatedForms: Array<{
    formType: string;
    customerApproved: boolean;
  }>;
};

export type DocumentFiles = {
  passport: File | null;
  addressProof: File | null;
};

export type PersistOrderResult = {
  orderId: string;
  protocolNumber: string;
};
