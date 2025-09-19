import React,{useState,useContext} from 'react'; import { useNavigate } from 'react-router-dom'; import { AuthContext } from '../context/AuthContext';
export default function Login(){ const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const {login}=useContext(AuthContext); const nav=useNavigate();
const submit=async e=>{ e.preventDefault(); try{ await login(email,password); nav('/'); }catch(err){ alert(err.response?.data?.message||err.message); } };
return (<form onSubmit={submit} className='form'><h2>Login</h2><label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type='password' value={password} onChange={e=>setPassword(e.target.value)} /></label><button>Login</button></form>); }
