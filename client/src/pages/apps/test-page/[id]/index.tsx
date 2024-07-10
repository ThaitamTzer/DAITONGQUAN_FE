const TestPageId = ({
  params
}: {
  params: {
    id: string
  }
}) => {
  return <div>TestPageId</div>
}

TestPageId.acl = {
  action: 'read',
  subject: 'member-page'
}
export default TestPageId
