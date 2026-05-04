--
-- PostgreSQL database dump
--



-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text NOT NULL,
    author_id integer,
    course_id integer,
    is_pinned boolean DEFAULT false,
    is_important boolean DEFAULT false,
    is_global boolean DEFAULT false,
    file_url character varying(500),
    file_name character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    instructions text,
    course_id integer,
    created_by integer,
    due_date timestamp without time zone NOT NULL,
    due_time character varying(10) DEFAULT '23:59'::character varying,
    total_marks integer DEFAULT 100,
    file_url character varying(500),
    file_name character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: chat_group_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_group_members (
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    joined_at timestamp without time zone DEFAULT now()
);


--
-- Name: chat_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: chat_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_groups_id_seq OWNED BY public.chat_groups.id;


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    sender_id integer,
    receiver_id integer,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    group_id integer,
    file_url text,
    file_name text
);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    credits integer DEFAULT 3,
    department character varying(100),
    branch character varying(100),
    course_type character varying(20) DEFAULT 'core'::character varying,
    semester_number integer,
    instructor_id integer,
    semester character varying(50),
    academic_year character varying(20),
    schedule character varying(200),
    room character varying(50),
    max_students integer DEFAULT 60,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT courses_course_type_check CHECK (((course_type)::text = ANY ((ARRAY['core'::character varying, 'elective'::character varying, 'lab'::character varying])::text[])))
);


--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    student_id integer,
    course_id integer,
    enrolled_at timestamp without time zone DEFAULT now(),
    status character varying(20) DEFAULT 'active'::character varying,
    CONSTRAINT enrollments_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'dropped'::character varying, 'completed'::character varying])::text[])))
);


--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: grades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    student_id integer,
    course_id integer,
    internal_marks numeric(5,2),
    external_marks numeric(5,2),
    total_marks numeric(5,2),
    grade character varying(5),
    grade_point numeric(3,1),
    semester character varying(50),
    academic_year character varying(20),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: grades_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grades_id_seq OWNED BY public.grades.id;


--
-- Name: materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materials (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    course_id integer,
    instructor_id integer,
    file_url character varying(500),
    file_name character varying(255),
    file_size character varying(50),
    file_type character varying(50),
    download_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.materials_id_seq OWNED BY public.materials.id;


--
-- Name: otp_verifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_verifications (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    otp character varying(6) NOT NULL,
    data jsonb NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: otp_verifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.otp_verifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: otp_verifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.otp_verifications_id_seq OWNED BY public.otp_verifications.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    assignment_id integer,
    student_id integer,
    file_url character varying(500),
    file_name character varying(255),
    submitted_at timestamp without time zone DEFAULT now(),
    status character varying(20) DEFAULT 'submitted'::character varying,
    grade integer,
    feedback text,
    graded_by integer,
    graded_at timestamp without time zone,
    CONSTRAINT submissions_status_check CHECK (((status)::text = ANY ((ARRAY['submitted'::character varying, 'graded'::character varying, 'late'::character varying])::text[])))
);


--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: timetable_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timetable_entries (
    id integer NOT NULL,
    course_id integer,
    day_of_week character varying(10) NOT NULL,
    start_time character varying(10) NOT NULL,
    end_time character varying(10) NOT NULL,
    room character varying(50),
    entry_type character varying(10) DEFAULT 'lecture'::character varying,
    branch character varying(100),
    batch character varying(20),
    semester_number integer,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT timetable_entries_day_of_week_check CHECK (((day_of_week)::text = ANY ((ARRAY['Monday'::character varying, 'Tuesday'::character varying, 'Wednesday'::character varying, 'Thursday'::character varying, 'Friday'::character varying, 'Saturday'::character varying])::text[]))),
    CONSTRAINT timetable_entries_entry_type_check CHECK (((entry_type)::text = ANY ((ARRAY['lecture'::character varying, 'lab'::character varying, 'tutorial'::character varying])::text[])))
);


--
-- Name: timetable_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.timetable_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: timetable_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.timetable_entries_id_seq OWNED BY public.timetable_entries.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'student'::character varying NOT NULL,
    department character varying(100),
    branch character varying(100),
    batch character varying(20),
    enrollment_id character varying(50),
    designation character varying(100),
    avatar_url character varying(500),
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    email_verified boolean DEFAULT false,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['student'::character varying, 'faculty'::character varying, 'admin'::character varying])::text[])))
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
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: chat_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_groups ALTER COLUMN id SET DEFAULT nextval('public.chat_groups_id_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: grades id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades ALTER COLUMN id SET DEFAULT nextval('public.grades_id_seq'::regclass);


--
-- Name: materials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials ALTER COLUMN id SET DEFAULT nextval('public.materials_id_seq'::regclass);


--
-- Name: otp_verifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_verifications ALTER COLUMN id SET DEFAULT nextval('public.otp_verifications_id_seq'::regclass);


--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: timetable_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries ALTER COLUMN id SET DEFAULT nextval('public.timetable_entries_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.announcements VALUES (1, 'Welcome to the Course!', 'Please review the syllabus uploaded in materials.', 2, 1, false, true, false, NULL, NULL, '2026-05-04 01:03:29.446249', '2026-05-04 01:03:29.446249');


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.assignments VALUES (1, 'Mid-Term Project', 'Submit project report', NULL, 1, 2, '2026-05-11 01:03:29.443079', '23:59', 100, NULL, NULL, true, '2026-05-04 01:03:29.443079', '2026-05-04 01:03:29.443079');


--
-- Data for Name: chat_group_members; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: chat_groups; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chat_messages VALUES (1, 2, 7, 'Welcome to the class! Let me know if you have questions.', true, '2026-05-04 01:03:29.447523', NULL, NULL, NULL);
INSERT INTO public.chat_messages VALUES (2, 7, 2, 'Goodevening sir', true, '2026-05-04 01:30:56.137069', NULL, NULL, NULL);
INSERT INTO public.chat_messages VALUES (3, 2, 7, 'Good evening deepika', true, '2026-05-04 01:31:10.82083', NULL, NULL, NULL);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.courses VALUES (1, 'CSE401', 'Core Computer Science 1', 'Fundamental course', 4, 'Engineering', 'CSE', 'core', 4, 2, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.373698', '2026-05-04 01:03:29.373698');
INSERT INTO public.courses VALUES (2, 'CSE402', 'Core Computer Science 2', 'Advanced course', 4, 'Engineering', 'CSE', 'core', 4, 2, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.382916', '2026-05-04 01:03:29.382916');
INSERT INTO public.courses VALUES (3, 'CSE40E', 'Elective Computer Science', 'Specialization course', 3, 'Engineering', 'CSE', 'elective', 4, 2, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.384028', '2026-05-04 01:03:29.384028');
INSERT INTO public.courses VALUES (4, 'AI401', 'Core Artificial Intelligence 1', 'Fundamental course', 4, 'Engineering', 'AI', 'core', 4, 3, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.384869', '2026-05-04 01:03:29.384869');
INSERT INTO public.courses VALUES (5, 'AI402', 'Core Artificial Intelligence 2', 'Advanced course', 4, 'Engineering', 'AI', 'core', 4, 3, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.385479', '2026-05-04 01:03:29.385479');
INSERT INTO public.courses VALUES (6, 'AI40E', 'Elective Artificial Intelligence', 'Specialization course', 3, 'Engineering', 'AI', 'elective', 4, 3, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.386322', '2026-05-04 01:03:29.386322');
INSERT INTO public.courses VALUES (7, 'MEC401', 'Core Mechatronics 1', 'Fundamental course', 4, 'Engineering', 'MEC', 'core', 4, 4, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.387135', '2026-05-04 01:03:29.387135');
INSERT INTO public.courses VALUES (8, 'MEC402', 'Core Mechatronics 2', 'Advanced course', 4, 'Engineering', 'MEC', 'core', 4, 4, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.387606', '2026-05-04 01:03:29.387606');
INSERT INTO public.courses VALUES (9, 'MEC40E', 'Elective Mechatronics', 'Specialization course', 3, 'Engineering', 'MEC', 'elective', 4, 4, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.388027', '2026-05-04 01:03:29.388027');
INSERT INTO public.courses VALUES (10, 'ECE401', 'Core Electronics and Communication 1', 'Fundamental course', 4, 'Engineering', 'ECE', 'core', 4, 5, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.388504', '2026-05-04 01:03:29.388504');
INSERT INTO public.courses VALUES (11, 'ECE402', 'Core Electronics and Communication 2', 'Advanced course', 4, 'Engineering', 'ECE', 'core', 4, 5, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.38891', '2026-05-04 01:03:29.38891');
INSERT INTO public.courses VALUES (12, 'ECE40E', 'Elective Electronics and Communication', 'Specialization course', 3, 'Engineering', 'ECE', 'elective', 4, 5, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.389234', '2026-05-04 01:03:29.389234');
INSERT INTO public.courses VALUES (13, 'BIT401', 'Core Biotechnology 1', 'Fundamental course', 4, 'Engineering', 'BIT', 'core', 4, 6, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.389537', '2026-05-04 01:03:29.389537');
INSERT INTO public.courses VALUES (14, 'BIT402', 'Core Biotechnology 2', 'Advanced course', 4, 'Engineering', 'BIT', 'core', 4, 6, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.389836', '2026-05-04 01:03:29.389836');
INSERT INTO public.courses VALUES (15, 'BIT40E', 'Elective Biotechnology', 'Specialization course', 3, 'Engineering', 'BIT', 'elective', 4, 6, 'Spring 2024', NULL, NULL, NULL, 60, true, '2026-05-04 01:03:29.39012', '2026-05-04 01:03:29.39012');


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.enrollments VALUES (1, 7, 1, '2026-05-04 01:03:29.390793', 'active');
INSERT INTO public.enrollments VALUES (2, 7, 2, '2026-05-04 01:03:29.394553', 'active');
INSERT INTO public.enrollments VALUES (3, 7, 3, '2026-05-04 01:03:29.394979', 'active');
INSERT INTO public.enrollments VALUES (4, 8, 1, '2026-05-04 01:03:29.395661', 'active');
INSERT INTO public.enrollments VALUES (5, 8, 2, '2026-05-04 01:03:29.395981', 'active');
INSERT INTO public.enrollments VALUES (6, 8, 3, '2026-05-04 01:03:29.396345', 'active');
INSERT INTO public.enrollments VALUES (7, 9, 1, '2026-05-04 01:03:29.396998', 'active');
INSERT INTO public.enrollments VALUES (8, 9, 2, '2026-05-04 01:03:29.397297', 'active');
INSERT INTO public.enrollments VALUES (9, 9, 3, '2026-05-04 01:03:29.397549', 'active');
INSERT INTO public.enrollments VALUES (10, 10, 1, '2026-05-04 01:03:29.398074', 'active');
INSERT INTO public.enrollments VALUES (11, 10, 2, '2026-05-04 01:03:29.398475', 'active');
INSERT INTO public.enrollments VALUES (12, 10, 3, '2026-05-04 01:03:29.398731', 'active');
INSERT INTO public.enrollments VALUES (13, 11, 1, '2026-05-04 01:03:29.399315', 'active');
INSERT INTO public.enrollments VALUES (14, 11, 2, '2026-05-04 01:03:29.399593', 'active');
INSERT INTO public.enrollments VALUES (15, 11, 3, '2026-05-04 01:03:29.399962', 'active');
INSERT INTO public.enrollments VALUES (16, 12, 1, '2026-05-04 01:03:29.400543', 'active');
INSERT INTO public.enrollments VALUES (17, 12, 2, '2026-05-04 01:03:29.400842', 'active');
INSERT INTO public.enrollments VALUES (18, 12, 3, '2026-05-04 01:03:29.401166', 'active');
INSERT INTO public.enrollments VALUES (19, 13, 1, '2026-05-04 01:03:29.401726', 'active');
INSERT INTO public.enrollments VALUES (20, 13, 2, '2026-05-04 01:03:29.401997', 'active');
INSERT INTO public.enrollments VALUES (21, 13, 3, '2026-05-04 01:03:29.402293', 'active');
INSERT INTO public.enrollments VALUES (22, 14, 1, '2026-05-04 01:03:29.402944', 'active');
INSERT INTO public.enrollments VALUES (23, 14, 2, '2026-05-04 01:03:29.403144', 'active');
INSERT INTO public.enrollments VALUES (24, 14, 3, '2026-05-04 01:03:29.403332', 'active');
INSERT INTO public.enrollments VALUES (25, 15, 1, '2026-05-04 01:03:29.403827', 'active');
INSERT INTO public.enrollments VALUES (26, 15, 2, '2026-05-04 01:03:29.404131', 'active');
INSERT INTO public.enrollments VALUES (27, 15, 3, '2026-05-04 01:03:29.404509', 'active');
INSERT INTO public.enrollments VALUES (28, 16, 1, '2026-05-04 01:03:29.405332', 'active');
INSERT INTO public.enrollments VALUES (29, 16, 2, '2026-05-04 01:03:29.405747', 'active');
INSERT INTO public.enrollments VALUES (30, 16, 3, '2026-05-04 01:03:29.406088', 'active');
INSERT INTO public.enrollments VALUES (31, 17, 4, '2026-05-04 01:03:29.406858', 'active');
INSERT INTO public.enrollments VALUES (32, 17, 5, '2026-05-04 01:03:29.407493', 'active');
INSERT INTO public.enrollments VALUES (33, 17, 6, '2026-05-04 01:03:29.407882', 'active');
INSERT INTO public.enrollments VALUES (34, 18, 4, '2026-05-04 01:03:29.408502', 'active');
INSERT INTO public.enrollments VALUES (35, 18, 5, '2026-05-04 01:03:29.408802', 'active');
INSERT INTO public.enrollments VALUES (36, 18, 6, '2026-05-04 01:03:29.409219', 'active');
INSERT INTO public.enrollments VALUES (37, 19, 4, '2026-05-04 01:03:29.412489', 'active');
INSERT INTO public.enrollments VALUES (38, 19, 5, '2026-05-04 01:03:29.41275', 'active');
INSERT INTO public.enrollments VALUES (39, 19, 6, '2026-05-04 01:03:29.412953', 'active');
INSERT INTO public.enrollments VALUES (40, 20, 4, '2026-05-04 01:03:29.413361', 'active');
INSERT INTO public.enrollments VALUES (41, 20, 5, '2026-05-04 01:03:29.413528', 'active');
INSERT INTO public.enrollments VALUES (42, 20, 6, '2026-05-04 01:03:29.413695', 'active');
INSERT INTO public.enrollments VALUES (43, 21, 4, '2026-05-04 01:03:29.414107', 'active');
INSERT INTO public.enrollments VALUES (44, 21, 5, '2026-05-04 01:03:29.414302', 'active');
INSERT INTO public.enrollments VALUES (45, 21, 6, '2026-05-04 01:03:29.414498', 'active');
INSERT INTO public.enrollments VALUES (46, 22, 4, '2026-05-04 01:03:29.414926', 'active');
INSERT INTO public.enrollments VALUES (47, 22, 5, '2026-05-04 01:03:29.415085', 'active');
INSERT INTO public.enrollments VALUES (48, 22, 6, '2026-05-04 01:03:29.415548', 'active');
INSERT INTO public.enrollments VALUES (49, 23, 4, '2026-05-04 01:03:29.416067', 'active');
INSERT INTO public.enrollments VALUES (50, 23, 5, '2026-05-04 01:03:29.416229', 'active');
INSERT INTO public.enrollments VALUES (51, 23, 6, '2026-05-04 01:03:29.416356', 'active');
INSERT INTO public.enrollments VALUES (52, 24, 4, '2026-05-04 01:03:29.416746', 'active');
INSERT INTO public.enrollments VALUES (53, 24, 5, '2026-05-04 01:03:29.416966', 'active');
INSERT INTO public.enrollments VALUES (54, 24, 6, '2026-05-04 01:03:29.417147', 'active');
INSERT INTO public.enrollments VALUES (55, 25, 4, '2026-05-04 01:03:29.417513', 'active');
INSERT INTO public.enrollments VALUES (56, 25, 5, '2026-05-04 01:03:29.417678', 'active');
INSERT INTO public.enrollments VALUES (57, 25, 6, '2026-05-04 01:03:29.417832', 'active');
INSERT INTO public.enrollments VALUES (58, 26, 4, '2026-05-04 01:03:29.418161', 'active');
INSERT INTO public.enrollments VALUES (59, 26, 5, '2026-05-04 01:03:29.418303', 'active');
INSERT INTO public.enrollments VALUES (60, 26, 6, '2026-05-04 01:03:29.419956', 'active');
INSERT INTO public.enrollments VALUES (61, 27, 7, '2026-05-04 01:03:29.420508', 'active');
INSERT INTO public.enrollments VALUES (62, 27, 8, '2026-05-04 01:03:29.420646', 'active');
INSERT INTO public.enrollments VALUES (63, 27, 9, '2026-05-04 01:03:29.420789', 'active');
INSERT INTO public.enrollments VALUES (64, 28, 7, '2026-05-04 01:03:29.421205', 'active');
INSERT INTO public.enrollments VALUES (65, 28, 8, '2026-05-04 01:03:29.421365', 'active');
INSERT INTO public.enrollments VALUES (66, 28, 9, '2026-05-04 01:03:29.421515', 'active');
INSERT INTO public.enrollments VALUES (67, 29, 7, '2026-05-04 01:03:29.421914', 'active');
INSERT INTO public.enrollments VALUES (68, 29, 8, '2026-05-04 01:03:29.422123', 'active');
INSERT INTO public.enrollments VALUES (69, 29, 9, '2026-05-04 01:03:29.422304', 'active');
INSERT INTO public.enrollments VALUES (70, 30, 7, '2026-05-04 01:03:29.422696', 'active');
INSERT INTO public.enrollments VALUES (71, 30, 8, '2026-05-04 01:03:29.422885', 'active');
INSERT INTO public.enrollments VALUES (72, 30, 9, '2026-05-04 01:03:29.423052', 'active');
INSERT INTO public.enrollments VALUES (73, 31, 7, '2026-05-04 01:03:29.423414', 'active');
INSERT INTO public.enrollments VALUES (74, 31, 8, '2026-05-04 01:03:29.423575', 'active');
INSERT INTO public.enrollments VALUES (75, 31, 9, '2026-05-04 01:03:29.423744', 'active');
INSERT INTO public.enrollments VALUES (76, 32, 7, '2026-05-04 01:03:29.424104', 'active');
INSERT INTO public.enrollments VALUES (77, 32, 8, '2026-05-04 01:03:29.424264', 'active');
INSERT INTO public.enrollments VALUES (78, 32, 9, '2026-05-04 01:03:29.42442', 'active');
INSERT INTO public.enrollments VALUES (79, 33, 7, '2026-05-04 01:03:29.424817', 'active');
INSERT INTO public.enrollments VALUES (80, 33, 8, '2026-05-04 01:03:29.425005', 'active');
INSERT INTO public.enrollments VALUES (81, 33, 9, '2026-05-04 01:03:29.425165', 'active');
INSERT INTO public.enrollments VALUES (82, 34, 7, '2026-05-04 01:03:29.425664', 'active');
INSERT INTO public.enrollments VALUES (83, 34, 8, '2026-05-04 01:03:29.425815', 'active');
INSERT INTO public.enrollments VALUES (84, 34, 9, '2026-05-04 01:03:29.425984', 'active');
INSERT INTO public.enrollments VALUES (85, 35, 7, '2026-05-04 01:03:29.426325', 'active');
INSERT INTO public.enrollments VALUES (86, 35, 8, '2026-05-04 01:03:29.426588', 'active');
INSERT INTO public.enrollments VALUES (87, 35, 9, '2026-05-04 01:03:29.426933', 'active');
INSERT INTO public.enrollments VALUES (88, 36, 7, '2026-05-04 01:03:29.427338', 'active');
INSERT INTO public.enrollments VALUES (89, 36, 8, '2026-05-04 01:03:29.427498', 'active');
INSERT INTO public.enrollments VALUES (90, 36, 9, '2026-05-04 01:03:29.427637', 'active');
INSERT INTO public.enrollments VALUES (91, 37, 10, '2026-05-04 01:03:29.428029', 'active');
INSERT INTO public.enrollments VALUES (92, 37, 11, '2026-05-04 01:03:29.428197', 'active');
INSERT INTO public.enrollments VALUES (93, 37, 12, '2026-05-04 01:03:29.428344', 'active');
INSERT INTO public.enrollments VALUES (94, 38, 10, '2026-05-04 01:03:29.428664', 'active');
INSERT INTO public.enrollments VALUES (95, 38, 11, '2026-05-04 01:03:29.428814', 'active');
INSERT INTO public.enrollments VALUES (96, 38, 12, '2026-05-04 01:03:29.428994', 'active');
INSERT INTO public.enrollments VALUES (97, 39, 10, '2026-05-04 01:03:29.430671', 'active');
INSERT INTO public.enrollments VALUES (98, 39, 11, '2026-05-04 01:03:29.430843', 'active');
INSERT INTO public.enrollments VALUES (99, 39, 12, '2026-05-04 01:03:29.431006', 'active');
INSERT INTO public.enrollments VALUES (100, 40, 10, '2026-05-04 01:03:29.43129', 'active');
INSERT INTO public.enrollments VALUES (101, 40, 11, '2026-05-04 01:03:29.431435', 'active');
INSERT INTO public.enrollments VALUES (102, 40, 12, '2026-05-04 01:03:29.431569', 'active');
INSERT INTO public.enrollments VALUES (103, 41, 10, '2026-05-04 01:03:29.431897', 'active');
INSERT INTO public.enrollments VALUES (104, 41, 11, '2026-05-04 01:03:29.432053', 'active');
INSERT INTO public.enrollments VALUES (105, 41, 12, '2026-05-04 01:03:29.432199', 'active');
INSERT INTO public.enrollments VALUES (106, 42, 10, '2026-05-04 01:03:29.43259', 'active');
INSERT INTO public.enrollments VALUES (107, 42, 11, '2026-05-04 01:03:29.432758', 'active');
INSERT INTO public.enrollments VALUES (108, 42, 12, '2026-05-04 01:03:29.432912', 'active');
INSERT INTO public.enrollments VALUES (109, 43, 10, '2026-05-04 01:03:29.433235', 'active');
INSERT INTO public.enrollments VALUES (110, 43, 11, '2026-05-04 01:03:29.433379', 'active');
INSERT INTO public.enrollments VALUES (111, 43, 12, '2026-05-04 01:03:29.433512', 'active');
INSERT INTO public.enrollments VALUES (112, 44, 10, '2026-05-04 01:03:29.433925', 'active');
INSERT INTO public.enrollments VALUES (113, 44, 11, '2026-05-04 01:03:29.434048', 'active');
INSERT INTO public.enrollments VALUES (114, 44, 12, '2026-05-04 01:03:29.434162', 'active');
INSERT INTO public.enrollments VALUES (115, 45, 10, '2026-05-04 01:03:29.434429', 'active');
INSERT INTO public.enrollments VALUES (116, 45, 11, '2026-05-04 01:03:29.434718', 'active');
INSERT INTO public.enrollments VALUES (117, 45, 12, '2026-05-04 01:03:29.434908', 'active');
INSERT INTO public.enrollments VALUES (118, 46, 10, '2026-05-04 01:03:29.435297', 'active');
INSERT INTO public.enrollments VALUES (119, 46, 11, '2026-05-04 01:03:29.43545', 'active');
INSERT INTO public.enrollments VALUES (120, 46, 12, '2026-05-04 01:03:29.435572', 'active');
INSERT INTO public.enrollments VALUES (121, 47, 13, '2026-05-04 01:03:29.435854', 'active');
INSERT INTO public.enrollments VALUES (122, 47, 14, '2026-05-04 01:03:29.436022', 'active');
INSERT INTO public.enrollments VALUES (123, 47, 15, '2026-05-04 01:03:29.436175', 'active');
INSERT INTO public.enrollments VALUES (124, 48, 13, '2026-05-04 01:03:29.436461', 'active');
INSERT INTO public.enrollments VALUES (125, 48, 14, '2026-05-04 01:03:29.436587', 'active');
INSERT INTO public.enrollments VALUES (126, 48, 15, '2026-05-04 01:03:29.436702', 'active');
INSERT INTO public.enrollments VALUES (127, 49, 13, '2026-05-04 01:03:29.436973', 'active');
INSERT INTO public.enrollments VALUES (128, 49, 14, '2026-05-04 01:03:29.437098', 'active');
INSERT INTO public.enrollments VALUES (129, 49, 15, '2026-05-04 01:03:29.437246', 'active');
INSERT INTO public.enrollments VALUES (130, 50, 13, '2026-05-04 01:03:29.437609', 'active');
INSERT INTO public.enrollments VALUES (131, 50, 14, '2026-05-04 01:03:29.437794', 'active');
INSERT INTO public.enrollments VALUES (132, 50, 15, '2026-05-04 01:03:29.437972', 'active');
INSERT INTO public.enrollments VALUES (133, 51, 13, '2026-05-04 01:03:29.438309', 'active');
INSERT INTO public.enrollments VALUES (134, 51, 14, '2026-05-04 01:03:29.438445', 'active');
INSERT INTO public.enrollments VALUES (135, 51, 15, '2026-05-04 01:03:29.43858', 'active');
INSERT INTO public.enrollments VALUES (136, 52, 13, '2026-05-04 01:03:29.438886', 'active');
INSERT INTO public.enrollments VALUES (137, 52, 14, '2026-05-04 01:03:29.439015', 'active');
INSERT INTO public.enrollments VALUES (138, 52, 15, '2026-05-04 01:03:29.440216', 'active');
INSERT INTO public.enrollments VALUES (139, 53, 13, '2026-05-04 01:03:29.440677', 'active');
INSERT INTO public.enrollments VALUES (140, 53, 14, '2026-05-04 01:03:29.440802', 'active');
INSERT INTO public.enrollments VALUES (141, 53, 15, '2026-05-04 01:03:29.440922', 'active');
INSERT INTO public.enrollments VALUES (142, 54, 13, '2026-05-04 01:03:29.441247', 'active');
INSERT INTO public.enrollments VALUES (143, 54, 14, '2026-05-04 01:03:29.441412', 'active');
INSERT INTO public.enrollments VALUES (144, 54, 15, '2026-05-04 01:03:29.441562', 'active');
INSERT INTO public.enrollments VALUES (145, 55, 13, '2026-05-04 01:03:29.44188', 'active');
INSERT INTO public.enrollments VALUES (146, 55, 14, '2026-05-04 01:03:29.44203', 'active');
INSERT INTO public.enrollments VALUES (147, 55, 15, '2026-05-04 01:03:29.442203', 'active');
INSERT INTO public.enrollments VALUES (148, 56, 13, '2026-05-04 01:03:29.442569', 'active');
INSERT INTO public.enrollments VALUES (149, 56, 14, '2026-05-04 01:03:29.44272', 'active');
INSERT INTO public.enrollments VALUES (150, 56, 15, '2026-05-04 01:03:29.44287', 'active');


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.materials VALUES (1, 'Lecture 1 Slides', 'Course Intro', 1, 2, '/uploads/lecture1.pdf', NULL, '1MB', 'pdf', 0, '2026-05-04 01:03:29.445764', '2026-05-04 01:03:29.445764');
INSERT INTO public.materials VALUES (2, 'jd', '', 2, 2, '/uploads/1777838403261-AI_Intern_Job_Description.pdf', 'AI Intern Job Description.pdf', '0.1 MB', 'pdf', 0, '2026-05-04 01:30:03.280554', '2026-05-04 01:30:03.280554');


--
-- Data for Name: otp_verifications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.otp_verifications VALUES (5, 'himasree2507@gmail.com', '562029', '{"name": "Himasree Dintakurthy", "role": "student", "batch": "2023", "email": "himasree2507@gmail.com", "branch": "AI", "department": "AI", "designation": "", "enrollment_id": "SE23UARI032", "password_hash": "$2b$10$FqR9t2w/KD4o9C2/CT9BWul2bonj2FWgTaN7SspDJXY.TElIpGFqC"}', '2026-03-21 12:11:12.432', '2026-03-21 12:01:12.5099');
INSERT INTO public.otp_verifications VALUES (18, 'prof.ece2@academa.edu', '531996', '{"type": "password_reset"}', '2026-05-03 01:20:45.117', '2026-05-03 01:10:45.166956');


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: timetable_entries; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'Admin User', 'admin@academa.edu', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'admin', 'Administration', NULL, NULL, NULL, NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.351993', '2026-05-04 01:03:29.351993');
INSERT INTO public.users VALUES (3, 'Prof. Aditi Borkar', 'prof.ai1@academa.edu', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'faculty', 'Artificial Intelligence', NULL, NULL, NULL, 'Professor', NULL, true, true, true, NULL, '2026-05-04 01:03:29.371037', '2026-05-04 01:03:29.371037');
INSERT INTO public.users VALUES (4, 'Prof. Vijay Chowdhury', 'prof.mec1@academa.edu', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'faculty', 'Mechatronics', NULL, NULL, NULL, 'Professor', NULL, true, true, true, NULL, '2026-05-04 01:03:29.37188', '2026-05-04 01:03:29.37188');
INSERT INTO public.users VALUES (5, 'Prof. Ishaan Tiwari', 'prof.ece1@academa.edu', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'faculty', 'Electronics and Communication', NULL, NULL, NULL, 'Professor', NULL, true, true, true, NULL, '2026-05-04 01:03:29.372432', '2026-05-04 01:03:29.372432');
INSERT INTO public.users VALUES (6, 'Prof. Pooja Kumar', 'prof.bit1@academa.edu', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'faculty', 'Biotechnology', NULL, NULL, NULL, 'Professor', NULL, true, true, true, NULL, '2026-05-04 01:03:29.373103', '2026-05-04 01:03:29.373103');
INSERT INTO public.users VALUES (8, 'Sai Chowdhury', 'mu24ucse002@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE002', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.39533', '2026-05-04 01:03:29.39533');
INSERT INTO public.users VALUES (9, 'Shaurya Shah', 'mu24ucse003@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE003', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.396693', '2026-05-04 01:03:29.396693');
INSERT INTO public.users VALUES (10, 'Priya Nadimpalli', 'mu24ucse004@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE004', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.397812', '2026-05-04 01:03:29.397812');
INSERT INTO public.users VALUES (11, 'Harshitha Mishra', 'mu24ucse005@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE005', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.398991', '2026-05-04 01:03:29.398991');
INSERT INTO public.users VALUES (12, 'Riya Roy', 'mu24ucse006@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE006', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.400241', '2026-05-04 01:03:29.400241');
INSERT INTO public.users VALUES (13, 'Krishna Nair', 'mu24ucse007@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE007', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.401425', '2026-05-04 01:03:29.401425');
INSERT INTO public.users VALUES (14, 'Kavya Roy', 'mu24ucse008@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE008', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.402612', '2026-05-04 01:03:29.402612');
INSERT INTO public.users VALUES (15, 'Divya Pillai', 'mu24ucse009@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE009', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.40355', '2026-05-04 01:03:29.40355');
INSERT INTO public.users VALUES (16, 'Nikhil Reddy', 'mu24ucse010@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE010', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.404896', '2026-05-04 01:03:29.404896');
INSERT INTO public.users VALUES (17, 'Pooja Borkar', 'mu24uari001@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI001', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.40642', '2026-05-04 01:03:29.40642');
INSERT INTO public.users VALUES (18, 'Siddharth Dintakurthy', 'mu24uari002@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI002', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.408171', '2026-05-04 01:03:29.408171');
INSERT INTO public.users VALUES (19, 'Shaurya Pillai', 'mu24uari003@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI003', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.409394', '2026-05-04 01:03:29.409394');
INSERT INTO public.users VALUES (20, 'Pooja Agarwal', 'mu24uari004@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI004', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.413126', '2026-05-04 01:03:29.413126');
INSERT INTO public.users VALUES (21, 'Ishaan Nair', 'mu24uari005@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI005', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.413877', '2026-05-04 01:03:29.413877');
INSERT INTO public.users VALUES (22, 'Rohan Kolla', 'mu24uari006@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI006', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.41472', '2026-05-04 01:03:29.41472');
INSERT INTO public.users VALUES (23, 'Ayaan Tiwari', 'mu24uari007@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI007', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.415704', '2026-05-04 01:03:29.415704');
INSERT INTO public.users VALUES (24, 'Swati Kolla', 'mu24uari008@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI008', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.41649', '2026-05-04 01:03:29.41649');
INSERT INTO public.users VALUES (25, 'Ishaan Iyer', 'mu24uari009@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI009', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.41732', '2026-05-04 01:03:29.41732');
INSERT INTO public.users VALUES (26, 'Akash Chowdhury', 'mu24uari010@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'AI', '2024', 'MU24UARI010', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.417989', '2026-05-04 01:03:29.417989');
INSERT INTO public.users VALUES (27, 'Sneha Patel', 'mu24umec001@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC001', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.420327', '2026-05-04 01:03:29.420327');
INSERT INTO public.users VALUES (28, 'Krishna Nadimpalli', 'mu24umec002@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC002', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.420957', '2026-05-04 01:03:29.420957');
INSERT INTO public.users VALUES (29, 'Siddharth Singh', 'mu24umec003@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC003', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.421696', '2026-05-04 01:03:29.421696');
INSERT INTO public.users VALUES (30, 'Ayaan Rao', 'mu24umec004@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC004', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.422496', '2026-05-04 01:03:29.422496');
INSERT INTO public.users VALUES (31, 'Kavya Shah', 'mu24umec005@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC005', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.423217', '2026-05-04 01:03:29.423217');
INSERT INTO public.users VALUES (32, 'Deepika Patel', 'mu24umec006@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC006', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.423918', '2026-05-04 01:03:29.423918');
INSERT INTO public.users VALUES (33, 'Saanvi Patel', 'mu24umec007@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC007', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.42461', '2026-05-04 01:03:29.42461');
INSERT INTO public.users VALUES (34, 'Vihaan Roy', 'mu24umec008@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC008', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.42532', '2026-05-04 01:03:29.42532');
INSERT INTO public.users VALUES (35, 'Akash Iyer', 'mu24umec009@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC009', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.426137', '2026-05-04 01:03:29.426137');
INSERT INTO public.users VALUES (36, 'Aditya Kolla', 'mu24umec010@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'MEC', '2024', 'MU24UMEC010', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.427137', '2026-05-04 01:03:29.427137');
INSERT INTO public.users VALUES (37, 'Sneha Shah', 'mu24uece001@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE001', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.427805', '2026-05-04 01:03:29.427805');
INSERT INTO public.users VALUES (38, 'Sai Bansal', 'mu24uece002@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE002', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.428489', '2026-05-04 01:03:29.428489');
INSERT INTO public.users VALUES (2, 'Prof. Arjun Garg', 'prof.cse1@academa.edu', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'faculty', 'Computer Science', NULL, NULL, NULL, 'Professor', NULL, true, true, true, '2026-05-04 01:20:34.01918', '2026-05-04 01:03:29.368845', '2026-05-04 01:03:29.368845');
INSERT INTO public.users VALUES (39, 'Diya Nair', 'mu24uece003@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE003', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.429188', '2026-05-04 01:03:29.429188');
INSERT INTO public.users VALUES (40, 'Diya Kumar', 'mu24uece004@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE004', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.431136', '2026-05-04 01:03:29.431136');
INSERT INTO public.users VALUES (41, 'Aditya Patel', 'mu24uece005@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE005', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.431726', '2026-05-04 01:03:29.431726');
INSERT INTO public.users VALUES (42, 'Sunil Nair', 'mu24uece006@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE006', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.432383', '2026-05-04 01:03:29.432383');
INSERT INTO public.users VALUES (43, 'Deepika Roy', 'mu24uece007@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE007', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.433059', '2026-05-04 01:03:29.433059');
INSERT INTO public.users VALUES (44, 'Vijay Mishra', 'mu24uece008@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE008', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.433674', '2026-05-04 01:03:29.433674');
INSERT INTO public.users VALUES (45, 'Vihaan Borkar', 'mu24uece009@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE009', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.434287', '2026-05-04 01:03:29.434287');
INSERT INTO public.users VALUES (46, 'Nikhil Singh', 'mu24uece010@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'ECE', '2024', 'MU24UECE010', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.435072', '2026-05-04 01:03:29.435072');
INSERT INTO public.users VALUES (47, 'Akash Agarwal', 'mu24ubit001@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT001', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.43571', '2026-05-04 01:03:29.43571');
INSERT INTO public.users VALUES (48, 'Aadhya Tiwari', 'mu24ubit002@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT002', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.436306', '2026-05-04 01:03:29.436306');
INSERT INTO public.users VALUES (49, 'Nikhil Patel', 'mu24ubit003@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT003', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.436824', '2026-05-04 01:03:29.436824');
INSERT INTO public.users VALUES (50, 'Aadhya Verma', 'mu24ubit004@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT004', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.437414', '2026-05-04 01:03:29.437414');
INSERT INTO public.users VALUES (51, 'Vivaan Agarwal', 'mu24ubit005@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT005', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.438147', '2026-05-04 01:03:29.438147');
INSERT INTO public.users VALUES (52, 'Deepika Garg', 'mu24ubit006@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT006', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.438728', '2026-05-04 01:03:29.438728');
INSERT INTO public.users VALUES (53, 'Neha Kumar', 'mu24ubit007@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT007', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.440511', '2026-05-04 01:03:29.440511');
INSERT INTO public.users VALUES (54, 'Siddharth Gupta', 'mu24ubit008@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT008', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.441047', '2026-05-04 01:03:29.441047');
INSERT INTO public.users VALUES (55, 'Vivaan Shah', 'mu24ubit009@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT009', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.441709', '2026-05-04 01:03:29.441709');
INSERT INTO public.users VALUES (56, 'Tanvi Nair', 'mu24ubit010@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'BIT', '2024', 'MU24UBIT010', NULL, NULL, true, true, true, NULL, '2026-05-04 01:03:29.442375', '2026-05-04 01:03:29.442375');
INSERT INTO public.users VALUES (7, 'Deepika Reddy', 'mu24ucse001@mahindrauniversity.edu.in', '$2b$10$BWcALRXC8KQP8w63Z8rQiuEtGqhtK8nhZz8apCNZACB6FmHSltX/i', 'student', 'Engineering', 'CSE', '2024', 'MU24UCSE001', NULL, NULL, true, true, true, '2026-05-04 01:28:51.468086', '2026-05-04 01:03:29.390461', '2026-05-04 01:03:29.390461');


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.announcements_id_seq', 1, true);


--
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assignments_id_seq', 1, true);


--
-- Name: chat_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_groups_id_seq', 1, false);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 3, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.courses_id_seq', 15, true);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 150, true);


--
-- Name: grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.grades_id_seq', 1, false);


--
-- Name: materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.materials_id_seq', 2, true);


--
-- Name: otp_verifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.otp_verifications_id_seq', 18, true);


--
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.submissions_id_seq', 1, false);


--
-- Name: timetable_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.timetable_entries_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 56, true);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: chat_group_members chat_group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_group_members
    ADD CONSTRAINT chat_group_members_pkey PRIMARY KEY (group_id, user_id);


--
-- Name: chat_groups chat_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_groups
    ADD CONSTRAINT chat_groups_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: courses courses_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_code_key UNIQUE (code);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_student_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_course_id_key UNIQUE (student_id, course_id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: otp_verifications otp_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_verifications
    ADD CONSTRAINT otp_verifications_pkey PRIMARY KEY (id);


--
-- Name: submissions submissions_assignment_id_student_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_assignment_id_student_id_key UNIQUE (assignment_id, student_id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: timetable_entries timetable_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT timetable_entries_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_enrollment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_enrollment_id_key UNIQUE (enrollment_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_assignments_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assignments_course ON public.assignments USING btree (course_id);


--
-- Name: idx_chat_users; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_users ON public.chat_messages USING btree (sender_id, receiver_id);


--
-- Name: idx_enrollments_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enrollments_course ON public.enrollments USING btree (course_id);


--
-- Name: idx_enrollments_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_enrollments_student ON public.enrollments USING btree (student_id);


--
-- Name: idx_submissions_assignment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submissions_assignment ON public.submissions USING btree (assignment_id);


--
-- Name: idx_timetable_branch; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_timetable_branch ON public.timetable_entries USING btree (branch, semester_number);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: announcements announcements_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: announcements announcements_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: assignments assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: assignments assignments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: chat_group_members chat_group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_group_members
    ADD CONSTRAINT chat_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.chat_groups(id) ON DELETE CASCADE;


--
-- Name: chat_group_members chat_group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_group_members
    ADD CONSTRAINT chat_group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_groups chat_groups_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_groups
    ADD CONSTRAINT chat_groups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.chat_groups(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: grades grades_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: materials materials_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: materials materials_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: submissions submissions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_graded_by_fkey FOREIGN KEY (graded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: submissions submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: timetable_entries timetable_entries_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timetable_entries
    ADD CONSTRAINT timetable_entries_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--



