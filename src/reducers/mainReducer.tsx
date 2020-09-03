import * as CoreFn from "./coreFunctions";

//REDUCERS FOR STORE
const SESSION_USER_KEY = "remo-coding-challenge";
const SESSION_USERS_DATA_KEY = "remo-user-data";
const SESSION_ASSIGNED_USERS = "remo-added-users";

interface InitialStateInterface {
   user:any,
   assignedUsers:string[],
   tableUsersData:any[]
};

const initialState:InitialStateInterface = {user:null,assignedUsers:[],tableUsersData:[]}

//get initial user state
initialState.user = CoreFn.getInitialUser(SESSION_USER_KEY)

//get initial assigned user state
initialState.assignedUsers = CoreFn.getInitialAssignedUsers(SESSION_ASSIGNED_USERS);

//get initial user Data state
initialState.tableUsersData = CoreFn.getInitialUserTablesData(SESSION_USERS_DATA_KEY);

export default (state = initialState, action:any) => {
   if(action.type === "update_user"){
      //update in session storage
      sessionStorage.setItem(SESSION_USER_KEY,JSON.stringify(action.user));

      //return an updated state
      return Object.assign({},state,{user:action.user});
   }
   else if(action.type === "remove_user"){
      //clear session storage too
      sessionStorage.removeItem(SESSION_USER_KEY);

      return Object.assign({},state,{user:null});   
   }
   else if(action.type === "update_users_table"){
      //new state with added email
      let newState = Object.assign({},state,{tableUsersData:action.tableUsersData});

      //update in session too
      sessionStorage.setItem(SESSION_USERS_DATA_KEY,JSON.stringify(newState.tableUsersData));

      return newState;
   }
   else if(action.type === "add_assigned_user"){
      //new state with added email
      let newState = Object.assign({},state,{
         assignedUsers:[
            ...state.assignedUsers, 
            action.email
         ]
      });

      //update in session for now
      sessionStorage.setItem(SESSION_ASSIGNED_USERS,JSON.stringify(newState.assignedUsers));

      return newState;
   }

   return state;
}