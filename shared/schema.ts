import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['watchman', 'partner', 'admin', 'regional_leader']);

// Regions enum
export const regionEnum = pgEnum('region', [
  'africa', 'asia', 'europe', 'north_america', 'south_america', 'oceania', 'middle_east'
]);

// Training type enum
export const trainingTypeEnum = pgEnum('training_type', ['video', 'pdf', 'qcm']);

// Prayer request category enum
export const prayerRequestCategoryEnum = pgEnum('prayer_request_category', [
  'personal', 'family', 'healing', 'guidance', 'global_issues', 'other'
]);

// Event category enum
export const eventCategoryEnum = pgEnum('event_category', [
  'intercessory', 'childbirth', '24h_prayer', 'worship', 'fasting', 'other'
]);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: userRoleEnum("role").notNull().default('watchman'),
  region: regionEnum("region"),
  registered_at: timestamp("registered_at").defaultNow(),
  google_id: text("google_id"),
  facebook_id: text("facebook_id"),
  apple_id: text("apple_id"),
  two_factor_enabled: boolean("two_factor_enabled").default(false),
  two_factor_secret: text("two_factor_secret"),
  backup_codes: text("backup_codes").array(),
  email_verified: boolean("email_verified").default(false),
  email_verification_token: text("email_verification_token"),
  email_verification_expires: timestamp("email_verification_expires"),
  is_active: boolean("is_active").default(true),
  last_login: timestamp("last_login"),
});

// Training schema
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: trainingTypeEnum("type").notNull(),
  file_url: text("file_url"),
  created_at: timestamp("created_at").defaultNow(),
  created_by: integer("created_by").references(() => users.id),
});

// Training chapters schema
export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  training_id: integer("training_id").references(() => trainings.id).notNull(),
  title: text("title").notNull(),
  order_index: integer("order_index").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Training sections schema
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  chapter_id: integer("chapter_id").references(() => chapters.id).notNull(),
  title: text("title").notNull(),
  content: text("content"),
  video_url: text("video_url"),
  file_url: text("file_url"),
  order_index: integer("order_index").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Quiz schema
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  training_id: integer("training_id").references(() => trainings.id).notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correct_answer: text("correct_answer").notNull(),
});

// Progress schema
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  training_id: integer("training_id").references(() => trainings.id).notNull(),
  completed: boolean("completed").default(false),
  score: integer("score"),
  completed_at: timestamp("completed_at"),
});

// Partners schema
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  org_name: text("org_name").notNull(),
  logo: text("logo"),
  since: timestamp("since").defaultNow(),
});

// Projects schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // Prayer Watch | Training | Outreach | Media | Conference | Network/Partnership | Other
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  primary_scripture: text("primary_scripture"),
  visibility: text("visibility").notNull().default("Public"), // Public | Members | Private
  cover_url: text("cover_url"),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date"),
  ongoing: boolean("ongoing").default(false),
  timezone: text("timezone").default("UTC"),
  rhythm: text("rhythm"), // One-time | Weekly | Monthly | 24/7 Watch | Custom
  slot_length_minutes: integer("slot_length_minutes"),
  owner_id: integer("owner_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("Draft"), // Draft | Review | Published
  max_team_size: integer("max_team_size").default(0),
  allow_public_signup: boolean("allow_public_signup").default(true),
  approval_mode: text("approval_mode").default("Auto"), // Auto | Manual
  capacity_total: integer("capacity_total").default(0),
  capacity_per_slot: integer("capacity_per_slot").default(5),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Prayer requests schema
export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  name: text("name"),
  message: text("message").notNull(),
  anonymous: boolean("anonymous").default(false),
  category: prayerRequestCategoryEnum("category").notNull(),
  submitted_at: timestamp("submitted_at").defaultNow(),
  is_public: boolean("is_public").default(false),
  submitted_by: integer("submitted_by").references(() => users.id),
});

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  location: text("location"),
  image_url: text("image_url"),
  media_urls: text("media_urls").array(),
  category: eventCategoryEnum("category").notNull(),
  poc_name: text("poc_name"),
  poc_phone: text("poc_phone"),
  poc_email: text("poc_email"),
  created_by: integer("created_by").references(() => users.id),
});

// Event registrations schema
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id").references(() => events.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed | cancelled
  registered_at: timestamp("registered_at").defaultNow(),
  notes: text("notes"),
});

// Donations schema
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  date: timestamp("date").defaultNow(),
  method: text("method").notNull(),
  partner_id: integer("partner_id").references(() => partners.id),
  user_id: integer("user_id").references(() => users.id),
  project_id: integer("project_id").references(() => projects.id),
});

// Books schema
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // Price in dollars
  front_cover_url: text("front_cover_url"),
  back_cover_url: text("back_cover_url"),
  amazon_url: text("amazon_url"), // Amazon purchase link
  isbn: text("isbn"),
  pages: integer("pages"),
  language: text("language").default("English"),
  publisher: text("publisher"),
  published_date: timestamp("published_date"),
  category: text("category"),
  stock_quantity: integer("stock_quantity").default(0),
  is_featured: boolean("is_featured").default(false),
  created_at: timestamp("created_at").defaultNow(),
  created_by: integer("created_by").references(() => users.id),
});

// Cart items schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  book_id: integer("book_id").references(() => books.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  added_at: timestamp("added_at").defaultNow(),
});

// Orders schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  total_amount: integer("total_amount").notNull(), // Total in cents
  status: text("status").notNull().default("pending"), // pending, completed, cancelled
  payment_method: text("payment_method"), // stripe, paypal
  payment_id: text("payment_id"), // Stripe/PayPal transaction ID
  shipping_address: text("shipping_address"),
  created_at: timestamp("created_at").defaultNow(),
  completed_at: timestamp("completed_at"),
});

// Subscribers schema
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  postal: text("postal"),
  wantsNewsletter: boolean("wants_newsletter").default(false),
  wantsPrayerEvents: boolean("wants_prayer_events").default(false),
  verified: boolean("verified").default(false),
  verifyToken: text("verify_token"),
  unsubscribeToken: text("unsubscribe_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: integer("order_id").references(() => orders.id).notNull(),
  book_id: integer("book_id").references(() => books.id).notNull(),
  quantity: integer("quantity").notNull(),
  price_per_item: numeric("price_per_item", { precision: 10, scale: 2 }).notNull(), // Price in dollars at time of order
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, registered_at: true });
export const insertTrainingSchema = createInsertSchema(trainings).omit({ id: true, created_at: true });
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true, created_at: true });
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true, created_at: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true });
export const insertProgressSchema = createInsertSchema(progress).omit({ id: true, completed_at: true });
export const insertPartnerSchema = createInsertSchema(partners).omit({ id: true, since: true });
// Project participation schema
export const projectParticipants = pgTable("project_participants", {
  id: serial("id").primaryKey(),
  project_id: integer("project_id").references(() => projects.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  role: text("role"), // Intercessor, Trainer, Organizer, Media Host, etc.
  status: text("status").notNull().default("pending"), // pending | approved | declined
  notes: text("notes"),
  joined_at: timestamp("joined_at").defaultNow(),
});

// Project budget schema
export const projectBudgets = pgTable("project_budgets", {
  id: serial("id").primaryKey(),
  project_id: integer("project_id").references(() => projects.id).notNull(),
  has_final_cost: boolean("has_final_cost").default(false),
  final_cost_cents: integer("final_cost_cents").default(0),
  currency: text("currency").default("USD"),
  internal_funds_cents: integer("internal_funds_cents").default(0),
  funding_goal_cents: integer("funding_goal_cents").default(0),
  min_contribution_cents: integer("min_contribution_cents").default(0),
  donation_link: text("donation_link"),
  financial_contact_name: text("financial_contact_name"),
  financial_contact_email: text("financial_contact_email"),
});

// Partner contributions schema
export const partnerContributions = pgTable("partner_contributions", {
  id: serial("id").primaryKey(),
  project_id: integer("project_id").references(() => projects.id).notNull(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  amount_cents: integer("amount_cents").notNull(),
  currency: text("currency").default("USD"),
  is_recurring: boolean("is_recurring").default(false),
  interval_months: integer("interval_months").default(1),
  status: text("status").notNull().default("pending"), // pending | confirmed | failed | canceled
  provider: text("provider"), // stripe | paypal | manual
  provider_payment_id: text("provider_payment_id"),
  created_at: timestamp("created_at").defaultNow(),
  confirmed_at: timestamp("confirmed_at"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, created_at: true, updated_at: true });
export const insertProjectParticipantSchema = createInsertSchema(projectParticipants).omit({ id: true, joined_at: true });
export const insertProjectBudgetSchema = createInsertSchema(projectBudgets).omit({ id: true });
export const insertPartnerContributionSchema = createInsertSchema(partnerContributions).omit({ id: true, created_at: true, confirmed_at: true });
export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).omit({ id: true, submitted_at: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true }).extend({
  start_date: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
  end_date: z.string().or(z.date()).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  })
});
export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({ id: true, registered_at: true });
export const insertDonationSchema = createInsertSchema(donations).omit({ id: true, date: true });
export const insertBookSchema = createInsertSchema(books).omit({ id: true, created_at: true }).extend({
  price: z.number().positive().or(z.string().pipe(z.coerce.number().positive()))
});
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, added_at: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, created_at: true, completed_at: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertSubscriberSchema = createInsertSchema(subscribers).omit({ id: true, createdAt: true, updatedAt: true, verifyToken: true, unsubscribeToken: true });

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});

// Admin user management schemas
export const adminResetPasswordSchema = z.object({
  userId: z.number().int().positive(),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const adminToggleUserSchema = z.object({
  userId: z.number().int().positive(),
  isActive: z.boolean(),
});

export const adminUpdateUserRoleSchema = z.object({
  userId: z.number().int().positive(),
  role: z.enum(['watchman', 'partner', 'admin', 'regional_leader']),
});



// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type Training = typeof trainings.$inferSelect;
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectParticipant = typeof projectParticipants.$inferSelect;
export type InsertProjectParticipant = z.infer<typeof insertProjectParticipantSchema>;
export type ProjectBudget = typeof projectBudgets.$inferSelect;
export type InsertProjectBudget = z.infer<typeof insertProjectBudgetSchema>;
export type PartnerContribution = typeof partnerContributions.$inferSelect;
export type InsertPartnerContribution = z.infer<typeof insertPartnerContributionSchema>;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type AdminResetPassword = z.infer<typeof adminResetPasswordSchema>;
export type AdminToggleUser = z.infer<typeof adminToggleUserSchema>;
export type AdminUpdateUserRole = z.infer<typeof adminUpdateUserRoleSchema>;
