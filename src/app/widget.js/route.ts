import { NextResponse } from 'next/server'

// Widget script served at /widget.js
// Embeds the Testimonial Wall as a Shadow DOM component
export async function GET() {
  const script = `
(function() {
  'use strict';

  var el = document.getElementById('testimonial-wall');
  if (!el) return;

  var slug = el.getAttribute('data-project');
  if (!slug) return;

  var appUrl = '${process.env.NEXT_PUBLIC_APP_URL || 'https://testimonial-wall.vercel.app'}';

  // Create shadow DOM container
  var shadow = el.attachShadow({ mode: 'open' });

  // Create iframe
  var iframe = document.createElement('iframe');
  iframe.src = appUrl + '/wall/' + encodeURIComponent(slug) + '?embed=1';
  iframe.style.cssText = [
    'width: 100%',
    'border: none',
    'overflow: hidden',
    'min-height: 400px',
    'display: block',
  ].join('; ');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('title', 'Testimonial Wall');

  // Auto-resize iframe
  window.addEventListener('message', function(e) {
    if (e.origin !== appUrl) return;
    if (e.data && e.data.type === 'tw-resize') {
      iframe.style.height = e.data.height + 'px';
    }
  });

  shadow.appendChild(iframe);
})();
`

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
