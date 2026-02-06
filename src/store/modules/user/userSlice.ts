import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: UserAPI.UserVO | null
  token: string | null
}

const initialState: UserState = {
  user: null,
  token: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<UserAPI.UserVO>) => {
      state.user = action.payload
      const token = (action.payload as any).token || null
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      }
    },
    clearLoginUser: state => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
})

export const { setLoginUser, clearLoginUser } = userSlice.actions
export default userSlice.reducer
