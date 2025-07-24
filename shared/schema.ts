import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Tabela para contagem de visitas
export const pageVisits = pgTable("page_visits", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  visited_at: timestamp("visited_at").defaultNow().notNull(),
});

export const insertPageVisitSchema = createInsertSchema(pageVisits, {
  page: (schema) => schema.min(1, "Página é obrigatória"),
  ip_address: (schema) => schema.optional(),
  user_agent: (schema) => schema.optional(),
});

export type InsertPageVisit = z.infer<typeof insertPageVisitSchema>;
export type PageVisit = typeof pageVisits.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact form schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  event_type: text("event_type").notNull(),
  message: text("message"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts, {
  name: (schema) => schema.min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: (schema) => schema.regex(/^\(\d{2}\)\s9\d{4}-\d{4}$/, "Formato deve ser (00) 90000-0000 com 11 dígitos"),
  event_type: (schema) => schema.min(1, "Selecione um tipo de evento"),
  message: (schema) => schema.optional(),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
