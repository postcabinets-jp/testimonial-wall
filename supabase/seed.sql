-- Seed data for development / demo
-- Note: These users must be created via Supabase Auth first, then this seed adds their data

-- Demo user profiles (assuming auth users already exist with these IDs)
-- In real usage, the trigger handle_new_user() creates profiles automatically

-- Sample project for demo user
-- Note: user_id must match a real auth.users entry; update these UUIDs before running
-- INSERT INTO projects (id, user_id, name, slug, description, settings) VALUES
-- (...);

-- Demo testimonials (insert after creating a project)
-- These will be referenced after the user creates their first project via the UI

-- For development, you can run this after creating a test user:
-- 1. Register via /register
-- 2. Create a project via /dashboard
-- 3. Run the seed below with the real project_id

-- Example testimonial data (run manually after setup):
/*
INSERT INTO testimonials (project_id, author_name, author_title, author_company, content, rating, status, is_featured) VALUES
  ('<your-project-id>', 'Tanaka Keiko', 'Head of Marketing', 'Shopify Japan', 'このツールのおかげで、顧客の声を一元管理できるようになりました。導入前は4つのスプレッドシートを使っていたのが、今は全部ここで完結しています。特に埋め込みウィジェットが強力で、LP のコンバージョンが23%上がりました。', 5, 'approved', true),
  ('<your-project-id>', 'Yamamoto Hiroshi', 'CTO', 'Freee株式会社', '開発チームとして、Supabase + Next.js のコードベースは非常に読みやすく、カスタマイズが簡単でした。エンタープライズ版を構築する基盤として採用しています。', 5, 'approved', false),
  ('<your-project-id>', 'Sarah Chen', 'Product Manager', 'Notion', 'We switched from Testimonial.to after hitting the monthly collection limit. This OSS version handles unlimited submissions and we self-host on our own infra. Exactly what we needed.', 5, 'approved', true),
  ('<your-project-id>', 'Nakamura Ryota', 'Founder', 'note株式会社', 'フリーランスのデザイナーですが、クライアントへの実績アピールが格段に楽になりました。収集フォームのURLを送るだけで、あとは自動で整理されます。', 4, 'approved', false),
  ('<your-project-id>', 'Emily Rodriguez', 'VP of Sales', 'HubSpot', 'The embed widget integration took us less than 5 minutes. We now show live testimonials on all our landing pages without any custom development. ROI was immediate.', 5, 'approved', false),
  ('<your-project-id>', 'Watanabe Ai', 'マーケティングマネージャー', 'メルカリ', 'Wall of Loveのグリッドレイアウトがとにかくきれいで、そのままLPに貼り付けています。デザイン調整もCSSで簡単にできるのが助かっています。', 5, 'approved', true),
  ('<your-project-id>', 'Michael Park', 'Engineering Lead', 'Linear', 'RLS implementation is solid. We audited the codebase and confirmed no data leakage between tenants. Critical for a multi-tenant SaaS running on shared infra.', 5, 'approved', false),
  ('<your-project-id>', 'Ito Daisuke', 'EC事業部長', '楽天株式会社', 'Google ReviewsとXからのインポート機能を心待ちにしています。それが来たらSenjaを完全に置き換えられます。今でも基本機能は十分満足しています。', 4, 'approved', false),
  ('<your-project-id>', 'Priya Sharma', 'Startup Founder', 'Indie Hacker', 'Built on this as the testimonial layer for my SaaS. Took 30 minutes to set up end-to-end. The collect page URL feature is brilliant — just email it to customers after onboarding.', 5, 'approved', true),
  ('<your-project-id>', 'Suzuki Haruto', 'UXデザイナー', 'Goodpatch', 'UIが直感的で、非エンジニアのクライアントでも操作できます。承認フローが特に助かっています。全レビューを手動でチェックしてからサイトに反映できるのがベストです。', 4, 'approved', false);
*/

SELECT 'Seed file loaded. Please create a user and project first, then manually insert testimonials.' AS message;
