import React from 'react'

const UserLink = (props) => {
    const {username} = props
    const handleUserLink = (event) => {
    window.location.href = `/profile/${username}`;
    };

    return (
    <span className="pointer" onClick={handleUserLink}>
        {props.children}
    </span>
    );
};


function UserPicture({user, hideLink}) {
    const userIdSpan =  <span className="mx-1 px-3 py-2 rounded-circle bg-dark text-white">{user.username[0]}</span>

    return ( hideLink === true ? userIdSpan : <UserLink username={user.username}> </UserLink>
    );
}

const UserDisplay = ({user, includeFullName, hideLink}) => {
    const nameDisplay = includeFullName === true ? `${user.first_name} ${user.last_name} ` : null;
    
    return (
    <React.Fragment>
        {nameDisplay}
        {hideLink === true ? `@${user.username}` : <UserLink username={user.username}> @{user.username}</UserLink>}
    </React.Fragment>
    );
}


export {UserPicture, UserLink, UserDisplay}