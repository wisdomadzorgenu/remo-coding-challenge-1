//update user in the store
export function updateUser(user:any){
   return {
      type:'update_user',
      user:user
   };
}

//remove user
export function removeUser(){
   return {
      type:'remove_user',
      user:null
   };
}

//update user tables
export function updateUsersTableData(tableUsersData:any[]){
   return {
      type:'update_users_table',
      tableUsersData:tableUsersData
   }
}

//add assigned user
export function addAssignedUser(email:string){
   return {
      type:'add_assigned_user',
      email:email
   }
}
