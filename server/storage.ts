import { users, trainings, chapters, sections, quizzes, progress, partners, projects, projectParticipants, projectBudgets, partnerContributions, prayerRequests, events, eventRegistrations, donations, books, cartItems, orders, orderItems, subscribers } from "@shared/schema";
import type { 
  User, InsertUser, 
  Training, InsertTraining, 
  Quiz, InsertQuiz, 
  Progress, InsertProgress, 
  Partner, InsertPartner, 
  Project, InsertProject,
  ProjectParticipant, InsertProjectParticipant,
  ProjectBudget, InsertProjectBudget,
  PartnerContribution, InsertPartnerContribution,
  PrayerRequest, InsertPrayerRequest, 
  Event, InsertEvent, 
  EventRegistration, InsertEventRegistration,
  Donation, InsertDonation,
  Book, InsertBook,
  CartItem, InsertCartItem,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Subscriber, InsertSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray, desc } from "drizzle-orm";
import crypto from "crypto";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  getUserByAppleId(appleId: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Training operations
  getTraining(id: number): Promise<Training | undefined>;
  getTrainings(): Promise<Training[]>;
  getTrainingContent(trainingId: number): Promise<{ chapters: any[] }>;
  createTraining(training: InsertTraining): Promise<Training>;
  updateTraining(id: number, training: Partial<Training>): Promise<Training | undefined>;
  deleteTraining(id: number): Promise<boolean>;
  updateTrainingStructure(trainingId: number, chapters: any[]): Promise<void>;
  
  // Quiz operations
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizzesByTraining(trainingId: number): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Progress operations
  getProgress(userId: number, trainingId: number): Promise<Progress | undefined>;
  getUserProgress(userId: number): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  updateProgress(id: number, progress: Partial<Progress>): Promise<Progress>;
  
  // Partner operations
  getPartner(id: number): Promise<Partner | undefined>;
  getPartnerByUserId(userId: number): Promise<Partner | undefined>;
  getPartners(): Promise<Partner[]>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getProjectsByPartner(partnerId: number): Promise<Project[]>;
  getProjectWithParticipants(id: number): Promise<(Project & { participants: ProjectParticipant[] }) | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Project Participants
  getProjectParticipants(projectId: number): Promise<ProjectParticipant[]>;
  addProjectParticipant(participant: InsertProjectParticipant): Promise<ProjectParticipant>;
  updateProjectParticipant(id: number, updates: Partial<InsertProjectParticipant>): Promise<ProjectParticipant | undefined>;
  removeProjectParticipant(projectId: number, userId: number): Promise<boolean>;
  
  // Prayer Request operations
  getPrayerRequest(id: number): Promise<PrayerRequest | undefined>;
  getPrayerRequests(publicOnly?: boolean): Promise<PrayerRequest[]>;
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Event registration operations
  getEventRegistration(eventId: number, userId: number): Promise<EventRegistration | undefined>;
  getEventRegistrations(eventId: number): Promise<EventRegistration[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  getUserById(id: number): Promise<User | undefined>;
  
  // Donation operations
  getDonation(id: number): Promise<Donation | undefined>;
  getDonations(): Promise<Donation[]>;
  getDonationsByUser(userId: number): Promise<Donation[]>;
  getDonationsByPartner(partnerId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Book operations
  getBook(id: number): Promise<Book | undefined>;
  getBooks(): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;

  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string, paymentId?: string): Promise<Order | undefined>;
  createOrderItems(orderItems: InsertOrderItem[]): Promise<OrderItem[]>;

  // Subscriber operations
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getSubscriberByVerifyToken(token: string): Promise<Subscriber | undefined>;
  getSubscriberByUnsubscribeToken(token: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: number, subscriber: Partial<Subscriber>): Promise<Subscriber>;
  getVerifiedSubscribers(wantsPrayerEvents?: boolean): Promise<Subscriber[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.google_id, googleId));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.facebook_id, facebookId));
    return user;
  }

  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.apple_id, appleId));
    return user;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email_verification_token, token));
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Training operations
  async getTraining(id: number): Promise<Training | undefined> {
    const [training] = await db.select().from(trainings).where(eq(trainings.id, id));
    return training || undefined;
  }

  async getTrainings(): Promise<Training[]> {
    return await db.select().from(trainings);
  }

  async getTrainingContent(trainingId: number): Promise<{ chapters: any[] }> {
    // Get chapters with their sections
    const chaptersResult = await db
      .select()
      .from(chapters)
      .where(eq(chapters.training_id, trainingId))
      .orderBy(chapters.order_index);

    const chaptersWithSections = await Promise.all(
      chaptersResult.map(async (chapter) => {
        const sectionsResult = await db
          .select()
          .from(sections)
          .where(eq(sections.chapter_id, chapter.id))
          .orderBy(sections.order_index);

        return {
          ...chapter,
          sections: sectionsResult
        };
      })
    );

    return { chapters: chaptersWithSections };
  }

  async createTraining(trainingData: InsertTraining): Promise<Training> {
    const [training] = await db.insert(trainings).values(trainingData).returning();
    return training;
  }

  async updateTraining(id: number, trainingUpdate: Partial<Training>): Promise<Training | undefined> {
    const [training] = await db
      .update(trainings)
      .set(trainingUpdate)
      .where(eq(trainings.id, id))
      .returning();
    return training || undefined;
  }

  async deleteTraining(id: number): Promise<boolean> {
    const result = await db.delete(trainings).where(eq(trainings.id, id));
    return result.rowCount! > 0;
  }

  async updateTrainingStructure(trainingId: number, chapterData: any[]): Promise<void> {
    // First get all existing chapters for this training
    const existingChapters = await db.select().from(chapters).where(eq(chapters.training_id, trainingId));
    
    // Delete sections for all chapters
    for (const chapter of existingChapters) {
      await db.delete(sections).where(eq(sections.chapter_id, chapter.id));
    }
    
    // Delete all chapters for this training
    await db.delete(chapters).where(eq(chapters.training_id, trainingId));

    // Then insert the new structure
    for (const chapter of chapterData) {
      const [insertedChapter] = await db.insert(chapters).values({
        training_id: trainingId,
        title: chapter.title,
        order_index: chapter.order_index || 0
      }).returning();

      // Insert sections for this chapter
      if (chapter.sections && chapter.sections.length > 0) {
        for (const section of chapter.sections) {
          await db.insert(sections).values({
            chapter_id: insertedChapter.id,
            title: section.title,
            content: section.content || '',
            video_url: section.video_url || null,
            file_url: section.file_url || null,
            order_index: section.order_index || 0
          });
        }
      }
    }
  }

  // Quiz operations
  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async getQuizzesByTraining(trainingId: number): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.training_id, trainingId));
  }

  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(quizData).returning();
    return quiz;
  }

  // Progress operations
  async getProgress(userId: number, trainingId: number): Promise<Progress | undefined> {
    const [progressEntry] = await db.select().from(progress)
      .where(and(eq(progress.user_id, userId), eq(progress.training_id, trainingId)));
    return progressEntry || undefined;
  }

  async getUserProgress(userId: number): Promise<Progress[]> {
    return await db.select().from(progress).where(eq(progress.user_id, userId));
  }

  async createProgress(progressData: InsertProgress): Promise<Progress> {
    const [progressEntry] = await db.insert(progress).values(progressData).returning();
    return progressEntry;
  }

  async updateProgress(id: number, progressUpdate: Partial<Progress>): Promise<Progress> {
    const [progressEntry] = await db.update(progress)
      .set(progressUpdate)
      .where(eq(progress.id, id))
      .returning();
    return progressEntry;
  }

  // Partner operations
  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async getPartnerByUserId(userId: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.user_id, userId));
    return partner || undefined;
  }

  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partners);
  }

  async createPartner(partnerData: InsertPartner): Promise<Partner> {
    const [partner] = await db.insert(partners).values(partnerData).returning();
    return partner;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectsByPartner(partnerId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.sponsored_by, partnerId));
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  }

  // Prayer Request operations
  async getPrayerRequest(id: number): Promise<PrayerRequest | undefined> {
    const [request] = await db.select().from(prayerRequests).where(eq(prayerRequests.id, id));
    return request || undefined;
  }

  async getPrayerRequests(publicOnly: boolean = false): Promise<PrayerRequest[]> {
    if (publicOnly) {
      return await db.select().from(prayerRequests).where(eq(prayerRequests.is_public, true));
    }
    return await db.select().from(prayerRequests);
  }

  async createPrayerRequest(requestData: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db.insert(prayerRequests).values(requestData).returning();
    return request;
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await db.update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning();
    return event || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Event registration operations
  async getEventRegistration(eventId: number, userId: number): Promise<EventRegistration | undefined> {
    const [registration] = await db.select().from(eventRegistrations)
      .where(and(eq(eventRegistrations.event_id, eventId), eq(eventRegistrations.user_id, userId)));
    return registration || undefined;
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    return await db.select().from(eventRegistrations).where(eq(eventRegistrations.event_id, eventId));
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const [newRegistration] = await db.insert(eventRegistrations).values(registration).returning();
    return newRegistration;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  // Donation operations
  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation || undefined;
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations);
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.user_id, userId));
  }

  async getDonationsByPartner(partnerId: number): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.partner_id, partnerId));
  }

  async createDonation(donationData: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(donationData).returning();
    return donation;
  }

  // Book operations
  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book || undefined;
  }

  async getBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async createBook(bookData: InsertBook): Promise<Book> {
    const [book] = await db.insert(books).values(bookData).returning();
    return book;
  }

  async updateBook(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
    const [book] = await db.update(books)
      .set(bookData)
      .where(eq(books.id, id))
      .returning();
    return book || undefined;
  }

  async deleteBook(id: number): Promise<boolean> {
    const result = await db.delete(books).where(eq(books.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.user_id, userId));
  }

  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(cartItemData).returning();
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.user_id, userId));
    return (result.rowCount || 0) >= 0;
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.user_id, userId));
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string, paymentId?: string): Promise<Order | undefined> {
    const updateData: any = { status };
    if (paymentId) updateData.payment_id = paymentId;
    if (status === 'completed') updateData.completed_at = new Date();

    const [order] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async createOrderItems(orderItemsData: InsertOrderItem[]): Promise<OrderItem[]> {
    const createdItems = await db.insert(orderItems).values(orderItemsData).returning();
    return createdItems;
  }

  // Subscriber operations
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.id, id));
    return subscriber || undefined;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber || undefined;
  }

  async getSubscriberByVerifyToken(token: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.verifyToken, token));
    return subscriber || undefined;
  }

  async getSubscriberByUnsubscribeToken(token: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.unsubscribeToken, token));
    return subscriber || undefined;
  }

  async createSubscriber(subscriberData: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values({
      ...subscriberData,
      verifyToken: crypto.randomUUID(),
      unsubscribeToken: crypto.randomUUID(),
    }).returning();
    return subscriber;
  }

  async updateSubscriber(id: number, subscriberData: Partial<Subscriber>): Promise<Subscriber> {
    const [subscriber] = await db.update(subscribers)
      .set({ ...subscriberData, updatedAt: new Date() })
      .where(eq(subscribers.id, id))
      .returning();
    return subscriber;
  }

  async getVerifiedSubscribers(wantsPrayerEvents?: boolean): Promise<Subscriber[]> {
    if (wantsPrayerEvents !== undefined) {
      return await db.select().from(subscribers)
        .where(and(eq(subscribers.verified, true), eq(subscribers.wantsPrayerEvents, wantsPrayerEvents)));
    }
    
    return await db.select().from(subscribers).where(eq(subscribers.verified, true));
  }

  // Project operations implementation
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.created_at));
  }

  async getProjectsByPartner(partnerId: number): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.sponsored_by, partnerId))
      .orderBy(desc(projects.created_at));
  }

  async getProjectWithParticipants(id: number): Promise<(Project & { participants: ProjectParticipant[] }) | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    if (!project) return undefined;

    const participants = await db.select({
      id: projectParticipants.id,
      project_id: projectParticipants.project_id,
      user_id: projectParticipants.user_id,
      role: projectParticipants.role,
      status: projectParticipants.status,
      notes: projectParticipants.notes,
      joined_at: projectParticipants.joined_at,
      user: {
        name: users.name,
        email: users.email,
      }
    })
    .from(projectParticipants)
    .leftJoin(users, eq(projectParticipants.user_id, users.id))
    .where(eq(projectParticipants.project_id, id));

    return { ...project, participants };
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values({
      ...projectData,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db.update(projects)
      .set({ ...projectData, updated_at: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Project Participants operations
  async getProjectParticipants(projectId: number): Promise<ProjectParticipant[]> {
    return await db.select({
      id: projectParticipants.id,
      project_id: projectParticipants.project_id,
      user_id: projectParticipants.user_id,
      role: projectParticipants.role,
      status: projectParticipants.status,
      notes: projectParticipants.notes,
      joined_at: projectParticipants.joined_at,
      user: {
        name: users.name,
        email: users.email,
      }
    })
    .from(projectParticipants)
    .leftJoin(users, eq(projectParticipants.user_id, users.id))
    .where(eq(projectParticipants.project_id, projectId));
  }

  async addProjectParticipant(participantData: InsertProjectParticipant): Promise<ProjectParticipant> {
    const [participant] = await db.insert(projectParticipants).values({
      ...participantData,
      joined_at: new Date(),
    }).returning();
    return participant;
  }

  async updateProjectParticipant(id: number, updates: Partial<InsertProjectParticipant>): Promise<ProjectParticipant | undefined> {
    const [participant] = await db.update(projectParticipants)
      .set(updates)
      .where(eq(projectParticipants.id, id))
      .returning();
    return participant || undefined;
  }

  async removeProjectParticipant(projectId: number, userId: number): Promise<boolean> {
    const result = await db.delete(projectParticipants)
      .where(and(
        eq(projectParticipants.project_id, projectId),
        eq(projectParticipants.user_id, userId)
      ));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();