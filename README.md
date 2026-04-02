# IELTS AI Coach

Ứng dụng web luyện thi IELTS toàn diện, tích hợp AI để cá nhân hóa lộ trình học và cung cấp phản hồi tức thì cho cả 4 kỹ năng.

## Tính năng MVP

- **Listening** — Bài nghe chuẩn IELTS (Section 1–4), form completion, multiple choice
- **Reading** — Bài đọc Academic với T/F/NG, short answer, đồng hồ đếm ngược
- **Writing** — AI chấm bài theo 4 tiêu chí IELTS trong < 30 giây (Claude claude-sonnet-4-6)
- **Speaking** — Ghi âm trực tiếp + Whisper transcription + Claude phân tích
- **Vocabulary** — Flashcard với thuật toán Spaced Repetition (SM-2)
- **Mock Test** — Thi thử đầy đủ 4 kỹ năng
- **Dashboard** — Theo dõi band score, streak, điểm yếu

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL via Prisma + Supabase |
| Auth | Supabase Auth |
| AI - Writing/Speaking | Anthropic Claude claude-sonnet-4-6 |
| AI - Speech-to-Text | OpenAI Whisper |
| Styling | TailwindCSS |
| Deployment | Vercel |

## Cài đặt

### 1. Clone và cài dependencies

```bash
cd ielts-ai-coach
npm install
```

### 2. Cấu hình environment

```bash
cp .env.example .dnv
```

Điền các giá trị sau vào `.dnv`:
- `NEXT_PUBLIC_SUPABASE_URL` — URL từ Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key từ Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key từ Supabase
- `DATABASE_URL` — PostgreSQL connection string (từ Supabase → Settings → Database)
- `ANTHROPIC_API_KEY` — API key từ console.anthropic.com
- `OPENAI_API_KEY` — API key từ platform.openai.com

### 3. Khởi tạo database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Onboarding
│   ├── (app)/           # Dashboard, Reading, Writing, Listening, Speaking, Vocabulary, Mock Test
│   ├── api/             # API routes
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # Button, Card, Badge, Progress
│   ├── layout/          # Sidebar, AppLayout, PageHeader
│   └── shared/          # BandScore, SkillCard, Timer
└── lib/
    ├── prisma.ts        # Prisma client
    ├── supabase.ts      # Supabase client
    ├── auth.ts          # Server-side auth helper
    └── utils.ts         # cn(), calcIeltsBand(), sm2()
```

## API Endpoints

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/onboarding` | Lưu mục tiêu band |
| POST | `/api/ai/grade-writing` | Chấm bài Writing bằng Claude |
| POST | `/api/ai/grade-speaking` | Phân tích Speaking (Whisper + Claude) |
| GET/POST | `/api/vocabulary` | Quản lý từ vựng |
| POST | `/api/vocabulary/review` | Cập nhật SM-2 sau ôn tập |
| GET | `/api/dashboard/summary` | Dữ liệu dashboard |

## Triển khai (Vercel)

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm tất cả environment variables vào Vercel dashboard
4. Deploy!

## Roadmap v2

- [ ] Tính năng cộng đồng / peer review
- [ ] Ứng dụng mobile (React Native)
- [ ] Tích hợp thanh toán (premium features)
- [ ] CMS để thêm đề thi mới
- [ ] Biểu đồ tiến độ chi tiết hơn
- [ ] Notification nhắc ôn từ vựng
