--
-- PostgreSQL database dump
--

\restrict QQA5DFyQ0de0tUYclSetyPfwoM5PCdDEiOuTg6Ml8apbDFt6TcJk8UJWx2vqywb

-- Dumped from database version 16.11 (f45eb12)
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
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (4, 'Nathalie', 'nathalie.zabolo@gmail.com', '$2b$10$QXhjfMP99zyhtuyTPpQJIuGBE58s.VC9HcmB60hv1o661yhcdXbbK', 'regional_leader', 'north_america', '2025-06-25 02:33:34.68983', NULL, NULL, NULL, false, NULL, NULL, false, NULL, NULL, true, NULL);
INSERT INTO public.users VALUES (5, '', 'xvseoinfo@gmail.com', '$2b$10$Svs5V4Q17RuDRQOuOMQLgOoIbgFT5rTHHd/kefuMwZf5T3L2TMO5C', 'watchman', 'south_america', '2025-06-25 02:39:33.72381', NULL, NULL, NULL, false, NULL, NULL, false, NULL, NULL, true, NULL);
INSERT INTO public.users VALUES (6, 'Sylvie Michele', 'sylviezabolo@gmail.com', '$2b$10$s0HCslohOknVf4FjNhu/iu1mWMsEdHGYEaAxeKtHyP7fjpXh3n4XC', 'watchman', 'europe', '2025-08-27 03:14:08.953251', NULL, NULL, NULL, false, NULL, NULL, false, NULL, NULL, true, NULL);
INSERT INTO public.users VALUES (7, 'Olivier Baba Sire', 'ezabolo@scenergylink.com', '$2b$10$M7eF8ppHULRmOxewSAI13.D5ITkSWXJxDig3fRZka1R12enOto2M2', 'partner', 'north_america', '2025-10-23 20:56:03.277112', NULL, NULL, NULL, false, NULL, NULL, false, NULL, NULL, true, NULL);
INSERT INTO public.users VALUES (8, '', 'euzab@gmail.com', '$2b$10$b4tROPUMDBp896WeWf/MR.rxRaCE99dzmmDF1OgEu7Ybk8cO0Xok2', 'partner', 'africa', '2025-10-23 20:57:42.2365', NULL, NULL, NULL, false, NULL, NULL, false, NULL, NULL, true, NULL);
INSERT INTO public.users VALUES (3, 'Jordan Zabolo', 'jordan.zabolo@gmail.com', '$2b$10$iNGXuXrapxA3QxBHDBdv8edVp6H5bxomawHc/atwW3dxRe5LfgH5W', 'partner', 'north_america', '2025-06-25 02:26:36.447106', NULL, NULL, NULL, false, NULL, NULL, true, NULL, NULL, true, '2026-01-19 21:13:02.902');
INSERT INTO public.users VALUES (1, 'EUGENE O ZABOLO', 'eugene.zabolo@gmail.com', '$2b$10$ebSzAXu.bhcIqZ9Lm2ciE.wZGq4FTkEXZ5/g0xzCVOv4nmRVwEQcm', 'watchman', 'north_america', '2025-06-20 05:01:44.837947', NULL, NULL, NULL, false, NULL, NULL, true, NULL, NULL, true, '2026-01-19 22:23:03.002');
INSERT INTO public.users VALUES (2, 'Admin User', 'admin@prayerwatchman.org', '$2b$10$C/yLc6enruskHXwivx6KnuR0WLghb61M7YI7cSgO2.T8O5jeDJoqi', 'admin', 'africa', '2025-06-21 03:41:56.089601', NULL, NULL, NULL, false, NULL, NULL, true, NULL, NULL, true, '2026-01-20 01:41:17.879');


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.books VALUES (1, 'The Power of Intercessory Prayer', 'Dutch Sheets', 'A comprehensive guide to understanding and practicing effective intercessory prayer for personal and global transformation.', 15.99, NULL, NULL, 'English', NULL, NULL, 'Prayer & Intercession', 50, '2025-07-24 19:10:04.083417', NULL, '/uploads/front_cover-1756260501226-420826055.png', NULL, false, '');
INSERT INTO public.books VALUES (2, ' Mouvement De Priere des sentinelles: Selon le Cœur du Père', 'Dr Moussa Toure', '
Mouvement De Priere Des Sentinelles: Selon le Cœur du Père', 25.00, NULL, NULL, 'English', NULL, NULL, 'Prayer & Intercession', 20, '2025-07-24 20:06:53.776935', 2, '/uploads/front_cover-1753387612953-19277777.png', '/uploads/back_cover-1753387613349-565337976.png', false, 'https://www.amazon.com/Watchmen-Prayer-Movement-Mountain-Fathers/dp/B0DL13ZHVX/ref=sr_1_2?crid=16ORTIW43CKJ8&dib=eyJ2IjoiMSJ9.bvtHlbzs3mlrNznxZtDQJJDPewOETg1MNpU--GUzejDGjHj071QN20LucGBJIEps.p8oCbuaCbNDVAH8oZ5AF_kEpMVMQ3iyGBjYP4nl43xo&dib_tag=se&keywords=Dr+Moussa+Toure&qid=1754799764&sprefix=dr+moussa+toure%2Caps%2C157&sr=8-2');
INSERT INTO public.books VALUES (3, 'Loose Him', 'Dr Moussa Toure', 'Believers across this nation and around the world are overwhelmed, oppressed, struggling, and defeated in their attempt to live the abundant life Christ came to give them. I am convinced, however, that if more churches would embrace the ministry of deliverance and employ a systematic approach in offering deliverance, the results would be phenomenal. Instead of an army of weak and ineff ective believers, a new generation of bold conquerors set free by God and empowered to set others free would arise. Dr. Moussa Touré has released a powerful weapon against the prince of darkness in his new book, "Loose Him and Let Him Go!" Intellectually prepared to analyze the problems and research the issues, Dr. Touré is experienced in the subject of deliverance and addresses herein the controversies that unfortunately surround and hinder the ministry of deliverance. If you, as an individual, or your church need theological and practical help to remove one of the major obstacles to spiritual growth-demonic oppression-this is the book for you! Dr. Touré is also the author of The Prayer Warrior''s Confession," a document to help believers "hold fast ''their'' profession." He and his wife, Esther, have two children, Yannick and Faith.', 25.00, NULL, NULL, 'English', NULL, NULL, 'Prayer & Intercession', 0, '2025-08-10 04:24:24.347922', 2, '/uploads/front_cover-1754799861804-519553616.png', NULL, false, 'https://www.amazon.com/Loose-Him-Let-Go/dp/1632320827/ref=sr_1_1?dib=eyJ2IjoiMSJ9.bvtHlbzs3mlrNznxZtDQJJDPewOETg1MNpU--GUzejDGjHj071QN20LucGBJIEps.p8oCbuaCbNDVAH8oZ5AF_kEpMVMQ3iyGBjYP4nl43xo&dib_tag=se&keywords=Dr+Moussa+Toure&qid=1754799825&sr=8-1');


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cart_items VALUES (1, 2, 2, 1, '2025-07-24 20:10:25.595162');


--
-- Data for Name: trainings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.trainings VALUES (2, 'Basic Prayer Techniques', 'Learn fundamental prayer methods and techniques for effective intercession.', 'video', NULL, '2025-07-01 03:19:16.640175', 2);
INSERT INTO public.trainings VALUES (4, 'How to pray the word of God', 'powerful 30-minute training outline on "How to Pray the Word of God", ideal for use in small groups, churches, prayer meetings, or online classes. This structure blends teaching, scripture, and practical prayer practice.', 'video', NULL, '2025-07-10 21:01:19.681417', NULL);
INSERT INTO public.trainings VALUES (5, 'Effective prayer', 'The structured Training Curriculum for Prayer Watchmen, organized into chapters and sections, with biblical references and suggested YouTube resources (for each chapter).', 'video', NULL, '2025-08-17 05:31:39.060802', NULL);


--
-- Data for Name: chapters; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.chapters VALUES (9, 2, 'Introduction to Prayer', 1, '2025-07-10 20:24:26.629968');
INSERT INTO public.chapters VALUES (10, 2, 'Chapter 2 How to grow in Prayer', 2, '2025-07-10 20:24:26.75483');
INSERT INTO public.chapters VALUES (11, 4, 'Welcome & Purpose ', 1, '2025-07-10 21:01:20.016183');
INSERT INTO public.chapters VALUES (12, 4, 'Why Pray the Word? ', 2, '2025-07-10 21:01:20.20919');
INSERT INTO public.chapters VALUES (13, 5, 'Chapter 1 - The Call of a Watchman', 1, '2025-08-17 05:31:39.398927');
INSERT INTO public.chapters VALUES (14, 5, 'Chapter 2 - The Watchman’s Foundation: Holiness & Obedience', 2, '2025-08-17 05:31:39.591408');
INSERT INTO public.chapters VALUES (15, 5, 'Chapter 3 - The Prayer Watchman’s Armor', 3, '2025-08-17 05:31:39.774578');
INSERT INTO public.chapters VALUES (16, 5, 'Chapter 4 -Types of Watches in Prayer', 4, '2025-08-17 05:31:39.952109');


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.events VALUES (1, 'Prayer for Nations Test', 'A test prayer event', 'Kenya, Nairobi', 'intercessory', 2, NULL, NULL, NULL, '2025-07-01 10:00:00', '2025-07-01 12:00:00', NULL, NULL, NULL);
INSERT INTO public.events VALUES (2, 'Prayer for Central African Republic', 'We will gather in Central African Republic to intercede for the nation', 'Bangui, Central African Republic', 'intercessory', 2, NULL, NULL, NULL, '2025-07-20 03:09:00', '2025-07-20 05:09:00', NULL, NULL, NULL);
INSERT INTO public.events VALUES (3, 'Prayer for Nations - Worldwide Intercession', 'Nations need change. Yet the change they need will not come from the United Nations neither our authorities. It will ONLY come from God and will ONLY begin with us God’s people coming together, in one accord, in a unified effort that transcends all denominational and cultural, ethnical and racial barriers, to Him in prayer for the change that the nations need, exactly like in the book of Acts on the day of Pentecost.

We have a great opportunity and privilege of joining all watchmen worldwide each year on Saturday before Pentecost Sunday to weep between the porch and the Lord’s Altar, saying:

“Spare your people/ “the nations”, O LORD; (Joel 2:17b)
FOR YOU GOD make nations great, and destroy them; YOU enlarge nations, and disperse them (Job12:23-25)
“Blessed is the nation whose God is the LORD, the people He chose for His inheritance” (Psalm 33:12)

We travail/ cry out for the nations of the world per continent (North, Central, South America; Africa; Asia; Australia; the Islands; Europe). We also enhance our prayer that day with fasting on that day.

Praying for nations is scriptural: “Ask of Me, and I will give you (us in Christ Jesus) the nations for your inheritance…” (Psalm 2:8)

“Even those I will bring to My holy mountain and make them joyful in My house of prayer. Their burnt offerings and their sacrifices will be acceptable on My altar; For My house will be called a house of prayer for all the peoples.” (Isaiah 56:7)

"And He began to teach and say to them, “Is it not written, ‘My house shall be called a house of prayer for all the nations’? But you have made it a robbers’ den.” (Mark 11:17)

As said Robert Sterns: “There is only one house that the Lord is building.” Jesus said and repeated, “My house shall be called a house of prayer for all nations”. And in these last days, we are seeing the restoration of God’s house of prayer in the earth.

The Lord Who called us to pray for our own land/nation is also pointing to high levels of intercession /supplication/ travail for all lands/all nations.

To stand before God on behalf of one person or one nation is one thing; to stand before God on behalf of nations is something entirely different and praying for the whole world seems to be a vast task but God knows no boundaries, no limit.

So where and how should we start:

Repentance: “If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then will I hear from heaven and will forgive their sin and will heal their land.” (2 Chronicles 7:14)

God’s promises here are real changes (forgiveness, spiritual deliverance and healing for our souls and our lands) if we will truly humble ourselves in repentant-prayer before Him:

For ourselves,
On behalf of the Church of our Lord Jesus Christ in our nation and in the nations of the world;
On behalf of our authorities and the authorities worldwide,
On behalf of our nation and the nations worldwide.', 'Harvest Church, Washington DC', 'intercessory', 2, NULL, NULL, NULL, '2025-08-03 15:20:00', '2025-08-03 17:20:00', NULL, NULL, NULL);
INSERT INTO public.events VALUES (5, 'Watchman Convention', 'Watchman Convention se tiendra a Liege en Belgique', 'Liege, Belgique', 'other', 2, 'Watchman Convention se tiendra a Liege en Belgique', '/uploads/file-1753390161347-554627690.png', '{/uploads/file-1753390161347-554627690.png}', '2025-09-20 00:47:00', '2025-09-22 02:47:00', NULL, NULL, NULL);
INSERT INTO public.events VALUES (4, 'Interceding for a Nation – Healing, Peace & Restoration for Burkina Faso', 'Join us at Harvest Church of Burkina Faso on Friday, August 15th, 2025 for a special national prayer gathering, as believers across the region come together in unity to pray for the peace, security, and spiritual revival of Burkina Faso.

This powerful event will bring together pastors, intercessors, worship teams, and believers from all walks of life with one purpose: to seek God’s intervention for the nation. We will lift up prayers for:

Peace and stability across all regions

Protection and strength for our leaders and armed forces

Revival and healing within the Church and communities

Economic restoration and divine provision

Unity among tribes, tongues, and generations

The day will feature anointed worship, prophetic intercession, scripture declarations, and times of silence and reflection, led by spiritual leaders from across the country.', 'Ouagadougou, Burkina Faso', 'intercessory', 2, 'Join us at Harvest Church of Burkina Faso on Friday, August 15th, 2025 for a special national prayer gathering, as believers across the region come together in unity to pray for the peace, security, and spiritual revival of Burkina Faso.

This powerful event will bring together pastors, intercessors, worship teams, and believers from all walks of life with one purpose: to seek God’s intervention for the nation. We will lift up prayers for:

Peace and stability across all regions

Protection and strength for our leaders and armed forces

Revival and healing within the Church and communities

Economic restoration and divine provision

Unity among tribes, tongues, and generations

The day will feature anointed worship, prophetic intercession, scripture declarations, and times of silence and reflection, led by spiritual leaders from across the country.', '/uploads/file-1753372613475-619647595.png', '{/uploads/file-1753372613475-619647595.png,/uploads/file-1756259980390-851991413.mp4}', '2025-08-15 15:50:00', '2025-08-15 17:50:00', NULL, NULL, NULL);
INSERT INTO public.events VALUES (6, 'Youth Meetup in Liege', 'Youth Meetup in Liege - Belgium 
Conference ', 'Liege - Belgium', 'intercessory', 2, 'Youth Meetup in Liege - Belgium 
Conference ', '/uploads/file-1756263797810-178847230.png', '{/uploads/file-1756263797810-178847230.png}', '2025-08-30 10:30:00', '2025-08-31 17:00:00', 'Amavi  Toure', '5408501015', 'xvseoinfo@gmail.com');


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: partner_contributions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: prayer_requests; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: progress; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.progress VALUES (3, 3, 2, false, 100, NULL);
INSERT INTO public.progress VALUES (4, 3, 4, false, 50, NULL);
INSERT INTO public.progress VALUES (2, 1, 4, true, 100, '2025-08-27 01:11:01.065');
INSERT INTO public.progress VALUES (6, 3, 5, true, 100, '2025-08-27 01:45:05.86');
INSERT INTO public.progress VALUES (1, 1, 2, true, 100, '2025-08-31 15:06:23.891');
INSERT INTO public.progress VALUES (5, 1, 5, false, 14, '2025-08-17 05:45:30.071');


--
-- Data for Name: project_budgets; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: project_participants; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sections VALUES (9, 9, 'What is Prayer?', 'Prayer is communication with God...', '/uploads/file-1751376910051-388916908.mp4', NULL, 1, '2025-07-10 20:24:26.694789');
INSERT INTO public.sections VALUES (10, 10, 'Section 1 Lesson to learn', '', '/uploads/file-1752176439731-92289179.mp4', NULL, 1, '2025-07-10 20:24:26.813926');
INSERT INTO public.sections VALUES (11, 10, 'Section 2 - Learn to pray from the bible', '', '/uploads/file-1752179054497-769679689.mp4', NULL, 2, '2025-07-10 20:24:26.873233');
INSERT INTO public.sections VALUES (12, 11, 'Quick welcome and opening prayer.', '', '/uploads/file-1752181117065-785134750.mp4', NULL, 1, '2025-07-10 21:01:20.079258');
INSERT INTO public.sections VALUES (13, 11, 'State the purpose: "We are learning to pray in a way that aligns with God’s heart, using His Word as the', '', '/uploads/file-1752181163822-372182675.mp4', NULL, 2, '2025-07-10 21:01:20.144795');
INSERT INTO public.sections VALUES (14, 12, 'Isaiah 55:11 – "So shall My word be that goes forth from My mouth; it shall not return to Me void..."', '', '/uploads/file-1752181212566-445471513.mp4', NULL, 1, '2025-07-10 21:01:20.268588');
INSERT INTO public.sections VALUES (15, 12, 'Hebrews 4:12 – "For the Word of God is alive and active..."', '', '/uploads/file-1752181249587-341854033.mp4', NULL, 2, '2025-07-10 21:01:20.328319');
INSERT INTO public.sections VALUES (16, 13, 'Who is a Watchman?', 'Biblical Reference: Ezekiel 33:6–7, Isaiah 62:6–7
A watchman is one who stands in prayer on behalf of others, alert to the spiritual state of a family, church, or nation.', NULL, NULL, 1, '2025-08-17 05:31:39.461381');
INSERT INTO public.sections VALUES (17, 13, 'The Role of a Prayer Watchman', 'iblical Reference: Habakkuk 2:1, Nehemiah 4:9
Duties: intercession, discernment, warning, declaring God’s will.', 'https://www.youtube.com/shorts/CG42Sat8TEw', NULL, 2, '2025-08-17 05:31:39.525238');
INSERT INTO public.sections VALUES (18, 14, 'Living a Consecrated Life', 'Biblical Reference: 2 Timothy 2:21, Leviticus 20:7
Holiness sharpens spiritual discernment.', NULL, NULL, 1, '2025-08-17 05:31:39.650665');
INSERT INTO public.sections VALUES (19, 14, 'The Power of Obedience in Prayer', 'Biblical Reference: 1 Samuel 15:22, John 15:7
Obedience ensures authority in intercession.', 'https://www.youtube.com/watch?v=z_EaKJYz5x0', NULL, 2, '2025-08-17 05:31:39.714948');
INSERT INTO public.sections VALUES (20, 15, 'Spiritual Warfare Armor', 'Biblical Reference: Ephesians 6:10–18
Prayer watchmen must always be “armed” in the Spirit.', NULL, NULL, 1, '2025-08-17 05:31:39.833986');
INSERT INTO public.sections VALUES (21, 15, 'The Power of the Blood, the Word, and the Name of Jesus', 'Biblical Reference: Revelation 12:11, Philippians 2:9–10
Three divine weapons of intercession.', 'https://www.youtube.com/watch?v=P4qhOxxMliw', NULL, 2, '2025-08-17 05:31:39.893116');
INSERT INTO public.sections VALUES (22, 16, 'The Eight Prayer Watches of the Day & Night', 'Biblical Reference: Psalm 119:148, Mark 13:35–37

1st Watch (6pm–9pm): Covenant renewal & protection

2nd Watch (9pm–12am): Warfare against demonic activity

3rd Watch (12am–3am): Divine interventions, angelic activity

4th Watch (3am–6am): Deliverance, seeking God’s presence

5th Watch (6am–9am): Resurrection power & spiritual refreshing

6th Watch (9am–12pm): Prayer for healing, guidance & justice

7th Watch (12pm–3pm): Prayer for strength, repentance, intercession for nations

8th Watch (3pm–6pm): Prayer for breakthroughs and preparation for evening', 'https://www.youtube.com/watch?v=k-lWPuUPilw', NULL, 1, '2025-08-17 05:31:40.011437');


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: -
--



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
-- PostgreSQL database dump complete
--

\unrestrict QQA5DFyQ0de0tUYclSetyPfwoM5PCdDEiOuTg6Ml8apbDFt6TcJk8UJWx2vqywb

