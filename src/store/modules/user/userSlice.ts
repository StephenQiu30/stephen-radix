import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: UserAPI.UserVO | null
  token: string | null
}

const getStoredUser = (): UserAPI.UserVO | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const raw = localStorage.getItem('user')
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as UserAPI.UserVO
  } catch {
    try {
      localStorage.removeItem('user')
    } catch {
      // Ignore storage errors
    }
    return null
  }
}

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

const initialState: UserState = {
  user: getStoredUser(),
  token: getStoredToken(),
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<UserAPI.UserVO>) => {
      state.user = action.payload
      const tokenFromPayload = (action.payload as any).token as string | undefined
      const token = tokenFromPayload ?? getStoredToken()
      state.token = token
      if (tokenFromPayload) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('token', tokenFromPayload)
          } catch {
            // Ignore storage errors
          }
        }
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('user', JSON.stringify(action.payload))
        } catch {
          // Ignore storage errors
        }
      }
    },
    clearLoginUser: state => {
      state.user = null
      state.token = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
  },
})

export const { setLoginUser, clearLoginUser } = userSlice.actions
export default userSlice.reducer
