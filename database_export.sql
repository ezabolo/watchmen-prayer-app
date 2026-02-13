--
-- PostgreSQL database dump
--

\restrict uLQWzS1q3KtfQ0qy5fmT1BeXhNGbx8j1JNl6ConZSXX049T9IjLPE1rbdMOUnyM

-- Dumped from database version 16.11 (df20cf9)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- Name: event_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.event_category AS ENUM (
    'intercessory',
    'childbirth',
    '24h_prayer',
    'worship',
    'fasting',
    'other'
);


--
-- Name: prayer_request_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.prayer_request_category AS ENUM (
    'personal',
    'family',
    'healing',
    'guidance',
    'global_issues',
    'other'
);


--
-- Name: region; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.region AS ENUM (
    'africa',
    'asia',
    'europe',
    'north_america',
    'south_america',
    'oceania',
    'middle_east'
);


--
-- Name: training_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.training_type AS ENUM (
    'video',
    'pdf',
    'qcm'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'watchman',
    'partner',
    'admin',
    'regional_leader'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title text NOT NULL,
    author text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    isbn text,
    pages integer,
    language text DEFAULT 'English'::text,
    publisher text,
    published_date timestamp without time zone,
    category text,
    stock_quantity integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    created_by integer,
    front_cover_url text,
    back_cover_url text,
    is_featured boolean DEFAULT false,
    amazon_url text
);


--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    book_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    added_at timestamp without time zone DEFAULT now()
);


--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: chapters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chapters (
    id integer NOT NULL,
    training_id integer NOT NULL,
    title text NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: chapters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chapters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chapters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chapters_id_seq OWNED BY public.chapters.id;


--
-- Name: donations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.donations (
    id integer NOT NULL,
    amount integer NOT NULL,
    date timestamp without time zone DEFAULT now(),
    method text NOT NULL,
    partner_id integer,
    user_id integer,
    project_id integer
);


--
-- Name: donations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.donations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: donations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.donations_id_seq OWNED BY public.donations.id;


--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_registrations (
    id integer NOT NULL,
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    status text DEFAULT 'confirmed'::text NOT NULL,
    registered_at timestamp without time zone DEFAULT now(),
    notes text
);


--
-- Name: event_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: event_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_registrations_id_seq OWNED BY public.event_registrations.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text,
    category public.event_category NOT NULL,
    created_by integer,
    content text,
    image_url text,
    media_urls text[],
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    poc_name text,
    poc_phone text,
    poc_email text
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    book_id integer NOT NULL,
    quantity integer NOT NULL,
    price_per_item numeric(10,2) NOT NULL
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_amount integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_method text,
    payment_id text,
    shipping_address text,
    created_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: partner_contributions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partner_contributions (
    id integer NOT NULL,
    project_id integer NOT NULL,
    user_id integer NOT NULL,
    amount_cents integer NOT NULL,
    currency text DEFAULT 'USD'::text,
    is_recurring boolean DEFAULT false,
    interval_months integer DEFAULT 1,
    status text DEFAULT 'pending'::text NOT NULL,
    provider text,
    provider_payment_id text,
    created_at timestamp without time zone DEFAULT now(),
    confirmed_at timestamp without time zone
);


--
-- Name: partner_contributions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partner_contributions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partner_contributions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partner_contributions_id_seq OWNED BY public.partner_contributions.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    user_id integer NOT NULL,
    org_name text NOT NULL,
    logo text,
    since timestamp without time zone DEFAULT now()
);


--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: prayer_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prayer_requests (
    id integer NOT NULL,
    name text,
    message text NOT NULL,
    anonymous boolean DEFAULT false,
    category public.prayer_request_category NOT NULL,
    submitted_at timestamp without time zone DEFAULT now(),
    is_public boolean DEFAULT false,
    submitted_by integer
);


--
-- Name: prayer_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.prayer_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: prayer_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.prayer_requests_id_seq OWNED BY public.prayer_requests.id;


--
-- Name: progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    training_id integer NOT NULL,
    completed boolean DEFAULT false,
    score integer,
    completed_at timestamp without time zone
);


--
-- Name: progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.progress_id_seq OWNED BY public.progress.id;


--
-- Name: project_budgets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_budgets (
    id integer NOT NULL,
    project_id integer NOT NULL,
    has_final_cost boolean DEFAULT false,
    final_cost_cents integer DEFAULT 0,
    currency text DEFAULT 'USD'::text,
    internal_funds_cents integer DEFAULT 0,
    funding_goal_cents integer DEFAULT 0,
    min_contribution_cents integer DEFAULT 0,
    donation_link text,
    financial_contact_name text,
    financial_contact_email text
);


--
-- Name: project_budgets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_budgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_budgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_budgets_id_seq OWNED BY public.project_budgets.id;


--
-- Name: project_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_participants (
    id integer NOT NULL,
    project_id integer NOT NULL,
    user_id integer NOT NULL,
    role text,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    joined_at timestamp without time zone DEFAULT now()
);


--
-- Name: project_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_participants_id_seq OWNED BY public.project_participants.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    type text NOT NULL,
    summary text NOT NULL,
    primary_scripture text,
    visibility text DEFAULT 'Public'::text NOT NULL,
    cover_url text,
    ongoing boolean DEFAULT false,
    timezone text DEFAULT 'UTC'::text,
    rhythm text,
    slot_length_minutes integer,
    owner_id integer NOT NULL,
    status text DEFAULT 'Draft'::text NOT NULL,
    max_team_size integer DEFAULT 0,
    allow_public_signup boolean DEFAULT true,
    approval_mode text DEFAULT 'Auto'::text,
    capacity_total integer DEFAULT 0,
    capacity_per_slot integer DEFAULT 5,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    training_id integer NOT NULL,
    question text NOT NULL,
    options text[] NOT NULL,
    correct_answer text NOT NULL
);


--
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    chapter_id integer NOT NULL,
    title text NOT NULL,
    content text,
    video_url text,
    file_url text,
    order_index integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscribers (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    address_line_1 text,
    address_line_2 text,
    city text,
    state text,
    postal text,
    wants_newsletter boolean DEFAULT false,
    wants_prayer_events boolean DEFAULT false,
    verified boolean DEFAULT false,
    verify_token text,
    unsubscribe_token text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscribers_id_seq OWNED BY public.subscribers.id;


--
-- Name: trainings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trainings (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type public.training_type NOT NULL,
    file_url text,
    created_at timestamp without time zone DEFAULT now(),
    created_by integer
);


--
-- Name: trainings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trainings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trainings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trainings_id_seq OWNED BY public.trainings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text,
    role public.user_role DEFAULT 'watchman'::public.user_role NOT NULL,
    region public.region,
    registered_at timestamp without time zone DEFAULT now(),
    google_id text,
    facebook_id text,
    apple_id text,
    two_factor_enabled boolean DEFAULT false,
    two_factor_secret text,
    backup_codes text[],
    email_verified boolean DEFAULT false,
    email_verification_token text,
    email_verification_expires timestamp without time zone,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: chapters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters ALTER COLUMN id SET DEFAULT nextval('public.chapters_id_seq'::regclass);


--
-- Name: donations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations ALTER COLUMN id SET DEFAULT nextval('public.donations_id_seq'::regclass);


--
-- Name: event_registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations ALTER COLUMN id SET DEFAULT nextval('public.event_registrations_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: partner_contributions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_contributions ALTER COLUMN id SET DEFAULT nextval('public.partner_contributions_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: prayer_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prayer_requests ALTER COLUMN id SET DEFAULT nextval('public.prayer_requests_id_seq'::regclass);


--
-- Name: progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress ALTER COLUMN id SET DEFAULT nextval('public.progress_id_seq'::regclass);


--
-- Name: project_budgets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_budgets ALTER COLUMN id SET DEFAULT nextval('public.project_budgets_id_seq'::regclass);


--
-- Name: project_participants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_participants ALTER COLUMN id SET DEFAULT nextval('public.project_participants_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscribers ALTER COLUMN id SET DEFAULT nextval('public.subscribers_id_seq'::regclass);


--
-- Name: trainings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings ALTER COLUMN id SET DEFAULT nextval('public.trainings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.books (id, title, author, description, price, isbn, pages, language, publisher, published_date, category, stock_quantity, created_at, created_by, front_cover_url, back_cover_url, is_featured, amazon_url) FROM stdin;
1	The Power of Intercessory Prayer	Dutch Sheets	A comprehensive guide to understanding and practicing effective intercessory prayer for personal and global transformation.	15.99	\N	\N	English	\N	\N	Prayer & Intercession	50	2025-07-24 19:10:04.083417	\N	/uploads/front_cover-1756260501226-420826055.png	\N	f	
2	 Mouvement De Priere des sentinelles: Selon le Cœur du Père	Dr Moussa Toure	\r\nMouvement De Priere Des Sentinelles: Selon le Cœur du Père	25.00	\N	\N	English	\N	\N	Prayer & Intercession	20	2025-07-24 20:06:53.776935	2	/uploads/front_cover-1753387612953-19277777.png	/uploads/back_cover-1753387613349-565337976.png	f	https://www.amazon.com/Watchmen-Prayer-Movement-Mountain-Fathers/dp/B0DL13ZHVX/ref=sr_1_2?crid=16ORTIW43CKJ8&dib=eyJ2IjoiMSJ9.bvtHlbzs3mlrNznxZtDQJJDPewOETg1MNpU--GUzejDGjHj071QN20LucGBJIEps.p8oCbuaCbNDVAH8oZ5AF_kEpMVMQ3iyGBjYP4nl43xo&dib_tag=se&keywords=Dr+Moussa+Toure&qid=1754799764&sprefix=dr+moussa+toure%2Caps%2C157&sr=8-2
3	Loose Him	Dr Moussa Toure	Believers across this nation and around the world are overwhelmed, oppressed, struggling, and defeated in their attempt to live the abundant life Christ came to give them. I am convinced, however, that if more churches would embrace the ministry of deliverance and employ a systematic approach in offering deliverance, the results would be phenomenal. Instead of an army of weak and ineff ective believers, a new generation of bold conquerors set free by God and empowered to set others free would arise. Dr. Moussa Touré has released a powerful weapon against the prince of darkness in his new book, "Loose Him and Let Him Go!" Intellectually prepared to analyze the problems and research the issues, Dr. Touré is experienced in the subject of deliverance and addresses herein the controversies that unfortunately surround and hinder the ministry of deliverance. If you, as an individual, or your church need theological and practical help to remove one of the major obstacles to spiritual growth-demonic oppression-this is the book for you! Dr. Touré is also the author of The Prayer Warrior's Confession," a document to help believers "hold fast 'their' profession." He and his wife, Esther, have two children, Yannick and Faith.	25.00	\N	\N	English	\N	\N	Prayer & Intercession	0	2025-08-10 04:24:24.347922	2	/uploads/front_cover-1754799861804-519553616.png	\N	f	https://www.amazon.com/Loose-Him-Let-Go/dp/1632320827/ref=sr_1_1?dib=eyJ2IjoiMSJ9.bvtHlbzs3mlrNznxZtDQJJDPewOETg1MNpU--GUzejDGjHj071QN20LucGBJIEps.p8oCbuaCbNDVAH8oZ5AF_kEpMVMQ3iyGBjYP4nl43xo&dib_tag=se&keywords=Dr+Moussa+Toure&qid=1754799825&sr=8-1
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, user_id, book_id, quantity, added_at) FROM stdin;
1	2	2	1	2025-07-24 20:10:25.595162
\.


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chapters (id, training_id, title, order_index, created_at) FROM stdin;
9	2	Introduction to Prayer	1	2025-07-10 20:24:26.629968
10	2	Chapter 2 How to grow in Prayer	2	2025-07-10 20:24:26.75483
11	4	Welcome & Purpose 	1	2025-07-10 21:01:20.016183
12	4	Why Pray the Word? 	2	2025-07-10 21:01:20.20919
13	5	Chapter 1 - The Call of a Watchman	1	2025-08-17 05:31:39.398927
14	5	Chapter 2 - The Watchman’s Foundation: Holiness & Obedience	2	2025-08-17 05:31:39.591408
15	5	Chapter 3 - The Prayer Watchman’s Armor	3	2025-08-17 05:31:39.774578
16	5	Chapter 4 -Types of Watches in Prayer	4	2025-08-17 05:31:39.952109
\.


--
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.donations (id, amount, date, method, partner_id, user_id, project_id) FROM stdin;
\.


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_registrations (id, event_id, user_id, status, registered_at, notes) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, title, description, location, category, created_by, content, image_url, media_urls, start_date, end_date, poc_name, poc_phone, poc_email) FROM stdin;
1	Prayer for Nations Test	A test prayer event	Kenya, Nairobi	intercessory	2	\N	\N	\N	2025-07-01 10:00:00	2025-07-01 12:00:00	\N	\N	\N
2	Prayer for Central African Republic	We will gather in Central African Republic to intercede for the nation	Bangui, Central African Republic	intercessory	2	\N	\N	\N	2025-07-20 03:09:00	2025-07-20 05:09:00	\N	\N	\N
3	Prayer for Nations - Worldwide Intercession	Nations need change. Yet the change they need will not come from the United Nations neither our authorities. It will ONLY come from God and will ONLY begin with us God’s people coming together, in one accord, in a unified effort that transcends all denominational and cultural, ethnical and racial barriers, to Him in prayer for the change that the nations need, exactly like in the book of Acts on the day of Pentecost.\n\nWe have a great opportunity and privilege of joining all watchmen worldwide each year on Saturday before Pentecost Sunday to weep between the porch and the Lord’s Altar, saying:\n\n“Spare your people/ “the nations”, O LORD; (Joel 2:17b)\nFOR YOU GOD make nations great, and destroy them; YOU enlarge nations, and disperse them (Job12:23-25)\n“Blessed is the nation whose God is the LORD, the people He chose for His inheritance” (Psalm 33:12)\n\nWe travail/ cry out for the nations of the world per continent (North, Central, South America; Africa; Asia; Australia; the Islands; Europe). We also enhance our prayer that day with fasting on that day.\n\nPraying for nations is scriptural: “Ask of Me, and I will give you (us in Christ Jesus) the nations for your inheritance…” (Psalm 2:8)\n\n“Even those I will bring to My holy mountain and make them joyful in My house of prayer. Their burnt offerings and their sacrifices will be acceptable on My altar; For My house will be called a house of prayer for all the peoples.” (Isaiah 56:7)\n\n"And He began to teach and say to them, “Is it not written, ‘My house shall be called a house of prayer for all the nations’? But you have made it a robbers’ den.” (Mark 11:17)\n\nAs said Robert Sterns: “There is only one house that the Lord is building.” Jesus said and repeated, “My house shall be called a house of prayer for all nations”. And in these last days, we are seeing the restoration of God’s house of prayer in the earth.\n\nThe Lord Who called us to pray for our own land/nation is also pointing to high levels of intercession /supplication/ travail for all lands/all nations.\n\nTo stand before God on behalf of one person or one nation is one thing; to stand before God on behalf of nations is something entirely different and praying for the whole world seems to be a vast task but God knows no boundaries, no limit.\n\nSo where and how should we start:\n\nRepentance: “If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then will I hear from heaven and will forgive their sin and will heal their land.” (2 Chronicles 7:14)\n\nGod’s promises here are real changes (forgiveness, spiritual deliverance and healing for our souls and our lands) if we will truly humble ourselves in repentant-prayer before Him:\n\nFor ourselves,\nOn behalf of the Church of our Lord Jesus Christ in our nation and in the nations of the world;\nOn behalf of our authorities and the authorities worldwide,\nOn behalf of our nation and the nations worldwide.	Harvest Church, Washington DC	intercessory	2	\N	\N	\N	2025-08-03 15:20:00	2025-08-03 17:20:00	\N	\N	\N
5	Watchman Convention	Watchman Convention se tiendra a Liege en Belgique	Liege, Belgique	other	2	Watchman Convention se tiendra a Liege en Belgique	/uploads/file-1753390161347-554627690.png	{/uploads/file-1753390161347-554627690.png}	2025-09-20 00:47:00	2025-09-22 02:47:00	\N	\N	\N
4	Interceding for a Nation – Healing, Peace & Restoration for Burkina Faso	Join us at Harvest Church of Burkina Faso on Friday, August 15th, 2025 for a special national prayer gathering, as believers across the region come together in unity to pray for the peace, security, and spiritual revival of Burkina Faso.\n\nThis powerful event will bring together pastors, intercessors, worship teams, and believers from all walks of life with one purpose: to seek God’s intervention for the nation. We will lift up prayers for:\n\nPeace and stability across all regions\n\nProtection and strength for our leaders and armed forces\n\nRevival and healing within the Church and communities\n\nEconomic restoration and divine provision\n\nUnity among tribes, tongues, and generations\n\nThe day will feature anointed worship, prophetic intercession, scripture declarations, and times of silence and reflection, led by spiritual leaders from across the country.	Ouagadougou, Burkina Faso	intercessory	2	Join us at Harvest Church of Burkina Faso on Friday, August 15th, 2025 for a special national prayer gathering, as believers across the region come together in unity to pray for the peace, security, and spiritual revival of Burkina Faso.\n\nThis powerful event will bring together pastors, intercessors, worship teams, and believers from all walks of life with one purpose: to seek God’s intervention for the nation. We will lift up prayers for:\n\nPeace and stability across all regions\n\nProtection and strength for our leaders and armed forces\n\nRevival and healing within the Church and communities\n\nEconomic restoration and divine provision\n\nUnity among tribes, tongues, and generations\n\nThe day will feature anointed worship, prophetic intercession, scripture declarations, and times of silence and reflection, led by spiritual leaders from across the country.	/uploads/file-1753372613475-619647595.png	{/uploads/file-1753372613475-619647595.png,/uploads/file-1756259980390-851991413.mp4}	2025-08-15 15:50:00	2025-08-15 17:50:00	\N	\N	\N
6	Youth Meetup in Liege	Youth Meetup in Liege - Belgium \nConference 	Liege - Belgium	intercessory	2	Youth Meetup in Liege - Belgium \nConference 	/uploads/file-1756263797810-178847230.png	{/uploads/file-1756263797810-178847230.png}	2025-08-30 10:30:00	2025-08-31 17:00:00	Amavi  Toure	5408501015	xvseoinfo@gmail.com
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, book_id, quantity, price_per_item) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, total_amount, status, payment_method, payment_id, shipping_address, created_at, completed_at) FROM stdin;
\.


--
-- Data for Name: partner_contributions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partner_contributions (id, project_id, user_id, amount_cents, currency, is_recurring, interval_months, status, provider, provider_payment_id, created_at, confirmed_at) FROM stdin;
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partners (id, user_id, org_name, logo, since) FROM stdin;
\.


--
-- Data for Name: prayer_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.prayer_requests (id, name, message, anonymous, category, submitted_at, is_public, submitted_by) FROM stdin;
\.


--
-- Data for Name: progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.progress (id, user_id, training_id, completed, score, completed_at) FROM stdin;
3	3	2	f	100	\N
4	3	4	f	50	\N
2	1	4	t	100	2025-08-27 01:11:01.065
6	3	5	t	100	2025-08-27 01:45:05.86
1	1	2	t	100	2025-08-31 15:06:23.891
5	1	5	f	14	2025-08-17 05:45:30.071
\.


--
-- Data for Name: project_budgets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project_budgets (id, project_id, has_final_cost, final_cost_cents, currency, internal_funds_cents, funding_goal_cents, min_contribution_cents, donation_link, financial_contact_name, financial_contact_email) FROM stdin;
\.


--
-- Data for Name: project_participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project_participants (id, project_id, user_id, role, status, notes, joined_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, title, description, start_date, end_date, type, summary, primary_scripture, visibility, cover_url, ongoing, timezone, rhythm, slot_length_minutes, owner_id, status, max_team_size, allow_public_signup, approval_mode, capacity_total, capacity_per_slot, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quizzes (id, training_id, question, options, correct_answer) FROM stdin;
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sections (id, chapter_id, title, content, video_url, file_url, order_index, created_at) FROM stdin;
9	9	What is Prayer?	Prayer is communication with God...	/uploads/file-1751376910051-388916908.mp4	\N	1	2025-07-10 20:24:26.694789
10	10	Section 1 Lesson to learn		/uploads/file-1752176439731-92289179.mp4	\N	1	2025-07-10 20:24:26.813926
11	10	Section 2 - Learn to pray from the bible		/uploads/file-1752179054497-769679689.mp4	\N	2	2025-07-10 20:24:26.873233
12	11	Quick welcome and opening prayer.		/uploads/file-1752181117065-785134750.mp4	\N	1	2025-07-10 21:01:20.079258
13	11	State the purpose: "We are learning to pray in a way that aligns with God’s heart, using His Word as the		/uploads/file-1752181163822-372182675.mp4	\N	2	2025-07-10 21:01:20.144795
14	12	Isaiah 55:11 – "So shall My word be that goes forth from My mouth; it shall not return to Me void..."		/uploads/file-1752181212566-445471513.mp4	\N	1	2025-07-10 21:01:20.268588
15	12	Hebrews 4:12 – "For the Word of God is alive and active..."		/uploads/file-1752181249587-341854033.mp4	\N	2	2025-07-10 21:01:20.328319
16	13	Who is a Watchman?	Biblical Reference: Ezekiel 33:6–7, Isaiah 62:6–7\nA watchman is one who stands in prayer on behalf of others, alert to the spiritual state of a family, church, or nation.	\N	\N	1	2025-08-17 05:31:39.461381
17	13	The Role of a Prayer Watchman	iblical Reference: Habakkuk 2:1, Nehemiah 4:9\nDuties: intercession, discernment, warning, declaring God’s will.	https://www.youtube.com/shorts/CG42Sat8TEw	\N	2	2025-08-17 05:31:39.525238
18	14	Living a Consecrated Life	Biblical Reference: 2 Timothy 2:21, Leviticus 20:7\nHoliness sharpens spiritual discernment.	\N	\N	1	2025-08-17 05:31:39.650665
19	14	The Power of Obedience in Prayer	Biblical Reference: 1 Samuel 15:22, John 15:7\nObedience ensures authority in intercession.	https://www.youtube.com/watch?v=z_EaKJYz5x0	\N	2	2025-08-17 05:31:39.714948
20	15	Spiritual Warfare Armor	Biblical Reference: Ephesians 6:10–18\nPrayer watchmen must always be “armed” in the Spirit.	\N	\N	1	2025-08-17 05:31:39.833986
21	15	The Power of the Blood, the Word, and the Name of Jesus	Biblical Reference: Revelation 12:11, Philippians 2:9–10\nThree divine weapons of intercession.	https://www.youtube.com/watch?v=P4qhOxxMliw	\N	2	2025-08-17 05:31:39.893116
22	16	The Eight Prayer Watches of the Day & Night	Biblical Reference: Psalm 119:148, Mark 13:35–37\n\n1st Watch (6pm–9pm): Covenant renewal & protection\n\n2nd Watch (9pm–12am): Warfare against demonic activity\n\n3rd Watch (12am–3am): Divine interventions, angelic activity\n\n4th Watch (3am–6am): Deliverance, seeking God’s presence\n\n5th Watch (6am–9am): Resurrection power & spiritual refreshing\n\n6th Watch (9am–12pm): Prayer for healing, guidance & justice\n\n7th Watch (12pm–3pm): Prayer for strength, repentance, intercession for nations\n\n8th Watch (3pm–6pm): Prayer for breakthroughs and preparation for evening	https://www.youtube.com/watch?v=k-lWPuUPilw	\N	1	2025-08-17 05:31:40.011437
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscribers (id, first_name, last_name, email, address_line_1, address_line_2, city, state, postal, wants_newsletter, wants_prayer_events, verified, verify_token, unsubscribe_token, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: trainings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trainings (id, title, description, type, file_url, created_at, created_by) FROM stdin;
2	Basic Prayer Techniques	Learn fundamental prayer methods and techniques for effective intercession.	video	\N	2025-07-01 03:19:16.640175	2
4	How to pray the word of God	powerful 30-minute training outline on "How to Pray the Word of God", ideal for use in small groups, churches, prayer meetings, or online classes. This structure blends teaching, scripture, and practical prayer practice.	video	\N	2025-07-10 21:01:19.681417	\N
5	Effective prayer	The structured Training Curriculum for Prayer Watchmen, organized into chapters and sections, with biblical references and suggested YouTube resources (for each chapter).	video	\N	2025-08-17 05:31:39.060802	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, region, registered_at, google_id, facebook_id, apple_id, two_factor_enabled, two_factor_secret, backup_codes, email_verified, email_verification_token, email_verification_expires, is_active, last_login) FROM stdin;
4	Nathalie	nathalie.zabolo@gmail.com	$2b$10$QXhjfMP99zyhtuyTPpQJIuGBE58s.VC9HcmB60hv1o661yhcdXbbK	regional_leader	north_america	2025-06-25 02:33:34.68983	\N	\N	\N	f	\N	\N	f	\N	\N	t	\N
5		xvseoinfo@gmail.com	$2b$10$Svs5V4Q17RuDRQOuOMQLgOoIbgFT5rTHHd/kefuMwZf5T3L2TMO5C	watchman	south_america	2025-06-25 02:39:33.72381	\N	\N	\N	f	\N	\N	f	\N	\N	t	\N
6	Sylvie Michele	sylviezabolo@gmail.com	$2b$10$s0HCslohOknVf4FjNhu/iu1mWMsEdHGYEaAxeKtHyP7fjpXh3n4XC	watchman	europe	2025-08-27 03:14:08.953251	\N	\N	\N	f	\N	\N	f	\N	\N	t	\N
7	Olivier Baba Sire	ezabolo@scenergylink.com	$2b$10$M7eF8ppHULRmOxewSAI13.D5ITkSWXJxDig3fRZka1R12enOto2M2	partner	north_america	2025-10-23 20:56:03.277112	\N	\N	\N	f	\N	\N	f	\N	\N	t	\N
8		euzab@gmail.com	$2b$10$b4tROPUMDBp896WeWf/MR.rxRaCE99dzmmDF1OgEu7Ybk8cO0Xok2	partner	africa	2025-10-23 20:57:42.2365	\N	\N	\N	f	\N	\N	f	\N	\N	t	\N
3	Jordan Zabolo	jordan.zabolo@gmail.com	$2b$10$iNGXuXrapxA3QxBHDBdv8edVp6H5bxomawHc/atwW3dxRe5LfgH5W	partner	north_america	2025-06-25 02:26:36.447106	\N	\N	\N	f	\N	\N	t	\N	\N	t	2026-01-19 21:13:02.902
1	EUGENE O ZABOLO	eugene.zabolo@gmail.com	$2b$10$ebSzAXu.bhcIqZ9Lm2ciE.wZGq4FTkEXZ5/g0xzCVOv4nmRVwEQcm	watchman	north_america	2025-06-20 05:01:44.837947	\N	\N	\N	f	\N	\N	t	\N	\N	t	2026-01-19 22:23:03.002
2	Admin User	admin@prayerwatchman.org	$2b$10$C/yLc6enruskHXwivx6KnuR0WLghb61M7YI7cSgO2.T8O5jeDJoqi	admin	africa	2025-06-21 03:41:56.089601	\N	\N	\N	f	\N	\N	t	\N	\N	t	2026-01-20 01:41:17.879
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.books_id_seq', 3, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, true);


--
-- Name: chapters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chapters_id_seq', 16, true);


--
-- Name: donations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.donations_id_seq', 1, false);


--
-- Name: event_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.event_registrations_id_seq', 1, false);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.events_id_seq', 6, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: partner_contributions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partner_contributions_id_seq', 1, false);


--
-- Name: partners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.partners_id_seq', 1, false);


--
-- Name: prayer_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.prayer_requests_id_seq', 1, false);


--
-- Name: progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.progress_id_seq', 6, true);


--
-- Name: project_budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_budgets_id_seq', 1, false);


--
-- Name: project_participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_participants_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, false);


--
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 1, false);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sections_id_seq', 22, true);


--
-- Name: subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscribers_id_seq', 1, false);


--
-- Name: trainings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trainings_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: chapters chapters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_pkey PRIMARY KEY (id);


--
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (id);


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: partner_contributions partner_contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_contributions
    ADD CONSTRAINT partner_contributions_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: prayer_requests prayer_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prayer_requests
    ADD CONSTRAINT prayer_requests_pkey PRIMARY KEY (id);


--
-- Name: progress progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_pkey PRIMARY KEY (id);


--
-- Name: project_budgets project_budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_budgets
    ADD CONSTRAINT project_budgets_pkey PRIMARY KEY (id);


--
-- Name: project_participants project_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_participants
    ADD CONSTRAINT project_participants_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: subscribers subscribers_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_email_unique UNIQUE (email);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (id);


--
-- Name: trainings trainings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: books books_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: cart_items cart_items_book_id_books_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_book_id_books_id_fk FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: cart_items cart_items_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: chapters chapters_training_id_trainings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chapters
    ADD CONSTRAINT chapters_training_id_trainings_id_fk FOREIGN KEY (training_id) REFERENCES public.trainings(id);


--
-- Name: donations donations_partner_id_partners_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_partner_id_partners_id_fk FOREIGN KEY (partner_id) REFERENCES public.partners(id);


--
-- Name: donations donations_project_id_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_project_id_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: donations donations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: event_registrations event_registrations_event_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: event_registrations event_registrations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: events events_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: order_items order_items_book_id_books_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_book_id_books_id_fk FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: order_items order_items_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: orders orders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: partner_contributions partner_contributions_project_id_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_contributions
    ADD CONSTRAINT partner_contributions_project_id_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: partner_contributions partner_contributions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_contributions
    ADD CONSTRAINT partner_contributions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: partners partners_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: prayer_requests prayer_requests_submitted_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prayer_requests
    ADD CONSTRAINT prayer_requests_submitted_by_users_id_fk FOREIGN KEY (submitted_by) REFERENCES public.users(id);


--
-- Name: progress progress_training_id_trainings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_training_id_trainings_id_fk FOREIGN KEY (training_id) REFERENCES public.trainings(id);


--
-- Name: progress progress_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: project_budgets project_budgets_project_id_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_budgets
    ADD CONSTRAINT project_budgets_project_id_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: project_participants project_participants_project_id_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_participants
    ADD CONSTRAINT project_participants_project_id_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: project_participants project_participants_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_participants
    ADD CONSTRAINT project_participants_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: projects projects_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: quizzes quizzes_training_id_trainings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_training_id_trainings_id_fk FOREIGN KEY (training_id) REFERENCES public.trainings(id);


--
-- Name: sections sections_chapter_id_chapters_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_chapter_id_chapters_id_fk FOREIGN KEY (chapter_id) REFERENCES public.chapters(id);


--
-- Name: trainings trainings_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict uLQWzS1q3KtfQ0qy5fmT1BeXhNGbx8j1JNl6ConZSXX049T9IjLPE1rbdMOUnyM

