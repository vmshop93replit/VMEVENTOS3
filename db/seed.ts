import { db } from "./index";
import * as schema from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    // Verificar se a tabela de usuários está vazia
    const existingUsers = await db.select().from(schema.users).limit(1);
    
    if (existingUsers.length === 0) {
      // Criar o usuário administrador
      const hashedPassword = await hashPassword("939393");
      await db.insert(schema.users).values({
        username: "admvini",
        password: hashedPassword,
      });
      
      console.log("✅ Admin user created successfully");
    } else {
      console.log("⏩ Users table already has data, skipping seed");
    }
    
    // Verificar se a tabela de contatos está vazia
    const existingContacts = await db.select().from(schema.contacts).limit(1);
    
    if (existingContacts.length === 0) {
      // Inserir contatos de exemplo se não existirem
      await db.insert(schema.contacts).values([
        {
          name: "João Silva",
          phone: "(11) 98765-4321",
          eventType: "casamento",
          message: "Gostaria de informações para um casamento em dezembro para 150 convidados.",
        },
        {
          name: "Maria Oliveira",
          phone: "(21) 99876-5432",
          eventType: "corporativo",
          message: "Preciso de orçamento para um evento corporativo de final de ano.",
        },
        {
          name: "Carlos Santos",
          phone: "(31) 97654-3210",
          eventType: "aniversario",
          message: "Estou organizando meu aniversário de 30 anos, gostaria de receber mais informações.",
        },
      ]);
      
      console.log("✅ Contact seed data inserted successfully");
    } else {
      console.log("⏩ Contact table already has data, skipping seed");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seed();
