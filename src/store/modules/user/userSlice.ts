import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: API.LoginUserVO | null
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
    setLoginUser: (state, action: PayloadAction<API.LoginUserVO>) => {
      state.user = action.payload
      state.token = action.payload.token || null
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token)
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
