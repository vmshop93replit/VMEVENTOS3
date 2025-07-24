import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
// Pool removido - usando Supabase diretamente
import { User as SelectUser } from "@shared/schema";
import { db } from "../db";
import { users, insertUserSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  if (!stored) {
    console.error('❌ Password hash está undefined ou vazio');
    return false;
  }
  
  console.log(`🔐 Comparando senha. Hash armazenado: ${stored.substring(0, 20)}...`);
  
  try {
    // Verificar se é hash bcrypt (formato $2b$...)
    if (stored.startsWith('$2b$')) {
      console.log('✅ Usando bcrypt para validação');
      const bcrypt = await import('bcrypt');
      const isValid = await bcrypt.compare(supplied, stored);
      console.log(`🔒 Resultado bcrypt: ${isValid}`);
      return isValid;
    }
    
    // Fallback para formato antigo com scrypt
    console.log('⚠️ Usando scrypt para validação (formato antigo)');
    const parts = stored.split(".");
    if (parts.length !== 2) {
      console.error('❌ Formato de hash inválido para scrypt');
      return false;
    }
    
    const [hashed, salt] = parts;
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error('❌ Erro na comparação de senha:', error);
    return false;
  }
}

// Funções para gerenciar usuários no banco de dados - usando Supabase diretamente
async function getUserByUsername(username: string) {
  try {
    // Usar Supabase client diretamente como fallback
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://vjjcffkkszsrcvdxxgxy.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqamNmZmtrc3pzcmN2ZHh4Z3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyMDk5MSwiZXhwIjoyMDY4ODk2OTkxfQ.zuToNduxxxZbMumsSo3yfcJczKZEMpa3wVkeYVlBw_A';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`🔍 Buscando usuário diretamente no Supabase: ${username}`);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ Usuário não encontrado');
        return null;
      }
      console.error('❌ Erro na busca Supabase:', error);
      return null;
    }
    
    console.log('✅ Usuário encontrado via Supabase:', { 
      id: data.id, 
      username: data.username, 
      hasPasswordHash: !!data.password_hash 
    });
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuário via Supabase:', error);
    return null;
  }
}

async function getUser(id: number) {
  try {
    // Usar Supabase client diretamente
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = 'https://vjjcffkkszsrcvdxxgxy.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqamNmZmtrc3pzcmN2ZHh4Z3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyMDk5MSwiZXhwIjoyMDY4ODk2OTkxfQ.zuToNduxxxZbMumsSo3yfcJczKZEMpa3wVkeYVlBw_A';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erro ao buscar usuário por ID via Supabase:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    return null;
  }
}

async function createUser(userData: { username: string; password: string }) {
  const result = await db.insert(users).values(userData).returning().execute();
  return result[0];
}

export function setupAuth(app: Express) {
  // Usar session simples sem PostgreSQL store para compatibilidade com Supabase
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "vm-eventos-secret-key",
    resave: false,
    saveUninitialized: false,
    // Remover store do PostgreSQL - usar memória temporariamente
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`🔐 Tentativa de login para usuário: ${username}`);
        const user = await getUserByUsername(username);
        
        if (!user) {
          console.log('❌ Usuário não encontrado');
          return done(null, false);
        }

        console.log('✅ Usuário encontrado:', { id: user.id, username: user.username, hasPassword: !!user.password_hash });
        
        if (!user.password_hash) {
          console.log('❌ Password hash está vazio no banco');
          return done(null, false);  
        }

        const isPasswordValid = await comparePasswords(password, user.password_hash);
        console.log(`🔒 Validação de senha para ${username}:`, isPasswordValid);
        
        if (!isPasswordValid) {
          return done(null, false);
        }

        console.log('🎉 Login bem-sucedido para:', username);
        return done(null, user);
      } catch (error) {
        console.error('❌ Erro na autenticação:', error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "Nome de usuário já existe" });
      }

      const validatedData = insertUserSchema.parse(req.body);
      const user = await createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: SelectUser | false, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
      
      req.login(user, (err: Error | null) => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Não autenticado" });
    res.json(req.user);
  });
}