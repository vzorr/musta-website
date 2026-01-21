--
-- PostgreSQL database dump
--

\restrict 3avLLKpeKzyW4zkyecf3NBUEeNlsIFwChHIS1dljMKEM8iFM8HmBLcAC9Jfvreg

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

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
-- Name: language_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.language_type AS ENUM (
    'sq',
    'en'
);


ALTER TYPE public.language_type OWNER TO postgres;

--
-- Name: status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status_type AS ENUM (
    'pending',
    'processed',
    'resolved',
    'approved',
    'rejected',
    'active',
    'inactive'
);


ALTER TYPE public.status_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name_en character varying(100) NOT NULL,
    name_sq character varying(100) NOT NULL,
    description_en text,
    description_sq text,
    icon character varying(100),
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20) NOT NULL,
    subject character varying(200) NOT NULL,
    message text NOT NULL,
    language public.language_type DEFAULT 'sq'::public.language_type,
    ip_address character varying(45),
    user_agent text,
    status public.status_type DEFAULT 'pending'::public.status_type,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    resolved_at timestamp with time zone,
    resolved_by character varying(100),
    notes text
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: contact_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_submissions_id_seq OWNER TO postgres;

--
-- Name: contact_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_submissions_id_seq OWNED BY public.contact_submissions.id;


--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_logs (
    id integer NOT NULL,
    recipient_email character varying(150) NOT NULL,
    email_type character varying(50) NOT NULL,
    subject character varying(200),
    status character varying(20) DEFAULT 'pending'::character varying,
    sent_at timestamp with time zone,
    error_message text,
    reference_id integer,
    reference_type character varying(50),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.email_logs OWNER TO postgres;

--
-- Name: email_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_logs_id_seq OWNER TO postgres;

--
-- Name: email_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_logs_id_seq OWNED BY public.email_logs.id;


--
-- Name: gdpr_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gdpr_requests (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    request_type character varying(20) NOT NULL,
    details text,
    language public.language_type DEFAULT 'sq'::public.language_type,
    ip_address character varying(45),
    status public.status_type DEFAULT 'pending'::public.status_type,
    processed_at timestamp with time zone,
    processed_by character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT gdpr_requests_request_type_check CHECK (((request_type)::text = ANY ((ARRAY['access'::character varying, 'export'::character varying, 'delete'::character varying, 'rectify'::character varying])::text[])))
);


ALTER TABLE public.gdpr_requests OWNER TO postgres;

--
-- Name: gdpr_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gdpr_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gdpr_requests_id_seq OWNER TO postgres;

--
-- Name: gdpr_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gdpr_requests_id_seq OWNED BY public.gdpr_requests.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name_en character varying(100) NOT NULL,
    name_sq character varying(100) NOT NULL,
    region_en character varying(100),
    region_sq character varying(100),
    postal_code character varying(20),
    latitude numeric(10,8),
    longitude numeric(11,8),
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: pending_contacts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.pending_contacts AS
 SELECT id,
    name,
    email,
    phone,
    subject,
    message,
    language,
    created_at
   FROM public.contact_submissions
  WHERE (status = 'pending'::public.status_type)
  ORDER BY created_at DESC;


ALTER VIEW public.pending_contacts OWNER TO postgres;

--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    recommender_name character varying(100) NOT NULL,
    recommender_email character varying(150),
    recommender_phone character varying(20) NOT NULL,
    usta_name character varying(100),
    usta_email character varying(150),
    usta_phone character varying(20),
    category_id integer,
    location_id integer,
    language public.language_type DEFAULT 'sq'::public.language_type,
    is_recommendation boolean DEFAULT false,
    ip_address character varying(45),
    user_agent text,
    status public.status_type DEFAULT 'pending'::public.status_type,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp with time zone,
    approved_by character varying(100),
    rejection_reason text,
    notes text,
    source character varying(50) DEFAULT 'website'::character varying,
    referral_code character varying(20)
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: pending_recommendations_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.pending_recommendations_view AS
 SELECT r.id,
    r.recommender_name,
    r.recommender_email,
    r.recommender_phone,
    r.usta_name,
    r.usta_phone,
    c.code AS category_code,
    c.name_en AS category_name_en,
    c.name_sq AS category_name_sq,
    l.code AS location_code,
    l.name_en AS location_name_en,
    l.name_sq AS location_name_sq,
    r.is_recommendation,
    r.created_at
   FROM ((public.recommendations r
     LEFT JOIN public.categories c ON ((r.category_id = c.id)))
     LEFT JOIN public.locations l ON ((r.location_id = l.id)))
  WHERE (r.status = 'pending'::public.status_type)
  ORDER BY r.created_at DESC;


ALTER VIEW public.pending_recommendations_view OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recommendations_id_seq OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20) NOT NULL,
    category_id integer,
    location_id integer,
    language public.language_type DEFAULT 'sq'::public.language_type,
    gdpr_consent boolean DEFAULT false,
    marketing_consent boolean DEFAULT false,
    ip_address character varying(45),
    user_agent text,
    status public.status_type DEFAULT 'pending'::public.status_type,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp with time zone,
    approved_by character varying(100),
    notes text
);


ALTER TABLE public.registrations OWNER TO postgres;

--
-- Name: registration_statistics; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.registration_statistics AS
 SELECT count(*) AS total_registrations,
    count(
        CASE
            WHEN (status = 'approved'::public.status_type) THEN 1
            ELSE NULL::integer
        END) AS approved_count,
    count(
        CASE
            WHEN (status = 'rejected'::public.status_type) THEN 1
            ELSE NULL::integer
        END) AS rejected_count,
    count(
        CASE
            WHEN (status = 'pending'::public.status_type) THEN 1
            ELSE NULL::integer
        END) AS pending_count,
    count(
        CASE
            WHEN (gdpr_consent = true) THEN 1
            ELSE NULL::integer
        END) AS gdpr_consent_count,
    count(
        CASE
            WHEN (marketing_consent = true) THEN 1
            ELSE NULL::integer
        END) AS marketing_consent_count
   FROM public.registrations;


ALTER VIEW public.registration_statistics OWNER TO postgres;

--
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrations_id_seq OWNER TO postgres;

--
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    password_hash character varying(255),
    category_id integer,
    location_id integer,
    preferred_language public.language_type DEFAULT 'sq'::public.language_type,
    is_usta boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    verification_token character varying(255),
    reset_token character varying(255),
    reset_token_expires timestamp with time zone,
    status public.status_type DEFAULT 'pending'::public.status_type,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    last_login_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: waitlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waitlist (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20) NOT NULL,
    category_id integer,
    location_id integer,
    language public.language_type DEFAULT 'sq'::public.language_type,
    gdpr_consent boolean DEFAULT false,
    marketing_consent boolean DEFAULT false,
    ip_address character varying(45),
    user_agent text,
    status public.status_type DEFAULT 'pending'::public.status_type,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp with time zone,
    approved_by character varying(100),
    notes text
);


ALTER TABLE public.waitlist OWNER TO postgres;

--
-- Name: waitlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waitlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.waitlist_id_seq OWNER TO postgres;

--
-- Name: waitlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waitlist_id_seq OWNED BY public.waitlist.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: contact_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions ALTER COLUMN id SET DEFAULT nextval('public.contact_submissions_id_seq'::regclass);


--
-- Name: email_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_logs ALTER COLUMN id SET DEFAULT nextval('public.email_logs_id_seq'::regclass);


--
-- Name: gdpr_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gdpr_requests ALTER COLUMN id SET DEFAULT nextval('public.gdpr_requests_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: waitlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist ALTER COLUMN id SET DEFAULT nextval('public.waitlist_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, code, name_en, name_sq, description_en, description_sq, icon, display_order, is_active, created_at, updated_at) FROM stdin;
1	plumber	Plumber	Hidraulik	Plumbing and water system services	Shërbime hidraulike dhe sistemesh uji	\N	1	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
2	electrician	Electrician	Elektricist	Electrical installation and repair services	Shërbime instalimi dhe riparimi elektrik	\N	2	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
3	painter	Painter	Bojaxhi	Painting and decoration services	Shërbime bojatisje dhe dekorimi	\N	3	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
4	carpenter	Carpenter	Marangoz	Woodworking and carpentry services	Shërbime druri dhe marangozi	\N	4	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
5	tiler	Tiler	Pllakështrues	Tile installation and repair	Instalim dhe riparim pllakash	\N	5	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
6	mason	Mason	Murator	Masonry and construction services	Shërbime muratorie dhe ndërtimi	\N	6	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
7	woodworker	Woodworker	Zdrukthëtar	Wood crafting and furniture services	Shërbime druri dhe mobilierie	\N	7	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
8	cleaner	Cleaner	Pastrues	Cleaning and maintenance services	Shërbime pastrimi dhe mirëmbajtjeje	\N	8	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
9	gardener	Gardener	Kopshtar	Gardening and landscaping services	Shërbime kopshtarie dhe peizazhi	\N	9	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
10	other	Other	Tjetër	Other professional services	Shërbime të tjera profesionale	\N	99	t	2025-09-12 15:18:28.090128+02	2025-09-12 15:18:28.090128+02
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, name, email, phone, subject, message, language, ip_address, user_agent, status, created_at, updated_at, resolved_at, resolved_by, notes) FROM stdin;
1	Muhammad aneeb iqbal khan	contactaneebiq@gmail.com	03095008966	Inspection Report	hey hisdfsdfsdfs	en	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-16 22:39:18.763688+02	2025-09-16 22:39:18.763688+02	\N	\N	\N
2	Igli Faslija	ifaslija@gmail.com	0696621666	eweds	dsffsdfsdfsdfsdfsdfsdf	en	141.98.142.239	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-17 20:44:12.315096+02	2025-09-17 20:44:12.315096+02	\N	\N	\N
3	Igli Faslija	ifaslija@gmail.com	0696621666	Gghjkggt	67777jbnbgffuknbf	en	104.28.251.13	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	pending	2025-09-18 08:01:48.187767+02	2025-09-18 08:01:48.187767+02	\N	\N	\N
4	Nabeel	ab@gmail.com	923083133970	test	fdafdsafsdafasd	en	139.135.49.47	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-12 09:51:17.327977+01	2025-11-12 09:51:17.327977+01	\N	\N	\N
5	gdfdfgdf	abc@xyz.com	65756756765	rfgdfgfdg	ghsdhkfgksdgfksdhkfgsdkgsdkj	en	103.244.176.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	pending	2025-11-12 16:08:50.062299+01	2025-11-12 16:08:50.062299+01	\N	\N	\N
6	fafdfadsafdsf	df@gmail.com	923083133970	test	fdasfdasfadsfdasf	en	223.123.0.105	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-13 07:30:11.606235+01	2025-11-13 07:30:11.606235+01	\N	\N	\N
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_logs (id, recipient_email, email_type, subject, status, sent_at, error_message, reference_id, reference_type, created_at) FROM stdin;
\.


--
-- Data for Name: gdpr_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gdpr_requests (id, email, request_type, details, language, ip_address, status, processed_at, processed_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, code, name_en, name_sq, region_en, region_sq, postal_code, latitude, longitude, display_order, is_active, created_at, updated_at) FROM stdin;
1	tirana	Tirana	Tiranë	Central Albania	Shqipëria Qendrore	1001	\N	\N	1	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
2	durres	Durres	Durrës	Central Albania	Shqipëria Qendrore	2001	\N	\N	2	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
3	vlore	Vlore	Vlorë	Southern Albania	Shqipëria Jugore	9401	\N	\N	3	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
4	shkoder	Shkoder	Shkodër	Northern Albania	Shqipëria Veriore	4001	\N	\N	4	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
5	elbasan	Elbasan	Elbasan	Central Albania	Shqipëria Qendrore	3001	\N	\N	5	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
6	korce	Korce	Korçë	Southeastern Albania	Shqipëria Juglindore	7001	\N	\N	6	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
7	fier	Fier	Fier	Southwestern Albania	Shqipëria Jugperëndimore	9301	\N	\N	7	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
8	berat	Berat	Berat	Central Albania	Shqipëria Qendrore	5001	\N	\N	8	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
9	lushnje	Lushnje	Lushnjë	Central Albania	Shqipëria Qendrore	9001	\N	\N	9	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
10	pogradec	Pogradec	Pogradec	Southeastern Albania	Shqipëria Juglindore	7301	\N	\N	10	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
11	gjirokaster	Gjirokaster	Gjirokastër	Southern Albania	Shqipëria Jugore	6001	\N	\N	11	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
12	sarande	Sarande	Sarandë	Southern Albania	Shqipëria Jugore	9701	\N	\N	12	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
13	lezhe	Lezhe	Lezhë	Northwestern Albania	Shqipëria Veriperëndimore	4501	\N	\N	13	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
14	kukes	Kukes	Kukës	Northeastern Albania	Shqipëria Verilindore	8501	\N	\N	14	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
15	other	Other	Tjetër	Other Region	Rajon Tjetër	\N	\N	\N	99	t	2025-09-12 15:18:28.104247+02	2025-09-12 15:18:28.104247+02
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, recommender_name, recommender_email, recommender_phone, usta_name, usta_email, usta_phone, category_id, location_id, language, is_recommendation, ip_address, user_agent, status, created_at, updated_at, approved_at, approved_by, rejection_reason, notes, source, referral_code) FROM stdin;
1	aneeb iqbal	1aneebiqbghghal@gmail.com	03095008966	\N	\N	\N	6	5	en	f	223.252.16.135	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-12 15:21:54.395062+02	2025-09-12 15:21:54.395062+02	\N	\N	\N	\N	website	\N
2	Igli Faslija	ifaslija@gmail.com	0696621666	\N	\N	\N	5	5	en	f	141.98.141.245	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	pending	2025-09-12 15:26:01.202796+02	2025-09-12 15:26:01.202796+02	\N	\N	\N	\N	website	\N
3	Igli Faslija	ifaslija@gmail.com	0696621666	\N	\N	\N	2	4	en	f	141.98.141.245	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	pending	2025-09-12 15:50:46.165833+02	2025-09-12 15:50:46.165833+02	\N	\N	\N	\N	website	\N
4	Muhammad aneeb iqbal khan	1aneebiqbal@gmail.com	03095008966	\N	\N	\N	5	3	en	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-15 14:35:23.642619+02	2025-09-15 14:35:23.642619+02	\N	\N	\N	\N	website	\N
5	Muhammad aneeb iqbal khan	1andadsdeebiqbal@gmail.com	03095008966	\N	\N	\N	7	3	en	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-15 15:12:39.268123+02	2025-09-15 15:12:39.268123+02	\N	\N	\N	\N	website	\N
6	Muhammad aneeb iqbal khan	contactaneebiq@gmail.com	03095008966	\N	\N	\N	\N	\N	en	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-16 22:38:36.66588+02	2025-09-16 22:38:36.66588+02	\N	\N	\N	\N	website	\N
7	Hhfh	\N	0691111111	\N	\N	\N	\N	\N	en	f	104.28.251.13	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	pending	2025-09-18 08:01:04.441599+02	2025-09-18 08:01:04.441599+02	\N	\N	\N	\N	website	\N
8	Hshdbf	mewop73533@cerisun.com	0694545484	\N	\N	\N	\N	\N	en	f	104.28.251.13	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	pending	2025-09-19 19:17:13.20419+02	2025-09-19 19:17:13.20419+02	\N	\N	\N	\N	website	\N
9	Eleanor Chen	Eleanor@yopmail.com	(347) 555-0198	\N	\N	\N	\N	\N	sq	f	139.135.49.47	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-20 12:33:51.812201+02	2025-09-20 12:33:51.812201+02	\N	\N	\N	\N	website	\N
10	Igli Faslija	\N	0696621666	\N	\N	\N	\N	\N	sq	f	141.98.142.239	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-22 12:26:53.513021+02	2025-09-22 12:26:53.513021+02	\N	\N	\N	\N	website	\N
11	Nabeel Shahzad	nomi@gmail.com	923083133970	\N	\N	\N	\N	\N	en	f	139.135.49.47	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-12 09:50:31.401247+01	2025-11-12 09:50:31.401247+01	\N	\N	\N	\N	website	\N
12	dgdgdf	abd@ghj.com	8658768754678	\N	\N	\N	\N	\N	en	f	103.244.176.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	pending	2025-11-12 16:08:11.327181+01	2025-11-12 16:08:11.327181+01	\N	\N	\N	\N	website	\N
13	fdsafasf	ca@gmail.com	923083133970	\N	\N	\N	\N	\N	en	f	223.123.0.105	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-13 07:29:40.449139+01	2025-11-13 07:29:40.449139+01	\N	\N	\N	\N	website	\N
14	Gazmend	ggjikopulli@gmail.com	0697599145	\N	\N	\N	\N	\N	sq	f	109.236.42.56	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	pending	2025-11-15 19:36:26.552977+01	2025-11-15 19:36:26.552977+01	\N	\N	\N	\N	website	\N
\.


--
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registrations (id, name, email, phone, category_id, location_id, language, gdpr_consent, marketing_consent, ip_address, user_agent, status, created_at, updated_at, approved_at, approved_by, notes) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, phone, name, password_hash, category_id, location_id, preferred_language, is_usta, is_verified, verification_token, reset_token, reset_token_expires, status, created_at, updated_at, last_login_at) FROM stdin;
\.


--
-- Data for Name: waitlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waitlist (id, name, email, phone, category_id, location_id, language, gdpr_consent, marketing_consent, ip_address, user_agent, status, created_at, updated_at, approved_at, approved_by, notes) FROM stdin;
1	aneeb iqbal	1aneebiqbawwl@gmail.com	03095008966	2	3	en	t	f	223.252.16.135	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-12 15:21:39.458157+02	2025-09-12 15:21:39.458157+02	\N	\N	\N
2	Igli Faslija	ifaslija@gmail.com	0696621666	2	4	en	t	f	141.98.141.245	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	pending	2025-09-12 15:25:34.69615+02	2025-09-12 15:25:34.69615+02	\N	\N	\N
3	Igli Faslija	ifaslijaa@gmail.com	0696621666	1	1	en	t	f	141.98.141.245	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36	pending	2025-09-12 15:50:36.156685+02	2025-09-12 15:50:36.156685+02	\N	\N	\N
4	Muhammad aneeb iqbal khan	1aneebiqbal@gmail.com	03095008966	4	2	en	t	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-15 14:33:55.586585+02	2025-09-15 14:33:55.586585+02	\N	\N	\N
5	Muhammad aneeb iqbal khan	1aneebdsdsdsiqbal@gmail.com	03095008966	4	4	en	t	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-15 15:12:11.732537+02	2025-09-15 15:12:11.732537+02	\N	\N	\N
6	Igli Faslija	igli@myusta.al	0696621666	1	4	sq	t	f	141.98.142.162	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-15 15:26:59.447439+02	2025-09-15 15:26:59.447439+02	\N	\N	\N
7	Igli Faslija	kakono2574@merumart.com	0696621666	1	1	sq	t	f	141.98.142.162	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-15 15:30:40.302648+02	2025-09-15 15:30:40.302648+02	\N	\N	\N
8	Muhammad aneeb iqbal khan	1aneebiqbal+1@gmail.com	03095008966	4	4	en	t	f	72.255.5.64	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	pending	2025-09-15 15:30:45.127927+02	2025-09-15 15:30:45.127927+02	\N	\N	\N
9	Muhammad aneeb iqbal khan	1aneebiqbal+2@gmail.com	03095008966	4	2	en	t	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-15 15:31:06.473595+02	2025-09-15 15:31:06.473595+02	\N	\N	\N
10	Muhammad aneeb iqbal khan	contactaneebiq@gmail.com	03095008966	\N	\N	en	t	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-16 22:37:50.467822+02	2025-09-16 22:37:50.467822+02	\N	\N	\N
11	Igli Faslija	walovo6297@merumart.com	0696621666	\N	\N	en	t	f	141.98.142.162	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-16 22:49:13.673734+02	2025-09-16 22:49:13.673734+02	\N	\N	\N
12	hamza	h1@gmail.com	03030914571	\N	\N	en	t	f	203.128.24.84	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-17 20:41:51.191357+02	2025-09-17 20:41:51.191357+02	\N	\N	\N
13	Brian	nurjabrian@gmail.com	0691111111	\N	\N	en	t	f	104.28.219.12	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/385.0.802777482 Mobile/15E148 Safari/604.1	pending	2025-09-18 12:42:45.381683+02	2025-09-18 12:42:45.381683+02	\N	\N	\N
14	Mydhr	mewop73533@cerisun.com	50606050	\N	\N	en	t	f	104.28.251.13	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	pending	2025-09-19 19:17:57.725061+02	2025-09-19 19:17:57.725061+02	\N	\N	\N
15	wasds	gimigof241@cerisun.com	21212121	\N	\N	en	t	f	188.172.110.244	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-19 19:19:30.737797+02	2025-09-19 19:19:30.737797+02	\N	\N	\N
16	sadasad	vacoxe3880@cerisun.com	asdasdasda	\N	\N	sq	t	f	141.98.142.239	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	pending	2025-09-22 12:26:29.984478+02	2025-09-22 12:26:29.984478+02	\N	\N	\N
17	Bledar baho	bledar_2017@icloud.com	0693089493	\N	\N	en	t	f	81.26.200.140	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	pending	2025-09-22 14:08:59.058874+02	2025-09-22 14:08:59.058874+02	\N	\N	\N
18	Aneeb Iqbal	ifizzaiqbal@gmail.com	03014292251	\N	\N	en	t	f	72.255.5.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	pending	2025-10-22 23:21:20.268539+02	2025-10-22 23:21:20.268539+02	\N	\N	\N
19	Anza Ali	anzakhan2233@gmail.com	03333101514	\N	\N	en	t	f	223.123.5.187	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36	pending	2025-10-23 16:03:50.316613+02	2025-10-23 16:03:50.316613+02	\N	\N	\N
20	Abdul	a@gmail.com	923083133970	\N	\N	en	t	f	139.135.49.47	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-12 09:49:25.83467+01	2025-11-12 09:49:25.83467+01	\N	\N	\N
21	fddfgdfgdf	abc@xyz.com	5675677565	\N	\N	en	t	f	103.244.176.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	pending	2025-11-12 16:07:24.376672+01	2025-11-12 16:07:24.376672+01	\N	\N	\N
22	Abc	abid.hussain@vortexhive.ai	923083133970	\N	\N	en	t	f	223.123.0.105	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-13 07:21:32.869546+01	2025-11-13 07:21:32.869546+01	\N	\N	\N
23	errewtrwet	abc@gmail.com	923083133970	\N	\N	en	t	f	223.123.0.105	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-13 07:28:37.842834+01	2025-11-13 07:28:37.842834+01	\N	\N	\N
24	ditor 	rajlicubi136@gmail.com	0692625435	\N	\N	sq	t	f	104.28.251.12	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	pending	2025-11-14 15:31:06.873989+01	2025-11-14 15:31:06.873989+01	\N	\N	\N
25	Renato	bardhirenato@gmail.com	0696530088	\N	\N	sq	t	f	188.172.110.123	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	pending	2025-11-14 15:32:35.308988+01	2025-11-14 15:32:35.308988+01	\N	\N	\N
26	Dorjan	doridedda04@gmail.com	0697569590	\N	\N	sq	t	f	104.28.219.13	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	pending	2025-11-14 15:34:50.963443+01	2025-11-14 15:34:50.963443+01	\N	\N	\N
27	Pellumb Flora	pllumflora33@gmail.com	0684753302	\N	\N	sq	t	f	109.236.47.101	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	pending	2025-11-14 18:43:19.126051+01	2025-11-14 18:43:19.126051+01	\N	\N	\N
28	Eduart	eduartshametaj@gmail.com	0696611160	\N	\N	sq	t	f	104.28.251.13	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	pending	2025-11-15 15:52:59.819575+01	2025-11-15 15:52:59.819575+01	\N	\N	\N
29	Gersi	ditaembare@gmail.com	0674848924	\N	\N	sq	t	f	109.234.233.210	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	pending	2025-11-15 15:54:29.93044+01	2025-11-15 15:54:29.93044+01	\N	\N	\N
30	Igli Faslija	ladit84693@canvect.com	0696621666	\N	\N	sq	t	f	188.164.221.24	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	pending	2025-11-16 13:35:38.945941+01	2025-11-16 13:35:38.945941+01	\N	\N	\N
31	Petrit Bushi	petrit.bushi16@icloud.com	0685000701	\N	\N	sq	t	f	188.172.110.254	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1	pending	2025-11-17 08:00:48.822504+01	2025-11-17 08:00:48.822504+01	\N	\N	\N
32	Dejvid	devisshehu5@gmail.com	0692027480	\N	\N	sq	t	f	188.172.110.173	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	pending	2025-11-17 09:02:50.446457+01	2025-11-17 09:02:50.446457+01	\N	\N	\N
33	Enti 	Entizemo1997@gmail.com	0697983298	\N	\N	sq	t	f	188.172.111.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	pending	2025-11-17 09:05:06.754974+01	2025-11-17 09:05:06.754974+01	\N	\N	\N
34	Jeton Domi	jetondomi50@gmail.com	0688581152	\N	\N	sq	t	f	31.22.48.91	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	pending	2025-11-17 10:21:44.633107+01	2025-11-17 10:21:44.633107+01	\N	\N	\N
35	domijeton	jetondomi@gmail.com	0688581152	\N	\N	sq	t	f	31.22.48.91	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	pending	2025-11-17 12:47:33.797293+01	2025-11-17 12:47:33.797293+01	\N	\N	\N
36	Ermal Topi	eritopi1993@gmail.com	0685215917	\N	\N	sq	t	f	193.107.12.183	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/29.0 Chrome/136.0.0.0 Mobile Safari/537.36	pending	2025-11-18 19:04:20.439015+01	2025-11-18 19:04:20.439015+01	\N	\N	\N
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: contact_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_submissions_id_seq', 6, true);


--
-- Name: email_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_logs_id_seq', 1, false);


--
-- Name: gdpr_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gdpr_requests_id_seq', 1, false);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 15, true);


--
-- Name: recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_id_seq', 14, true);


--
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrations_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: waitlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waitlist_id_seq', 36, true);


--
-- Name: categories categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_code_key UNIQUE (code);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: gdpr_requests gdpr_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gdpr_requests
    ADD CONSTRAINT gdpr_requests_pkey PRIMARY KEY (id);


--
-- Name: locations locations_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_code_key UNIQUE (code);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: waitlist waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_pkey PRIMARY KEY (id);


--
-- Name: idx_contact_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_created ON public.contact_submissions USING btree (created_at DESC);


--
-- Name: idx_contact_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_email ON public.contact_submissions USING btree (email);


--
-- Name: idx_contact_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_status ON public.contact_submissions USING btree (status);


--
-- Name: idx_email_log_recipient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_log_recipient ON public.email_logs USING btree (recipient_email);


--
-- Name: idx_email_log_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_log_reference ON public.email_logs USING btree (reference_type, reference_id);


--
-- Name: idx_email_log_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_log_type ON public.email_logs USING btree (email_type);


--
-- Name: idx_gdpr_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gdpr_email ON public.gdpr_requests USING btree (email);


--
-- Name: idx_gdpr_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gdpr_status ON public.gdpr_requests USING btree (status);


--
-- Name: idx_gdpr_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_gdpr_type ON public.gdpr_requests USING btree (request_type);


--
-- Name: idx_recommend_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommend_category ON public.recommendations USING btree (category_id);


--
-- Name: idx_recommend_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommend_created ON public.recommendations USING btree (created_at DESC);


--
-- Name: idx_recommend_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommend_location ON public.recommendations USING btree (location_id);


--
-- Name: idx_recommend_recommender_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommend_recommender_email ON public.recommendations USING btree (recommender_email);


--
-- Name: idx_recommend_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommend_status ON public.recommendations USING btree (status);


--
-- Name: idx_recommend_usta_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommend_usta_phone ON public.recommendations USING btree (usta_phone);


--
-- Name: idx_registration_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registration_category ON public.registrations USING btree (category_id);


--
-- Name: idx_registration_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registration_created ON public.registrations USING btree (created_at DESC);


--
-- Name: idx_registration_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registration_email ON public.registrations USING btree (email);


--
-- Name: idx_registration_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registration_location ON public.registrations USING btree (location_id);


--
-- Name: idx_registration_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registration_phone ON public.registrations USING btree (phone);


--
-- Name: idx_registration_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_registration_status ON public.registrations USING btree (status);


--
-- Name: idx_users_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_category ON public.users USING btree (category_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_location ON public.users USING btree (location_id);


--
-- Name: idx_users_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_phone ON public.users USING btree (phone);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: idx_waitlist_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_waitlist_category ON public.waitlist USING btree (category_id);


--
-- Name: idx_waitlist_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_waitlist_created ON public.waitlist USING btree (created_at DESC);


--
-- Name: idx_waitlist_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_waitlist_email ON public.waitlist USING btree (email);


--
-- Name: idx_waitlist_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_waitlist_location ON public.waitlist USING btree (location_id);


--
-- Name: idx_waitlist_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_waitlist_phone ON public.waitlist USING btree (phone);


--
-- Name: idx_waitlist_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_waitlist_status ON public.waitlist USING btree (status);


--
-- Name: recommendations recommendations_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: recommendations recommendations_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: registrations registrations_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: registrations registrations_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: users users_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: users users_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: waitlist waitlist_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: waitlist waitlist_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO myusta_website_user;


--
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.categories TO myusta_website_user;


--
-- Name: SEQUENCE categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.categories_id_seq TO myusta_website_user;


--
-- Name: TABLE contact_submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.contact_submissions TO myusta_website_user;


--
-- Name: SEQUENCE contact_submissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.contact_submissions_id_seq TO myusta_website_user;


--
-- Name: TABLE email_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.email_logs TO myusta_website_user;


--
-- Name: SEQUENCE email_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.email_logs_id_seq TO myusta_website_user;


--
-- Name: TABLE gdpr_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.gdpr_requests TO myusta_website_user;


--
-- Name: SEQUENCE gdpr_requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.gdpr_requests_id_seq TO myusta_website_user;


--
-- Name: TABLE locations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.locations TO myusta_website_user;


--
-- Name: SEQUENCE locations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.locations_id_seq TO myusta_website_user;


--
-- Name: TABLE pending_contacts; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pending_contacts TO myusta_website_user;


--
-- Name: TABLE recommendations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.recommendations TO myusta_website_user;


--
-- Name: TABLE pending_recommendations_view; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pending_recommendations_view TO myusta_website_user;


--
-- Name: SEQUENCE recommendations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.recommendations_id_seq TO myusta_website_user;


--
-- Name: TABLE registrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.registrations TO myusta_website_user;


--
-- Name: TABLE registration_statistics; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.registration_statistics TO myusta_website_user;


--
-- Name: SEQUENCE registrations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.registrations_id_seq TO myusta_website_user;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO myusta_website_user;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.users_id_seq TO myusta_website_user;


--
-- Name: TABLE waitlist; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.waitlist TO myusta_website_user;


--
-- Name: SEQUENCE waitlist_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.waitlist_id_seq TO myusta_website_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES TO myusta_website_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO myusta_website_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 3avLLKpeKzyW4zkyecf3NBUEeNlsIFwChHIS1dljMKEM8iFM8HmBLcAC9Jfvreg

