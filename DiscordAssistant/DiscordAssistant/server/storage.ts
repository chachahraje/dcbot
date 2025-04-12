import { 
  users, 
  botConfigs, 
  commands, 
  errorLogs,
  type User, 
  type InsertUser, 
  type BotConfig, 
  type InsertBotConfig,
  type Command,
  type InsertCommand,
  type ErrorLog,
  type InsertErrorLog
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bot config operations
  getBotConfig(): Promise<BotConfig | undefined>;
  createOrUpdateBotConfig(config: InsertBotConfig): Promise<BotConfig>;
  
  // Commands operations
  getAllCommands(): Promise<Command[]>;
  getCommand(id: number): Promise<Command | undefined>;
  getCommandByName(name: string): Promise<Command | undefined>;
  createCommand(command: InsertCommand): Promise<Command>;
  updateCommand(id: number, command: Partial<InsertCommand>): Promise<Command | undefined>;
  deleteCommand(id: number): Promise<boolean>;
  
  // Error logs operations
  getAllErrorLogs(): Promise<ErrorLog[]>;
  createErrorLog(log: InsertErrorLog): Promise<ErrorLog>;
  clearErrorLogs(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private botConfigs: Map<number, BotConfig>;
  private commands: Map<number, Command>;
  private errorLogs: Map<number, ErrorLog>;
  
  private userIdCounter: number;
  private botConfigIdCounter: number;
  private commandIdCounter: number;
  private errorLogIdCounter: number;

  constructor() {
    this.users = new Map();
    this.botConfigs = new Map();
    this.commands = new Map();
    this.errorLogs = new Map();
    
    this.userIdCounter = 1;
    this.botConfigIdCounter = 1;
    this.commandIdCounter = 1;
    this.errorLogIdCounter = 1;
    
    // Initialize with default commands
    this.initializeDefaultCommands();
  }

  private initializeDefaultCommands() {
    const defaultCommands: InsertCommand[] = [
      { name: "ping", description: "Replies with Pong!", enabled: true },
      { name: "hello", description: "Greets the user", enabled: true },
      { name: "help", description: "Shows available commands", enabled: true }
    ];
    
    defaultCommands.forEach(cmd => this.createCommand(cmd));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Bot config operations
  async getBotConfig(): Promise<BotConfig | undefined> {
    // Return the first config or undefined if none exists
    const configs = Array.from(this.botConfigs.values());
    return configs.length > 0 ? configs[0] : undefined;
  }
  
  async createOrUpdateBotConfig(config: InsertBotConfig): Promise<BotConfig> {
    const existing = await this.getBotConfig();
    
    if (existing) {
      // Update existing config
      const updated: BotConfig = {
        ...existing,
        ...config,
        updatedAt: new Date()
      };
      this.botConfigs.set(existing.id, updated);
      return updated;
    } else {
      // Create new config
      const id = this.botConfigIdCounter++;
      const newConfig: BotConfig = {
        ...config,
        id,
        updatedAt: new Date()
      };
      this.botConfigs.set(id, newConfig);
      return newConfig;
    }
  }
  
  // Commands operations
  async getAllCommands(): Promise<Command[]> {
    return Array.from(this.commands.values());
  }
  
  async getCommand(id: number): Promise<Command | undefined> {
    return this.commands.get(id);
  }
  
  async getCommandByName(name: string): Promise<Command | undefined> {
    return Array.from(this.commands.values()).find(
      (cmd) => cmd.name === name
    );
  }
  
  async createCommand(command: InsertCommand): Promise<Command> {
    const id = this.commandIdCounter++;
    const newCommand: Command = { ...command, id };
    this.commands.set(id, newCommand);
    return newCommand;
  }
  
  async updateCommand(id: number, command: Partial<InsertCommand>): Promise<Command | undefined> {
    const existing = await this.getCommand(id);
    
    if (!existing) {
      return undefined;
    }
    
    const updated: Command = {
      ...existing,
      ...command
    };
    
    this.commands.set(id, updated);
    return updated;
  }
  
  async deleteCommand(id: number): Promise<boolean> {
    return this.commands.delete(id);
  }
  
  // Error logs operations
  async getAllErrorLogs(): Promise<ErrorLog[]> {
    return Array.from(this.errorLogs.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }
  
  async createErrorLog(log: InsertErrorLog): Promise<ErrorLog> {
    const id = this.errorLogIdCounter++;
    const newLog: ErrorLog = {
      ...log,
      id,
      timestamp: new Date()
    };
    this.errorLogs.set(id, newLog);
    return newLog;
  }
  
  async clearErrorLogs(): Promise<void> {
    this.errorLogs.clear();
  }
}

export const storage = new MemStorage();
