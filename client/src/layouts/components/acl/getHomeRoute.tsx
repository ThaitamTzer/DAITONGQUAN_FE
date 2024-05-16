/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'member') return '/acl'
  else return '/dashboards/analytics'
}

export default getHomeRoute
