# ProfileHub — Refactor Execution Checklist & Requirements

> **Tài liệu đi kèm:** [`plan.md`](./plan.md) & [`AGENTS.md`](../../../AGENTS.md)
> **Mục đích:** File theo dõi tiến độ thực thi chi tiết từng task (`REF-001` → `REF-036`) dành cho AI Agent và Developer.
> **Cập nhật lần cuối:** 2026-10-25

---

## Hướng dẫn bắt buộc cho AI Agent (AI Execution Protocol)

Khi được yêu cầu thực hiện refactor theo file này, AI **BẮT BUỘC** tuân thủ quy trình 5 bước sau:

1. **Đọc trạng thái hiện tại:** Tìm task đầu tiên có trạng thái `[ ]` (Todo) hoặc `[-]` (In Progress). Không tự ý nhảy cóc qua Phase/Task nếu chưa được yêu cầu.
2. **Đánh dấu bắt đầu:** Đổi trạng thái của task đang làm từ `[ ]` sang `[-]` trước khi sửa code.
3. **Thực thi đúng phạm vi:**
   - Chỉ sửa các files liên quan đến task đó.
   - Tuân thủ tuyệt đối [`AGENTS.md`](./AGENTS.md): **Controller → Service → Repository → Database**, không trả raw Entity, không đặt query trong Controller/Service, giữ nguyên contract `/auth/me`.
   - Không thêm `any`, `@ts-ignore`, hoặc `console.log`.
4. **Chạy lệnh kiểm chứng (Verification Gate):**
   - Chạy **tất cả** các câu lệnh trong mục `Verification` của task đó trên terminal thật.
   - Nếu lệnh báo lỗi, tự sửa cho đến khi pass 100% (Exit code `0`).
5. **Cập nhật Checklist sau khi hoàn thành:**
   - Đánh dấu `[x]` vào tiêu đề task và các sub-items đã xong.
   - Điền ngắn gọn vào mục `Log kết quả` (ngày giờ, các files chính đã sửa/xoá, kết quả lệnh).

---

## Tổng quan Tiến độ (Progress Dashboard)

| Phase       | Mô tả                               | Số lượng Task             | Hoàn thành | Trạng thái        |
| ----------- | ----------------------------------- | ------------------------- | ---------- | ----------------- |
| **Phase 0** | Baseline & An toàn                  | 1 (`REF-000`)             | 1 / 1      | `[x] Done`        |
| **Phase 1** | Guardrails & Sửa lỗi P0             | 7 (`REF-001` → `REF-007`) | 7 / 7      | `[x] Done`        |
| **Phase 2** | Contract FE↔BE & Backend Cleanup (Pragmatic) | 6 (`REF-008` → `REF-014`, bỏ `REF-013`) | 6 / 6 | `[x] Done`        |
| **Phase 3** | Frontend Cleanup, DRY & Performance | 9 (`REF-015` → `REF-023`) | 9 / 9      | `[x] Done`        |
| **Phase 4** | Documentation & Swagger (Tối giản theo yêu cầu) | 2 (`REF-026`, `REF-027`, bỏ `024/025/028`) | 2 / 2 | `[x] Done` |
| **Phase 5** | Testing, CI/CD & Observability      | 8 (`REF-029` → `REF-036`) | 0 / 8      | `[ ] Todo`        |
| **TỔNG**    | **Toàn bộ đợt Refactor**            | **33 Tasks**              | **25 / 33** | **75.8%**        |

---

## Chiến lược Phân chia Nhánh & PR (Branch & PR Strategy)

> **Nguyên tắc phân bổ (Sweet Spot):**
>
> - Mỗi PR chỉ gồm **4 – 9 files**, dung lượng thay đổi **150 – 350 dòng diff**, có cùng một chủ đề logic rõ ràng.
> - Không tách quá vụn vặt (1–2 file) gây tốn thời gian review/merge.
> - Không dồn cả Phase lớn vào một PR gây nguy cơ conflict và khó rollback.

|   PR #    | Tên Nhánh (Branch Name)                    | Tasks Bao Gồm                                         | Mục Tiêu & Phạm Vi Chính                                                                                                                                             |
| :-------: | :----------------------------------------- | :---------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PR-01** | `refactor/guardrails-typecheck-lint`       | `REF-000`, `REF-001`, `REF-002`, `REF-003`            | **Dựng hàng rào chất lượng**: Sửa `tsc` client về 0 lỗi; thêm target & CI `typecheck`; sửa ESLint & target `lint` chạy thật. _(HOÀN THÀNH)_                          |
| **PR-02** | `refactor/p0-security-error-handling`      | `REF-004`, `REF-005`                                  | **Vá lỗi bảo mật & HTTP 500**: Xóa log OTP/credentials ở `mail.service.ts`; đổi `throw new Error` thành Nest exceptions (`ConflictException`).                       |
| **PR-03** | `refactor/clean-dead-code-fake-endpoints`  | `REF-006`, `REF-007`                                  | **Dọn dẹp mã nguồn (Hygiene)**: Xóa dead code client/shared UI (`ProfileCard`, `SkillChip`,...); xóa endpoint & method ảo trong `profile.service.ts` và `useApi.ts`. |
| **PR-04** | `refactor/contract-shared-profile-dtos`    | `REF-008`, `REF-009`                                  | **Đồng bộ Contract FE↔BE**: Bổ sung 4 CV sections vào `ProfileResponseDto`; cập nhật `ProfileMapper` và cắm vào toàn bộ route `ProfileController`.                   |
| **PR-05** | `refactor/be-controller-cleanup-discovery` | `REF-010`, `REF-011`, `REF-014`                       | **Chuẩn hóa Controller & Discovery**: Xóa hack `u.profile.user = u`; tách logic khỏi Controller; phân trang và tìm kiếm thật ở DB cho Discovery feed.                |
| **PR-06** | `refactor/be-infra-filters-env`            | `REF-012` (bỏ `REF-013`)                                | **Hạ tầng Backend**: Thêm `AllExceptionsFilter` tinh giản (dùng `Logger` mặc định). _(Bỏ Zod env validation.)_                                          |
| **PR-07** | `refactor/fe-consolidate-profile-pages`    | `REF-015`                                             | **Hợp nhất trang Profile**: Gộp `PublicProfilePage` vào `ProfilePage`, xóa layout bị lặp `SideNav`/`AppFooter`, xóa `PublicProfilePage.tsx`.                         |
| **PR-08** | `refactor/fe-centralize-api-calls`         | `REF-016`, `REF-017`, `REF-020`, `REF-021`            | **Chuẩn hóa API & State FE**: Dialog không gọi `apiClient` trực tiếp; xóa `catch {}` rỗng; bỏ `window.location.reload()` và bỏ hardcode key localStorage.            |
| **PR-09** | `refactor/fe-shared-components-i18n`       | `REF-018`, `REF-019`, `REF-022`                       | **Component dùng chung & i18n**: Trích xuất Autocomplete/Logo upload dùng chung; gộp SkillChip và Debounce; dịch toàn bộ Dialog sang i18n JSON.                      |
| **PR-10** | `refactor/fe-code-split-bundle-opt`        | `REF-023`                                             | **Tối ưu Bundle & Performance**: Route code-splitting (`React.lazy`) + tối ưu `manualChunks` trong Vite config đưa bundle initial về < 500 KB.                       |
| **PR-11** | `refactor/db-migrations-docs-swagger`      | `REF-024`, `REF-025`, `REF-026`, `REF-027`, `REF-028` | **Data Layer & Documentation**: Tạo TypeORM `data-source.ts`, baseline migration runner, xóa conceptual schema; đồng bộ README và Swagger decorators.                |
| **PR-12** | `refactor/tests-auth-profile`              | `REF-029`, `REF-030`, `REF-031`                       | **Kiểm thử Backend**: Unit tests Auth/RefreshToken/OTP/Mappers; Integration tests cho luồng Auth và kiểm tra quyền sở hữu (ownership) Profile.                       |
| **PR-13** | `refactor/ci-workflow-observability`       | `REF-032`, `REF-033`, `REF-034`, `REF-035`, `REF-036` | **CI/CD & Giám sát**: Viết Frontend/smoke tests; tạo GitHub Actions CI workflow tự động; cấu hình structured logger redaction che giấu secret.                       |

---

## PHASE 0 — Baseline & An toàn (0.5 ngày)

### [x] REF-000: Thiết lập nhánh làm việc & Ghi nhận Baseline

- **Nhánh (Branch):** `PR-01` (`guardrails-typecheck-lint`)
- **Trạng thái:** `[x] Done`
- **Requirements & Các bước thực hiện:**
  - [x] Kiểm tra `git status` đảm bảo working tree sạch hoặc ghi nhận các thay đổi hiện có.
  - [x] Tạo thư mục `docs/refactors/2026-10-core-architecture-cleanup/` để lưu báo cáo baseline.
  - [x] Chạy và lưu kết quả baseline của `tsc` client, `tsc` service, `lint`, và `vite build` vào `baseline.md`.
- **Verification (Lệnh kiểm chứng bắt buộc):**
  - [x] File `baseline.md` tồn tại và ghi rõ số lỗi ban đầu (`tsc` client: 12 lỗi, `lint`: 0 project, bundle size: ~944 KB).
- **Log kết quả:**
  - Hoàn thành 2026-10-25. Đã tạo `baseline.md` lưu trữ toàn bộ dữ liệu ban đầu: `tsc` client 12 lỗi (8 files), `tsc` service 0 lỗi, `lint` no-op, client build lỗi, bundle 943.85 kB.

---

## PHASE 1 — Guardrails + Sửa lỗi P0 (3 ngày)

> **Mục tiêu Phase 1:** Đưa lỗi compile về 0, bật ESLint/Typecheck chạy thật, vá lỗ hổng lộ OTP và lỗi 500 ở Repository, xoá dead code rõ ràng.

### [x] REF-001: Sửa lỗi TypeScript export/import ở Client (`tsc` về 0 lỗi)

- **Nhánh (Branch):** `PR-01` (`guardrails-typecheck-lint`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/src/services/profile.service.ts`
  - `apps/client/src/hooks/useApi.ts`
  - `apps/client/src/pages/ProfilePage.tsx`
  - Các file đang import `ProfileResponse` / `DiscoveryFeedResponse` từ `profile.service.ts` (`SideNav.tsx`, `AboutDialog.tsx`, `BasicInfoDialog.tsx`, `SkillsDialog.tsx`, `DiscoveryPage.tsx`, `PublicProfilePage.tsx`)
- **Requirements:**
  - [x] Re-export `export type { ProfileResponse, DiscoveryFeedResponse, OnboardingStatusResponse, UploadAvatarResponse } from '@profilehub/types';` trong `apps/client/src/services/profile.service.ts` (hoặc chuyển toàn bộ import type sang `@profilehub/types`).
  - [x] Sửa lỗi `TS7006: Parameter 'old' / 'p' implicitly has an 'any' type` trong `apps/client/src/hooks/useApi.ts` (dòng 105, 109) bằng type tường minh từ `@profilehub/types`.
  - [x] Sửa lỗi `TS7006: Parameter 'prev' implicitly has an 'any' type` trong `apps/client/src/pages/ProfilePage.tsx` (dòng 84).
  - [x] Tuyệt đối không dùng `any` để lách lỗi.
- **Verification:**
  - [x] `npx tsc -p apps/client/tsconfig.json --noEmit` → **0 errors (Exit code 0)**.
  - [x] `npx tsc -p apps/service/tsconfig.json --noEmit` → **0 errors (Exit code 0)**.
- **Log kết quả:**
  - Hoàn thành 2026-10-25. Đã re-export 4 types trong `profile.service.ts`, định kiểu tường minh cho `old` và `p` trong `useApi.ts`, type cho `prev` trong `ProfilePage.tsx`. Cả client và service tsc đều đạt 0 lỗi (Exit code 0). `npm run build:client` đã build thành công.

---

### [x] REF-002: Thêm target `typecheck` cho toàn bộ Workspace

- **Nhánh (Branch):** `PR-01` (`guardrails-typecheck-lint`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/project.json`
  - `apps/service/project.json`
  - `package.json`
- **Requirements:**
  - [x] Thêm target `typecheck` vào `apps/client/project.json` chạy `tsc -p apps/client/tsconfig.json --noEmit`.
  - [x] Thêm target `typecheck` vào `apps/service/project.json` chạy `tsc -p apps/service/tsconfig.json --noEmit`.
  - [x] Thêm script `"typecheck": "nx run-many --target=typecheck --all"` vào `package.json`.
- **Verification:**
  - [x] `npm run typecheck` thực thi cả `client` và `service`, trả về **Exit code 0**.
- **Log kết quả:**
  - Hoàn thành 2026-10-25. Đã thêm target `typecheck` bằng `nx:run-commands` vào `apps/client/project.json` và `apps/service/project.json`, bổ sung vào `targetDefaults` trong `nx.json`, và thêm script `npm run typecheck`. Kết quả chạy song song 2 projects đều đạt Exit code 0.

---

### [x] REF-003: Sửa cấu hình ESLint & thêm target `lint` chạy thật

- **Nhánh (Branch):** `PR-01` (`guardrails-typecheck-lint`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `package.json`
  - `eslint.config.mjs`
  - `apps/client/project.json`, `apps/service/project.json`
  - `libs/shared/*/project.json` (nếu cần để `@nx/enforce-module-boundaries` hoạt động đúng với tags `scope:client`, `scope:service`, `scope:shared`)
- **Requirements:**
  - [x] Cài đặt hoặc đồng bộ parser/plugin TypeScript cho ESLint (`@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` hoặc `typescript-eslint` tương thích với ESLint trong repo).
  - [x] Cấu hình `eslint.config.mjs` không dùng `project: ['./tsconfig.*.json']` gây lỗi cho các file ngoài tsconfig root, dùng cấu hình chuẩn cho Nx monorepo.
  - [x] Thêm target `lint` (`@nx/eslint:lint`) vào `apps/client/project.json` và `apps/service/project.json` cùng tags (`scope:client`, `scope:service`, `scope:shared`).
  - [x] Xử lý các lỗi ESLint mức `error` phát sinh để `npm run lint` pass sạch.
- **Verification:**
  - [x] `npm run lint` chạy thật trên `client` và `service` (không còn báo `No tasks were run`) và trả về **0 errors (Exit code 0)**.
- **Log kết quả:**
  - Hoàn thành 2026-10-25. Đã cài đặt `@typescript-eslint/parser` & `@typescript-eslint/eslint-plugin` (^8.0.0), cấu hình `eslint.config.mjs` flat config chuẩn Nx, thêm `project.json` với tags và `lint` target cho cả 5 projects (`client`, `service`, `shared-ui`, `shared-types`, `shared-data-access`). Sửa các lỗi unused vars và boundary constraints. `npm run lint` chạy qua cả 5 projects, đạt 0 errors (Exit code 0).

---

### [x] REF-004: Khắc phục lộ OTP trên log, xử lý lỗi gửi mail & thống nhất thời hạn OTP

- **Nhánh (Branch):** `PR-02` (`refactor/p0-security-error-handling`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/service/src/modules/mail/mail.service.ts`
  - `apps/service/src/modules/otp/otp.service.ts`
- **Requirements:**
  - [x] Xoá bỏ hoàn toàn việc log raw OTP ra console ở `mail.service.ts` (dòng 54–57: `[Backup Log] Verification OTP...`).
  - [x] Export hằng số `OTP_EXPIRY_MINUTES = 5` (hoặc cấu hình từ env) và cập nhật nội dung email trong `mail.service.ts` từ `"10 minutes"` thành đúng số phút thực tế (`5 minutes`).
  - [x] Trong `mail.service.ts`: Khi `transporter.sendMail` lỗi ở môi trường production (hoặc khi đã cấu hình SMTP), không được nuốt lỗi im lặng; ở môi trường `development` nếu chưa cấu hình `MAIL_USER`/`MAIL_PASS`, xử lý fallback an toàn (không log raw OTP ở production).
  - [x] Xoá comment `//TODO: remove the hash OTP code...` thừa trong `otp.service.ts`.
- **Verification:**
  - [x] `grep -rn "Backup Log" apps/service/src/` → không còn kết quả.
  - [x] `npm run typecheck && npm run lint` → Pass.
- **Log kết quả:**
  - Hoàn thành 2026-10-25. `mail.service.ts`: xoá `[Backup Log]`; email dùng `OTP_EXPIRY_MINUTES` (5 phút, export từ `otp.service.ts`); `sendMail` lỗi → log stack + ném `InternalServerErrorException`; chưa cấu hình `MAIL_USER`/`MAIL_PASS` và `NODE_ENV !== production` → chỉ warn kèm OTP (fallback dev), production không bao giờ log OTP. Xoá comment TODO ở `otp.service.ts`. `grep "Backup Log"` → 0; typecheck + lint pass (0 errors).

---

### [x] REF-005: Thay `throw new Error` trần bằng NestJS Exception chuẩn

- **Nhánh (Branch):** `PR-02` (`refactor/p0-security-error-handling`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/service/src/modules/profile/profile.repository.ts`
  - `apps/service/src/modules/profile/profile.service.ts`
- **Requirements:**
  - [x] Theo đúng mục 4.1 của `REFACTOR_PLAN.md` và `AGENTS.md`: Repository chỉ truy vấn, Service kiểm tra điều kiện nghiệp vụ và ném NestJS Exception (`ConflictException`).
  - [x] Tại `createSkill`: Kiểm tra trùng tên skill (`existsSkillByNormalizedName` hoặc kiểm tra trong transaction) và ném `new ConflictException('Skill already exists')` thay vì `throw new Error('Skill already exists')` (tránh trả về HTTP 500).
  - [x] Tại `createSocialLink`: Kiểm tra trùng platform cho cùng profile và ném `new ConflictException('Social link for this platform already exists')` thay vì `throw new Error('Platform already exists for this profile')`.
  - [x] Rà soát toàn bộ `apps/service/src/` đảm bảo không còn `throw new Error(...)` trần cho lỗi nghiệp vụ.
- **Verification:**
  - [x] `grep -rn "throw new Error" apps/service/src/` → 0 kết quả.
  - [x] `npm run typecheck && npm run lint` → Pass.
- **Log kết quả:**
  - Hoàn thành 2026-10-25. `ProfileService.createSkill`/`createSocialLink` kiểm tra trùng qua `existsSkillByNormalizedName` (dùng lại method sẵn có) và mới thêm `existsSocialLinkByPlatform`, ném `ConflictException`. Repository `createSkill`/`createSocialLink` chỉ còn lưu dữ liệu. `grep "throw new Error" apps/service/src/` → 0; typecheck + lint pass. Lưu ý: check-then-insert không còn trong transaction nên race hiếm vẫn có thể lọt; cân nhắc unique index ở Phase 4.

---

### [x] REF-006: Dọn dẹp Dead Code ở Client & Shared UI (Appendix A)

- **Nhánh (Branch):** `PR-03` (`refactor/clean-dead-code-fake-endpoints`)
- **Trạng thái:** `[x] Done`
- **Files cần kiểm tra và xoá:**
  - `apps/client/src/components/ProfileCard.tsx`
  - `apps/client/src/components/SkillChip.tsx`
  - `apps/client/src/components/profile/ProfileEditDialog.tsx`
  - `apps/client/src/pages/MockTestPage.tsx`
  - `apps/client/src/pages/ProfileBuilderPage.tsx`
  - `apps/client/src/types/enums.ts`
  - `apps/client/src/utils/debounce.ts`
  - `libs/shared/ui/src/lib/SkillChip.tsx` (kiểm tra export trong `libs/shared/ui/src/index.ts` trước khi xoá)
- **Requirements:**
  - [x] Trước khi xoá mỗi file, kiểm tra bằng `grep` trên toàn workspace để chắc chắn không có file sống nào đang import.
  - [x] Sau khi xoá `MockTestPage.tsx`, gỡ `SkillChip` khỏi `libs/shared/ui/src/index.ts` và xoá `libs/shared/ui/src/lib/SkillChip.tsx` nếu không còn nơi nào dùng.
- **Verification:**
  - [x] `npm run typecheck && npm run lint && npm run build:client` → Pass 100%.
- **Log kết quả:**
  - Hoàn thành 2026-10-25. Đã grep xác nhận không còn nơi import, rồi xoá 8 file: `ProfileCard`, `SkillChip` (client), `ProfileEditDialog`, `MockTestPage`, `ProfileBuilderPage`, `types/enums.ts`, `utils/debounce.ts`, `libs/shared/ui/src/lib/SkillChip.tsx` và gỡ export trong `libs/shared/ui/src/index.ts`. typecheck + lint + build:client pass.

---

### [x] REF-007: Xoá các method & endpoint ảo ở Client Service và Hooks

- **Nhánh (Branch):** `PR-03` (`refactor/clean-dead-code-fake-endpoints`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/src/services/profile.service.ts`
  - `apps/client/src/hooks/useApi.ts`
- **Requirements:**
  - [x] Trong `apps/client/src/services/profile.service.ts`: Xoá các hàm gọi endpoint không tồn tại trên Backend (`getExperiences`, `getEducations`, `getSkills`, `getSocialLinks` — vì dữ liệu này đã nằm trong `GET /profiles/mine` và `GET /profiles/u/:username`).
  - [x] Bổ sung đầy đủ các hàm CRUD thực tế đang có trên Backend vào `profileAPI` để chuẩn bị cho Phase 3 (gồm: `updateExperience`, `deleteExperience`, `updateEducation`, `deleteEducation`, `updateSkill`, `deleteSkill`, `updateSocialLink`, `deleteSocialLink`).
  - [x] Trong `apps/client/src/hooks/useApi.ts`: Xoá `useProfile` (gọi sai route `/api/profiles/:username`) và `useToggleLike` (gọi `/api/interactions` chưa tồn tại) nếu không có component nào sử dụng, hoặc sửa `useProfile` dùng `profileAPI.getPublicProfile`.
- **Verification:**
  - [x] `npm run typecheck && npm run lint && npm run build:client` → Pass.
- **Log kết quả:**
  - Hoàn thành 2026-10-25. `profile.service.ts`: xoá `getExperiences/getEducations/getSkills/getSocialLinks`; thêm `update*`/`delete*` cho Experience, Education, Skill, SocialLink (khớp route PUT/DELETE thật của BE). `useApi.ts`: xoá `useProfile`, `useToggleLike` (không có nơi dùng) và import thừa. `fetchJson` giữ lại cho `useDiscoveryFeed` (xử lý ở REF-016). typecheck + lint + build:client pass.

---

## PHASE 2 — Contract FE↔BE & Backend Cleanup (PRAGMATIC — 2 ngày)

> **Nguyên tắc Pragmatic (theo HR Systems, đồ án cá nhân — tránh over-engineering):**
>
> - Giữ cấu trúc hiện có, **không tạo thêm tầng/thư mục `core/`**, không viết lại những gì đang chạy ổn.
> - Mapper: **giữ nguyên các mapper hiện có** (`apps/service/src/modules/profile/mappers/*`), chỉ bổ sung 4 mảng CV; fallback bằng `?? []`. Không dựng thêm abstraction.
> - DTO Backend `implements` interface từ `@profilehub/types` để TypeScript tự bắt lệch field.
> - **Vẫn tuân thủ `AGENTS.md`** (khác với code mẫu HR): không `any` (kể cả `req: any`, `any[]`), Controller → Service → Repository, không trả raw Entity.
> - **Bỏ Zod validate env** (REF-013): `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) đã có sẵn trong `main.ts`; `.env` đọc qua `@nestjs/config`, thiếu biến thì TypeORM/JWT tự fail.
> - `AllExceptionsFilter` chỉ dùng `Logger` mặc định của NestJS, không thêm thư viện.

### [x] REF-008: DTO `implements` interface shared + thêm 4 mảng CV vào `ProfileResponseDto`

- **Nhánh:** `PR-04` (`refactor/contract-shared-profile-dtos`)
- **Trạng thái:** `[x] Done`
- **Files:** `libs/shared/types/profile.types.ts`, `libs/shared/types/experience.types.ts`, `apps/service/src/modules/profile/dto/profile-response.dto.ts`, `apps/service/src/modules/profile/mappers/profile.mapper.ts`, `apps/client/src/pages/DiscoveryPage.tsx`, `tsconfig.base.json`
- **Requirements:**
  - [x] `ProfileResponse` (shared) có `experiences`, `educations`, `skills`, `socialLinks` với **type cụ thể** (không `any`).
  - [x] `ProfileResponseDto` thêm 4 mảng tương ứng và `implements ProfileResponse`.
  - [x] `ProfileMapper.toProfileResponseDto` map 4 mảng bằng mapper con hiện có, fallback `?? []`.
  - [x] Discovery: để `DiscoveryFeedResponse` khớp `DiscoveryProfileDto` (sửa type shared hoặc DTO, chọn 1 phía ít sửa hơn).
- **Verification:** `npm run typecheck && npm run lint && npm run build`
- **Log kết quả:** Hoàn thành 2026-10-26. Thêm 4 mảng CV vào `ProfileResponseDto`, cho toàn bộ Response DTOs trong `profile-response.dto.ts` `implements` các shared interfaces tương ứng từ `@profilehub/types`, cập nhật `ProfileMapper.toProfileResponseDto` map 4 mảng với `?? []`. Bổ sung `IDiscoveryProfile` trong `profile.types.ts` và đồng bộ `DiscoveryPage.tsx`. Chuyển toàn bộ enum imports trong backend DTOs sang `@profilehub/types` trực tiếp và xoá path alias thừa trong `tsconfig.base.json`. `typecheck`, `lint`, `build` (client + service) pass 100% (Exit code 0).

---

### [x] REF-009: Dùng mapper cho mọi endpoint profile (không trả raw Entity)

- **Nhánh:** `PR-04`
- **Trạng thái:** `[x] Done`
- **Files:** `profile.controller.ts`, `profile.service.ts`, `profile.module.ts`, `mappers/profile.mapper.ts`, `mappers/index.ts`, `dto/profile-response.dto.ts`, `entities/social-link.entity.ts`, `libs/shared/types/profile.types.ts`, FE `profile.service.ts` + `SkillsDialog.tsx`, `AGENTS.md`
- **Requirements:**
  - [x] `GET /profiles/mine`, `GET /profiles/u/:username`, `GET /profiles/:id`, `PATCH /profiles/me` đều trả `ProfileResponseDto` qua mapper.
  - [x] Service ném `NotFoundException` rõ ràng khi profile `null` (không để crash mapper).
- **Verification:**
  - [x] `npm run typecheck && npm run lint && npm run build`
  - [x] `grep -nE "return (user\.)?profile;" apps/service/src/modules/profile/profile.controller.ts` → 0 kết quả.
- **Log kết quả:** Hoàn thành 2026-10-26 (theo chuẩn HR Systems, tinh giản tối đa). Chỉ còn 1 file mapper với các hàm thuần cho Profile/Onboarding/Discovery (`toProfileResponseDto`, `toOnboardingStatusResponseDto`, `toDiscoveryFeedResponseDto`); **xoá hết mapper con** (Education/Experience/Skill/SocialLink: 4 file class + các hàm `toXxxResponseDto` + 4 Response DTO class). 4 mảng CV trong `ProfileResponseDto` dùng thẳng Entity, typed bằng shared interface `IExperience/IEducation/ISkill/ISocialLink` (`SocialLinkEntity` nay cũng `implements ISocialLink`). Create/Update CV section trả `{ success: true }` (`SuccessResponse` trong `@profilehub/types`); delete giữ 204. `ProfileService` chứa `calculateCompletion` + gọi mapper, `ProfileController` chỉ inject `ProfileService`, không còn `user.profile!`. FE: `profileAPI.add*/update*` đổi type sang `SuccessResponse`; `SkillsDialog` bỏ nối skill local, dựa vào `onSuccess()` refetch (các dialog khác vốn đã không dùng body trả về). `AGENTS.md` bổ sung ngoại lệ pragmatic cho CV entities. `grep`, `typecheck`, `lint` (0 errors), `build` pass (Exit code 0).

---

### [x] REF-010 & REF-011: Bỏ hack `u.profile.user = u`, Controller mỏng, gom helper DRY ở Service

- **Nhánh:** `PR-05` (`refactor/be-controller-cleanup-discovery`)
- **Trạng thái:** `[x] Done`
- **Files:** `profile.controller.ts`, `profile.service.ts`, `profile.repository.ts`
- **Requirements:**
  - [x] Xoá `.map(u => { u.profile.user = u ... })` trong `getDiscoveryFeed()`; Repository query từ profile + `leftJoinAndSelect('p.user', 'user')`.
  - [x] Controller chỉ hứng request + gọi 1 hàm Service (user lấy từ decorator/typed request đang dùng trong repo, **không `req: any`**).
  - [x] `ProfileService`: gom lặp `findProfileByUserId` + `NotFoundException` thành private `getRequiredProfileByUserId(userId)`.
  - [x] Chỉ rà `profile.controller.ts`; các controller khác chỉ sửa nếu thấy có logic/vòng lặp rõ ràng (không rà toàn bộ).
- **Verification:** `npm run typecheck && npm run lint && npm run build:service`
- **Log kết quả:** Hoàn thành 2026-10-27. Xoá hoàn toàn vòng lặp `.map(u => { u.profile.user = u ... })` trong `ProfileController.getDiscoveryFeed()` và chuyển thành 1 dòng `return this.profileService.getDiscoveryFeed()`. Tại `ProfileRepository`, thay `getAllUsersFullProfile()` bằng `findDiscoveryProfiles()` truy vấn trực tiếp từ `profileRepo` với `innerJoinAndSelect('p.user', 'u', 'u.deletedAt IS NULL')` và `leftJoinAndSelect('p.skills', 'sk')`. Tại `ProfileService`, thêm helper private `getRequiredProfileByUserId(userId)` thay thế toàn bộ 12 chỗ lặp `findProfileByUserId` + `NotFoundException`. `typecheck`, `lint`, `build:service` đều pass 100% (Exit code 0).

---

### [x] REF-014: Discovery Feed — pagination & search ở Database

- **Nhánh:** `PR-05`
- **Trạng thái:** `[x] Done`
- **Files:** tạo `dto/discovery-query.dto.ts`; sửa `profile.controller.ts`, `profile.service.ts`, `profile.repository.ts`, `dto/profile-response.dto.ts`, `mappers/profile.mapper.ts`, `libs/shared/types/profile.types.ts`, `apps/client/src/pages/DiscoveryPage.tsx`
- **Requirements:**
  - [x] `DiscoveryQueryDto`: `page` (mặc định 1, `@Min(1)`), `limit` (mặc định 20, `@Min(1)`, `@Max(50)`), `search?` — dùng class-validator + `@Type(() => Number)`.
  - [x] Repository: lọc `visibility = 'public'`, `ILIKE` theo `displayName`/`headline`/`username` (**bỏ tìm theo skill** để tránh join phức tạp, thêm sau nếu cần), `skip/take` + `getManyAndCount()`.
  - [x] Response: `{ items, total, page, limit }` (cập nhật `DiscoveryFeedResponse` và FE gọi tương ứng nếu lệch).
- **Verification:** `npm run typecheck && npm run lint && npm run build:service`
- **Log kết quả:** Hoàn thành 2026-10-27. Tạo `DiscoveryQueryDto` (`page = 1`, `limit = 20`, `search?`) với `class-validator` + `@Type(() => Number)`. Cập nhật `ProfileRepository.findDiscoveryProfiles(query)` lọc `visibility = 'public'`, tìm kiếm `ILIKE` theo `displayName`, `headline`, `username` và phân trang bằng `skip/take` + `getManyAndCount()`. Đồng bộ `DiscoveryFeedResponse` / `DiscoveryFeedResponseDto` sang `{ items, total, page, limit }` và cập nhật `DiscoveryPage.tsx` (dùng `data?.items` và bỏ `.filter(...)` thừa ở client). `typecheck`, `lint`, `build` (client + service) đều pass 100% (Exit code 0).

---

### [x] REF-012: `AllExceptionsFilter` tinh giản

- **Nhánh:** `PR-06` (`refactor/be-infra-filters-env`)
- **Trạng thái:** `[x] Done`
- **Files:** tạo `apps/service/src/common/filters/all-exceptions.filter.ts`; sửa `main.ts`
- **Requirements:**
  - [x] `@Catch()` filter: `HttpException` → giữ status/message; lỗi khác → log stack bằng `Logger`, trả `{ statusCode: 500, message: 'Internal server error', timestamp, path }` (không lộ SQL/stack).
  - [x] Đăng ký `app.useGlobalFilters(new AllExceptionsFilter())` trong `main.ts`.
- **Verification:** `npm run typecheck && npm run lint && npm run build:service`
- **Log kết quả:** Hoàn thành 2026-10-27. Tạo `AllExceptionsFilter` (`@Catch()`) trong `common/filters/all-exceptions.filter.ts`, chuẩn hóa response lỗi `{ statusCode, message, error, timestamp, path }`. Bắt lỗi 500 bất ngờ thì log stack trace ở console server qua `Logger`, trả về message an toàn không lộ chi tiết SQL/internal. Đăng ký global filter qua `app.useGlobalFilters(new AllExceptionsFilter())` trong `main.ts`. `typecheck`, `lint`, `build:service` đều pass 100% (Exit code 0).

---

### [~] REF-013: ~~Validate env bằng Zod~~ — **ĐÃ BỎ (simplified)**

- **Trạng thái:** `[~] Skipped` — theo HR Systems, không dùng Zod validate lúc boot. `ValidationPipe` global đã có; `@nestjs/config` đọc env như hiện tại.
- **Tuỳ chọn (không bắt buộc):** nếu muốn fail-fast, thêm check 2–3 dòng `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` trong nơi khởi tạo JWT, **không** tạo `env.validation.ts`.
- **Log kết quả:** Bỏ khỏi phạm vi 2026-10-26 (tránh over-engineering).

---

## PHASE 3 — Frontend Cleanup, DRY & Performance (4 ngày)

> **Mục tiêu Phase 3:** Xoá bỏ hoàn toàn sự trùng lặp ở Frontend, tất cả HTTP request đi qua `apiClient` + `profileAPI`, hoàn thiện i18n và giảm kích thước bundle.

### [x] REF-015: Gộp `ProfilePage` và `PublicProfilePage` thành một trang duy nhất

- **Nhánh (Branch):** `PR-07` (`refactor/fe-consolidate-profile-pages`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/src/pages/ProfilePage.tsx`
  - `apps/client/src/pages/PublicProfilePage.tsx` (xoá sau khi gộp)
  - `apps/client/src/App.tsx`
  - `apps/client/src/i18n/locales/en/profile.json`
  - `apps/client/src/i18n/locales/vi/profile.json`
- **Requirements:**
  - [x] `ProfilePage.tsx` hiện đã có sẵn logic `const { username } = useParams()` và `const isOwnProfile = !username || user?.username === username;`.
  - [x] Đưa các tính năng tốt từ `PublicProfilePage.tsx`: nút Share URL copy link vào clipboard qua `navigator.clipboard` kèm sonner toast thông báo, nút Back to Discovery khi xem profile người khác và khi không tìm thấy profile (404 state).
  - [x] **Sửa lỗi lặp Layout:** Xoá bỏ `<SideNav />` bị render thừa lần 2 bên trong `ProfilePage.tsx` khi profile không tìm thấy (`!profile`), để `DashboardLayout` quản lý duy nhất sidebar navigation.
  - [x] Cập nhật `App.tsx` để cả `/profile` và `/u/:username` đều dùng `ProfilePage`, xoá bỏ hoàn toàn `PublicProfilePage.tsx`.
- **Verification:**
  - [x] File `PublicProfilePage.tsx` đã được xoá.
  - [x] `npm run typecheck && npm run lint && npm run build:client` → Pass 100% (Exit code 0).
- **Log kết quả:**
  - Hoàn thành 2026-10-27. Đã hợp nhất `PublicProfilePage` vào `ProfilePage`. Bổ sung tính năng sao chép link hồ sơ (`handleShare`) kèm toast thông báo và nút "Back to Discovery". Xóa thẻ `<SideNav />` lồng trùng lặp trong `ProfilePage`. Cập nhật `App.tsx` định tuyến `/u/:username` và `/profile` qua `ProfilePage`. Xóa file thừa `PublicProfilePage.tsx`. Typecheck, lint và build client đều pass (bundle client giảm từ 943.85 kB xuống 935.95 kB).

---

### [x] REF-016 & REF-017: Gom toàn bộ HTTP request về Service (Chuẩn 3-Tier HR Systems)

- **Nhánh (Branch):** `PR-08` (`refactor/fe-centralize-api-calls`)
- **Trạng thái:** `[x] Done`
- **Mục tiêu kiến trúc (HR Systems 3-Tier):**
  - **Tier 1 (UI Component/Dialog):** Chỉ tương tác với Service hoặc React Query Hook, tuyệt đối không import `apiClient`.
  - **Tier 2 (Service/Hook):** Chứa các phương thức API nghiệp vụ (`profileAPI`, `authAPI`, `companyService`,...), nhận dữ liệu, gọi `apiClient` và trả về Typed Response.
  - **Tier 3 (HTTP Client):** `apiClient` duy nhất quản lý baseURL, header, refresh token mutex và ApiError.
- **Files cần xử lý:**
  - `apps/client/src/hooks/useApi.ts`
  - `apps/client/src/services/profile.service.ts`
  - `apps/client/src/services/education.service.ts` (hoặc `company.service.ts`)
  - `apps/client/src/components/profile/dialogs/ExperienceDialog.tsx`
  - `apps/client/src/components/profile/dialogs/EducationDialog.tsx`
  - `apps/client/src/components/profile/dialogs/SkillsDialog.tsx`
  - `apps/client/src/components/profile/dialogs/BasicInfoDialog.tsx`
  - `apps/client/src/components/profile/dialogs/AboutDialog.tsx`
- **Requirements & Các bước thực hiện:**
  - [x] **1. Xoá `fetch()` trần trong `useApi.ts`:**
    - Xoá hoàn toàn hàm `fetchJson()` trong `apps/client/src/hooks/useApi.ts`.
    - Chuyển `useDiscoveryFeed(page, limit, search)` sang gọi trực tiếp `profileAPI.getDiscoveryFeed(page, limit, search)`.
  - [x] **2. Khắc phục Dialog gọi trực tiếp `apiClient`:**
    - `ExperienceDialog.tsx`: Xoá `import { apiClient }`; chuyển `apiClient.put` và `apiClient.delete` sang `profileAPI.updateExperience(id, payload)` và `profileAPI.deleteExperience(id)`.
    - `EducationDialog.tsx`: Xoá `import { apiClient }`; chuyển `apiClient.put` và `apiClient.delete` sang `profileAPI.updateEducation(id, payload)` và `profileAPI.deleteEducation(id)`. Bổ sung `educationAPI.uploadInstitutionLogo` trong Service layer để upload logo trường học.
    - `SkillsDialog.tsx`: Xoá `import { apiClient }`; chuyển `apiClient.delete` sang `profileAPI.deleteSkill(id)`.
  - [x] **3. Xoá bỏ các khối `catch {}` rỗng nuốt lỗi:**
    - Toàn bộ catch block trong các Dialog (`ExperienceDialog`, `EducationDialog`, `SkillsDialog`, `BasicInfoDialog`, `AboutDialog`) hiển thị toast notification rõ ràng (`toast.error(getErrorMessage(error))`), không nuốt lỗi âm thầm.
- **Verification (Lệnh kiểm chứng bắt buộc):**
  - [x] `grep -rn "apiClient\." apps/client/src/components apps/client/src/pages` → **0 kết quả**.
  - [x] `grep -rn "fetch(" apps/client/src/hooks apps/client/src/components apps/client/src/pages` → **0 kết quả**.
  - [x] `npm run typecheck && npm run lint && npm run build:client` → **Pass 100% (Exit code 0)**.
- **Log kết quả:**
  - Hoàn thành 2026-10-27. Chuẩn hóa kiến trúc 3-Tier Frontend: Xóa hàm `fetchJson()` dùng `fetch()` trần trong `useApi.ts`, chuyển `useDiscoveryFeed` gọi qua `profileAPI.getDiscoveryFeed`. Bổ sung `uploadInstitutionLogo` vào `education.service.ts`. Loại bỏ 100% việc import và gọi `apiClient` trực tiếp từ các modal dialogs (`ExperienceDialog`, `EducationDialog`, `SkillsDialog`), chuyển hoàn toàn sang các methods của `profileAPI` và `educationAPI`. Xóa tất cả các khối `catch {}` rỗng nuốt lỗi trong dialog, thêm `toast.error(getErrorMessage(error))`. Verification đạt 0 kết quả cho `apiClient.` trong components/pages, 0 kết quả `fetch()` ngoài `api.service.ts`, typecheck, lint, build:client đều pass 100%.

---

### [x] REF-018 & REF-019: Trích xuất Component Autocomplete/Logo dùng chung & Gộp SkillChip / Debounce

- **Nhánh (Branch):** `PR-09` (`refactor/fe-shared-components-i18n`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/src/components/profile/OrganizationField.tsx` (mới)
  - `apps/client/src/components/profile/dialogs/ExperienceDialog.tsx`
  - `apps/client/src/components/profile/dialogs/EducationDialog.tsx`
  - `apps/client/src/components/profile/SkillsSection.tsx`
  - `libs/shared/ui/src/`
- **Requirements:**
  - [x] Tạo component dùng chung (ví dụ `EntityAutocompleteInput` hoặc `OrganizationField` trong `apps/client/src/components/profile/`) cho chức năng tìm kiếm + chọn tổ chức + upload logo đang bị copy-paste y hệt nhau giữa `ExperienceDialog.tsx` và `EducationDialog.tsx`.
  - [x] Đảm bảo toàn project chỉ còn 1 implementation cho `useDebounce` (`apps/client/src/hooks/useDebounce.ts`) và 1 cách hiển thị Skill Chip (`SkillTag.tsx` / `SkillsSection.tsx`).
- **Verification:**
  - [x] `npm run typecheck && npm run lint && npm run build:client` → Pass.
- **Log kết quả:**
  - Hoàn thành 2026-10-27. Đã tạo component dùng chung `OrganizationField.tsx` tích hợp hook chuẩn `useDebounce(..., 300)` và quản lý tự động việc upload/preview logo (kèm dọn dẹp URL.revokeObjectURL). Thay thế hơn 230 dòng boilerplate lặp lại trong cả `ExperienceDialog.tsx` và `EducationDialog.tsx`. Đảm bảo duy nhất 1 debounce hook (`useDebounce.ts`) và 1 chuẩn hiển thị Skill (`SkillTag.tsx`). Bundle size client giảm từ 935.90 kB xuống 929.14 kB. `typecheck`, `lint` và `build:client` đều pass 100%.

---

### [x] REF-020 & REF-021: Bỏ `window.location.reload()` và bỏ hardcode key `localStorage`

- **Nhánh (Branch):** `PR-08` (`refactor/fe-centralize-api-calls`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/src/pages/OnboardingPage.tsx`
  - `apps/client/src/contexts/AuthContext.tsx`
  - `apps/client/src/services/auth-session.service.ts`
- **Requirements:**
  - [x] Trong `AuthContext.tsx`: Cung cấp hàm `refreshUser()` hoặc `updateOnboardingStatus(false)` cập nhật trực tiếp state `user` / `needsOnboarding` và lưu qua `authSession`.
  - [x] Trong `OnboardingPage.tsx`: Sau khi hoàn tất onboarding, cập nhật state trong `AuthContext` rồi `navigate('/profile')` mượt mà (SPA), **xoá bỏ `window.location.reload()`** và **xoá bỏ việc đọc/ghi `localStorage.getItem('profilehub_user')` trực tiếp**.
  - [x] Kiểm tra toàn bộ `apps/client/src/` để mọi thao tác với `localStorage` của auth đều đi qua `auth-session.service.ts`.
- **Verification:**
  - [x] `grep -rn "window.location.reload" apps/client/src/` → **0 kết quả**.
  - [x] `grep -rn "localStorage\." apps/client/src/pages apps/client/src/components` → **0 kết quả**.
  - [x] `npm run typecheck && npm run lint && npm run build:client` → Pass.
- **Log kết quả:**
  - Hoàn thành 2026-10-27. Đã bổ sung `refreshUser` và `updateOnboardingStatus` vào `AuthContext.tsx` giúp đồng bộ state người dùng từ `/auth/me` trực tiếp trong bộ nhớ React và lưu qua `authSession` mà không cần reload. Tại `OnboardingPage.tsx`, xoá hoàn toàn `window.location.reload()` và xoá việc đọc trực tiếp `localStorage.getItem('profilehub.auth')`, thay bằng `await refreshUser()` và SPA navigation `navigate('/discovery')`. Xoá import thừa `authAPI` và type hoá `catch (err: unknown)` an toàn. Toàn bộ `window.location.reload` = 0, `localStorage.` trong pages/components = 0. `typecheck`, `lint` và `build:client` đều pass 100%.

---

### [x] REF-022: Quốc tế hoá (i18n) toàn bộ Dialogs và Footer (Bỏ chuỗi hardcode)

- **Nhánh (Branch):** `PR-09` (`refactor/fe-shared-components-i18n`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/src/components/layout/AppFooter.tsx`
  - `apps/client/src/components/profile/OrganizationField.tsx`
  - `apps/client/src/components/shared/SkillTag.tsx`
  - `apps/client/src/components/profile/dialogs/*.tsx`
  - `apps/client/src/i18n/locales/en/*.json`
  - `apps/client/src/i18n/locales/vi/*.json`
- **Requirements:**
  - [x] Dịch toàn bộ chuỗi tiếng Việt đang hardcode trong `AppFooter.tsx` sang `common.json` (cả `en` và `vi`).
  - [x] Dịch toàn bộ tiêu đề, label, placeholder, nút bấm và thông báo lỗi trong 6 Dialog (`BasicInfoDialog`, `AboutDialog`, `SkillsDialog`, `ExperienceDialog`, `EducationDialog`, `AvatarEditDialog`) và `OrganizationField` sang `profile.json` (cả `en` và `vi`).
  - [x] Đảm bảo số lượng keys giữa `en` và `vi` khớp nhau 100%.
- **Verification:**
  - [x] Kiểm tra JSON keys của `en` và `vi` khớp 100% (`auth.json`: 33/33, `common.json`: 41/41, `profile.json`: 134/134).
  - [x] `npm run typecheck && npm run lint && npm run build:client` → Pass.
- **Log kết quả:**
  - Hoàn thành 2026-10-27. Đã quốc tế hóa 100% các chuỗi hardcode trong `AppFooter.tsx`, `OrganizationField.tsx`, `SkillTag.tsx` (thêm `labelKey`) và toàn bộ 6 modal Dialogs (`BasicInfoDialog`, `AboutDialog`, `SkillsDialog`, `ExperienceDialog`, `EducationDialog`, `AvatarEditDialog`). Toàn bộ keys JSON giữa `en` và `vi` khớp 100% (`diff = 0`). `typecheck`, `lint` và `build:client` đều pass 100%.

---

### [x] REF-023: Code-splitting theo Route (`React.lazy`) & Tối ưu Bundle Size (< 500 KB)

- **Nhánh (Branch):** `PR-10` (`refactor/fe-code-split-bundle-opt`)
- **Trạng thái:** `[x] Done`
- **Files cần xử lý:**
  - `apps/client/src/App.tsx`
  - `apps/client/vite.config.ts`
- **Requirements:**
  - [x] Chuyển các trang lớn trong `App.tsx` (`LandingPage`, `DiscoveryPage`, `ProfilePage`, `OnboardingPage`, `LoginPage`, `RegisterPage`, `ComingSoonPage`) sang `React.lazy` bọc trong `<Suspense fallback={<DashboardLoader />}>`.
  - [x] Cấu hình `build.rollupOptions.output.manualChunks` trong `apps/client/vite.config.ts` để tách riêng các thư viện nặng (`vendor-react`, `vendor-motion`, `vendor-lottie`, `vendor-query`, `vendor-i18n`).
- **Verification:**
  - [x] `npm run build:client` thành công và không còn chunk initial nào vượt quá **500 KB** (bundle chính giảm từ `936.59 kB` xuống `131.37 kB`, chunk lớn nhất `vendor-react` đạt `317.81 kB`).
- **Log kết quả:**
  - Hoàn thành 2026-10-27. Đã chuyển toàn bộ 7 page components trong `App.tsx` sang `React.lazy` bọc trong `<Suspense fallback={<DashboardLoader />}>`. Cấu hình `manualChunks` trong `vite.config.ts` tách riêng 5 vendor chunks (`vendor-react`, `vendor-motion`, `vendor-lottie`, `vendor-query`, `vendor-i18n`). Kết quả: bundle entry chính giảm từ `936.59 kB` xuống còn `131.37 kB` (gzip `32.63 kB`), không còn bất kỳ chunk nào vượt 500 KB và xóa sạch cảnh báo của Vite. `typecheck`, `lint`, `build:client` đều pass 100%.

---

## PHASE 4 — Documentation & Swagger (Tối giản theo yêu cầu — 0.5 ngày)

> **Lưu ý theo yêu cầu của User:** Bỏ TypeORM migration và idempotent seeder (`REF-024`, `REF-025`, `REF-028`) vì các file migration SQL đã có sẵn trong `database/schema/` và dev tự chạy thủ công. Chỉ tập trung cập nhật `README.md` (`REF-026`) và đồng bộ 100% Swagger Decorators (`REF-027`).

### [~] REF-024, REF-025 & REF-028: ~~TypeORM DataSource, Migration Runner & Idempotent Seeder~~ — **ĐÃ BỎ (theo yêu cầu)**

- **Trạng thái:** `[~] Skipped` — Giữ nguyên các file SQL schema trong `database/schema/` để dev tự chạy thủ công bằng tay. Không tạo TypeORM data-source CLI hay seeder script.
- **Log kết quả:** Bỏ qua ngày 2026-10-29 theo yêu cầu trực tiếp từ User.

---

### [x] REF-026 & REF-027: Đồng bộ README & Swagger Decorators toàn bộ Controller

- **Nhánh (Branch):** `PR-11` (`refactor/docs-swagger`)
- **Trạng thái:** `[x] Done`
- **Files đã xử lý:**
  - `README.md`
  - `apps/service/src/modules/auth/auth.controller.ts`
  - `apps/service/src/modules/auth/dto/auth-me-response.dto.ts`
  - `apps/service/src/modules/auth/dto/auth-response.dto.ts` (mới)
  - `apps/service/src/modules/auth/dto/index.ts`
  - `apps/service/src/modules/user/user.controller.ts`
  - `apps/service/src/modules/profile/profile.controller.ts`
  - `apps/service/src/modules/profile/dto/profile-response.dto.ts`
  - `apps/service/src/modules/profile/dto/upsert-profile.dto.ts`
  - `apps/service/src/modules/profile/dto/update-profile.dto.ts`
  - `apps/service/src/modules/profile/dto/cv-history.dto.ts`
  - `apps/service/src/modules/profile/dto/profile-misc.dto.ts`
  - `apps/service/src/modules/education/dto/search-education.dto.ts`
  - `apps/service/src/modules/companies/companies.controller.ts`
  - `apps/service/src/modules/companies/dto/search-companies.dto.ts`
- **Requirements:**
  - [x] Viết lại `README.md` hoàn chỉnh: Tech stack thật, kiến trúc 3-Tier BE/FE, hướng dẫn chạy file SQL schema, Swagger URL, và các lệnh guardrail `typecheck`, `lint`, `build`.
  - [x] Bổ sung 100% Swagger decorators (`@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiProperty`, `@ApiPropertyOptional`) cho tất cả các endpoint CRUD CV (Skill, Experience, Education, Social Links), Storage, Auth, và User.
  - [x] Sử dụng `PartialType` từ `@nestjs/swagger` cho DTOs kế thừa để Swagger schema hiển thị đúng.
- **Verification:**
  - [x] `npm run typecheck && npm run lint && npm run build` → Pass 100% (Exit code 0).
- **Log kết quả:**
  - Hoàn thành 2026-10-29. Đã đồng bộ toàn bộ Swagger decorators trên 6 Controllers và các DTOs tương ứng. Viết lại `README.md` phản ánh trung thực toàn bộ hệ thống API, cấu trúc thư mục, quy trình setup DB từ file SQL và các lệnh kiểm thử. Typecheck, lint và build service/client đều pass 100% (0 errors).


---

## PHASE 5 — Testing, CI/CD & Observability (5 ngày)

### [ ] REF-029: Unit Tests cho các Module Critical ở Backend (Auth, RefreshToken, OTP, Mappers)

- **Nhánh (Branch):** `PR-12` (`refactor/tests-auth-profile`)
- **Trạng thái:** `[ ] Todo`
- **Files cần xử lý:**
  - Cấu hình Jest cho `apps/service`
  - Tạo các file `*.spec.ts` cho `OtpService`, `RefreshTokenService`, `AuthService`, `ProfileMapper`, `ProfileService`
- **Requirements:**
  - [ ] Thêm target `test` vào `apps/service/project.json` và tắt `passWithNoTests: true` sau khi có test.
  - [ ] Viết unit test bao phủ các kịch bản:
    - OTP: tạo mới, verify đúng, verify sai tăng `attemptCount`, quá 5 lần khoá OTP, OTP hết hạn.
    - Refresh Token: rotation thành công, phát hiện reuse token cũ → revoke toàn bộ token của user.
    - ProfileMapper: map đầy đủ các trường `username`, `completionPercent`, `experiences`, `educations`, `skills`, `socialLinks`.
    - ProfileService: kiểm tra quyền sở hữu (ownership) và ném `ConflictException` / `NotFoundException` đúng chỗ.
- **Verification:**
  - [ ] `npx nx test service` → Pass 100% các test suites.
- **Log kết quả:**
  - _Chưa thực hiện._

---

### [ ] REF-030 & REF-031: Integration Tests cho Auth Flow & Profile CRUD/Ownership

- **Nhánh (Branch):** `PR-12` (`refactor/tests-auth-profile`)
- **Trạng thái:** `[ ] Todo`
- **Files cần xử lý:**
  - Tạo thư mục test integration trong `apps/service/src/`
- **Requirements:**
  - [ ] Kiểm thử luồng Auth (`register` → `verify-email` → `login` → `/auth/me` → `refresh` → `logout`) đảm bảo contract `/auth/me` không bị phá vỡ.
  - [ ] Kiểm thử luồng Profile CRUD & Ownership: User A không thể sửa/xoá Skill, Experience, Education, SocialLink của User B.
- **Verification:**
  - [ ] Toàn bộ test suites chạy pass (`npx nx test service`).
- **Log kết quả:**
  - _Chưa thực hiện._

---

### [ ] REF-032 & REF-033: Frontend Component Tests & E2E Smoke Tests

- **Nhánh (Branch):** `PR-13` (`refactor/ci-workflow-observability`)
- **Trạng thái:** `[ ] Todo`
- **Files cần xử lý:**
  - Cấu hình test cho `apps/client`
  - Tạo test cho Login/Register/Onboarding/Profile
- **Requirements:**
  - [ ] Viết test kiểm tra form validation và luồng submit của Login, Onboarding và Dialog.
  - [ ] Cập nhật script Playwright hoặc E2E smoke test kiểm tra các trang chính render không lỗi console.
- **Verification:**
  - [ ] `npm test` chạy pass cho cả `service` và `client`.
- **Log kết quả:**
  - _Chưa thực hiện._

---

### [ ] REF-034, REF-035 & REF-036: GitHub Actions CI, Structured Logger Redaction & Dead-code Gate

- **Nhánh (Branch):** `PR-13` (`refactor/ci-workflow-observability`)
- **Trạng thái:** `[ ] Todo`
- **Files cần xử lý:**
  - Tạo mới `.github/workflows/ci.yml`
  - Tạo logger redaction / cập nhật logging ở `apps/service`
- **Requirements:**
  - [ ] Tạo `.github/workflows/ci.yml` chạy tự động: `npm ci` → `npm run typecheck` → `npm run lint` → `npm test` → `npm run build`.
  - [ ] Rà soát toàn bộ log trong `apps/service`: đảm bảo không log raw password, token, OTP hay toàn bộ DTO nhạy cảm ở production.
  - [ ] Kiểm tra lần cuối toàn bộ repo không còn `any` thừa và không còn dead code.
- **Verification:**
  - [ ] `npm run typecheck && npm run lint && npm test && npm run build` → **Pass 100%**.
- **Log kết quả:**
  - _Chưa thực hiện._
