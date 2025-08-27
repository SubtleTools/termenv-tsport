import { typedocSidebar } from "typedoc-vitepress-theme";

const typedocSidebarData = typedocSidebar.load();
const rawTypedocSidebar = typedocSidebarData?.sidebar || [];

// Process TypeDoc sidebar to remove .md extensions and fix paths
const typedocSidebar = rawTypedocSidebar.map(section => ({
  ...section,
  items: section.items.map(item => ({
    ...item,
    link: item.link.replace('.md', '')
  }))
}));

export default {
  title: '@tsports/termenv',
  description: 'TypeScript port of termenv with 100% API compatibility',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Examples', link: '/guide/examples' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            ...typedocSidebar
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/TSports/termenv' }
    ],

    footer: {
      message: 'TypeScript port of termenv',
      copyright: 'Made with ❤️ by <a href="https://saulo.engineer">Saulo Vallory</a>'
    }
  }
}