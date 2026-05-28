-- =============================================================================
-- Migration: Refactor skill category → Universal cross-industry classification
-- Description: Chuyển đổi các giá trị category cũ (IT-centric) sang
--              hệ thống phân loại theo bản chất kỹ năng (Phương án C).
--
-- Old → New mapping:
--   language  → technical   (TypeScript, Python, Java... là kỹ năng chuyên môn)
--   framework → technical   (React, Spring, NestJS... là kỹ năng chuyên môn)
--   database  → tool        (PostgreSQL, MySQL, MongoDB... là công cụ)
--   cloud     → tool        (AWS Console, GCP... là công cụ khi dùng như service)
--   frontend  → technical   (nếu dữ liệu cũ có giá trị ngoài enum)
--   backend   → technical
--   devops    → methodology (DevOps là phương pháp/quy trình)
--   design    → technical   (UI/UX Design là kỹ năng chuyên môn)
--   tool      → tool        (giữ nguyên)
--   soft_skill→ soft_skill  (giữ nguyên)
--   other     → other       (giữ nguyên)
-- =============================================================================

-- Bước 1: Cập nhật các giá trị IT-centric cũ → technical (kỹ năng chuyên môn)
UPDATE skills
SET category = 'technical'
WHERE category IN ('language', 'framework', 'frontend', 'backend', 'design');

-- Bước 2: database, cloud → tool (đây là công cụ/phần mềm)
UPDATE skills
SET category = 'tool'
WHERE category IN ('database', 'cloud');

-- Bước 3: devops → methodology (DevOps là phương pháp quy trình)
UPDATE skills
SET category = 'methodology'
WHERE category = 'devops';

-- Bước 4: Xác nhận kết quả (optional)
SELECT category, COUNT(*) as count
FROM skills
GROUP BY category
ORDER BY count DESC;
