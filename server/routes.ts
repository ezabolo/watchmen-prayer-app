import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertTrainingSchema, 
  insertQuizSchema, 
  insertProgressSchema,
  insertPartnerSchema,
  insertProjectSchema,
  insertProjectParticipantSchema,
  insertPrayerRequestSchema,
  insertEventSchema,
  insertEventRegistrationSchema,
  insertDonationSchema,
  insertBookSchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertSubscriberSchema,
  loginSchema,
  registerSchema,
  changePasswordSchema,
  adminResetPasswordSchema,
  adminToggleUserSchema,
  adminUpdateUserRoleSchema
} from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import MemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import crypto from "crypto";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./emailService";
import multer from "multer";
import path from "path";
import fs from "fs";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const JWT_SECRET = process.env.SESSION_SECRET || "default-secret-change-in-production";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const MemoryStoreSession = MemoryStore(session);
  const PgSession = connectPgSimple(session);
  
  // Use PostgreSQL session store in production for persistence across restarts
  const sessionStore = process.env.NODE_ENV === "production" 
    ? new PgSession({
        pool: pool as any,
        tableName: 'session',
        createTableIfMissing: true
      })
    : new MemoryStoreSession({
        checkPeriod: 86400000
      });
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        if (!user.password) {
          return done(null, false, { message: "Please use social login" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid email or password" });
        }
        if (!user.is_active) {
          return done(null, false, { message: "Account is deactivated" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await storage.getUserByGoogleId(profile.id);
        if (!user) {
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await storage.getUserByEmail(email);
            if (user) {
              user = await storage.updateUser(user.id, { google_id: profile.id });
            }
          }
          if (!user) {
            user = await storage.createUser({
              name: profile.displayName || "User",
              email: email || `${profile.id}@google.user`,
              google_id: profile.id,
              email_verified: true
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"]
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await storage.getUserByFacebookId(profile.id);
        if (!user) {
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await storage.getUserByEmail(email);
            if (user) {
              user = await storage.updateUser(user.id, { facebook_id: profile.id });
            }
          }
          if (!user) {
            user = await storage.createUser({
              name: profile.displayName || "User",
              email: email || `${profile.id}@facebook.user`,
              facebook_id: profile.id,
              email_verified: true
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  const authenticateJWT = async (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = await storage.getUser(decoded.userId);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (err) {}
    }
    next();
  };

  app.use(authenticateJWT);

  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.user || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const { confirmPassword, ...userData } = parsed.data;
      const existing = await storage.getUserByEmail(userData.email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const hashedPassword = await bcrypt.hash(userData.password!, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        email_verification_token: verificationToken,
        email_verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      // Skip email verification for now - user is created
      res.json({ message: "Registration successful. Please check your email to verify your account." });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }
      if (user.two_factor_enabled) {
        return res.json({ requiresTwoFactor: true, userId: user.id });
      }
      req.logIn(user, async (err) => {
        if (err) return next(err);
        await storage.updateUser(user.id, { last_login: new Date() });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: { ...user, password: undefined }, token });
      });
    })(req, res, next);
  });

  app.post("/api/auth/verify-2fa", async (req, res) => {
    try {
      const { userId, token } = req.body;
      const user = await storage.getUser(userId);
      if (!user || !user.two_factor_secret) {
        return res.status(400).json({ message: "Invalid request" });
      }
      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: "base32",
        token
      });
      if (!verified) {
        if (user.backup_codes?.includes(token)) {
          const newBackupCodes = user.backup_codes.filter(c => c !== token);
          await storage.updateUser(user.id, { backup_codes: newBackupCodes });
        } else {
          return res.status(400).json({ message: "Invalid code" });
        }
      }
      req.logIn(user, async (err) => {
        if (err) return res.status(500).json({ message: err.message });
        await storage.updateUser(user.id, { last_login: new Date() });
        const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: { ...user, password: undefined, two_factor_secret: undefined, backup_codes: undefined }, token: jwtToken });
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    
    app.get("/api/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
      res.redirect("/");
    });
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
    
    app.get("/api/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
      res.redirect("/");
    });
  }

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const user = { ...req.user as any, password: undefined, two_factor_secret: undefined };
    res.json({ user });
  });

  // User enrolled trainings and progress endpoints
  app.get("/api/me/enrolled-trainings", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const trainings = await storage.getUserEnrolledTrainings(user.id);
      res.json(trainings);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/me/progress", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const progress = await storage.getUserProgress(user.id);
      res.json(progress);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/auth/verify-email/:token", async (req, res) => {
    try {
      const user = await storage.getUserByVerificationToken(req.params.token);
      if (!user || (user.email_verification_expires && new Date() > user.email_verification_expires)) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      await storage.updateUser(user.id, {
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null
      });
      res.json({ message: "Email verified successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const user = req.user as any;
      if (!user.password) {
        return res.status(400).json({ message: "Password cannot be changed for social login accounts" });
      }
      const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);
      await storage.updateUser(user.id, { password: hashedPassword });
      res.json({ message: "Password changed successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/setup-2fa", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const secret = speakeasy.generateSecret({ name: `WatchmenWorld:${user.email}` });
      const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
      await storage.updateUser(user.id, { two_factor_secret: secret.base32 });
      res.json({ qrCode, secret: secret.base32 });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/enable-2fa", requireAuth, async (req, res) => {
    try {
      const { token } = req.body;
      const user = req.user as any;
      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: "base32",
        token
      });
      if (!verified) {
        return res.status(400).json({ message: "Invalid code" });
      }
      const backupCodes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString("hex"));
      await storage.updateUser(user.id, { 
        two_factor_enabled: true, 
        backup_codes: backupCodes 
      });
      res.json({ backupCodes });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/auth/disable-2fa", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      await storage.updateUser(user.id, { 
        two_factor_enabled: false, 
        two_factor_secret: null, 
        backup_codes: null 
      });
      res.json({ message: "Two-factor authentication disabled" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/trainings", async (req, res) => {
    try {
      const trainings = await storage.getTrainings();
      res.json(trainings);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/trainings/:id", async (req, res) => {
    try {
      const training = await storage.getTraining(parseInt(req.params.id));
      if (!training) {
        return res.status(404).json({ message: "Training not found" });
      }
      res.json(training);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/trainings/:id/content", async (req, res) => {
    try {
      const content = await storage.getTrainingContent(parseInt(req.params.id));
      res.json(content);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/trainings/:id/enroll", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const trainingId = parseInt(req.params.id);
      const training = await storage.getTraining(trainingId);
      if (!training) {
        return res.status(404).json({ message: "Training not found" });
      }
      const existing = await storage.getProgress(user.id, trainingId);
      if (existing) {
        return res.json({ message: "Already enrolled", progress: existing });
      }
      const progressEntry = await storage.createProgress({
        user_id: user.id,
        training_id: trainingId,
        completed: false,
        score: 0,
      });
      res.json({ message: "Enrolled successfully", progress: progressEntry });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/trainings", requireAdmin, async (req, res) => {
    try {
      const parsed = insertTrainingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const training = await storage.createTraining({ ...parsed.data, created_by: (req.user as any).id });
      res.json(training);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/trainings/:id", requireAdmin, async (req, res) => {
    try {
      const training = await storage.updateTraining(parseInt(req.params.id), req.body);
      res.json(training);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/trainings/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteTraining(parseInt(req.params.id));
      res.json({ message: "Training deleted" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/trainings/:id/structure", requireAdmin, async (req, res) => {
    try {
      await storage.updateTrainingStructure(parseInt(req.params.id), req.body.chapters);
      res.json({ message: "Structure updated" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress((req.user as any).id);
      res.json(progress);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/progress", requireAuth, async (req, res) => {
    try {
      const parsed = insertProgressSchema.safeParse({ ...req.body, user_id: (req.user as any).id });
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const existing = await storage.getProgress((req.user as any).id, parsed.data.training_id);
      if (existing) {
        const updated = await storage.updateProgress(existing.id, parsed.data);
        return res.json(updated);
      }
      const progress = await storage.createProgress(parsed.data);
      res.json(progress);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const parsed = insertEventSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const event = await storage.createEvent({ ...parsed.data, created_by: (req.user as any).id });
      res.json(event);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(parseInt(req.params.id), req.body);
      res.json(event);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/events/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(parseInt(req.params.id));
      res.json({ message: "Event deleted" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/events/:id/registrations", requireAuth, async (req, res) => {
    try {
      const registrations = await storage.getEventRegistrations(parseInt(req.params.id));
      res.json(registrations);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/events/:id/register", requireAuth, async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = (req.user as any).id;
      const existing = await storage.getEventRegistration(eventId, userId);
      if (existing) {
        return res.status(400).json({ message: "Already registered" });
      }
      const registration = await storage.createEventRegistration({
        event_id: eventId,
        user_id: userId,
        ...req.body
      });
      res.json(registration);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/prayer-requests", async (req, res) => {
    try {
      const publicOnly = req.query.public === "true";
      const requests = await storage.getPrayerRequests(publicOnly);
      res.json(requests);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/prayer-requests", async (req, res) => {
    try {
      const parsed = insertPrayerRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const request = await storage.createPrayerRequest({
        ...parsed.data,
        submitted_by: req.isAuthenticated() ? (req.user as any).id : null
      });
      res.json(request);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectWithParticipants(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const parsed = insertProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const project = await storage.createProject({ ...parsed.data, owner_id: (req.user as any).id });
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.updateProject(parseInt(req.params.id), req.body);
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteProject(parseInt(req.params.id));
      res.json({ message: "Project deleted" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/projects/:id/join", requireAuth, async (req, res) => {
    try {
      const participant = await storage.addProjectParticipant({
        project_id: parseInt(req.params.id),
        user_id: (req.user as any).id,
        ...req.body
      });
      res.json(participant);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getBooks();
      res.json(books);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const book = await storage.getBook(parseInt(req.params.id));
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  const cleanBookFormData = (body: any, files?: { [fieldname: string]: Express.Multer.File[] }) => {
    const data: any = {};

    if (body.title && body.title.trim()) data.title = body.title.trim();
    if (body.author && body.author.trim()) data.author = body.author.trim();
    if (body.description && body.description.trim()) data.description = body.description.trim();
    if (body.price) data.price = parseFloat(body.price);
    if (body.amazon_url && body.amazon_url.trim()) data.amazon_url = body.amazon_url.trim();
    if (body.isbn && body.isbn.trim()) data.isbn = body.isbn.trim();
    if (body.category && body.category.trim()) data.category = body.category.trim();
    if (body.publisher && body.publisher.trim()) data.publisher = body.publisher.trim();
    if (body.language && body.language.trim()) data.language = body.language.trim();
    if (body.pages) data.pages = parseInt(body.pages);
    if (body.stock_quantity !== undefined && body.stock_quantity !== '') data.stock_quantity = parseInt(body.stock_quantity) || 0;
    if (body.is_featured === true || body.is_featured === 'true') data.is_featured = true;
    else data.is_featured = false;

    if (files?.front_cover?.[0]) {
      data.front_cover_url = `/uploads/${files.front_cover[0].filename}`;
    } else if (body.front_cover_url && body.front_cover_url.trim()) {
      data.front_cover_url = body.front_cover_url.trim();
    }
    if (files?.back_cover?.[0]) {
      data.back_cover_url = `/uploads/${files.back_cover[0].filename}`;
    } else if (body.back_cover_url && body.back_cover_url.trim()) {
      data.back_cover_url = body.back_cover_url.trim();
    }

    return data;
  };

  app.post("/api/books", requireAdmin, upload.fields([
    { name: 'front_cover', maxCount: 1 },
    { name: 'back_cover', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const bookData = cleanBookFormData(req.body, files);

      const parsed = insertBookSchema.safeParse(bookData);
      if (!parsed.success) {
        const errors = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return res.status(400).json({ message: errors });
      }
      const book = await storage.createBook({ ...parsed.data, created_by: (req.user as any).id });
      res.json(book);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/books/:id", requireAdmin, upload.fields([
    { name: 'front_cover', maxCount: 1 },
    { name: 'back_cover', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const updateData = cleanBookFormData(req.body, files);

      const book = await storage.updateBook(parseInt(req.params.id), updateData);
      res.json(book);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/books/:id", requireAdmin, upload.fields([
    { name: 'front_cover', maxCount: 1 },
    { name: 'back_cover', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const updateData = cleanBookFormData(req.body, files);

      const book = await storage.updateBook(parseInt(req.params.id), updateData);
      res.json(book);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/books/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBook(parseInt(req.params.id));
      res.json({ message: "Book deleted" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/cart", requireAuth, async (req, res) => {
    try {
      const items = await storage.getCartItems((req.user as any).id);
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/cart", requireAuth, async (req, res) => {
    try {
      const parsed = insertCartItemSchema.safeParse({ ...req.body, user_id: (req.user as any).id });
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const item = await storage.addToCart(parsed.data);
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/cart/:id", requireAuth, async (req, res) => {
    try {
      const item = await storage.updateCartItem(parseInt(req.params.id), req.body.quantity);
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/cart/:id", requireAuth, async (req, res) => {
    try {
      await storage.removeFromCart(parseInt(req.params.id));
      res.json({ message: "Item removed" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/cart", requireAuth, async (req, res) => {
    try {
      await storage.clearCart((req.user as any).id);
      res.json({ message: "Cart cleared" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getUserOrders((req.user as any).id);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const order = await storage.createOrder({
        user_id: (req.user as any).id,
        ...req.body
      });
      if (req.body.items) {
        await storage.createOrderItems(req.body.items.map((item: any) => ({
          ...item,
          order_id: order.id
        })));
      }
      await storage.clearCart((req.user as any).id);
      res.json(order);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/paypal/order", requireAuth, async (req, res) => {
    try {
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        return res.json({ demo: true, message: "PayPal not configured" });
      }

      const { amount, currency = "USD", intent = "CAPTURE" } = req.body;
      const baseUrl = process.env.NODE_ENV === "production" 
        ? "https://api-m.paypal.com" 
        : "https://api-m.sandbox.paypal.com";

      const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!authResponse.ok) {
        throw new Error("Failed to authenticate with PayPal");
      }

      const { access_token } = await authResponse.json() as any;

      const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent,
          purchase_units: [{
            amount: {
              currency_code: currency,
              value: String(amount),
            },
            description: "Watchmen Nations Prayer Donation",
          }],
          application_context: {
            return_url: `${req.protocol}://${req.get('host')}/donate/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/donate`,
          },
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create PayPal order");
      }

      const orderData = await orderResponse.json();
      res.json(orderData);
    } catch (err: any) {
      console.error("PayPal order error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/paypal/order/:orderId/capture", requireAuth, async (req, res) => {
    try {
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        return res.status(500).json({ message: "PayPal not configured" });
      }

      const { orderId } = req.params;
      const baseUrl = process.env.NODE_ENV === "production" 
        ? "https://api-m.paypal.com" 
        : "https://api-m.sandbox.paypal.com";

      const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!authResponse.ok) {
        throw new Error("Failed to authenticate with PayPal");
      }

      const { access_token } = await authResponse.json() as any;

      const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!captureResponse.ok) {
        const errorData = await captureResponse.json() as any;
        throw new Error(errorData.message || "Failed to capture PayPal payment");
      }

      const captureData = await captureResponse.json();

      const user = req.user as any;
      try {
        const captureAmount = (captureData as any).purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
        if (captureAmount) {
          await storage.createDonation({
            user_id: user.id,
            amount: captureAmount,
            currency: "USD",
            payment_method: "paypal",
            payment_id: orderId,
            status: "completed",
          });
        }
      } catch (donationErr) {
        console.error("Failed to record donation:", donationErr);
      }

      res.json(captureData);
    } catch (err: any) {
      console.error("PayPal capture error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "usd"
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/donations", requireAuth, async (req, res) => {
    try {
      const donations = await storage.getDonationsByUser((req.user as any).id);
      res.json(donations);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/donations", requireAuth, async (req, res) => {
    try {
      const parsed = insertDonationSchema.safeParse({ ...req.body, user_id: (req.user as any).id });
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const donation = await storage.createDonation(parsed.data);
      res.json(donation);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getPartners();
      res.json(partners);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/partners", requireAuth, async (req, res) => {
    try {
      const parsed = insertPartnerSchema.safeParse({ ...req.body, user_id: (req.user as any).id });
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const partner = await storage.createPartner(parsed.data);
      res.json(partner);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const parsed = insertSubscriberSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const existing = await storage.getSubscriberByEmail(parsed.data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
      const subscriber = await storage.createSubscriber(parsed.data);
      await sendVerificationEmail(subscriber);
      res.json({ message: "Please check your email to verify your subscription" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/subscribe/verify/:token", async (req, res) => {
    try {
      const subscriber = await storage.getSubscriberByVerifyToken(req.params.token);
      if (!subscriber) {
        return res.status(400).json({ message: "Invalid token" });
      }
      await storage.updateSubscriber(subscriber.id, { verified: true, verifyToken: null });
      res.json({ message: "Subscription verified" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/unsubscribe/:token", async (req, res) => {
    try {
      const subscriber = await storage.getSubscriberByUnsubscribeToken(req.params.token);
      if (!subscriber) {
        return res.status(400).json({ message: "Invalid token" });
      }
      await storage.updateSubscriber(subscriber.id, { 
        wantsNewsletter: false, 
        wantsPrayerEvents: false 
      });
      res.json({ message: "Unsubscribed successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({ ...u, password: undefined, two_factor_secret: undefined })));
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/admin/users/reset-password", requireAdmin, async (req, res) => {
    try {
      const parsed = adminResetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);
      await storage.updateUser(parsed.data.userId, { password: hashedPassword });
      res.json({ message: "Password reset successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/admin/users/toggle-status", requireAdmin, async (req, res) => {
    try {
      const parsed = adminToggleUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      await storage.updateUser(parsed.data.userId, { is_active: parsed.data.isActive });
      res.json({ message: parsed.data.isActive ? "User activated" : "User deactivated" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/admin/users/update-role", requireAdmin, async (req, res) => {
    try {
      const parsed = adminUpdateUserRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors[0].message });
      }
      await storage.updateUser(parsed.data.userId, { role: parsed.data.role });
      res.json({ message: "Role updated" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
