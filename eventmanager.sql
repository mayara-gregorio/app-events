--
-- PostgreSQL database dump
--

\restrict Sxtx4wfwtLGdM2lm8psjoQVDr0U3InLyq8tz9WQ33b6m1a0GPbOTII8xmwZlb32

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."User" DISABLE TRIGGER ALL;

INSERT INTO public."User" VALUES ('b31a95c8-1fd4-45de-bf88-b7cb5018e3a6', 'MAYARA DOS SANTOS GREGÓRIO', 'mayara.gregorio@acad.ifma.edu.br', '2026-10-24 13:30:42.951', '$2b$10$Bn32KzaheUM2ojGex0icce1ORUmh8t.hb4uG/Zyq.JY440ebsqC/W') ON CONFLICT DO NOTHING;
INSERT INTO public."User" VALUES ('6034920d-90e7-4158-b5d7-3d170dd1a227', 'Jessé Hudson', 'jessehudsonn@gmail.com', '2026-10-25 00:23:26.843', '$2b$10$BsHALYoHDQuGUgpupuZY/e8ZMC85rQZWqlcTXw57Cy9xSb.ucndwq') ON CONFLICT DO NOTHING;


ALTER TABLE public."User" ENABLE TRIGGER ALL;

--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Event" DISABLE TRIGGER ALL;

INSERT INTO public."Event" VALUES ('933413ff-a1ec-4060-8488-ce4caa906abe', 'Workshop de Java', 'Será um evento voltado para Java', '2026-10-31 00:00:00', '09:53', 'Timon - MA', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHylZ4QB4FUo6oNPH-oBP2GtKZgcpZZsqhxWTGkvwsKA&s=10', '2026-10-26 00:59:34.815', '2026-10-26 01:00:13.829', 'b31a95c8-1fd4-45de-bf88-b7cb5018e3a6') ON CONFLICT DO NOTHING;
INSERT INTO public."Event" VALUES ('e4e18375-9f24-40ee-92c0-9841da62b7af', 'Workshop Node JS', 'Será minicursos de Node JS', '2026-10-31 00:00:00', '21:06', 'Teresina - PI', 'https://images.seeklogo.com/logo-png/26/1/node-js-logo-png_seeklogo-269242.png', '2026-10-25 00:06:09.063', '2026-10-26 01:00:52.466', 'b31a95c8-1fd4-45de-bf88-b7cb5018e3a6') ON CONFLICT DO NOTHING;


ALTER TABLE public."Event" ENABLE TRIGGER ALL;

--
-- Data for Name: Registration; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."Registration" DISABLE TRIGGER ALL;

INSERT INTO public."Registration" VALUES ('ae1b8391-77f0-4d49-b0dd-946b464c0efe', '6034920d-90e7-4158-b5d7-3d170dd1a227', 'e4e18375-9f24-40ee-92c0-9841da62b7af', '2026-10-25 00:49:50.574') ON CONFLICT DO NOTHING;


ALTER TABLE public."Registration" ENABLE TRIGGER ALL;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public._prisma_migrations DISABLE TRIGGER ALL;

INSERT INTO public._prisma_migrations VALUES ('4cd56130-30f0-4097-b966-0fd9d5c1f273', 'f4ceacf57d3a9cae5a7aff1bbd69dd2aaa4b3f353fd26797a56d0ae4a5a45ca3', '2026-10-21 15:16:34.659768-03', '20261021181634_init', NULL, NULL, '2026-10-21 15:16:34.641915-03', 1) ON CONFLICT DO NOTHING;
INSERT INTO public._prisma_migrations VALUES ('91b37de5-6b44-4324-9537-64a031da0a99', 'eb7b8daec0ee36044749897ffa29c96c41df26fac64762d6285882b2cbf3c99d', '2026-10-24 10:18:11.006025-03', '20261024131810_add_user_password', NULL, NULL, '2026-10-24 10:18:11.002197-03', 1) ON CONFLICT DO NOTHING;
INSERT INTO public._prisma_migrations VALUES ('8b0556dc-6a6f-4d27-934f-f12013caf51e', 'b80211229c4e8540d86151a21395f19122524f1d842745d4a6739f28353f3ae2', '2026-10-24 11:06:01.440296-03', '20261024140601_ajustando_tables_enevt_and_user', NULL, NULL, '2026-10-24 11:06:01.436569-03', 1) ON CONFLICT DO NOTHING;


ALTER TABLE public._prisma_migrations ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

\unrestrict Sxtx4wfwtLGdM2lm8psjoQVDr0U3InLyq8tz9WQ33b6m1a0GPbOTII8xmwZlb32

