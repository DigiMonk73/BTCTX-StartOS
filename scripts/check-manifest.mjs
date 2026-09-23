#!/usr/bin/env node
// Sanity checks on the bundled manifest (run after `npm run build`), for CI
// and the pre-push hook: the things that would break existing installs or
// ship the wrong image if they drifted.
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { ExtendedVersion, VersionRange } = require('@start9labs/start-sdk')
const { manifest: m } = require('../javascript/index.js')

const errors = []
const check = (ok, msg) => ok || errors.push(msg)

check(m.id === 'btctx', `package id must stay "btctx" (existing installs), got ${m.id}`)
check(m.license === 'MIT', `license should be the SPDX id "MIT", got ${m.license}`)

const [upstream, revision] = m.version.split(':')
check(/^\d+\.\d+\.\d+$/.test(upstream) && /^\d+$/.test(revision ?? ''), `version ${m.version} is not <x.y.z>:<n>`)
// In the BTCTX-MCP monorepo the package must match the app's VERSION.
const versionFile = new URL('../../VERSION', import.meta.url)
if (existsSync(versionFile)) {
  const appVersion = readFileSync(versionFile, 'utf8').trim()
  check(upstream === appVersion, `package version ${m.version} doesn't match VERSION ${appVersion}`)
}
const tag = m.images?.main?.source?.dockerTag
check(tag === `ghcr.io/digimonk73/btctx-mcp:v${upstream}`, `image ${tag} is not v${upstream}`)
check(
  JSON.stringify([...(m.images?.main?.arch ?? [])].sort()) === '["aarch64","x86_64"]',
  `arch must be x86_64 + aarch64, got ${m.images?.main?.arch}`,
)
check(m.volumes.includes('main') && m.volumes.includes('startos'), `volumes must include main and startos`)
check(!('alerts' in m), 'alerts was removed in start-sdk 2.0')

// Every earlier release must be able to update to this one, and none to go back.
const from = VersionRange.parse(m.canMigrateFrom)
for (const v of ['0.3.0:0', '0.7.0:0', '0.8.0:0', '0.8.0:1']) {
  check(ExtendedVersion.parse(v).satisfies(from), `${v} can't update to ${m.version} (canMigrateFrom ${m.canMigrateFrom})`)
}
check(m.canMigrateTo === `=${m.version}`, `downgrades must be impossible, canMigrateTo is ${m.canMigrateTo}`)

if (errors.length) {
  console.error(`manifest check failed:\n - ${errors.join('\n - ')}`)
  process.exit(1)
}
console.log(`manifest ok: ${m.id} ${m.version} (${tag})`)
