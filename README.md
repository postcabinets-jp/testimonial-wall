# Testimonial Wall

Open-source alternative to [Senja](https://senja.io) / [Testimonial.to](https://testimonial.to).

顧客レビューを収集・管理・表示するためのセルフホスト型ツール。月額課金なし、収集数制限なし。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpostcabinets-jp%2Ftestimonial-wall&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20project%20credentials&project-name=testimonial-wall&repository-name=testimonial-wall)

## Features

- **収集フォーム** — URLを送るだけ。顧客が星評価・テキスト・役職を入力。認証不要。
- **承認フロー** — 全レビューを管理画面で確認。承認/却下/注目設定をワンクリック。
- **Wall of Love** — Masonry Grid / カルーセル / リストの3レイアウト。
- **埋め込みウィジェット** — scriptタグ1行でどのサイトにも設置。Shadow DOM実装。
- **マルチプロジェクト** — 複数のプロダクト・サイトを1アカウントで管理。
- **制限なし** — 収集数、プロジェクト数、表示数すべて無制限。

## Tech Stack

- **Next.js 16** (App Router, TypeScript strict)
- **Supabase** (PostgreSQL + Auth + RLS)
- **Tailwind CSS v4** + shadcn/ui
- **Vercel** 対応

## Quick Start

### 1. Supabase プロジェクトを作成

[supabase.com](https://supabase.com) で新規プロジェクトを無料で作成し、SQLエディタで以下を実行:

```sql
-- supabase/migrations/001_initial_schema.sql の内容を全コピーして実行
```

### 2. 環境変数を設定

```bash
cp .env.example .env.local
# .env.local を編集して Supabase の URL と anon key を設定
# 値は Supabase Dashboard → Project Settings → API で確認
```

### 3. 依存関係インストールと起動

```bash
npm install
npm run dev
```

`http://localhost:3000` でアクセス可能。

### Vercel へのワンクリックデプロイ

上の "Deploy with Vercel" ボタンをクリック → Supabase の URL / anon key を入力 → デプロイ完了。

## 埋め込み方法

管理画面でプロジェクトを作成後、`/dashboard/[id]/embed` でコードを取得:

```html
<!-- あなたのサイトの </body> 直前に貼り付け -->
<div id="testimonial-wall" data-project="your-project-slug"></div>
<script src="https://your-domain.vercel.app/widget.js" async></script>
```

## 画面構成

| パス | 内容 | 認証 |
|------|------|------|
| `/` | ランディングページ | 不要 |
| `/register` `/login` | 認証 | 不要 |
| `/dashboard` | プロジェクト一覧 | 必須 |
| `/dashboard/[id]` | テスティモニアル管理（承認/却下/フィルター） | 必須 |
| `/dashboard/[id]/embed` | 埋め込みコード生成 | 必須 |
| `/dashboard/[id]/settings` | プロジェクト設定 | 必須 |
| `/collect/[slug]` | 公開収集フォーム（顧客が記入） | 不要 |
| `/wall/[slug]` | 公開 Wall of Love | 不要 |

## Environment Variables

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (公開鍵) |
| `NEXT_PUBLIC_APP_URL` | デプロイ先URL (例: https://testimonial-wall.vercel.app) |

## License

MIT

---

Built by [POST CABINETS](https://postcabinets.co.jp) — Webマーケティング支援
