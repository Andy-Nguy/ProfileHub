# ProfileHub — Authentication System Report

> **Phạm vi:** Toàn bộ luồng đăng ký, xác thực email và đăng nhập của service backend (NestJS + TypeORM + Supabase PostgreSQL).

---

## 1. Tổng quan kiến trúc

Hệ thống xác thực của ProfileHub được xây dựng theo mô hình **Stateless JWT + Stateful Refresh Token**, kết hợp với **Email OTP** để xác minh danh tính khi đăng ký.

```
Client (Browser / Swagger)
        │
        ▼
   NestJS API (port 3000)
        │
        ├── JwtAuthGuard (Global) ──── bảo vệ toàn bộ route
        ├── RolesGuard (Global) ─────── kiểm tra phân quyền
        ├── ThrottlerGuard (Global) ─── giới hạn tần suất request
        │
        ├── AuthModule
        │     ├── AuthController    ──── định nghĩa API endpoint
        │     ├── AuthService       ──── orchestration logic
        │     ├── JwtStrategy       ──── xác thực Access Token
        │     └── DTO               ──── validation đầu vào
        │
        ├── OtpModule       ──── quản lý vòng đời OTP
        ├── RefreshTokenModule ── quản lý Refresh Token
        ├── MailModule      ──── gửi email (Nodemailer + Gmail)
        └── UserModule      ──── CRUD người dùng
              │
              ▼
     Supabase PostgreSQL
```

---

## 2. Luồng Đăng Ký (Register Flow)

### 2.1 Sơ đồ luồng

```
Client                AuthService          UserService      OtpService       MailService
  │                       │                    │                │                 │
  │── POST /auth/register ─▶                   │                │                 │
  │   { email, username,  │                    │                │                 │
  │     password }        │                    │                │                 │
  │                       │─ assertUnique() ──▶│                │                 │
  │                       │                    │                │                 │
  │                       │─ hashPassword() ───────────────── bcrypt 12 rounds   │
  │                       │                    │                │                 │
  │                       │─ createInactiveUser() ─▶           │                 │
  │                       │   is_active = false│                │                 │
  │                       │                    │                │                 │
  │                       │─ createOtp() ──────────────────────▶│                 │
  │                       │   1. vô hiệu OTP cũ│                │                 │
  │                       │   2. sinh 6 số ngẫu nhiên           │                 │
  │                       │   3. bcrypt hash   │                │                 │
  │                       │   4. lưu DB        │                │                 │
  │                       │                    │                │                 │
  │                       │─ sendVerificationOtp() ─────────────────────────────▶│
  │                       │                    │                │                 │
  │◀── 201 { message } ───│                    │                │                 │
```

### 2.2 Chi tiết các bước

#### Bước 1 — Validation đầu vào
DTO `RegisterDto` xác thực đầu vào trước khi request chạm đến Service.
`ValidationPipe` với `whitelist: true` tự động loại bỏ các field không khai báo trong DTO.

#### Bước 2 — Kiểm tra tính duy nhất (`assertUnique`)
`UserService.assertUnique()` truy vấn DB để đảm bảo **email** và **username** chưa được sử dụng. Nếu trùng sẽ ném lỗi `409 Conflict`.

#### Bước 3 — Hash mật khẩu
Mật khẩu được hash bằng **bcrypt với 12 salt rounds**. Hash này được lưu vào cột `password_hash`. **Mật khẩu gốc không bao giờ được lưu lại.**

#### Bước 4 — Tạo user ở trạng thái không hoạt động
User được tạo với `is_active = false` và `email_verified_at = NULL`. User này **chưa thể đăng nhập** cho đến khi xác thực email.

#### Bước 5 — Tạo và lưu OTP
```
generateOtp()  →  crypto.randomInt(100_000, 999_999)
                  (cryptographically secure, không phải Math.random)

hashOtp()      →  bcrypt.hash(rawOtp, 12)
                  (OTP gốc không được lưu, chỉ lưu hash)

OTP Record lưu DB:
  email         = "user@example.com"
  code_hash     = "$2b$12$..."
  purpose       = "register"
  expires_at    = now() + 5 phút
  attempt_count = 0
  is_used       = false
```

#### Bước 6 — Gửi email
`MailService` sử dụng **Nodemailer + Gmail SMTP (App Password)** để gửi email HTML chứa OTP.

#### Bước 7 — Response
Chỉ trả về thông báo thành công. **Không leak thông tin user, token hay OTP trong response.**

---

## 3. Luồng Xác Thực Email (Verify Email Flow)

### 3.1 Sơ đồ luồng

```
Client               AuthService          OtpService        DB Transaction
  │                      │                    │                   │
  │─ POST /verify-email ─▶                    │                   │
  │  { email, code }     │                    │                   │
  │                      │─ verifyAndConsumeOtp() ─▶              │
  │                      │   1. tìm OTP mới nhất chưa dùng       │
  │                      │   2. kiểm tra hết hạn                 │
  │                      │   3. kiểm tra số lần thử (max 5)      │
  │                      │   4. bcrypt.compare(code, hash)       │
  │                      │   5. đánh dấu is_used = true          │
  │                      │                    │                   │
  │                      │─────────────────────────────────── BEGIN TX
  │                      │   1. user.is_active = true            │
  │                      │   2. user.email_verified_at = now()   │
  │                      │   3. create ProfileEntity             │
  │                      │─────────────────────────────────── COMMIT TX
  │◀─── 200 { message } ─│                    │                   │
```

### 3.2 Cơ chế bảo vệ OTP

| Cơ chế | Chi tiết |
|---|---|
| **Thời gian sống** | 5 phút |
| **Giới hạn thử** | Tối đa 5 lần |
| **Chống brute-force** | Mỗi lần sai tăng `attempt_count`. Vượt 5 → OTP bị vô hiệu |
| **So sánh hằng thời gian** | `bcrypt.compare()` ngăn timing attack |
| **Một lần dùng** | `is_used = true` sau khi xác thực thành công |
| **Vô hiệu OTP cũ** | OTP cũ chưa dùng bị đánh dấu used khi tạo OTP mới |

### 3.3 Atomicity bằng DB Transaction
Kích hoạt user và tạo profile được thực hiện trong **cùng một transaction**. Nếu bất kỳ bước nào thất bại → cả hai đều rollback, không có trạng thái dữ liệu không nhất quán.

---

## 4. Luồng Đăng Nhập (Login Flow)

### 4.1 Sơ đồ luồng

```
Client               AuthController       AuthService         RefreshTokenService
  │                       │                   │                       │
  │─ POST /auth/login ────▶                   │                       │
  │  { email, password }  │                   │                       │
  │                       │─ login(dto, meta)─▶                       │
  │                       │                   │─ findByEmail() ──▶ DB  │
  │                       │                   │                       │
  │                       │                   │  Kiểm tra:            │
  │                       │                   │  1. user tồn tại?     │
  │                       │                   │  2. is_active = true? │
  │                       │                   │  3. bcrypt.compare()  │
  │                       │                   │                       │
  │                       │                   │─ generateTokenPair() ─▶
  │                       │                   │   AccessToken:  15m   │
  │                       │                   │   RefreshToken: 7d    │
  │                       │                   │                       │
  │                       │                   │─ saveRefreshToken() ──▶
  │                       │                   │   lưu bcrypt hash     │
  │                       │                   │                       │
  │                       │  res.cookie(refresh_token, httpOnly)      │
  │◀── 200 ───────────────│                   │                       │
  │  { accessToken, user }│                   │                       │
  │  (refreshToken KHÔNG  │                   │                       │
  │   có trong JSON body) │                   │                       │
```

### 4.2 Dual Token Strategy

| Token | TTL | Lưu ở đâu | Mục đích |
|---|---|---|---|
| **Access Token** | 15 phút | Memory / Authorization Header | Truy cập API |
| **Refresh Token** | 7 ngày | httpOnly Cookie | Gia hạn Access Token |

**Tại sao Refresh Token trong httpOnly Cookie?**
- `httpOnly` → không đọc được bằng JavaScript → miễn nhiễm XSS
- `SameSite=Strict` + `Secure` → ngăn CSRF

**Tại sao chỉ lưu HASH trong DB?**
```
DB lưu:  $2b$12$rK2oBoBois3loX7jX...  (bcrypt hash)
DB KHÔNG lưu:  eyJhbGciOiJIUzI1NiJ...  (raw token)
```
Nếu DB bị breach, kẻ tấn công không thể dùng hash để giả mạo token.

---

## 5. Luồng Authenticated Request

```
Client                    JwtAuthGuard        JwtStrategy         Controller
  │                            │                   │                  │
  │─ GET /api/users/andy ──────▶                   │                  │
  │  Authorization: Bearer ... │                   │                  │
  │                            │  isPublic? → NO   │                  │
  │                            │─ validate(payload) ▶                 │
  │                            │                   │ 1. verify JWT sig │
  │                            │                   │ 2. findOne(user) │
  │                            │                   │ 3. isActive?     │
  │                            │                   │ → req.user       │
  │                            │──────────────────────────────────────▶
  │◀─── 200 ───────────────────────────────────────────────────────── │
```

Route mở public dùng decorator `@Public()` để bypass `JwtAuthGuard`:
```typescript
@Public()
@Post('register')
async register(...) { ... }
```

---

## 6. Luồng Refresh Token

```
Client                  AuthController      RefreshTokenService
  │                          │                      │
  │─ POST /auth/refresh ──────▶                     │
  │  Cookie: refresh_token   │                      │
  │                          │─ validateRefreshToken() ─▶
  │                          │                      │ 1. verify JWT sig (REFRESH_SECRET)
  │                          │                      │ 2. findOne by JTI
  │                          │                      │ 3. is_revoked = false?
  │                          │                      │ 4. expires_at > now?
  │                          │                      │ 5. bcrypt.compare()
  │                          │─ rotateRefreshToken() ─▶
  │                          │                      │ 1. revoke old (is_revoked=true)
  │                          │                      │ 2. generateTokenPair()
  │                          │                      │ 3. saveRefreshToken() (hash)
  │◀─ 200 { accessToken } ───│                      │
  │  + Set-Cookie: new token │                      │
```

**Token Reuse Detection:** Nếu phát hiện refresh token đã bị revoke được dùng lại (dấu hiệu bị đánh cắp) → **revoke toàn bộ session** của user + trả về 401.

---

## 7. Luồng Đăng Xuất (Logout)

```
Client              AuthController       RefreshTokenService
  │                      │                      │
  │─ POST /auth/logout ───▶                     │
  │  Cookie: refresh_token│                      │
  │                      │─ revokeByJti() ────────▶ is_revoked = true
  │                      │  res.clearCookie()   │
  │◀─ 200 { message } ───│                      │
```

> **Lưu ý:** Access Token vẫn hợp lệ đến khi hết hạn (max 15 phút) vì đây là trade-off của kiến trúc JWT stateless.

---

## 8. Database Schema (Auth-related)

### Bảng `users`
| Column | Type | Ghi chú |
|---|---|---|
| `id` | UUID (PK) | Auto-generated |
| `email` | VARCHAR(320) UNIQUE | |
| `username` | VARCHAR(50) UNIQUE | |
| `password_hash` | VARCHAR(255) | bcrypt hash |
| `role` | ENUM | user / admin / moderator |
| `is_active` | BOOLEAN | False khi mới tạo |
| `email_verified_at` | TIMESTAMPTZ NULL | Set sau khi verify OTP |
| `last_login_at` | TIMESTAMPTZ NULL | Cập nhật mỗi lần login |
| `deleted_at` | TIMESTAMPTZ NULL | Soft delete |

### Bảng `otp_codes`
| Column | Type | Ghi chú |
|---|---|---|
| `id` | UUID (PK) | |
| `email` | VARCHAR(320) | |
| `code_hash` | VARCHAR(255) | bcrypt hash của OTP |
| `purpose` | ENUM | register / reset_password |
| `expires_at` | TIMESTAMPTZ | now() + 5 phút |
| `attempt_count` | INT | Tăng khi nhập sai |
| `is_used` | BOOLEAN | True sau khi dùng |

### Bảng `refresh_tokens`
| Column | Type | Ghi chú |
|---|---|---|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | CASCADE DELETE |
| `jti` | UUID | JWT ID, nhúng trong JWT payload |
| `token_hash` | TEXT | bcrypt hash của refresh token |
| `expires_at` | TIMESTAMPTZ | now() + 7 ngày |
| `is_revoked` | BOOLEAN | True sau logout/rotation |
| `user_agent` | TEXT NULL | Audit trail |
| `ip_address` | VARCHAR(45) NULL | Audit trail |

---

## 9. Tổng hợp bảo mật

| Mối đe dọa | Cơ chế phòng thủ |
|---|---|
| Password brute-force | bcrypt (cost=12) + ThrottlerGuard (10 req/phút cho login) |
| OTP brute-force | Max 5 attempts, hết hạn sau 5 phút |
| Timing attack | `bcrypt.compare()` (constant-time) cho cả password lẫn OTP |
| User enumeration | Error message chung: "Invalid email or password" |
| XSS đánh cắp token | Refresh Token trong httpOnly Cookie |
| CSRF | Cookie `SameSite=Strict` + `Secure` |
| DB breach | Chỉ lưu bcrypt hash của Refresh Token |
| Session hijacking | Refresh Token Rotation — token cũ revoke sau mỗi lần dùng |
| Token reuse (stolen) | Phát hiện reuse → revoke ALL sessions của user |
| Privilege escalation | RolesGuard kiểm tra `@Roles()` trên từng endpoint |
| Account chưa xác thực | `is_active = false` block toàn bộ login attempt |
