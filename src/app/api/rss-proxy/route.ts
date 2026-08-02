"use server"

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClaudeRSSBot/1.0)',
        'Accept': 'application/xml,application/rss+xml,text/xml,*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,ger;q=0.8',
      },
    })

    if (!response.ok) {
      console.error(`RSS-Fetch failed for ${url}: HTTP ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: `HTTP ${response.status}` }, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('xml') && !contentType.includes('rss')) {
      // Maybe HTML page, try to extract RSS from known patterns
      const html = await response.text()
      const rssMatch = html.match(/<rss[^>]*>(.*?)<\/rss>|<channel[^>]*>(.*?)<\/channel>/is)
      if (!rssMatch) {
        return NextResponse.json({ error: 'Not RSS/XML content' }, { status: 400 })
      }
      const xmlContent = rssMatch[1] || rssMatch[2] || ''
      return new NextResponse(xmlContent, {
        headers: {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const xml = await response.text()
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('RSS-Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch RSS feed' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}