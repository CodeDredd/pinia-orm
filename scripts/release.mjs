import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import semver from 'semver'
import enquirer from 'enquirer'
import { execa } from 'execa'
import pkg from '../packages/pinia-orm/package.json'

const currentVersion = pkg.version

const versionIncrements = [
  'patch',
  'minor',
  'major'
]

const tags = [
  'latest',
  'next'
]

const inc = (i) => semver.inc(currentVersion, i, 'draft')
const bin = (name) => `node_modules/.bin/${name}`
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })
const step = (msg) => console.log(chalk.cyan(msg))

async function main() {
  let targetVersion

  const { release } = await enquirer.prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
  })

  if (release === 'custom') {
    targetVersion = (await enquirer.prompt({
      type: 'input',
      name: 'version',
      message: 'Input custom version',
      initial: currentVersion
    })).version
  } else {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`Invalid target version: ${targetVersion}`)
  }

  const { tag } = await enquirer.prompt({
    type: 'select',
    name: 'tag',
    message: 'Select tag type',
    choices: tags
  })

  const { yes: tagOk } = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!tagOk) {
    return
  }

  // Run tests before release.
  step('\nRunning tests...')
  await run(bin('jest'), ['--clearCache'])
  await run('yarn', ['lint:fail'])
  await run('yarn', ['coverage'])

  // Update the package version.
  step('\nUpdating the package version...')
  updatePackage(targetVersion)

  // Build the package.
  step('\nBuilding the package...')
  await run('yarn', ['build'])

  // Generate the changelog.
  step('\nGenerating the changelog...')
  await run('yarn', ['changelog'])

  const { yes: changelogOk } = await enquirer.prompt({
    type: 'confirm',
    name: 'yes',
    message: `Changelog generated. Does it look good?`
  })

  if (!changelogOk) {
    return
  }

  // Commit changes to the Git.
  step('\nCommitting changes...')
  await run('git', ['add', '-A'])
  await run('git', ['commit', '-m', `release: v${targetVersion}`])

  // Publish the package.
  step('\nPublishing the package...')
  await run ('yarn', [
    'publish', '--tag', 'next', '--new-version', targetVersion,
    '--no-commit-hooks', '--no-git-tag-version'
  ])

  // Push to GitHub.
  step('\nPushing to GitHub...')
  await run('git', ['tag', `v${targetVersion}`])
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  await run('git', ['push'])
}

function updatePackage(version) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

  pkg.version = version

  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
}

main().catch((err) => console.error(err))
