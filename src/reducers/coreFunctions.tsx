import TableConfig from "../components/tableConfig.json";

//getting initial user state 
export function getInitialUser(SESSION_KEY:string):any {
   //check if user information exists in session storage
   let userString = sessionStorage.getItem(SESSION_KEY);

   //return existing user if exists in session
   if(userString){
      let user = JSON.parse(userString);

      //return an updated state
      return user;
   }

   return null;
}

//get initial assigned user state
export function getInitialAssignedUsers(SESSION_KEY:string):string[]{
   let assignedUserStr = sessionStorage.getItem(SESSION_KEY);   

   if(assignedUserStr){
      return JSON.parse(assignedUserStr);
   }

   return [];
}

//get initial assigned user state
export function getInitialUserTablesData(SESSION_KEY:string):any[]{
   //check if table data exists in session storage
   let tableStr = sessionStorage.getItem(SESSION_KEY);   
   let tableUsersData = [];

   if(tableStr){
      tableUsersData = JSON.parse(tableStr);
   }

   //use the default table config to create users and seats
   if(tableUsersData.length === 0){

      //configure table using table config
      let len = TableConfig.tables.length;

      for(let i=0; i<len; i++){
         let table = TableConfig.tables[i];

         //get empty seats
         let seats:any[] = Array(table.seats.length).fill(null);

         //deep clone to avoid unexplained bugs
         seats = JSON.parse(JSON.stringify(seats));

         //push seats
         tableUsersData.push(seats);
      }
   }   

   return tableUsersData;
}

