// ** Next Import
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next/types'

// ** Demo Components Imports
import UserProfile from 'src/views/pages/categories/Category'

const UserProfileTab = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserProfile /> // No data prop needed
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { tab: 'spends' } }, { params: { tab: 'incomes' } }],
    fallback: false
  }
}

// ** Simplified getStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

UserProfileTab.acl = {
  action: 'read',
  subject: 'member-page'
}

export default UserProfileTab
