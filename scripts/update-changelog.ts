import { execSync } from 'node:child_process'
import { $fetch } from 'ofetch'
import { inc } from 'semver'
import { generateMarkDown, getCurrentGitBranch, loadChangelogConfig } from 'changelogen'
import { consola } from 'consola'
import { determineBumpType, getContributors, getLatestCommits, getLatestReleasedTag, getLatestTag, getPreviousReleasedCommits, loadWorkspace } from './_utils'

const handleSeparateBranch = true

async function main () {
  const releaseBranch = await getCurrentGitBranch()
  const workspace = await loadWorkspace(process.cwd())
  const config = await loadChangelogConfig(process.cwd(), {})

  const prevMessages = new Set(handleSeparateBranch ? await getPreviousReleasedCommits().then(r => r.map(c => c.message)) : [])

  const commits = await getLatestCommits().then(commits => commits.filter(
    c => config.types[c.type] && !(c.type === 'chore' && c.scope === 'deps') && !prevMessages.has(c.message),
  ))
  const bumpType = await determineBumpType() || 'patch'

  const newVersion = inc(workspace.find('pinia-orm').data.version, bumpType)
  const changelog = await generateMarkDown(commits, config)

  // Create and push a branch with bumped versions if it has not already been created
  const branchExists = execSync(`git ls-remote --heads origin v${newVersion}`).toString().trim().length > 0
  if (!branchExists) {
    execSync('git config --global user.email "gregor@codedredd.de"')
    execSync('git config --global user.name "Gregor Becker"')
    execSync(`git checkout -b v${newVersion}`)

    for (const pkg of workspace.packages.filter(p => !p.data.private)) {
      workspace.setVersion(pkg.data.name, newVersion!)
    }
    await workspace.save()

    execSync(`git commit -am v${newVersion}`)
    execSync(`git push -u origin v${newVersion}`)
  }

  // Get the current PR for this release, if it exists. The `head` filter
  // needs the `owner:` prefix — without it GitHub ignores the filter and
  // returns the newest open PR, whose body would then be overwritten.
  const [currentPR] = await $fetch(`https://api.github.com/repos/CodeDredd/pinia-orm/pulls?head=CodeDredd:v${newVersion}&state=open`)

  if (currentPR && currentPR.head?.ref !== `v${newVersion}`) {
    consola.error(`Found PR #${currentPR.number} but its head is not v${newVersion}. Aborting to avoid overwriting an unrelated PR.`)
    process.exit(1)
  }
  const contributors = await getContributors()

  const latestTag = await getLatestTag()
  const previousReleasedTag = handleSeparateBranch ? await getLatestReleasedTag() : latestTag

  console.log('CurrentPR', currentPR)
  console.info('New Version ', newVersion)

  const releaseNotes = [
    currentPR?.body.replace(/## 👉 Changelog[\s\S]*$/, '') || `> ${newVersion} is the next ${bumpType} release.\n>\n> **Timetable**: to be announced.`,
    '## 👉 Changelog',
    changelog
      .replace(/^## v.*\n/, '')
      .replace(`...${releaseBranch}`, `...v${newVersion}`)
      .replace(/### ❤️ Contributors[\s\S]*$/, '')
      .replace(/[\n\r]+/g, '\n')
      .replace(latestTag, previousReleasedTag),
    '### ❤️ Contributors',
    contributors.map(c => `- ${c.name} (@${c.username})`).join('\n'),
  ].join('\n')

  // Create a PR with release notes if none exists
  if (!currentPR) {
    return await $fetch('https://api.github.com/repos/CodeDredd/pinia-orm/pulls', {
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      body: {
        title: `v${newVersion}`,
        head: `v${newVersion}`,
        base: releaseBranch,
        body: releaseNotes,
        draft: true,
      },
    })
  }

  // Update release notes if the pull request does exist
  const githubResponse = await $fetch(`https://api.github.com/repos/CodeDredd/pinia-orm/pulls/${currentPR.number}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
    body: {
      body: releaseNotes,
    },
  })

  console.info('GitHub Response pushing ', currentPR.number, ' : ', githubResponse)
}

main().catch((err) => {
  consola.error(err)
  process.exit(1)
})
