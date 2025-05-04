"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import ResponseMessage from "../../components/responseMessage";

export default function Home() {

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [returnText, setReturnText] = useState({message:'Create a user here',status:''})
  async function RegisterUser(e) {
    e.preventDefault()
    let user = name && password ? {
      NameUser:name,
      Password:password
    } : undefined
    const res = await fetch('https://noteke-api-bfct.onrender.com/NewUser',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':'Nicolas_7025081098'
      },
      body:JSON.stringify(user)
    })
    const json = await res.json()
    setReturnText(json)
  }

  return (
    <>
      <div className="ContentStandart AnimaAppear1 login-content">
        <form onSubmit={RegisterUser}>
          <h1>Noteke register</h1>
          <input
            placeholder="Name"
            className="ContentStandartMoreBlack"
            value={name}
            onChange={(e) => { setName(e.target.value.trim()) }}
          ></input>
          <input
            placeholder="Password"
            type="Password"
            className="ContentStandartMoreBlack"
            value={password}
            onChange={(e) => { setPassword(e.target.value.trim()) }}
          ></input>
          <button className="ContentStandart">Register</button>

          <Link href={'/Login'}>go to login</Link>
        </form>
          <ResponseMessage msg={returnText.message} status={returnText.status}></ResponseMessage>
      </div>
    </>
  );
}
