# ProfileHub — Refactor & Quality Plan

> **Phiên bản:** 1.0 — 2026-10-24
> **Phạm vi:** `apps/client`, `apps/service`, `libs/shared`, `database/`
> **Mục tiêu:** đưa codebase từ mức "prototype AI-assisted" lên "production-ready, senior-grade" **mà không thay đổi hành vi người dùng**.
> **Cách làm:** mỗi phase ship độc lập, PR nhỏ, mọi thay đổi phải được typecheck/lint/test chứng minh.

---

## 1. TL;DR

| Hạng mục            | Hiện tại                                             | Mục tiêu sau refactor                                     |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| `tsc` client        | **12 lỗi**                                           | 0 lỗi                                                     |
| `npm run lint`      | **no-op**, exit 0                                    | chạy thật, 0 error                                        |
| Test                | **0**                                                | module critical có test + coverage threshold              |
| File chết           | **9+**                                               | 0                                                         |
| `any` / `as any`    | **23**                                               | < 5, không thêm mới                                       |
| Contract FE ↔ BE    | lệch (`completionPercent`, `likesCount`, `username`) | 1 nguồn type, compiler bắt lệch                           |
| API docs            | README/Swagger lệch thực tế                          | khớp 100%                                                 |
| OTP trong log       | **có**                                               | không                                                     |
| Bundle JS           | **944 KB**                                           | < 500 KB initial (code-split)                             |
| Thời lượng ước tính | —                                                    | **~19 dev-days** (full-time ~4 tuần; part-time ~7–8 tuần) |

**Kết luận chẩn đoán:** cấu trúc thư mục và kiến trúc backend ở mức khá (8/10 và 7/10), nhưng chất lượng thực thi và tính nhất quán chỉ ~4–5/10. Vấn đề chính **không phải** là code lộn xộn về tổ chức, mà là:

1. Code được sinh ra hàng loạt nhưng **không được nối vào nhau** (mapper không dùng, Zod shared không dùng, endpoint ảo).
2. **Không có hàng rào chất lượng** (typecheck/lint/test đều vô hiệu).
3. **Trùng lặp nhiều thế hệ implementation** cho cùng một chức năng.

---

## 2. Chẩn đoán hiện trạng

### 2.1 Điểm mạnh (giữ nguyên, không phá)

- Monorepo Nx rõ ràng: `apps/client`, `apps/service`, `libs/shared`.
- Backend module hoá theo domain; có `Controller → Service → Repository → Entity`.
- Auth có thiết kế tốt: refresh token rotation, lưu hash, phát hiện reuse, khoá `FOR UPDATE` chống race, httpOnly cookie, throttle theo route.
- Dùng DTO + `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`).
- Swagger, global guards, soft-delete check, phân quyền theo role.
- Repo hygiene tốt: không track `node_modules`/`dist`/`.env`/ảnh; `.env.example` đầy đủ.
- i18n en/vi khớp key 100% (33/37/60).
- UI bám mockup, responsive, có screenshot cho desktop/mobile.

### 2.2 Vấn đề P0 — chặn chất lượng, phải sửa trước mọi feature mới

| #    | Vấn đề                                                                      | Bằng chứng                                                                                                                          |
| ---- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| P0-1 | Client typecheck fail 12 lỗi, nhưng `vite build` vẫn pass nên không ai biết | `npx tsc -p apps/client/tsconfig.json --noEmit`; 7 file import `ProfileResponse` từ `services/profile.service.ts` nơi không export  |
| P0-2 | Lint là no-op                                                               | `npm run lint` → `NX No tasks were run`, exit 0; `eslint.config.mjs` import `@typescript-eslint/*` chưa cài; không có target `lint` |
| P0-3 | Contract FE/BE lệch                                                         | Client cần `completionPercent/likesCount/username`; BE trả raw entity. `ProfileMapper.toProfileResponseDto()` có nhưng không dùng   |
| P0-4 | Lỗi nghiệp vụ thành 500                                                     | `profile.repository.ts:137,205` ném `throw new Error(...)` thay vì `ConflictException`                                              |
| P0-5 | OTP bị ghi ra log                                                           | `mail.service.ts:56` log nguyên OTP; email nói 10 phút nhưng code 5 phút; lỗi gửi mail bị nuốt                                      |
| P0-6 | API client bị đi vòng                                                       | Dialog gọi trực tiếp `apiClient.put/delete`, `catch {}` rỗng; `useApi` tự `fetch('/api/...')` không token/refresh                   |

### 2.3 Vấn đề P1 — nợ kỹ thuật, nên dọn trong 2–3 tuần

- **Dead code:** `ProfileCard`, `SkillChip`, `ProfileEditDialog`, `MockTestPage`, `ProfileBuilderPage`, `types/enums.ts`, `utils/debounce.ts`; `existsSkillByNormalizedName`; MockTestPage/ProfileBuilderPage không có route.
- **Endpoint ảo:** `GET /profiles/me/experiences|skills|social-links`, `GET /profiles/:username`, `POST /interactions`.
- **Trùng lặp:** `ProfilePage` vs `PublicProfilePage`; 3 biến thể skill chip; 2 debounce; `EducationDialog` copy nguyên `ExperienceDialog` ("mirrors exactly"); 13 khối lặp trong `profile.service.ts`.
- **Controller vi phạm AGENTS.md:** `getDiscoveryFeed` map/filter và gán `u.profile.user = u`; nhiều endpoint trả raw entity.
- **i18n nửa vời:** toàn bộ dialog + footer hardcode; footer luôn tiếng Việt kể cả khi chọn EN.
- **Onboarding reload SPA:** `navigate()` rồi `window.location.reload()`; đọc localStorage bằng key hardcode lần 2.
- **Discovery "giả":** client gửi `page/limit/search` nhưng BE bỏ qua, tải toàn bộ user.
- **Schema lẫn lộn:** `database/schema/` có cả schema conceptual đã bỏ (`auth_profiles`, `projects`, `user_skills`) lẫn schema thật; không có migration runner.
- **Docs lệch:** README liệt kê endpoint không tồn tại.

### 2.4 Vấn đề P2 — cải thiện dài hạn

- Không có test, không CI, `jest.preset.js` đặt `passWithNoTests: true`.
- 23 chỗ `any`, nhiều `catch (err: any)`.
- Bundle 944 KB, không code-split.
- Chưa có structured logging/redaction; logger dùng emoji, log cả payload DTO.
- Chưa có cấu hình validate lúc boot (thiếu env sẽ fail runtime thay vì fail fast).
- Accessibility chưa được kiểm tra (dialog, focus trap, aria).

---

## 3. Mục tiêu / Phi mục tiêu

### Mục tiêu

1. **Correctness:** compiler và test bắt được lỗi trước khi merge.
2. **Maintainability:** một khái niệm — một implementation; xoá hết dead code.
3. **Contract safety:** FE và BE dùng chung một nguồn type; sai lệch là lỗi compile.
4. **Security:** không rò rỉ OTP/secret; lỗi auth rõ ràng; token handling nhất quán.
5. **DX:** lệnh chuẩn hoá (`nx typecheck`, `nx lint`, `nx test`, `nx build`) chạy được và có ý nghĩa.

### Phi mục tiêu (không làm trong đợt này)

- Không viết lại UI/design system.
- Không đổi luồng auth, không đổi contract `/auth/me` (ràng buộc của `AGENTS.md`).
- Không thêm feature mới (Messages, Network, Analytics vẫn Coming Soon).
- Không đổi framework/ORM.
- Không tối ưu micro-performance khi chưa có số đo.

---

## 4. Nguyên tắc kỹ thuật & Definition of Done

### 4.1 Quy tắc kiến trúc

- **Controller** chỉ HTTP: nhận request, gọi service, trả DTO. Không query, không map, không gán quan hệ.
- **Service** chứa business logic, điều phối repository, ném Nest exception.
- **Repository** chỉ truy vấn. Không ném `Error` trần; nếu cần báo lỗi nghiệp vụ, service kiểm tra và ném exception.
- **Không trả entity ra API.** Mọi response đi qua mapper → DTO.
- **FE:** mọi HTTP đi qua một `apiClient` duy nhất (auth header, refresh, error normalization). Không `fetch` trực tiếp trong page/component.
- **Server state** do TanStack Query quản lý; không duplicate bằng `useEffect + useState` nếu không có lý do.
- **Một component một khái niệm:** không tồn tại 2 phiên bản skill chip / profile page / debounce.

### 4.2 Quy tắc contract

- `libs/shared/types` là **nguồn sự thật** cho payload FE/BE.
- DTO backend phải `implements` interface shared tương ứng (compiler bắt drift).
- Endpoint mới phải có: DTO request + DTO response + Swagger decorator + test.
- Không đổi shape `/auth/me`; nếu buộc phải đổi, bump version và cập nhật `AuthMeResponseDto` + FE cùng PR.

### 4.3 Quy tắc lỗi & log

- 4xx do client → `BadRequestException` / `UnauthorizedException` / `ForbiddenException` / `NotFoundException` / `ConflictException`.
- 5xx chỉ dành cho lỗi không lường trước; có global exception filter để format thống nhất.
- Log không chứa: password, raw OTP, token, cookie, Authorization header, email body.
- Log có cấu trúc (JSON) ở production; emoji chỉ dùng ở dev.

### 4.4 Definition of Done cho mỗi PR

- [ ] `nx typecheck <project>` pass
- [ ] `nx lint <project>` pass (lint thật, không no-op)
- [ ] `nx test <project>` pass; logic mới có test
- [ ] `nx build <project>` pass
- [ ] Không thêm `any`, `@ts-ignore`, `console.log`
- [ ] Không thêm file/export không dùng (kiểm tra bằng `knip`/`ts-prune`)
- [ ] Swagger/README cập nhật nếu đổi API
- [ ] PR ≤ 400 dòng diff; mô tả rõ "before/after"

### 4.5 Quy tắc dừng dây (stop-the-line)

Khi phát hiện một trong các điều sau, **dừng feature mới** và sửa ngay:

- `main` đỏ ở typecheck/lint/test.
- Có secret/OTP/token trong log hoặc repo.
- Contract FE/BE lệch khiến UI hiển thị `undefined`.
- Endpoint trả 500 cho lỗi nghiệp vụ đã biết.

---

## 5. Kiến trúc đích

### 5.1 Backend (giữ Nx, tách `core`)

```
apps/service/src/
  main.ts
  app.module.ts
  core/
    config/          # env schema (Zod), typed config service
    database/        # data-source.ts, migrations runner
    filters/         # AllExceptionsFilter
    interceptors/    # logging, transform
    guards/          # jwt, roles (move từ modules/auth)
    logger/          # structured logger, redaction
  common/
    decorators/
    dto/             # pagination, error response
    utils/
  modules/
    auth/{controller,service,repository,dto,strategies}
    user/
    profile/{controller,service,repository,dto,mappers}
    company/
    education/
    storage/
    otp/
    mail/
    refresh-token/
```

Quy ước đặt tên module: **số ít** (`company`, `education`) trừ khi là bounded context rõ ràng. Thống nhất `dto/` cho mọi module.

### 5.2 Frontend (Mô hình 3 tầng chuẩn HR Systems: 3-Tier Frontend Architecture)

```
┌──────────────────────────────────────────────┐
│  UI Components / Pages / Dialogs             │
│  (ProfilePage, ExperienceDialog, etc.)       │
└──────────────────────┬───────────────────────┘
                       │ (Chỉ gọi Hook hoặc Service)
                       ▼
┌──────────────────────────────────────────────┐
│  Hooks & Services Layer                      │
│  (useDiscoveryFeed, profileAPI, authAPI,...) │
└──────────────────────┬───────────────────────┘
                       │ (Chỉ tầng này gọi apiClient)
                       ▼
┌──────────────────────────────────────────────┐
│  HTTP Client Layer                           │
│  (apiClient: Auth header, refresh, retry)    │
└──────────────────────────────────────────────┘
```

**Quy tắc bất di bất dịch của HR Systems:**
1. **Tuyệt đối không dùng `fetch()` trần**: Toàn bộ HTTP request trong hệ thống bắt buộc phải đi qua `apiClient` (Axios wrapper) để không bị bypass Interceptors (auth token, refresh token mutex, error handling).
2. **Component/Dialog không bao giờ được import `apiClient`**: Chỉ các file trong `src/services/*.service.ts` mới được gọi `apiClient`. Component chỉ gọi hàm từ tầng Service.
3. **Xử lý lỗi minh bạch**: Không bao giờ để `catch {}` rỗng; luôn hiển thị toast hoặc thông báo lỗi cho người dùng.

```
apps/client/src/
  app/
    App.tsx
    router.tsx
    providers.tsx        # QueryClient, AuthProvider, i18n
  features/
    auth/{pages,components,hooks,api}
    profile/{pages,components,hooks,api}
    discovery/{pages,components,hooks,api}
  shared/
    ui/                  # Button, Dialog, Field, Loader...
    hooks/               # useDebounce, useMinimumLoading
    lib/                 # api-client, storage, format
    i18n/
```

Nguyên tắc chuyển: **làm từng feature một**, giữ import cũ hoạt động trong lúc chuyển; không di chuyển file mà không sửa import.

### 5.3 Shared

```
libs/shared/
  types/       # domain + API contracts (nguồn sự thật)
  contracts/   # Zod schema dùng cho form validation ở FE (nếu dùng)
  ui/          # component thật sự dùng chung (M3Card, ProfileHeader, Timeline...)
```

- `libs/shared/ui`: chỉ giữ component được ≥ 2 feature dùng. Component chỉ một nơi dùng → đưa về feature đó.
- `libs/shared/data-access`: hoặc dùng thật (validate form bằng `safeParse`), hoặc xoá. Không giữ "trang trí".
- Bổ sung `project.json` + tags cho libs để `enforce-module-boundaries` có hiệu lực.

---

## 6. Roadmap theo phase

> Ước lượng theo **dev-day** cho 1 senior. Có thể chạy song song nếu có ≥ 2 người.

### Phase 0 — Baseline & an toàn (0.5 ngày)

**Mục tiêu:** biết chính xác mình đang ở đâu trước khi sửa.

- [ ] Tạo nhánh `refactor/quality-baseline`, commit/tag baseline.
- [ ] Ghi lại số đo: `tsc` errors, `lint` result, build size, danh sách file không dùng.
- [ ] Backup DB (`pg_dump`) trước mọi thay đổi schema.
- [ ] Chạy `npx knip` (hoặc `ts-prune`) để có inventory dead code chính thức.
- [ ] Tạo `docs/refactor/` chứa báo cáo baseline và quyết định (ADR ngắn).

**Exit criteria:** có file baseline trong repo; mọi người biết "đỏ" ở đâu.

---

### Phase 1 — Guardrails + P0 (3 ngày)

**Mục tiêu:** từ nay mọi lỗi P0 không thể lọt qua.

| Task    | Nội dung                                                                                                                 | Ước lượng |
| ------- | ------------------------------------------------------------------------------------------------------------------------ | --------- |
| REF-001 | Sửa export type: import `ProfileResponse`/`DiscoveryFeedResponse` từ `@profilehub/types`, hoặc re-export đúng từ service | 0.5d      |
| REF-002 | Thêm target/CI `typecheck` cho client + service                                                                          | 0.25d     |
| REF-003 | Sửa ESLint: cài `@typescript-eslint/*` hoặc dùng `@nx/eslint` plugin; thêm target `lint` cho 2 app + libs                | 0.5d      |
| REF-004 | Sửa OTP logging + mail error handling + thống nhất thời hạn OTP                                                          | 0.5d      |
| REF-005 | Đổi `throw new Error` → `ConflictException`; thêm global exception filter                                                | 0.5d      |
| REF-006 | Xoá dead code client (danh sách Appendix A)                                                                              | 0.25d     |
| REF-007 | Xoá method/endpoint ảo khỏi client service & hook                                                                        | 0.5d      |

**Exit criteria:**

- `npx tsc -p apps/client/tsconfig.json --noEmit` → 0 lỗi
- `npx nx run-many --target=lint --all` → chạy thật, 0 error
- `grep -r "Verification OTP"` không còn trong log code
- Không còn `throw new Error` trong repository

---

### Phase 2 — Contract & backend cleanup (Pragmatic, ~2 ngày)

> **Điều chỉnh (2026-10-26):** đồ án cá nhân → theo phong cách HR Systems, tránh over-engineering: giữ mapper hiện có (chỉ thêm 4 mảng CV, `?? []`), DTO `implements` shared interface, không `core/`, không Zod env, filter dùng `Logger` mặc định, search discovery chỉ theo name/headline/username. Vẫn giữ `AGENTS.md` (không `any`, không raw Entity). Chi tiết: `REFACTOR_CHECKLIST.md`.

**Mục tiêu:** một nguồn type, không raw entity, lỗi đúng HTTP code.

| Task    | Nội dung                                                                            | Ước lượng |
| ------- | ----------------------------------------------------------------------------------- | --------- |
| REF-008 | Bắt buộc DTO `implements` interface shared; sửa `ProfileResponseDto` cho khớp       | 0.5d      |
| REF-009 | Dùng `ProfileMapper` cho `/profiles/mine`, `/profiles/:id`, `/profiles/u/:username` | 1d        |
| REF-010 | Xoá hack `u.profile.user = u`; sửa query/mapper để lấy username đúng cách           | 0.5d      |
| REF-011 | Tách logic khỏi controller; controller chỉ gọi service + mapper                     | 0.5d      |
| REF-012 | Chuẩn hoá error handling toàn backend; thêm `AllExceptionsFilter`                   | 0.5d      |
| REF-013 | ~~Validate env bằng Zod~~ — **BỎ** (theo HR: dùng `@nestjs/config` + `ValidationPipe` sẵn có) | 0       |
| REF-014 | Discovery: nhận `page/limit/search`, filter + paginate ở repository                 | 0.5d      |

**Exit criteria:**

- Không endpoint nào trả entity trực tiếp (kiểm tra bằng review + test).
- `/profiles/mine` trả đủ `username`, `completionPercent`, `likesCount`, `skills`, `experiences`, `educations`, `socialLinks`.
- Discovery trả đúng `page/limit/total/totalPages`; search hoạt động ở server.
- Thiếu env bắt buộc → app fail ngay khi boot với message rõ.

---

### Phase 3 — Frontend cleanup (4 ngày)

**Mục tiêu:** hết trùng lặp, một đường HTTP duy nhất, UI nhất quán.

| Task    | Nội dung                                                                      | Ước lượng |
| ------- | ----------------------------------------------------------------------------- | --------- |
| REF-015 | Gộp `ProfilePage` + `PublicProfilePage` thành một page (own/public qua route) | 1d        |
| REF-016 | Gom API về `shared/lib/api-client`; xoá `fetch` trực tiếp trong hook/page     | 0.5d      |
| REF-017 | Dialog dùng service/hook, không gọi `apiClient` trực tiếp; bỏ `catch {}` rỗng | 0.5d      |
| REF-018 | Extract autocomplete + logo upload dùng chung cho Education/Experience        | 0.75d     |
| REF-019 | Gộp skill chip (3 → 1) và debounce (2 → 1)                                    | 0.25d     |
| REF-020 | Bỏ `window.location.reload()`; dùng state/query invalidation                  | 0.25d     |
| REF-021 | Bỏ hardcode key localStorage; dùng `auth-session.service`                     | 0.25d     |
| REF-022 | i18n toàn bộ dialog + footer; bỏ chuỗi hardcode                               | 0.75d     |
| REF-023 | Code-split route (`React.lazy`) + manualChunks; mục tiêu < 500 KB initial     | 0.5d      |

**Exit criteria:**

- Không còn import chéo giữa page/component và service lạ.
- `grep -r "apiClient\." apps/client/src/components apps/client/src/pages` → 0.
- Chỉ còn 1 skill chip, 1 debounce, 1 profile page.
- Chuyển EN/VI: footer và dialog đổi ngôn ngữ đúng.
- Bundle initial < 500 KB (đo bằng `vite build`).

---

### Phase 4 — Data layer, docs, schema (2.5 ngày)

| Task    | Nội dung                                                                                                 | Ước lượng |
| ------- | -------------------------------------------------------------------------------------------------------- | --------- |
| REF-024 | Tạo `data-source.ts`, baseline migration từ schema hiện tại; bật `synchronize: false` + script migration | 1d        |
| REF-025 | Xoá schema conceptual (`auth_profiles`, `projects`, `user_skills`) khỏi `database/schema/`               | 0.25d     |
| REF-026 | Viết lại README theo API thật; cập nhật AGENTS.md nếu có quy ước mới                                     | 0.5d      |
| REF-027 | Đồng bộ Swagger: mọi endpoint có DTO + response mô tả                                                    | 0.5d      |
| REF-028 | Seed script idempotent cho dev (thay `seed-profiles.sql` thủ công)                                       | 0.25d     |

**Exit criteria:**

- `npm run migration:run` tạo DB từ zero thành công.
- `database/schema/` chỉ còn migration có thứ tự; không còn bảng "conceptual".
- README khớp 100% route trong controller.
- Swagger `Try it out` chạy được các luồng chính.

---

### Phase 5 — Test, CI, observability (5 ngày)

| Task    | Nội dung                                                                             | Ước lượng |
| ------- | ------------------------------------------------------------------------------------ | --------- |
| REF-029 | Unit test: refresh-token rotation/reuse, OTP, mappers, helpers                       | 1.5d      |
| REF-030 | Integration test (supertest + test DB): register → verify → login → refresh → logout | 1.5d      |
| REF-031 | Integration test profile CRUD + ownership (không sửa được profile người khác)        | 0.75d     |
| REF-032 | FE test: form Login/Register/Onboarding + dialog validation (Vitest + RTL + MSW)     | 1d        |
| REF-033 | E2E smoke Playwright: register → verify → onboard → public profile (chạy nightly)    | 0.75d     |
| REF-034 | GitHub Actions CI: typecheck → lint → test → build; branch protection                | 0.5d      |
| REF-035 | Structured logging + redaction; bỏ emoji log ở production                            | 0.5d      |
| REF-036 | `knip`/`depcheck` vào CI để chặn dead code/dependency thừa                           | 0.25d     |

**Exit criteria:**

- Coverage: service critical ≥ 70%, client critical ≥ 50% (đặt threshold trong config).
- CI xanh trên PR; không cho merge nếu đỏ.
- E2E smoke pass trên môi trường staging.
- Log production không chứa PII/secret.

---

## 7. Backlog tổng hợp (ưu tiên thực thi)

| ID      | P   | Area       | Task                                                   | Effort |
| ------- | --- | ---------- | ------------------------------------------------------ | ------ |
| REF-001 | P0  | FE type    | Sửa export `ProfileResponse` / `DiscoveryFeedResponse` | S      |
| REF-002 | P0  | Tooling    | Thêm target + CI typecheck                             | S      |
| REF-003 | P0  | Tooling    | Sửa ESLint, thêm target lint                           | S      |
| REF-004 | P0  | Security   | Bỏ log OTP, sửa mail error, thống nhất expiry          | S      |
| REF-005 | P0  | BE error   | Thay `Error` trần bằng Nest exception                  | S      |
| REF-006 | P0  | Hygiene    | Xoá dead code client                                   | S      |
| REF-007 | P0  | FE API     | Xoá endpoint/method ảo                                 | S      |
| REF-008 | P1  | Contract   | DTO implements shared interface                        | S      |
| REF-009 | P1  | Contract   | Dùng mapper cho mọi endpoint profile                   | M      |
| REF-010 | P1  | BE clean   | Bỏ hack `profile.user = u`                             | S      |
| REF-011 | P1  | BE clean   | Tách logic khỏi controller                             | S      |
| REF-012 | P1  | BE error   | Global exception filter                                | S      |
| REF-013 | P1  | Config     | ~~Validate env bằng Zod~~ (ĐÃ BỎ — pragmatic)          | —      |
| REF-014 | P1  | BE feature | Discovery pagination + search thật                     | M      |
| REF-015 | P1  | FE clean   | Gộp 2 profile page                                     | M      |
| REF-016 | P1  | FE API     | Centralize api client                                  | S      |
| REF-017 | P1  | FE error   | Dialog không gọi apiClient trực tiếp                   | S      |
| REF-018 | P1  | FE DRY     | Shared autocomplete/upload component                   | M      |
| REF-019 | P1  | FE DRY     | Gộp skill chip + debounce                              | S      |
| REF-020 | P1  | FE clean   | Bỏ `window.location.reload()`                          | S      |
| REF-021 | P1  | FE clean   | Bỏ hardcode storage key                                | S      |
| REF-022 | P1  | i18n       | Dịch toàn bộ dialog + footer                           | M      |
| REF-023 | P2  | Perf       | Code-split, bundle < 500 KB                            | S      |
| REF-024 | P1  | DB         | Baseline migration + runner                            | M      |
| REF-025 | P1  | DB         | Xoá schema conceptual                                  | S      |
| REF-026 | P1  | Docs       | README/AGENTS khớp thực tế                             | S      |
| REF-027 | P1  | Docs       | Swagger đồng bộ                                        | S      |
| REF-028 | P2  | DX         | Seed idempotent                                        | S      |
| REF-029 | P1  | Test       | Unit auth/refresh/OTP/mapper                           | M      |
| REF-030 | P1  | Test       | Integration auth flow                                  | M      |
| REF-031 | P1  | Test       | Integration profile ownership                          | S      |
| REF-032 | P2  | Test       | FE form/dialog tests                                   | M      |
| REF-033 | P2  | Test       | Playwright smoke                                       | S      |
| REF-034 | P1  | CI         | GitHub Actions + branch protection                     | S      |
| REF-035 | P2  | Ops        | Structured logging + redaction                         | S      |
| REF-036 | P2  | CI         | knip/depcheck gate                                     | S      |

> Effort: S ≤ 0.5 ngày, M ≈ 1 ngày, L > 1 ngày.

---

## 8. Chiến lược test

### 8.1 Test pyramid

```
        E2E (Playwright)         ~5 kịch bản smoke
      Integration (supertest)    auth flow, profile ownership, refresh rotation
    Unit (Jest / Vitest)         service, mapper, helper, hook
```

### 8.2 Các case bắt buộc

**Auth**

- Register: email trùng, username trùng, password yếu, email sai format.
- Verify: OTP đúng, sai, hết hạn, quá 5 lần, dùng lại OTP.
- Login: đúng, sai password, user inactive, user deleted.
- Refresh: token hợp lệ → rotate; reuse token cũ → revoke all; cookie thiếu → 401.
- Logout: revoke đúng token, cookie bị clear.

**Profile**

- User A không sửa/xoá được skill/experience/education của user B.
- Upsert profile tạo mới khi chưa có, update khi đã có.
- Public profile không lộ email.
- Discovery: pagination đúng, search theo tên/skill, user private không xuất hiện (nếu áp dụng visibility).

**FE**

- Login submit → gọi đúng endpoint → lưu session → redirect.
- Onboarding submit → needsOnboarding = false → không reload.
- Dialog validation: required field, date range, URL social link.

### 8.3 Test data

- Factory function cho user/profile/experience, dùng transaction rollback hoặc DB riêng.
- Không dùng `seed-profiles.sql` cho test.

---

## 9. CI/CD

### 9.1 Pipeline đề xuất (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: profilehub_test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready --health-interval 10s
          --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx nx run-many --target=typecheck --all
      - run: npx nx run-many --target=lint --all
      - run: npx nx run-many --target=test --all --coverage
      - run: npx nx run-many --target=build --all
      - run: npx knip --no-progress
```

### 9.2 Quy tắc

- Branch protection: require CI + 1 review.
- Không merge khi đỏ; không `--no-verify`.
- Commit theo Conventional Commits: `fix(auth): ...`, `refactor(profile): ...`.
- Mỗi PR chỉ thuộc một REF-ID.

---

## 10. Kế hoạch migration DB

1. Tạo `apps/service/src/core/database/data-source.ts` đọc env.
2. Sinh baseline migration từ schema hiện tại (không sửa dữ liệu).
3. Thêm scripts:
   ```json
   {
     "migration:generate": "typeorm migration:generate -d apps/service/src/core/database/data-source.ts",
     "migration:run": "typeorm migration:run -d apps/service/src/core/database/data-source.ts",
     "migration:revert": "typeorm migration:revert -d apps/service/src/core/database/data-source.ts"
   }
   ```
4. Xoá `database/schema/202601050-Conceptual-schema.sql`; giữ lịch sử schema thật dưới dạng migration.
5. CI: chạy `migration:run` trên DB trống + `migration:revert` một bước để đảm bảo reversible.
6. Không bật `synchronize` ở bất kỳ môi trường nào.

---

## 11. Rủi ro & giảm thiểu

| Rủi ro                            | Mức        | Giảm thiểu                                                          |
| --------------------------------- | ---------- | ------------------------------------------------------------------- |
| Đổi contract làm FE vỡ            | Cao        | Dùng chung type + contract test; PR đổi cả 2 đầu; feature branch    |
| Migration làm mất dữ liệu         | Cao        | Backup trước; migration chỉ additive; review kỹ; chạy staging trước |
| Refactor auth ảnh hưởng đăng nhập | Cao        | Giữ nguyên `/auth/me`; test integration trước khi sửa               |
| Xoá dead code nhầm file còn dùng  | Trung bình | `knip` + `tsc --noUnusedLocals`; xoá theo từng PR nhỏ               |
| Phase kéo dài                     | Trung bình | Timebox từng phase; phase nào xong ship ngay; không gộp PR lớn      |
| Thiếu người review                | Thấp       | Pair review; checklist DoD thay cho review sâu                      |

---

## 12. KPI & báo cáo

Đo hàng tuần, ghi vào `docs/refactor/metrics.md`:

| KPI                   | Baseline      | Mục tiêu                  |
| --------------------- | ------------- | ------------------------- |
| `tsc` errors          | 12            | 0                         |
| ESLint errors         | không đo được | 0                         |
| Test count / coverage | 0 / 0%        | ≥ 40 test, critical ≥ 70% |
| Dead exports          | ~20           | 0                         |
| `any` count           | 23            | < 5                       |
| Bundle initial        | 944 KB        | < 500 KB                  |
| Endpoint có test      | 0             | 100% auth + profile       |
| Thời gian CI          | —             | < 10 phút                 |

---

## 13. 48 giờ đầu tiên (làm ngay)

```bash
# 1. Nhánh làm việc
git checkout -b refactor/quality-baseline

# 2. Ghi baseline
npx tsc -p apps/client/tsconfig.json --noEmit 2>&1 | tee docs/refactor/baseline-tsc.txt
npx nx run-many --target=lint --all 2>&1 | tee docs/refactor/baseline-lint.txt
npx vite build --config apps/client/vite.config.ts 2>&1 | tee docs/refactor/baseline-build.txt
```

Thứ tự PR đề xuất:

1. **PR-1 (REF-001):** sửa import type → `tsc` client về 0.
2. **PR-2 (REF-002/003):** thêm typecheck + lint thật vào Nx/CI.
3. **PR-3 (REF-004/005):** bỏ log OTP, sửa `throw new Error`, thêm exception filter.
4. **PR-4 (REF-006/007):** xoá dead code + endpoint ảo.
5. **PR-5 (REF-009):** nối mapper vào các endpoint profile.

Sau 5 PR này, codebase đã "sạch đường" để bắt đầu Phase 2.

---

## Phụ lục A — Inventory dead code

| File                                                               | Trạng thái                 | Hành động                     |
| ------------------------------------------------------------------ | -------------------------- | ----------------------------- |
| `apps/client/src/components/ProfileCard.tsx`                       | không import               | xoá                           |
| `apps/client/src/components/SkillChip.tsx`                         | không import               | xoá                           |
| `apps/client/src/components/profile/ProfileEditDialog.tsx`         | không import               | xoá                           |
| `apps/client/src/pages/MockTestPage.tsx`                           | không route                | xoá                           |
| `apps/client/src/pages/ProfileBuilderPage.tsx`                     | không route                | xoá                           |
| `apps/client/src/types/enums.ts`                                   | không import               | xoá                           |
| `apps/client/src/utils/debounce.ts`                                | trùng `hooks/useDebounce`  | xoá                           |
| `ProfileRepository.existsSkillByNormalizedName`                    | không gọi                  | xoá                           |
| `profileAPI.getExperiences/getSkills/getEducations/getSocialLinks` | endpoint không tồn tại     | xoá hoặc thêm endpoint + dùng |
| `useProfile`, `useToggleLike`                                      | endpoint sai/không tồn tại | xoá hoặc sửa                  |
| `libs/shared/ui/src/lib/SkillChip.tsx`                             | chỉ MockTestPage dùng      | xoá sau khi xoá MockTestPage  |

## Phụ lục B — Ma trận contract endpoint

| Endpoint                         | Hiện tại trả                   | Mục tiêu                                              |
| -------------------------------- | ------------------------------ | ----------------------------------------------------- |
| `GET /profiles/mine`             | raw `ProfileEntity`            | `ProfileResponseDto` (đủ username, completion, likes) |
| `GET /profiles/u/:username`      | raw `ProfileEntity`            | `ProfileResponseDto`                                  |
| `GET /profiles/:id`              | raw `ProfileEntity`            | `ProfileResponseDto`                                  |
| `GET /profiles/discover`         | mapping thủ công, bỏ qua query | `DiscoveryFeedResponseDto`, có pagination/search      |
| `PATCH /profiles/me`             | raw entity                     | `ProfileResponseDto`                                  |
| `POST/PUT/DELETE /profiles/me/*` | entity                         | DTO tương ứng (Skill/Experience/Education/SocialLink) |
| `GET /auth/me`                   | object tự do                   | `AuthMeResponseDto` (giữ contract hiện tại)           |
| `POST /interactions`             | không tồn tại                  | xoá khỏi FE hoặc implement module                     |

## Phụ lục C — Checklist review nhanh

Khi review PR, hỏi 6 câu:

1. Controller có query/map không?
2. Response có phải DTO/mapper không?
3. Lỗi nghiệp vụ có đúng 4xx không?
4. Có log secret/PII không?
5. Có thêm code trùng/dead không?
6. Type shared có bị định nghĩa lại ở nơi khác không?

---

_Hết plan. Cập nhật tiến độ bằng cách tick checkbox và ghi mét vào_ `docs/refactor/metrics.md`_._
