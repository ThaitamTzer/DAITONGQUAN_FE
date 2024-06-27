import { Button, Card, Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'

import ListOfLeding from 'src/views/apps/debt/ListOfLend'

// Actions
import { fetchDebts, addDebt, updateDebt, deleteDebt, encryptDebt, decryptDebt } from 'src/store/apps/debt'

const AppDebt = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.debt)

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex)
  }

  useEffect(() => {
    dispatch(fetchDebts())
  }, [dispatch])

  return (
    <>
      <Tabs value={tabIndex} onChange={handleTabChange} textColor='primary' indicatorColor='primary'>
        <Tab label='List of Lend' />
        <Tab label='List of Borrow' />
      </Tabs>
      <Box hidden={tabIndex !== 0}>
        <ListOfLeding dispatch={dispatch} store={store} addDebt={addDebt} />
      </Box>
    </>
  )
}

AppDebt.acl = {
  action: 'read',
  subject: 'member-page'
}
export default AppDebt
