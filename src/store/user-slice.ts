import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { User } from 'src/interfaces/user-interface';

const initialState: User[] = [];
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    replaceUsers: (state, action: PayloadAction<User[]>) => {
      state.push.apply(state, action.payload);
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
  },
});

export const { replaceUsers, addUser } = usersSlice.actions;
