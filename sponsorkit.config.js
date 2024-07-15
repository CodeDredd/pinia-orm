import { defineConfig, tierPresets } from 'sponsorkit'

export default defineConfig({
  // Providers configs
  github: {
    login: 'codedredd',
    type: 'user',
  },
  // Rendering configs
  width: 800,
  includePastSponsors: true,
  outputDir: './docs/public/sponsorkit',
  includePrivate: true,
  onSponsorsFetched: (sponsors) => {
    sponsors = sponsors.map(sponsor => {
      if (sponsor.isOneTime) {
        sponsor.monthlyDollars = 0
      }

      return sponsor
    })
    console.log(sponsors)

    sponsors.push({
        sponsor: {
          __typename: undefined,
          login: 'swash',
          name: 'getriebesand',
          avatarUrl: 'https://avatars.githubusercontent.com/u/5921286?v=4',
          type: 'User'
        },
        isOneTime: true,
        monthlyDollars: 0,
        privacyLevel: 'PUBLIC',
        tierName: undefined,
        createdAt: 'Fri, 03 Mar 1999 23:00:00 GMT',
        provider: 'github'
    },
      {
        sponsor: {
          __typename: undefined,
          login: 'jhercog',
          name: 'jhercog',
          avatarUrl: 'https://avatars.githubusercontent.com/u/181355?v=4',
          type: 'User'
        },
        isOneTime: true,
        monthlyDollars: 0,
        privacyLevel: 'PUBLIC',
        tierName: undefined,
        createdAt: 'Fri, 03 Mar 2023 23:00:00 GMT',
        provider: 'github'
      },
      {
        sponsor: {
          __typename: undefined,
          login: 'svenhue',
          name: 'Sven Hue',
          avatarUrl: 'https://avatars.githubusercontent.com/u/83905274?v=4',
          type: 'User'
        },
        isOneTime: true,
        monthlyDollars: 0,
        privacyLevel: 'PUBLIC',
        tierName: undefined,
        createdAt: 'Fri, 03 Mar 1999 23:00:00 GMT',
        provider: 'github'
      })

    return sponsors
  },
  force: true,
  formats: ['json', 'svg', 'png'],
  tiers: [
    // Past sponsors, currently only supports GitHub
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: tierPresets.xs,
      // to insert custom elements after the tier block
      composeAfter: (composer, _tierSponsors, _config) => {
        composer.addSpan(10)
      },
    },
    // Default tier
    {
      title: 'Backers',
      monthlyDollars: 0,
      preset: tierPresets.base,
    },
    {
      title: 'Bronze Sponsors',
      monthlyDollars: 5,
      preset: tierPresets.base,
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 16,
      preset: tierPresets.medium,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 100,
      preset: tierPresets.xl,
    },
  ],
})
