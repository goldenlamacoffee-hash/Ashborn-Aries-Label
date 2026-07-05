/**
 * Regression test: edit -> ISR converge -> verify -> revert -> verify.
 * Simulates the WORST case: direct DB writes with no revalidatePath,
 * relying purely on the 60s ISR window on a production server (port 4000).
 * Usage: node --env-file=/vercel/share/.env.project scripts/regression-sync-test.mjs
 */
import pg from 'pg'

const BASE = 'http://localhost:4000'
const MARK = 'REGSYNC'
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

const tests = [
  {
    name: 'release',
    page: `${BASE}/releases`,
    apply: () =>
      pool.query(
        `UPDATE releases SET title = title || ' ${MARK}' WHERE slug='black-ink-salvation'`,
      ),
    revert: () =>
      pool.query(
        `UPDATE releases SET title = replace(title, ' ${MARK}', '') WHERE slug='black-ink-salvation'`,
      ),
  },
  {
    name: 'track/lyric',
    page: `${BASE}/lyrics/black-ink-salvation`,
    apply: () =>
      pool.query(
        `UPDATE tracks SET title = title || ' ${MARK}' WHERE id = (SELECT id FROM tracks ORDER BY id LIMIT 1)`,
      ),
    revert: () =>
      pool.query(`UPDATE tracks SET title = replace(title, ' ${MARK}', '')`),
  },
  {
    name: 'artist',
    page: `${BASE}/artists/ashborn-aries`,
    apply: () =>
      pool.query(
        `UPDATE artists SET tagline = tagline || ' ${MARK}' WHERE slug='ashborn-aries'`,
      ),
    revert: () =>
      pool.query(
        `UPDATE artists SET tagline = replace(tagline, ' ${MARK}', '') WHERE slug='ashborn-aries'`,
      ),
  },
  {
    name: 'setting',
    page: `${BASE}/label`,
    apply: async () => {
      const { rows } = await pool.query(`SELECT value FROM site_settings WHERE key='site'`)
      const v = rows[0].value
      v.labelSectionBackground = `/images/visual/bronze-ember.png?v=${MARK}`
      await pool.query(`UPDATE site_settings SET value=$1 WHERE key='site'`, [JSON.stringify(v)])
    },
    revert: async () => {
      const { rows } = await pool.query(`SELECT value FROM site_settings WHERE key='site'`)
      const v = rows[0].value
      delete v.labelSectionBackground
      await pool.query(`UPDATE site_settings SET value=$1 WHERE key='site'`, [JSON.stringify(v)])
    },
  },
  {
    name: 'gallery',
    page: `${BASE}/visual-world`,
    apply: () =>
      pool.query(
        `UPDATE gallery_collections SET title = title || ' ${MARK}' WHERE id = (SELECT id FROM gallery_collections WHERE is_published = true ORDER BY sort_order LIMIT 1)`,
      ),
    revert: () =>
      pool.query(`UPDATE gallery_collections SET title = replace(title, ' ${MARK}', '')`),
  },
]

async function countMark(url) {
  const res = await fetch(url)
  const html = await res.text()
  return (html.match(new RegExp(MARK, 'g')) || []).length
}

async function checkAll(expect) {
  let pass = true
  for (const t of tests) {
    const count = await countMark(t.page)
    const ok = expect === 'present' ? count > 0 : count === 0
    console.log(`[v0]   ${t.name.padEnd(12)} ${t.page.replace(BASE, '')} -> ${count} mark(s) ${ok ? 'PASS' : 'FAIL'}`)
    if (!ok) pass = false
  }
  return pass
}

// Prime caches so we test staleness -> convergence, not first render
console.log('[v0] priming caches...')
for (const t of tests) await fetch(t.page)

console.log('[v0] applying edits (no revalidatePath — worst case)...')
for (const t of tests) await t.apply()

console.log('[v0] immediately after edit (pages may be cached, that is OK):')
await checkAll('present')

console.log('[v0] waiting 65s for ISR window...')
await new Promise((r) => setTimeout(r, 65000))
for (const t of tests) await fetch(t.page) // trigger background revalidation
await new Promise((r) => setTimeout(r, 3000))

console.log('[v0] after ISR window (all must show the edit):')
const converged = await checkAll('present')

console.log('[v0] reverting edits...')
for (const t of tests) await t.revert()

console.log('[v0] waiting 65s for ISR window...')
await new Promise((r) => setTimeout(r, 65000))
for (const t of tests) await fetch(t.page)
await new Promise((r) => setTimeout(r, 3000))

console.log('[v0] after revert (all must be clean):')
const reverted = await checkAll('absent')

await pool.end()
console.log(`[v0] RESULT: converge=${converged ? 'PASS' : 'FAIL'} revert=${reverted ? 'PASS' : 'FAIL'}`)
process.exit(converged && reverted ? 0 : 1)
