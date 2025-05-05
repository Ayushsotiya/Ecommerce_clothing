import React, { Children } from 'react'
import { Navigate } from 'react-router-dom'
import {useSelector} from 'react-redux';
const OpenRoute = ({children}) => {
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    if(token===null){
        return children
    }else{
        return <Navigate to={user.type === 'Admin'? ("/dashboard/admin/profile"):("/dashboard/profile")}  />
    }
}

export default OpenRoute