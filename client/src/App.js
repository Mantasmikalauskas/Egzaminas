import React,{useEffect,useState} from 'react';import {BrowserRouter,Routes,Route,Link,useNavigate,useParams} from 'react-router-dom';const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
function Back(){ const nav = useNavigate(); return <button className='btn px-3 py-1 rounded' onClick={()=>nav(-1)}>Atgal</button> }
function Header({user,setUser}){ const nav = useNavigate(); const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); nav('/'); }; return (<header className='header flex items-center justify-between px-4 py-3'><div className='flex items-center'><Link to='/' className='text-gray-300 font-bold text-xl no-underline'>AUTOMOBILIŲ NUOMA</Link><Link to='/apie' className='ml-3 text-gray-200 px-2 py-1 border border-gray-400 rounded'>UAB AUTNUOMA</Link></div><div className='flex items-center space-x-3'>{user ? <button className='btn px-3 py-1 rounded' onClick={logout}>ATSIJUNGTI</button> : <><Link to='/login'><button className='btn px-3 py-1 rounded'>PRISIJUNGTI</button></Link><Link to='/register'><button className='btn px-3 py-1 rounded'>REGISTRUOTIS</button></Link></>}</div></header>)}

function Sidebar({filter,setFilter,user,isAdmin}){ const classes=['VISI','EKONOMINĖ KLASĖ','VIDUTINĖ KLASĖ','SUV','LIMUZINAI','PROGINIAI','KELEIVINIAI MIKROAUTOBUSAI','KROVININIAI','PRIEKABOS','KĖDUTĖS VAIKAMS','NARVAI AUGINTINIAMS','KITA PAPILDOMA ĮRANGA']; return (<aside className='w-56 p-4 bg-transparent'>{classes.map(c=> <button key={c} className={'block w-full text-left mb-2 p-2 rounded '+(filter===c?'bg-gray-500 text-white':'bg-gray-200')} onClick={()=>setFilter(c)}>{c}</button>)}<button className={'block w-full text-left mb-2 p-2 rounded '+(filter==='WITH_HOOK'?'bg-gray-500 text-white':'bg-gray-200')} onClick={()=>setFilter('WITH_HOOK')}>Su kabliu</button>{user && <button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('MY_RES')}>Mano rezervacijos</button>}{isAdmin && <><button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('CREATE')}>Sukurti naują</button><button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('ALL_RES')}>Visos rezervacijos</button><button className='block w-full text-left mb-2 p-2 rounded bg-gray-400' onClick={()=>setFilter('ALL_USERS')}>Visi vartotojai</button></>}<div className='mt-4 p-3 bg-white rounded shadow'><strong>AKCIJA!</strong><img src='https://images.unsplash.com/photo-1503376780353-7e6692767b70' alt='promo' className='mt-2 rounded' /></div></aside>) }

function Card({c,onOpen,isAdmin,onEdit,onDelete}){ return (<div className='card rounded shadow'><img src={c.imageUrl} className='w-full h-44 object-cover' alt='' onClick={()=>onOpen(c._id)} /><div className='p-3'><div>V. Nr.: {c.idPlate}</div><div>{c.class} - {c.name}</div><div>Kablys: {c.withHook? 'Yra':'Nėra'}</div><div className='font-bold mt-2'>{c.pricePerDay} € / diena</div>{isAdmin && <div className='mt-2'><button className='btn admin-btn px-2 py-1' onClick={()=>onEdit(c)}>Koreguoti</button> <button className='btn px-2 py-1 ml-2' onClick={()=>onDelete(c._id)}>Ištrinti</button></div>}</div></div>) }

function Home({ user, isAdmin }) {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState("VISI");
  const nav = useNavigate();

  useEffect(() => {
    fetchCars();
  }, [filter]);

  async function fetchCars() {
    let q = {};
    if (filter === "WITH_HOOK") q.withHook = "true";

    if (
      filter !== "VISI" &&
      !["WITH_HOOK", "MY_RES", "CREATE", "ALL_RES", "ALL_USERS"].includes(filter)
    ) {
      q.classType = filter;
    }

    if (filter === "MY_RES") {
      window.location = "/myreservations";
      return;
    }
    if (filter === "CREATE") {
      window.location = "/create";
      return;
    }
    if (filter === "ALL_RES") {
      window.location = "/allreservations";
      return;
    }
    if (filter === "ALL_USERS") {
      window.location = "/users";
      return;
    }

    const params = new URLSearchParams(q).toString();
    const res = await fetch(API + "/cars" + (params ? "?" + params : ""));
    setCars(await res.json());
  }

  const edit = (car) => {
    localStorage.setItem("editCar", JSON.stringify(car));
    nav("/edit/" + car._id);
  };

  const del = async (id) => {
    if (!window.confirm("Ištrinti automobilį?")) return;
    await fetch(API + "/cars/" + id, { method: "DELETE" });
    fetchCars();
  };

  return (
    <div className="flex">
      <Sidebar filter={filter} setFilter={setFilter} user={user} isAdmin={isAdmin} />
      <main className="flex-1 p-4">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {cars.map((c) => (
            <Card
              key={c._id}
              c={c}
              onOpen={(id) => nav("/cars/" + id)}
              isAdmin={isAdmin}
              onEdit={edit}
              onDelete={del}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function CarDetails(){ const {id}=useParams(); const [car,setCar]=useState(null); const [start,setStart]=useState(''); const [end,setEnd]=useState(''); const [insurance,setInsurance]=useState(false); const [wash,setWash]=useState(false); const [qty,setQty]=useState(1); useEffect(()=>{ fetch(API + '/cars/' + id).then(r=>r.json()).then(setCar); },[]); async function reserve(){ const user = JSON.parse(localStorage.getItem('user')||'null'); if(!user) return alert('Prisijunkite'); if(!start||!end) return alert('Pasirinkite datas'); const res=await fetch(API + '/reservations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:user.id,carId:id,startDate:start,endDate:end,extraInsurance:insurance,wash,quantity:qty})}); const data=await res.json(); if(data.error) alert(data.error); else alert('Rezervacija atlikta'); }
 if(!car) return <div className='p-4'>Kraunasi...</div>;
 return (<div className='p-4'><Back/><h2 className='text-2xl'>{car.name} — {car.idPlate}</h2><img src={car.imageUrl} className='w-full max-w-xl h-60 object-cover rounded mt-2' alt='' /><p className='mt-2'>{car.description}</p><div className='mt-2'><label>nuo <input type='date' value={start} onChange={e=>setStart(e.target.value)} className='ml-2' /></label><label className='ml-4'> iki <input type='date' value={end} onChange={e=>setEnd(e.target.value)} className='ml-2' /></label></div>{!car.extraType && <div className='mt-2'><label><input type='checkbox' checked={insurance} onChange={e=>setInsurance(e.target.checked)} /> Papildomas draudimas (+5€/diena)</label><br/><label><input type='checkbox' checked={wash} onChange={e=>setWash(e.target.checked)} /> Išplauti automobilį (+9€)</label></div>}{car.extraType && <div className='mt-2'>Kiekis: <input type='number' min='1' max={car.extraQuantity} value={qty} onChange={e=>setQty(Number(e.target.value))}/></div>}<div className='mt-4'><button className='btn px-4 py-2' onClick={reserve}>Rezervuoti</button> <button className='btn px-4 py-2 ml-2'>Apmokėti</button></div></div>) }

function Login({setUser}){ const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const nav=useNavigate(); async function submit(e){ e.preventDefault(); const r=await fetch(API + '/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pw})}); const data=await r.json(); if(data.error) return alert(data.error); localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user); nav('/'); }
 return (<div className='p-4'><Back/><h3>Prisijungti</h3><form onSubmit={submit}><input placeholder='Email' className='border p-2 block mb-2' value={email} onChange={e=>setEmail(e.target.value)}/><input type='password' placeholder='Slaptažodis' className='border p-2 block mb-2' value={pw} onChange={e=>setPw(e.target.value)}/><button className='btn' type='submit'>Prisijungti</button></form></div>) }

function Register(){ const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const nav=useNavigate(); async function submit(e){ e.preventDefault(); await fetch(API + '/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password:pw})}); alert('Vartotojas sukurtas'); nav('/login'); }
 return (<div className='p-4'><Back/><h3>Registruotis</h3><form onSubmit={submit}><input placeholder='Vardas' className='border p-2 block mb-2' value={name} onChange={e=>setName(e.target.value)}/><input placeholder='Email' className='border p-2 block mb-2' value={email} onChange={e=>setEmail(e.target.value)}/><input type='password' placeholder='Slaptažodis' className='border p-2 block mb-2' value={pw} onChange={e=>setPw(e.target.value)}/><button className='btn' type='submit'>Registruotis</button></form></div>) }

function MyReservations(){ const [list,setList]=useState([]); useEffect(()=>{ fetchList(); },[]); async function fetchList(){ const user = JSON.parse(localStorage.getItem('user')||'null'); if(!user) return; const res=await fetch(API + '/reservations?userId=' + user.id); setList(await res.json()); } async function payAll(){ const user = JSON.parse(localStorage.getItem('user')||'null'); if(!user) return alert('Prisijunkite'); await fetch(API + '/reservations/payAll/' + user.id, {method:'PUT'}); fetchList(); }
 return (<div className='p-4'><Back/><h3>Mano rezervacijos</h3>{list.map(r=>(<div key={r._id} className='p-3 bg-white rounded shadow my-2'><div><strong>{r.carId?.name}</strong></div><div>{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</div><div><strong>Iš viso: {r.totalPrice} €</strong></div></div>))}<div className='mt-4'><button className='btn' onClick={payAll}>Apmokėti</button></div></div>) }

function AdminUsers(){ const [users,setUsers]=useState([]); useEffect(()=>{ fetchUsers(); },[]); async function fetchUsers(){ const r=await fetch(API + '/users'); setUsers(await r.json()); } async function del(id){ if(!confirm('Ištrinti?')) return; await fetch(API + '/users/'+id,{method:'DELETE'}); fetchUsers(); }
 return (<div className='p-4'><Back/><h3>Visi vartotojai</h3>{users.map(u=>(<div key={u._id} className='p-2 bg-white rounded shadow my-2'><div>{u.name} — {u.email}</div><div className='mt-2'><button className='btn' onClick={()=>del(u._id)}>Ištrinti</button></div></div>))}</div>) }

function AdminReservations(){ const [list,setList]=useState([]); useEffect(()=>{ fetchAll(); },[]); async function fetchAll(){ const r=await fetch(API + '/reservations'); setList(await r.json()); } async function del(id){ if(!confirm('Ištrinti?')) return; await fetch(API + '/reservations/'+id,{method:'DELETE'}); fetchAll(); } async function edit(id){ const s=prompt('Nauja pradžios data (YYYY-MM-DD)'); const e=prompt('Nauja pabaigos data (YYYY-MM-DD)'); if(!s||!e) return; await fetch(API + '/reservations/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({startDate:s,endDate:e})}); fetchAll(); }
 return (<div className='p-4'><Back/><h3>Visos rezervacijos</h3>{list.map(r=>(<div key={r._id} className='p-3 bg-white rounded shadow my-2'><div><strong>{r.carId?.name}</strong> — {r.userId?.email}</div><div>{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</div><div>Iš viso: {r.totalPrice} €</div><div className='mt-2'><button className='btn' onClick={()=>edit(r._id)}>Koreguoti</button><button className='btn ml-2' onClick={()=>del(r._id)}>Ištrinti</button></div></div>))}</div>) }

function CreateEdit(){ const {id} = useParams(); const editCar = id ? JSON.parse(localStorage.getItem('editCar')||'null') : null; const [form,setForm]=useState(editCar || {idPlate:'',class:'EKONOMINĖ KLASĖ',name:'',year:2020,pricePerDay:30,withHook:false,imageUrl:'',description:''}); const nav=useNavigate(); async function submit(e){ e.preventDefault(); const method=id?'PUT':'POST'; const url=API + '/cars' + (id?('/'+id):''); await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); alert('Išsaugota'); localStorage.removeItem('editCar'); nav('/'); }
 return (<div className='p-4'><Back/><h3>{id?'Redaguoti':'Sukurti naują'}</h3><form onSubmit={submit}><input className='border p-2 block mb-2' value={form.idPlate} onChange={e=>setForm({...form,idPlate:e.target.value})} placeholder='V. Nr.'/><input className='border p-2 block mb-2' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder='Pavadinimas'/><select className='border p-2 block mb-2' value={form.class} onChange={e=>setForm({...form,class:e.target.value})}><option>EKONOMINĖ KLASĖ</option><option>VIDUTINĖ KLASĖ</option><option>SUV</option><option>LIMUZINAI</option><option>PROGINIAI</option><option>KELEIVINIAI MIKROAUTOBUSAI</option><option>KROVININIAI</option><option>PRIEKABOS</option><option>KĖDUTĖS VAIKAMS</option><option>NARVAI AUGINTINIAMS</option></select><input type='number' className='border p-2 block mb-2' value={form.year} onChange={e=>setForm({...form,year:Number(e.target.value)})}/><input type='number' className='border p-2 block mb-2' value={form.pricePerDay} onChange={e=>setForm({...form,pricePerDay:Number(e.target.value)})}/><input className='border p-2 block mb-2' placeholder='Nuotraukos URL' value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/><label className='block mb-2'><input type='checkbox' checked={form.withHook} onChange={e=>setForm({...form,withHook:e.target.checked})}/> Su kabliu</label><textarea className='border p-2 block mb-2' value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder='Aprašymas'></textarea><button className='btn' type='submit'>Išsaugoti</button></form></div>) }

export default function App(){ const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')||'null')); useEffect(()=>setUser(JSON.parse(localStorage.getItem('user')||'null')),[]); const isAdmin=user?.isAdmin; return (<BrowserRouter><Header user={user} setUser={setUser} /><Routes><Route path='/' element={<Home user={user} isAdmin={isAdmin} />} /><Route path='/cars/:id' element={<CarDetails/>} /><Route path='/login' element={<Login setUser={setUser}/>} /><Route path='/register' element={<Register/>} /><Route path='/myreservations' element={<MyReservations/>} /><Route path='/users' element={<AdminUsers/>} /><Route path='/allreservations' element={<AdminReservations/>} /><Route path='/create' element={<CreateEdit/>} /><Route path='/edit/:id' element={<CreateEdit/>} /><Route path='/apie' element={<div className='p-4'><Back/><h2>Apie mus</h2><p>Įmonės aprašymas...</p></div>} /></Routes><footer className='footer text-white flex justify-between px-4'><div>Kontaktai | Susisiekti</div><div>Įmonės rekvizitai</div></footer></BrowserRouter>)}
