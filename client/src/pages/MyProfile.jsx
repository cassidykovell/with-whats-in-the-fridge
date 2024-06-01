import React from 'react';
import Profile from '../components/Profile';

const MyProfilePage = () => {
  //EXAMPLE USER TO POPULATE FEEDPAGE
  const userId = '60c72b2f9b1d8b23d8efc1b1'; 

  return (
    <div>
      <Profile userId={userId} />
    </div>
  );
};

export default MyProfilePage;
