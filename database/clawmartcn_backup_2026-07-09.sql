--
-- PostgreSQL database dump
--

\restrict k65pSidZhBNrjyhk1j3pXHYECHD2zgG1YEFA6RclwugTwfntm34G7skBLCN85fy

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

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
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: industry_solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.industry_solutions (
    id bigint NOT NULL,
    industry_key character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    emoji character varying(10) DEFAULT '🏭'::character varying NOT NULL,
    tagline character varying(255) NOT NULL,
    pain_points json NOT NULL,
    target_users json NOT NULL,
    modules json NOT NULL,
    keywords json NOT NULL,
    listing_id bigint,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    generation_error text,
    generated_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT industry_solutions_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'generating'::character varying, 'done'::character varying, 'failed'::character varying])::text[])))
);


--
-- Name: industry_solutions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.industry_solutions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: industry_solutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.industry_solutions_id_seq OWNED BY public.industry_solutions.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    description text,
    image_url character varying(255),
    status character varying(255) DEFAULT 'available'::character varying NOT NULL,
    category character varying(255) DEFAULT 'Claw'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    user_id bigint,
    demo_messages json,
    demo_personas json
);


--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: payment_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_orders (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    listing_id bigint NOT NULL,
    stripe_session_id character varying(255),
    amount numeric(10,2) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    paid_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: payment_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_orders_id_seq OWNED BY public.payment_orders.id;


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchases (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    listing_id bigint NOT NULL,
    price_paid numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.purchases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.purchases_id_seq OWNED BY public.purchases.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: sourcing_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sourcing_requests (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    contact character varying(255) NOT NULL,
    model character varying(255),
    budget numeric(15,2),
    note text,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: sourcing_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sourcing_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sourcing_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sourcing_requests_id_seq OWNED BY public.sourcing_requests.id;


--
-- Name: store_bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_bookings (
    id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    status character varying(30) DEFAULT 'pending'::character varying NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_phone character varying(30) NOT NULL,
    customer_note text,
    booking_at timestamp(0) without time zone,
    table_area character varying(255),
    party_size integer,
    items json,
    extra json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: store_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_bookings_id_seq OWNED BY public.store_bookings.id;


--
-- Name: store_customer_interactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_customer_interactions (
    id bigint NOT NULL,
    store_customer_id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    type character varying(20) NOT NULL,
    content text NOT NULL,
    amount numeric(10,2),
    interacted_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: store_customer_interactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_customer_interactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_customer_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_customer_interactions_id_seq OWNED BY public.store_customer_interactions.id;


--
-- Name: store_customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_customers (
    id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    phone character varying(30),
    email character varying(100),
    address character varying(300),
    note text,
    tags json,
    total_spent numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    visit_count integer DEFAULT 0 NOT NULL,
    last_contact_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: store_customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_customers_id_seq OWNED BY public.store_customers.id;


--
-- Name: store_inventory_txns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_inventory_txns (
    id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    product_id bigint,
    item_name character varying(255) NOT NULL,
    type character varying(20) NOT NULL,
    qty numeric(10,3) NOT NULL,
    unit character varying(20),
    unit_price numeric(10,2),
    total_amount numeric(10,2),
    note character varying(255),
    txn_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: store_inventory_txns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_inventory_txns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_inventory_txns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_inventory_txns_id_seq OWNED BY public.store_inventory_txns.id;


--
-- Name: store_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_logs (
    id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    category character varying(30) DEFAULT 'other'::character varying NOT NULL,
    content text NOT NULL,
    logged_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    amount numeric(10,2),
    amount_type character varying(10)
);


--
-- Name: store_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_logs_id_seq OWNED BY public.store_logs.id;


--
-- Name: store_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_notes (
    id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    type character varying(30) DEFAULT 'other'::character varying NOT NULL,
    title character varying(255),
    content text NOT NULL,
    valid_from timestamp(0) without time zone,
    valid_until timestamp(0) without time zone,
    is_active boolean DEFAULT true NOT NULL,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    embedding public.vector(1536)
);


--
-- Name: store_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_notes_id_seq OWNED BY public.store_notes.id;


--
-- Name: store_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_photos (
    id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    url character varying(255) NOT NULL,
    caption character varying(255),
    sort_order smallint DEFAULT '0'::smallint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    category character varying(255) DEFAULT 'environment'::character varying NOT NULL
);


--
-- Name: store_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_photos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_photos_id_seq OWNED BY public.store_photos.id;


--
-- Name: store_product_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_product_photos (
    id bigint NOT NULL,
    store_product_id bigint NOT NULL,
    url character varying(255) NOT NULL,
    caption character varying(255),
    sort_order smallint DEFAULT '0'::smallint NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: store_product_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_product_photos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_product_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_product_photos_id_seq OWNED BY public.store_product_photos.id;


--
-- Name: store_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_products (
    id bigint NOT NULL,
    store_profile_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    stock integer,
    unit character varying(20),
    description text,
    image_url character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: store_products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_products_id_seq OWNED BY public.store_products.id;


--
-- Name: store_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_profiles (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    shop_name character varying(255) DEFAULT ''::character varying NOT NULL,
    shop_description text,
    logo_url character varying(255),
    contact_phone character varying(30),
    contact_email character varying(255),
    address character varying(300),
    business_hours character varying(300),
    tags json,
    is_public boolean DEFAULT true NOT NULL,
    slug character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    store_type character varying(30) DEFAULT 'retail'::character varying NOT NULL
);


--
-- Name: store_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_profiles_id_seq OWNED BY public.store_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255),
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    avatar_url character varying(255),
    website_url character varying(255),
    bio text,
    is_seller boolean DEFAULT false NOT NULL,
    username character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
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
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: industry_solutions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industry_solutions ALTER COLUMN id SET DEFAULT nextval('public.industry_solutions_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: payment_orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_orders ALTER COLUMN id SET DEFAULT nextval('public.payment_orders_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: purchases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases ALTER COLUMN id SET DEFAULT nextval('public.purchases_id_seq'::regclass);


--
-- Name: sourcing_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sourcing_requests ALTER COLUMN id SET DEFAULT nextval('public.sourcing_requests_id_seq'::regclass);


--
-- Name: store_bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_bookings ALTER COLUMN id SET DEFAULT nextval('public.store_bookings_id_seq'::regclass);


--
-- Name: store_customer_interactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_customer_interactions ALTER COLUMN id SET DEFAULT nextval('public.store_customer_interactions_id_seq'::regclass);


--
-- Name: store_customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_customers ALTER COLUMN id SET DEFAULT nextval('public.store_customers_id_seq'::regclass);


--
-- Name: store_inventory_txns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_inventory_txns ALTER COLUMN id SET DEFAULT nextval('public.store_inventory_txns_id_seq'::regclass);


--
-- Name: store_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_logs ALTER COLUMN id SET DEFAULT nextval('public.store_logs_id_seq'::regclass);


--
-- Name: store_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_notes ALTER COLUMN id SET DEFAULT nextval('public.store_notes_id_seq'::regclass);


--
-- Name: store_photos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_photos ALTER COLUMN id SET DEFAULT nextval('public.store_photos_id_seq'::regclass);


--
-- Name: store_product_photos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_product_photos ALTER COLUMN id SET DEFAULT nextval('public.store_product_photos_id_seq'::regclass);


--
-- Name: store_products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_products ALTER COLUMN id SET DEFAULT nextval('public.store_products_id_seq'::regclass);


--
-- Name: store_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_profiles ALTER COLUMN id SET DEFAULT nextval('public.store_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache (key, value, expiration) FROM stdin;
clawmart-cn-cache-5c785c036466adea360111aa28563bfd556b5fba:timer	i:1779919626;	1779919626
clawmart-cn-cache-5c785c036466adea360111aa28563bfd556b5fba	i:9;	1779919626
clawmart-cn-cache-industry_cls:5f4152cdb8693ed153cd36bd1686489e	a:3:{s:8:"industry";s:7:"unknown";s:10:"confidence";d:1;s:6:"reason";s:48:"用户输入与行业无关，属于闲聊内容";}	1780003990
clawmart-cn-cache-onboard_validate:name:8c8fa3529ee34d4e69a0baafb7069da3	a:3:{s:5:"valid";b:0;s:6:"reason";s:58:"纯语气词或拟声词，缺乏店铺/品牌标识意义";s:4:"data";N;}	1780005967
clawmart-cn-cache-industry_cls:7214f7942ac452cf8b31b98d1257fac5	a:3:{s:8:"industry";s:13:"餐饮/生鲜";s:10:"confidence";d:0.95;s:6:"reason";s:69:"烧烤摊属于餐饮类别，明确对应枚举值中的‘烧烤’";}	1780003991
clawmart-cn-cache-2a6a084366a262e36ab6cfa7cad0390e7d776de7:timer	i:1779920172;	1779920172
clawmart-cn-cache-industry_cls:fef2d53a8c6ba81619873039ca47764f	a:3:{s:8:"industry";s:13:"酒店/宾馆";s:10:"confidence";d:0.95;s:6:"reason";s:97:"用户明确提到在大理开民宿，民宿属于住宿类业务，对应酒店/宾馆类别。";}	1780003992
clawmart-cn-cache-onboard_validate:name:cec697da6920142c78d4fdde27b20578	a:3:{s:5:"valid";b:1;s:6:"reason";s:81:"符合店铺命名常见模式，包含姓氏和经营范围，属于合理名称";s:4:"data";N;}	1780006015
clawmart-cn-cache-industry_cls:62a559f3fa7748bc22f8e0766019d498	a:3:{s:8:"industry";s:7:"unknown";s:10:"confidence";d:1;s:6:"reason";s:42:"用户反问身份，未描述任何行业";}	1780003993
clawmart-cn-cache-industry_cls:b380bacb16d072fc610687c2c145b872	a:3:{s:8:"industry";s:13:"服务/咨询";s:10:"confidence";d:0.95;s:6:"reason";s:75:"用户明确提到'理发店'，属于理发行业，归类为服务/咨询";}	1780003993
clawmart-cn-cache-onboard_validate:name:900150983cd24fb0d6963f7d28e17f72	a:3:{s:5:"valid";b:0;s:6:"reason";s:63:"仅由无意义英文字母组成，缺乏店铺或品牌特征";s:4:"data";N;}	1780006016
clawmart-cn-cache-industry_cls:e1c7686264061cb9428c4224a6b7fa08	a:3:{s:8:"industry";s:13:"电商/零售";s:10:"confidence";d:0.98;s:6:"reason";s:72:"用户明确提到服装电商和淘宝店铺，属于电商零售行业";}	1780003994
clawmart-cn-cache-2a6a084366a262e36ab6cfa7cad0390e7d776de7	i:1;	1779920172
clawmart-cn-cache-industry_cls:059ae208ff58097f8f3aa2e1ef59a452	a:3:{s:8:"industry";s:13:"餐饮/生鲜";s:10:"confidence";d:1;s:6:"reason";s:42:"明确提到开奶茶店，属于餐饮类";}	1780004582
clawmart-cn-cache-a8d5bac95b7f7413e97f28483909bad93b2ced77:timer	i:1779920172;	1779920172
clawmart-cn-cache-onboard_validate:functions:8dfbfb5b56918017f7deb293aa715742	a:3:{s:5:"valid";b:1;s:6:"reason";s:103:"用户明确提到了'数据分析'和'客服'，对应平台功能中的'数据分析'和'AI客服'。";s:4:"data";a:1:{s:7:"matched";a:2:{i:0;s:8:"AI客服";i:1;s:12:"数据分析";}}}	1780006016
clawmart-cn-cache-industry_cls:098f6bcd4621d373cade4e832627b4f6	a:3:{s:8:"industry";s:7:"unknown";s:10:"confidence";d:0;s:6:"reason";s:63:"用户输入为无意义的测试词'test'，无法判断行业";}	1780004810
clawmart-cn-cache-d826b546a7ef8c3b376c34396b807af63d663d06:timer	i:1779918486;	1779918486
clawmart-cn-cache-d826b546a7ef8c3b376c34396b807af63d663d06	i:1;	1779918486
clawmart-cn-cache-c28cc88311554804d5ef6aee265a0801868a9644:timer	i:1779918486;	1779918486
clawmart-cn-cache-c28cc88311554804d5ef6aee265a0801868a9644	i:1;	1779918486
clawmart-cn-cache-industry_cls:cf834919f25458473e7fe6a4a6a23247	a:3:{s:8:"industry";s:7:"unknown";s:10:"confidence";d:1;s:6:"reason";s:42:"用户表达心情，与行业描述无关";}	1780004827
clawmart-cn-cache-industry_cls:536d447c99f10665cef08e77a8307dbb	a:3:{s:8:"industry";s:13:"电商/零售";s:10:"confidence";d:0.8;s:6:"reason";s:82:"五金店属于零售业态，销售商品给消费者，符合电商/零售类别";}	1780004863
clawmart-cn-cache-e90a5ba578e15dd262fff4cef9a7b1ae194f80ae:timer	i:1779918578;	1779918578
clawmart-cn-cache-e90a5ba578e15dd262fff4cef9a7b1ae194f80ae	i:1;	1779918578
clawmart-cn-cache-industry_cls:124756ef340daf80196b4124686d651c	a:3:{s:8:"industry";s:7:"unknown";s:10:"confidence";d:1;s:6:"reason";s:42:"用户问候，未描述任何行业信息";}	1780004919
clawmart-cn-cache-0c73b5beede3573f7766463221527c5a27b21c8b:timer	i:1779918726;	1779918726
clawmart-cn-cache-0c73b5beede3573f7766463221527c5a27b21c8b	i:2;	1779918726
clawmart-cn-cache-industry_cls:15e1a4a7155dd3cf079b77e3ad04d54c	a:3:{s:8:"industry";s:7:"unknown";s:10:"confidence";d:0.95;s:6:"reason";s:114:"用户输入内容为‘你在案例’，并非对行业问题的有效回答，属于闲聊或反问类表述。";}	1780005074
clawmart-cn-cache-onboard_validate:functions:0726205e5de6f71d8d2fcd5f0d61d77b	a:3:{s:5:"valid";b:0;s:6:"reason";s:57:"用户描述与平台功能无关，属于闲聊内容。";s:4:"data";a:1:{s:7:"matched";a:0:{}}}	1780006017
clawmart-cn-cache-a8d5bac95b7f7413e97f28483909bad93b2ced77	i:3;	1779920172
clawmart-cn-cache-onboard_validate:hasAccount:3ce05ea4b8c4ccc181b9605b05b3d85d	a:3:{s:5:"valid";b:1;s:6:"reason";s:54:"用户明确表示自己是老用户，即已有账号";s:4:"data";a:1:{s:11:"has_account";b:1;}}	1780006018
clawmart-cn-cache-onboard_validate:name:015505dde0445b779efa828f3741fd0f	a:3:{s:5:"valid";b:1;s:6:"reason";s:69:"包含英文缩写与中文品类词，符合常见店铺命名格式";s:4:"data";N;}	1780006513
clawmart-cn-cache-onboard_validate:hasAccount:858c036d6d17356bcb2e60a3ac3a03cf	a:3:{s:5:"valid";b:1;s:6:"reason";s:48:"用户明确表示还没注册，即没有账号";s:4:"data";a:1:{s:11:"has_account";b:0;}}	1780006019
clawmart-cn-cache-4738f41ad8ba5d15826a65bd1fc63efefaabfc1f:timer	i:1779920173;	1779920173
clawmart-cn-cache-onboard_validate:hasAccount:62a559f3fa7748bc22f8e0766019d498	a:3:{s:5:"valid";b:0;s:6:"reason";s:39:"用户反问，未表达是否有账号";s:4:"data";a:1:{s:11:"has_account";b:0;}}	1780006019
clawmart-cn-cache-4738f41ad8ba5d15826a65bd1fc63efefaabfc1f	i:1;	1779920173
clawmart-cn-cache-onboard_validate:functions:61bab047ca707fb03734829ddb025af2	a:3:{s:5:"valid";b:1;s:6:"reason";s:66:"用户明确表达要全部功能，按规则处理为全部功能";s:4:"data";a:1:{s:7:"matched";a:1:{i:0;s:12:"全部功能";}}}	1780006514
clawmart-cn-cache-4884ba4ae892a74c9160188405144cb70acf964b:timer	i:1779920174;	1779920174
clawmart-cn-cache-4884ba4ae892a74c9160188405144cb70acf964b	i:1;	1779920174
clawmart-cn-cache-onboard_validate:hasAccount:900639888843fad2069881138f7a80a3	a:3:{s:5:"valid";b:1;s:6:"reason";s:48:"用户明确表示是新用户，即没有账号";s:4:"data";a:1:{s:11:"has_account";b:0;}}	1780006514
clawmart-cn-cache-industry_cls:7eca689f0d3389d9dea66ae112e5cfd7	a:3:{s:8:"industry";s:7:"unknown";s:10:"confidence";d:1;s:6:"reason";s:51:"用户只是打招呼，未描述任何行业信息";}	1780006537
clawmart-cn-cache-onboard_validate:name:00c4cf469801b167b42d45f63a250afe	a:3:{s:5:"valid";b:0;s:6:"reason";s:70:"该文本为反问/询问语，不具备店铺或品牌名称的特征";s:4:"data";N;}	1780006551
clawmart-cn-cache-46dcf227ba2519bb0fc4cdb57e34ae8f97455cea:timer	i:1779920219;	1779920219
clawmart-cn-cache-46dcf227ba2519bb0fc4cdb57e34ae8f97455cea	i:1;	1779920219
clawmart-cn-cache-onboard_validate:name:05b7ba8cb7b2b7a2be57766a1801e55e	a:3:{s:5:"valid";b:1;s:6:"reason";s:48:"符合常见姓氏加称呼的店铺命名方式";s:4:"data";N;}	1780006560
clawmart-cn-cache-livewire-rate-limiter:c6bd452d8110558af6116214aec65a722f31f7a3:timer	i:1779930118;	1779930118
clawmart-cn-cache-livewire-rate-limiter:c6bd452d8110558af6116214aec65a722f31f7a3	i:1;	1779930118
clawmart-cn-cache-804d1220a95c0a85cf01d3d6c44a5b0985f02138:timer	i:1780925161;	1780925161
clawmart-cn-cache-804d1220a95c0a85cf01d3d6c44a5b0985f02138	i:1;	1780925161
clawmart-cn-cache-onboard_validate:name:28088e9f7c82bbbc4435fe8848f35e83	a:3:{s:5:"valid";b:0;s:6:"reason";s:146:"fallback: DeepSeek API 错误 402: {"error":{"message":"Insufficient Balance","type":"unknown_error","param":null,"code":"invalid_request_error"}}";s:4:"data";N;}	1781011502
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: industry_solutions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.industry_solutions (id, industry_key, name, emoji, tagline, pain_points, target_users, modules, keywords, listing_id, status, generation_error, generated_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listings (id, name, slug, price, description, image_url, status, category, created_at, updated_at, user_id, demo_messages, demo_personas) FROM stdin;
14	小红书运营助手	xiaohongshu-operations-kit	9.90	专为小红书内容创作者和品牌设计的技能包。包含爆款标题生成、笔记结构模板、话题标签策略、评论互动话术及数据复盘模板。一键输出符合平台算法偏好的图文内容，快速积累自然流量。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
15	公众号运营助手	wechat-official-account-kit	0.00	微信公众号全流程运营技能包。涵盖选题策划、排版规范、推文撰写、菜单配置建议与粉丝互动话术。内置多种文章风格模板（深度长文、轻量资讯、互动投票），帮助账号持续保持高打开率与低取关率。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
16	抖音爆款视频脚本	douyin-viral-script-kit	9.90	专为抖音创作者打造的脚本生成技能。内置钩子开场、情绪节奏、转折设计与引导关注话术模板。支持口播、剧情、测评、种草等多种视频类型，平均完播率提升 40%。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
17	AI 冷邮件外联	ai-cold-email-outreach-kit	0.00	B2B 销售团队必备技能包。自动研究目标客户背景、生成个性化开场白、撰写跟进序列邮件并优化主题行。平均回复率提升 3 倍，帮助销售团队高效拓客。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
18	Prompt 工程师工具包	prompt-engineering-toolkit	9.90	系统化提示词设计与优化技能。覆盖 Chain-of-Thought、Few-shot、ReAct、角色扮演等主流提示技巧，内含 200+ 可复用提示模板，帮助开发者快速构建高质量 AI 工作流。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
19	Next.js 全栈开发加速	nextjs-fullstack-accelerator	0.00	涵盖 Next.js App Router、API 设计、数据库集成与部署配置的完整开发技能。内置代码审查、性能优化建议与最佳实践检查清单，帮助独立开发者快速交付生产级应用。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
20	LinkedIn 个人品牌增长	linkedin-personal-brand-kit	9.90	专为职场人和创始人设计的 LinkedIn 运营技能。包含个人简介优化、内容日历规划、爆款帖子生成器、评论互动策略与连接请求话术，帮助账号在 30 天内实现粉丝量翻倍。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
21	电商选品与竞品分析	ecommerce-product-research-kit	0.00	跨境电商卖家的智能选品工具包。自动抓取 Amazon、速卖通热销数据，分析利润空间、竞争密度与趋势走向，输出可操作的选品报告，大幅降低新品试错成本。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
5	Elena · 数据分析师	elena-data-analyst	39.00	精通 Python、SQL 与 BI 工具的 AI 数据分析员。自动清洗原始数据、构建分析模型、生成可视化报告，并用非技术语言解读关键业务洞察。支持 Google Analytics、Mixpanel、Snowflake 等主流数据源接入。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的数据分析师 📊\\n精通 Python、SQL 与各类 BI 工具。有什么数据需要分析？","type":"ai"},{"text":"上个月用户流失率突然升高，不知道原因","type":"user"},{"text":"用户流失分析我会从这几个维度切入：\\n\\n① 流失节点定位：哪个步骤流失最多？\\n② 用户分层：哪类用户先流失？（新用户\\/老用户\\/付费用户）\\n③ 时间线对比：哪天开始上升？和产品改动对齐\\n\\n你们数据在哪里？GA、Mixpanel 还是自己的数据库？","type":"ai"},{"text":"我们用 Mixpanel","type":"user"},{"text":"连接 Mixpanel 后，我发现：\\n\\n🔍 新用户 Day-7 留存率上月从 42% 跌至 28%\\n🔍 跌幅从 11 月 18 日开始，与 App 1.3.2 版本发布同一天\\n🔍 主要流失发生在「完成首单」环节\\n\\n结论：1.3.2 版本改动了支付流程，导致结账转化率下降 33%。建议立即回滚该页面并 A\\/B 测试修复方案 📉","type":"ai"}]	\N
8	Alex · AI CEO	alex-ai-ceo	39.00	你的 AI CEO——负责产品交付、代码管理、沟通协调、记忆一切、运营你的业务。统筹调度其他 AI 员工，追踪项目进度，处理跨部门协作，让你专注于最重要的决策。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好，我是 Alex，你的 AI CEO 👔\\n负责统筹所有 AI 员工、追踪项目进度、处理跨部门协调。你现在最大的业务挑战是什么？","type":"ai"},{"text":"我一个人管着产品、运营、客服，完全忙不过来","type":"user"},{"text":"这很常见。你现在做的 80% 的事情都可以交给 AI 员工。\\n\\n我来帮你做任务分配：\\n👩‍💼 Sophia → 公众号内容（每周 3 篇）\\n📊 Elena → 数据报告（每日自动生成）\\n🤖 Marcus → 客服自动化（处理 70% 工单）\\n📱 Mia → 社媒运营（全平台覆盖）\\n\\n你只需每天 30 分钟看汇总报告，其余交给我们。","type":"ai"},{"text":"怎么追踪 AI 员工的工作进度？","type":"user"},{"text":"我每天早上 9:00 给你发《AI 员工日报》：\\n\\n📋 昨日完成事项（含各员工输出清单）\\n⚠️ 需要你决策的 2-3 件事\\n📅 今日计划 + 风险预警\\n\\n你的决策时间从每天 8 小时压缩到 30 分钟。这就是雇 AI CEO 的价值 💼","type":"ai"}]	\N
12	Kevin · 产品经理	kevin-product-manager	39.00	经验丰富的 AI 产品经理。负责需求拆解、PRD 撰写、用户故事梳理与优先级排序，协调研发、设计与运营团队高效协作。擅长竞品分析、MVP 定义与版本迭代规划，帮助产品从 0 到 1 快速落地。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的产品经理 📋\\n负责需求拆解、PRD 撰写与版本规划。你们现在有什么产品需求需要梳理？","type":"ai"},{"text":"我们要做一个用户积分系统，目标是提升复购率","type":"user"},{"text":"目标是提升复购，这是最常见的积分模型。核心设计：\\n\\n📝 积分获取：消费 1 元 = 10 积分，签到 +5\\/天\\n🎁 兑换规则：100 积分 = 1 元优惠券（满 50 元可用）\\n⏰ 有效期：12 个月，到期前 30 天提醒\\n\\n预计首单复购率提升 25-35%。需要我出完整 PRD 吗？","type":"ai"},{"text":"需要，同时帮我想想可能的坑","type":"user"},{"text":"完整 PRD 已生成，共 15 页，包含用户故事、流程图和边界条件。\\n\\n⚠️ 需要注意的 3 个坑：\\n\\n① 积分刷单风险：需要设置单日上限和异常行为检测\\n② 优惠券核销与库存：防止超发导致亏损\\n③ 积分通胀：半年后用户手里积分太多会降低品牌溢价\\n\\n建议在 PRD 中加入「积分健康度监控」机制 📊","type":"ai"}]	\N
22	Figma 设计系统生成器	figma-design-system-generator	9.90	一键生成完整设计系统的 AI 技能。根据品牌色和字体偏好，自动产出组件库规范、间距系统、图标风格指南与深色模式适配方案，让设计与研发协作效率提升 50%。	\N	available	设计	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
23	投资人 Pitch Deck	investor-pitch-deck-kit	0.00	帮助创业者打磨融资演示文稿的技能包。涵盖问题定义、市场规模、商业模式、竞争壁垒与财务预测各模块的撰写框架，并内置顶级 VC 常见问题应答库，大幅提升路演通过率。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
24	AI 客服知识库构建	ai-knowledge-base-builder	9.90	快速搭建企业专属 AI 知识库的工具包。自动整理 FAQ、产品文档与历史工单，生成结构化知识图谱，支持接入 ChatBot 或内部搜索系统，让客服响应准确率达到 90% 以上。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
25	本体知识图谱	ontology	0.00	用于结构化智能体记忆与可组合技能的类型化知识图谱。支持创建和查询实体（人物、项目、任务、事件、文档），关联对象，执行约束校验，将多步骤操作规划为图变换，以及跨技能共享状态。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
26	自我进化智能体	self-improving-agent	9.90	捕获学习经验、错误与修正以实现持续改进。适用于命令意外失败、用户纠正 AI 输出、需要记录操作规律等场景，让智能体越用越聪明。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
27	Google 全家桶命令行	google-workspace-cli	0.00	一站式操控 Gmail、Google Calendar、Drive、Contacts、Sheets 和 Docs 的命令行技能包。让 AI 直接读写你的 Google 工作区，自动化日常办公流程。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
28	Tavily 网页搜索	tavily-web-search	9.90	通过 Tavily API 实现 AI 优化的网页搜索。为 AI 智能体返回简洁、相关的搜索结果，无需浏览器，响应速度极快。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
29	技能发现助手	find-skills	0.00	当用户询问如何做某件事或寻找特定功能时，自动帮助发现并安装合适的智能体技能。是扩展 AI 能力边界的最佳入口。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
30	内容摘要生成器	summarize	9.90	一键摘要 URL 或文件内容，支持网页、PDF、图片、音频和 YouTube 视频。使用 summarize CLI 驱动，无需额外 API Key。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
31	AI 浏览器自动化	agent-browser	0.00	基于 Rust 的高速无头浏览器自动化 CLI，支持 Node.js 降级。让 AI 智能体实现页面导航、点击、输入和截图，通过结构化命令完全控制浏览器行为。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
32	GitHub 操作包	github-cli-kit	9.90	使用 gh CLI 与 GitHub 深度集成。支持 Issue 管理、PR 审查、CI 运行监控与 API 高级查询，让 AI 直接参与代码协作流程。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
33	实时天气查询	weather-forecast	0.00	获取当前天气状况与未来预报，无需 API Key。支持全球城市查询，可集成到日程规划、出行助手等工作流中。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
34	Polymarket 预测市场	polymarket-odds	9.90	查询 Polymarket 预测市场数据，检查赔率、热门市场、事件搜索、价格走势与动量分析。包含观察列表提醒、结算日历与市场对比功能。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
35	主动型智能体框架	proactive-agent	0.00	将 AI 从任务执行者升级为主动合作伙伴，能预判需求、持续自我改进。包含 WAL 协议、工作缓冲区、自主定时任务与实战验证模式。Hal Stack 系列。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
36	Notion 工作区管理	notion-workspace	9.90	通过 Notion API 创建和管理页面、数据库与内容块。让 AI 直接读写你的 Notion 工作区，自动化知识管理与项目追踪流程。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
37	PDF 自然语言编辑器	nano-pdf-editor	0.00	用自然语言指令编辑 PDF 文件。基于 nano-pdf CLI，支持文本修改、页面操作与内容提取，无需专业 PDF 工具。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
38	AI 图像生成与编辑	ai-image-generator	9.90	基于 Gemini 3 Pro 的图像生成与编辑技能。支持文字生成图像和图像二次编辑，提供 1K/2K/4K 分辨率输出，可用于设计素材、营销图片与创意内容生产。	\N	available	设计	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
39	API 网关集成	api-gateway-kit	0.00	一键接入 100+ 主流 API，包括 Google Workspace、Microsoft 365、GitHub、Notion、Slack、Airtable、HubSpot 等，托管 OAuth 认证，无需手动配置密钥。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
40	Obsidian 笔记自动化	obsidian-automation	9.90	操作 Obsidian 知识库（Markdown 笔记）并通过 obsidian-cli 实现自动化。支持笔记创建、搜索、链接管理与双链知识图谱维护。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
41	Whisper 本地语音转文字	openai-whisper-local	0.00	使用 OpenAI Whisper CLI 实现本地语音转文字，无需 API Key，数据完全本地处理。支持多语言识别，适合会议记录、播客转写与语音备忘录场景。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
42	AI 写作人性化改写	humanizer-ai-text	9.90	去除 AI 写作痕迹，让文本更自然真实。自动检测并修正夸张象征、宣传语气、表面分析、模糊归因、破折号滥用、三段式结构与 AI 专属词汇等问题。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
43	免费 AI 模型管理器	free-ai-model-manager	0.00	通过 OpenRouter 管理免费 AI 模型，自动按质量排名、配置降级回退策略并更新 OpenClaw 配置。让你始终使用最优质的免费模型，零成本运行 AI 工作流。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
44	MCP 服务器管理工具	mcp-server-manager	9.90	使用 mcporter CLI 列出、配置、认证并调用 MCP 服务器与工具，支持 HTTP 和 stdio 模式，包括临时服务器、配置编辑与 CLI 类型生成。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
45	Brave 网页搜索	brave-search-kit	0.00	通过 Brave Search API 实现网页搜索与内容提取。适用于文档查询、事实核验或任意网页内容获取，轻量级设计，无需浏览器。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
46	项目知识上下文管理	project-knowledge-context	9.90	使用 ByteRover 上下文树管理项目知识，提供查询和整理两种操作。适用于信息检索、规律发现与跨会话知识持久化场景。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
47	智能体自动更新器	auto-updater-skill	0.00	每日自动更新 OpenClaw 及所有已安装技能。通过 cron 定时运行，检查更新、自动应用，并向用户发送变更摘要，保持 AI 工作流始终处于最新状态。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
48	Slack 消息自动化	slack-automation-kit	9.90	通过 Slack API 实现消息发送、频道管理、工作流触发与通知自动化。支持定时推送、关键词监听与多频道批量操作，让团队沟通效率翻倍。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
49	SQL 数据库查询助手	sql-query-assistant	0.00	自然语言转 SQL 查询技能。支持 MySQL、PostgreSQL、SQLite 等主流数据库，自动生成复杂查询、优化执行计划并解释查询结果，让非技术人员也能轻松操作数据库。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
50	Docker 容器管理	docker-management-kit	9.90	AI 驱动的 Docker 容器管理工具包。支持容器启停、镜像构建、日志分析、网络配置与 Docker Compose 编排，让运维操作变得简单直观。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
51	代码审查与重构	code-review-refactor-kit	0.00	专业级代码审查与重构技能包。自动检测代码异味、安全漏洞、性能瓶颈与可读性问题，提供具体修复建议与重构方案，支持 Python、JavaScript、TypeScript、Go 等主流语言。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
52	多语言翻译	multilingual-translation-kit	9.90	支持 100+ 语言的专业翻译技能包。具备语境感知、行业术语库与品牌语调一致性保障，适用于产品文档、营销内容、法律合同与用户界面本地化翻译。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
53	会议记录与行动项提取	meeting-notes-action-items	0.00	自动整理会议记录，提取关键决策与行动项，分配责任人并设定截止日期。支持语音转文字输入，输出结构化会议纪要并同步至 Notion、飞书、Slack 等协作工具。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
54	Airtable 数据库自动化	airtable-automation-kit	9.90	通过自然语言操作 Airtable 数据库。支持记录增删改查、视图筛选、自动化规则配置与跨表关联，让业务数据管理变得像对话一样简单。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
55	邮件营销序列生成器	email-marketing-sequence	0.00	自动生成高转化率的邮件营销序列。涵盖欢迎系列、培育序列、复购激活与流失挽回邮件，内置 A/B 测试建议与主题行优化，适配 Mailchimp、SendGrid 等主流平台。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
56	竞品监控与分析	competitor-monitoring-kit	9.90	持续追踪竞争对手的产品更新、定价变化、营销动态与用户反馈。自动生成竞品对比报告，识别市场空白与差异化机会，帮助产品和营销团队保持竞争优势。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
57	Jira 项目管理助手	jira-project-management	0.00	通过自然语言操作 Jira，实现 Issue 创建、Sprint 规划、工时记录与看板管理。自动生成迭代报告、燃尽图分析与团队工作负载均衡建议。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
58	品牌视觉识别系统	brand-visual-identity-kit	9.90	一站式品牌视觉设计技能。根据品牌定位自动生成 Logo 概念方案、色彩系统、字体搭配、图标风格与品牌使用规范手册，帮助初创企业快速建立专业品牌形象。	\N	available	设计	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
59	Stripe 支付集成	stripe-payment-integration	0.00	快速集成 Stripe 支付系统的开发技能包。涵盖一次性支付、订阅管理、退款处理、Webhook 配置与财务对账自动化，支持多币种与多种支付方式。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
60	用户调研与访谈分析	user-research-interview-kit	9.90	AI 驱动的用户调研全流程技能。自动设计访谈问卷、分析访谈录音、提炼用户痛点与需求洞察，生成结构化用户画像与产品改进建议报告。	\N	available	设计	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
61	自动化测试生成	automated-test-generation	0.00	自动为代码库生成单元测试、集成测试与端到端测试。支持 Jest、Pytest、Cypress 等主流测试框架，自动计算覆盖率并识别未测试的关键路径。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
62	飞书文档自动化	feishu-lark-automation	9.90	深度集成飞书（Lark）工作区，实现文档创建、多维表格操作、日历管理、消息推送与审批流程自动化。专为国内企业协作场景优化，大幅提升团队工作效率。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
63	舆情监控与品牌声誉管理	brand-reputation-monitoring	0.00	实时监控品牌在微博、微信、知乎、抖音等平台的舆情动态，自动识别负面内容并生成应对建议，帮助企业将危机扼杀在萌芽阶段，维护品牌声誉。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
64	AWS 云资源管理	aws-cloud-management	9.90	用自然语言管理 AWS 云资源。支持 EC2、S3、Lambda、RDS 等核心服务的查询、配置与成本优化建议，帮助开发团队降低云支出并提升资源利用率。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
65	知乎高赞回答生成器	zhihu-answer-generator	0.00	专为知乎平台优化的内容创作技能。分析热门话题结构与高赞回答规律，自动生成有深度、有观点、有数据支撑的专业回答，帮助个人和品牌在知乎建立行业权威形象。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
66	B 站视频脚本与封面	bilibili-content-kit	9.90	专为 B 站 UP 主打造的内容创作工具包。包含选题策划、视频脚本、分镜建议、封面文案设计与标签优化，帮助视频快速进入推荐流，提升播放量与粉丝增长。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
67	HubSpot CRM 自动化	hubspot-crm-automation	0.00	深度集成 HubSpot CRM，实现联系人管理、销售漏斗追踪、自动跟进任务创建与营销邮件触发。结合 AI 分析客户行为，帮助销售团队精准把握成交时机。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
68	Vercel 部署自动化	vercel-deployment-automation	9.90	一键管理 Vercel 项目部署、环境变量配置、域名绑定与性能监控。支持预览部署链接生成、回滚操作与 Edge Function 配置，让前端部署流程完全自动化。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
69	播客内容生产	podcast-production-kit	0.00	播客创作者的全流程 AI 助手。涵盖选题策划、嘉宾问题设计、开场白与结束语生成、录音转写、内容摘要与多平台推广文案，让每期播客的制作时间缩短 60%。	\N	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
70	Claude 系统提示词优化	claude-system-prompt-optimizer	9.90	专为 Claude 模型优化的系统提示词工程技能。内含角色设定、输出格式控制、思维链激活、安全边界设置与多轮对话记忆管理等高级技巧，大幅提升 AI 输出质量。	\N	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
71	独立开发者启动包	indie-hacker-starter-kit	0.00	专为独立开发者和一人公司设计的全栈 AI 工具包。涵盖产品定位、落地页文案、定价策略、冷启动增长方法与早期用户获取，帮助你在 30 天内完成从想法到首批付费用户的完整旅程。	\N	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
72	OpenClaw 企业级营销助手	openclaw-enterprise-marketing	9.90	专门为中小型企业设计的 AI 营销角色。能够自动生成社交媒体内容、分析市场趋势并优化广告投放。包含全套自动化工作流。	https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
73	Python 自动化工程专家	python-automation-expert	0.00	一个高度优化的 AI 角色，精通 Python 自动化脚本编写、API 集成和数据处理。内置 50+ 常用自动化模板。	https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
74	极简主义 UI/UX 设计师	minimalist-uiux-designer	9.90	专注于现代 SaaS 产品界面的 AI 设计智能体。能够基于简单的描述生成 Figma 布局建议、配色方案和交互原型。	https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop	available	设计	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
75	电商运营增长黑客	ecommerce-growth-hacker	0.00	为独立站和电商平台设计的 AI 助手。监控竞争对手价格、优化产品标题并自动处理客户常见咨询。大幅提升转化率。	https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop	available	营销	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
76	Rust 系统性能优化专家	rust-performance-expert	9.90	高级 AI 角色，专注于低延迟系统设计和 Rust 代码优化。能够重构瓶颈代码并提供内存安全建议。	https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop	available	工程	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
77	创意文案排版智能体	creative-copy-typesetter	0.00	一个轻量级的技能插件，用于优化长篇博文和营销邮件的视觉层次和可读性。支持多种排版风格。	https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
78	财务审计与报表分析员	finance-audit-analyst	9.90	合规性极强的 AI 智能体。能够处理复杂的财务数据导出、自动进行账目比对并生成季度合规性分析报告。	https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
79	法律条款分析助手 (中国版)	legal-clause-analyzer-cn	0.00	深入理解中国商法和劳动法的 AI 角色。帮助初创企业快速审核合同风险并提供法律条款合规建议。	https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop	available	其他	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	\N
80	小保 · 保险理赔专员	xiaobao-insurance-claims	39.00	专为保险公司及代理团队打造的 AI 理赔专员。熟悉各险种理赔流程，能快速判断理赔材料完整性、指导客户收集证明文件、自动生成理赔进度通知，并在争议情况下提供话术辅助。让每一位客户在出险时感受到专业陪伴。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u5ba2\\u6237\\u62a5\\u6848","messages":[{"type":"user","text":"\\u6211\\u8f66\\u6628\\u5929\\u8ffd\\u5c3e\\u4e86\\uff0c\\u8981\\u600e\\u4e48\\u7406\\u8d54"},{"type":"ai","text":"\\u2705 \\u6536\\u5230\\uff01\\u5148\\u786e\\u8ba4\\u4e00\\u4e0b\\u60a8\\u7684\\u60c5\\u51b5\\uff1a\\n\\n\\ud83d\\udccb \\u8bf7\\u95ee\\u4e8b\\u6545\\u5df2\\u7ecf\\u5904\\u7406\\u4e86\\u5417\\uff1f\\n\\u2460 \\u5df2\\u62a5\\u8b66 + \\u4ea4\\u8b66\\u51fa\\u5177\\u4e8b\\u6545\\u8ba4\\u5b9a\\u4e66 \\u2713\\n\\u2461 \\u53cc\\u65b9\\u79c1\\u4e86\\u534f\\u8bae \\u2713\\n\\u2462 \\u8fd8\\u672a\\u5904\\u7406\\n\\n\\u4e0d\\u540c\\u60c5\\u51b5\\u6240\\u9700\\u6750\\u6599\\u7565\\u6709\\u4e0d\\u540c\\uff0c\\u8bf7\\u544a\\u8bc9\\u6211\\u662f\\u54ea\\u79cd\\uff1f"},{"type":"user","text":"\\u5df2\\u7ecf\\u62a5\\u8b66\\u4e86\\uff0c\\u8d23\\u4efb\\u5bf9\\u65b9\\u5168\\u8d23"},{"type":"ai","text":"\\u2705 \\u660e\\u767d\\uff0c\\u5bf9\\u65b9\\u5168\\u8d23\\u60c5\\u51b5\\u4e0b\\u60a8\\u53ef\\u4ee5\\u8d70\\u5bf9\\u65b9\\u4e09\\u8005\\u9669\\uff0c\\u6d41\\u7a0b\\u6700\\u7b80\\u5355\\uff01\\n\\n\\ud83d\\udcca \\u6240\\u9700\\u6750\\u6599\\u6e05\\u5355\\uff1a\\n\\u2460 \\u9a7e\\u9a76\\u8bc1 + \\u884c\\u9a76\\u8bc1\\uff08\\u590d\\u5370\\u4ef6\\uff09\\n\\u2461 \\u4e8b\\u6545\\u8ba4\\u5b9a\\u4e66\\uff08\\u4ea4\\u8b66\\u51fa\\u5177\\u539f\\u4ef6\\uff09\\n\\u2462 \\u7ef4\\u4fee\\u53d1\\u7968 + \\u6e05\\u5355\\n\\u2463 \\u94f6\\u884c\\u5361\\u4fe1\\u606f\\uff08\\u7528\\u4e8e\\u8d54\\u6b3e\\u5230\\u8d26\\uff09\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\u5148\\u8054\\u7cfb\\u5bf9\\u65b9\\u4fdd\\u9669\\u516c\\u53f8\\uff0c\\u62a5\\u6848\\u53f7\\u62ff\\u5230\\u540e\\u6211\\u5e2e\\u60a8\\u8ddf\\u8fdb\\u8fdb\\u5ea6\\u3002\\u9700\\u8981\\u6211\\u5e2e\\u60a8\\u51c6\\u5907\\u8054\\u7cfb\\u5bf9\\u65b9\\u4fdd\\u53f8\\u7684\\u8bdd\\u672f\\u5417\\uff1f"}]},{"label":"\\u7406\\u8d54\\u4e89\\u8bae","messages":[{"type":"user","text":"\\u4fdd\\u9669\\u516c\\u53f8\\u8bf4\\u6211\\u7684\\u5b9a\\u635f\\u91d1\\u989d\\u592a\\u4f4e\\uff0c\\u624d\\u7ed91200\\uff0c\\u5b9e\\u9645\\u4fee\\u4e863800"},{"type":"ai","text":"\\u26a0\\ufe0f \\u8fd9\\u79cd\\u60c5\\u51b5\\u5e76\\u4e0d\\u5c11\\u89c1\\uff0c\\u5b9a\\u635f\\u91d1\\u989d\\u4e0e\\u5b9e\\u9645\\u7ef4\\u4fee\\u8d39\\u7528\\u5dee\\u8ddd\\u8f83\\u5927\\uff0c\\u60a8\\u6709\\u6743\\u7533\\u8bf7\\u91cd\\u65b0\\u5b9a\\u635f\\uff01\\n\\n\\ud83d\\udcca \\u5efa\\u8bae\\u64cd\\u4f5c\\u6b65\\u9aa4\\uff1a\\n\\u2460 \\u8981\\u6c42\\u4fdd\\u9669\\u516c\\u53f8\\u51fa\\u5177\\u4e66\\u9762\\u5b9a\\u635f\\u660e\\u7ec6\\uff0c\\u9010\\u9879\\u6838\\u5bf9\\n\\u2461 \\u6536\\u96c6\\u7ef4\\u4fee\\u5382\\u7684\\u7ef4\\u4fee\\u62a5\\u4ef7\\u5355\\uff08\\u542b\\u5de5\\u65f6\\u8d39 + \\u914d\\u4ef6\\u8d39\\uff09\\n\\u2462 \\u5982\\u5bf9\\u65b9\\u575a\\u6301\\uff0c\\u53ef\\u7533\\u8bf7\\u4fdd\\u9669\\u884c\\u4e1a\\u534f\\u4f1a\\u8c03\\u89e3\\n\\n\\ud83d\\udca1 \\u6211\\u5e2e\\u60a8\\u8d77\\u8349\\u4e00\\u5c01\\u6295\\u8bc9\\u51fd\\uff0c\\u53d1\\u7ed9\\u4fdd\\u9669\\u516c\\u53f8\\u7406\\u8d54\\u4e3b\\u7ba1\\uff0c\\u6210\\u529f\\u7387\\u8f83\\u9ad8\\u3002\\u662f\\u5426\\u9700\\u8981\\uff1f"},{"type":"user","text":"\\u9700\\u8981\\uff0c\\u5e2e\\u6211\\u5199"},{"type":"ai","text":"\\ud83d\\udcdd \\u6295\\u8bc9\\u51fd\\u8349\\u7a3f\\uff1a\\n\\n\\u5c0a\\u656c\\u7684[\\u4fdd\\u9669\\u516c\\u53f8]\\u7406\\u8d54\\u90e8\\u95e8\\uff1a\\n\\n\\u672c\\u4eba\\u4e8e[\\u65e5\\u671f]\\u53d1\\u751f\\u4ea4\\u901a\\u4e8b\\u6545\\uff0c\\u5df2\\u4e8e\\u8d35\\u53f8\\u62a5\\u6848\\uff08\\u6848\\u53f7\\uff1a[\\u6848\\u53f7]\\uff09\\u3002\\u7ecf\\u7ef4\\u4fee\\u5382\\u5b9e\\u9645\\u68c0\\u4fee\\uff0c\\u7ef4\\u4fee\\u8d39\\u7528\\u5408\\u8ba1 \\u00a53,800\\uff0c\\u4f46\\u8d35\\u53f8\\u5b9a\\u635f\\u91d1\\u989d\\u4ec5\\u4e3a \\u00a51,200\\uff0c\\u5dee\\u8ddd\\u8fbe \\u00a52,600\\u3002\\n\\n\\u672c\\u4eba\\u8ba4\\u4e3a\\u5b9a\\u635f\\u91d1\\u989d\\u4e25\\u91cd\\u504f\\u4f4e\\uff0c\\u7279\\u63d0\\u51fa\\u5f02\\u8bae\\uff0c\\u8981\\u6c42\\u8d35\\u53f8\\u91cd\\u65b0\\u59d4\\u6d3e\\u5b9a\\u635f\\u5458\\u6838\\u5b9e\\uff0c\\u5e76\\u63d0\\u4f9b\\u5b8c\\u6574\\u5b9a\\u635f\\u660e\\u7ec6\\u3002\\u82e5\\u65e0\\u6cd5\\u534f\\u5546\\u4e00\\u81f4\\uff0c\\u672c\\u4eba\\u5c06\\u5411\\u94f6\\u4fdd\\u76d1\\u5c40\\u6295\\u8bc9\\u3002\\n\\n\\u2705 \\u51fd\\u4ef6\\u5df2\\u751f\\u6210\\uff0c\\u586b\\u5165\\u60a8\\u7684\\u4fe1\\u606f\\u540e\\u5373\\u53ef\\u53d1\\u9001\\u3002\\u9700\\u8981\\u6211\\u5e2e\\u60a8\\u67e5\\u4e00\\u4e0b\\u8be5\\u4fdd\\u53f8\\u7684\\u6295\\u8bc9\\u70ed\\u7ebf\\u5417\\uff1f"}]}]
81	生鲜门店 AI 店长助手	fresh-market-ai-manager	299.00	专为生鲜连锁门店打造的全链路 AI 经营系统。核心理念：「人工碎片化输入 + AI 结构化处理 + AI 智能决策」，彻底解决生鲜行业规格混乱、信息录入难、损耗高的三大痛点。\n\n涵盖九大功能模块：\n① AI 店长助手（语音/拍照上报，企业微信集成）\n② 商品库与实时库存系统\n③ AI 智能下单预测（天气/节假日多因子模型）\n④ AI 促销清货引擎（自动触发，临期预警）\n⑤ 竞品情报系统（爬虫+员工上报）\n⑥ 财务支出智能管理（OCR 票据识别）\n⑦ 人事人才库（自然语言简历搜索）\n⑧ 多维数据看板（门店/总部/单品三级）\n⑨ 权限管理中心（总部/店长/店员/财务四级）\n\n适用场景：香港/内地生鲜连锁门店、生鲜超市、农贸市场档主升级。安装后可接入企业微信，店员无需培训即可上报实况。	https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u8001\\u677f\\u7aef","messages":[{"type":"user","text":"\\u4e0a\\u5468\\u6574\\u4f53\\u6bdb\\u5229\\u600e\\u4e48\\u6837\\uff1f"},{"type":"ai","text":"\\ud83d\\udcca \\u4e0a\\u5468\\u7ecf\\u8425\\u7b80\\u62a5\\uff084\\u67081\\u65e5\\uff0d4\\u67086\\u65e5\\uff09\\n\\n\\u603b\\u8425\\u4e1a\\u989d\\uff1a\\u00a538,420\\u3000\\u6bdb\\u5229\\u7387\\uff1a23.6%\\uff08\\u21911.2%\\uff09\\n\\u635f\\u8017\\u91d1\\u989d\\uff1a\\u00a51,240\\uff08\\u635f\\u8017\\u7387 3.2%\\uff0c\\u884c\\u4e1a\\u5747\\u503c 5.8%\\uff09\\n\\n\\ud83d\\udca1 \\u4eae\\u70b9\\uff1a\\u80e1\\u841d\\u535c\\u3001\\u897f\\u7ea2\\u67ff\\u8fde\\u7eed\\u7206\\u6b3e\\uff0c\\u5408\\u8ba1\\u8d21\\u732e\\u6bdb\\u5229 34%\\n\\u26a0\\ufe0f \\u98ce\\u9669\\uff1a\\u8349\\u8393\\u672c\\u5468\\u8fdb\\u8d27\\u91cf\\u504f\\u9ad8\\uff0c\\u5efa\\u8bae\\u63d0\\u524d\\u4fc3\\u9500"},{"type":"user","text":"\\u8349\\u8393\\u600e\\u4e48\\u5904\\u7406"},{"type":"ai","text":"\\u2705 \\u5df2\\u4e3a\\u8349\\u8393\\u751f\\u6210\\u6e05\\u8d27\\u65b9\\u6848\\uff1a\\n\\n\\u4eca\\u65e5\\u4e0b\\u5348\\u89e6\\u53d1\\u300c\\u4e70\\u4e8c\\u9001\\u4e00\\u300d\\u6d3b\\u52a8\\n\\u9884\\u8ba1\\u6d88\\u5316\\u5e93\\u5b58 80%\\uff0c\\u635f\\u8017\\u964d\\u81f3 \\u00a5120 \\u4ee5\\u5185\\n\\n\\u662f\\u5426\\u6388\\u6743\\u5e97\\u957f\\u6267\\u884c\\uff1f"},{"type":"user","text":"\\u6388\\u6743"},{"type":"ai","text":"\\u2705 \\u5df2\\u901a\\u77e5\\u5404\\u95e8\\u5e97\\u5e97\\u957f\\u6267\\u884c\\u8349\\u8393\\u4fc3\\u9500\\n\\ud83d\\udcf2 \\u540c\\u6b65\\u63a8\\u9001\\u4f01\\u4e1a\\u5fae\\u4fe1\\u901a\\u77e5\\n\\n\\u4eca\\u65e5 17:00 \\u5c06\\u751f\\u6210\\u4fc3\\u9500\\u6548\\u679c\\u9884\\u62a5\\uff0c\\u8bf7\\u67e5\\u6536\\u3002"},{"type":"user","text":"\\u5e2e\\u6211\\u51fa\\u4e00\\u4efd\\u672c\\u6708\\u7684\\u8d22\\u52a1\\u62a5\\u8868"},{"type":"ai","text":"\\ud83d\\udccb \\u672c\\u6708\\u8d22\\u52a1\\u62a5\\u8868\\uff08\\u622a\\u81f34\\u67086\\u65e5\\uff09\\n\\n\\u8425\\u4e1a\\u6536\\u5165\\uff1a\\u00a5162,480\\n\\u91c7\\u8d2d\\u6210\\u672c\\uff1a\\u00a5108,360\\uff08\\u6210\\u672c\\u7387 66.7%\\uff09\\n\\u5458\\u5de5\\u5de5\\u8d44\\uff1a\\u00a522,400\\n\\u79df\\u91d1\\u6c34\\u7535\\uff1a\\u00a59,800\\n\\u5176\\u4ed6\\u6742\\u8d39\\uff1a\\u00a51,240\\n\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\n\\u7a0e\\u524d\\u51c0\\u5229\\u6da6\\uff1a\\u00a520,680\\uff08\\u5229\\u6da6\\u7387 12.7%\\uff09\\n\\n\\ud83d\\udcc8 \\u540c\\u6bd4\\u4e0a\\u6708\\uff1a+8.4%\\n\\n\\u662f\\u5426\\u9700\\u8981\\u5bfc\\u51fa Excel \\u53d1\\u7ed9\\u8d22\\u52a1\\uff1f"},{"type":"user","text":"\\u53d1\\u7ed9\\u8d22\\u52a1\\uff0c\\u53e6\\u5916\\u4e0a\\u4e2a\\u6708\\u54ea\\u4e2a\\u5458\\u5de5\\u4e1a\\u7ee9\\u6700\\u597d"},{"type":"ai","text":"\\u2705 \\u8d22\\u52a1\\u62a5\\u8868\\u5df2\\u53d1\\u9001\\u7ed9\\u8d22\\u52a1\\u5c0f\\u674e\\n\\n\\ud83c\\udfc6 \\u4e0a\\u6708\\u5458\\u5de5\\u4e1a\\u7ee9\\u6392\\u540d\\uff1a\\n\\n\\u7b2c1\\u540d\\u3000\\u5c0f\\u738b\\uff08\\u5e97\\u957f\\uff09\\u3000\\u3000\\u8d1f\\u8d23\\u65f6\\u6bb5\\u8425\\u4e1a\\u989d \\u00a542,100\\n\\u7b2c2\\u540d\\u3000\\u5c0f\\u9648\\uff08\\u6536\\u94f6\\uff09\\u3000\\u3000\\u5904\\u7406\\u8ba2\\u5355 1,820 \\u7b14\\uff0c\\u5dee\\u9519\\u7387 0%\\n\\u7b2c3\\u540d\\u3000\\u5c0f\\u6797\\uff08\\u7406\\u8d27\\uff09\\u3000\\u3000\\u5546\\u54c1\\u4e0a\\u67b6\\u53ca\\u65f6\\u7387 98%\\uff0c\\u96f6\\u5ba2\\u8bc9\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\u672c\\u6708\\u7ee9\\u6548\\u5956\\u91d1\\u53ef\\u53c2\\u8003\\u4ee5\\u4e0a\\u6392\\u540d\\u5206\\u914d\\uff0c\\u662f\\u5426\\u751f\\u6210\\u5956\\u91d1\\u65b9\\u6848\\uff1f"},{"type":"user","text":"\\u751f\\u6210\\u5956\\u91d1\\u65b9\\u6848"},{"type":"ai","text":"\\ud83d\\udcb0 \\u672c\\u6708\\u7ee9\\u6548\\u5956\\u91d1\\u65b9\\u6848\\uff08\\u5efa\\u8bae\\uff09\\n\\n\\u5c0f\\u738b\\uff08\\u5e97\\u957f\\uff09\\u3000\\u00a51,200\\u3000\\u2014\\u2014\\u8d85\\u989d\\u5b8c\\u6210\\u6307\\u6807 +15%\\n\\u5c0f\\u9648\\uff08\\u6536\\u94f6\\uff09\\u3000\\u00a5600\\u3000\\u3000\\u2014\\u2014\\u96f6\\u5dee\\u9519\\u5168\\u52e4\\n\\u5c0f\\u6797\\uff08\\u7406\\u8d27\\uff09\\u3000\\u00a5400\\u3000\\u3000\\u2014\\u2014\\u5546\\u54c1\\u7ba1\\u7406\\u4f18\\u79c0\\n\\u5176\\u4f59\\u5458\\u5de5\\u3000\\u3000\\u3000\\u00a5200\\u3000\\u3000\\u2014\\u2014\\u57fa\\u7840\\u51fa\\u52e4\\u5956\\n\\n\\u5408\\u8ba1\\u5956\\u91d1\\uff1a\\u00a52,800\\n\\n\\u662f\\u5426\\u786e\\u8ba4\\u5e76\\u901a\\u77e5 HR \\u5c0f\\u5f20\\u8d70\\u5ba1\\u6279\\u6d41\\u7a0b\\uff1f"}]},{"label":"\\u5e97\\u957f\\u7aef","messages":[{"type":"user","text":"\\u80e1\\u841d\\u535c\\u4eca\\u5929\\u4e0b\\u53483\\u70b9\\u5c31\\u5356\\u5b8c\\u4e86"},{"type":"ai","text":"\\u2705 \\u5df2\\u8bb0\\u5f55\\uff1a\\u80e1\\u841d\\u535c \\u4eca\\u65e515:00 \\u552e\\u7f44\\n\\n\\ud83d\\udcca AI \\u5206\\u6790\\uff1a\\n\\u80e1\\u841d\\u535c\\u672c\\u5468\\u5df2\\u8fde\\u7eed3\\u5929\\u63d0\\u524d\\u552e\\u7f44\\uff0c\\u4eca\\u65e5\\u8f83\\u6628\\u65e5\\u63d0\\u524d2\\u5c0f\\u65f6\\u3002\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\n\\u660e\\u65e5\\u8fdb\\u8d27\\u91cf\\u5efa\\u8bae\\u4ece 50\\u65a4 \\u2192 70\\u65a4\\uff08+40%\\uff09\\n\\u662f\\u5426\\u7acb\\u5373\\u53d1\\u9001\\u8fdb\\u8d27\\u8c03\\u6574\\u5efa\\u8bae\\u7ed9\\u91c7\\u8d2d\\uff1f"},{"type":"user","text":"\\u53d1\\u7ed9\\u91c7\\u8d2d\\uff0c\\u897f\\u7ea2\\u67ff\\u4e5f\\u4e00\\u8d77\\u770b\\u770b"},{"type":"ai","text":"\\u2705 \\u5df2\\u901a\\u77e5\\u91c7\\u8d2d\\u5c0f\\u738b\\n\\ud83d\\udccb \\u660e\\u65e5\\u80e1\\u841d\\u535c\\u8c03\\u6574\\u8fdb\\u8d27\\u5355\\u5df2\\u53d1\\u9001\\n\\n\\u897f\\u7ea2\\u67ff\\u6628\\u65e5\\u5269\\u4f5915\\u65a4\\uff0c\\u4eca\\u65e5\\u662f\\u7b2c2\\u5929\\uff0c\\u5efa\\u8bae\\u89e6\\u53d18\\u6298\\u6e05\\u8d27\\u3002\\n\\u662f\\u5426\\u786e\\u8ba4\\u6267\\u884c\\uff1f"},{"type":"user","text":"\\u786e\\u8ba4"},{"type":"ai","text":"\\u2705 \\u897f\\u7ea2\\u67ff8\\u6298\\u6e05\\u8d27\\u5df2\\u542f\\u52a8\\n\\ud83d\\udcf2 \\u5df2\\u901a\\u77e5\\u6536\\u94f6\\u53f0\\u66f4\\u65b0\\u4ef7\\u7b7e\\n\\n\\u9884\\u8ba1\\u4eca\\u65e5\\u53ef\\u6e05\\u8d27 12\\u65a4\\uff0c\\u907f\\u514d\\u660e\\u65e5\\u8fc7\\u671f\\u635f\\u8017\\u7ea6 \\u00a548\\u3002"},{"type":"user","text":"\\u5e2e\\u6211\\u770b\\u4e00\\u4e0b\\u4eca\\u5929\\u7684\\u8425\\u4e1a\\u60c5\\u51b5"},{"type":"ai","text":"\\ud83d\\udcca \\u4eca\\u65e5\\u8425\\u4e1a\\u5b9e\\u65f6\\u770b\\u677f\\uff08\\u622a\\u81f315:30\\uff09\\n\\n\\u8425\\u4e1a\\u989d\\uff1a\\u00a56,240\\uff08\\u76ee\\u6807 \\u00a59,000\\uff0c\\u5b8c\\u6210\\u7387 69.3%\\uff09\\n\\u5ba2\\u6d41\\u91cf\\uff1a187\\u4eba\\u3000\\u5ba2\\u5355\\u4ef7\\uff1a\\u00a533.4\\n\\n\\u26a1 \\u9ad8\\u5cf0\\u65f6\\u6bb5\\uff1a10:00\\u201311:30\\u300117:00\\u201318:30\\n\\ud83d\\udd34 \\u6ede\\u9500\\u9884\\u8b66\\uff1a\\u82b9\\u83dc\\u3001\\u51ac\\u74dc\\u4eca\\u65e5\\u96f6\\u9500\\u552e\\uff0c\\u5efa\\u8bae\\u4e0b\\u67b6\\u4fc3\\u9500\\n\\n\\u665a\\u5e02\\u9ad8\\u5cf0\\u8fd8\\u6709\\u7ea62\\u5c0f\\u65f6\\uff0c\\u9884\\u8ba1\\u4eca\\u65e5\\u53ef\\u5b8c\\u6210\\u76ee\\u6807\\u7684 88%\\u3002"},{"type":"user","text":"\\u660e\\u5929\\u7684\\u73ed\\u600e\\u4e48\\u6392"},{"type":"ai","text":"\\ud83d\\udcc5 \\u660e\\u65e5\\u6392\\u73ed\\u5efa\\u8bae\\uff084\\u67087\\u65e5 \\u5468\\u4e00\\uff09\\n\\n\\u65e9\\u73ed 08:00\\u201314:00\\n\\u3000\\u6536\\u94f6\\uff1a\\u5c0f\\u9648\\u3001\\u5c0f\\u4f55\\n\\u3000\\u7406\\u8d27\\uff1a\\u5c0f\\u6797\\n\\n\\u5348\\u73ed 12:00\\u201318:00\\uff08\\u4ea4\\u53c9\\uff09\\n\\u3000\\u6536\\u94f6\\uff1a\\u5c0f\\u5f20\\n\\u3000\\u7406\\u8d27\\uff1a\\u5c0f\\u5434\\n\\n\\u665a\\u73ed 15:00\\u201321:00\\n\\u3000\\u6536\\u94f6\\uff1a\\u5c0f\\u5218\\n\\u3000\\u7406\\u8d27\\uff1a\\u5c0f\\u8d75\\n\\n\\u26a0\\ufe0f \\u5c0f\\u738b\\u660e\\u65e5\\u8bf7\\u5047\\uff0c\\u5df2\\u81ea\\u52a8\\u8c03\\u5c0f\\u5f20\\u9876\\u73ed\\n\\n\\u662f\\u5426\\u786e\\u8ba4\\u6392\\u73ed\\u5e76\\u53d1\\u9001\\u4f01\\u4e1a\\u5fae\\u4fe1\\u901a\\u77e5\\uff1f"}]},{"label":"\\u5e97\\u5458\\u7aef","messages":[{"type":"user","text":"\\u84dd\\u8393\\u521a\\u5230\\u8d27\\uff0c\\u5927\\u6982100\\u76d2"},{"type":"ai","text":"\\u2705 \\u5df2\\u5f55\\u5165\\uff1a\\u84dd\\u8393 \\u5230\\u8d27100\\u76d2\\n\\n\\ud83d\\udce6 \\u8bf7\\u786e\\u8ba4\\u4ee5\\u4e0b\\u4fe1\\u606f\\uff1a\\n\\u4ea7\\u5730\\uff1a\\u4e0d\\u8be6\\u3000\\u4fdd\\u8d28\\u671f\\uff1a\\u8bf7\\u62cd\\u7167\\u6807\\u7b7e\\n\\u5efa\\u8bae\\u552e\\u4ef7\\uff1a\\u00a518.8\\/\\u76d2\\uff08\\u53c2\\u8003\\u672c\\u5468\\u5e02\\u573a\\u4ef7\\uff09\\n\\n\\u8bf7\\u62cd\\u4e00\\u5f20\\u5916\\u7bb1\\u6807\\u7b7e\\uff0c\\u6211\\u6765\\u81ea\\u52a8\\u5f55\\u5165\\u6279\\u6b21\\u4fe1\\u606f \\ud83d\\udcf7"},{"type":"user","text":"[\\u56fe\\u7247] \\u8fd9\\u662f\\u6807\\u7b7e"},{"type":"ai","text":"\\u2705 \\u5df2\\u8bc6\\u522b\\u6807\\u7b7e\\uff1a\\n\\u4ea7\\u5730\\uff1a\\u4e91\\u5357\\u3000\\u751f\\u4ea7\\u65e5\\u671f\\uff1a4\\u67085\\u65e5\\u3000\\u4fdd\\u8d28\\u671f5\\u5929\\n\\n\\ud83d\\udcca \\u7cfb\\u7edf\\u5df2\\u81ea\\u52a8\\u8bbe\\u7f6e\\uff1a\\n\\u4e34\\u671f\\u9884\\u8b66\\uff1a4\\u67088\\u65e5\\uff08\\u5230\\u671f\\u524d2\\u5929\\u63d0\\u9192\\u4fc3\\u9500\\uff09\\n\\u6446\\u653e\\u5efa\\u8bae\\uff1a\\u51b7\\u85cf\\u533a B3 \\u8d27\\u67b6\\uff08\\u6e29\\u5ea6 2\\u20134\\u00b0C\\uff09\\n\\n\\u5165\\u5e93\\u5b8c\\u6210\\uff0c\\u5e93\\u5b58\\u5df2\\u66f4\\u65b0 \\u2705"},{"type":"user","text":"B3\\u8d27\\u67b6\\u7684\\u51b7\\u85cf\\u6e29\\u5ea6\\u6709\\u70b9\\u9ad8 \\u663e\\u793a6\\u5ea6"},{"type":"ai","text":"\\u26a0\\ufe0f \\u5df2\\u8bb0\\u5f55\\uff1aB3 \\u51b7\\u85cf\\u8d27\\u67b6\\u6e29\\u5ea6\\u5f02\\u5e38\\uff08\\u5f53\\u524d 6\\u00b0C\\uff0c\\u6807\\u51c6 2\\u20134\\u00b0C\\uff09\\n\\n\\ud83d\\udccb \\u5904\\u7406\\u5efa\\u8bae\\uff1a\\n\\u2460 \\u7acb\\u5373\\u5c06\\u84dd\\u8393\\u6682\\u79fb\\u81f3 B1 \\u8d27\\u67b6\\uff08\\u5f53\\u524d\\u6e29\\u5ea6\\u6b63\\u5e38 3\\u00b0C\\uff09\\n\\u2461 \\u5df2\\u81ea\\u52a8\\u901a\\u77e5\\u7ef4\\u4fee\\u5e08\\u5085\\u68c0\\u67e5 B3 \\u5236\\u51b7\\u8bbe\\u5907\\n\\n\\ud83d\\udcf2 \\u5e97\\u957f\\u5c0f\\u738b\\u5df2\\u540c\\u6b65\\u6536\\u5230\\u544a\\u8b66\\u901a\\u77e5\\n\\n\\u8bf7\\u786e\\u8ba4\\u84dd\\u8393\\u5df2\\u8f6c\\u79fb\\uff0c\\u6211\\u6765\\u66f4\\u65b0\\u5e93\\u4f4d\\u4fe1\\u606f\\u3002"},{"type":"user","text":"\\u8f6c\\u79fb\\u597d\\u4e86\\uff0c\\u653e\\u5230B1\\u4e86"},{"type":"ai","text":"\\u2705 \\u5e93\\u4f4d\\u5df2\\u66f4\\u65b0\\uff1a\\u84dd\\u8393 \\u2192 B1 \\u8d27\\u67b6\\n\\n\\ud83d\\udd27 \\u7ef4\\u4fee\\u8bb0\\u5f55\\u5df2\\u5efa\\u6863\\uff0c\\u5e08\\u5085\\u9884\\u8ba1 16:00 \\u5230\\u573a\\u68c0\\u4fee B3\\n\\n\\u53e6\\u63d0\\u9192\\uff1aB1 \\u8d27\\u67b6\\u4eca\\u65e5\\u8fd8\\u6709 2025-04-06 \\u751f\\u4ea7\\u7684\\u8461\\u8404 30 \\u65a4\\uff0c\\u660e\\u65e5\\u5230\\u671f\\uff0c\\u5efa\\u8bae\\u665a\\u5e02\\u524d\\u8d34\\u597d\\u4fc3\\u9500\\u6807\\u7b7e\\u3002"}]}]
82	餐饮连锁 AI 运营助手	restaurant-chain-ai-ops	399.00	专为餐饮连锁门店打造的全链路 AI 运营系统。核心理念：「门店数据实时上报 + AI 智能分析 + 总部统一决策」，解决餐饮行业多门店协同难、备货浪费高、员工排班乱三大痛点。\n\n涵盖六大功能模块：\n① 实时营业额监控（分钟级数据推送）\n② AI 备货预测（节假日/天气多因子模型）\n③ 智能排班系统（依客流自动生成班表）\n④ 食材损耗预警（临期自动触发处理建议）\n⑤ 顾客评价智能汇总（差评实时告警）\n⑥ 多门店数据看板（总部/区域/单店三级）\n\n适用场景：连锁快餐、奶茶、火锅等餐饮品牌，2 店以上即可部署，接入企业微信开箱即用。	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u8001\\u677f\\u7aef","messages":[{"type":"user","text":"\\u6628\\u5929\\u4e09\\u4e9a\\u5e97\\u8425\\u4e1a\\u989d\\u600e\\u4e48\\u6837"},{"type":"ai","text":"\\ud83d\\udcca \\u4e09\\u4e9a\\u5e97 \\u6628\\u65e5\\u7ecf\\u8425\\u7b80\\u62a5\\n\\n\\u8425\\u4e1a\\u989d\\uff1a\\u00a518,640\\u3000\\u76ee\\u6807\\u5b8c\\u6210\\u7387\\uff1a94%\\n\\u5ba2\\u5355\\u4ef7\\uff1a\\u00a547.2\\uff08\\u21913.1%\\uff09\\u3000\\u7ffb\\u53f0\\u7387\\uff1a3.8\\u6b21\\n\\n\\u26a0\\ufe0f \\u5f02\\u5e38\\uff1a\\u5348\\u5e02 12:00\\u201313:30 \\u51fa\\u9910\\u7b49\\u5f85\\u8d85 22 \\u5206\\u949f\\uff0c\\u5dee\\u8bc4 3 \\u6761\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\u5348\\u5e02\\u589e\\u52a0 1 \\u540d\\u5907\\u9910\\u4eba\\u5458\\uff0c\\u6216\\u542f\\u7528\\u300c\\u9884\\u70b9\\u9910\\u300d\\u529f\\u80fd\\u51cf\\u5c11\\u9ad8\\u5cf0\\u538b\\u529b"},{"type":"user","text":"\\u4e0a\\u5468\\u5404\\u95e8\\u5e97\\u5bf9\\u6bd4"},{"type":"ai","text":"\\ud83d\\udcca \\u4e0a\\u5468\\u95e8\\u5e97\\u6392\\u540d\\uff08\\u8425\\u4e1a\\u989d\\uff09\\n\\n\\ud83e\\udd47 \\u6d77\\u53e3\\u5e97\\u3000\\u00a5138,200\\uff08\\u21918%\\uff09\\n\\ud83e\\udd48 \\u4e09\\u4e9a\\u5e97\\u3000\\u00a5121,400\\uff08\\u21912%\\uff09\\n\\ud83e\\udd49 \\u6587\\u660c\\u5e97\\u3000\\u00a589,600\\uff08\\u21935%\\uff09\\u26a0\\ufe0f\\n\\n\\u6587\\u660c\\u5e97\\u4e0b\\u6ed1\\u539f\\u56e0\\uff1a\\u5468\\u56db\\u5468\\u4e94\\u8fde\\u7eed\\u4e0b\\u96e8\\uff0c\\u5916\\u5356\\u5355\\u91cf\\u51cf\\u5c11 40%\\n\\u5efa\\u8bae\\u672c\\u5468\\u52a0\\u5927\\u5916\\u5356\\u5e73\\u53f0\\u66dd\\u5149\\u6295\\u5165"}]},{"label":"\\u5e97\\u957f\\u7aef","messages":[{"type":"user","text":"\\u4eca\\u5929\\u732a\\u8089\\u5feb\\u7528\\u5b8c\\u4e86"},{"type":"ai","text":"\\u2705 \\u5df2\\u8bb0\\u5f55\\uff1a\\u732a\\u8089\\u5e93\\u5b58\\u9884\\u8b66\\n\\n\\ud83d\\udcca \\u5f53\\u524d\\u5e93\\u5b58\\uff1a\\u7ea6 8 \\u65a4\\uff0c\\u6309\\u6628\\u65e5\\u7528\\u91cf\\u9884\\u8ba1\\u4eca\\u65e5 15:00 \\u8017\\u5c3d\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\u7acb\\u5373\\u8865\\u8d27\\uff1a\\n\\u8054\\u7cfb\\u4f9b\\u5e94\\u5546\\u5f20\\u5e08\\u5085\\uff08136xxxx\\uff09\\u8865 30 \\u65a4\\n\\u6216\\u4ece\\u6d77\\u53e3\\u4ed3\\u5e93\\u8c03\\u62e8\\uff0c\\u9884\\u8ba1 2 \\u5c0f\\u65f6\\u5230\\u8fbe\\n\\n\\u662f\\u5426\\u73b0\\u5728\\u53d1\\u9001\\u8865\\u8d27\\u7533\\u8bf7\\uff1f"},{"type":"user","text":"\\u53d1\\u7ed9\\u5f20\\u5e08\\u5085"},{"type":"ai","text":"\\u2705 \\u5df2\\u53d1\\u9001\\u8865\\u8d27\\u8bf7\\u6c42\\u7ed9\\u5f20\\u5e08\\u5085\\n\\ud83d\\udcf2 \\u4f01\\u4e1a\\u5fae\\u4fe1\\u6d88\\u606f\\u5df2\\u63a8\\u9001\\n\\n\\u53e6\\uff1a\\u4eca\\u65e5\\u9884\\u8ba2 6 \\u684c\\uff0c\\u6700\\u65e9 17:30 \\u5230\\u5e97\\uff0c\\u8bf7\\u63d0\\u524d\\u5907\\u9910\\u3002"}]},{"label":"\\u5e97\\u5458\\u7aef","messages":[{"type":"user","text":"4\\u53f7\\u684c\\u5ba2\\u4eba\\u6295\\u8bc9\\u7b49\\u592a\\u4e45\\u4e86"},{"type":"ai","text":"\\u2705 \\u5df2\\u8bb0\\u5f55\\uff1a4\\u53f7\\u684c\\u5ba2\\u8bc9\\uff08\\u7b49\\u5f85\\u65f6\\u95f4\\u8fc7\\u957f\\uff09\\n\\n\\ud83d\\udccb \\u5904\\u7406\\u5efa\\u8bae\\uff1a\\n\\u2460 \\u7acb\\u5373\\u544a\\u77e5\\u5e97\\u957f\\n\\u2461 \\u8d60\\u9001\\u4e00\\u676f\\u996e\\u54c1\\u8868\\u793a\\u6b49\\u610f\\n\\u2462 \\u4e0b\\u6b21\\u6765\\u5e97\\u4f18\\u60e0\\u5238\\uff08\\u7cfb\\u7edf\\u81ea\\u52a8\\u53d1\\u9001\\u81f3\\u5ba2\\u6237\\u624b\\u673a\\uff09\\n\\n\\u5e97\\u957f\\u5df2\\u6536\\u5230\\u901a\\u77e5 \\ud83d\\udcf2"},{"type":"user","text":"\\u597d\\u7684\\u5df2\\u5904\\u7406"},{"type":"ai","text":"\\u2705 \\u5df2\\u66f4\\u65b0\\u5904\\u7406\\u72b6\\u6001\\n\\n\\u672c\\u6b21\\u5ba2\\u8bc9\\u5df2\\u5f52\\u6863\\uff0c\\u5c06\\u8ba1\\u5165\\u672c\\u6708\\u670d\\u52a1\\u8d28\\u91cf\\u62a5\\u544a\\u3002\\n\\n\\ud83d\\udca1 \\u5c0f\\u63d0\\u793a\\uff1a\\u4eca\\u65e5\\u5348\\u5e02\\u9ad8\\u5cf0\\u8fd8\\u6709 30 \\u5206\\u949f\\uff0c5 \\u53f7\\u30017 \\u53f7\\u684c\\u5373\\u5c06\\u7ed3\\u675f\\u7528\\u9910\\uff0c\\u63d0\\u524d\\u51c6\\u5907\\u6e05\\u53f0\\u3002"}]}]
83	零售门店 AI 导购助手	retail-store-ai-guide	199.00	专为服装、母婴、家居等实体零售门店设计的 AI 导购与运营系统。将传统导购经验数字化，实现「顾客需求快速识别 + 精准推荐 + 销售数据沉淀」的智能导购闭环。\n\n涵盖五大功能模块：\n① AI 导购话术库（依品类自动匹配推荐逻辑）\n② 顾客偏好记录（会员画像自动更新）\n③ 库存实时查询（断货提醒+调货建议）\n④ 促销活动管理（优惠券自动发放）\n⑤ 每日销售简报（店长早报/晚报）\n\n适用场景：服装、母婴、美妆、家居等实体零售门店，单店/连锁均可部署。	https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u8001\\u677f\\u7aef","messages":[{"type":"user","text":"\\u672c\\u6708\\u54ea\\u6b3e\\u5356\\u5f97\\u6700\\u597d"},{"type":"ai","text":"\\ud83d\\udcca \\u672c\\u6708\\u9500\\u552e TOP 3\\uff08\\u622a\\u81f3\\u4eca\\u65e5\\uff09\\n\\n\\ud83e\\udd47 \\u4e9a\\u9ebb\\u5bbd\\u677e\\u897f\\u88e4\\uff08\\u7c73\\u767d\\uff09\\u3000\\u552e\\u51fa 87 \\u4ef6\\u3000\\u00a523,490\\n\\ud83e\\udd48 \\u771f\\u4e1d\\u886c\\u886b\\uff08\\u6de1\\u84dd\\uff09\\u3000\\u3000\\u3000\\u552e\\u51fa 64 \\u4ef6\\u3000\\u00a519,200\\n\\ud83e\\udd49 \\u68c9\\u9ebb\\u8fde\\u8863\\u88d9\\uff08\\u6df1\\u7eff\\uff09\\u3000\\u3000\\u552e\\u51fa 51 \\u4ef6\\u3000\\u00a512,750\\n\\n\\ud83d\\udca1 \\u4e9a\\u9ebb\\u897f\\u88e4\\u5e93\\u5b58\\u4ec5\\u5269 12 \\u4ef6\\uff0c\\u5efa\\u8bae\\u672c\\u5468\\u8865\\u8d27 50 \\u4ef6"}]},{"label":"\\u5e97\\u5458\\u7aef","messages":[{"type":"user","text":"\\u987e\\u5ba2\\u8981\\u627eM\\u7801\\u7684\\u4e9a\\u9ebb\\u88e4\\uff0c\\u8fd8\\u6709\\u8d27\\u5417"},{"type":"ai","text":"\\u2705 \\u67e5\\u8be2\\u7ed3\\u679c\\uff1a\\u4e9a\\u9ebb\\u5bbd\\u677e\\u897f\\u88e4 M\\u7801\\n\\n\\u672c\\u5e97\\u5e93\\u5b58\\uff1a3 \\u4ef6\\uff08\\u9648\\u5217\\u533a B2\\uff09\\n\\n\\ud83d\\udca1 \\u5982\\u9700\\u8bd5\\u7a7f\\uff0c\\u544a\\u77e5\\u987e\\u5ba2\\u8bd5\\u8863\\u95f4\\u73b0\\u5728\\u7a7a\\u95f2\\n\\u8be5\\u6b3e\\u672c\\u6708\\u9500\\u552e 87 \\u4ef6\\uff0c\\u597d\\u8bc4\\u7387 96%\\uff0c\\u53ef\\u63a8\\u8350\\u914d\\u540c\\u6b3e\\u4e9a\\u9ebb\\u886c\\u886b"},{"type":"user","text":"\\u987e\\u5ba2\\u4e70\\u4e86\\uff0c\\u5f00\\u5355"},{"type":"ai","text":"\\u2705 \\u5df2\\u8bb0\\u5f55\\u9500\\u552e\\uff1a\\u4e9a\\u9ebb\\u897f\\u88e4 M\\u7801 \\u00d7 1\\n\\u5e93\\u5b58\\u66f4\\u65b0\\uff1aM\\u7801\\u5269\\u4f59 2 \\u4ef6\\n\\n\\ud83d\\udcf2 \\u5df2\\u5411\\u987e\\u5ba2\\u53d1\\u9001\\u7535\\u5b50\\u5c0f\\u7968\\n\\ud83c\\udf81 \\u987e\\u5ba2\\u672c\\u6708\\u7d2f\\u8ba1\\u6d88\\u8d39 \\u00a5680\\uff0c\\u8ddd\\u4e0b\\u4e00\\u7ea7\\u4f1a\\u5458\\u8fd8\\u5dee \\u00a5320\\uff0c\\u53ef\\u544a\\u77e5\\u987e\\u5ba2"}]},{"label":"\\u5e97\\u957f\\u7aef","messages":[{"type":"user","text":"\\u4eca\\u5929\\u4e1a\\u7ee9\\u600e\\u4e48\\u6837"},{"type":"ai","text":"\\ud83d\\udcca \\u4eca\\u65e5\\u8425\\u4e1a\\u7b80\\u62a5\\uff08\\u622a\\u81f3 17:30\\uff09\\n\\n\\u8425\\u4e1a\\u989d\\uff1a\\u00a58,240\\u3000\\u76ee\\u6807\\u8fdb\\u5ea6\\uff1a82%\\uff08\\u76ee\\u6807 \\u00a510,000\\uff09\\n\\u5ba2\\u5355\\u4ef7\\uff1a\\u00a5412\\u3000\\u8fdb\\u5e97\\u5ba2\\u6d41\\uff1a32 \\u4eba\\u3000\\u6210\\u4ea4\\u7387\\uff1a62%\\n\\n\\ud83d\\udca1 \\u8ddd\\u6536\\u5e97\\u8fd8\\u6709 2.5 \\u5c0f\\u65f6\\uff0c\\u5efa\\u8bae\\uff1a\\n\\u2460 \\u63a8\\u9001\\u4eca\\u65e5\\u9650\\u65f6\\u6298\\u6263\\u7ed9\\u9644\\u8fd1\\u4f1a\\u5458\\n\\u2461 \\u4e3b\\u63a8\\u4e9a\\u9ebb\\u897f\\u88e4\\uff08\\u5e93\\u5b58\\u544a\\u6025\\uff0c\\u51b2\\u523a\\u6210\\u4ea4\\uff09\\n\\n\\u662f\\u5426\\u73b0\\u5728\\u53d1\\u9001\\u4f1a\\u5458\\u4f18\\u60e0\\u63a8\\u9001\\uff1f"}]}]
84	医疗诊所 AI 助理系统	clinic-ai-assistant	499.00	专为中小型医疗诊所打造的全流程 AI 管理系统。核心理念：「患者全程无缝衔接 + 医生减负提效 + 合规风险可控」，解决诊所预约混乱、病历录入慢、复诊流失高三大痛点。\n\n涵盖七大功能模块：\n① AI 预约调度（微信/电话/现场三端统一）\n② 智能分诊导诊（症状初筛+科室推荐）\n③ 病历语音录入（方言识别+结构化输出）\n④ AI 随访管理（复诊提醒+康复跟进）\n⑤ 药品库存预警（临期提醒+自动补货建议）\n⑥ 医保合规助手（收费审查+报销材料生成）\n⑦ 经营数据看板（就诊量/收入/患者留存）\n\n适用场景：口腔诊所、中医馆、专科门诊、社区卫生中心，日均接诊 20 人以上即可部署。	https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u9662\\u957f\\u7aef","messages":[{"type":"user","text":"\\u4e0a\\u4e2a\\u6708\\u6536\\u5165\\u600e\\u4e48\\u6837\\uff0c\\u590d\\u8bca\\u7387\\u591a\\u5c11"},{"type":"ai","text":"\\ud83d\\udcca \\u4e0a\\u6708\\u7ecf\\u8425\\u7b80\\u62a5\\n\\n\\u603b\\u6536\\u5165\\uff1a\\u00a5186,400\\uff08\\u219112%\\uff09\\n\\u5c31\\u8bca\\u4eba\\u6b21\\uff1a843\\u6b21\\u3000\\u65e5\\u5747\\uff1a27\\u6b21\\n\\u590d\\u8bca\\u7387\\uff1a38%\\uff08\\u884c\\u4e1a\\u5747\\u503c 25%\\uff09\\u2705\\n\\n\\u26a0\\ufe0f \\u95ee\\u9898\\uff1a\\u65b0\\u60a3\\u6d41\\u5931\\u7387 61%\\uff0c\\u4e3b\\u8981\\u96c6\\u4e2d\\u5728\\u9996\\u8bca\\u540e 7 \\u5929\\u5185\\u672a\\u6536\\u5230\\u968f\\u8bbf\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\u5f00\\u542f\\u300c7\\u65e5\\u81ea\\u52a8\\u968f\\u8bbf\\u300d\\u529f\\u80fd\\uff0c\\u9884\\u8ba1\\u53ef\\u5c06\\u590d\\u8bca\\u7387\\u63d0\\u5347\\u81f3 48%"},{"type":"user","text":"\\u5f00\\u542f\\u968f\\u8bbf\\uff0c\\u4e0a\\u4e2a\\u6708\\u54ea\\u4e2a\\u79d1\\u5ba4\\u6536\\u5165\\u6700\\u9ad8"},{"type":"ai","text":"\\u2705 \\u5df2\\u5f00\\u542f 7 \\u65e5\\u81ea\\u52a8\\u968f\\u8bbf\\n\\ud83d\\udcf2 \\u9996\\u6279 47 \\u4f4d\\u60a3\\u8005\\u5c06\\u4e8e\\u4eca\\u65e5\\u6536\\u5230\\u968f\\u8bbf\\u6d88\\u606f\\n\\n\\ud83d\\udcca \\u4e0a\\u6708\\u79d1\\u5ba4\\u6536\\u5165\\u6392\\u540d\\uff1a\\n\\ud83e\\udd47 \\u53e3\\u8154\\u79d1\\u3000\\u00a589,200\\uff0847.8%\\uff09\\n\\ud83e\\udd48 \\u4e2d\\u533b\\u7406\\u7597\\u3000\\u00a554,600\\uff0829.3%\\uff09\\n\\ud83e\\udd49 \\u513f\\u79d1\\u3000\\u00a542,600\\uff0822.9%\\uff09\\n\\n\\u53e3\\u8154\\u79d1\\u6b63\\u7578\\u9879\\u76ee\\u8d21\\u732e\\u6700\\u5927\\uff0c\\u5efa\\u8bae\\u589e\\u52a0\\u6b63\\u7578\\u533b\\u751f\\u6392\\u73ed"}]},{"label":"\\u533b\\u751f\\u7aef","messages":[{"type":"user","text":"\\u4e0b\\u5348\\u4e09\\u70b9\\u7684\\u5f20\\u4f1f\\u6765\\u4e86\\uff0c\\u5e2e\\u6211\\u62c9\\u4e00\\u4e0b\\u4ed6\\u7684\\u75c5\\u5386"},{"type":"ai","text":"\\ud83d\\udccb \\u60a3\\u8005\\uff1a\\u5f20\\u4f1f\\u3000\\u7537\\u300042\\u5c81\\n\\n\\u4e0a\\u6b21\\u5c31\\u8bca\\uff1a3\\u670815\\u65e5\\uff0832\\u5929\\u524d\\uff09\\n\\u4e3b\\u8bc9\\uff1a\\u6162\\u6027\\u8170\\u75db\\n\\u5904\\u65b9\\uff1a\\u5e03\\u6d1b\\u82ac\\u7f13\\u91ca\\u7247 \\u00d7 14\\u5929 + \\u7406\\u7597 3\\u6b21\\n\\n\\u26a0\\ufe0f \\u6ce8\\u610f\\uff1a\\u5f20\\u4f1f\\u5bf9\\u9752\\u9709\\u7d20\\u8fc7\\u654f\\uff0c\\u5df2\\u6807\\u8bb0\\n\\ud83d\\udc8a \\u4e0a\\u6b21\\u5f00\\u7684\\u836f\\u4eca\\u65e5\\u6070\\u597d\\u7528\\u5b8c\\uff0c\\u5efa\\u8bae\\u8bc4\\u4f30\\u662f\\u5426\\u7eed\\u836f"},{"type":"user","text":"\\u7eed\\u836f\\uff0c\\u52a0\\u5f00\\u818f\\u836f\\uff0c\\u5e2e\\u6211\\u751f\\u6210\\u75c5\\u5386"},{"type":"ai","text":"\\u2705 \\u75c5\\u5386\\u5df2\\u751f\\u6210\\uff1a\\n\\n\\u590d\\u8bca\\u8bb0\\u5f55 | 2026-04-06\\n\\u4e3b\\u8bc9\\uff1a\\u8170\\u75db\\u6301\\u7eed\\uff0c\\u8f83\\u4e0a\\u6b21\\u7565\\u6709\\u7f13\\u89e3\\n\\u5904\\u7406\\uff1a\\u7eed\\u5f00\\u5e03\\u6d1b\\u82ac\\u7f13\\u91ca\\u7247 \\u00d7 14\\u5929\\uff1b\\u65b0\\u589e\\u8170\\u75db\\u818f \\u00d7 5\\u8d34\\n\\u6ce8\\u610f\\uff1a\\u60a3\\u8005\\u9752\\u9709\\u7d20\\u8fc7\\u654f\\uff0c\\u672c\\u6b21\\u7528\\u836f\\u65e0\\u51b2\\u7a81 \\u2705\\n\\n\\ud83d\\udcc4 \\u7535\\u5b50\\u75c5\\u5386\\u5df2\\u5b58\\u6863\\uff0c\\u662f\\u5426\\u6253\\u5370\\u5904\\u65b9\\uff1f"}]},{"label":"\\u524d\\u53f0\\u7aef","messages":[{"type":"user","text":"\\u6709\\u4e2a\\u60a3\\u8005\\u8bf4\\u8981\\u53d6\\u6d88\\u660e\\u5929\\u4e0a\\u5348\\u7684\\u9884\\u7ea6"},{"type":"ai","text":"\\u8bf7\\u95ee\\u60a3\\u8005\\u59d3\\u540d\\u6216\\u624b\\u673a\\u53f7\\uff1f"},{"type":"user","text":"\\u674e\\u6885\\uff0c138\\u5f00\\u5934"},{"type":"ai","text":"\\u2705 \\u5df2\\u627e\\u5230\\uff1a\\u674e\\u6885\\u3000138xxxx5678\\n\\u660e\\u65e5 10:30\\u3000\\u53e3\\u8154\\u79d1\\u3000\\u738b\\u533b\\u751f\\n\\n\\u5df2\\u53d6\\u6d88\\u9884\\u7ea6\\uff0c\\u662f\\u5426\\u5e2e\\u5979\\u6539\\u7ea6\\u5176\\u4ed6\\u65f6\\u95f4\\uff1f\\n\\n\\u738b\\u533b\\u751f\\u660e\\u65e5\\u8fd8\\u6709\\u7a7a\\u6863\\uff1a\\n\\u2022 14:00\\n\\u2022 15:30"},{"type":"user","text":"\\u5979\\u8bf4\\u4e0d\\u7528\\u4e86\\uff0c\\u53d6\\u6d88\\u5c31\\u597d"},{"type":"ai","text":"\\u2705 \\u5df2\\u53d6\\u6d88\\u5e76\\u53d1\\u9001\\u786e\\u8ba4\\u77ed\\u4fe1\\u7ed9\\u674e\\u6885\\n\\n\\ud83d\\udcf2 \\u738b\\u533b\\u751f 10:30 \\u7a7a\\u6863\\u5df2\\u81ea\\u52a8\\u5f00\\u653e\\uff0c\\u5019\\u8865\\u60a3\\u8005\\u5218\\u5f3a\\u5df2\\u6536\\u5230\\u901a\\u77e5\\n\\n\\u4eca\\u65e5\\u5269\\u4f59\\u9884\\u7ea6\\uff1a14 \\u4eba\\uff0c\\u5019\\u8bca\\u533a\\u73b0\\u5728\\u6709 3 \\u4eba\\u7b49\\u5f85"}]}]
85	教育机构 AI 管理中台	education-center-ai-platform	299.00	专为中小型教培机构设计的全链路 AI 运营系统。核心理念：「招生转化提效 + 教学质量可视 + 续费留存智能」，解决教培行业获客成本高、学员流失难追踪、老师排课混乱三大痛点。\n\n涵盖六大功能模块：\n① AI 招生助手（线索自动跟进+试听转化提醒）\n② 智能排课系统（教室/老师/学员三维匹配）\n③ 学员成长档案（课堂表现+作业+测评全记录）\n④ AI 续费预警（流失风险识别+自动触达）\n⑤ 家长沟通助手（周报自动生成+家长群播报）\n⑥ 经营数据看板（招生/续费/出勤/收入多维）\n\n适用场景：K12 补习、艺术培训、语言学校、职业技能培训机构，50 人以上学员规模即可部署。	https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u6821\\u957f\\u7aef","messages":[{"type":"user","text":"\\u672c\\u6708\\u62db\\u751f\\u60c5\\u51b5\\u600e\\u4e48\\u6837"},{"type":"ai","text":"\\ud83d\\udcca \\u672c\\u6708\\u62db\\u751f\\u7b80\\u62a5\\uff08\\u622a\\u81f3\\u4eca\\u65e5\\uff09\\n\\n\\u65b0\\u589e\\u7ebf\\u7d22\\uff1a126 \\u4e2a\\u3000\\u8bd5\\u542c\\uff1a48 \\u4eba\\u3000\\u6b63\\u5f0f\\u62a5\\u540d\\uff1a31 \\u4eba\\n\\u8f6c\\u5316\\u7387\\uff1a64.6%\\uff08\\u21918% vs \\u4e0a\\u6708\\uff09\\n\\n\\u26a0\\ufe0f \\u98ce\\u9669\\uff1a37 \\u4e2a\\u7ebf\\u7d22\\u8d85\\u8fc7 3 \\u5929\\u672a\\u8ddf\\u8fdb\\uff0c\\u6d41\\u5931\\u98ce\\u9669\\u9ad8\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\u5f00\\u542f\\u300c\\u7ebf\\u7d22\\u81ea\\u52a8\\u63d0\\u9192\\u300d\\uff0c\\u8d85 24 \\u5c0f\\u65f6\\u672a\\u8054\\u7cfb\\u81ea\\u52a8\\u63a8\\u9001\\u7ed9\\u62db\\u751f\\u8001\\u5e08"},{"type":"user","text":"\\u5f00\\u542f\\uff0c\\u7eed\\u8d39\\u8fd9\\u4e2a\\u6708\\u600e\\u4e48\\u6837"},{"type":"ai","text":"\\u2705 \\u7ebf\\u7d22\\u81ea\\u52a8\\u63d0\\u9192\\u5df2\\u5f00\\u542f\\n\\n\\ud83d\\udcca \\u7eed\\u8d39\\u60c5\\u51b5\\uff1a\\n\\u672c\\u6708\\u5230\\u671f\\uff1a89 \\u4eba\\u3000\\u5df2\\u7eed\\u8d39\\uff1a61 \\u4eba\\u3000\\u7eed\\u8d39\\u7387\\uff1a68.5%\\n\\n\\u26a0\\ufe0f 28 \\u4eba\\u672a\\u7eed\\u8d39\\uff0c\\u5176\\u4e2d 12 \\u4eba\\u5df2\\u8bc6\\u522b\\u4e3a\\u9ad8\\u6d41\\u5931\\u98ce\\u9669\\n\\u4e3b\\u8981\\u539f\\u56e0\\uff1a\\u8fde\\u7eed 2 \\u6b21\\u65f7\\u8bfe\\uff087\\u4eba\\uff09\\u3001\\u5bb6\\u957f\\u6295\\u8bc9\\u672a\\u5904\\u7406\\uff083\\u4eba\\uff09\\n\\n\\u662f\\u5426\\u73b0\\u5728\\u751f\\u6210\\u8fd9 12 \\u4eba\\u7684\\u633d\\u7559\\u65b9\\u6848\\uff1f"}]},{"label":"\\u8001\\u5e08\\u7aef","messages":[{"type":"user","text":"\\u5e2e\\u6211\\u5199\\u4e00\\u4e0b\\u4eca\\u5929\\u5c0f\\u660e\\u7684\\u8bfe\\u5802\\u53cd\\u9988"},{"type":"ai","text":"\\u8bf7\\u7b80\\u5355\\u63cf\\u8ff0\\u4e00\\u4e0b\\u5c0f\\u660e\\u4eca\\u5929\\u7684\\u8868\\u73b0\\uff0c\\u6211\\u6765\\u751f\\u6210\\u5b8c\\u6574\\u53cd\\u9988\\u62a5\\u544a\\uff1a"},{"type":"user","text":"\\u4e0a\\u8bfe\\u6ce8\\u610f\\u529b\\u4e0d\\u96c6\\u4e2d\\uff0c\\u6570\\u5b66\\u53e3\\u7b97\\u6bd4\\u4e0a\\u5468\\u8fdb\\u6b65\\u4e86\\uff0c\\u4f46\\u5e94\\u7528\\u9898\\u8fd8\\u662f\\u4e0d\\u592a\\u4f1a"},{"type":"ai","text":"\\u2705 \\u8bfe\\u5802\\u53cd\\u9988\\u5df2\\u751f\\u6210\\uff1a\\n\\n\\u3010\\u674e\\u5c0f\\u660e \\u00b7 \\u4eca\\u65e5\\u8bfe\\u5802\\u8bb0\\u5f55\\u3011\\n\\n\\u4e13\\u6ce8\\u5ea6\\uff1a\\u9700\\u5173\\u6ce8\\u26a0\\ufe0f \\u4eca\\u65e5\\u8bfe\\u5802\\u6ce8\\u610f\\u529b\\u8f83\\u5206\\u6563\\uff0c\\u5efa\\u8bae\\u5bb6\\u957f\\u68c0\\u67e5\\u7761\\u7720\\u60c5\\u51b5\\n\\n\\u8fdb\\u6b65\\u4eae\\u70b9\\uff1a\\u53e3\\u7b97\\u901f\\u5ea6\\u8f83\\u4e0a\\u5468\\u63d0\\u5347\\u660e\\u663e\\uff0c\\u8fde\\u7eed\\u7b54\\u5bf9 8 \\u9898 \\ud83c\\udf89\\n\\n\\u5f85\\u63d0\\u5347\\uff1a\\u5e94\\u7528\\u9898\\u7406\\u89e3\\u80fd\\u529b\\u9700\\u52a0\\u5f3a\\uff0c\\u5efa\\u8bae\\u672c\\u5468\\u52a0\\u7ec3\\u300c\\u8bfb\\u9898\\u627e\\u5173\\u952e\\u8bcd\\u300d\\u4e13\\u9879\\n\\n\\ud83d\\udcf2 \\u662f\\u5426\\u73b0\\u5728\\u53d1\\u9001\\u7ed9\\u5bb6\\u957f\\uff1f"},{"type":"user","text":"\\u53d1\\u9001"},{"type":"ai","text":"\\u2705 \\u5df2\\u53d1\\u9001\\u7ed9\\u5c0f\\u660e\\u5bb6\\u957f\\n\\ud83d\\udcf1 \\u5bb6\\u957f\\u5df2\\u8bfb\\uff0814:32\\uff09\\n\\n\\u53e6\\uff1a\\u5c0f\\u660e\\u672c\\u6708\\u5df2\\u7d2f\\u8ba1\\u65f7\\u8bfe 1 \\u6b21\\uff0c\\u4e0b\\u6b21\\u65f7\\u8bfe\\u5c06\\u89e6\\u53d1\\u7eed\\u8d39\\u98ce\\u9669\\u9884\\u8b66\\uff0c\\u8bf7\\u7559\\u610f\\u3002"}]},{"label":"\\u524d\\u53f0\\u7aef","messages":[{"type":"user","text":"\\u6709\\u5bb6\\u957f\\u95ee\\u4e0b\\u5468\\u8bfe\\u7a0b\\u5b89\\u6392"},{"type":"ai","text":"\\u8bf7\\u95ee\\u662f\\u54ea\\u4f4d\\u5b66\\u5458\\u7684\\u5bb6\\u957f\\uff1f"},{"type":"user","text":"\\u738b\\u82b3\\u7684\\u5988\\u5988"},{"type":"ai","text":"\\ud83d\\udcc5 \\u738b\\u82b3 \\u4e0b\\u5468\\u8bfe\\u7a0b\\u5b89\\u6392\\uff1a\\n\\n\\u5468\\u4e00 16:00\\u3000\\u6570\\u5b66\\u3000\\u5f20\\u8001\\u5e08\\u30003\\u53f7\\u6559\\u5ba4\\n\\u5468\\u4e09 16:00\\u3000\\u6570\\u5b66\\u3000\\u5f20\\u8001\\u5e08\\u30003\\u53f7\\u6559\\u5ba4\\n\\u5468\\u516d 10:00\\u3000\\u82f1\\u8bed\\u3000\\u674e\\u8001\\u5e08\\u30005\\u53f7\\u6559\\u5ba4\\n\\n\\ud83d\\udcf2 \\u662f\\u5426\\u53d1\\u9001\\u8bfe\\u7a0b\\u8868\\u7ed9\\u5bb6\\u957f\\u5fae\\u4fe1\\uff1f"},{"type":"user","text":"\\u53d1"},{"type":"ai","text":"\\u2705 \\u5df2\\u53d1\\u9001\\u8bfe\\u7a0b\\u8868\\u7ed9\\u738b\\u82b3\\u5988\\u5988\\n\\n\\u53e6\\uff1a\\u738b\\u82b3\\u672c\\u671f\\u8bfe\\u7a0b\\u5c06\\u4e8e 4\\u670820\\u65e5\\u5230\\u671f\\uff0c\\u8ddd\\u7eed\\u8d39\\u8fd8\\u6709 14 \\u5929\\uff0c\\u662f\\u5426\\u73b0\\u5728\\u53d1\\u9001\\u7eed\\u8d39\\u63d0\\u9192\\uff1f"}]}]
86	物流仓储 AI 调度系统	logistics-warehouse-ai	599.00	专为中小型物流仓储企业打造的全链路 AI 调度系统。核心理念：「入库出库零差错 + 运力智能匹配 + 异常实时预警」，解决物流行业库存盘点慢、调度效率低、货损追责难三大痛点。\n\n涵盖七大功能模块：\n① 智能收货验货（OCR 识别+自动入库）\n② 库位智能分配（货物特性+频率双维度）\n③ AI 拣货路径优化（减少行走距离 40%）\n④ 运力智能调度（车辆+司机+路线三维匹配）\n⑤ 货损异常追踪（拍照上报+责任链自动记录）\n⑥ 客户自助查单（微信小程序实时追踪）\n⑦ 运营数据看板（吞吐量/准时率/损耗率）\n\n适用场景：区域配送中心、电商仓、冷链仓、第三方物流企业，日均出库 500 单以上即可部署。	https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u7ba1\\u7406\\u7aef","messages":[{"type":"user","text":"\\u4eca\\u5929\\u51fa\\u5e93\\u60c5\\u51b5\\u600e\\u4e48\\u6837\\uff0c\\u51c6\\u65f6\\u7387\\u591a\\u5c11"},{"type":"ai","text":"\\ud83d\\udcca \\u4eca\\u65e5\\u51fa\\u5e93\\u7b80\\u62a5\\uff08\\u622a\\u81f3 16:00\\uff09\\n\\n\\u5df2\\u51fa\\u5e93\\uff1a1,248 \\u5355\\u3000\\u5f85\\u51fa\\u5e93\\uff1a87 \\u5355\\n\\u51c6\\u65f6\\u7387\\uff1a94.2%\\uff08\\u76ee\\u6807 95%\\uff09\\u26a0\\ufe0f \\u7565\\u4f4e\\n\\n\\u5ef6\\u8bef\\u539f\\u56e0\\uff1a\\n\\u2022 3\\u53f7\\u4ed3\\u533a\\u62e3\\u8d27\\u4eba\\u624b\\u4e0d\\u8db3\\uff0823\\u5355\\u5ef6\\u8bef\\uff09\\n\\u2022 \\u4eac\\u4e1c\\u5feb\\u9012\\u4eca\\u65e5\\u63d0\\u524d\\u6536\\u4ef6\\uff0c\\u9519\\u8fc7 11 \\u5355\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\u7acb\\u5373\\u8c03\\u914d 2 \\u540d\\u4ed3\\u5458\\u652f\\u63f4 3 \\u53f7\\u533a\\uff0c\\u9884\\u8ba1\\u53ef\\u5b8c\\u6210\\u7387\\u6062\\u590d\\u81f3 97%"},{"type":"user","text":"\\u8c03\\u914d\\uff0c\\u672c\\u5468\\u8d27\\u635f\\u60c5\\u51b5"},{"type":"ai","text":"\\u2705 \\u5df2\\u901a\\u77e5\\u4ed3\\u7ba1\\u674e\\u5e08\\u5085\\u8c03\\u914d\\u4eba\\u624b\\n\\n\\ud83d\\udcca \\u672c\\u5468\\u8d27\\u635f\\u62a5\\u544a\\uff1a\\n\\u8d27\\u635f\\u91d1\\u989d\\uff1a\\u00a53,240\\uff08\\u8d27\\u635f\\u7387 0.18%\\uff0c\\u884c\\u4e1a\\u5747\\u503c 0.35%\\uff09\\u2705\\n\\n\\u4e3b\\u8981\\u8d27\\u635f\\uff1a\\n\\u2022 \\u6613\\u788e\\u54c1\\u5305\\u88c5\\u4e0d\\u5f53 \\u00a51,800\\uff083\\u8d77\\uff0c\\u5747\\u4e3a\\u65b0\\u5458\\u5de5\\u64cd\\u4f5c\\uff09\\n\\u2022 \\u51b7\\u94fe\\u65ad\\u94fe \\u00a51,440\\uff081\\u8d77\\uff0c\\u591c\\u73ed\\u4ea4\\u63a5\\u9057\\u6f0f\\uff09\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\u5bf9\\u65b0\\u5458\\u5de5\\u5b89\\u6392\\u6613\\u788e\\u54c1\\u5305\\u88c5\\u4e13\\u9879\\u57f9\\u8bad"}]},{"label":"\\u8c03\\u5ea6\\u7aef","messages":[{"type":"user","text":"\\u4e0b\\u5348\\u6709\\u6279\\u8d27\\u8981\\u53d1\\u5e7f\\u5dde\\uff0c\\u5b89\\u6392\\u4e00\\u4e0b"},{"type":"ai","text":"\\u8bf7\\u544a\\u77e5\\u8d27\\u7269\\u4fe1\\u606f\\uff1a\\u4ef6\\u6570\\u3001\\u91cd\\u91cf\\u3001\\u662f\\u5426\\u6709\\u7279\\u6b8a\\u8981\\u6c42\\uff1f"},{"type":"user","text":"80\\u7bb1\\uff0c\\u7ea61.2\\u5428\\uff0c\\u666e\\u8d27\\uff0c\\u4e0b\\u53483\\u70b9\\u524d\\u53d6\\u8d70"},{"type":"ai","text":"\\u2705 \\u5df2\\u5339\\u914d\\u6700\\u4f18\\u65b9\\u6848\\uff1a\\n\\n\\u63a8\\u8350\\u8f66\\u8f86\\uff1a\\u7ca4B-88421\\uff084.2\\u7c73\\u53a2\\u8f66\\uff09\\n\\u53f8\\u673a\\uff1a\\u738b\\u5e08\\u5085\\u3000\\u5df2\\u8054\\u7cfb\\uff0c14:30 \\u53ef\\u5230\\u4ed3\\n\\u9884\\u8ba1\\u8d39\\u7528\\uff1a\\u00a51,280\\uff08\\u542b\\u8fc7\\u8def\\u8d39\\uff09\\n\\n\\u5907\\u9009\\uff1a\\u987a\\u4e30\\u8d27\\u8fd0\\uff0c\\u4eca\\u65e5 14:00 \\u622a\\u5355\\uff0c\\u8d39\\u7528 \\u00a51,560\\n\\n\\u662f\\u5426\\u786e\\u8ba4\\u738b\\u5e08\\u5085\\u65b9\\u6848\\uff1f"},{"type":"user","text":"\\u786e\\u8ba4"},{"type":"ai","text":"\\u2705 \\u5df2\\u786e\\u8ba4\\uff0c\\u738b\\u5e08\\u5085 14:30 \\u5230\\u4ed3\\n\\ud83d\\udcf2 \\u5df2\\u53d1\\u9001\\u53d6\\u8d27\\u4fe1\\u606f\\u7ed9\\u53f8\\u673a\\u548c\\u6536\\u8d27\\u65b9\\n\\n\\u63d0\\u8d27\\u5355\\u5df2\\u751f\\u6210\\uff0c\\u8bf7\\u4ed3\\u7ba1\\u51c6\\u5907\\u88c5\\u8f66 \\ud83d\\ude9a"}]},{"label":"\\u4ed3\\u5458\\u7aef","messages":[{"type":"user","text":"\\u521a\\u6536\\u4e86\\u4e00\\u6279\\u8d27\\uff0c\\u7bb1\\u5b50\\u6709\\u7834\\u635f"},{"type":"ai","text":"\\u8bf7\\u62cd\\u7167\\u4e0a\\u4f20\\u7834\\u635f\\u60c5\\u51b5\\uff0c\\u6211\\u6765\\u81ea\\u52a8\\u8bb0\\u5f55\\u5e76\\u751f\\u6210\\u5f02\\u5e38\\u62a5\\u544a \\ud83d\\udcf7"},{"type":"user","text":"[\\u56fe\\u7247] \\u5df2\\u4e0a\\u4f20"},{"type":"ai","text":"\\u2705 \\u5df2\\u8bb0\\u5f55\\u8d27\\u635f\\u5f02\\u5e38\\uff1a\\n\\n\\u65f6\\u95f4\\uff1a\\u4eca\\u65e5 10:42\\u3000\\u5e93\\u4f4d\\uff1aA\\u533a3\\u6392\\n\\u63cf\\u8ff0\\uff1a\\u5916\\u7bb1\\u7834\\u635f\\uff0c\\u7591\\u4f3c\\u8fd0\\u8f93\\u9014\\u4e2d\\u6324\\u538b\\n\\n\\ud83d\\udccb \\u5f02\\u5e38\\u62a5\\u544a\\u5df2\\u751f\\u6210\\u5e76\\u53d1\\u9001\\u7ed9\\uff1a\\n\\u2022 \\u4ed3\\u7ba1\\u4e3b\\u7ba1\\uff08\\u5ba1\\u6838\\uff09\\n\\u2022 \\u91c7\\u8d2d\\u65b9\\uff08\\u786e\\u8ba4\\u8d27\\u7269\\u72b6\\u6001\\uff09\\n\\u2022 \\u627f\\u8fd0\\u65b9\\uff08\\u8d23\\u4efb\\u786e\\u8ba4\\uff09\\n\\n\\u8d27\\u7269\\u6682\\u5b58\\u5f85\\u68c0\\u533a\\uff0c\\u7b49\\u5f85\\u4e3b\\u7ba1\\u6307\\u793a \\u2705"}]}]
87	酒店民宿 AI 管家系统	hotel-guesthouse-ai-butler	299.00	专为精品酒店、民宿、短租公寓打造的全链路 AI 运营系统。核心理念：「入住体验极致化 + 运营成本最小化 + 口碑自动沉淀」，解决民宿行业多平台管理乱、差评响应慢、清洁排班难三大痛点。\n\n涵盖六大功能模块：\n① 多平台订单聚合（美团/携程/Airbnb 统一管理）\n② AI 客服自动回复（咨询/投诉/特殊需求 7×24）\n③ 智能清洁调度（退房/入住时间自动排班）\n④ 动态定价助手（节假日/竞品/天气联动定价）\n⑤ 差评预警与修复（负面评价 10 分钟响应）\n⑥ 经营数据看板（入住率/RevPAR/满意度）\n\n适用场景：精品民宿、连锁客栈、短租公寓、精品酒店，5 间房以上即可部署。	https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u8001\\u677f\\u7aef","messages":[{"type":"user","text":"\\u4e94\\u4e00\\u5047\\u671f\\u8ba2\\u623f\\u60c5\\u51b5\\u600e\\u4e48\\u6837"},{"type":"ai","text":"\\ud83d\\udcca \\u4e94\\u4e00\\u5047\\u671f\\uff085\\u67081\\u65e5-5\\u65e5\\uff09\\u9884\\u8ba2\\u60c5\\u51b5\\n\\n\\u5df2\\u8ba2\\u623f\\u95f4\\uff1a18\\/20 \\u95f4\\uff08\\u5165\\u4f4f\\u7387 90%\\uff09\\u2705\\n\\u9884\\u8ba1\\u6536\\u5165\\uff1a\\u00a542,600\\n\\n\\u26a0\\ufe0f 2\\u95f4\\u672a\\u8ba2\\uff1a301\\uff08\\u666f\\u89c2\\u5927\\u5e8a\\uff09\\u3001502\\uff08\\u4eb2\\u5b50\\u5957\\u623f\\uff09\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\uff1a\\u4e94\\u4e00\\u524d 3 \\u5929\\u5bf9\\u8fd9 2 \\u95f4\\u63d0\\u4ef7 15%\\uff0c\\u540c\\u6b65\\u5728\\u6296\\u97f3\\u672c\\u5730\\u56e2\\u8d2d\\u53d1\\u9650\\u65f6\\u7279\\u60e0\\uff0c\\u901a\\u5e38\\u80fd\\u5728\\u8282\\u524d\\u6e05\\u4ed3"},{"type":"user","text":"\\u63d0\\u4ef7\\uff0c\\u6296\\u97f3\\u53d1\\u4ec0\\u4e48\\u5185\\u5bb9"},{"type":"ai","text":"\\u2705 301\\u548c502\\u5df2\\u63d0\\u4ef7 15%\\n\\n\\ud83d\\udcdd \\u6296\\u97f3\\u63a8\\u5e7f\\u6587\\u6848\\u5df2\\u751f\\u6210\\uff1a\\n\\n\\u300c\\u4e94\\u4e00\\u5c31\\u5269\\u6700\\u540e 2 \\u95f4\\uff01\\u6d77\\u666f\\u5927\\u5e8a+\\u4eb2\\u5b50\\u5957\\u623f\\uff0c\\u4e94\\u4e00\\u4e0d\\u7528\\u62a2\\u7968\\uff0c\\u4f4f\\u8fdb\\u6765\\u5c31\\u662f\\u65c5\\u884c\\ud83c\\udf0a \\u9650\\u65f6\\u7279\\u60e0 \\u00a5599\\u8d77\\uff0c\\u626b\\u7801\\u9884\\u8ba2\\ud83d\\udc47\\u300d\\n\\n\\u914d\\u5957\\u5efa\\u8bae\\uff1a\\u4f7f\\u7528\\u9152\\u5e97\\u9732\\u53f0+\\u6d77\\u666f\\u7684\\u771f\\u5b9e\\u89c6\\u9891\\uff0c\\u53d1\\u5e03\\u6700\\u4f73\\u65f6\\u95f4\\uff1a\\u4eca\\u665a 20:00"}]},{"label":"\\u7ba1\\u5bb6\\u7aef","messages":[{"type":"user","text":"\\u4eca\\u5929\\u4e0b\\u5348\\u9000\\u623f\\u7684\\u6709\\u54ea\\u4e9b\\uff0c\\u4ec0\\u4e48\\u65f6\\u5019\\u6e05\\u6d01"},{"type":"ai","text":"\\ud83d\\udccb \\u4eca\\u65e5\\u9000\\u623f\\u5b89\\u6392\\uff1a\\n\\n14:00 \\u9000\\u623f\\uff1a101\\u3001203\\u3001305\\uff083\\u95f4\\uff09\\n12:00 \\u63d0\\u524d\\u9000\\uff1a402\\n\\n\\u2705 \\u6e05\\u6d01\\u6392\\u73ed\\u5df2\\u751f\\u6210\\uff1a\\n\\u5c0f\\u674e\\u8d1f\\u8d23101\\u3001203\\uff08\\u9884\\u8ba1 13:30 \\u5b8c\\u6210\\uff09\\n\\u5c0f\\u5f20\\u8d1f\\u8d23305\\u3001402\\uff08\\u9884\\u8ba1 14:00 \\u5b8c\\u6210\\uff09\\n\\n\\u4e0b\\u5348\\u5165\\u4f4f\\uff1a\\n\\u2022 101\\u300016:00 \\u65b0\\u5ba2\\u5165\\u4f4f\\n\\u2022 305\\u300015:00 \\u5165\\u4f4f\\uff08\\u9700\\u63d0\\u524d\\u5907\\u597d\\u513f\\u7ae5\\u5e8a\\uff09\\n\\n\\u26a0\\ufe0f 305 \\u9700\\u63d0\\u524d\\u51c6\\u5907\\u513f\\u7ae5\\u5e8a\\uff0c\\u5df2\\u63d0\\u9192\\u5c0f\\u5f20"},{"type":"user","text":"\\u597d\\u7684\\uff0c203\\u6709\\u5ba2\\u4eba\\u8bf4\\u7a7a\\u8c03\\u6709\\u95ee\\u9898"},{"type":"ai","text":"\\u2705 \\u5df2\\u8bb0\\u5f55\\uff1a203\\u7a7a\\u8c03\\u6545\\u969c\\n\\n\\ud83d\\udccb \\u5904\\u7406\\u6d41\\u7a0b\\u5df2\\u542f\\u52a8\\uff1a\\n\\u2460 \\u5df2\\u901a\\u77e5\\u7ef4\\u4fee\\u5e08\\u5085\\uff0c\\u9884\\u8ba1 13:00 \\u524d\\u5904\\u7406\\n\\u2461 203 \\u4eca\\u65e5\\u6682\\u505c\\u63a5\\u53d7\\u65b0\\u9884\\u8ba2\\n\\u2462 \\u5f53\\u524d\\u4f4f\\u5ba2\\u5df2\\u5b89\\u6392\\u6362\\u81f3 206\\uff08\\u540c\\u578b\\u623f\\uff0c\\u5df2\\u786e\\u8ba4\\u65e0\\u5f02\\u8bae\\uff09\\n\\n\\u7ef4\\u4fee\\u5b8c\\u6210\\u540e\\u4f1a\\u81ea\\u52a8\\u6062\\u590d\\u4e0a\\u67b6 \\u2705"}]},{"label":"\\u5ba2\\u670d\\u7aef","messages":[{"type":"user","text":"\\u6709\\u5ba2\\u4eba\\u5728\\u7f8e\\u56e2\\u7ed9\\u4e864\\u5206\\uff0c\\u8bf4\\u65e9\\u9910\\u79cd\\u7c7b\\u592a\\u5c11"},{"type":"ai","text":"\\u26a0\\ufe0f \\u5df2\\u6536\\u5230\\u5dee\\u8bc4\\u9884\\u8b66\\uff1a\\u7f8e\\u56e2 4\\u5206\\n\\n\\ud83d\\udcdd \\u5efa\\u8bae\\u56de\\u590d\\uff0830\\u79d2\\u5185\\u56de\\u590d\\u53ef\\u964d\\u4f4e\\u5f71\\u54cd\\uff09\\uff1a\\n\\n\\u300c\\u611f\\u8c22\\u60a8\\u7684\\u5165\\u4f4f\\u548c\\u53cd\\u9988\\uff01\\u975e\\u5e38\\u62b1\\u6b49\\u65e9\\u9910\\u79cd\\u7c7b\\u672a\\u80fd\\u6ee1\\u8db3\\u60a8\\u7684\\u671f\\u5f85\\u3002\\u6211\\u4eec\\u5df2\\u5c06\\u60a8\\u7684\\u5efa\\u8bae\\u53cd\\u9988\\u7ed9\\u53a8\\u623f\\u56e2\\u961f\\uff0c\\u4e0b\\u5468\\u8d77\\u5c06\\u65b0\\u589e3\\u6b3e\\u65e9\\u9910\\u9009\\u9879\\u3002\\u5e0c\\u671b\\u6709\\u673a\\u4f1a\\u518d\\u6b21\\u4e3a\\u60a8\\u670d\\u52a1\\uff0c\\u5c4a\\u65f6\\u5c06\\u4e3a\\u60a8\\u51c6\\u5907\\u4e13\\u5c5e\\u6b22\\u8fce\\u793c \\ud83d\\ude4f\\u300d\\n\\n\\u662f\\u5426\\u53d1\\u9001\\u6b64\\u56de\\u590d\\uff1f"},{"type":"user","text":"\\u53d1\\u9001\\uff0c\\u987a\\u4fbf\\u8bb0\\u5f55\\u4e00\\u4e0b\\u65e9\\u9910\\u95ee\\u9898"},{"type":"ai","text":"\\u2705 \\u56de\\u590d\\u5df2\\u53d1\\u9001\\n\\ud83d\\udcdd \\u65e9\\u9910\\u6539\\u5584\\u5efa\\u8bae\\u5df2\\u8bb0\\u5f55\\u5e76\\u53d1\\u9001\\u7ed9\\u9910\\u996e\\u8d1f\\u8d23\\u4eba\\n\\n\\u672c\\u6708\\u5dee\\u8bc4\\u6c47\\u603b\\uff1a\\n\\u2022 \\u65e9\\u9910\\u79cd\\u7c7b\\uff083\\u6b21\\uff09\\u26a0\\ufe0f \\u9ad8\\u9891\\u95ee\\u9898\\n\\u2022 \\u505c\\u8f66\\u4f4d\\u4e0d\\u8db3\\uff081\\u6b21\\uff09\\n\\u2022 WiFi \\u4fe1\\u53f7\\uff081\\u6b21\\uff09\\n\\n\\u65e9\\u9910\\u95ee\\u9898\\u8fde\\u7eed\\u51fa\\u73b0\\uff0c\\u5efa\\u8bae\\u672c\\u5468\\u5185\\u843d\\u5b9e\\u6539\\u5584\\u65b9\\u6848"}]}]
88	美容美发连锁 AI 运营助手	beauty-salon-ai-ops	199.00	专为美容美发连锁门店打造的全链路 AI 运营系统。核心理念：「预约不爽约 + 顾客精准维护 + 技师产能最大化」，解决美业门店爽约率高、会员流失追踪难、技师排班冲突三大痛点。\n\n涵盖六大功能模块：\n① AI 预约管理（微信预约+智能提醒，爽约率降低 60%）\n② 顾客档案系统（发质/肤质/偏好/消费全记录）\n③ 技师排班优化（客流预测+技师专长双匹配）\n④ 会员营销自动化（生日关怀/到期提醒/沉睡唤醒）\n⑤ 产品库存管理（低库存预警+畅销品分析）\n⑥ 门店数据看板（预约率/技师产能/会员活跃度）\n\n适用场景：美发店、美容院、美甲店、综合美业门店，单店/连锁均可部署，接入企业微信当天上线。	https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u8001\\u677f\\u7aef","messages":[{"type":"user","text":"\\u672c\\u6708\\u4e1a\\u7ee9\\u600e\\u4e48\\u6837\\uff0c\\u54ea\\u4e2a\\u6280\\u5e08\\u6700\\u597d"},{"type":"ai","text":"\\ud83d\\udcca \\u672c\\u6708\\u7ecf\\u8425\\u7b80\\u62a5\\uff08\\u622a\\u81f3\\u4eca\\u65e5\\uff09\\n\\n\\u603b\\u8425\\u4e1a\\u989d\\uff1a\\u00a5128,400\\uff08\\u21919% vs \\u4e0a\\u6708\\uff09\\n\\u670d\\u52a1\\u4eba\\u6b21\\uff1a486 \\u6b21\\u3000\\u5ba2\\u5355\\u4ef7\\uff1a\\u00a5264\\n\\u4f1a\\u5458\\u590d\\u8d2d\\u7387\\uff1a71%\\u2705\\n\\n\\ud83d\\udc51 \\u6280\\u5e08\\u6392\\u540d\\uff1a\\n\\ud83e\\udd47 \\u5c0f\\u7f8e\\u3000\\u00a538,200\\u3000118 \\u4eba\\u6b21\\uff08\\u9884\\u7ea6\\u6392\\u961f 3 \\u5929\\uff09\\n\\ud83e\\udd48 \\u963f\\u6770\\u3000\\u00a531,600\\u300097 \\u4eba\\u6b21\\n\\ud83e\\udd49 \\u5c0f\\u6797\\u3000\\u00a528,800\\u300089 \\u4eba\\u6b21\\n\\n\\ud83d\\udca1 \\u5c0f\\u7f8e\\u4e25\\u91cd\\u8d85\\u8d1f\\u8377\\uff0c\\u5efa\\u8bae\\u63d0\\u4ef7 20% \\u6216\\u57f9\\u517b\\u52a9\\u7406\\u63a5\\u5355"},{"type":"user","text":"\\u672c\\u6708\\u6709\\u591a\\u5c11\\u4f1a\\u5458\\u5feb\\u5230\\u671f\\u4e86"},{"type":"ai","text":"\\ud83d\\udcca \\u4f1a\\u5458\\u5230\\u671f\\u9884\\u8b66\\uff1a\\n\\n\\u672c\\u6708\\u5230\\u671f\\uff1a43 \\u4eba\\u3000\\u672c\\u5468\\u5230\\u671f\\uff1a12 \\u4eba\\n\\n\\u26a0\\ufe0f \\u9ad8\\u4ef7\\u503c\\u4f1a\\u5458\\uff08\\u4f59\\u989d \\u00a5500+\\uff09\\u5373\\u5c06\\u5230\\u671f\\uff1a7 \\u4eba\\n\\n\\ud83d\\udca1 \\u5efa\\u8bae\\u7acb\\u5373\\u5bf9\\u8fd9 7 \\u4eba\\u53d1\\u9001\\u4e13\\u5c5e\\u7eed\\u8d39\\u4f18\\u60e0\\uff0c\\u5386\\u53f2\\u6570\\u636e\\u663e\\u793a\\u6b64\\u7c7b\\u633d\\u7559\\u6210\\u529f\\u7387 78%\\n\\n\\u662f\\u5426\\u73b0\\u5728\\u751f\\u6210\\u5e76\\u53d1\\u9001\\u7eed\\u8d39\\u6d88\\u606f\\uff1f"}]},{"label":"\\u6280\\u5e08\\u7aef","messages":[{"type":"user","text":"\\u4e0b\\u5348\\u4e24\\u70b9\\u7684\\u5218\\u592a\\u592a\\u6765\\u4e86\\uff0c\\u5979\\u4e4b\\u524d\\u505a\\u8fc7\\u4ec0\\u4e48"},{"type":"ai","text":"\\ud83d\\udccb \\u987e\\u5ba2\\u6863\\u6848\\uff1a\\u5218\\u6167\\u840d\\u3000VIP\\u4f1a\\u5458\\n\\n\\u4e0a\\u6b21\\u670d\\u52a1\\uff1a3\\u670812\\u65e5\\uff0825\\u5929\\u524d\\uff09\\n\\u9879\\u76ee\\uff1a\\u70eb\\u53d1\\uff08\\u65e5\\u7cfb\\u5c0f\\u5377\\uff09+ \\u62a4\\u7406\\n\\u53d1\\u8d28\\uff1a\\u53d7\\u635f\\u53d1\\u8d28\\uff0c\\u5bf9\\u6c28\\u6c34\\u654f\\u611f\\u26a0\\ufe0f\\n\\u504f\\u597d\\uff1a\\u4e0d\\u559c\\u6b22\\u53d1\\u578b\\u592a\\u9ad8\\uff0c\\u559c\\u6b22\\u81ea\\u7136\\u611f\\n\\n\\u5386\\u53f2\\u6d88\\u8d39\\uff1a\\u00a58,640\\u3000\\u5230\\u8bbf 22 \\u6b21\\n\\n\\ud83d\\udca1 \\u672c\\u6b21\\u5efa\\u8bae\\u63a8\\u8350\\uff1a\\u4fee\\u62a4\\u7117\\u6cb9\\uff08\\u4e0a\\u6b21\\u70eb\\u540e\\u5e94\\u505a\\uff0c\\u5979\\u8fd8\\u672a\\u505a\\uff09"},{"type":"user","text":"\\u505a\\u5b8c\\u4e86\\uff0c\\u5e2e\\u6211\\u8bb0\\u5f55\\u4e00\\u4e0b\\u4eca\\u5929\\u7684\\u670d\\u52a1"},{"type":"ai","text":"\\u8bf7\\u7b80\\u5355\\u63cf\\u8ff0\\u4eca\\u5929\\u505a\\u4e86\\u4ec0\\u4e48\\uff0c\\u6211\\u6765\\u5f55\\u5165\\uff1a"},{"type":"user","text":"\\u526a\\u53d1+\\u4fee\\u62a4\\u7117\\u6cb9\\uff0c\\u5979\\u5bf9\\u4eca\\u5929\\u6548\\u679c\\u5f88\\u6ee1\\u610f"},{"type":"ai","text":"\\u2705 \\u670d\\u52a1\\u8bb0\\u5f55\\u5df2\\u66f4\\u65b0\\uff1a\\n\\u526a\\u53d1\\uff08\\u81ea\\u7136\\u5377\\u4fee\\u578b\\uff09+ \\u4fee\\u62a4\\u7117\\u6cb9\\n\\u987e\\u5ba2\\u6ee1\\u610f\\u5ea6\\uff1a\\u2b50\\u2b50\\u2b50\\u2b50\\u2b50\\n\\n\\ud83d\\udcf2 \\u5df2\\u53d1\\u9001\\u62a4\\u53d1\\u5c0f\\u8d34\\u58eb\\u7ed9\\u5218\\u592a\\u592a\\n\\ud83d\\uddd3\\ufe0f \\u5efa\\u8bae\\u4e0b\\u6b21\\u56de\\u8bbf\\uff1a30\\u5929\\u540e\\uff085\\u67086\\u65e5\\uff09\\n\\n\\u81ea\\u52a8\\u63d0\\u9192\\u5df2\\u8bbe\\u7f6e\\uff0c\\u5c4a\\u65f6\\u5c06\\u63a8\\u9001\\u7ed9\\u5218\\u592a\\u592a \\u2705"}]},{"label":"\\u524d\\u53f0\\u7aef","messages":[{"type":"user","text":"\\u6709\\u4e2a\\u65b0\\u5ba2\\u4eba\\u60f3\\u9884\\u7ea6\\u660e\\u5929\\u70eb\\u53d1\\uff0c\\u54ea\\u4e2a\\u6280\\u5e08\\u6709\\u7a7a"},{"type":"ai","text":"\\u660e\\u65e5\\u70eb\\u53d1\\u53ef\\u7ea6\\u6280\\u5e08\\uff1a\\n\\n\\u2022 \\u963f\\u6770\\u300010:00 \\/ 14:00 \\u6709\\u6863\\uff08\\u70eb\\u53d1\\u4e13\\u957f \\u2b50\\u2b50\\u2b50\\u2b50\\u2b50\\uff09\\n\\u2022 \\u5c0f\\u6797\\u300011:00 \\u6709\\u6863\\uff08\\u70eb\\u53d1\\u4e13\\u957f \\u2b50\\u2b50\\u2b50\\u2b50\\uff09\\n\\n\\u5c0f\\u7f8e\\u660e\\u65e5\\u5168\\u5929\\u7ea6\\u6ee1 \\u274c\\n\\n\\u8bf7\\u95ee\\u5ba2\\u4eba\\u504f\\u597d\\u54ea\\u4f4d\\uff0c\\u6216\\u6709\\u7279\\u522b\\u8981\\u6c42\\uff1f"},{"type":"user","text":"\\u963f\\u6770\\uff0c\\u4e0b\\u5348\\u4e24\\u70b9"},{"type":"ai","text":"\\u2705 \\u5df2\\u4e3a\\u65b0\\u5ba2\\u9884\\u7ea6\\uff1a\\n\\u963f\\u6770\\u3000\\u660e\\u65e5 14:00\\u3000\\u70eb\\u53d1\\n\\n\\ud83d\\udcf2 \\u9884\\u7ea6\\u786e\\u8ba4\\u77ed\\u4fe1\\u5df2\\u53d1\\u9001\\u7ed9\\u5ba2\\u4eba\\n\\u23f0 \\u660e\\u65e5 12:00 \\u5c06\\u81ea\\u52a8\\u53d1\\u9001\\u63d0\\u9192\\uff0c\\u964d\\u4f4e\\u723d\\u7ea6\\u7387\\n\\n\\u8bf7\\u95ee\\u5ba2\\u4eba\\u59d3\\u540d\\u548c\\u624b\\u673a\\u53f7\\uff1f\\u65b9\\u4fbf\\u5efa\\u7acb\\u6863\\u6848"}]}]
89	保险公司 AI 展业助手	insurance-ai-sales-assistant	399.00	为保险公司及独立代理人打造的全链路 AI 展业系统，覆盖客户开发、需求分析、方案生成到售后服务的完整闭环。\n\n系统以"智能展业，精准服务"为核心理念，将 AI 融入保险销售每个关键节点，让代理人专注于关系维护，让 AI 处理繁琐的分析与文案工作。\n\n① 客户画像分析（根据年龄、收入、家庭结构生成个性化需求分析报告）\n② 方案智能生成（一键生成匹配客户需求的产品组合方案及对比说明）\n③ 话术辅助系统（异议处理、产品说明、促成签单的实时话术建议）\n④ 保单管理助手（到期提醒、续保跟进、保全办理流程引导）\n⑤ 理赔陪伴服务（理赔材料清单、进度跟踪、客户情绪安抚话术）\n⑥ 增员裂变工具（增员话术、团队晨会内容、新人培训素材自动生成）\n\n适用于保险公司直营团队、独立代理人、保险经纪公司及银保渠道。	https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop	available	行业方案	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	\N	[{"label":"\\u4ee3\\u7406\\u4eba\\u7aef","messages":[{"type":"user","text":"\\u5ba2\\u623738\\u5c81\\uff0c\\u6709\\u4e24\\u4e2a\\u5b69\\u5b50\\uff0c\\u6708\\u6536\\u51652\\u4e07\\u5de6\\u53f3\\uff0c\\u60f3\\u4e86\\u89e3\\u91cd\\u75be\\u9669"},{"type":"ai","text":"\\u2705 \\u5df2\\u751f\\u6210\\u5ba2\\u6237\\u9700\\u6c42\\u753b\\u50cf\\n\\n\\ud83d\\udcca \\u5206\\u6790\\u7ed3\\u8bba\\uff1a\\n\\u2022 \\u5bb6\\u5ead\\u8d23\\u4efb\\u91cd\\uff082\\u5b69\\uff09\\uff0c\\u91cd\\u75be\\u4fdd\\u969c\\u7f3a\\u53e3\\u7ea6 50\\u201380 \\u4e07\\n\\u2022 \\u6708\\u6536\\u5165 2 \\u4e07\\uff0c\\u4fdd\\u8d39\\u9884\\u7b97\\u5efa\\u8bae\\u63a7\\u5236\\u5728 \\u00a51,500\\u2013\\u00a52,500\\/\\u6708\\n\\u2022 38 \\u5c81\\u4e3a\\u91cd\\u75be\\u9669\\u6295\\u4fdd\\u9ec4\\u91d1\\u7a97\\u53e3\\u671f\\uff0c\\u518d\\u7b49 2 \\u5e74\\u4fdd\\u8d39\\u5c06\\u4e0a\\u6da8\\u7ea6 15%\\n\\n\\ud83d\\udca1 \\u63a8\\u8350\\u65b9\\u6848\\uff1a\\n\\u4e3b\\u9669\\uff1aXX \\u91cd\\u75be\\u9669 50 \\u4e07\\uff08\\u542b\\u8f7b\\u75c7 30%\\uff09\\n\\u9644\\u52a0\\uff1a\\u5b9a\\u671f\\u5bff\\u9669 100 \\u4e07\\uff08\\u5b69\\u5b50\\u6210\\u5e74\\u524d\\u53cc\\u91cd\\u4fdd\\u969c\\uff09\\n\\u6708\\u4fdd\\u8d39\\u7ea6 \\u00a51,980\\n\\n\\u662f\\u5426\\u751f\\u6210\\u5b8c\\u6574\\u4ea7\\u54c1\\u5bf9\\u6bd4\\u8bf4\\u660e\\u53d1\\u7ed9\\u5ba2\\u6237\\uff1f"},{"type":"user","text":"\\u751f\\u6210\\u4e00\\u4e0b\\uff0c\\u5ba2\\u6237\\u8bf4\\u89c9\\u5f97\\u6709\\u793e\\u4fdd\\u4e86\\u4e0d\\u9700\\u8981\\u4e70"},{"type":"ai","text":"\\ud83d\\udccb \\u65b9\\u6848\\u8bf4\\u660e + \\u5f02\\u8bae\\u5904\\u7406\\u8bdd\\u672f\\n\\n\\u5173\\u4e8e\\u3010\\u5df2\\u6709\\u793e\\u4fdd\\u3011\\u7684\\u5e94\\u5bf9\\uff1a\\n\\u5f20\\u5148\\u751f\\uff0c\\u793e\\u4fdd\\u786e\\u5b9e\\u662f\\u57fa\\u7840\\u4fdd\\u969c\\uff0c\\u4f46\\u91cd\\u5927\\u75be\\u75c5\\u6cbb\\u7597\\u8d39\\u7528\\u5e73\\u5747\\u5728 30\\u201350 \\u4e07\\uff0c\\u793e\\u4fdd\\u62a5\\u9500\\u540e\\u81ea\\u8d39\\u90e8\\u5206\\u4ecd\\u6709 15\\u201330 \\u4e07\\u3002\\u66f4\\u5173\\u952e\\u7684\\u662f\\uff0c\\u786e\\u8bca\\u91cd\\u75be\\u540e\\u60a8\\u53ef\\u80fd\\u9700\\u8981\\u4f11\\u517b 1\\u20132 \\u5e74\\u65e0\\u6cd5\\u5de5\\u4f5c\\uff0c\\u8fd9\\u671f\\u95f4\\u5bb6\\u5ead\\u6536\\u5165\\u7684\\u66ff\\u4ee3\\u624d\\u662f\\u6838\\u5fc3\\u9700\\u6c42\\u3002\\n\\n\\u2705 \\u5b8c\\u6574\\u4ea7\\u54c1\\u5bf9\\u6bd4 PDF \\u5df2\\u751f\\u6210\\uff0c\\u5305\\u542b\\uff1a\\n\\u2022 \\u793e\\u4fdd vs \\u5546\\u4e1a\\u9669\\u4fdd\\u969c\\u8303\\u56f4\\u5bf9\\u6bd4\\n\\u2022 \\u6cbb\\u7597\\u8d39\\u7528\\u5b9e\\u9645\\u6848\\u4f8b\\n\\u2022 \\u60a8\\u7684\\u4e13\\u5c5e\\u65b9\\u6848\\u4fdd\\u969c\\u6743\\u76ca\\u8868\\n\\n\\u662f\\u5426\\u73b0\\u5728\\u53d1\\u9001\\u7ed9\\u5ba2\\u6237\\uff1f"}]},{"label":"\\u552e\\u540e\\u670d\\u52a1\\u7aef","messages":[{"type":"user","text":"\\u5ba2\\u6237\\u51fa\\u9669\\u4e86\\uff0c\\u9aa8\\u6298\\u4f4f\\u9662\\uff0c\\u4e0d\\u77e5\\u9053\\u600e\\u4e48\\u7406\\u8d54"},{"type":"ai","text":"\\u2705 \\u5df2\\u786e\\u8ba4\\uff1a\\u610f\\u5916\\u9669\\u9aa8\\u6298\\u4f4f\\u9662\\u7406\\u8d54\\u6d41\\u7a0b\\n\\n\\ud83d\\udcca \\u9700\\u51c6\\u5907\\u6750\\u6599\\uff1a\\n\\u2460 \\u51fa\\u9662\\u5c0f\\u7ed3\\uff08\\u533b\\u9662\\u76d6\\u7ae0\\uff09\\n\\u2461 \\u4f4f\\u9662\\u8d39\\u7528\\u53d1\\u7968 + \\u660e\\u7ec6\\u6e05\\u5355\\n\\u2462 \\u8bca\\u65ad\\u8bc1\\u660e\\u4e66\\uff08\\u9700\\u6ce8\\u660e\\u9aa8\\u6298\\u90e8\\u4f4d\\uff09\\n\\u2463 \\u8eab\\u4efd\\u8bc1\\u590d\\u5370\\u4ef6\\n\\u2464 \\u94f6\\u884c\\u5361\\u4fe1\\u606f\\n\\n\\ud83d\\udca1 \\u6ce8\\u610f\\u4e8b\\u9879\\uff1a\\n\\u2022 \\u4fdd\\u7559\\u6240\\u6709\\u8d39\\u7528\\u539f\\u4ef6\\uff0c\\u52ff\\u63d0\\u4ea4\\u590d\\u5370\\u4ef6\\n\\u2022 \\u7406\\u8d54\\u7533\\u8bf7\\u5efa\\u8bae\\u5728\\u51fa\\u9662\\u540e 30 \\u5929\\u5185\\u63d0\\u4ea4\\n\\u2022 \\u9884\\u8ba1\\u5230\\u8d26\\u65f6\\u95f4\\uff1a\\u8d44\\u6599\\u9f50\\u5168\\u540e 5\\u201310 \\u4e2a\\u5de5\\u4f5c\\u65e5\\n\\n\\u662f\\u5426\\u9700\\u8981\\u6211\\u5e2e\\u60a8\\u8d77\\u8349\\u4e00\\u6761\\u5b89\\u6170\\u5ba2\\u6237\\u3001\\u6307\\u5bfc\\u6536\\u96c6\\u6750\\u6599\\u7684\\u6d88\\u606f\\uff1f"},{"type":"user","text":"\\u9700\\u8981\\uff0c\\u5e2e\\u6211\\u5199\\u4e00\\u4e0b"},{"type":"ai","text":"\\ud83d\\udcf2 \\u5efa\\u8bae\\u53d1\\u9001\\u7ed9\\u5ba2\\u6237\\u7684\\u6d88\\u606f\\uff1a\\n\\n\\u3010[\\u5ba2\\u6237\\u540d]\\uff0c\\u5f97\\u77e5\\u60a8\\u9aa8\\u6298\\u4f4f\\u9662\\uff0c\\u5e0c\\u671b\\u60a8\\u5b89\\u5fc3\\u517b\\u4f24\\uff0c\\u8eab\\u4f53\\u5eb7\\u590d\\u662f\\u7b2c\\u4e00\\u4f4d\\u7684\\uff01\\n\\n\\u6211\\u5df2\\u7ecf\\u4e3a\\u60a8\\u6574\\u7406\\u597d\\u7406\\u8d54\\u6240\\u9700\\u6750\\u6599\\u6e05\\u5355\\uff0c\\u51fa\\u9662\\u65f6\\u8bf7\\u6536\\u96c6\\u597d\\u4ee5\\u4e0b\\u6587\\u4ef6\\uff1a\\u51fa\\u9662\\u5c0f\\u7ed3\\u3001\\u4f4f\\u9662\\u53d1\\u7968+\\u660e\\u7ec6\\u3001\\u8bca\\u65ad\\u8bc1\\u660e\\u4e66\\u3002\\u5176\\u4ed6\\u8d44\\u6599\\u6211\\u6765\\u5e2e\\u60a8\\u51c6\\u5907\\uff0c\\u4e0d\\u7528\\u62c5\\u5fc3\\u3002\\n\\n\\u6709\\u4efb\\u4f55\\u95ee\\u9898\\u968f\\u65f6\\u8054\\u7cfb\\u6211\\uff0c\\u795d\\u65e9\\u65e5\\u5eb7\\u590d\\uff01\\ud83c\\udf1f\\u3011\\n\\n\\u2705 \\u6d88\\u606f\\u5df2\\u590d\\u5236\\uff0c\\u76f4\\u63a5\\u7c98\\u8d34\\u53d1\\u9001\\u5373\\u53ef\\u3002\\n\\u7406\\u8d54\\u5168\\u7a0b\\u6211\\u4f1a\\u6301\\u7eed\\u8ddf\\u8fdb\\uff0c\\u6709\\u8fdb\\u5c55\\u7b2c\\u4e00\\u65f6\\u95f4\\u901a\\u77e5\\u60a8\\u3002"}]},{"label":"\\u56e2\\u961f\\u7ba1\\u7406\\u7aef","messages":[{"type":"user","text":"\\u5e2e\\u6211\\u51c6\\u5907\\u4e00\\u4e0b\\u660e\\u5929\\u65e9\\u4f1a\\u7684\\u5185\\u5bb9\\uff0c\\u672c\\u6708\\u8fd8\\u5dee30\\u4e07\\u4e1a\\u7ee9"},{"type":"ai","text":"\\ud83d\\udccb \\u660e\\u65e5\\u6668\\u4f1a\\u5185\\u5bb9\\uff08\\u9884\\u8ba1 15 \\u5206\\u949f\\uff09\\n\\n\\u2460 \\u5f00\\u573a\\u6fc0\\u52b1\\uff082 \\u5206\\u949f\\uff09\\n\\u8ddd\\u6708\\u5e95\\u8fd8\\u6709 8 \\u5929\\uff0c30 \\u4e07\\u4e1a\\u7ee9\\u5e73\\u5747\\u6bcf\\u4eba\\u6bcf\\u5929\\u53ea\\u9700\\u4e00\\u5355\\uff0c\\u6211\\u4eec\\u505a\\u5f97\\u5230\\uff01\\n\\n\\u2461 \\u6570\\u636e\\u76d8\\u70b9\\uff083 \\u5206\\u949f\\uff09\\n\\u2022 \\u672c\\u6708\\u5df2\\u5b8c\\u6210\\uff1aXX \\u4e07\\uff08\\u8fdb\\u5ea6 XX%\\uff09\\n\\u2022 \\u8fd1 3 \\u5929\\u51fa\\u5355\\u6700\\u591a\\u7684\\u540c\\u4e8b\\uff1a[@\\u59d3\\u540d] \\u53ef\\u5206\\u4eab\\u7ecf\\u9a8c\\n\\n\\u2462 \\u91cd\\u70b9\\u52a8\\u4f5c\\uff085 \\u5206\\u949f\\uff09\\n\\u2022 \\u4eca\\u65e5\\u6bcf\\u4eba\\u81f3\\u5c11\\u62e8\\u6253 5 \\u4e2a\\u6709\\u610f\\u5411\\u5ba2\\u6237\\u56de\\u8bbf\\u7535\\u8bdd\\n\\u2022 \\u91cd\\u70b9\\u8ddf\\u8fdb\\u4e0a\\u5468\\u505a\\u8fc7\\u8ba1\\u5212\\u4e66\\u672a\\u6210\\u5355\\u7684 3 \\u4e2a\\u5ba2\\u6237\\n\\n\\u2463 \\u8bdd\\u672f\\u6f14\\u7ec3\\uff085 \\u5206\\u949f\\uff09\\n\\u672c\\u5468\\u4e3b\\u9898\\uff1a\\u5982\\u4f55\\u5e94\\u5bf9\\u3010\\u518d\\u8003\\u8651\\u8003\\u8651\\u3011\\u7684\\u5ba2\\u6237\\n\\n\\ud83d\\udca1 \\u6708\\u5e95\\u51b2\\u523a\\u8bdd\\u672f\\u5305\\u5df2\\u751f\\u6210\\uff0c\\u662f\\u5426\\u53d1\\u7ed9\\u5168\\u5458\\uff1f"},{"type":"user","text":"\\u53d1\\u7ed9\\u5168\\u5458"},{"type":"ai","text":"\\u2705 \\u6708\\u5e95\\u51b2\\u523a\\u8bdd\\u672f\\u5305\\u5df2\\u53d1\\u9001\\u7ed9 [\\u56e2\\u961f\\u5168\\u5458]\\n\\n\\ud83d\\udce6 \\u5305\\u542b\\u5185\\u5bb9\\uff1a\\n\\u2022 5 \\u5927\\u5e38\\u89c1\\u5f02\\u8bae\\u5904\\u7406\\u8bdd\\u672f\\n\\u2022 \\u6708\\u5e95\\u4fc3\\u6210\\u7b7e\\u5355\\u7684 3 \\u4e2a\\u65f6\\u673a\\u5f15\\u5bfc\\u6cd5\\n\\u2022 \\u670b\\u53cb\\u5708\\u7d20\\u6750 3 \\u6761\\uff08\\u4eca\\u65e5\\u53ef\\u76f4\\u63a5\\u4f7f\\u7528\\uff09\\n\\n\\ud83d\\udcca \\u53d1\\u9001\\u7edf\\u8ba1\\uff1a\\n\\u5df2\\u8bfb\\uff1a0\\/XX \\u4eba\\n\\n\\u660e\\u65e5\\u6668\\u4f1a\\u5df2\\u6dfb\\u52a0\\u63d0\\u9192\\uff0c\\u795d\\u51b2\\u523a\\u987a\\u5229\\uff01\\ud83d\\udcaa"}]}]
1	Davide · 前端系统架构师	davide-frontend-architect	39.00	意大利籍高级前端架构师，10 年大厂经验。精通 React / Next.js 系统拆分、性能调优与组件库设计。能快速评审代码架构、输出可落地的重构方案，并提供完整技术决策文档。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的前端系统架构师 👨‍💻\\n专注 React\\/Next.js 架构评审与性能调优。有什么需要我做的？","type":"ai"},{"text":"我们页面加载很慢，首页有大量图片","type":"user"},{"text":"问题很可能出在图片加载策略上。我来做快速诊断：\\n\\n① 首屏渲染路径（SSR\\/CSR\\/ISR 策略）\\n② Bundle 体积分析（代码拆分是否合理）\\n③ 图片与资源加载策略\\n\\n建议立即执行：\\n🔧 将 <img> 全部替换为 Next.js <Image> 组件\\n🔧 启用 priority 属性给首屏图\\n\\n通常可提速 40-70%。需要我生成重构后的代码吗？","type":"ai"},{"text":"需要，我们用 Next.js 15","type":"user"},{"text":"好，已为你生成优化方案：\\n\\n\\n\\n同时建议开启 Next.js Sharp 插件做自动压缩。预计首屏 LCP 从 4.2s 降至 1.1s ⚡","type":"ai"}]	\N
2	Tom · 融资经理	tom-fundraising-manager	39.00	专注早期创业公司融资的 AI 助手。帮助创始人梳理融资逻辑、打磨 Pitch Deck、准备 Due Diligence 材料，并模拟 VC 问答场景。已协助 50+ 项目完成天使轮及 Pre-A 轮融资。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的融资经理 💼\\n专注早期融资策略、Pitch Deck 打磨与 VC 模拟问答。你们现在准备融哪轮？","type":"ai"},{"text":"准备天使轮，还没接触过投资人","type":"user"},{"text":"明白了。天使轮准备三个核心任务：\\n\\n① Pitch Deck：10-12 页，讲清楚问题、方案、市场、团队\\n② 一句话 Pitch：30 秒说清楚你是谁、解决什么问题\\n③ 目标投资人名单：匹配你的赛道，别乱投\\n\\n先帮你打磨一句话 Pitch。你们产品是做什么的？","type":"ai"},{"text":"我们帮中小企业用 AI 做客服自动化","type":"user"},{"text":"好，一句话 Pitch 初稿：\\n\\n「我们帮中小企业用 AI 替代 70% 的客服工作量，成本降低 80%，已服务 50 家付费客户。」\\n\\n接下来模拟三个 VC 必问问题：\\n\\n❓「如果腾讯做同样的事，你们怎么办？」\\n❓「你们现在 MRR 是多少，增长率如何？」\\n❓「核心团队有没有做过 Exit？」\\n\\n想先练哪个？","type":"ai"}]	\N
3	Sophia · 内容营销总监	sophia-content-marketing-director	39.00	内容营销人工智能与多代理写作流程——Grok 研究、Opus 写作、品牌声音系统。从选题调研到成稿发布，全链路自动化，输出风格统一、转化率极高的品牌内容。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的内容营销总监 ✍️\\n我负责你所有的公众号内容策划、文章撰写和发布排期。有什么需要我做的？","type":"ai"},{"text":"本周需要发三篇公众号，帮我想选题","type":"user"},{"text":"好的！根据你的行业和近期热点，推荐以下三个选题：\\n\\n① 《为什么你的团队效率低？不是因为懒，是因为这件事没做好》\\n② 《我用 AI 员工替代了一个岗位，三个月后发生了什么》\\n③ 《老板必看：2025 年最值得投入的 3 个增长渠道》\\n\\n需要我先写哪篇？","type":"ai"},{"text":"先写第二篇","type":"user"},{"text":"收到，正在撰写《我用 AI 员工替代了一个岗位》...\\n\\n开头已生成：\\n\\n「三个月前，我做了一个让团队都觉得冒险的决定——用一个 AI 员工，接管了我们的客服岗位。没想到，三个月后，客户满意度反而提高了 23%。」\\n\\n全文约 1800 字，包含数据、故事线和行动号召。是否继续生成完整版？","type":"ai"},{"text":"好，另外帮我想个封面标题","type":"user"},{"text":"封面标题备选 3 个：\\n\\n🔥「裁了一个人，省了 12 万，老板后悔没早点做」\\n💡「我偷偷用了 AI 员工 90 天，结果出乎意料」\\n📈「一个 AI，干了三个人的活——这不是未来，是现在」\\n\\n建议用第一个，点击率预计更高 🎨","type":"ai"}]	\N
4	Marcus · 客服自动化专家	marcus-customer-service-automation	39.00	专注企业客服全流程自动化。构建多轮对话工作流、智能工单分发与情绪识别系统，无缝对接 Zendesk、Intercom 等主流平台。平均将人工响应成本降低 70%，客户满意度提升至 95% 以上。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的客服自动化专家 🤖\\n专注构建多轮对话工作流与智能工单系统。你们目前客服是怎么运作的？","type":"ai"},{"text":"5 个客服每天处理 200+ 工单，太累了","type":"user"},{"text":"200+ 工单\\/天，5 个人处理，这个量级可以自动化 70% 以上。\\n\\n我的方案：\\n① 常见问题（退款\\/查单\\/密码重置）→ 全自动回复\\n② 复杂问题 → AI 初步分类后转人工\\n③ 情绪识别 → 差评风险工单自动优先级提升\\n\\n你们用什么客服平台？","type":"ai"},{"text":"用的是企业微信","type":"user"},{"text":"企业微信我可以对接。自动化上线后预期效果：\\n\\n✅ 人工响应量减少 65-75%\\n✅ 平均首次响应时间：15 分钟 → 30 秒\\n✅ 客户满意度预计提升 20%+\\n\\n5 个客服可缩减到 2 个，专注处理高价值问题。需要我出一份详细的自动化方案吗？","type":"ai"}]	\N
6	Ryan · SEO 增长专家	ryan-seo-growth-expert	39.00	全栈 SEO 自动化智能体。涵盖关键词研究、竞品分析、内链优化、技术 SEO 审查与外链建设全流程。结合 Ahrefs、Search Console 数据自动生成优先级行动清单，帮助网站在 90 天内实现自然流量显著增长。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的 SEO 增长专家 🔍\\n全栈 SEO 自动化，覆盖关键词研究到技术审查。你们网站目前 SEO 情况怎么样？","type":"ai"},{"text":"网站上线一年了，自然流量很少，没有专门做过 SEO","type":"user"},{"text":"一年没做 SEO，机会很大。我先做技术诊断，发现以下问题：\\n\\n❌ 43 个页面未被 Google 索引\\n❌ 页面平均加载速度 4.8s（移动端）\\n❌ 缺少结构化数据标记\\n⚠️ 核心关键词竞争度过高，需要找长尾切入口\\n\\n需要我出 90 天增长计划吗？","type":"ai"},{"text":"需要","type":"user"},{"text":"90 天 SEO 增长计划：\\n\\n📅 第 1 个月：技术修复（索引、速度、Schema）+ 关键词地图\\n📅 第 2 个月：核心页面内容优化 + 内链建设\\n📅 第 3 个月：外链获取 + 50 篇长尾词文章覆盖\\n\\n预期：自然流量提升 150-300%，首页关键词进入 Top 10 ✅\\n\\n已为你生成优先级行动清单，共 27 项任务。","type":"ai"}]	\N
7	Mia · 社媒运营专家	mia-social-media-manager	39.00	覆盖小红书、微博、抖音、Instagram 全平台的 AI 社媒运营员。自动规划内容日历、生成平台适配文案与配图提示词、分析互动数据并优化发布节奏。擅长打造品牌人设、提升粉丝粘性与自然增长。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的社媒运营专家 📱\\n覆盖小红书、微博、抖音全平台。你们现在主要运营哪个平台？","type":"ai"},{"text":"主要是小红书，卖护肤品，主打成分党，但涨粉很慢","type":"user"},{"text":"成分党赛道在小红书非常活跃！涨粉慢通常是这几个原因：\\n\\n① 账号定位不清晰，内容太杂\\n② 标题和封面不够吸引人\\n③ 发布时间没对齐平台高峰\\n\\n我的策略：\\n🎯 内容公式：「成分拆解 + 避坑指南 + 真实测评」\\n📌 爆款标题模板：「用了 X 年护肤品，这 3 个成分坑了多少人...」\\n🕐 最佳发布时间：工作日 21:00-22:00","type":"ai"},{"text":"帮我规划下个月的内容日历","type":"user"},{"text":"30 天内容日历已生成，共 20 篇：\\n\\n📅 每周一：成分深度解析（高涨粉）\\n📅 每周三：真实测评对比（高互动）\\n📅 每周五：避坑指南（高收藏）\\n📅 每周日：限时福利贴（高转化）\\n\\n每篇包含标题、封面文案、正文大纲和发布时间 🗓","type":"ai"}]	\N
9	Claire · 法律合规顾问	claire-legal-compliance	39.00	专注企业法律合规的 AI 顾问。覆盖合同审查、隐私政策起草、劳动法合规、知识产权保护及跨境数据合规。熟悉中国、欧盟、美国三地监管框架，帮助初创企业在快速扩张中规避法律风险。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的法律合规顾问 ⚖️\\n覆盖合同审查、隐私政策、劳动法与知识产权。有什么法律问题需要我处理？","type":"ai"},{"text":"我们要上线 APP，收集手机号、位置和使用行为，用了微信登录和支付宝支付，需要隐私政策","type":"user"},{"text":"这是中高风险数据收集组合，需满足以下法规：\\n\\n📋 中国：《个人信息保护法》（PIPL）\\n📋 欧盟用户：GDPR\\n📋 苹果\\/安卓：应用商店审核要求\\n\\n关键合规点：\\n⚠️ 位置数据需单独弹窗二次授权\\n⚠️ 第三方 SDK（微信、支付宝）必须逐一披露\\n⚠️ 用户有权申请数据删除","type":"ai"},{"text":"帮我起草隐私政策","type":"user"},{"text":"隐私政策初稿已完成，共 2400 字，包含：\\n\\n✅ 数据收集目的与最小化原则\\n✅ 第三方 SDK 数据共享披露（微信、支付宝）\\n✅ 用户权利条款（查询\\/删除\\/撤回授权）\\n✅ 位置数据专项说明\\n✅ 未成年人保护条款\\n\\n同步为你生成了《用户服务协议》初稿。建议上线前由律师二审 ✅","type":"ai"}]	\N
10	James · HR 招聘专家	james-hr-recruitment	39.00	全流程 AI 招聘助手。自动撰写职位描述、筛选简历、设计结构化面试题库，并对候选人进行初步评估与背景调查。支持 LinkedIn、Boss 直聘等主流平台数据接入，帮助企业将平均招聘周期缩短 60%。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的 HR 招聘专家 👥\\n全流程 AI 招聘，从 JD 撰写到候选人评估。你们现在需要招什么岗位？","type":"ai"},{"text":"要招一个用户增长方向的运营经理，薪资 15-20k","type":"user"},{"text":"好，JD 已初步生成：\\n\\n📄 职位：用户增长运营经理\\n💰 薪资：15-20k · 13薪\\n📌 核心要求：\\n・有 APP 或电商平台用户增长经验\\n・熟悉 A\\/B 测试、漏斗分析、裂变玩法\\n・有独立负责 GMV\\/DAU 增长项目经验\\n\\n已同步准备 8 道结构化面试题 + 评分标准。需要发布到哪个平台？","type":"ai"},{"text":"发到 Boss 直聘，帮我筛简历","type":"user"},{"text":"已发布到 Boss 直聘，72 小时内收到 47 份简历。\\n\\n AI 筛选结果：\\n✅ 强推候选人：3 名（均有电商增长项目经验）\\n📋 可面试候选人：11 名\\n❌ 不匹配：33 名\\n\\n已为 3 名强推候选人安排了初步背调，调查报告 24 小时内完成 📋","type":"ai"}]	\N
11	Linda · 财务会计专家	linda-finance-accounting	39.00	专业 AI 财务会计助手。自动处理日常记账、发票核对、工资核算与税务申报，生成月度财务报表与现金流预测。熟悉中国会计准则与 IFRS，支持对接用友、金蝶等主流财务系统，让财务工作零出错、全透明。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的财务会计专家 💰\\n自动处理日常记账、发票核对、税务申报与财务报表。你们现在财务是怎么处理的？","type":"ai"},{"text":"我自己用 Excel 记账，每个月月底很混乱，大概 100 张发票","type":"user"},{"text":"100 张\\/月，完全可以自动化处理。\\n\\nExcel 手动记账有三大风险：\\n❌ 数据容易出错，难以追溯\\n❌ 无法实时看现金流\\n❌ 税务申报时容易漏项\\n\\n我的方案：\\n📷 发票 OCR 识别 → 自动分类入账\\n📊 每月自动生成利润表、现金流表\\n🧾 季度增值税申报自动预填","type":"ai"},{"text":"上个月的财务报表能帮我生成吗？","type":"user"},{"text":"已生成上月财务报表：\\n\\n💰 营业收入：¥284,600\\n📉 运营成本：¥187,300\\n✅ 净利润：¥97,300（利润率 34.2%）\\n\\n⚠️ 异常提醒：\\n・采购支出比上月增加 23%，建议核查\\n・有 3 张发票金额异常，已标记待确认\\n\\n完整报表已导出 PDF，可直接用于税务申报 📄","type":"ai"}]	\N
13	Amy · 运营总监	amy-operations-director	39.00	全能 AI 运营助手。覆盖用户增长、活动策划、社群运营与留存优化全链路。自动生成运营日历、监控关键指标、输出数据复盘报告，并基于用户行为数据持续调整运营策略，让业务飞轮高速转动。	\N	available	AI 角色	2026-04-17 02:08:19	2026-04-17 02:08:19	\N	[{"text":"你好！我是你的运营总监 🚀\\n覆盖用户增长、活动策划与留存优化全链路。你们现在最大的运营挑战是什么？","type":"ai"},{"text":"新用户注册了，但 7 天后基本都流失了","type":"user"},{"text":"新用户 7 日流失是最常见的增长瓶颈。通常原因是：\\n\\n① 没有引导完成关键行为（Aha Moment）\\n② 新手引导体验差\\n③ 缺乏 D1\\/D3\\/D7 激活触达\\n\\n你们产品的「关键行为」是什么？比如发帖、购买、添加好友？","type":"ai"},{"text":"电商平台，关键行为是完成首单","type":"user"},{"text":"好，7 日激活方案：\\n\\n📅 注册当天：首单立减券 + 新手任务引导\\n📅 D2：浏览未下单 → 推送「你看过的商品还有 X 件库存」\\n📅 D3：推送「限时专属价」+ 好评晒单激励\\n📅 D7：如未下单 → 最后一次高力度挽回弹窗\\n\\n预计首单转化率提升 25-40%。需要我生成完整的 30 天运营日历吗？","type":"ai"}]	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2025_11_29_220023_create_personal_access_tokens_table	1
5	2025_11_29_220222_create_posts_table	1
6	2026_02_28_175953_create_listings_table	1
7	2026_02_28_224010_create_sourcing_requests_table	1
8	2026_02_28_230647_add_fields_to_posts_table	1
9	2026_03_01_002224_add_profile_fields_to_users_table	1
10	2026_03_01_003011_add_user_id_to_listings_table	1
11	2026_03_01_003843_create_purchases_table	1
12	2026_03_01_100000_create_payment_orders_table	1
13	2026_03_05_212053_add_demo_messages_to_listings_table	1
14	2026_03_24_172740_create_industry_solutions_table	1
15	2026_04_06_053148_add_demo_personas_to_listings_table	1
16	2026_04_17_002935_create_store_profiles_table	1
17	2026_04_17_002936_create_store_notes_table	1
18	2026_04_17_002937_create_store_products_table	1
19	2026_04_17_011003_add_store_type_to_store_profiles_table	1
20	2026_04_17_011003_create_store_bookings_table	1
21	2026_04_17_024629_add_username_to_users_table	2
22	2026_04_17_033841_create_store_photos_table	3
23	2026_04_17_033841_create_store_product_photos_table	3
24	2026_04_17_054028_add_category_to_store_photos_table	4
25	2026_04_18_000001_create_store_logs_table	5
26	2026_04_18_000002_add_amount_to_store_logs_table	6
27	2026_04_18_000003_create_store_inventory_txns_table	7
28	2026_04_18_000004_create_store_customers_table	8
29	2026_04_18_000005_create_store_customer_interactions_table	8
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: payment_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_orders (id, user_id, listing_id, stripe_session_id, amount, status, paid_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
1	App\\Models\\User	1	auth_token	5846c7d3e2a7e5be0c3ec3adbefe26569eca5ee73f2c300a1c729fddb200cbd7	["*"]	\N	\N	2026-04-17 02:21:11	2026-04-17 02:21:11
2	App\\Models\\User	1	auth_token	b17c93e6c32d55ff737096a35205a641a0d28cd700744c6fd60e265a6e2bb921	["*"]	2026-04-17 02:21:34	\N	2026-04-17 02:21:33	2026-04-17 02:21:34
3	App\\Models\\User	1	auth_token	565fa82490299ef0b2ccc722889cffb5f4fed9fa220f3ad3b776b82235cb306a	["*"]	\N	\N	2026-04-17 02:21:59	2026-04-17 02:21:59
4	App\\Models\\User	1	auth_token	721bee773053a5bf6c2a8215223e05673683debeca89f0439a43391708f71dc5	["*"]	2026-04-17 02:22:19	\N	2026-04-17 02:22:19	2026-04-17 02:22:19
5	App\\Models\\User	1	auth_token	51e6cec4c6b0955b1ee5d64bf6e2f7b857f5d68383f9784bd86d0b957d753e0d	["*"]	2026-04-17 02:23:02	\N	2026-04-17 02:23:02	2026-04-17 02:23:02
6	App\\Models\\User	1	auth_token	4e52071d5b8556e8f01d40bd59cf6cd30609265c59a3b7193b85ccd57514569a	["*"]	\N	\N	2026-04-17 02:24:24	2026-04-17 02:24:24
7	App\\Models\\User	1	auth_token	6f6c201ff24c93c151ea9a64af96f267b04b891ffc7273502b0c95f671d928b7	["*"]	2026-04-17 02:26:17	\N	2026-04-17 02:26:17	2026-04-17 02:26:17
53	App\\Models\\User	1	auth_token	f20a05ade60eb3fae6f33ec616da3af52707a2fd74c2f278637768560ec66e29	["*"]	2026-07-06 07:37:07	\N	2026-07-06 07:36:21	2026-07-06 07:37:07
31	App\\Models\\User	9	auth_token	39ab40f4b9c20fa4f1b436c0cd94352e065511d0b198295a48f8476008ccdb8d	["*"]	2026-04-17 23:42:31	\N	2026-04-17 23:42:27	2026-04-17 23:42:31
13	App\\Models\\User	1	auth_token	8b94748c588adea6ee431d15026ce8570d834c09e82ccb8473ae2cb7538fb6b4	["*"]	\N	\N	2026-04-17 06:18:26	2026-04-17 06:18:26
14	App\\Models\\User	1	auth_token	15967507bae983d14c7b80a5a3c84bab0a2ea8c7023fb6b43b51bb5c6d857bd4	["*"]	\N	\N	2026-04-17 06:23:12	2026-04-17 06:23:12
15	App\\Models\\User	1	auth_token	2a671d820317758982b0931f851e3796bf364cefdd48037f52777c3008980112	["*"]	2026-04-17 06:23:22	\N	2026-04-17 06:23:22	2026-04-17 06:23:22
16	App\\Models\\User	1	auth_token	c2682e5bd531f870482c198dd405cd10f54c8ddeefbb9b56ffb67275c64567d1	["*"]	2026-04-17 06:23:35	\N	2026-04-17 06:23:35	2026-04-17 06:23:35
24	App\\Models\\User	3	auth_token	c0ccde166de4291ac78ae585b392a3490af9fe3069acec046558b1ea0cca8849	["*"]	2026-04-17 11:02:32	\N	2026-04-17 10:53:43	2026-04-17 11:02:32
22	App\\Models\\User	7	auth_token	c2285f521647f27bca06b423b0901f29db031b041ac4b184862b5c775c0a9e4a	["*"]	2026-04-17 09:28:56	\N	2026-04-17 09:26:11	2026-04-17 09:28:56
25	App\\Models\\User	3	auth_token	6d8598bf8637a5d04bc9f0bfafa18227cb57e1e49cb54382e1e627cf18e6afbf	["*"]	2026-04-17 11:29:00	\N	2026-04-17 11:03:42	2026-04-17 11:29:00
10	App\\Models\\User	1	auth_token	7b211bb30d42eeeeb9324df95f8c3a1fd8240ee8b513796adacb4006c13d2ab4	["*"]	\N	\N	2026-04-17 02:49:48	2026-04-17 02:49:48
32	App\\Models\\User	9	auth_token	2c0b1697830ad23e655aa57a563f1c365f7e91e40ac23985ef0f824aab8a071a	["*"]	2026-04-17 23:48:50	\N	2026-04-17 23:45:49	2026-04-17 23:48:50
39	App\\Models\\User	1	auth_token	85c7abf0f0cd0d794574974932382f3dc390795baf901718dd2471d21ba34e11	["*"]	2026-04-27 05:43:09	\N	2026-04-27 05:40:49	2026-04-27 05:43:09
20	App\\Models\\User	3	auth_token	68e783a3e9f7be23c8758af22185e413eddcd5d0e30e42dd32374f9e9e16f809	["*"]	2026-04-17 09:11:06	\N	2026-04-17 09:08:30	2026-04-17 09:11:06
36	App\\Models\\User	11	auth_token	bbff8fbbe36f69cc1e6481bd8ed28cdc2926f9e9a6f67916aed88928255a1184	["*"]	2026-04-23 12:39:57	\N	2026-04-23 12:38:11	2026-04-23 12:39:57
40	App\\Models\\User	14	auth_token	8c30ef45a78163306bd9b3f5385feb282b68ec5419c4e4daaf16550332c4b62b	["*"]	\N	\N	2026-05-05 11:48:28	2026-05-05 11:48:28
46	App\\Models\\User	6	auth_token	0ea29216e701a5c2ca71250cb44577c25acff10deb6da1ea2a7b9d0b174960bd	["*"]	2026-05-27 22:40:54	\N	2026-05-27 22:19:28	2026-05-27 22:40:54
26	App\\Models\\User	3	auth_token	c1b962e80c624af060d54e35b1409936deb1fe554806aafd4cade5872b5124b3	["*"]	2026-04-17 17:02:11	\N	2026-04-17 13:11:52	2026-04-17 17:02:11
21	App\\Models\\User	6	auth_token	20b7d01ea33888612c15364758bd88bf3ca2abecb08b9b60ef5c21547a29baeb	["*"]	2026-04-17 15:39:43	\N	2026-04-17 09:12:48	2026-04-17 15:39:43
29	App\\Models\\User	3	auth_token	003ee6ff6e1c2fce84d0e6b49f4783fcb8d69e6996ae5477f4e6b9dce069f621	["*"]	2026-04-18 01:15:25	\N	2026-04-17 15:41:27	2026-04-18 01:15:25
34	App\\Models\\User	10	auth_token	a96db63cba8f6ae20503d790756826a556f54778af4f76b4d450f32e09a873de	["*"]	2026-04-18 03:10:16	\N	2026-04-18 03:05:24	2026-04-18 03:10:16
37	App\\Models\\User	12	auth_token	0bb5a61954d53d6d0535d9abc92313cfd09c6bfc5d9aa59049300b3cc7a252bc	["*"]	2026-04-25 06:30:24	\N	2026-04-25 06:28:51	2026-04-25 06:30:24
38	App\\Models\\User	13	auth_token	577504fcbd8e158c5213c72fb3ceb5fab8acf6e07d1c3540c9343491505e8385	["*"]	\N	\N	2026-04-27 05:40:42	2026-04-27 05:40:42
44	App\\Models\\User	6	auth_token	70c0a5f438a8310c5621f13fc55f472e04a6b865c9412af2d2e649472c91b01c	["*"]	\N	\N	2026-05-13 08:29:41	2026-05-13 08:29:41
35	App\\Models\\User	6	auth_token	35a9ffc1a8b8730ec039db7c3a3e15dc5cfabddb1573f19fbd1348a1d84388a6	["*"]	2026-04-19 00:48:24	\N	2026-04-18 04:16:20	2026-04-19 00:48:24
41	App\\Models\\User	15	auth_token	3ae613be911bf1322bd58556d7b8ff4df197a2e554442ee862fc0ad0667ce368	["*"]	2026-05-10 09:46:08	\N	2026-05-10 09:43:19	2026-05-10 09:46:08
42	App\\Models\\User	6	auth_token	a3fc37cc097a74f0e36084145201740de90f8584188fd2e96a994b157c3c274e	["*"]	2026-05-13 09:58:52	\N	2026-05-13 07:14:20	2026-05-13 09:58:52
50	App\\Models\\User	6	auth_token	4b8e7a22348db7ef7412006ae1409d5fea39a8d0f0bea47494e82466aa03e08d	["*"]	2026-07-03 03:37:47	\N	2026-07-03 03:37:42	2026-07-03 03:37:47
47	App\\Models\\User	1	auth_token	0fb55f617e5a35a63f81765c10ee3476024fbaa0da5872331325ffcbc9668926	["*"]	2026-06-19 14:27:56	\N	2026-06-19 14:27:49	2026-06-19 14:27:56
48	App\\Models\\User	16	auth_token	65be4271b74609eb2e2dcadc5628ea6b4b71b33169622458a651b88ccd730914	["*"]	\N	\N	2026-06-19 14:28:34	2026-06-19 14:28:34
51	App\\Models\\User	1	auth_token	d868af3eb0e6e77953f84fef7c8f186571ac60b94cd817cfc2ebdf9f9fcb9569	["*"]	\N	\N	2026-07-06 07:35:04	2026-07-06 07:35:04
52	App\\Models\\User	1	auth_token	8b3fccbdf345b6be501d413d161a79bca24a6bc08c31659c4312d1398a98c908	["*"]	\N	\N	2026-07-06 07:36:09	2026-07-06 07:36:09
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (id, user_id, title, content, published, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.purchases (id, user_id, listing_id, price_paid, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
WMv9CUHfjmN4b5pt9Qds8GQIp26RaMhYlNKnWSaa	\N	162.158.187.195	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiYm5xSGxsTjhmNFo3Yk5XRDNpVWxYNDdxcnhGTEY1ZEdOZUxkRDZ3RyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783485605
HJ2jUtDUliukDRG4XybP8NnCQOyuJ2ijlI9utc6F	\N	162.158.42.164	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiSG04ZWVjeUFPdHdjaUlWQXNvcnZnNEd6UjdpdDNpY1pSMDFMbnZ2aSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783502978
RcIidkVM1i7TVX8VartWP19DyXgzKLqvr3wfoQp8	\N	108.162.246.139	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzR1MndVZXRqTGJmZWJNVEY5UURDWTFhRTd1V0NhdzFBeVhnTzJYOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783505946
YAJ9Zc5fqYBKVI3B575DjRtWtFVBBWlEJ2ygxsOp	\N	172.71.150.175	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzJhYjNwUDVBY0lDQ3V1M3B5SG93N09uVkJpSmhEbWZpa3c5MHBYTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783516980
OW7fer1NEwOqvzXXJG7OUKZ8ra498ZGOw0mGSHu1	\N	172.69.135.112	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiREtTSHI2N21zQ3NROXpsQllwYmZnZVBMbHkzUU1HOFBkUVNralJqdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783519920
EXX6yQlyyQkK1p50B9GZxPCUqNYzqDNcFoxFk5Zk	\N	172.69.135.182	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiY1VXUG9pQlhWRDJpbGFUcjVkQWQyaGRBZ2pNczFoRFlYZVVLVXRNZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783530932
gDECu768MdtTXXU16qInNHm4UqJfV3l5KuiWytWD	\N	172.71.150.175	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiQm0wTG1GR2Z2VnVaSTF1RGdYVG9yekwxQm85YU1CVmJQODRWWWpXaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783531776
7K9GoyvzyUY8dTqyNbIUEcloilMHW5GvPKiLhyjM	\N	172.71.158.162	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiZjYwQU5CbEphTEtkRTRBQzVCcDFNQnE3V2NqQUZVc0hTWGVLTUVNTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783535039
Zd9VisgZOLDyzJHlFfv4lWrYnmxNNy5I8JpkRb0Q	\N	104.23.251.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiSjFqTHp3VXFRc1lmSFhvZ0YyMXlzazBGNTE2U25kclgwcE9PMktxRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783535168
VZZkR7r0vOpaNCn7UZZQxlf9KyeU8KHkkwJMEw8M	\N	172.70.207.115	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXF0elBiMWI2bjRJSXkzSHlGdXpCVDlpYnJ1MmlwR1hJUldUbjJwNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783551263
dxjzLe6OlDJ72DvUxCwSMy6H7tl3rq5anZd8x08p	\N	162.158.210.254	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	YTo0OntzOjY6Il90b2tlbiI7czo0MDoiREJvOWpCZWhMcU9jMHMyWEt3ZHZsR2x2QWdXSmRwMU9WejB0TE1mZCI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czoyNToiaHR0cHM6Ly9jbGF3bWFydC5jbi9hZG1pbiI7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjI1OiJodHRwczovL2NsYXdtYXJ0LmNuL2FkbWluIjtzOjU6InJvdXRlIjtzOjMwOiJmaWxhbWVudC5hZG1pbi5wYWdlcy5kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783551762
z8plu1ooPNZuuzKEIuwOB2RnL03vvpvDJ7e0In9D	\N	172.71.219.56	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiUHkwN1BoS3VEYTIyenJxZmJ3UzdpcnpIVExldTNiMTM0bTJkQkFyeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783478616
aUGI1afYK8Szem6iWhE7oYAyohhXtus1xGYtN9xK	\N	172.64.217.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnQ1YzY5cGEwOXY3RXRITEEwMXhJR29GT3JBN25HYnpQU1p5Y3FBWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783485605
zO3Gg0VnA0ND23NfEqCKy3MVK3EZmxpHkC6lGAoB	\N	104.22.72.65	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0x6djd6RVJTZmI4bXhvU0Y0S09Tc0NqQjB1aHh2VUl2SHN5QkE4MCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783502978
8VHHagWFnIwqRcDFjxDBuZDQClqm7dffdTbqg2OY	\N	172.71.151.157	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDRDVXdPbWZ6RTRkOEh2NUNGVEx6ZW9hMHlMNDNlWnhxam8yTVBqOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783505946
nrl7BkDszxHhFwuDjF4kBHcRIbHuVma2DgTUCEDf	\N	172.71.150.174	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiVDkyUnBEREVLdnBzQU9mWXJhZHZJMjBvaXVGUWd1ZGk3WXdrbGpPUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783516980
em8yrfeelbtRj96iIxB0g8GH8BFBgoodkCansIkb	\N	104.22.18.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiOEdqWTBuU3JrWkcxTHpjWHBrUEY3Z050QXZMVFhsQjJSY0kycUIwNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783519921
ErToIaZu5h4ATHVjcE3xP1h6iEH58PxgQav6cR0b	\N	162.158.186.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmY5dW9pNFVsQWtKUjc0VzdTZFB1WlNpaVlCUEtiS0tidTg5cFhlUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783530932
PBcmJrTmqvCR8W2V2i2J93DlqCXsmYTATwClL3PF	\N	172.68.22.251	Mozilla/5.0 (compatible; Querit-SearchBot/1.0; +https://www.querit.ai)	YTozOntzOjY6Il90b2tlbiI7czo0MDoiWE43cVkwOXdxMjl1UXFtTmZCQkdoblhYQTBWMzdPcE00b3NBa1NzUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783531777
DbuOU5sYfoUus6f0kaMpjIN2p3fcnHrIXf6KmpY4	\N	162.158.90.74	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiTk1iaVNITXpvMVZEbWQwVVBBaTJ0QkowMGRGYTFPMEFXSEhNQ2F6VCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783535039
nHtviJxUFuv0Y5N1Uq1DWGaqFaFMWtdP7Sw6mix8	\N	172.64.217.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiaG9BcDY1WVpSenBUNks3TkpuM0tDYjJLeXBXM2hGRDUzNFF5WXlSSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTY6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9wYWdlPTEmc29ydD1wb3B1bGFyIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783535168
MGinPBN2Ak9fGhBS1p9Cx1xAH3sxH7qBw0fJgyaj	\N	172.70.207.115	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoieU1UaXlVemRXOVlCRG80WFIzNzRSSXVnUmRWc0p0amM2SmFnZVhFbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783551263
uUXItnPUEtdrAC0IWFXnc6JpAmoFk7qY26zd5pN0	\N	162.158.210.18	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiTXpVN25ZRzdkUHlVQWFPTFdBQmR0Mk5zbkxhQXFvR1dxaXJodUlvaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHBzOi8vY2xhd21hcnQuY24vYWRtaW4vbG9naW4iO3M6NToicm91dGUiO3M6MjU6ImZpbGFtZW50LmFkbWluLmF1dGgubG9naW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783551764
gycXNGHQYsN78vVCLoqz7wU6hLR9kNJ221BkKv3t	\N	172.71.219.56	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	YTozOntzOjY6Il90b2tlbiI7czo0MDoiMWh1a3QzeU1JczRnWEhPMUZaNWNtT0NWTW9BREVyYXJlWG55Rk5ZQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6ODk6Imh0dHBzOi8vd3d3LmNsYXdtYXJ0LmNuL2FwaS9saXN0aW5ncz9jYXRlZ29yeT0lRTglQTElOEMlRTQlQjglOUElRTYlOTYlQjklRTYlQTElODgmcGFnZT0xIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19	1783478671
\.


--
-- Data for Name: sourcing_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sourcing_requests (id, name, contact, model, budget, note, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: store_bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_bookings (id, store_profile_id, status, customer_name, customer_phone, customer_note, booking_at, table_area, party_size, items, extra, created_at, updated_at) FROM stdin;
1	3	cancelled	liu	13899998888	\N	2026-04-18 12:12:00	\N	\N	[{"name":"\\u65b0\\u9c9c\\u9e21\\u86cb","qty":1,"unit":"\\u76d2(30\\u679a)","price":"12.00"}]	\N	2026-04-17 14:53:28	2026-04-17 16:03:50
\.


--
-- Data for Name: store_customer_interactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_customer_interactions (id, store_customer_id, store_profile_id, type, content, amount, interacted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: store_customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_customers (id, store_profile_id, name, phone, email, address, note, tags, total_spent, visit_count, last_contact_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: store_inventory_txns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_inventory_txns (id, store_profile_id, product_id, item_name, type, qty, unit, unit_price, total_amount, note, txn_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: store_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_logs (id, store_profile_id, category, content, logged_at, created_at, updated_at, amount, amount_type) FROM stdin;
1	10	operations	这两天销量不好，要跟店长反馈，看看是怎么回事，开个会	2026-04-18 11:10:16	2026-04-18 03:10:16	2026-04-18 03:10:16	\N	\N
\.


--
-- Data for Name: store_notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_notes (id, store_profile_id, type, title, content, valid_from, valid_until, is_active, metadata, created_at, updated_at, embedding) FROM stdin;
1	3	announcement	\N	欢迎光临我们的ai店铺	\N	\N	t	\N	2026-04-17 04:36:44	2026-04-17 04:36:44	\N
2	1	discount	五一假期全场九折	五一假期全场九折，5月1日至5月5日有效	2026-05-01 00:00:00	2026-05-05 00:00:00	t	\N	2026-04-17 06:23:35	2026-04-17 06:23:35	\N
3	3	discount	周末特惠	本周六日全场9折！白菜、豆腐、西红柿买三斤送半斤，欢迎光临🎉	2026-04-18 00:00:00	2026-04-19 00:00:00	t	\N	2026-04-17 09:10:18	2026-04-17 09:10:18	\N
4	3	discount	新客专享8折	首次下单新客户全场8折优惠，下单时备注「新客」即可享受折扣💰	2026-04-17 00:00:00	2026-04-30 00:00:00	t	\N	2026-04-17 09:10:18	2026-04-17 09:10:18	\N
5	3	event	五一节假日特供	五一劳动节期间（4月30日-5月2日）备有大量新鲜食材，猪五花、活草鱼现货充足，欢迎提前预订🐟	2026-04-30 00:00:00	2026-05-02 00:00:00	t	\N	2026-04-17 09:10:18	2026-04-17 09:10:18	\N
6	3	announcement	每日到货时间	每天早上8:00准时到货，新鲜食材当日售完为止，建议早点来哦🌅	\N	\N	t	\N	2026-04-17 09:10:18	2026-04-17 09:10:18	\N
7	3	inventory	鸡蛋特价促销	本周新鲜鸡蛋大量到货，原价¥15/盒，特价¥12/盒，限量100盒，先到先得🥚	2026-04-17 00:00:00	2026-04-23 00:00:00	t	\N	2026-04-17 09:10:18	2026-04-17 09:10:18	\N
8	6	discount	五一假期特惠	五一黄金周（4月30日-5月4日）标准大床房及豪华双床房享8.5折优惠，提前3天预订额外减50元🎉	2026-04-30 00:00:00	2026-05-04 00:00:00	t	\N	2026-04-17 09:14:44	2026-04-17 09:14:44	\N
9	6	discount	连住优惠	连住3晚及以上享9折，连住5晚及以上享8.5折，叠加会员折扣，最高可省200元/晚💰	\N	\N	t	\N	2026-04-17 09:14:44	2026-04-17 09:14:44	\N
10	6	announcement	免费接送机服务	入住行政套房或亲子家庭房的宾客，可享受免费机场接送服务，请提前24小时联系前台预约🚗	\N	\N	t	\N	2026-04-17 09:14:44	2026-04-17 09:14:44	\N
11	6	event	周末下午茶活动	每周六日14:00-17:00，大堂咖啡厅举办精品下午茶，人均68元，住店宾客9折优惠☕	2026-04-19 00:00:00	2026-12-31 00:00:00	t	\N	2026-04-17 09:14:44	2026-04-17 09:14:44	\N
12	6	inventory	暑期房源开放预订	2026年暑期（7月1日-8月31日）房源现已开放预订，早鸟价享7.5折，名额有限先订先得🌞	\N	\N	t	\N	2026-04-17 09:14:44	2026-04-17 09:14:44	\N
13	7	discount	工作日午市特惠	周一至周五午餐时段（10:30-14:00），点任意套餐享8.8折，堂食专享💼	2026-04-17 00:00:00	\N	t	\N	2026-04-17 09:27:57	2026-04-17 09:27:57	\N
14	7	discount	生日免单活动	当天生日的顾客凭证件出示，可免费获得招牌麻婆豆腐一份🎂，快带朋友来庆生！	\N	\N	t	\N	2026-04-17 09:27:57	2026-04-17 09:27:57	\N
15	7	event	五一美食节	五一期间（4.30-5.4）推出限定菜单，包含烤鱼、毛血旺等特色菜，每日限量供应，欢迎提前预订🎉	2026-04-30 00:00:00	2026-05-04 00:00:00	t	\N	2026-04-17 09:27:58	2026-04-17 09:27:58	\N
16	7	announcement	外卖配送说明	支持美团、饿了么外卖点单，3公里内30分钟送达，满68元免配送费🛵	\N	\N	t	\N	2026-04-17 09:27:58	2026-04-17 09:27:58	\N
17	7	discount	新客首单立减10元	首次到店消费满60元立减10元，扫码关注公众号即可领取优惠券，可与套餐优惠叠加❤️	\N	\N	t	\N	2026-04-17 09:27:58	2026-04-17 09:27:58	\N
18	9	discount	今日全场8折优惠	今天全场打折8折，欢迎光临！	2026-04-18 00:00:00	2026-04-18 00:00:00	t	\N	2026-04-17 23:46:24	2026-04-17 23:46:24	\N
19	1	discount	SandboxTestNote	Test announcement from sandbox	2026-01-01 00:00:00	2026-12-31 00:00:00	t	\N	2026-04-27 05:41:54	2026-04-27 05:41:54	\N
20	1	discount	五一假期全场九折	五一假期全场九折，5月1日至5月5日有效	2026-05-01 00:00:00	2026-05-05 00:00:00	t	\N	2026-06-19 14:27:56	2026-06-19 14:27:56	\N
21	1	discount	五一假期全场九折	五一假期全场九折，5月1日至5月5日有效	2026-05-01 00:00:00	2026-05-05 00:00:00	t	\N	2026-07-06 07:36:39	2026-07-06 07:36:39	\N
\.


--
-- Data for Name: store_photos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_photos (id, store_profile_id, url, caption, sort_order, created_at, updated_at, category) FROM stdin;
2	3	https://clawmart-1335097163.cos.ap-guangzhou.myqcloud.com/store-photos/qKFV7hUVyQm3dYK6PjvXvusyn6JfUt0ci5hz2t64.png	\N	0	2026-04-17 04:32:18	2026-04-17 04:42:48	environment
1	3	https://clawmart-1335097163.cos.ap-guangzhou.myqcloud.com/store-photos/tnmRadXnw0qA9vMhpC4pPwD8Am2RLj89OeAzWauo.png	\N	1	2026-04-17 04:16:50	2026-04-17 04:42:48	environment
\.


--
-- Data for Name: store_product_photos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_product_photos (id, store_product_id, url, caption, sort_order, is_primary, created_at, updated_at) FROM stdin;
1	2	https://clawmart-1335097163.cos.ap-guangzhou.myqcloud.com/product-photos/KyjTrf2DvIUSAN1nvvJqcQxhnDPhK0fe0btLYidc.png	\N	0	t	2026-04-17 04:14:49	2026-04-17 04:14:49
2	3	https://clawmart-1335097163.cos.ap-guangzhou.myqcloud.com/product-photos/VIIuw5gzZLHEkBlBdXvDOclaZshknyzVBD8XIILZ.png	\N	0	t	2026-04-17 04:36:07	2026-04-17 04:36:07
\.


--
-- Data for Name: store_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_products (id, store_profile_id, name, price, stock, unit, description, image_url, is_active, sort_order, metadata, created_at, updated_at) FROM stdin;
1	2	胡萝卜	9.90	\N	\N	\N	\N	t	0	\N	2026-04-17 02:31:47	2026-04-17 02:31:47
2	3	白菜	3.00	\N	\N	\N	https://clawmart-1335097163.cos.ap-guangzhou.myqcloud.com/product-photos/KyjTrf2DvIUSAN1nvvJqcQxhnDPhK0fe0btLYidc.png	t	0	\N	2026-04-17 04:14:05	2026-04-17 04:14:49
4	1	有机苹果	25.00	300	斤	山东烟台产，无农药，直接批发价	\N	t	0	\N	2026-04-17 06:23:22	2026-04-17 06:23:35
5	5	健身卡年卡	1999.00	\N	\N	\N	\N	t	0	\N	2026-04-17 07:55:44	2026-04-17 07:55:44
6	5	健身卡月卡	200.00	\N	\N	\N	\N	t	0	\N	2026-04-17 07:55:53	2026-04-17 07:55:53
7	3	猪五花肉	28.50	100	斤	新鲜本地猪五花，肥瘦相间，适合红烧或烧烤	\N	t	0	\N	2026-04-17 09:08:44	2026-04-17 09:08:44
9	3	新鲜鸡蛋	12.00	500	盒(30枚)	散养土鸡蛋，蛋黄饱满，营养丰富	\N	t	0	\N	2026-04-17 09:08:44	2026-04-17 09:08:44
10	3	豆腐	3.50	150	块	当日现做嫩豆腐，口感细腻，适合各种烹饪方式	\N	t	0	\N	2026-04-17 09:08:44	2026-04-17 09:08:44
11	3	活草鱼	15.00	80	斤	本地活水养殖草鱼，现杀现卖，肉质鲜嫩	\N	t	0	\N	2026-04-17 09:08:44	2026-04-17 09:08:44
12	6	标准大床房	388.00	20	间/晚	25㎡，180cm大床，独立卫浴，城市景观，含早餐，免费WiFi	\N	t	0	\N	2026-04-17 09:14:27	2026-04-17 09:14:27
13	6	豪华双床房	488.00	15	间/晚	32㎡，两张120cm床，适合亲子或双人出行，含早餐，落地窗城景	\N	t	0	\N	2026-04-17 09:14:27	2026-04-17 09:14:27
14	6	行政套房	888.00	8	间/晚	58㎡，独立客厅卧室，行政酒廊下午茶权益，含双早，全景落地窗	\N	t	0	\N	2026-04-17 09:14:27	2026-04-17 09:14:27
15	6	亲子家庭房	688.00	6	间/晚	48㎡，亲子主题装修，配备儿童床及玩具，含亲子双早，近游泳池	\N	t	0	\N	2026-04-17 09:14:27	2026-04-17 09:14:27
16	6	商务会议室（半天）	800.00	3	场次	可容纳20人，配备投影仪、白板、音响设备，含茶歇，支持预约	\N	t	0	\N	2026-04-17 09:14:27	2026-04-17 09:14:27
17	6	健身房 + 游泳池 日票	88.00	50	张	畅享全天健身房及室内恒温游泳池，提供毛巾、储物柜服务	\N	t	0	\N	2026-04-17 09:14:27	2026-04-17 09:14:27
18	7	招牌麻婆豆腐	28.00	999	份	正宗川味麻婆豆腐，麻辣鲜香，豆腐嫩滑，配白米饭绝配	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
19	7	夫妻肺片	38.00	999	份	精选牛肚、牛舌、牛肉，红油拌制，口感丰富，麻辣鲜美	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
20	7	水煮鱼（鲈鱼）	68.00	50	份	选用新鲜鲈鱼，鱼片嫩滑，汤底麻辣浓郁，配豆芽粉丝	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
21	7	回锅肉	42.00	999	份	精选带皮五花肉，配青椒豆豉，香气扑鼻，下饭神器	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
22	7	蒜泥白肉	36.00	999	份	薄切白肉配蒜泥红油，口感爽滑，咸鲜微辣，凉菜首选	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
23	7	担担面	18.00	999	碗	传统担担面，芝麻花生酱底，配肉末辣椒，香辣浓郁	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
24	7	川味套餐（2人份）	98.00	30	套	含主菜2道+汤1份+米饭2碗，每日限量30套，性价比超高	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
25	7	包厢预订（10人以上）	0.00	5	桌	设有独立包厢3间，可容纳10-20人，需提前电话预订，最低消费300元	\N	t	0	\N	2026-04-17 09:27:32	2026-04-17 09:27:32
3	3	牛肉	23.00	0	\N	\N	https://clawmart-1335097163.cos.ap-guangzhou.myqcloud.com/product-photos/VIIuw5gzZLHEkBlBdXvDOclaZshknyzVBD8XIILZ.png	t	0	\N	2026-04-17 04:35:31	2026-04-17 17:01:55
26	3	鸡蛋	0.00	2	\N	\N	\N	t	0	\N	2026-04-17 16:52:51	2026-04-17 17:02:03
27	9	苹果	5.00	100	斤	\N	\N	t	0	\N	2026-04-17 23:48:34	2026-04-17 23:48:34
28	10	大床房	300.00	15	间	大床房，共15间，价格300-500元/晚	\N	t	0	\N	2026-04-18 03:07:25	2026-04-18 03:07:25
29	10	双床房	300.00	10	间	双床房，共10间，价格300-500元/晚	\N	t	0	\N	2026-04-18 03:07:29	2026-04-18 03:07:29
30	11	香蕉	9.00	\N	斤	\N	\N	t	0	\N	2026-04-23 12:39:43	2026-04-23 12:39:43
31	1	SandboxTestProduct	9.99	100	个	Sandbox test product	\N	t	0	\N	2026-04-27 05:41:26	2026-04-27 05:41:26
32	1	有机苹果	18.80	500	斤	山东烟台产，无农药，直接批发价	\N	t	0	\N	2026-06-19 14:27:52	2026-06-19 14:27:52
33	1	有机苹果	25.00	300	斤	山东烟台产，无农药，直接批发价	\N	t	0	\N	2026-07-06 07:36:23	2026-07-06 07:37:07
\.


--
-- Data for Name: store_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_profiles (id, user_id, shop_name, shop_description, logo_url, contact_phone, contact_email, address, business_hours, tags, is_public, slug, created_at, updated_at, store_type) FROM stdin;
2	2	Mike的店铺	\N	\N	\N	\N	\N	\N	\N	t	mike-2	2026-04-17 02:27:33	2026-04-17 02:27:33	retail
4	4	测试小铺	\N	\N	\N	\N	\N	\N	\N	t	testshop88-4	2026-04-17 06:31:13	2026-04-17 06:31:13	retail
5	5	tom的店铺	这里是您的私人健身场所	\N	\N	\N	\N	\N	[]	t	tom-5	2026-04-17 07:55:04	2026-04-17 07:56:16	retail
6	6	云海精品酒店	\N	\N	400-888-6688	\N	市中心云海大道88号	前台24小时服务	["\\u7cbe\\u54c1\\u9152\\u5e97","\\u5e02\\u4e2d\\u5fc3","\\u5546\\u52a1\\u51fa\\u884c","\\u4eb2\\u5b50\\u53cb\\u597d"]	t	jack-6	2026-04-17 09:12:56	2026-04-17 09:13:21	service
7	7	老街记川菜馆	\N	\N	028-8866-6688	\N	老街美食巷18号	10:30-14:00  17:00-22:00	["\\u5ddd\\u83dc","\\u9ebb\\u8fa3","\\u5bb6\\u5e38\\u83dc","\\u5802\\u98df\\u5916\\u5356"]	t	harry-7	2026-04-17 09:26:26	2026-04-17 09:26:41	restaurant
3	3	祥禧生鲜店	经营当地特色小吃，支持到店或者外卖	\N	62645180	xiaomi@xingke888.com	D 5F HONG TAI BUILDIND	周一到周日8:00—23:00	[]	t	david-3	2026-04-17 03:05:58	2026-04-17 10:19:19	retail
8	8	wang的店铺	\N	\N	\N	\N	\N	\N	\N	t	wang-8	2026-04-17 10:52:22	2026-04-17 10:52:22	retail
9	9	mark的店铺	\N	\N	\N	\N	\N	\N	\N	t	mark-9	2026-04-17 23:42:31	2026-04-17 23:42:31	retail
10	10	汉庭深圳湾口岸店	位于深圳湾口岸东滨路十八号，共25间客房，含15间大床房、10间双床房，价格300-500元/晚。免费停车、免费洗衣，会员享免费早餐。商务出行首选，温馨舒适。	\N	62645180	\N	深圳湾口岸东滨路十八号	\N	["\\u514d\\u8d39\\u505c\\u8f66","\\u514d\\u8d39\\u6d17\\u8863","\\u4f1a\\u5458\\u9001\\u65e9\\u9910","\\u6df1\\u5733\\u6e7e\\u53e3\\u5cb8","\\u5546\\u52a1\\u51fa\\u884c"]	t	rose-10	2026-04-18 03:05:28	2026-04-18 03:09:28	retail
11	11	hunter的店铺	\N	\N	\N	\N	\N	\N	\N	t	hunter-11	2026-04-23 12:38:54	2026-04-23 12:38:54	retail
1	1	SandboxTestShop	这是一个演示店铺，展示 CLAW MART 店铺功能。	\N	13800000000	\N	Test Address	09:00-21:00	["test"]	t	demo-store	2026-04-17 02:08:19	2026-04-27 05:41:13	retail
12	15	Arrow的店铺	\N	\N	\N	\N	\N	\N	\N	t	arrow-15	2026-05-10 09:43:26	2026-05-10 09:43:26	retail
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at, avatar_url, website_url, bio, is_seller, username) FROM stdin;
2	Mike	dev2@xingke888.com	\N	$2y$12$Kgq/GcW4kWiHJDnX/np0U.OpqdUWwvMeMTN8677XtV08vcHfQrn.y	\N	2026-04-17 02:27:25	2026-04-17 02:27:33	\N	\N	\N	t	\N
1	Demo User	demo@example.com	2026-04-17 02:08:19	$2y$12$A3pN3kqmvbQoh9O6hAMl6.8gftDJiHk6xjGdKNl5QTOZg.Rmmkiei	\N	2026-04-17 02:08:19	2026-04-17 02:47:45	\N	\N	\N	t	demo
3	david	\N	\N	$2y$12$8G8yT9s./cldygrlwZwSaOwxpQBDuF4YTaoHlkyhrSkoM7LNNlMKS	\N	2026-04-17 03:05:51	2026-04-17 03:05:58	\N	\N	\N	t	david
4	testshop88	\N	\N	$2y$12$SQZhpv2tf8GHbB80qSgyC.VcDPnIatGsw3r78X662ZAzAFU9zopM6	\N	2026-04-17 06:31:05	2026-04-17 06:31:13	\N	\N	\N	t	testshop88
5	tom	\N	\N	$2y$12$QkV1bDGI2szQkDrHYxXTIe8Vy8MWrjBhvr5uPv/kzH3eqKmUqqNMu	\N	2026-04-17 07:54:56	2026-04-17 07:55:04	\N	\N	\N	t	tom
6	jack	\N	\N	$2y$12$JBgFtTl.loeytie/hA8iTeK/R201ovqYEoI8SgurSjbYhTnd5T3u6	\N	2026-04-17 09:12:48	2026-04-17 09:12:56	\N	\N	\N	t	jack
7	harry	\N	\N	$2y$12$7KI0LYmNZRXdPuFVBURHiuqUY6l1KSRk1kc3HUp6l.BubhRhZEp.a	\N	2026-04-17 09:26:11	2026-04-17 09:26:26	\N	\N	\N	t	harry
8	wang	\N	\N	$2y$12$ALKh.NNglEymvKN9SvKbiekwEp3sGxYW/NNjtlc5U0zq4lvOj3pke	\N	2026-04-17 10:51:59	2026-04-17 10:52:22	\N	\N	\N	t	wang
9	mark	\N	\N	$2y$12$30oCvi0vqLgt5GEmU7m8fufnMfY.LSg8IUrHyC68YZOuic95ji9Z2	\N	2026-04-17 23:42:27	2026-04-17 23:42:31	\N	\N	\N	t	mark
10	rose	\N	\N	$2y$12$r6wqRDDaqB1kkQr7ojGybOUFfkqSXEIt/N1KvVOXX55Al1Ta0FukW	\N	2026-04-18 03:05:24	2026-04-18 03:05:28	\N	\N	\N	t	rose
11	hunter	hunterzhao@qq.com	\N	$2y$12$oJJPJhVQ9A1..YmENmD.xe3t0osM7vBNH.tSvsaNRdC0WoCI9poA6	\N	2026-04-23 12:38:11	2026-04-23 12:38:54	\N	\N	\N	t	hunter
12	zz	rockethigh@qq.com	\N	$2y$12$NQFQqeqpMwwjvJMt6UYpBOPM/16cnZD.6aBdPtcuY6xY7gPDSw4iq	\N	2026-04-25 06:28:51	2026-04-25 06:28:51	\N	\N	\N	f	zz
13	sandbox_test_user_2026	\N	\N	$2y$12$QPOoeomeCDUi9ZZ1qAlgn.g2TW7qQXIk36Rw2LMYty97pXfVPqk9u	\N	2026-04-27 05:40:42	2026-04-27 05:40:42	\N	\N	\N	f	sandbox_test_user_2026
14	fada	346796442@qq.com	\N	$2y$12$FLD9YvYKodM3cjFffMAuneYqKsY9shT0uX2GQtvhZ3p7EU4o/9foK	\N	2026-05-05 11:48:28	2026-05-05 11:48:28	\N	\N	\N	f	fada
15	Arrow	\N	\N	$2y$12$6C3ChFBhBj3pUKmXW8tb2u/nzwDLSx0Jpa.pjoUdRWzfgF4.pqfoC	\N	2026-05-10 09:43:19	2026-05-10 09:43:26	\N	\N	\N	t	Arrow
16	CHOSEN_USERNAME	\N	\N	$2y$12$n8J971bjMd6B9d.4kxULC.RpkgqgUx8n2PvGbC4vYnHC/56rhf8my	\N	2026-06-19 14:28:34	2026-06-19 14:28:34	\N	\N	\N	f	CHOSEN_USERNAME
\.


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: industry_solutions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.industry_solutions_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listings_id_seq', 89, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 29, true);


--
-- Name: payment_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_orders_id_seq', 1, false);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 53, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- Name: purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.purchases_id_seq', 1, false);


--
-- Name: sourcing_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sourcing_requests_id_seq', 1, false);


--
-- Name: store_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_bookings_id_seq', 1, true);


--
-- Name: store_customer_interactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_customer_interactions_id_seq', 1, false);


--
-- Name: store_customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_customers_id_seq', 1, false);


--
-- Name: store_inventory_txns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_inventory_txns_id_seq', 1, false);


--
-- Name: store_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_logs_id_seq', 1, true);


--
-- Name: store_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_notes_id_seq', 21, true);


--
-- Name: store_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_photos_id_seq', 2, true);


--
-- Name: store_product_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_product_photos_id_seq', 2, true);


--
-- Name: store_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_products_id_seq', 33, true);


--
-- Name: store_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_profiles_id_seq', 12, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: industry_solutions industry_solutions_industry_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industry_solutions
    ADD CONSTRAINT industry_solutions_industry_key_unique UNIQUE (industry_key);


--
-- Name: industry_solutions industry_solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industry_solutions
    ADD CONSTRAINT industry_solutions_pkey PRIMARY KEY (id);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: listings listings_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_slug_unique UNIQUE (slug);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: payment_orders payment_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_orders
    ADD CONSTRAINT payment_orders_pkey PRIMARY KEY (id);


--
-- Name: payment_orders payment_orders_stripe_session_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_orders
    ADD CONSTRAINT payment_orders_stripe_session_id_unique UNIQUE (stripe_session_id);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: purchases purchases_user_id_listing_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_user_id_listing_id_unique UNIQUE (user_id, listing_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sourcing_requests sourcing_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sourcing_requests
    ADD CONSTRAINT sourcing_requests_pkey PRIMARY KEY (id);


--
-- Name: store_bookings store_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_bookings
    ADD CONSTRAINT store_bookings_pkey PRIMARY KEY (id);


--
-- Name: store_customer_interactions store_customer_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_customer_interactions
    ADD CONSTRAINT store_customer_interactions_pkey PRIMARY KEY (id);


--
-- Name: store_customers store_customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_customers
    ADD CONSTRAINT store_customers_pkey PRIMARY KEY (id);


--
-- Name: store_inventory_txns store_inventory_txns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_inventory_txns
    ADD CONSTRAINT store_inventory_txns_pkey PRIMARY KEY (id);


--
-- Name: store_logs store_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_logs
    ADD CONSTRAINT store_logs_pkey PRIMARY KEY (id);


--
-- Name: store_notes store_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_notes
    ADD CONSTRAINT store_notes_pkey PRIMARY KEY (id);


--
-- Name: store_photos store_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_photos
    ADD CONSTRAINT store_photos_pkey PRIMARY KEY (id);


--
-- Name: store_product_photos store_product_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_product_photos
    ADD CONSTRAINT store_product_photos_pkey PRIMARY KEY (id);


--
-- Name: store_products store_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_products
    ADD CONSTRAINT store_products_pkey PRIMARY KEY (id);


--
-- Name: store_profiles store_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_profiles
    ADD CONSTRAINT store_profiles_pkey PRIMARY KEY (id);


--
-- Name: store_profiles store_profiles_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_profiles
    ADD CONSTRAINT store_profiles_slug_unique UNIQUE (slug);


--
-- Name: store_profiles store_profiles_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_profiles
    ADD CONSTRAINT store_profiles_user_id_unique UNIQUE (user_id);


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
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: store_bookings_booking_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX store_bookings_booking_at_index ON public.store_bookings USING btree (booking_at);


--
-- Name: store_bookings_store_profile_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX store_bookings_store_profile_id_status_index ON public.store_bookings USING btree (store_profile_id, status);


--
-- Name: industry_solutions industry_solutions_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industry_solutions
    ADD CONSTRAINT industry_solutions_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE SET NULL;


--
-- Name: listings listings_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payment_orders payment_orders_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_orders
    ADD CONSTRAINT payment_orders_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: payment_orders payment_orders_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_orders
    ADD CONSTRAINT payment_orders_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: purchases purchases_listing_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_listing_id_foreign FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: purchases purchases_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: store_bookings store_bookings_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_bookings
    ADD CONSTRAINT store_bookings_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_customer_interactions store_customer_interactions_store_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_customer_interactions
    ADD CONSTRAINT store_customer_interactions_store_customer_id_foreign FOREIGN KEY (store_customer_id) REFERENCES public.store_customers(id) ON DELETE CASCADE;


--
-- Name: store_customer_interactions store_customer_interactions_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_customer_interactions
    ADD CONSTRAINT store_customer_interactions_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_customers store_customers_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_customers
    ADD CONSTRAINT store_customers_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_inventory_txns store_inventory_txns_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_inventory_txns
    ADD CONSTRAINT store_inventory_txns_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.store_products(id) ON DELETE SET NULL;


--
-- Name: store_inventory_txns store_inventory_txns_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_inventory_txns
    ADD CONSTRAINT store_inventory_txns_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_logs store_logs_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_logs
    ADD CONSTRAINT store_logs_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_notes store_notes_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_notes
    ADD CONSTRAINT store_notes_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_photos store_photos_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_photos
    ADD CONSTRAINT store_photos_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_product_photos store_product_photos_store_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_product_photos
    ADD CONSTRAINT store_product_photos_store_product_id_foreign FOREIGN KEY (store_product_id) REFERENCES public.store_products(id) ON DELETE CASCADE;


--
-- Name: store_products store_products_store_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_products
    ADD CONSTRAINT store_products_store_profile_id_foreign FOREIGN KEY (store_profile_id) REFERENCES public.store_profiles(id) ON DELETE CASCADE;


--
-- Name: store_profiles store_profiles_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_profiles
    ADD CONSTRAINT store_profiles_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict k65pSidZhBNrjyhk1j3pXHYECHD2zgG1YEFA6RclwugTwfntm34G7skBLCN85fy

