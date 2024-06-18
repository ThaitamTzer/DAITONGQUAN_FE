const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}

HomePage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default HomePage
