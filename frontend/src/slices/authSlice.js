import {createSlice} from "@reduxjs/toolkit"

const getInitialToken = () => {
  try {
    const rawToken = localStorage.getItem("token");
    if (!rawToken) return null;
    return rawToken.startsWith("{") || rawToken.startsWith('"')
      ? JSON.parse(rawToken)
      : rawToken;
  } catch (error) {
    return localStorage.getItem("token") || null;
  }
};

const initialState = {
  signupData: null,
  loading: false,
  token: getInitialToken(),
};

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignupData(state, value) {
      state.signupData = value.payload;
    },
        setToken(state,value) {
            state.token = value.payload;
        },
        setLoading(state, value) {
      state.loading = value.payload;
    },
    }
})

export const {setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;