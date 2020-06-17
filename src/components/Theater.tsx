import * as React from 'react';
import './Theater.scss'; 
import MapImage from '../assets/conference-map.svg';

const Theater: React.FC = () => {
  return ( 
    <div className='remo-theater'>
      <div className='rt-app-bar'>
        {/**
          * Show user profile pic/name after login
          */}
        <a href='javascript:;'>Logout</a>
      </div>
      <div className='rt-rooms'>
        {/**
          * Create rooms here as in the requirement and make sure it is aligned with background
          */}
        <div className='rt-room' style={{width: 211, height: 227, top: 216, left: 339}}><div className='rt-room-name'>First table</div></div>
      </div>
      <div className='rt-background'>
        <img src={MapImage} alt='Conference background'/>
      </div>
    </div>
  );
};
 
export default Theater;