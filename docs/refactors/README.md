# ProfileHub — Refactor & Architecture History

> Thư mục lưu trữ tài liệu lịch sử, kế hoạch và nhật ký kiểm chứng của các đợt tái cấu trúc (Refactoring) và nâng cấp kiến trúc hệ thống của ProfileHub.

---

## 📌 Danh mục các đợt Refactor (Refactor Milestones)

| Thời gian | Đợt Refactor & Phạm vi | Mục tiêu chính | Trạng thái | Tài liệu chi tiết |
| :--- | :--- | :--- | :---: | :--- |
| **2026-10** | **Core Architecture Cleanup & Performance** | • Thiết lập hàng rào chất lượng (0 lỗi tsc, ESLint chuẩn, build monorepo)<br>• Vá lỗi bảo mật P0 (OTP, NestJS Exceptions chuẩn, dọn dead code)<br>• Đồng bộ Contract FE↔BE (DTOs, CV sections, AllExceptionsFilter)<br>• Chuẩn hóa 3-Tier Layered Architecture cho cả Backend & Frontend<br>• Tối ưu hiệu năng: Route Code-splitting (`React.lazy`), bundle initial từ ~936 KB ➔ 131 KB<br>• Quốc tế hóa (i18n) 100% dialog & footer; đồng bộ 100% Swagger API Docs | `[x] Hoàn tất` | [`Xem chi tiết`](./2026-10-core-architecture-cleanup/checklist.md) |

---

## 🧭 Quy ước quản lý tài liệu Refactor cho tương lai

Khi có đợt refactor mới trong tương lai, vui lòng tuân thủ quy ước đặt tên:

1. **Tạo thư mục mới:** `docs/refactors/YYYY-MM-<scope-name>/`
   - Ví dụ: `docs/refactors/2026-11-db-migration-typeorm/`, `docs/refactors/2027-01-testing-and-ci-cd/`
2. **Cấu trúc bên trong thư mục:**
   - `plan.md`: Đề án, phân tích hiện trạng, thiết kế giải pháp và phân bổ các Phase.
   - `checklist.md`: Danh sách công việc chi tiết (`REF-xxx`), verification commands và log kết quả.
   - `baseline.md`: Đo đạc số liệu kỹ thuật trước khi bắt đầu (nếu có so sánh hiệu năng/bundle/lỗi).
3. **Cập nhật bảng mục lục:** Bổ sung một dòng mới vào bảng trên trong file `docs/refactors/README.md`.
