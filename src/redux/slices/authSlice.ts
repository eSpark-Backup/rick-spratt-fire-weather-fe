import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean | false;
  token: string | null;
  user: any | null;
  country?: string;
  state?: string;
  zoneId?: string;
}
interface ZoneUpdate {
  zoneId: string;
  zoneName: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      const { token, ...user } = action.payload;
      state.user = user; // user details (id, name, email, zoneId, etc.)
      state.token = token;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    updateUserZone(state, action: PayloadAction<ZoneUpdate>) {
      if (state.user) {
        state.user.zoneId = action.payload.zoneId;
        state.user.zoneName = action.payload.zoneName;
      }
    },
    logout: state => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { setUser, logout, setIsLoggedIn, updateUserZone } =
  authSlice.actions;
export default authSlice.reducer;
