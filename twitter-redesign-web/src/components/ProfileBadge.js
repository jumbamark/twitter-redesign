import React, { useEffect, useState } from 'react'
import {apiProfileDetail, apiProfileFollowToggle} from "./Lookup";
import {UserDisplay, UserPicture} from "./Profile"
import numeral from 'numeral'

function DisplayCount(props) {
  return <span className={props.className}>{numeral(props.children).format("0a")}</span>
}

const Badge = ({user, didFollowToggle, profileLoading}) => {
  // console.log(user);
  let currentFollowStatus = (user && user.is_following) ? "UnFollow" : "Follow"
  currentFollowStatus = profileLoading ? "Loading..." : currentFollowStatus

  const handleFollowToggle = (event) => {
      event.preventDefault();
      if (didFollowToggle && !profileLoading) {
        didFollowToggle(currentFollowStatus)
      }
  }

  return user ? (
    <div>
      <UserPicture user={user} hideLink/>
      <p><UserDisplay user={user} includeFullName hideLink/> </p>
      <p><DisplayCount>{user.follower_count}</DisplayCount> {user.follower_count === 1 ? "Follower" : "Followers"} </p>
      <p>{numeral(user.following_count).format("0a")} Following</p>
      <p>{user.location}</p>
      <p>{user.bio}</p>
      <button onClick={handleFollowToggle} className="btn btn-primary">{currentFollowStatus}</button>
    </div>
  ) : null;
}

function ProfileBadge({username}) {
      const [didLookup, setDidLookup] = useState(false);
      const [profile, setProfile] = useState(null);
      const [profileLoading, setProfileLoading] = useState(false)

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

      const handleNewFollowStatus = (actionStatus) => {
        console.log(actionStatus)

        apiProfileFollowToggle(username, actionStatus, (response, status) => {
          // console.log(response, status)
          if (status === 200) {
            setProfile(response)
            // apiProfileDetail(username, handleBackendLookup);
          }
          setProfileLoading(false);
        });
        setProfileLoading(true)
      }


  return (
      didLookup === false ? "Loading.." : profile ? <Badge user={profile} didFollowToggle={handleNewFollowStatus} profileLoading={profileLoading}/> : null
  );
}

export default ProfileBadge