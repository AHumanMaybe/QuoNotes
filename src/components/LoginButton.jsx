import { Link } from "react-router-dom"
import React from "react"

function LoginButton({ text= "Login" }){

    return(<>
         <div className="">
         <Link to="/login"><button className="login-button">{text}</button></Link>
        </div>
    </>)
}

export default LoginButton