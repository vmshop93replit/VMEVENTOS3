import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPageVisitSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Não autorizado" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const newContact = await storage.insertContact(contactData);
      
      return res.status(201).json({
        message: "Contact request submitted successfully",
        contact: newContact,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      console.error("Error submitting contact:", error);
      return res.status(500).json({ error: "Failed to submit contact request" });
    }
  });

  // Get all contacts endpoint (protected route)
  app.get("/api/contacts", isAuthenticated, async (req, res) => {
    try {
      const allContacts = await storage.getAllContacts();
      return res.status(200).json(allContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Delete contact endpoint (protected route)
  app.delete("/api/contacts/:id", isAuthenticated, async (req, res) => {
    try {
      const contactId = parseInt(req.params.id);
      
      if (isNaN(contactId)) {
        return res.status(400).json({ error: "ID do contato inválido" });
      }

      const deletedContact = await storage.deleteContact(contactId);
      
      if (!deletedContact) {
        return res.status(404).json({ error: "Contato não encontrado" });
      }

      return res.status(200).json({
        message: "Contato excluído com sucesso",
        contact: deletedContact,
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      return res.status(500).json({ error: "Erro ao excluir contato" });
    }
  });

  // Rota para registrar uma visita
  app.post("/api/page-visit", async (req, res) => {
    try {
      // Coletando informações do cliente
      const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      const visitData = insertPageVisitSchema.parse({
        ...req.body,
        ip_address: clientIp as string,
        user_agent: userAgent
      });
      
      const newVisit = await storage.recordPageVisit(visitData);
      return res.status(201).json({
        message: "Page visit recorded successfully",
        visit: newVisit
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      console.error("Error recording page visit:", error);
      return res.status(500).json({ error: "Failed to record page visit" });
    }
  });

  // Rota para obter estatísticas de visitas (protegida)
  app.get("/api/page-visits/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getPageVisitStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching page visit stats:", error);
      return res.status(500).json({ error: "Failed to fetch page visit statistics" });
    }
  });

  // Rota para obter todas as visitas (protegida)
  app.get("/api/page-visits", isAuthenticated, async (req, res) => {
    try {
      const visits = await storage.getAllPageVisits();
      return res.status(200).json(visits);
    } catch (error) {
      console.error("Error fetching page visits:", error);
      return res.status(500).json({ error: "Failed to fetch page visits" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
