'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import type { Project } from '@/types/database'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://testimonial-wall.vercel.app'

interface Props {
  project: Project
}

export function EmbedCodeGenerator({ project }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const wallUrl = `${APP_URL}/wall/${project.slug}`
  const collectUrl = `${APP_URL}/collect/${project.slug}`

  const snippets = [
    {
      id: 'script',
      title: 'Script タグ（推奨）',
      description: '最も簡単な方法。scriptタグ1行でウィジェットを表示します',
      code: `<!-- Testimonial Wall Widget -->
<div id="testimonial-wall" data-project="${project.slug}"></div>
<script src="${APP_URL}/widget.js" async></script>`,
    },
    {
      id: 'iframe',
      title: 'iframe 埋め込み',
      description: 'スタイルを完全に分離したい場合はiframeを使います',
      code: `<iframe
  src="${wallUrl}?embed=1"
  width="100%"
  height="600"
  frameborder="0"
  style="border:none; overflow:hidden;"
  loading="lazy"
  title="Testimonial Wall"
></iframe>`,
    },
    {
      id: 'link',
      title: 'Wall of Love リンク',
      description: '専用ページへのリンクとして使います',
      code: wallUrl,
    },
    {
      id: 'collect',
      title: '収集フォームURL',
      description: '顧客に送ってレビューを集めるURL',
      code: collectUrl,
    },
  ]

  async function copyToClipboard(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    toast.success('コピーしました')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      {snippets.map((snippet) => (
        <Card key={snippet.id} className="shadow-none border-zinc-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{snippet.title}</CardTitle>
                <CardDescription className="mt-0.5">{snippet.description}</CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(snippet.code, snippet.id)}
                className="flex-shrink-0 ml-4"
              >
                {copied === snippet.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    コピー
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-zinc-950 text-zinc-100 rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {snippet.code}
            </pre>
          </CardContent>
        </Card>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-1">設置のヒント</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Script タグは <code className="bg-blue-100 px-1 rounded text-xs">&lt;/body&gt;</code> の直前に貼り付けると読み込みが速くなります</li>
          <li>ウィジェットはレスポンシブ対応済みです。スマホでも正しく表示されます</li>
          <li>承認済みのレビューのみが表示されます。管理画面で審査してください</li>
        </ul>
      </div>
    </div>
  )
}
