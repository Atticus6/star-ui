---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "四达组件库"
  text: "好用且简单"
  tagline: My great project tagline
  image:
    src: /it.svg
    alt: hero
  actions:
    - theme: brand
      text: 开始
      link: /markdown-examples
    - theme: alt
      text: API Examples
      link: /api-examples

features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'
import contributors  from '../contributors.json'
// const members = [
//   {
//     avatar: 'https://www.github.com/yyx990803.png',
//     name: 'Evan You',
//     title: 'Creator',
//     links: [
//       { icon: 'github', link: 'https://github.com/yyx990803' },
//       { icon: 'twitter', link: 'https://twitter.com/youyuxi' }
//     ]
//   },
// ]

const members =contributors.map(persion =>{
  return {
    ...persion,
    title: 'Creator',
  }
})
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      我们团队
    </template>
    <template #lead>
      The development of VitePress is guided by an international
      team, some of whom have chosen to be featured below.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
