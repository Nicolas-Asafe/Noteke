import Link from "next/link";
import { useState} from "react";
import ResponseMessage from "../../components/responseMessage";
import Router from "next/router";
import Cookies from "js-cookie";
import dotenv from 'dotenv'
dotenv.config
export default function Home() {

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [returnText, setReturnText] = useState({message:'Put your credentials to login', status:''})
  async function LoginUser(e) {
    e.preventDefault();
    if (!name || !password) return;
    try {
      const res = await fetch(
        "https://noteke-api-bfct.onrender.com/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'x-api-key': process.env.NEXT_PUBLIC_KEYACCESS          
          },
          body: JSON.stringify({ NameUser: name, Password: password }),
        }
      );
      const json = await res.json();
      console.log(json)

      const token = Array.isArray(json.token) ? json.token[0] : json.token;
      if (token && typeof token === "string" && token.includes(".")) {
        setReturnText(json)
        localStorage.setItem("token", token);  
        Cookies.set('token',token)
        Router.replace("/home");  
      } else {
        setReturnText(json)
      }
    } catch {
      setReturnText(json)
    }
  }
  

  return (
    <>
        <div className="ContentStandart AnimaAppear1 login-content">
        <form onSubmit={LoginUser}>
          <h1>Noteke login</h1>
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
          <button className="ContentStandart">Login in</button>

          <Link href={'/Register'}>go to register</Link>
        </form>
          <ResponseMessage msg={returnText.message} status={returnText.status}></ResponseMessage>
      </div>
    </>
  );
}
