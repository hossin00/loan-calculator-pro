import { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
const AC='#34d399';
export default function App() {
  const [amount,setAmount]=useState(''); const [rate,setRate]=useState(''); const [years,setYears]=useState(''); const [tab,setTab]=useState<'calc'|'schedule'>('calc');
  const a=parseFloat(amount)||0; const r=parseFloat(rate)||0; const y=parseInt(years)||0;
  const n=y*12; const mr=r/100/12;
  const emi=n>0&&mr>0?a*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1):n>0?a/n:0;
  const totalPay=emi*n; const totalInt=totalPay-a;
  const schedule=useMemo(()=>{
    if(!emi||!n)return[];
    let bal=a; const rows=[];
    for(let i=1;i<=Math.min(n,60);i++){
      const int=bal*mr; const prin=emi-int; bal-=prin;
      rows.push({month:i,emi,int,prin,bal:Math.max(0,bal)});
    }
    return rows;
  },[emi,n,a,mr]);
  const inp={width:'100%',background:'#081408',border:'1px solid #143320',borderRadius:'10px',padding:'12px 14px',color:'white',fontSize:'16px',fontWeight:'600',outline:'none',fontFamily:'Inter'};
  const fmt=(v:number)=>v>=1e6?`$${(v/1e6).toFixed(2)}M`:v>=1e3?`$${(v/1e3).toFixed(1)}k`:`$${v.toFixed(0)}`;
  return (
    <div style={{minHeight:'100vh',background:'#080f0a',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #143320',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`linear-gradient(135deg,${AC},#059669)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 14px ${AC}30`}}><TrendingUp size={16} color="white"/></div>
        <div style={{fontWeight:'700',fontSize:'16px',color:'white'}}>Loan Calculator Pro</div>
      </header>
      <div style={{display:'flex',padding:'0 20px',borderBottom:'1px solid #143320'}}>
        {(['calc','schedule'] as const).map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:'10px 16px',fontSize:'12px',fontWeight:'600',borderBottom:`2px solid ${tab===t?AC:'transparent'}`,color:tab===t?AC:'#065f46',background:'none',border:'none',borderBottomWidth:'2px',borderBottomStyle:'solid',cursor:'pointer',fontFamily:'Inter',textTransform:'capitalize'}}>{t==='calc'?'Calculator':'Amortization'}</button>)}
      </div>
      <div style={{flex:1,overflow:'auto',padding:'16px 20px'}}>
        {tab==='calc'&&<div style={{maxWidth:'420px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'12px'}}>
          {[['Loan Amount ($)',amount,setAmount,'e.g. 300000'],['Annual Interest Rate (%)',rate,setRate,'e.g. 6.5'],['Loan Term (Years)',years,setYears,'e.g. 30']].map(([l,v,s,p])=>(
            <div key={l as string}>
              <div style={{fontSize:'12px',color:'#065f46',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>{l as string}</div>
              <input type="number" value={v as string} onChange={e=>(s as (v:string)=>void)(e.target.value)} placeholder={p as string} style={inp} onFocus={e=>e.target.style.borderColor=AC} onBlur={e=>e.target.style.borderColor='#143320'}/>
            </div>
          ))}
          {emi>0&&<div style={{background:'linear-gradient(135deg,#052e1c,#064e3b)',borderRadius:'16px',padding:'20px',border:`1px solid ${AC}20`,marginTop:'8px'}}>
            <div style={{textAlign:'center',marginBottom:'16px'}}>
              <div style={{fontSize:'12px',color:'#6ee7b7',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'4px'}}>Monthly Payment</div>
              <div style={{fontSize:'44px',fontWeight:'700',color:AC}}>${emi.toFixed(2)}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
              {[['Principal',fmt(a),'#6ee7b7'],['Total Interest',fmt(totalInt),'#f87171'],['Total Cost',fmt(totalPay),'white']].map(([l,v,c])=>(
                <div key={l as string} style={{textAlign:'center'}}>
                  <div style={{fontSize:'16px',fontWeight:'700',color:String(c)}}>{v as string}</div>
                  <div style={{fontSize:'10px',color:'#065f46',marginTop:'2px'}}>{l as string}</div>
                </div>
              ))}
            </div>
            <div style={{height:'8px',background:'#052e1c',borderRadius:'4px',overflow:'hidden',marginTop:'14px'}}>
              <div style={{width:`${totalPay>0?a/totalPay*100:0}%`,height:'100%',background:AC,borderRadius:'4px'}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'#065f46',marginTop:'4px'}}>
              <span>Principal {totalPay>0?(a/totalPay*100).toFixed(0):0}%</span>
              <span>Interest {totalPay>0?(totalInt/totalPay*100).toFixed(0):0}%</span>
            </div>
          </div>}
        </div>}
        {tab==='schedule'&&<div style={{maxWidth:'600px',margin:'0 auto'}}>
          {schedule.length===0?<div style={{textAlign:'center',padding:'40px 20px'}}><div style={{fontSize:'40px',marginBottom:'12px'}}>🏦</div><p style={{color:'#065f46',fontSize:'14px'}}>Enter loan details in Calculator tab first.</p></div>:(
            <div style={{overflowX:'auto'}}>
              {n>60&&<p style={{fontSize:'12px',color:'#065f46',marginBottom:'10px',textAlign:'center'}}>Showing first 5 years of {y}-year schedule</p>}
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                <thead><tr style={{background:'#0a140a'}}>
                  {['Month','Payment','Interest','Principal','Balance'].map(h=><th key={h} style={{padding:'8px 10px',color:'#065f46',fontWeight:'600',textAlign:'right',borderBottom:'1px solid #143320'}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {schedule.map(r=><tr key={r.month} style={{borderBottom:'1px solid #0a140a'}}>
                    {[r.month,`$${r.emi.toFixed(0)}`,`$${r.int.toFixed(0)}`,`$${r.prin.toFixed(0)}`,`$${r.bal.toFixed(0)}`].map((v,i)=><td key={i} style={{padding:'8px 10px',color:i===0?'#065f46':i===2?'#f87171':i===3?AC:'white',textAlign:'right'}}>{v}</td>)}
                  </tr>)}
                </tbody>
              </table>
            </div>
          )}
        </div>}
      </div>
    </div>
  );
}