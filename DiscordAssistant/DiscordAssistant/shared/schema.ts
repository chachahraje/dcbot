import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Bot configuration schema
export const botConfigs = pgTable("bot_configs", {
  id: serial("id").primaryKey(),
  token: text("token"),
  prefix: text("prefix").default("!"),
  status: text("status").default("online"),
  statusMessage: text("status_message").default("Serving commands!"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBotConfigSchema = createInsertSchema(botConfigs)
  .omit({ id: true, updatedAt: true });

// Commands schema
export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  enabled: boolean("enabled").default(true),
});

export const insertCommandSchema = createInsertSchema(commands)
  .omit({ id: true });

// Error logs schema
export const errorLogs = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  stack: text("stack"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertErrorLogSchema = createInsertSchema(errorLogs)
  .omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BotConfig = typeof botConfigs.$inferSelect;
export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;

export type Command = typeof commands.$inferSelect;
export type InsertCommand = z.infer<typeof insertCommandSchema>;

export type ErrorLog = typeof errorLogs.$inferSelect;
export type InsertErrorLog = z.infer<typeof insertErrorLogSchema>;
