-- =============================================================================
-- ProfileHub Data Seeder for Testing UI
-- Focus: Full Professional Profile (Senior Dev / Tech Lead journey)
--
-- This script inserts comprehensive profiles for 2 users:
-- 1. Andy Nguyen (Vietnamese) - ID: 550e8400-e29b-41d4-a716-446655440000
-- 2. Andy Nguyen (English)    - ID: 550e8400-e29b-41d4-a716-446655440001
--
-- Running this script will generate:
--   - 1 User and 1 Profile per language
--   - 4 Work Experiences (from Intern/Junior to Senior and Tech Lead) with project details
--   - 1 Education entry (HCMC University of Technology)
--   - 12 key skills per profile (Frameworks, Languages, Databases, DevOps, Tools)
--   - 3 Social Links (GitHub, LinkedIn, Personal Website)
-- =============================================================================

-- ── OPTIONAL CLEANUP (Uncomment to reset test users before seeding) ──────────
-- DELETE FROM users WHERE id IN ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001');

-- =============================================================================
-- SECTION 1: VIETNAMESE PROFILE SEEDING
-- =============================================================================

-- 1. Tạo User Test (Bản tiếng Việt)
INSERT INTO users (id, email, username, password_hash, role, is_active, email_verified_at, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'anhnguyen@gmail.com',
  'andynguyen',
  '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', -- mật khẩu là: password123
  'user',
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Tạo Profile "đầy đủ và đẹp" (Bản tiếng Việt)
INSERT INTO profiles (id, user_id, display_name, headline, bio, avatar_url, cover_url, location, industry, visibility, created_at, updated_at)
VALUES (
  '660e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440000',
  'Andy Nguyen',
  'Tech Lead & Solutions Architect | Chuyên gia Cloud & Full-Stack (React, Node.js, Go) | Mentoring & Agile Champion',
  'Tôi là một Tech Lead kiêm Solutions Architect với hơn 8 năm kinh nghiệm trong lĩnh vực phát triển phần mềm, chuyên thiết kế và xây dựng các hệ thống phân tán (Distributed Systems) quy mô lớn, chịu tải cao. Với thế mạnh về Full-Stack (React/Next.js ở frontend và Node.js/Go ở backend) cùng kiến thức sâu rộng về Cloud Computing (AWS/Kubernetes), tôi đã dẫn dắt nhiều đội ngũ phát triển thành công các sản phẩm từ giai đoạn MVP đến khi scale lên hàng triệu người dùng. Tôi luôn đề cao triết lý viết Clean Code, thiết lập quy trình CI/CD chuẩn chỉnh và thúc đẩy văn hóa chia sẻ, phát triển năng lực của từng thành viên trong team.',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  'Ho Chi Minh City, Vietnam',
  'Information Technology',
  'public',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- 3. Thêm Kinh nghiệm làm việc (Experiences) từ Intern -> Tech Lead (Bản tiếng Việt)
INSERT INTO experiences (id, profile_id, job_title, company_name, location, employment_type, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
(
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440000',
  'Tech Lead / Solutions Architect',
  'TechCorp Solutions',
  'Ho Chi Minh City, Vietnam',
  'full_time',
  '2024-01-15',
  NULL,
  true,
  'Dẫn dắt phòng kỹ thuật (15+ engineers) xây dựng nền tảng E-Commerce thế hệ mới dựa trên kiến trúc Microservices và Event-Driven.

[Dự án tiêu biểu: Nền tảng Mega-Cart & Checkout System]
- Mô tả: Hệ thống giỏ hàng và thanh toán chịu tải cao phục vụ các chiến dịch khuyến mãi lớn (Mega Sale), xử lý hơn 50,000 requests/phút.
- Vai trò: Trực tiếp thiết kế kiến trúc hệ thống sử dụng Node.js (NestJS), Apache Kafka cho luồng xử lý bất đồng bộ, Redis Cluster để tối ưu hóa caching giỏ hàng, và PostgreSQL với master-slave replication.
- Thành quả: Giảm tỷ lệ lỗi giao dịch xuống dưới 0.05%, tăng 200% khả năng chịu tải của hệ thống thanh toán, đồng thời giảm chi phí hạ tầng AWS xuống 30% nhờ vào tối ưu hóa tài nguyên trên Kubernetes.

[Công việc khác]
- Xây dựng chuẩn hóa CI/CD pipelines (GitHub Actions, ArgoCD), thiết lập hệ thống giám sát thời gian thực (Prometheus, Grafana, ELK Stack).
- Tổ chức các buổi Tech Sharing hàng tuần và mentoring nâng cấp kỹ năng cho 6 junior/mid devs lên senior.',
  0,
  NOW(),
  NOW()
),
(
  '770e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440000',
  'Senior Software Engineer',
  'VNG Corporation',
  'Ho Chi Minh City, Vietnam',
  'full_time',
  '2021-06-01',
  '2023-12-31',
  false,
  'Phát triển và tối ưu hóa các module cốt lõi của siêu ứng dụng (Super App) phục vụ hàng triệu người dùng hoạt động mỗi ngày.

[Dự án tiêu biểu: Social & Messaging Features Redesign]
- Mô tả: Nâng cấp và tối ưu hóa hệ thống chat thời gian thực và bảng tin hiển thị hoạt động người dùng.
- Vai trò: Lead Frontend Dev phát triển bộ UI Kit tùy biến có hiệu năng cao bằng React Native / TypeScript, tích hợp sâu với WebSockets và SQLite lưu trữ offline. Ở backend, tối ưu hóa các API viết bằng Node.js và Go để truy vấn dữ liệu nhanh hơn.
- Thành quả: Tốc độ tải bảng tin tăng 40%, giảm mức tiêu thụ RAM trên thiết bị di động cũ đi 25%, nâng tỷ lệ phản hồi tin nhắn tức thời (real-time chat latency) xuống dưới 100ms.',
  1,
  NOW(),
  NOW()
),
(
  '770e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440000',
  'Software Engineer',
  'FPT Software',
  'Remote',
  'full_time',
  '2019-01-10',
  '2021-05-31',
  false,
  'Tham gia phát triển các dự án Outsourcing chất lượng cao cho thị trường Singapore và Nhật Bản, làm việc trực tiếp với khách hàng nước ngoài.

[Dự án tiêu biểu: Smart Logistics Management Portal]
- Mô tả: Hệ thống quản lý vận tải, tối ưu hóa tuyến đường giao hàng thời gian thực cho một tập đoàn logistic lớn của Singapore.
- Vai trò: Lập trình viên chính phát triển hệ thống Dashboard trực quan hóa bản đồ số và tracking hành trình (React, Leaflet.js, Redux Saga). Thiết kế cơ sở dữ liệu PostgreSQL định dạng PostGIS phục vụ các truy vấn không gian địa lý.
- Thành quả: Giúp khách hàng tự động hóa 80% quy trình điều phối xe, rút ngắn thời gian giao hàng trung bình khoảng 15%. Xây dựng thành công hệ thống báo cáo tự động giúp ban lãnh đạo theo dõi sát sao KPI vận hành.',
  2,
  NOW(),
  NOW()
),
(
  '770e8400-e29b-41d4-a716-446655440004',
  '660e8400-e29b-41d4-a716-446655440000',
  'Software Engineering Intern',
  'KMS Technology',
  'Ho Chi Minh City, Vietnam',
  'internship',
  '2017-06-01',
  '2018-12-31',
  false,
  'Bắt đầu từ vị trí thực tập sinh (Intern) sau đó được thăng chức lên Junior Software Engineer nhờ thành tích xuất sắc trong các dự án.

[Dự án tiêu biểu: Internal HR Management System]
- Mô tả: Hệ thống quản lý thông tin nhân sự, chấm công và đánh giá hiệu suất làm việc nội bộ của công ty.
- Vai trò: Thực hiện viết API CRUD cơ bản bằng Express.js/Node.js, thiết kế giao diện và bảng chấm công bằng React/Bootstrap. Viết các unit tests bằng Jest để đảm bảo code coverage đạt trên 85%.
- Thành quả: Giúp rút ngắn thời gian xử lý thủ tục nhân sự từ 5 ngày xuống còn vài giờ. Học hỏi thành công quy trình làm việc Agile/Scrum bài bản và nâng cao kỹ năng xử lý bất đồng bộ trong JavaScript/Node.js.',
  3,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 4. Thêm Học vấn (Educations) (Bản tiếng Việt)
INSERT INTO educations (id, profile_id, institution_name, degree, field_of_study, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
(
  '880e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440000',
  'Đại học Bách Khoa TP.HCM',
  'Kỹ sư',
  'Khoa học Máy tính',
  '2014-09-01',
  '2018-06-30',
  false,
  'Tốt nghiệp loại giỏi (GPA: 3.6/4.0). Nhận học bổng khuyến học 4 học kỳ liên tiếp. Giải nhì cuộc thi lập trình sinh viên cấp trường. Luận văn tốt nghiệp về đề tài "Hệ thống khuyến nghị dựa trên Collaborative Filtering và Deep Learning".',
  0,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Thêm Kỹ năng (Skills) phong phú (Bản tiếng Việt)
-- Sử dụng SkillCategory mới: technical | tool | methodology | domain | certification | language | soft_skill | other
INSERT INTO skills (id, profile_id, name, category, endorsement_count, display_order, created_at, updated_at)
VALUES 
-- technical: kỹ năng chuyên môn cốt lõi
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'React / Next.js', 'technical', 45, 0, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'Node.js (NestJS)', 'technical', 38, 1, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', 'TypeScript', 'technical', 52, 2, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440000', 'Go', 'technical', 25, 3, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440000', 'System Design', 'technical', 35, 4, NOW(), NOW()),
-- tool: công cụ & phần mềm
('990e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440000', 'Docker', 'tool', 40, 5, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440000', 'Kubernetes', 'tool', 22, 6, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440000', 'PostgreSQL', 'tool', 30, 7, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440000', 'Redis', 'tool', 32, 8, NOW(), NOW()),
-- methodology: phương pháp & quy trình
('990e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440000', 'Agile / Scrum', 'methodology', 29, 9, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440000', 'CI/CD Pipelines', 'methodology', 28, 10, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440000', 'Microservices Architecture', 'methodology', 19, 11, NOW(), NOW()),
-- certification: chứng chỉ
('990e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440000', 'AWS Certified Solutions Architect', 'certification', 15, 12, NOW(), NOW()),
-- language: ngôn ngữ giao tiếp
('990e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440000', 'English (Professional)', 'language', 8, 13, NOW(), NOW()),
-- soft_skill: kỹ năng mềm
('990e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440000', 'Technical Leadership', 'soft_skill', 33, 14, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440000', 'Mentoring & Coaching', 'soft_skill', 27, 15, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Thêm Liên kết (Social Links) (Bản tiếng Việt)
INSERT INTO social_links (id, profile_id, platform, url, created_at, updated_at)
VALUES 
('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'github', 'https://github.com/andynguyen', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'linkedin', 'https://linkedin.com/in/andynguyen', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000', 'website', 'https://andynguyen.dev', NOW(), NOW())
ON CONFLICT (profile_id, platform) DO NOTHING;


-- =============================================================================
-- SECTION 2: ENGLISH PROFILE SEEDING
-- =============================================================================

-- 1. Tạo User Test (Bản tiếng Anh)
INSERT INTO users (id, email, username, password_hash, role, is_active, email_verified_at, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001', -- ID mới
  'anhnguyen1@gmail.com', -- Email mới
  'andynguyen_en', -- Username mới
  '$2b$12$mG6aQrgz4vvWizDfnEBfOekMwO0bectTfjB4DkSgFZYZAcNndSdyy', -- mật khẩu là: password123
  'user',
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Tạo Profile "đầy đủ và đẹp" (Bản tiếng Anh)
INSERT INTO profiles (id, user_id, display_name, headline, bio, avatar_url, cover_url, location, industry, visibility, created_at, updated_at)
VALUES (
  '660e8400-e29b-41d4-a716-446655440001', -- ID mới
  '550e8400-e29b-41d4-a716-446655440001', -- Link tới User ID ở trên
  'Andy Nguyen',
  'Tech Lead & Solutions Architect | Cloud & Full-Stack Expert (React, Node.js, Go) | Mentoring & Agile Champion',
  'I am a Tech Lead and Solutions Architect with over 8 years of experience in software engineering, specializing in designing and building large-scale, high-concurrency distributed systems. Possessing strong expertise in Full-Stack development (React/Next.js on the frontend and Node.js/Go on the backend) along with in-depth knowledge of Cloud Computing (AWS/Kubernetes), I have successfully led engineering teams to deliver products from early-stage MVPs to scaling for millions of active users. I strongly advocate for clean code practices, robust CI/CD pipelines, and fostering a collaborative team culture that empowers every engineer to grow.',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  'Ho Chi Minh City, Vietnam',
  'Information Technology',
  'public',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- 3. Thêm Kinh nghiệm làm việc (Experiences) từ Intern -> Tech Lead (Bản tiếng Anh)
INSERT INTO experiences (id, profile_id, job_title, company_name, location, employment_type, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
(
  '770e8400-e29b-41d4-a716-446655440005',
  '660e8400-e29b-41d4-a716-446655440001',
  'Tech Lead / Solutions Architect',
  'TechCorp Solutions',
  'Ho Chi Minh City, Vietnam',
  'full_time',
  '2024-01-15',
  NULL,
  true,
  'Led the engineering department (15+ developers) in building a next-generation E-Commerce platform using microservices and event-driven architectures.

[Key Project: Mega-Cart & Checkout System]
- Description: A high-throughput shopping cart and payment processing system capable of handling mega sale campaigns with over 50,000 requests/minute.
- Role: Designed the system architecture using Node.js (NestJS), Apache Kafka for asynchronous event queues, Redis Cluster for cart session caching, and PostgreSQL with read-replicas.
- Impact: Reduced transaction failure rates to under 0.05%, boosted payment throughput by 200%, and decreased monthly AWS infrastructure costs by 30% through optimized Kubernetes cluster resource utilization.

[Other Activities]
- Standardized CI/CD pipelines using GitHub Actions and ArgoCD, implemented real-time monitoring solutions (Prometheus, Grafana, ELK Stack).
- Hosted weekly technical sharing sessions and mentored 6 junior/mid devs to senior levels.',
  0,
  NOW(),
  NOW()
),
(
  '770e8400-e29b-41d4-a716-446655440006',
  '660e8400-e29b-41d4-a716-446655440001',
  'Senior Software Engineer',
  'VNG Corporation',
  'Ho Chi Minh City, Vietnam',
  'full_time',
  '2021-06-01',
  '2023-12-31',
  false,
  'Developed and optimized core modules for a high-traffic Super App serving millions of daily active users.

[Key Project: Social & Messaging Features Redesign]
- Description: Overhauled and optimized the real-time chat infrastructure and user activity feeds.
- Role: Acted as Lead Frontend Developer to create a high-performance custom UI Kit using React Native and TypeScript, deeply integrated with WebSockets and SQLite for offline-first support. Optimized backend REST and WebSocket APIs using Node.js and Go.
- Impact: Accelerated feed loading times by 40%, decreased memory footprint on legacy mobile devices by 25%, and pushed real-time chat latency below 100ms.',
  1,
  NOW(),
  NOW()
),
(
  '770e8400-e29b-41d4-a716-446655440007',
  '660e8400-e29b-41d4-a716-446655440001',
  'Software Engineer',
  'FPT Software',
  'Remote',
  'full_time',
  '2019-01-10',
  '2021-05-31',
  false,
  'Delivered high-quality outsourcing projects for enterprise clients in Singapore and Japan, communicating directly with international stakeholders.

[Key Project: Smart Logistics Management Portal]
- Description: A dispatch and route-optimization portal facilitating real-time tracking for a major Singaporean logistics firm.
- Role: Main developer for the map-based dashboard and fleet tracking features (React, Leaflet.js, Redux Saga). Designed GIS-optimized database tables using PostgreSQL and PostGIS.
- Impact: Automated 80% of vehicle dispatch workflows, shaving off 15% in average delivery times. Engineered automated reporting features that streamlined operations KPIs for the executive board.',
  2,
  NOW(),
  NOW()
),
(
  '770e8400-e29b-41d4-a716-446655440008',
  '660e8400-e29b-41d4-a716-446655440001',
  'Software Engineering Intern',
  'KMS Technology',
  'Ho Chi Minh City, Vietnam',
  'internship',
  '2017-06-01',
  '2018-12-31',
  false,
  'Started as a Software Engineering Intern and was promoted to Junior Developer after demonstrating exceptional performance.

[Key Project: Internal HR Management System]
- Description: An internal system managing employee records, attendance tracking, and performance reviews.
- Role: Wrote backend CRUD REST APIs using Express.js/Node.js, developed timesheet web interfaces using React and Bootstrap, and implemented comprehensive unit tests with Jest to achieve over 85% test coverage.
- Impact: Reduced HR processing turnaround from 5 days to a few hours. Mastered professional Agile/Scrum practices and deepened understanding of asynchronous JavaScript programming.',
  3,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 4. Thêm Học vấn (Educations) (Bản tiếng Anh)
INSERT INTO educations (id, profile_id, institution_name, degree, field_of_study, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
(
  '880e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440001',
  'Ho Chi Minh City University of Technology',
  'Bachelor of Engineering',
  'Computer Science',
  '2014-09-01',
  '2018-06-30',
  false,
  'Graduated with Honors (GPA: 3.6/4.0). Awarded academic merit scholarships for 4 consecutive semesters. Secured 2nd place in the university-wide programming competition. Completed graduation thesis on "Recommendation Systems using Collaborative Filtering and Deep Learning".',
  0,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 5. Thêm Kỹ năng (Skills) phong phú (Bản tiếng Anh)
-- Using new universal SkillCategory: technical | tool | methodology | domain | certification | language | soft_skill | other
INSERT INTO skills (id, profile_id, name, category, endorsement_count, display_order, created_at, updated_at)
VALUES 
-- technical: core professional expertise
('990e8400-e29b-41d4-a716-446655440025', '660e8400-e29b-41d4-a716-446655440001', 'React / Next.js', 'technical', 45, 0, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440026', '660e8400-e29b-41d4-a716-446655440001', 'Node.js (NestJS)', 'technical', 38, 1, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440027', '660e8400-e29b-41d4-a716-446655440001', 'TypeScript', 'technical', 52, 2, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440028', '660e8400-e29b-41d4-a716-446655440001', 'Go', 'technical', 25, 3, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440029', '660e8400-e29b-41d4-a716-446655440001', 'System Design', 'technical', 35, 4, NOW(), NOW()),
-- tool: tools & software
('990e8400-e29b-41d4-a716-446655440030', '660e8400-e29b-41d4-a716-446655440001', 'Docker', 'tool', 40, 5, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440031', '660e8400-e29b-41d4-a716-446655440001', 'Kubernetes', 'tool', 22, 6, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440032', '660e8400-e29b-41d4-a716-446655440001', 'PostgreSQL', 'tool', 30, 7, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440033', '660e8400-e29b-41d4-a716-446655440001', 'Redis', 'tool', 32, 8, NOW(), NOW()),
-- methodology: frameworks & processes
('990e8400-e29b-41d4-a716-446655440034', '660e8400-e29b-41d4-a716-446655440001', 'Agile / Scrum', 'methodology', 29, 9, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440035', '660e8400-e29b-41d4-a716-446655440001', 'CI/CD Pipelines', 'methodology', 28, 10, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440036', '660e8400-e29b-41d4-a716-446655440001', 'Microservices Architecture', 'methodology', 19, 11, NOW(), NOW()),
-- certification: credentials & certifications
('990e8400-e29b-41d4-a716-446655440037', '660e8400-e29b-41d4-a716-446655440001', 'AWS Certified Solutions Architect', 'certification', 15, 12, NOW(), NOW()),
-- language: spoken/written languages
('990e8400-e29b-41d4-a716-446655440038', '660e8400-e29b-41d4-a716-446655440001', 'English (Professional)', 'language', 8, 13, NOW(), NOW()),
-- soft_skill: interpersonal & leadership
('990e8400-e29b-41d4-a716-446655440039', '660e8400-e29b-41d4-a716-446655440001', 'Technical Leadership', 'soft_skill', 33, 14, NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440040', '660e8400-e29b-41d4-a716-446655440001', 'Mentoring & Coaching', 'soft_skill', 27, 15, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO social_links (id, profile_id, platform, url, created_at, updated_at)
VALUES 
('aa0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'github', 'https://github.com/andynguyen', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'linkedin', 'https://linkedin.com/in/andynguyen', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 'website', 'https://andynguyen.dev', NOW(), NOW())
ON CONFLICT (profile_id, platform) DO NOTHING;


-- =============================================================================
-- SECTION 3: OTHER INDUSTRIES - VIETNAMESE
-- =============================================================================

-- 1. Tạo Users cho 6 ngành khác nhau (Bản tiếng Việt)
INSERT INTO users (id, email, username, password_hash, role, is_active, email_verified_at, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440100', 'minh.nguyen@marketing.vn', 'minh_marketing', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440200', 'tuan.tran@finance.vn', 'tuan_finance', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440300', 'hang.pham@edu.vn', 'hang_edu', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440400', 'nam.le@design.vn', 'nam_designer', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440500', 'anh.vu@sales.vn', 'anh_sales', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440600', 'mai.hoang@hr.vn', 'mai_hr', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. Tạo Profiles tương ứng (Bản tiếng Việt)
INSERT INTO profiles (id, user_id, display_name, headline, bio, avatar_url, cover_url, location, industry, visibility, created_at, updated_at)
VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440100', 'Nguyễn Thuỳ Linh', 
    'Digital Marketing Lead | Chuyên gia Performance Marketing & Content Strategy | Tối ưu hoá conversion rate',
    'Tôi là một chuyên gia Digital Marketing với hơn 6 năm kinh nghiệm thực chiến trong việc lập kế hoạch và triển khai các chiến dịch Performance Marketing trên các nền tảng Facebook Ads, Google Ads, TikTok Ads. Từng quản lý ngân sách marketing lên đến hàng tỷ đồng/tháng cho các doanh nghiệp FMCG và E-commerce lớn tại Việt Nam. Thế mạnh lớn nhất của tôi là khả năng phân tích số liệu (Data-driven), thấu hiểu hành vi khách hàng và tối ưu hóa phễu chuyển đổi nhằm tối đa hóa tỷ lệ ROI cho doanh nghiệp.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Ho Chi Minh City, Vietnam', 'Marketing', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440200', 'Trần Minh Tuấn',
    'Kế Toán Trưởng & Chuyên Gia Thuế | CPA Vietnam | Tư vấn cấu trúc tài chính và kiểm soát nội bộ',
    'Với hơn 10 năm kinh nghiệm trong lĩnh vực kế toán và kiểm toán, trong đó có 4 năm làm việc tại Big4 (EY Vietnam), tôi đã trực tiếp đảm nhiệm vai trò Kế toán trưởng cho các tập đoàn bất động sản và dịch vụ lớn. Tôi có thế mạnh về thiết lập hệ thống kiểm soát nội bộ, tối ưu hóa quy trình tài chính kế toán, lập báo cáo tài chính hợp nhất theo chuẩn mực VAS và IFRS, cũng như làm việc trực tiếp với cơ quan thuế để xử lý các vấn đề quyết toán phức tạp.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Hanoi, Vietnam', 'Finance', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440300', '550e8400-e29b-41d4-a716-446655440300', 'Phạm Minh Hằng',
    'Giảng Viên Tiếng Anh & Điều Phối Học Thuật | TESOL Certified | Biên soạn giáo trình & Đào tạo IELTS chuyên sâu',
    'Tôi đã có 7 năm giảng dạy tiếng Anh học thuật và luyện thi IELTS cho học sinh, sinh viên và người đi làm. Hiện tôi là Điều phối viên học thuật, chịu trách nhiệm thiết kế chương trình học và kiểm soát chất lượng giảng dạy của đội ngũ giáo viên. Triết lý dạy học của tôi là truyền cảm hứng, lấy người học làm trung tâm và ứng dụng công nghệ giáo dục (EdTech) để học viên ghi nhớ bài giảng trực quan, chủ động nhất.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Da Nang, Vietnam', 'Education', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440400', '550e8400-e29b-41d4-a716-446655440400', 'Lê Hoàng Nam',
    'Lead Product Designer (UI/UX) | Sáng tạo sản phẩm số tối ưu hoá trải nghiệm người dùng',
    'Tôi là một Nhà thiết kế Sản phẩm Số (Product Designer) có 6 năm kinh nghiệm trong việc xây dựng ứng dụng di động và hệ thống web phức tạp. Tôi tin rằng thiết kế tốt không chỉ là đẹp mắt mà phải giải quyết đúng nỗi đau của người dùng (User Painpoints) và mang lại giá trị kinh tế thực tế cho doanh nghiệp. Có thế mạnh về quy trình Design Thinking, nghiên cứu trải nghiệm (User Research), xây dựng Design System đồng nhất và tối ưu giao diện chuyển đổi số.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Ho Chi Minh City, Vietnam', 'Design', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440500', '550e8400-e29b-41d4-a716-446655440500', 'Vũ Đức Anh',
    'Trưởng Phòng Kinh Doanh B2B | Chuyên phát triển thị trường doanh nghiệp lớn | Bán giải pháp SaaS & Hạ tầng',
    'Chuyên gia phát triển kinh doanh (Business Development) và quản lý bán hàng B2B với hơn 8 năm kinh nghiệm trong ngành Công nghệ và Viễn thông. Từng dẫn dắt đội ngũ bán hàng đạt mức tăng trưởng doanh thu 150% năm. Tôi đam mê áp dụng phương pháp Bán hàng tư vấn (Consultative Selling), xây dựng mối quan hệ bền vững với các khách hàng doanh nghiệp C-level (CEO, CTO, CFO) và mang lại các giải pháp công nghệ thiết thực tối ưu chi phí vận hành.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1552581230-c015286521e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Hanoi, Vietnam', 'Sales', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440600', '550e8400-e29b-41d4-a716-446655440600', 'Hoàng Thanh Mai',
    'HR Business Partner (HRBP) | Chuyên gia Tuyển dụng Nhân tài & Quản trị Trải nghiệm Nhân viên',
    'Tôi là một HRBP với hơn 7 năm kinh nghiệm làm việc trong môi trường các công ty đa quốc gia và tập đoàn lớn của Việt Nam. Chuyên sâu về hoạch định nguồn nhân lực, thiết lập hệ thống đánh giá hiệu suất (KPIs/OKRs), xây dựng chính sách giữ chân nhân tài và tổ chức các chương trình đào tạo phát triển nội bộ. Tôi hướng tới xây dựng một môi trường làm việc hạnh phúc, cởi mở, nơi mỗi cá nhân đều có thể phát huy tối đa tiềm năng của mình.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1521791136364-728647526959?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Ho Chi Minh City, Vietnam', 'Human Resources', 'public', NOW(), NOW()
  )
ON CONFLICT (user_id) DO NOTHING;

-- 3. Thêm Kinh nghiệm làm việc (Bản tiếng Việt)
INSERT INTO experiences (id, profile_id, job_title, company_name, location, employment_type, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
  -- Marketing
  ('770e8400-e29b-41d4-a716-446655440101', '660e8400-e29b-41d4-a716-446655440100', 'Digital Marketing Lead', 'Vingroup JSC', 'Hanoi, Vietnam', 'full_time', '2022-01-01', NULL, true, 'Quản lý đội ngũ 6 nhân sự Performance & Content. Lập chiến lược digital marketing tổng thể cho các dự án bất động sản lớn của Vinhomes. Trực tiếp phân bổ ngân sách quảng cáo hơn 2 tỷ/tháng, tối ưu hóa CPL (Cost Per Lead) giảm 25% qua từng chiến dịch.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440102', '660e8400-e29b-41d4-a716-446655440100', 'Digital Marketing Specialist', 'Ogilvy Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2019-06-01', '2021-12-31', false, 'Lên kế hoạch và trực tiếp chạy quảng cáo (Facebook, Google, TikTok) cho các nhãn hàng tiêu dùng nhanh (FMCG) như Unilever, Nestle. Triển khai các hệ thống báo cáo hiệu quả quảng cáo tự động hóa bằng Looker Studio.', 1, NOW(), NOW()),

  -- Finance
  ('770e8400-e29b-41d4-a716-446655440201', '660e8400-e29b-41d4-a716-446655440200', 'Kế Toán Trưởng (Chief Accountant)', 'Sun Group', 'Da Nang, Vietnam', 'full_time', '2021-03-01', NULL, true, 'Chịu trách nhiệm toàn bộ hoạt động tài chính, kế toán và nghĩa vụ thuế của đơn vị thành viên. Lập báo cáo tài chính tháng/quý/năm chuẩn VAS và báo cáo hợp nhất nộp tập đoàn. Đàm phán trực tiếp với các tổ chức tín dụng để thu xếp vốn vay dự án trị giá hàng trăm tỷ đồng.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440202', '660e8400-e29b-41d4-a716-446655440200', 'Kiểm Toán Viên Cấp Cao (Senior Auditor)', 'EY Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2017-09-01', '2021-02-28', false, 'Trưởng nhóm kiểm toán (Job-in-charge) thực hiện kiểm toán báo cáo tài chính cho các khách hàng lớn thuộc ngành sản xuất, bán lẻ và năng lượng. Tư vấn cho ban quản lý doanh nghiệp khách hàng cải thiện quy trình kiểm soát nội bộ và quản trị rủi ro.', 1, NOW(), NOW()),

  -- Education
  ('770e8400-e29b-41d4-a716-446655440301', '660e8400-e29b-41d4-a716-446655440300', 'Academic Coordinator', 'Hệ thống Anh ngữ Hội Việt Mỹ (VUS)', 'Ho Chi Minh City, Vietnam', 'full_time', '2020-08-01', NULL, true, 'Quản lý chất lượng giảng dạy tại cơ sở. Biên soạn, hiệu chỉnh giáo trình các khoá học IELTS và tiếng Anh giao tiếp. Đào tạo nghiệp vụ sư phạm thường niên cho hơn 30 giáo viên Việt Nam và bản xứ. Tổ chức thành công các hội thảo chia sẻ phương pháp học tiếng Anh thu hút hơn 500 phụ huynh tham gia.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440302', '660e8400-e29b-41d4-a716-446655440300', 'Giáo Viên Tiếng Anh (English Teacher)', 'ILA Vietnam', 'Ho Chi Minh City, Vietnam', 'part_time', '2016-10-01', '2020-07-31', false, 'Giảng dạy các lớp tiếng Anh thiếu nhi, thiếu niên và luyện thi IELTS. Thiết kế bài giảng tương tác ứng dụng các trò chơi công nghệ kích thích tư duy. Giúp hơn 80% học viên lớp luyện thi đạt mục tiêu đầu ra IELTS từ 6.5 trở lên.', 1, NOW(), NOW()),

  -- Design
  ('770e8400-e29b-41d4-a716-446655440401', '660e8400-e29b-41d4-a716-446655440400', 'Lead Product Designer', 'MoMo (Ví điện tử)', 'Ho Chi Minh City, Vietnam', 'full_time', '2022-04-01', NULL, true, 'Dẫn dắt nhóm thiết kế 4 thành viên chịu trách nhiệm nâng cấp trải nghiệm người dùng cho module Thanh toán & Tài chính. Nghiên cứu hành vi người dùng, vẽ luồng trải nghiệm (User Flows), thiết kế wireframes độ phân giải cao và thực hiện các buổi Usability Testing diện rộng.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440402', '660e8400-e29b-41d4-a716-446655440400', 'UI/UX Designer', 'Shopee Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2019-01-15', '2022-03-31', false, 'Thiết kế giao diện các chương trình khuyến mãi mua sắm lớn (11.11, 12.12). Phối hợp chặt chẽ với team Tech (Frontend Engineers) để tối ưu hoá hiệu năng hiển thị hình ảnh và animation trên mobile app. Đóng góp xây dựng thư viện Shopee Design System toàn cầu.', 1, NOW(), NOW()),

  -- Sales
  ('770e8400-e29b-41d4-a716-446655440501', '660e8400-e29b-41d4-a716-446655440500', 'Trưởng Phòng Kinh Doanh B2B', 'Viettel Enterprise Solutions', 'Hanoi, Vietnam', 'full_time', '2021-05-10', NULL, true, 'Quản lý danh mục khách hàng doanh nghiệp thuộc khối ngân hàng và tài chính công. Dẫn dắt đội nhóm 8 chuyên viên kinh doanh chào thầu và ký kết thành công các dự án triển khai hạ tầng đám mây (Private Cloud) và giải pháp chữ ký số trị giá triệu USD.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440502', '660e8400-e29b-41d4-a716-446655440500', 'Business Development Specialist', 'Grab Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2018-07-01', '2021-04-30', false, 'Phát triển thị trường GrabFood và GrabMart tại khu vực phía Nam. Đàm phán và kết nối thành công hơn 200 chuỗi nhà hàng ẩm thực lớn (KFC, Lotteria, The Coffee House...) gia nhập nền tảng. Đạt KPI doanh số vượt 120% liên tục 3 quý.', 1, NOW(), NOW()),

  -- HR
  ('770e8400-e29b-41d4-a716-446655440601', '660e8400-e29b-41d4-a716-446655440600', 'HR Business Partner', 'Vinamilk', 'Ho Chi Minh City, Vietnam', 'full_time', '2020-11-01', NULL, true, 'Đồng hành cùng khối Kinh Doanh (Sales Department) trong các vấn đề nhân sự. Thiết kế và triển khai lộ trình thăng tiến nghề nghiệp rõ ràng cho nhân viên sales thị trường. Trực tiếp giải quyết các vấn đề quan hệ lao động phức tạp và tư vấn quản trị hiệu suất công việc.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440602', '660e8400-e29b-41d4-a716-446655440600', 'Talent Acquisition Specialist', 'Adecco Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2017-03-01', '2020-10-31', false, 'Tư vấn và cung cấp dịch vụ tuyển dụng nhân sự cấp cao (Headhunting) cho các đối tác nước ngoài thuộc mảng Sản xuất và Bán lẻ. Tìm kiếm, sàng lọc hồ sơ và phỏng vấn trực tiếp hàng nghìn ứng viên trung và cao cấp.', 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Thêm Học vấn (Bản tiếng Việt)
INSERT INTO educations (id, profile_id, institution_name, degree, field_of_study, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
  ('880e8400-e29b-41d4-a716-446655440101', '660e8400-e29b-41d4-a716-446655440100', 'Đại học Ngoại Thương', 'Cử nhân', 'Quản trị Kinh doanh & Marketing', '2015-09-01', '2019-06-30', false, 'Tốt nghiệp loại Giỏi. Trưởng ban truyền thông câu lạc bộ Marketing FTU. Đạt giải Ba cuộc thi Bản lĩnh Marketer toàn quốc.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440201', '660e8400-e29b-41d4-a716-446655440200', 'Đại học Kinh tế TP.HCM', 'Cử nhân', 'Kế toán & Kiểm toán chuyên nghiệp', '2013-09-01', '2017-06-30', false, 'Tốt nghiệp loại Xuất sắc. Đạt học bổng toàn phần tài năng trẻ EY Career Path.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440301', '660e8400-e29b-41d4-a716-446655440300', 'Đại học Sư phạm TP.HCM', 'Cử nhân', 'Sư phạm Tiếng Anh', '2012-09-01', '2016-06-30', false, 'Thủ khoa đầu ra khoa Tiếng Anh. Giải Nhất cuộc thi Nghiệp vụ sư phạm cấp Thành phố.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440401', '660e8400-e29b-41d4-a716-446655440400', 'Đại học Kiến trúc TP.HCM', 'Cử nhân', 'Thiết kế Đồ hoạ & Mỹ thuật Công nghiệp', '2014-09-01', '2019-06-30', false, 'Tốt nghiệp loại Giỏi. Đề tài tốt nghiệp đạt giải thiết kế sáng tạo của Viện Mỹ thuật quốc gia.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440501', '660e8400-e29b-41d4-a716-446655440500', 'Đại học Ngoại Thương', 'Cử nhân', 'Kinh tế Đối ngoại', '2014-09-01', '2018-06-30', false, 'Tốt nghiệp loại Giỏi. Thành viên đội tuyển tranh biện quốc tế FTU.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440601', '660e8400-e29b-41d4-a716-446655440600', 'Đại học Khoa học Xã hội và Nhân văn TP.HCM', 'Cử nhân', 'Tâm lý học Tổ chức', '2013-09-01', '2017-06-30', false, 'Tốt nghiệp loại Giỏi. Đạt giải nhì công trình nghiên cứu khoa học cấp Bộ về chủ đề "Động lực làm việc của Gen Z tại công sở".', 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Thêm Kỹ năng đa ngành chuẩn mới (Bản tiếng Việt)
INSERT INTO skills (id, profile_id, name, category, endorsement_count, display_order, created_at, updated_at)
VALUES 
  -- Marketing
  ('990e8400-e29b-41d4-a716-446655440101', '660e8400-e29b-41d4-a716-446655440100', 'Google Ads / Facebook Ads', 'technical', 35, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440102', '660e8400-e29b-41d4-a716-446655440100', 'Google Analytics & Looker Studio', 'tool', 28, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440103', '660e8400-e29b-41d4-a716-446655440100', 'Inbound Marketing Strategy', 'methodology', 25, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440104', '660e8400-e29b-41d4-a716-446655440100', 'E-commerce Optimization', 'domain', 20, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440105', '660e8400-e29b-41d4-a716-446655440100', 'Google Ads Search Certification', 'certification', 15, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440106', '660e8400-e29b-41d4-a716-446655440100', 'English (Fluent)', 'language', 18, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440107', '660e8400-e29b-41d4-a716-446655440100', 'Creative Thinking', 'soft_skill', 33, 6, NOW(), NOW()),

  -- Finance
  ('990e8400-e29b-41d4-a716-446655440201', '660e8400-e29b-41d4-a716-446655440200', 'Báo Cáo Tài Chính Hợp Nhất', 'technical', 42, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440202', '660e8400-e29b-41d4-a716-446655440200', 'SAP ERP & MS Excel Advanced', 'tool', 36, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440203', '660e8400-e29b-41d4-a716-446655440200', 'IFRS Standards', 'methodology', 30, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440204', '660e8400-e29b-41d4-a716-446655440200', 'Real Estate Finance', 'domain', 24, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440205', '660e8400-e29b-41d4-a716-446655440200', 'CPA Vietnam Certified', 'certification', 29, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440206', '660e8400-e29b-41d4-a716-446655440200', 'English (Professional)', 'language', 15, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440207', '660e8400-e29b-41d4-a716-446655440200', 'Attention to Detail', 'soft_skill', 38, 6, NOW(), NOW()),

  -- Education
  ('990e8400-e29b-41d4-a716-446655440301', '660e8400-e29b-41d4-a716-446655440300', 'Curriculum Development', 'technical', 29, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440302', '660e8400-e29b-41d4-a716-446655440300', 'Google Classroom & Zoom', 'tool', 31, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440303', '660e8400-e29b-41d4-a716-446655440300', 'Communicative Teaching', 'methodology', 35, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440304', '660e8400-e29b-41d4-a716-446655440300', 'Language Pedagogy', 'domain', 27, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440305', '660e8400-e29b-41d4-a716-446655440300', 'CELTA Certificate', 'certification', 22, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440306', '660e8400-e29b-41d4-a716-446655440300', 'English (Near-Native)', 'language', 40, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440307', '660e8400-e29b-41d4-a716-446655440300', 'Patience & Mentoring', 'soft_skill', 45, 6, NOW(), NOW()),

  -- Design
  ('990e8400-e29b-41d4-a716-446655440401', '660e8400-e29b-41d4-a716-446655440400', 'UI/UX Visual Design', 'technical', 48, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440402', '660e8400-e29b-41d4-a716-446655440400', 'Figma & Adobe CC', 'tool', 55, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440403', '660e8400-e29b-41d4-a716-446655440400', 'Design Thinking Framework', 'methodology', 39, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440404', '660e8400-e29b-41d4-a716-446655440400', 'Mobile Apps (FinTech)', 'domain', 31, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440405', '660e8400-e29b-41d4-a716-446655440400', 'Google UX Design Certificate', 'certification', 26, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440406', '660e8400-e29b-41d4-a716-446655440400', 'English (Professional)', 'language', 22, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440407', '660e8400-e29b-41d4-a716-446655440400', 'User Empathy', 'soft_skill', 43, 6, NOW(), NOW()),

  -- Sales
  ('990e8400-e29b-41d4-a716-446655440501', '660e8400-e29b-41d4-a716-446655440500', 'B2B Negotiation', 'technical', 37, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440502', '660e8400-e29b-41d4-a716-446655440500', 'Salesforce & LinkedIn Sales Nav', 'tool', 29, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440503', '660e8400-e29b-41d4-a716-446655440500', 'Consultative Selling System', 'methodology', 32, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440504', '660e8400-e29b-41d4-a716-446655440500', 'Cloud & Telecom Services', 'domain', 26, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440505', '660e8400-e29b-41d4-a716-446655440500', 'English (Fluent)', 'language', 25, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440506', '660e8400-e29b-41d4-a716-446655440500', 'Active Listening', 'soft_skill', 41, 5, NOW(), NOW()),

  -- HR
  ('990e8400-e29b-41d4-a716-446655440601', '660e8400-e29b-41d4-a716-446655440600', 'Talent Acquisition & Sourcing', 'technical', 39, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440602', '660e8400-e29b-41d4-a716-446655440600', 'Base HRM & Google Workspace', 'tool', 26, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440603', '660e8400-e29b-41d4-a716-446655440600', 'Competency-Based Interviewing', 'methodology', 33, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440604', '660e8400-e29b-41d4-a716-446655440600', 'Employee Relations & Engagement', 'domain', 28, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440605', '660e8400-e29b-41d4-a716-446655440600', 'SHRM-CP Certified', 'certification', 19, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440606', '660e8400-e29b-41d4-a716-446655440600', 'English (Professional)', 'language', 20, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440607', '660e8400-e29b-41d4-a716-446655440600', 'Conflict Resolution', 'soft_skill', 34, 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Thêm Liên kết (Social Links) (Bản tiếng Việt)
INSERT INTO social_links (id, profile_id, platform, url, created_at, updated_at)
VALUES 
  ('aa0e8400-e29b-41d4-a716-446655440111', '660e8400-e29b-41d4-a716-446655440100', 'linkedin', 'https://linkedin.com/in/linhnguyen-marketing', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440112', '660e8400-e29b-41d4-a716-446655440100', 'website', 'https://linhnguyen.marketing', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440211', '660e8400-e29b-41d4-a716-446655440200', 'linkedin', 'https://linkedin.com/in/tuantran-cpa', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440311', '660e8400-e29b-41d4-a716-446655440300', 'linkedin', 'https://linkedin.com/in/hangpham-edu', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440411', '660e8400-e29b-41d4-a716-446655440400', 'linkedin', 'https://linkedin.com/in/namle-design', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440412', '660e8400-e29b-41d4-a716-446655440400', 'website', 'https://namle.design', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440511', '660e8400-e29b-41d4-a716-446655440500', 'linkedin', 'https://linkedin.com/in/anhvu-sales', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440611', '660e8400-e29b-41d4-a716-446655440600', 'linkedin', 'https://linkedin.com/in/maihoang-hr', NOW(), NOW())
ON CONFLICT (profile_id, platform) DO NOTHING;


-- =============================================================================
-- SECTION 4: OTHER INDUSTRIES - ENGLISH
-- =============================================================================

-- 1. Tạo Users cho 6 ngành khác nhau (Bản tiếng Anh)
INSERT INTO users (id, email, username, password_hash, role, is_active, email_verified_at, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440101', 'sarah.jones@marketing.com', 'sarah_marketing', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440201', 'thomas.miller@finance.com', 'thomas_finance', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440301', 'elena.pham@edu.com', 'elena_teacher', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440401', 'alex.le@design.com', 'alex_designer', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440501', 'david.vu@sales.com', 'david_sales', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440601', 'jessica.hoang@hr.com', 'jessica_hr', '$2b$10$EixZ9dy0.2T0H4Y0z76pfeWf8v9K.S8r.pG7U0g6w3G3K2q1.2345', 'user', true, NOW(), NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. Tạo Profiles tương ứng (Bản tiếng Anh)
INSERT INTO profiles (id, user_id, display_name, headline, bio, avatar_url, cover_url, location, industry, visibility, created_at, updated_at)
VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440101', 'Sarah Jones', 
    'Digital Marketing Lead | Performance Marketing & Content Strategy Expert | Conversion Rate Optimization',
    'I am a seasoned Digital Marketing Specialist with over 6 years of hands-on experience in planning and launching high-ROI performance marketing campaigns on Facebook, Google, and TikTok. Managed marketing budgets up to $50k+/month for major FMCG and E-commerce brands. Expert in data analysis, understanding customer behavioral psychology, and optimizing funnel conversions to drive business growth.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Ho Chi Minh City, Vietnam', 'Marketing', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440201', 'Thomas Miller',
    'Chief Accountant & Tax Consultant | CPA Vietnam | Financial Structuring & Internal Controls Specialist',
    'With over 10 years of experience in accounting and auditing, including a solid 4-year tenure at Big4 (EY Vietnam), I have led financial operations and accounting services for major real estate and hospitality conglomerates. Specialized in setting up internal controls, optimizing finance structures, compiling financial statements under VAS/IFRS, and negotiating complex tax audit resolutions.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Hanoi, Vietnam', 'Finance', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440301', 'Elena Pham',
    'English Teacher & Academic Coordinator | TESOL Certified | IELTS Expert & Curriculum Designer',
    'I have 7 years of academic teaching experience specializing in academic English and IELTS preparation for young adults and corporate professionals. Currently acting as an Academic Coordinator, managing teaching quality and designing syllabi. My teaching philosophy is student-centric and integrates EdTech to maximize learning retention.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Da Nang, Vietnam', 'Education', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440401', 'Alex Le',
    'Lead Product Designer (UI/UX) | Crafting Meaningful User Experiences for Digital Products',
    'I am a Product Designer with 6 years of experience building mobile applications and complex SaaS web portals. I believe great design solves real user pain points while driving business success. Highly skilled in Design Thinking, user research, maintaining scalable design systems, and conversion-centered UI design.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Ho Chi Minh City, Vietnam', 'Design', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440501', 'David Vu',
    'B2B Sales Manager | Enterprise Market Development | Tech Solutions & SaaS Account Lead',
    'Over 8 years of successful B2B business development and sales management in the IT and Telecom sectors. Experienced in consultative selling methodology, managing relationships with C-level executives (CEO, CTO, CFO), and closing million-dollar contracts for private cloud deployments and digital signature infrastructure.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1552581230-c015286521e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Hanoi, Vietnam', 'Sales', 'public', NOW(), NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440601', 'Jessica Hoang',
    'HR Business Partner (HRBP) | Talent Acquisition & Employee Experience Specialist',
    'An HRBP with 7+ years of experience across multinational organizations and top-tier Vietnamese corporations. Specialized in workforce planning, designing performance management systems (KPIs/OKRs), employee retention plans, and internal training program management. Passionate about building open and supportive workplaces.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1521791136364-728647526959?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'Ho Chi Minh City, Vietnam', 'Human Resources', 'public', NOW(), NOW()
  )
ON CONFLICT (user_id) DO NOTHING;

-- 3. Thêm Kinh nghiệm làm việc (Bản tiếng Anh)
INSERT INTO experiences (id, profile_id, job_title, company_name, location, employment_type, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
  -- Marketing
  ('770e8400-e29b-41d4-a716-446655440103', '660e8400-e29b-41d4-a716-446655440101', 'Digital Marketing Lead', 'Vingroup JSC', 'Hanoi, Vietnam', 'full_time', '2022-01-01', NULL, true, 'Manage a team of 6 Performance & Content marketers. Strategize and deploy digital marketing initiatives for major real estate launches. Oversee marketing budgets exceeding $100k/month, successfully reducing Cost Per Lead (CPL) by 25%.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440104', '660e8400-e29b-41d4-a716-446655440101', 'Digital Marketing Specialist', 'Ogilvy Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2019-06-01', '2021-12-31', false, 'Planned and executed target ads campaigns on Facebook, Google, and TikTok for FMCG clients like Unilever and Nestle. Developed automated reporting dashboards using Looker Studio.', 1, NOW(), NOW()),

  -- Finance
  ('770e8400-e29b-41d4-a716-446655440203', '660e8400-e29b-41d4-a716-446655440201', 'Chief Accountant', 'Sun Group', 'Da Nang, Vietnam', 'full_time', '2021-03-01', NULL, true, 'Oversaw total financial, accounting, and tax compliance operations for our regional subsidiary. Compiled financial statements in accordance with VAS and consolidated reports for group level. Negotiated with financial institutions for project funding.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440204', '660e8400-e29b-41d4-a716-446655440201', 'Senior Auditor', 'EY Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2017-09-01', '2021-02-28', false, 'Led audit teams (Job-in-charge) conducting financial audits for major manufacturing and retail clients. Advised client executives on improving internal controls and mitigation strategies.', 1, NOW(), NOW()),

  -- Education
  ('770e8400-e29b-41d4-a716-446655440303', '660e8400-e29b-41d4-a716-446655440301', 'Academic Coordinator', 'Vietnam USA Society English Centers (VUS)', 'Ho Chi Minh City, Vietnam', 'full_time', '2020-08-01', NULL, true, 'Supervised curriculum quality and classroom teaching performance. Drafted and edited IELTS prep materials. Delivered teacher training to 30+ domestic and foreign instructors. Hosted workshops for over 500 parents.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440304', '660e8400-e29b-41d4-a716-446655440301', 'English Teacher', 'ILA Vietnam', 'Ho Chi Minh City, Vietnam', 'part_time', '2016-10-01', '2020-07-31', false, 'Taught English for young learners and corporate IELTS classes. Designed interactive lessons incorporating multimedia tools. Assisted over 80% of IELTS students to achieve their target band scores of 6.5+.', 1, NOW(), NOW()),

  -- Design
  ('770e8400-e29b-41d4-a716-446655440403', '660e8400-e29b-41d4-a716-446655440401', 'Lead Product Designer', 'MoMo E-Wallet', 'Ho Chi Minh City, Vietnam', 'full_time', '2022-04-01', NULL, true, 'Led a UI/UX team of 4 designers responsible for the Payments and Wealth Management modules. Spearheaded user research, mapped user journeys, designed high-fidelity wireframes, and conducted usability tests.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440404', '660e8400-e29b-41d4-a716-446655440401', 'UI/UX Designer', 'Shopee Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2019-01-15', '2022-03-31', false, 'Designed interfaces for promotional shopping campaigns (11.11, 12.12). Partnered with developers to optimize performance and responsiveness across devices. Contributed to global Shopee Design System components.', 1, NOW(), NOW()),

  -- Sales
  ('770e8400-e29b-41d4-a716-446655440503', '660e8400-e29b-41d4-a716-446655440501', 'B2B Sales Manager', 'Viettel Enterprise Solutions', 'Hanoi, Vietnam', 'full_time', '2021-05-10', NULL, true, 'Managed a client portfolio consisting of banking and public sector accounts. Led a team of 8 sales account managers to bid and win large cloud infrastructure and digital signature contracts.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440504', '660e8400-e29b-41d4-a716-446655440501', 'Business Development Specialist', 'Grab Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2018-07-01', '2021-04-30', false, 'Expanded the merchant networks for GrabFood and GrabMart across the southern region. Onboarded over 200 food chains (KFC, Lotteria, The Coffee House). Met 120% of sales quotas for 3 consecutive quarters.', 1, NOW(), NOW()),

  -- HR
  ('770e8400-e29b-41d4-a716-446655440603', '660e8400-e29b-41d4-a716-446655440601', 'HR Business Partner', 'Vinamilk', 'Ho Chi Minh City, Vietnam', 'full_time', '2020-11-01', NULL, true, 'Partnered with the commercial sales division to support their HR operations. Created clear career progression roadmaps for field sales staff. Handled employee relations and performance management strategies.', 0, NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440604', '660e8400-e29b-41d4-a716-446655440601', 'Talent Acquisition Specialist', 'Adecco Vietnam', 'Ho Chi Minh City, Vietnam', 'full_time', '2017-03-01', '2020-10-31', false, 'Delivered professional executive search (headhunting) consulting to international manufacturing and retail partners. Sourced, screened, and interviewed middle and executive candidates.', 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Thêm Học vấn (Bản tiếng Anh)
INSERT INTO educations (id, profile_id, institution_name, degree, field_of_study, start_date, end_date, is_current, description, display_order, created_at, updated_at)
VALUES 
  ('880e8400-e29b-41d4-a716-446655440102', '660e8400-e29b-41d4-a716-446655440101', 'Foreign Trade University', 'Bachelor of Business Administration', 'Marketing Major', '2015-09-01', '2019-06-30', false, 'Graduated with Honors. Head of PR at FTU Marketing Club. 3rd Place at the National Marketer Championship.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440202', '660e8400-e29b-41d4-a716-446655440201', 'University of Economics HCMC', 'Bachelor of Accounting', 'Professional Accounting & Audit', '2013-09-01', '2017-06-30', false, 'Graduated with Distinction. Awarded full EY Career Path Scholarship.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440302', '660e8400-e29b-41d4-a716-446655440301', 'HCMC University of Education', 'Bachelor of Arts', 'English Language Pedagogy', '2012-09-01', '2016-06-30', false, 'Valedictorian of the English Department. First prize in City-wide Pedagogy competition.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440402', '660e8400-e29b-41d4-a716-446655440401', 'HCMC University of Architecture', 'Bachelor of Graphic Design', 'Visual Communications', '2014-09-01', '2019-06-30', false, 'Graduated with Honors. Graduation thesis project honored with creative award by National Art Institute.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440502', '660e8400-e29b-41d4-a716-446655440501', 'Foreign Trade University', 'Bachelor of International Business', 'Global Trade & Business Economics', '2014-09-01', '2018-06-30', false, 'Graduated with Honors. Member of FTU Debate Society.', 0, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440602', '660e8400-e29b-41d4-a716-446655440601', 'HCMC University of Social Sciences and Humanities', 'Bachelor of Psychology', 'Industrial & Organizational Psychology', '2013-09-01', '2017-06-30', false, 'Graduated with Honors. Second place in national student research grant on "Motivation of Gen Z in workplace".', 0, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Thêm Kỹ năng đa ngành chuẩn mới (Bản tiếng Anh)
INSERT INTO skills (id, profile_id, name, category, endorsement_count, display_order, created_at, updated_at)
VALUES 
  -- Marketing
  ('990e8400-e29b-41d4-a716-446655440121', '660e8400-e29b-41d4-a716-446655440101', 'Google Ads / Facebook Ads', 'technical', 35, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440122', '660e8400-e29b-41d4-a716-446655440101', 'Google Analytics & Looker Studio', 'tool', 28, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440123', '660e8400-e29b-41d4-a716-446655440101', 'Inbound Marketing Strategy', 'methodology', 25, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440124', '660e8400-e29b-41d4-a716-446655440101', 'E-commerce Optimization', 'domain', 20, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440125', '660e8400-e29b-41d4-a716-446655440101', 'Google Ads Search Certification', 'certification', 15, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440126', '660e8400-e29b-41d4-a716-446655440101', 'English (Fluent)', 'language', 18, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440127', '660e8400-e29b-41d4-a716-446655440101', 'Creative Thinking', 'soft_skill', 33, 6, NOW(), NOW()),

  -- Finance
  ('990e8400-e29b-41d4-a716-446655440221', '660e8400-e29b-41d4-a716-446655440201', 'Consolidated Financial Reporting', 'technical', 42, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440222', '660e8400-e29b-41d4-a716-446655440201', 'SAP ERP & MS Excel Advanced', 'tool', 36, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440223', '660e8400-e29b-41d4-a716-446655440201', 'IFRS Standards', 'methodology', 30, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440224', '660e8400-e29b-41d4-a716-446655440201', 'Real Estate Finance', 'domain', 24, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440225', '660e8400-e29b-41d4-a716-446655440201', 'CPA Vietnam Certified', 'certification', 29, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440226', '660e8400-e29b-41d4-a716-446655440201', 'English (Professional)', 'language', 15, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440227', '660e8400-e29b-41d4-a716-446655440201', 'Attention to Detail', 'soft_skill', 38, 6, NOW(), NOW()),

  -- Education
  ('990e8400-e29b-41d4-a716-446655440321', '660e8400-e29b-41d4-a716-446655440301', 'Curriculum Development', 'technical', 29, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440322', '660e8400-e29b-41d4-a716-446655440301', 'Google Classroom & Zoom', 'tool', 31, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440323', '660e8400-e29b-41d4-a716-446655440301', 'Communicative Teaching', 'methodology', 35, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440324', '660e8400-e29b-41d4-a716-446655440301', 'Language Pedagogy', 'domain', 27, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440325', '660e8400-e29b-41d4-a716-446655440301', 'CELTA Certificate', 'certification', 22, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440326', '660e8400-e29b-41d4-a716-446655440301', 'English (Near-Native)', 'language', 40, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440327', '660e8400-e29b-41d4-a716-446655440301', 'Patience & Mentoring', 'soft_skill', 45, 6, NOW(), NOW()),

  -- Design
  ('990e8400-e29b-41d4-a716-446655440421', '660e8400-e29b-41d4-a716-446655440401', 'UI/UX Visual Design', 'technical', 48, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440422', '660e8400-e29b-41d4-a716-446655440401', 'Figma & Adobe CC', 'tool', 55, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440423', '660e8400-e29b-41d4-a716-446655440401', 'Design Thinking Framework', 'methodology', 39, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440424', '660e8400-e29b-41d4-a716-446655440401', 'Mobile Apps (FinTech)', 'domain', 31, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440425', '660e8400-e29b-41d4-a716-446655440401', 'Google UX Design Certificate', 'certification', 26, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440426', '660e8400-e29b-41d4-a716-446655440401', 'English (Professional)', 'language', 22, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440427', '660e8400-e29b-41d4-a716-446655440401', 'User Empathy', 'soft_skill', 43, 6, NOW(), NOW()),

  -- Sales
  ('990e8400-e29b-41d4-a716-446655440521', '660e8400-e29b-41d4-a716-446655440501', 'B2B Negotiation', 'technical', 37, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440522', '660e8400-e29b-41d4-a716-446655440501', 'Salesforce & LinkedIn Sales Nav', 'tool', 29, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440523', '660e8400-e29b-41d4-a716-446655440501', 'Consultative Selling System', 'methodology', 32, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440524', '660e8400-e29b-41d4-a716-446655440501', 'Cloud & Telecom Services', 'domain', 26, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440525', '660e8400-e29b-41d4-a716-446655440501', 'English (Fluent)', 'language', 25, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440526', '660e8400-e29b-41d4-a716-446655440501', 'Active Listening', 'soft_skill', 41, 5, NOW(), NOW()),

  -- HR
  ('990e8400-e29b-41d4-a716-446655440621', '660e8400-e29b-41d4-a716-446655440601', 'Talent Acquisition & Sourcing', 'technical', 39, 0, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440622', '660e8400-e29b-41d4-a716-446655440601', 'Base HRM & Google Workspace', 'tool', 26, 1, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440623', '660e8400-e29b-41d4-a716-446655440601', 'Competency-Based Interviewing', 'methodology', 33, 2, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440624', '660e8400-e29b-41d4-a716-446655440601', 'Employee Relations & Engagement', 'domain', 28, 3, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440625', '660e8400-e29b-41d4-a716-446655440601', 'SHRM-CP Certified', 'certification', 19, 4, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440626', '660e8400-e29b-41d4-a716-446655440601', 'English (Professional)', 'language', 20, 5, NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440627', '660e8400-e29b-41d4-a716-446655440601', 'Conflict Resolution', 'soft_skill', 34, 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Thêm Liên kết (Social Links) (Bản tiếng Anh)
INSERT INTO social_links (id, profile_id, platform, url, created_at, updated_at)
VALUES 
  ('aa0e8400-e29b-41d4-a716-446655440121', '660e8400-e29b-41d4-a716-446655440101', 'linkedin', 'https://linkedin.com/in/linhnguyen-marketing', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440122', '660e8400-e29b-41d4-a716-446655440101', 'website', 'https://linhnguyen.marketing', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440221', '660e8400-e29b-41d4-a716-446655440201', 'linkedin', 'https://linkedin.com/in/tuantran-cpa', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440321', '660e8400-e29b-41d4-a716-446655440301', 'linkedin', 'https://linkedin.com/in/hangpham-edu', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440421', '660e8400-e29b-41d4-a716-446655440401', 'linkedin', 'https://linkedin.com/in/namle-design', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440422', '660e8400-e29b-41d4-a716-446655440401', 'website', 'https://namle.design', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440521', '660e8400-e29b-41d4-a716-446655440501', 'linkedin', 'https://linkedin.com/in/anhvu-sales', NOW(), NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440621', '660e8400-e29b-41d4-a716-446655440601', 'linkedin', 'https://linkedin.com/in/maihoang-hr', NOW(), NOW())
ON CONFLICT (profile_id, platform) DO NOTHING;
