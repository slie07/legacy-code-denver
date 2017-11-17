--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: senseus; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE senseus WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE senseus OWNER TO postgres;

\connect senseus

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: login_type; Type: TYPE; Schema: public; Owner: senseus
--

CREATE TYPE login_type AS ENUM (
    'google',
    'facebook'
);


ALTER TYPE public.login_type OWNER TO senseus;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: circle; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE circle (
    circle_id bigint NOT NULL,
    circle_info character varying
);


ALTER TABLE public.circle OWNER TO senseus;

--
-- Name: circle_circle_id_seq; Type: SEQUENCE; Schema: public; Owner: senseus
--

CREATE SEQUENCE circle_circle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.circle_circle_id_seq OWNER TO senseus;

--
-- Name: circle_circle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: senseus
--

ALTER SEQUENCE circle_circle_id_seq OWNED BY circle.circle_id;


--
-- Name: conversation_messages; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE conversation_messages (
    conversation_id bigint,
    message_content character varying,
    sent_date timestamp without time zone,
    sending_user_id bigint
);


ALTER TABLE public.conversation_messages OWNER TO senseus;

--
-- Name: conversation_participants; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE conversation_participants (
    conversation_id bigint,
    member_type character varying,
    participant_info character varying
);


ALTER TABLE public.conversation_participants OWNER TO senseus;

--
-- Name: conversation_participants_hash; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE conversation_participants_hash (
    conversation_id bigint,
    participants_hash character varying
);


ALTER TABLE public.conversation_participants_hash OWNER TO senseus;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE conversations (
    conversation_id bigint NOT NULL,
    conversation_name character varying,
    last_updated timestamp without time zone,
    conversation_preview character varying(50)
);


ALTER TABLE public.conversations OWNER TO senseus;

--
-- Name: conversations_conversation_id_seq; Type: SEQUENCE; Schema: public; Owner: senseus
--

CREATE SEQUENCE conversations_conversation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conversations_conversation_id_seq OWNER TO senseus;

--
-- Name: conversations_conversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: senseus
--

ALTER SEQUENCE conversations_conversation_id_seq OWNED BY conversations.conversation_id;


--
-- Name: event_activities; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE event_activities (
    event_id bigint,
    activity_info character varying
);


ALTER TABLE public.event_activities OWNER TO senseus;

--
-- Name: event_expenses; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE event_expenses (
    event_id bigint,
    expenses_info character varying
);


ALTER TABLE public.event_expenses OWNER TO senseus;

--
-- Name: event_guests; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE event_guests (
    event_id bigint,
    guest_info character varying
);


ALTER TABLE public.event_guests OWNER TO senseus;

--
-- Name: events; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE events (
    event_id bigint NOT NULL,
    event_info character varying,
    event_name character varying
);


ALTER TABLE public.events OWNER TO senseus;

--
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: senseus
--

CREATE SEQUENCE events_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_event_id_seq OWNER TO senseus;

--
-- Name: events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: senseus
--

ALTER SEQUENCE events_event_id_seq OWNED BY events.event_id;


--
-- Name: test_json; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE test_json (
    test json
);


ALTER TABLE public.test_json OWNER TO senseus;

--
-- Name: user_circles; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE user_circles (
    user_id bigint,
    circle_id bigint,
    circle_name character varying
);


ALTER TABLE public.user_circles OWNER TO senseus;

--
-- Name: user_conversations; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE user_conversations (
    user_id bigint,
    conversation_id bigint
);


ALTER TABLE public.user_conversations OWNER TO senseus;

--
-- Name: user_events; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE user_events (
    user_id bigint,
    event_id bigint,
    due_date timestamp without time zone
);


ALTER TABLE public.user_events OWNER TO senseus;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE user_info (
    username character varying,
    useremail character varying,
    user_id character varying,
    id integer NOT NULL,
    login login_type
);


ALTER TABLE public.user_info OWNER TO senseus;

--
-- Name: user_info_id_seq; Type: SEQUENCE; Schema: public; Owner: senseus
--

CREATE SEQUENCE user_info_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_info_id_seq OWNER TO senseus;

--
-- Name: user_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: senseus
--

ALTER SEQUENCE user_info_id_seq OWNED BY user_info.id;


--
-- Name: user_messages; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE user_messages (
    receiving_user_id bigint,
    sending_user_id bigint,
    message character varying,
    sent_date timestamp without time zone
);


ALTER TABLE public.user_messages OWNER TO senseus;

--
-- Name: user_notifications; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE user_notifications (
    user_id bigint,
    notification character varying,
    is_new boolean,
    date timestamp without time zone,
    notification_info character varying
);


ALTER TABLE public.user_notifications OWNER TO senseus;

--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: senseus; Tablespace: 
--

CREATE TABLE user_settings (
    user_id bigint,
    settings character varying
);


ALTER TABLE public.user_settings OWNER TO senseus;

--
-- Name: circle_id; Type: DEFAULT; Schema: public; Owner: senseus
--

ALTER TABLE ONLY circle ALTER COLUMN circle_id SET DEFAULT nextval('circle_circle_id_seq'::regclass);


--
-- Name: conversation_id; Type: DEFAULT; Schema: public; Owner: senseus
--

ALTER TABLE ONLY conversations ALTER COLUMN conversation_id SET DEFAULT nextval('conversations_conversation_id_seq'::regclass);


--
-- Name: event_id; Type: DEFAULT; Schema: public; Owner: senseus
--

ALTER TABLE ONLY events ALTER COLUMN event_id SET DEFAULT nextval('events_event_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: senseus
--

ALTER TABLE ONLY user_info ALTER COLUMN id SET DEFAULT nextval('user_info_id_seq'::regclass);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

