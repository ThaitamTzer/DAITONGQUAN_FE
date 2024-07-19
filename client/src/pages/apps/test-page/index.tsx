import { useRouter } from 'next/router'

const TestPage = () => {
  const router = useRouter()

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={() => router.push('/apps/test-page/1')}>Go to Test Page 1</button>
    </div>
  )
}
TestPage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default TestPage
