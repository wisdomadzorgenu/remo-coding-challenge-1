import React, { useEffect } from 'react';
import Firebase from '../services/firebase';
import { useHistory,withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import {updateUser} from "../actions/";

interface Props {
   user:any,
   updateUser:(user:any)=>void
};

const Auth: React.FC<Props> = (props) => {
  const history = useHistory();
//   const [loginBtnClicked,updateBtnClick] = useState(false);

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
         //update user in store
         props.updateUser(user);
      }
    });
  });

  const goToMainPage = ()=>{
      history.push('/theater');
  }

  const redirect = () => {
      //if user is already authenticated, don't re-authenticate
      if(props.user)
         goToMainPage();
      else {
         const provider = new Firebase.auth.GoogleAuthProvider();
         provider.setCustomParameters({
            prompt: 'select_account'
          });         
         Firebase.auth().signInWithPopup(provider)
            .then((result)=>{
               if(result.user){
                  //update user in store
                  props.updateUser(result.user);

                  goToMainPage();
               }
            })     
      }
  };

  return ( 
    <div 
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1> Remo Coding Challenge Join Room </h1>
      <button className="btn btn-primary" onClick={redirect}> Login With Google </button>
    </div> 
  );
};

const mapStateToProps = (state:any)=>{
   return {user:state.data.user}
};

const mapDispatchToProps = {
   updateUser
};

export default withRouter(
   connect(mapStateToProps,mapDispatchToProps)(Auth)
);
