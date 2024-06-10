const HomePage = () => {
  return <>Home Page</>
}

HomePage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default HomePage
