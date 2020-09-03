import React, { useState,useEffect } from 'react';
import Firebase from '../services/firebase';
import './Theater.scss'; 
import MapImage from '../assets/conference-map.svg';
import TableConfig from './tableConfig.json';
import { useHistory,withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import {removeUser,updateUsersTableData,addAssignedUser} from "../actions/";
import TestData from "./testData.json";

interface Props {
   user:any,
   assignedUsers:string[],
   tableUsersData:any[],
   removeUser:()=>void,
   updateUsersTableData:(tableData:any[])=>void,
   addAssignedUser:(email:string)=>void
};

const Theater: React.FC<Props> = (props) => {
   const history = useHistory();
   const tableUsersData = props.tableUsersData;
   const user = props.user;
   const assignedUsers = props.assignedUsers;
   const tables = TableConfig.tables;
   let alertShowed = false;

   const [userPos,setUserPosition] = useState({}); //current user position

   if(!user)
      history.push("/");

   useEffect(() => {
      //redirect to login if user isn't authenticated
      // assign table to user
      if(user)
         assignUserToTable(props.user);                 
   });

   //get next empty seat
   const getNextEmptySeat = (seats:any[]) => {
      let nextInd = -1;

      for(let i=0; i<seats.length; i++){
         if(!seats[i]){
            nextInd = i;
            break;
         }
      }
      return nextInd;
   }

   //get fill seats
   const noOfFilledSeats = (seats:any[]) => {
      return seats.reduce((accum,val)=>{
         //if null, increase accumulator
         return val ? accum+1:accum;
      },0);
   }

   //check if all two seat tables are filled
   const areAllTwoSeatsFilled = () => {
      //first two seats and last two seats
      let firstSeatCol1 = tableUsersData[0][0];
      let firstSeatCol2 = tableUsersData[0][1];
      let lastSeatCol1 = tableUsersData[tableUsersData.length-1][0];
      let lastSeatCol2 = tableUsersData[tableUsersData.length-1][1];
      
      if(firstSeatCol1 && firstSeatCol2 && lastSeatCol1 && lastSeatCol2)
         return true;

      return false;
   }

   //google loged in user
   const assignUserToTable = (user:any) => {
      if(assignedUsers.length > 100 && !alertShowed){
         alert("The maximum number of people for the conference has been reached");
         alertShowed = true;
      }
      else {
         //get user information
         let userData = {
            email:user.email,
            displayName:user.displayName,
            photoURL:user.photoURL,
            uid:user.uid
         };

         //only add when user hasn't been assigned
         if(assignedUsers.indexOf(userData.email) === -1)
         {
            //check if all two seat tables are filled
            let allTwoFilled = areAllTwoSeatsFilled();

            //if not all two pairs are filled, fill before paring one by one
            if(!allTwoFilled){
               //find current position to fill
               for(let i=0; i<tableUsersData.length; i++){
                  let seats = tableUsersData[i];
            
                  //get filled seats
                  let filledSeats = noOfFilledSeats(seats);
                  
                  //all users should be paired first
                  if(filledSeats < 2){
                     //get next empty seat and pair
                     let nextEmptyInd = getNextEmptySeat(seats);
                     
                     //assign to user
                     tableUsersData[i][nextEmptyInd] = userData;

                     //update table
                     props.updateUsersTableData(tableUsersData);

                     break;
                  }
               }
            }
            else {
               //get number of max no of seats()
               let maxSeats = tableUsersData[0].length;

               //0 based index
               let col = 2; 
               for(let i=2; i<maxSeats; i++){
                  //get the first and last items for each column(corresponding seat)
                  let firstTableColData = tableUsersData[0][i];
                  let lastTableColData = tableUsersData[tableUsersData.length-1][i];

                  //continue with column if at least one field is null(empty)
                  if(!firstTableColData || !lastTableColData){
                     col = i;
                     break;
                  }
               }

               //loop through same seat columns for each table
               for(let j=0; j<tableUsersData.length; j++){

                  //only add user to seat of not occupied
                  if(!tableUsersData[j][col]){
                     //assign to user
                     tableUsersData[j][col] = userData;
                     
                     //update state
                     props.updateUsersTableData(tableUsersData);

                     break;
                  }//seat is empty
               }//each seat loop
            }//three or more seats

            //add assigned user in state
            props.addAssignedUser(userData.email);
         }
         else{
            //console.log('user already assigned');
         }
      }
   }

   //switch user from current position to another position
   const switchUserTable = (currentPosition:{table:number,seat:number},switchTo:number) => {
      //cannot switch to table which doesn't exist
      if(switchTo < tableUsersData.length){
         //get user information
         let currentTable = currentPosition.table;
         let currentSeat = currentPosition.seat;

         let temp = tableUsersData[currentTable][currentSeat];

         //swap positions
         tableUsersData[currentTable][currentSeat] = tableUsersData[switchTo][currentSeat];
         tableUsersData[switchTo][currentSeat] = temp;

         //update in state
         props.updateUsersTableData(JSON.parse(JSON.stringify(tableUsersData)));
      }
   }

   //get any user location
   const getUserLocation = (user:any) => {
      let tableNo = -1, seatNo = -1;

      //find by table and seat
      for(let i=0; i<tableUsersData.length; i++){
         for(let j=0; j<tableUsersData[i].length; j++){
            if(tableUsersData[i][j] && tableUsersData[i][j].email === user.email){
               tableNo = i;
               seatNo = j;

               break;
            }
         }

         //stop user has been found
         if(tableNo !== -1 && seatNo !== -1)
            break;
      }

      return {tableNo:tableNo,seatNo:seatNo};
   }
   
   const showCurrentUser = () => {
      //get user location
      let location:any = getUserLocation(user);

      let currentPosition = {table:location.tableNo,seat:location.seatNo};

      //update state
      setUserPosition(currentPosition);
   }

   //remove user
   const logoutUser = (e:any) => {
      e.preventDefault();

      //log user out from google
      Firebase.auth().signOut().then(()=>{
         //remove user from store
         props.removeUser();      

         //redirect to login page
         history.push("/");         
       }).catch(function(error) {
         // An error happened.         
       });
   }

   //test system with user data
   const testUsers = ()=> {
      //=====================
      // TESTING USER LOGIC
      let testUsers:any[] = TestData;

      //assign users
      testUsers.forEach((obj)=>{
         assignUserToTable(obj);
      });
   }

   //handle the switching of user
   const handleSwitchUserTable = (switchTo:number) =>{
      //get user location
      let location = getUserLocation(user);
      let currentPosition = {table:location.tableNo, seat:location.seatNo};

      switchUserTable(currentPosition,switchTo);      

      //show updated table if user is displayed
      if(("table" in userPos) && ("seat" in userPos)){
         //allow data to change first
         setTimeout(()=>{
            showCurrentUser();
         },100);
      }
   }

  return ( 
    <div className='remo-theater' style={{width: TableConfig.width, height: TableConfig.height}}>
      <div className='rt-app-bar'>
         <div className="inner-div">
            <div className="text-div first">
               <button type="button" className="btn btn-primary" onClick={showCurrentUser}>
                  Show Current User
               </button>
               <button type="button" className="btn btn-success" onClick={testUsers}>
                  Populate Tests
               </button>
            </div>
            {props && props.user && props.user.photoURL &&
               <div className="img-div">
                  <img className="user-img active" src={props.user.photoURL} alt={props.user.displayName}/>
               </div>
            }
            {props && props.user && props.user.displayName &&
               <div className="text-div">
                  {props.user.displayName}            
                  <a href='# ' className="logout" onClick={(e)=>{logoutUser(e)}}>Logout</a>
               </div>
            }
         </div>
      </div>

      <div className='rt-rooms'>
        {tables && tables.map((obj,tInd)=>
         <div className='rt-room' key={obj.id} onDoubleClick={(e)=>handleSwitchUserTable(tInd)} 
               style={{width:obj.width, height:obj.height, top:obj.y, left:obj.x}}>
         {tableUsersData && tableUsersData[tInd].map((cuser:any,sInd:number)=>
            {return cuser && cuser.email && 
               <a key={cuser.email} title={cuser.displayName +", "+ cuser.email}>
                  <img style={{top:tables[tInd].seats[sInd].y, left:tables[tInd].seats[sInd].x}} 
                       src={cuser.photoURL}       
                        className={"user-img seat " + ((userPos && ("table" in userPos) && ("seat" in userPos)
                              && (userPos["table"] === tInd) && (userPos["seat"]===sInd))? "active trans":"")
                           }  
                     />
               </a>               
            }                        
         )}         
            <div className='rt-room-name'>{obj.id}</div>
         </div>
        )}
      </div>
      <div className='rt-background'>
        <img src={MapImage} alt='Conference background'/>
      </div>
    </div>
  );
};
 
const mapStateToProps = (state:any)=>{
   return {
      user:state.data.user,   
      assignedUsers:state.data.assignedUsers,
      tableUsersData:state.data.tableUsersData
   }
};

const mapDispatchToProps = {
   removeUser,updateUsersTableData,addAssignedUser
};

export default withRouter(
   connect(mapStateToProps,mapDispatchToProps)(Theater)
);
