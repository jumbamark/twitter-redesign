import React, { useEffect, useState } from 'react'
import {apiProfileDetail} from "./Lookup";

function ProfileBadge({username}) {
      const [didLookup, setDidLookup] = useState(false);
      const [profile, setProfile] = useState(null);

      const handleBackendLookup = (response, status) => {
        if (status === 200) {
          setProfile(response);
        }
      };

      useEffect(() => {
        if (didLookup === false) {
          apiProfileDetail(username, handleBackendLookup);
          setDidLookup(true);
        }
      }, [didLookup, setDidLookup, username]);


  return (
      didLookup === false ? "Loading.." : profile ? <span>{profile.first_name}</span> : null
  );
}

export default ProfileBadge