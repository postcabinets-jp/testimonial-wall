import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Check, ArrowRight, Code, MessageSquare, Shield, Zap, Globe } from 'lucide-react'

const VERCEL_DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpostcabinets-jp%2Ftestimonial-wall&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20project%20credentials&project-name=testimonial-wall&repository-name=testimonial-wall'

const features = [
  {
    icon: MessageSquare,
    title: '収集フォーム',
    desc: 'URLを送るだけ。顧客が星評価・テキスト・役職を入力して送信。審査後に公開。',
  },
  {
    icon: Shield,
    title: '承認フロー',
    desc: '全レビューを管理画面で確認。承認・却下・注目設定をワンクリックで操作。',
  },
  {
    icon: Globe,
    title: 'Wall of Love',
    desc: 'Masonry Grid / カルーセル / リストの3レイアウト。承認済みレビューを美しく展示。',
  },
  {
    icon: Code,
    title: '埋め込みウィジェット',
    desc: 'scriptタグ1行でどのサイトにも設置可能。Shadow DOMでCSSが干渉しない設計。',
  },
  {
    icon: Zap,
    title: '制限なし',
    desc: '月次収集数の上限なし。プロジェクト数も無制限。すべて自分のインフラで動く。',
  },
  {
    icon: Check,
    title: 'オープンソース',
    desc: 'MITライセンス。コードを読んで、フォークして、好きに改造できる。ベンダーロックインなし。',
  },
]

const testimonials = [
  {
    name: 'Tanaka Keiko',
    title: 'Head of Marketing',
    company: 'Shopify Japan',
    content: '埋め込みウィジェットが強力で、LP のコンバージョンが23%上がりました。導入前は4つのスプレッドシートを使っていたのが、今は全部ここで完結しています。',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    title: 'Product Manager',
    company: 'Notion',
    content: 'We switched from Testimonial.to after hitting the monthly limit. This OSS version handles unlimited submissions and we self-host on our own infra. Exactly what we needed.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    title: 'Startup Founder',
    company: 'Indie Hacker',
    content: 'Built on this as the testimonial layer for my SaaS. Took 30 minutes to set up end-to-end. The collect page URL feature is brilliant — just email it to customers after onboarding.',
    rating: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i <= count ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'}`} />
      ))}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="font-semibold text-zinc-900">Testimonial Wall</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/postcabinets-jp/testimonial-wall" target="_blank" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
              GitHub
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800">無料で始める</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 mb-6 font-normal">
            Senja / Testimonial.to のオープンソース代替
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-5 leading-tight tracking-tight">
            顧客の声を集めて、<br />
            <span className="text-zinc-500">そのまま</span>サイトに表示する
          </h1>
          <p className="text-lg text-zinc-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            URLを送るだけで顧客がレビューを投稿。承認したらscriptタグ1行でサイトに埋め込み。
            制限なし、月額ゼロ、コードは全部あなたのもの。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-zinc-900 hover:bg-zinc-800 h-11 px-6">
                無料でセットアップ
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={VERCEL_DEPLOY_URL} target="_blank">
              <Button size="lg" variant="outline" className="h-11 px-6">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 116 100" fill="currentColor">
                  <path d="M57.5 0L115 100H0L57.5 0z" />
                </svg>
                Deploy with Vercel
              </Button>
            </Link>
          </div>
          <p className="text-sm text-zinc-400 mt-4">
            Supabase + Next.js 15。MITライセンス。
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-10">3ステップで完了</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'URLを送る', desc: '収集フォームのURLを顧客にメールやSNSで共有。顧客は認証不要で投稿できます。' },
              { step: '02', title: '審査する', desc: '管理画面で投稿を確認して承認/却下。スパムを弾いて質を維持できます。' },
              { step: '03', title: '表示する', desc: 'scriptタグ1行をサイトに貼るだけ。Wall of Loveが自動で表示されます。' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 border border-zinc-200">
                <div className="text-xs font-mono text-zinc-400 mb-3">{item.step}</div>
                <h3 className="font-semibold text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-3">必要なものがすべて揃っている</h2>
          <p className="text-zinc-500 text-center mb-10 text-sm">Senjaで月額$29払っていた機能が、全部無料で自前で動く</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors">
                <f.icon className="w-5 h-5 text-zinc-700 mb-3" />
                <h3 className="font-medium text-zinc-900 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-6 bg-zinc-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-10">Senja と比較</h2>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left p-4 font-medium text-zinc-700">機能</th>
                  <th className="text-center p-4 font-medium text-zinc-700">Senja ($19/月)</th>
                  <th className="text-center p-4 font-medium text-zinc-900">Testimonial Wall</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['月額費用', '$19-29', '無料'],
                  ['収集数制限', '月50件', '無制限'],
                  ['プロジェクト数', '1-3', '無制限'],
                  ['埋め込みウィジェット', '✓', '✓'],
                  ['承認フロー', '✓', '✓'],
                  ['ソースコード公開', '✗', '✓'],
                  ['セルフホスト', '✗', '✓'],
                  ['ベンダーロックイン', 'あり', 'なし'],
                ].map(([feature, senja, ours], i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-zinc-50' : ''}>
                    <td className="p-4 text-zinc-700">{feature}</td>
                    <td className="p-4 text-center text-zinc-500">{senja}</td>
                    <td className="p-4 text-center font-medium text-zinc-900">{ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-10">使っている人の声</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-zinc-200 rounded-xl p-5">
                <StarRating count={t.rating} />
                <p className="text-sm text-zinc-700 mt-3 mb-4 leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.title} @ {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embed code preview */}
      <section className="py-16 px-6 bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">設置はこれだけ</h2>
          <p className="text-zinc-400 mb-8 text-sm">2行のコードをコピーして&lt;/body&gt;の前に貼るだけ</p>
          <div className="bg-zinc-800 rounded-xl p-6 text-left border border-zinc-700">
            <pre className="text-sm font-mono text-zinc-300 overflow-x-auto">
{`<div id="testimonial-wall" data-project="my-product"></div>
<script src="https://testimonial-wall.vercel.app/widget.js" async></script>`}
            </pre>
          </div>
          <p className="text-zinc-500 text-xs mt-4">Shadow DOM で実装済み。ホストサイトの CSS と干渉しません。</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">今すぐ顧客の声を集め始める</h2>
          <p className="text-zinc-500 mb-8">クレジットカード不要。Supabaseの無料プランで十分動きます。</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-zinc-900 hover:bg-zinc-800 h-11 px-6">
                無料アカウントを作成
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={VERCEL_DEPLOY_URL} target="_blank">
              <Button size="lg" variant="outline" className="h-11 px-6">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 116 100" fill="currentColor">
                  <path d="M57.5 0L115 100H0L57.5 0z" />
                </svg>
                Vercel にデプロイ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
            <span className="text-sm text-zinc-600">Testimonial Wall</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <Link href="https://github.com/postcabinets-jp/testimonial-wall" target="_blank" className="hover:text-zinc-700">
              GitHub
            </Link>
            <Link href="/register" className="hover:text-zinc-700">始める</Link>
            <span>MIT License</span>
          </div>
          <p className="text-xs text-zinc-400">
            Built by{' '}
            <a href="https://postcabinets.co.jp" target="_blank" className="hover:text-zinc-700 underline">
              POST CABINETS
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
