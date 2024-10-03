import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Protected({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader,setLoader]=useState(false)
    const isAuthenticated=useSelector((state)=>state.auth.isAuthenticated)
  

    useEffect(() => {
        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        
        //let authValue = authStatus === true ? true : false

        if(authentication && isAuthenticated !== authentication){
            navigate("/")
        } else if(!authentication && isAuthenticated !== authentication){
            navigate("/dashbord")
        }
        setLoader(false)
    }, [isAuthenticated, navigate, authentication])

    
    return loader ? <h1>Loading...</h1> : <>{children}</>

}