// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      badgeColor: 'error',
      path: '/dashboards/analytics',
      action: 'read',
      subject: 'analytics'
    },
    {
      title: 'User List',
      icon: 'tabler:user',
      path: '/apps/user/list',
      subject: 'user',
      action: 'read'
    },
    {
      title: 'Rank Management',
      icon: 'tabler:star',
      path: '/rank-management',
      subject: 'rank',
      action: 'read'
    },
    {
      title: 'Admins & Roles',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Admins',
          path: '/apps/admins'
        },
        {
          title: 'Roles',
          path: '/apps/roles'
        }
      ]
    },
    {
      title: 'Post Management',
      icon: 'tabler:file-text',
      action: 'read',
      subject: 'post',
      path: '/apps/post-list'
    },
    {
      path: '/report-list',
      action: 'read',
      subject: 'report',
      title: 'Report List',
      icon: 'tabler:file-text'
    },
    {
      path: '/homepage',
      action: 'read',
      subject: 'member-page',
      title: 'Homepage',
      icon: 'tabler:home'
    },
    {
      path: '/posts',
      action: 'read',
      subject: 'member-page',
      title: 'Posts',
      icon: 'iconoir:post'
    },
    {
      path: '/favorite',
      action: 'read',
      subject: 'member-page',
      title: 'Favorite Posts',
      icon: 'uit:favorite'
    },
    {
      title: 'Chat',
      icon: 'tabler:messages',
      path: '/apps/chat',
      action: 'read',
      subject: 'member-page'
    },
    {
      path: '/spends',
      title: 'Spends Category',
      action: 'read',
      subject: 'member-page',
      icon: 'solar:hand-money-linear'
    },
    {
      path: '/incomes',
      title: 'Incomes Category',
      action: 'read',
      subject: 'member-page',
      icon: 'tabler:pig-money'
    },
    {
      path: '/spends-notes',
      title: 'Spend Notes',
      action: 'read',
      subject: 'member-page',
      icon: 'tabler:file-text'
    },
    {
      path: '/incomes-notes',
      title: 'Income Notes',
      action: 'read',
      subject: 'member-page',
      icon: 'tabler:file-text'
    },
    {
      title: 'Calendar',
      icon: 'tabler:calendar',
      path: '/apps/calendar',
      subject: 'member-page',
      action: 'read'
    },
    {
      title: 'Debt',
      icon: 'tabler:credit-card',
      path: '/apps/debt',
      subject: 'member-page',
      action: 'read'
    }
  ]
}

export default navigation
