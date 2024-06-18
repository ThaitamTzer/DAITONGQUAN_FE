import React from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Import Custom Components
import CategorySpendCard from './categorySpendCard'
import AddCategory from './utils/addCategory'
import ListOfSpendNote from './listOfSpendNote'
import { Divider } from '@mui/material'

// Define your context with a default value
export const CategorySpendContext = React.createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(
  undefined
)

interface State {
  categories: { id: number; name: string; limit: number }[]
  spends: { id: number; notes: { id: number; note: string }[] }[]
}

interface Action {
  type: string
  payload: any
}

const categorySpendReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'GET_SPENDS':
      return { ...state, spends: action.payload }
    case 'GET_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'ADD_SPEND':
      return { ...state, spends: [...state.spends, action.payload] }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(category => category.id !== action.payload) }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => {
          if (category.id === action.payload.id) {
            return { ...category, name: action.payload.name }
          }

          return category
        })
      }
    case 'UPDATE_LIMIT':
      return {
        ...state,
        categories: state.categories.map(category => {
          if (category.id === action.payload.id) {
            return { ...category, limit: action.payload.limit }
          }

          return category
        })
      }
    case 'DELETE_SPEND':
      return { ...state, spends: state.spends.filter(spend => spend.id !== action.payload) }
    case 'UPDATE_SPEND':
      return {
        ...state,
        spends: state.spends.map(spend => {
          if (spend.id === action.payload.id) {
            return { ...spend, ...action.payload }
          }

          return spend
        })
      }
    case 'ADD_NOTE':
      return {
        ...state,
        spends: state.spends.map(spend => {
          if (spend.id === action.payload.id) {
            return { ...spend, notes: [...spend.notes, action.payload.note] }
          }

          return spend
        })
      }
    case 'DELETE_NOTE':
      return {
        ...state,
        spends: state.spends.map(spend => {
          if (spend.id === action.payload.id) {
            return { ...spend, notes: spend.notes.filter(note => note.id !== action.payload.noteId) }
          }

          return spend
        })
      }
    case 'UPDATE_NOTE':
      return {
        ...state,
        spends: state.spends.map(spend => {
          if (spend.id === action.payload.id) {
            return {
              ...spend,
              notes: spend.notes.map(note => {
                if (note.id === action.payload.noteId) {
                  return { ...note, note: action.payload.note }
                }

                return note
              })
            }
          }

          return spend
        })
      }
    case 'DELETE_MANY_NOTES':
      return {
        ...state,
        spends: state.spends.map(spend => {
          if (spend.id === action.payload.id) {
            return { ...spend, notes: [] }
          }

          return spend
        })
      }
    default:
      return state
  }
}

const Spends = () => {
  const [state, dispatch] = React.useReducer(categorySpendReducer, { categories: [], spends: [] })

  return (
    <CategorySpendContext.Provider value={{ state, dispatch }}>
      <Grid container spacing={2}>
        <CategorySpendCard />
        <AddCategory />
        <Divider orientation='vertical' />
        <Grid item xs={12}>
          <ListOfSpendNote />
        </Grid>
      </Grid>
    </CategorySpendContext.Provider>
  )
}

export default Spends
