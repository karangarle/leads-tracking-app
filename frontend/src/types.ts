export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  createdAt: string;
}

export interface Note {
  id: number;
  leadId: number;
  content: string;
  createdAt: string;
}

export interface PaginatedLeads {
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
