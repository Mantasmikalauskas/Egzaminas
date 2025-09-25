import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Back(){ const nav = useNavigate(); return <button className='btn px-3 py-1 rounded' onClick={()=>nav(-1)}>Atgal</button> }

function Header({user,setUser}){
  const nav = useNavigate();
  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); nav('/'); };
  return (
    <header className='header flex items-center justify-between px-4 py-3'>
      <div className='flex items-center'>
        <Link to='/' className='text-gray-300 font-bold text-xl no-underline'>AUTOMOBILIŲ NUOMA</Link>
        <Link to='/apie' className='ml-3 text-gray-200 px-2 py-1 border border-gray-400 rounded'>UAB AUTNUOMA</Link>
      </div>
      <div className='flex items-center space-x-3'>
        <Link to='/apie' className='text-white'>Apie mus</Link>
        {user ? <button className='btn px-3 py-1 rounded' onClick={logout}>ATSIJUNGTI</button> :
        <>
          <Link to='/login'><button className='btn px-3 py-1 rounded'>PRISIJUNGTI</button></Link>
          <Link to='/register'><button className='btn px-3 py-1 rounded'>REGISTRUOTIS</button></Link>
        </>}
      </div>
    </header>
  )
}

function Sidebar({filter,setFilter,user,isAdmin}){
  const classes = ['VISI','EKONOMINĖ KLASĖ','VIDUTINĖ KLASĖ','SUV','LIMUZINAI','PROGINIAI','KELEIVINIAI MIKROAUTOBUSAI','KROVININIAI','PRIEKABOS','KĖDUTĖS VAIKAMS','NARVAI AUGINTINIAMS','KITA PAPILDOMA ĮRANGA'];
  return (
    <aside className='w-56 p-4 bg-transparent'>
      {classes.map(c=> <button key={c} className={'block w-full text-left mb-2 p-2 rounded '+(filter===c?'bg-gray-500 text-white':'bg-gray-200')} onClick={()=>setFilter(c)}>{c}</button>)}
      <button className={'block w-full text-left mb-2 p-2 rounded '+(filter==='WITH_HOOK'?'bg-gray-500 text-white':'bg-gray-200')} onClick={()=>setFilter('WITH_HOOK')}>Su kabliu</button>
      {user && <button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('MY_RES')}>Mano rezervacijos</button>}
      {isAdmin && <>
        <button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('CREATE')}>Sukurti naują</button>
        <button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('ALL_RES')}>Visos rezervacijos</button>
        <button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('ALL_USERS')}>Visi vartotojai</button>
      </>}
      <div className='mt-4 p-3 bg-white rounded shadow'>
        <strong>AKCIJA!</strong>
        <img src='https://images.unsplash.com/photo-1503376780353-7e6692767b70' alt='promo' className='mt-2 rounded' />
      </div>
    </aside>
  )
}

function Card({c,onOpen}){
  return (
    <div className='card rounded shadow cursor-pointer' onClick={()=>onOpen(c._id)}>
      <img src={c.imageUrl} alt={c.name} className='w-full h-44 object-cover'/>
      <div className='p-3'>
        <div className='text-sm'>V. Nr.: {c.idPlate}</div>
        <div className='text-sm'>{c.class} — {c.name} ({c.year})</div>
        <div className='text-sm'>Kablys: {c.withHook ? 'Yra' : 'Nėra'}</div>
        {c.extraType && <div className='text-sm'>Kiekis liko: {c.extraQuantity}</div>}
        <div className='font-bold mt-2'>{c.pricePerDay} € / diena</div>
      </div>
    </div>
  )
}

function Home({user,isAdmin}){
  const [cars,setCars]=useState([]);
  const [filter,setFilter]=useState('VISI');
  useEffect(()=>{ fetchCars(); },[filter]);
  async function fetchCars(){
    let q = {};
    if(filter==='WITH_HOOK') q.withHook='true';
    if(filter!=='VISI' && !['WITH_HOOK','MY_RES','CREATE','ALL_RES','ALL_USERS'].includes(filter)) q.classType = filter;
    if(filter==='MY_RES'){ window.location='/myreservations'; return; }
    if(filter==='CREATE'){ window.location='/create'; return; }
    if(filter==='ALL_RES'){ window.location='/allreservations'; return; }
    if(filter==='ALL_USERS'){ window.location='/users'; return; }
    const params = new URLSearchParams(q).toString();
    const res = await fetch(API + '/cars' + (params?('?'+params):''));
    const data = await res.json();
    setCars(data);
  }
  const navigate = useNavigate();
  return (
    <div className='flex'>
      <Sidebar filter={filter} setFilter={setFilter} user={user} isAdmin={isAdmin} />
      <main className='flex-1 p-4'>
        <div className='grid gap-4' style={{gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          {cars.map(c=> <Card key={c._id} c={c} onOpen={(id)=>navigate('/cars/'+id)} />)}
        </div>
      </main>
    </div>
  )
}

function CarDetails(){ const {id} = useParams(); const [car,setCar]=useState(null); const [start,setStart]=useState(''); const [end,setEnd]=useState(''); const [insurance,setInsurance]=useState(false); const [wash,setWash]=useState(false); const [qty,setQty]=useState(1);
  useEffect(()=>{ fetchCar(); },[]);
  async function fetchCar(){ const res = await fetch(API + '/cars/' + id); setCar(await res.json()); }
  async function reserve(){ const user = JSON.parse(localStorage.getItem('user')||'null'); if(!user) return alert('Prisijunkite'); if(!start || !end) return alert('Pasirinkite datas'); const body={userId:user.id,carId:id,startDate:start,endDate:end,extraInsurance:insurance,wash,quantity:qty}; const res = await fetch(API + '/reservations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); const data = await res.json(); if(data.error) alert(data.error); else alert('Rezervacija atlikta'); }
  if(!car) return <div className='p-4'>Kraunasi...</div>;
  return (<div className='p-4'><Back/><h2 className='text-2xl mt-2'>{car.name} — {car.idPlate}</h2><img src={car.imageUrl} className='w-full max-w-xl h-60 object-cover rounded mt-2'/><p className='mt-2'>{car.description}</p><div className='mt-2'><label>nuo <input type='date' value={start} onChange={e=>setStart(e.target.value)} className='ml-2'/></label><label className='ml-4'> iki <input type='date' value={end} onChange={e=>setEnd(e.target.value)} className='ml-2'/></label></div>{!car.extraType && <div className='mt-2'><label><input type='checkbox' checked={insurance} onChange={e=>setInsurance(e.target.checked)} /> Papildomas draudimas (+5€/diena)</label><br/><label><input type='checkbox' checked={wash} onChange={e=>setWash(e.target.checked)} /> Išplauti automobilį (+9€)</label></div>}{car.extraType && <div className='mt-2'>Kiekis: <input type='number' min='1' max={car.extraQuantity} value={qty} onChange={e=>setQty(Number(e.target.value))}/></div>}<div className='mt-4'><button className='btn px-4 py-2' onClick={reserve}>Rezervuoti</button> <button className='btn px-4 py-2 ml-2'>Apmokėti</button></div></div>)
}

function Login({setUser}){ const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const nav = useNavigate(); async function submit(e){ e.preventDefault(); const res = await fetch(API + '/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pw})}); const data = await res.json(); if(data.error) return alert(data.error); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); nav('/'); } return (<div className='p-4'><Back/><h3>Prisijungti</h3><form onSubmit={submit}><input placeholder='Email' className='border p-2 block mb-2' value={email} onChange={e=>setEmail(e.target.value)}/><input placeholder='Slaptažodis' type='password' className='border p-2 block mb-2' value={pw} onChange={e=>setPw(e.target.value)}/><button className='btn px-3 py-1' type='submit'>Prisijungti</button></form></div>) }

function Register(){ const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const nav = useNavigate(); async function submit(e){ e.preventDefault(); const res = await fetch(API + '/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password:pw})}); const data = await res.json(); if(data.error) return alert(data.error); alert('Vartotojas sukurtas'); nav('/login'); } return (<div className='p-4'><Back/><h3>Registruotis</h3><form onSubmit={submit}><input placeholder='Vardas' className='border p-2 block mb-2' value={name} onChange={e=>setName(e.target.value)}/><input placeholder='Email' className='border p-2 block mb-2' value={email} onChange={e=>setEmail(e.target.value)}/><input placeholder='Slaptažodis' type='password' className='border p-2 block mb-2' value={pw} onChange={e=>setPw(e.target.value)}/><button className='btn px-3 py-1' type='submit'>Registruotis</button></form></div>) }

function MyReservations(){ const [list,setList]=useState([]); useEffect(()=>{ fetchList(); },[]); async function fetchList(){ const user = JSON.parse(localStorage.getItem('user')||'null'); if(!user) return; const res = await fetch(API + '/reservations?userId=' + user.id); const data = await res.json(); setList(data); } async function payAll(){ const user = JSON.parse(localStorage.getItem('user')||'null'); if(!user) return alert('Prisijunkite'); const res = await fetch(API + '/reservations/payAll/' + user.id, {method:'PUT'}); if(res.ok){ alert('Visos rezervacijos apmokėtos'); fetchList(); } } return (<div className='p-4'><Back/><h3>Mano rezervacijos</h3>{list.length===0 && <div>Nėra rezervacijų</div>}{list.map(r=> (<div key={r._id} className='p-3 bg-white rounded shadow my-2'><div><strong>{r.carId?.name}</strong></div><div>Data: {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</div><div>Trukmė: {r.days} dienos</div><div>Automobilio kaina: { (r.carId?.pricePerDay||0) } * {r.days} = { (r.carId?.pricePerDay||0)*r.days } €</div><div>Papildomas draudimas: {r.extraInsurance ? (5*r.days) + ' €' : '0 €'}</div><div>Išplauti automobilį: {r.wash ? '9 €' : '0 €'}</div><div><strong>Iš viso: {r.totalPrice} €</strong></div><div>Statusas: {r.paid ? 'Apmokėta' : 'Neapmokėta'}</div></div>))}<div className='mt-4'><button className='btn px-4 py-2' onClick={payAll}>Apmokėti</button></div></div>) }

export default function App(){ const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')||'null')); useEffect(()=>{ setUser(JSON.parse(localStorage.getItem('user')||'null')); },[]); const isAdmin = user?.isAdmin; return (<BrowserRouter><Header user={user} setUser={setUser} /><Routes><Route path='/' element={<Home user={user} isAdmin={isAdmin} />} /><Route path='/cars/:id' element={<CarDetails/>} /><Route path='/login' element={<Login setUser={setUser}/>} /><Route path='/register' element={<Register/>} /><Route path='/myreservations' element={<MyReservations/>} /><Route path='/apie' element={<div className='p-4'><Back/><h2>Apie mus</h2><p>Įmonės aprašymas...</p></div>} /></Routes><footer className='footer text-white flex justify-between px-4'><div>Kontaktai | Susisiekti</div><div>Įmonės rekvizitai</div></footer></BrowserRouter>)}
