--
-- PostgreSQL database dump
--

\restrict BP7xVLmSI2mIz9UHqYz5kYecw3njCZ9gwWFyff1GCt7KB98KazMbd91Ck7lMbRf

-- Dumped from database version 13.22 (Debian 13.22-1.pgdg13+1)
-- Dumped by pg_dump version 13.22 (Debian 13.22-1.pgdg13+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: found_reports; Type: TABLE; Schema: public; Owner: trackmy_user
--

CREATE TABLE public.found_reports (
    found_report_id integer NOT NULL,
    founder_id integer NOT NULL,
    item_id integer,
    title character varying(255) NOT NULL,
    description character varying(1000),
    longitude double precision,
    latitude double precision,
    radius integer,
    created_at timestamp without time zone
);


ALTER TABLE public.found_reports OWNER TO trackmy_user;

--
-- Name: found_reports_found_report_id_seq; Type: SEQUENCE; Schema: public; Owner: trackmy_user
--

CREATE SEQUENCE public.found_reports_found_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.found_reports_found_report_id_seq OWNER TO trackmy_user;

--
-- Name: found_reports_found_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trackmy_user
--

ALTER SEQUENCE public.found_reports_found_report_id_seq OWNED BY public.found_reports.found_report_id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: trackmy_user
--

CREATE TABLE public.images (
    image_id integer NOT NULL,
    url text NOT NULL,
    item_id integer NOT NULL,
    faiss_id integer
);


ALTER TABLE public.images OWNER TO trackmy_user;

--
-- Name: images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: trackmy_user
--

CREATE SEQUENCE public.images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_image_id_seq OWNER TO trackmy_user;

--
-- Name: images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trackmy_user
--

ALTER SEQUENCE public.images_image_id_seq OWNED BY public.images.image_id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: trackmy_user
--

CREATE TABLE public.items (
    item_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(1000),
    user_id integer
);


ALTER TABLE public.items OWNER TO trackmy_user;

--
-- Name: items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: trackmy_user
--

CREATE SEQUENCE public.items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.items_item_id_seq OWNER TO trackmy_user;

--
-- Name: items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trackmy_user
--

ALTER SEQUENCE public.items_item_id_seq OWNED BY public.items.item_id;


--
-- Name: lost_reports; Type: TABLE; Schema: public; Owner: trackmy_user
--

CREATE TABLE public.lost_reports (
    lost_report_id integer NOT NULL,
    item_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(1000),
    longitude double precision,
    latitude double precision,
    radius integer,
    bounty numeric(6,2),
    created_at timestamp without time zone
);


ALTER TABLE public.lost_reports OWNER TO trackmy_user;

--
-- Name: lost_reports_lost_report_id_seq; Type: SEQUENCE; Schema: public; Owner: trackmy_user
--

CREATE SEQUENCE public.lost_reports_lost_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lost_reports_lost_report_id_seq OWNER TO trackmy_user;

--
-- Name: lost_reports_lost_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trackmy_user
--

ALTER SEQUENCE public.lost_reports_lost_report_id_seq OWNED BY public.lost_reports.lost_report_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: trackmy_user
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    user_name character varying(255) NOT NULL,
    hashed_password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO trackmy_user;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: trackmy_user
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO trackmy_user;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trackmy_user
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: found_reports found_report_id; Type: DEFAULT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.found_reports ALTER COLUMN found_report_id SET DEFAULT nextval('public.found_reports_found_report_id_seq'::regclass);


--
-- Name: images image_id; Type: DEFAULT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.images ALTER COLUMN image_id SET DEFAULT nextval('public.images_image_id_seq'::regclass);


--
-- Name: items item_id; Type: DEFAULT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.items ALTER COLUMN item_id SET DEFAULT nextval('public.items_item_id_seq'::regclass);


--
-- Name: lost_reports lost_report_id; Type: DEFAULT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.lost_reports ALTER COLUMN lost_report_id SET DEFAULT nextval('public.lost_reports_lost_report_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: found_reports; Type: TABLE DATA; Schema: public; Owner: trackmy_user
--

COPY public.found_reports (found_report_id, founder_id, item_id, title, description, longitude, latitude, radius, created_at) FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: trackmy_user
--

COPY public.images (image_id, url, item_id, faiss_id) FROM stdin;
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: trackmy_user
--

COPY public.items (item_id, name, description, user_id) FROM stdin;
\.


--
-- Data for Name: lost_reports; Type: TABLE DATA; Schema: public; Owner: trackmy_user
--

COPY public.lost_reports (lost_report_id, item_id, user_id, title, description, longitude, latitude, radius, bounty, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: trackmy_user
--

COPY public.users (user_id, email, user_name, hashed_password) FROM stdin;
\.


--
-- Name: found_reports_found_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trackmy_user
--

SELECT pg_catalog.setval('public.found_reports_found_report_id_seq', 1, false);


--
-- Name: images_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trackmy_user
--

SELECT pg_catalog.setval('public.images_image_id_seq', 1, false);


--
-- Name: items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trackmy_user
--

SELECT pg_catalog.setval('public.items_item_id_seq', 1, false);


--
-- Name: lost_reports_lost_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trackmy_user
--

SELECT pg_catalog.setval('public.lost_reports_lost_report_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trackmy_user
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- Name: found_reports found_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.found_reports
    ADD CONSTRAINT found_reports_pkey PRIMARY KEY (found_report_id);


--
-- Name: images images_item_id_key; Type: CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_item_id_key UNIQUE (item_id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (image_id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (item_id);


--
-- Name: lost_reports lost_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.lost_reports
    ADD CONSTRAINT lost_reports_pkey PRIMARY KEY (lost_report_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: ix_found_reports_found_report_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_found_reports_found_report_id ON public.found_reports USING btree (found_report_id);


--
-- Name: ix_found_reports_founder_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_found_reports_founder_id ON public.found_reports USING btree (founder_id);


--
-- Name: ix_found_reports_item_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_found_reports_item_id ON public.found_reports USING btree (item_id);


--
-- Name: ix_images_faiss_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE UNIQUE INDEX ix_images_faiss_id ON public.images USING btree (faiss_id);


--
-- Name: ix_images_image_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_images_image_id ON public.images USING btree (image_id);


--
-- Name: ix_items_item_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_items_item_id ON public.items USING btree (item_id);


--
-- Name: ix_lost_reports_item_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_lost_reports_item_id ON public.lost_reports USING btree (item_id);


--
-- Name: ix_lost_reports_lost_report_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_lost_reports_lost_report_id ON public.lost_reports USING btree (lost_report_id);


--
-- Name: ix_lost_reports_user_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_lost_reports_user_id ON public.lost_reports USING btree (user_id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_user_id; Type: INDEX; Schema: public; Owner: trackmy_user
--

CREATE INDEX ix_users_user_id ON public.users USING btree (user_id);


--
-- Name: found_reports found_reports_founder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.found_reports
    ADD CONSTRAINT found_reports_founder_id_fkey FOREIGN KEY (founder_id) REFERENCES public.users(user_id);


--
-- Name: found_reports found_reports_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.found_reports
    ADD CONSTRAINT found_reports_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- Name: images images_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- Name: items items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: lost_reports lost_reports_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.lost_reports
    ADD CONSTRAINT lost_reports_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(item_id);


--
-- Name: lost_reports lost_reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trackmy_user
--

ALTER TABLE ONLY public.lost_reports
    ADD CONSTRAINT lost_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict BP7xVLmSI2mIz9UHqYz5kYecw3njCZ9gwWFyff1GCt7KB98KazMbd91Ck7lMbRf

