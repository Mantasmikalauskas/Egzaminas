import React,{useEffect,useState,useContext} from 'react'; import API from '../api'; import { Link } from 'react-router-dom'; import Header from '../components/Header'; import { AuthContext } from '../context/AuthContext';
const classes = ['EKONOMINĖ KLASĖ','VIDUTINĖ KLASĖ','LIMUZINAI','KROVININIAI'];
export default function Home(){
  const [cars,setCars]=useState([]); const [filter,setFilter]=useState(''); const {user} = useContext(AuthContext);
  useEffect(()=>{ API.get('/cars').then(r=>setCars(r.data)).catch(()=>{}); },[]);
  const filtered = filter ? cars.filter(c=>c.carClass===filter) : cars;
  return (<div className='page'><Header /><div className='content'><aside className='left'><h3>Klasės</h3>{user?.role==='admin' && <Link to='/admin/add' className='btn'>pridėti naują</Link>}{classes.map(cl=> (<div key={cl} className={'filter-card'+(filter===cl?' active':'')} onClick={()=>setFilter(filter===cl?'':cl)}>{cl}</div>))}</aside><main className='main'><div className='cards'>{filtered.map(c=>(<div key={c._id} className='car-card'><img src={c.image||'/placeholder.png'} alt='' /><div className='car-info'><div className='car-class'>{c.carClass}</div><h4>{c.make} {c.model}</h4><div>{c.year}</div><div>{c.pricePerDay} €/day</div><Link to={'/cars/'+c._id} className='details'>Peržiūrėti</Link></div></div>))}</div></main></div><footer className='footer'>Kontaktai</footer></div>);
}