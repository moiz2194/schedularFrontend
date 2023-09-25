import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import context from '../context/context.js';
import './signin.css'
const Signin = () => {
  const a = useContext(context);
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('')
  const login = a.login;

  return (
    <div className='container my-5'>



      <section className="content ">
        <div className="row mt-5">
          <div className="col-md-6 w30">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Login</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="username">UserName</label>
                  <input type="text" id="username"  placeholder='Enter Username' className="form-control" value={username} onChange={(e) => { setusername(e.target.value) }} />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" className="form-control" placeholder='Enter password' value={password} onChange={(e) => { setpassword(e.target.value) }} />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className="row">
          <div className="col-12 my-3">
            <button className="btn btn-success purple float-right" style={{background:"#55e155"}} onClick={() => {
              login({ username, password });
            }}>
              Signin
            </button>

          </div>
        </div>
      </section>




    </div>
  )
}

export default Signin