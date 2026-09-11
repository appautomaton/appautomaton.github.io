import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {xmlDecode} from './sites.mjs'

// Website assertions moved from the library repository with the site itself.
const decode = text => xmlDecode(text).replaceAll('&nbsp;', '\u00a0')
const plain = html => decode(html.replace(/<[^>]*>/g, '')).trim()
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]))
function catalog() {
  const html = readFileSync(new URL('../sites/mlx-speech/public/index.html', import.meta.url), 'utf8')
  const cards = new Map()
  for (const [, tag, body] of html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)) {
    const attributes = attrs(tag), alias = attributes['data-alias']
    if (!alias) continue
    assert(!cards.has(alias), `Duplicate model alias: ${alias}`)
    cards.set(alias, {heading: plain(body.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1] || ''),
      text: plain(body), asr: attributes['data-task'] === 'asr',
      links: [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, tag, text]) => ({...attrs(tag), text: plain(text)}))})
  }
  return cards
}
function weights(card) {
  const links = card.links.filter(link => link.href.startsWith('https://huggingface.co/appautomaton/'))
  assert.equal(links.length, 1)
  return links[0].href
}

test('speech catalog retains 15 accessible model entries and their guide and weight links', () => {
  const cards = catalog()
  assert.equal(cards.size, 15)
  assert.equal([...cards.values()].filter(card => card.asr).length, 4)
  for (const [alias, card] of cards) {
    assert(card.heading, alias)
    assert(card.text.includes(alias), alias)
    assert.equal(new Set(card.links.filter(link => /^https:\/\/github.com\/appautomaton\/mlx-speech\/blob\/main\/docs\/[^/]+\.md$/.test(link.href)).map(link => link.href)).size, 1)
    assert(weights(card))
    for (const link of card.links) {
      assert(!(link.rel || '').split(/\s+/).includes('nofollow'))
      assert((link['aria-label'] || link.text).includes(card.heading))
    }
  }
})

test('speech catalog distinguishes both dots acoustic solvers', () => {
  const cards = catalog()
  assert.equal([...cards.values()].filter(card => !card.asr).length, 11)
  assert(cards.get('dots-tts-soar').text.includes('10-step flow-matching solver'))
  assert(cards.get('dots-tts-mf').text.includes('four-step distilled acoustic solver'))
  for (const [alias, heading] of [['dots-tts-soar', 'dots.tts SOAR'], ['dots-tts-mf', 'dots.tts MeanFlow']]) {
    assert.equal(cards.get(alias).heading, heading)
    assert.equal(weights(cards.get(alias)), 'https://huggingface.co/appautomaton/dots-tts-mlx')
  }
})

test('speech catalog retains the published streaming Nemotron model', () => {
  const card = catalog().get('nemotron-asr-streaming')
  assert(card.asr)
  assert(card.text.includes('Cache-aware multilingual streaming ASR'))
  assert.equal(card.heading, 'Nemotron 3.5 ASR Streaming')
  assert.equal(weights(card), 'https://huggingface.co/appautomaton/nemotron-3.5-asr-streaming-0.6b-int8-mlx')
})

test('speech catalog keeps the FireRed base checkpoint and installation requirement', () => {
  const card = catalog().get('fireredtts3-base')
  assert.equal(card.heading, 'FireRedTTS3 Base')
  assert(card.text.includes('mono 24\u00a0kHz'))
  assert(card.text.includes('Requires the current GitHub install'))
  assert.equal(weights(card), 'https://huggingface.co/appautomaton/fireredtts3-mlx/tree/main/base/mlx-bf16')
})

test('speech catalog retains the published Granite precision and weights', () => {
  const card = catalog().get('granite-speech-4.0-1b')
  assert(card.asr)
  assert(card.text.includes('Selective-int8 Granite LM'))
  assert.equal(card.heading, 'IBM Granite Speech 4.0 1B')
  assert(card.text.includes('int8 · BF16'))
  assert.equal(weights(card), 'https://huggingface.co/appautomaton/granite-4.0-1b-speech-int8-mlx')
})
