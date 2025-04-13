export interface BotConfig {
  id?: number;
  token?: string;
  prefix: string;
  status: 'online' | 'idle' | 'dnd' | 'invisible';
  statusMessage: string;
  updatedAt?: Date;
}

export interface BotStatus {
  isOnline: boolean;
  lastRestart: Date;
}

export interface Command {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

export interface ErrorLog {
  id: number;
  message: string;
  stack?: string;
  timestamp: Date;
}

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}
