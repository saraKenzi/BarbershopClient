import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    currentUser: null
}
let userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        userIn: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem("currentUser",JSON.stringify(state.currentUser));


        },
        userOut:(state,action)=>{
            state.currentUser=null;
            localStorage.removeItem("currentUser");

        },
       
    }
});
export const  {userIn,userOut}=userSlice.actions;
export default userSlice.reducer;
