#!/usr/bin/env node
/**
 * pinia-orm v2 codemod: migrates model files from the legacy
 * `experimentalDecorators` syntax to standard ECMAScript decorators.
 *
 *   - `@Attr('') declare name: string`  ->  `@Attr('') name!: string`
 *   - multi-line decorators followed by `declare field: Type` lose the
 *     `declare` keyword and gain a `!` (or keep `?`)
 *   - `declare` fields WITHOUT decorators are kept untouched (required
 *     for `fields()` based models)
 *
 * Usage:
 *   node migrate-standard-decorators.mjs [--dry] <dir-or-file> [...more]
 *
 * Defaults to ./src when no path is given.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const targets = args.filter(a => a !== '--dry')
if (targets.length === 0) { targets.push('./src') }

const EXTENSIONS = new Set(['.ts', '.tsx', '.vue', '.js', '.mjs'])

function collect (path, files = []) {
  const stats = statSync(path)
  if (stats.isDirectory()) {
    if (path.includes('node_modules')) { return files }
    for (const entry of readdirSync(path)) { collect(join(path, entry), files) }
  } else if (EXTENSIONS.has(extname(path))) {
    files.push(path)
  }
  return files
}

const PURE_DECORATOR = /^\s*@\w+.*\)\s*$/
const DECLARE_FIELD = /^(\s*)declare (\w+)(\??): (.*)$/
const INLINE = /^(\s*@\S.*?) declare (\w+)(\??): /

function migrate (text) {
  const lines = text.split('\n')
  let prev = ''
  let changed = false
  const out = lines.map((line) => {
    const match = line.match(DECLARE_FIELD)
    if (match && PURE_DECORATOR.test(prev) && !prev.includes(' declare ') && !/[!?]:/.test(prev)) {
      const [, indent, name, opt, rest] = match
      line = `${indent}${name}${opt ? '?' : '!'}: ${rest}`
      changed = true
    }
    const inline = line.replace(INLINE, (_, dec, name, opt) => `${dec} ${name}${opt ? '?' : '!'}: `)
    if (inline !== line) {
      line = inline
      changed = true
    }
    if (line.trim()) { prev = line }
    return line
  })
  return { text: out.join('\n'), changed }
}

let migrated = 0
for (const target of targets) {
  for (const file of collect(target)) {
    const original = readFileSync(file, 'utf8')
    const { text, changed } = migrate(original)
    if (changed) {
      migrated++
      console.log(`${dry ? '[dry] would migrate' : 'migrated'}: ${file}`)
      if (!dry) { writeFileSync(file, text) }
    }
  }
}

console.log(`${migrated} file(s) ${dry ? 'would be ' : ''}migrated.`)
console.log('Reminder: remove "experimentalDecorators" from your tsconfig and use TypeScript >= 5.2.')
