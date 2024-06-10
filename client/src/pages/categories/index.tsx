const Categories = () => {
  return (
    <div>
      <h1>Categories</h1>
    </div>
  )
}

Categories.acl = {
  action: 'read',
  subject: 'member-page'
}
export default Categories
