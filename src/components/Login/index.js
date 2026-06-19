import { Component } from "react";
import Cookies from 'js-cookie'
import {Navigate} from 'react-router-dom'
import './index.css'

class Login extends Component{
    state={
        email:'',
        password:'',
        se:false,
        em:"",
    }
    one=event=>{
        this.setState({
            email:event.target.value,
        })
    }

    two=event=>{
        this.setState({
            password:event.target.value,
        })
    }
    success=jwtToken=>{
        Cookies.set('jwt_token',jwtToken,{expires:30,path:'/',})
    
    window.location.replace('/')}

    fail=em=>{
        this.setState({
            se:true,em,
        })
    }

    BussinessLogin=async event=>{
        event.preventDefault()
        const {email,password}=this.state
        const userDetails={
            email,password
        }

        const url="https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin"
        const options={
           method:"POST",
           headers:{
            'Content-Type':'application/json',

           },
           body:JSON.stringify(userDetails),
        }

        const response=await fetch(url,options)
        const data=await response.json()

        if (response.ok){
            this.success(data.data.token)

        }else{
            this.fail(data.message)
        }
    }

    render(){
        const {email,password,se,em}=this.state

        const token=Cookies.get('jwt_token')
        if(token!=undefined){
            return <Navigate to='/'/>
        }

        return(
            <div className="main-cont">
                <form className="form-element" onSubmit={this.BussinessLogin}>
                    <h1 className="header">Go Bussiness</h1>
                    <p className="login-para">sign in to open your referral dashboard</p>
                    <div className="input-cont">
                        <label htmlFor="user" className="label">Email</label>
                        <input id="user" placeholder="you@example.com" className="inpu" type="email" value={value} onChange={this.one} />

                    </div>

                    <div className="input-cont">
                        <label htmlFor="password" className="label">Password</label>
                        <input placeholder="Enter Password" id='password' className="inpu" type="password" value={password} onChange={this.two}/>      
                
                         </div>

                         <button className="butn" type="submit">
                            Login
                         </button>

                         <div className="error-msg">{ se && <p className="error-para">{em}</p>}
                    </div>
                </form>
            </div>
        )
    }

}