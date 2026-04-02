export type Role = 'Admin' | 'Employee';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  workspaceId: string;
  createdAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  gstin: string;
  industryType: string;
  createdAt: Date;
  ownerId: string;
}

export interface Document {
  id: string;
  workspaceId: string;
  uploadedBy: string; // User ID
  fileName: string;
  fileUrl: string; // Firebase Storage URL
  fileType: string; // e.g., 'application/pdf', 'application/vnd.ms-excel'
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  extractedData?: Record<string, any>; // Parsed JSON data (e.g., GST details)
  uploadedAt: Date;
}

export interface AgentLog {
  id: string;
  workspaceId: string;
  agentId: string; // e.g., 'email-manager', 'auto-report-generator'
  action: string; // e.g., 'Generated Daily Sales Report'
  status: 'Success' | 'Failed' | 'In Progress';
  details?: string;
  timestamp: Date;
  triggeredBy: string; // User ID or 'System'
}
