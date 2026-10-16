import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Clock3, Copy, Heart, MapPin, Music2, Pause, Play, Send, Share2, Sparkles, Volume2, VolumeX, X, Languages, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { COPY } from './content';
import { SONG } from './musicConfig';
import { event } from './eventData';
import { WISHES_URL, DEMO_WISHES, readDemoWishes, saveDemoWish, loadOnlineWishes, submitOnlineWish } from './wishes';

const EVENT_DATE = new Date(event.startISO).getTime();
const SECTION_IDS = ['invite','couple','family','countdown','details','wishes','parents'];
const PARENTS = {
  ta: ['M. ஞானவேல் B.A. – G. உமாராணி','G. அண்ணாமலை – A. கல்பனா'],
  en: ['M. Gnanavel B.A. – G. Umarani','G. Annamalai – A. Kalpana'],
};
const safeLocalGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
const safeLocalSet = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
const formatCountdown = () => {
  const ms = Math.max(0, EVENT_DATE - Date.now());
  return { ended: ms === 0, values: [Math.floor(ms/86400000),Math.floor(ms/3600000)%24,Math.floor(ms/60000)%60,Math.floor(ms/1000)%60] };
};
function Petals({count=12}) {
  return <div className="petals" aria-hidden="true">{Array.from({length:count},(_,i)=><i key={i} style={{'--i':i,'--x':`${(i*37+17)%100}%`}}/>)}</div>;
}
function DoorIntro({t,opening,onOpen}) {
 return <div className={`anime-welcome ${opening?'leaving':''}`} role="dialog" aria-modal="true" aria-label={t.enter}><div className="welcome-card"><span className="welcome-spark">✦ ✧ ✦</span><img src="/art/anime-mother.webp" alt="Anime mother-to-be"/><p className="welcome-eyebrow">A LITTLE MIRACLE • A LOT OF LOVE</p><h1>{t.introName}</h1><p>{t.introCopy}</p><button autoFocus type="button" className="primary-btn" onClick={onOpen} disabled={opening}>{t.enter} →</button></div></div>;
}
function Next({target,t}) {return <a className="next-scene" href={`#${target}`} aria-label={t.continue}><ChevronDown size={23}/></a>;}
function Countdown({t}) {
  const [now, setNow] = useState(formatCountdown);
  useEffect(() => { const id = window.setInterval(()=>setNow(formatCountdown()),1000);return ()=>window.clearInterval(id);},[]);
  return <section id="countdown" className="scene countdown-scene" data-scene>
    <div className="count-deco">❀　✧　❀</div><p className="kicker light">{t.countKicker}</p><h2>{t.countTitle}</h2>
    {now.ended ? <p className="count-finished">{t.countDone}</p> : <div className="count-grid" aria-label={t.countTitle}>{now.values.map((n,i)=><div className="count-tile" key={i}><strong>{String(n).padStart(2,'0')}</strong><span>{t.countUnits[i]}</span></div>)}</div>}
    <p className="count-foot">{t.countWhen}</p><Next target="details" t={t}/>
  </section>;
}
function Dialog({title,children,onClose}) {
  const close = useRef(null);
  useEffect(()=>{const esc=e=>{if(e.key==='Escape')onClose();};document.addEventListener('keydown',esc);const previous=document.body.style.overflow;document.body.style.overflow='hidden';close.current?.focus();return()=>{document.removeEventListener('keydown',esc);document.body.style.overflow=previous;};},[onClose]);
  return <div className="dialog-shade" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div role="dialog" aria-modal="true" aria-label={title} className="dialog-card"><button aria-label="Close" ref={close} type="button" className="close-btn" onClick={onClose}><X size={21}/></button>{children}</div></div>;
}
function WishCard({wish,t,onOpen}) {
  return <button className="wish-card" type="button" onClick={()=>onOpen(wish)}><span className="wish-avatar">{wish.name?.slice(0,1)||'♥'}</span><span className="wish-bloom">✿</span><strong>{wish.name}</strong><p>“{wish.message}”</p><small>{t.readWish} →</small></button>;
}
function Wishes({t,lang}) {
  const online = Boolean(WISHES_URL);
  const [wishes,setWishes] = useState(()=> online?[]:[...readDemoWishes(),...DEMO_WISHES]);
  const [loading,setLoading] = useState(online),[loadError,setLoadError] = useState(false);
  const [selected,setSelected] = useState(null),[formOpen,setFormOpen] = useState(false);
  const [name,setName] = useState(''),[message,setMessage] = useState(''),[consent,setConsent] = useState(false);
  const [sending,setSending] = useState(false),[error,setError] = useState('');
  const [toast,setToast] = useState(null),[incoming,setIncoming] = useState(null);
  const known = useRef(null),incomingTimer = useRef(null);
  const refresh = useCallback(async()=>{
    if(!online)return;
    try {const list=await loadOnlineWishes();setWishes(list);setLoadError(false);const ids=new Set(list.map(x=>x.id));if(known.current){const fresh=list.find(x=>!known.current.has(x.id));if(fresh){setIncoming(fresh);clearTimeout(incomingTimer.current);incomingTimer.current=setTimeout(()=>setIncoming(null),6500);}}known.current=ids;}
    catch{setLoadError(true);}finally{setLoading(false);}
  },[online]);
  useEffect(()=>{if(!online)return;refresh();const id=setInterval(refresh,20000);const visible=()=>{if(!document.hidden)refresh();};document.addEventListener('visibilitychange',visible);return()=>{clearInterval(id);clearTimeout(incomingTimer.current);document.removeEventListener('visibilitychange',visible);};},[online,refresh]);
  async function sendWish(e){
    e.preventDefault();if(sending)return;
    const cleanName=name.trim().replace(/\s+/g,' '),cleanMessage=message.trim().replace(/\s+/g,' ');
    if(cleanName.length<2||cleanName.length>40||cleanMessage.length<6||cleanMessage.length>220){setError(t.invalid);return;}
    if(!consent){setError(t.needConsent);return;}
    if(Date.now()-Number(safeLocalGet('jeevitha-last-wish-at')||0)<30000){setError(t.wait);return;}
    const wish={id:`w-${Date.now()}-${Math.random().toString(36).slice(2,10)}`,name:cleanName,message:cleanMessage,createdAt:new Date().toISOString()};
    setSending(true);setError('');
    try {
      if(online){const list=await submitOnlineWish(wish);setWishes(list);known.current=new Set(list.map(w=>w.id));}
      else{setWishes([...saveDemoWish(wish),...DEMO_WISHES]);}
      safeLocalSet('jeevitha-last-wish-at',String(Date.now()));setFormOpen(false);setConsent(false);setName('');setMessage('');setToast(wish);setTimeout(()=>setToast(null),6000);
    }catch{setError(t.failed);refresh();}finally{setSending(false);}
  }
  const marquee=useMemo(()=>[...wishes,...wishes],[wishes]);
  return <section className="scene wishes-scene" id="wishes" data-scene>
    <div className="wishes-inner"><p className="kicker">{t.wishKicker}</p><h2>{t.wishTitle} <span className="pink">♡</span></h2><p className="scene-desc">{t.wishSub}</p>
      {!online&&<p className="demo-note">{t.wishDemo}</p>}
      {online&&loadError&&<p className="demo-note">{t.wishError} <button type="button" onClick={refresh}>{t.retry}</button></p>}
      <button type="button" className="primary-btn" onClick={()=>{setFormOpen(true);setError('');}}><Heart size={18}/>{t.writeWish}</button>
    </div>
    {loading?<p className="scene-desc">{t.loading}</p>:wishes.length===0?<p className="scene-desc">{t.empty}</p>:<div className="wish-viewport"><div className="wish-track">{marquee.map((w,i)=><WishCard key={`${w.id}-${i}`} wish={w} t={t} onOpen={setSelected}/>)}</div></div>}
    <small className="wish-instructions">{t.wishSwipe}</small>
    <Next target="parents" t={t}/>
    {formOpen&&<Dialog title={t.wishModalTitle} onClose={()=>!sending&&setFormOpen(false)}><div className="dialog-flower">💌</div><p className="kicker">{t.wishModalKicker}</p><h3>{t.wishModalTitle}</h3><form className="wish-form" onSubmit={sendWish}>
      <label htmlFor="guest-name">{t.nameLabel}</label><input id="guest-name" name="guest-name" autoComplete="name" placeholder={t.namePlaceholder} maxLength="40" value={name} onChange={e=>setName(e.target.value)} required/>
      <label htmlFor="guest-message">{t.messageLabel}</label><textarea id="guest-message" name="guest-message" rows="4" placeholder={t.messagePlaceholder} maxLength="220" value={message} onChange={e=>setMessage(e.target.value)} required/>
      <small className="chars">{message.length}/220</small><label className="agree"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{t.privacy}</span></label>
      {error&&<p role="alert" className="form-error">{error}</p>}<button type="submit" disabled={sending} className="primary-btn full"><Send size={18}/>{sending?t.sending:t.send}</button>
    </form></Dialog>}
    {selected&&<Dialog title={selected.name} onClose={()=>setSelected(null)}><div className="dialog-flower">🌷</div><p className="kicker">{t.readWish}</p><h3>{selected.name}</h3><p className="full-wish">“{selected.message}”</p><button className="outline-btn" onClick={()=>setSelected(null)}>{t.close}</button></Dialog>}
    {incoming&&<div role="status" className="toast incoming-toast"><span>✨ {t.newWish}</span><button onClick={()=>{setSelected(incoming);setIncoming(null);}} type="button"><strong>{incoming.name}</strong> · {incoming.message.slice(0,80)}…</button><button type="button" aria-label="Dismiss" className="toast-x" onClick={()=>setIncoming(null)}>×</button></div>}
    {toast&&<div role="status" className="toast"><span>🌸 ✨ 💗</span><strong>{t.thanks}, {toast.name}!</strong><small>{t.success}</small>{!online&&<small>{t.wishDemo}</small>}</div>}
  </section>;
}
function MusicPlayer({t}) {
 const audio=useRef(null);const [playing,setPlaying]=useState(false),[error,setError]=useState('');
 const [muted,setMuted]=useState(false);
 useEffect(()=>{const start=()=>{audio.current?.play().catch(()=>{});};window.addEventListener('invitation-start-music',start);return()=>window.removeEventListener('invitation-start-music',start);},[]);
 async function toggle(){if(!audio.current)return;if(playing){audio.current.pause();return}try{await audio.current.play();setError('')}catch{setError(document.documentElement.lang==='ta'?'இசையை இயக்க Play அழுத்தவும்.':'Tap Play to start the music.')}}
 return <><audio ref={audio} src={SONG.src} loop preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/><div className="music-dock"><button className="music-action" onClick={toggle} aria-label={playing?t.musicStop:t.musicPlay}>{playing?<Pause size={18}/>:<Play size={18}/>}</button><div className="music-meta"><strong>♫ {t.music}</strong></div><button type="button" className="mute-action" aria-label={muted?t.unmute:t.mute} onClick={()=>{if(audio.current){audio.current.muted=!muted;setMuted(!muted)}}}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button></div>{error&&<div className="audio-error" role="status" onClick={()=>setError('')}>{error}</div>}</>;
}
function saveCalendar(lang) {
  const title=lang==='en'?'Baby Shower & Seemantham — Jeevitha & Muthukumar':event.title;
  const text=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//SRINUMA//Invitation//EN\r\nBEGIN:VEVENT\r\nUID:jeevitha-babyshower-20261019@srinuma\r\nDTSTAMP:20261016T000000Z\r\nDTSTART:20261019T063000Z\r\nDTEND:20261019T093000Z\r\nSUMMARY:${title}\r\nDESCRIPTION:Jeevitha and Muthukumar - From 12pm onwards\r\nLOCATION:SS Mahal, Appavu Nagar, Thally Road, Hosur\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
  const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'}));link.download='Jeevitha-Baby-Shower.ics';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),2000);
}
function App() {
  const [lang,setLang] = useState(()=>safeLocalGet('invitation-language')==='en'?'en':'ta');
  const t=COPY[lang];const [opened,setOpened]=useState(false),[opening,setOpening]=useState(false),[active,setActive]=useState('invite');
  const [shareMessage,setShareMessage]=useState('');
  const maps=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.addressForMaps)}`;
  useEffect(()=>{document.documentElement.lang=lang;safeLocalSet('invitation-language',lang);},[lang]);
  useEffect(()=>{if(opened)return;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;};},[opened]);
  const openDoor=()=>{if(opening)return;setOpening(true);window.dispatchEvent(new Event('invitation-start-music'));setTimeout(()=>{setOpened(true);window.scrollTo({top:0,behavior:'instant'});},420);};
  useEffect(()=>{
    if(!opened)return;
    const sections=[...document.querySelectorAll('[data-scene]')];
    if(!('IntersectionObserver'in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){sections.forEach(el=>el.classList.add('shown'));return;}
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('shown');}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    const nav=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);}),{rootMargin:'-28% 0px -55% 0px'});
    sections.forEach(el=>{reveal.observe(el);nav.observe(el);});return()=>{reveal.disconnect();nav.disconnect();};
  },[opened]);
  const share=async()=>{const data={title:lang==='ta'?'வளைகாப்பு & சீமந்த விழா':'Baby Shower & Seemantham',text:`${t.wife} & ${t.husband} · ${t.date} · ${t.hall}`,url:window.location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(`${data.text}\n${data.url}`);setShareMessage(t.copied);setTimeout(()=>setShareMessage(''),4000);}}catch(e){if(e?.name!=='AbortError')setShareMessage(t.shareFail);}};
  const navTo=SECTION_IDS.map((id,i)=>({id,label:t.nav[i]}));
  return <div className={`invitation-root ${opened?'is-open':'not-open'}`}>
    {!opened&&<DoorIntro opening={opening} onOpen={openDoor} t={t}/>}
    <div className="main-app">
      <header className="topbar"><a className="site-brand" href="#invite">✿ <span>{lang==='ta'?'அன்பின் அழைப்பு':'You’re invited'}</span></a><nav className="top-links"><a href="#details">{t.nav[4]}</a><a href="#wishes">{t.nav[5]}</a></nav><button className="language-btn" type="button" onClick={()=>setLang(v=>v==='ta'?'en':'ta')}><Languages size={16}/>{t.langButton}</button></header>
      <nav className="scene-dots" aria-label="Invitation sections">{navTo.map(x=><a key={x.id} href={`#${x.id}`} title={x.label} aria-label={x.label} className={active===x.id?'active':''}><i/><span>{x.label}</span></a>)}</nav>
      <main>
        <section className="scene hero-scene" id="invite" data-scene><Petals/><div className="hero-blossom">🌺　🌿　🌸　🌿　🌺</div><div className="hero-grid">
          <div className="hero-art"><img src="/art/anime-mother.webp" alt="Semi-realistic anime artwork of a pregnant Tamil woman wearing a pink silk sari" fetchPriority="high"/></div>
          <div className="hero-text"><p className="prayer">{t.prayer1}<br/>{t.prayer2}</p><p className="kicker">{t.heroTag}</p><h1>{t.title1}<br/><em>{t.title2}</em></h1><span className="ornate-divider">❀ ━━━━━ ❀</span><p className="invite-intro">{t.introCopy}</p><div className="hero-names"><strong>{t.wife}</strong><span>&amp;</span><strong>{t.husband}</strong></div><p className="invite-copy">{t.inviteCopy}</p><div className="hero-date">📅 {t.date} · {t.time}</div><a className="outline-btn" href="#details">{t.detailsTitle} ↓</a></div>
        </div><Next target="couple" t={t}/></section>
        <section className="scene photo-scene couple-scene" id="couple" data-scene><Petals count={6}/><div className="photo-copy"><p className="kicker">{t.coupleKicker}</p><h2>{t.coupleTitle}</h2><p>{t.coupleCopy}</p><strong>{t.introName}</strong></div><figure className="photo-frame"><img src="/art/anime-couple.webp" alt="Semi-realistic anime portrait of the expectant couple" loading="lazy"/></figure><Next target="family" t={t}/></section>
        <section className="scene photo-scene family-scene" id="family" data-scene><div className="family-photo"><img src="/art/family-cinematic.webp" loading="lazy" alt="Warm cinematic semi-realistic anime scene of mother, father and loving Tamil family"/></div><div className="family-caption"><p className="kicker">{t.familyKicker}</p><h2>{t.familyTitle}</h2><p>{t.familyCopy}</p><strong>♥ {t.familyBadge}</strong></div><Next target="countdown" t={t}/></section>
        <Countdown t={t}/>
        <section id="details" className="scene details-scene" data-scene><p className="kicker">{t.detailsKicker}</p><h2>{t.detailsTitle}</h2><div className="ornate-divider">❀ ━━━━━ ❀</div><div className="detail-grid">
          <article className="detail-box"><CalendarDays size={29}/><span>{t.labelDay}</span><strong>{t.date}</strong><small>{t.weekday}</small></article>
          <article className="detail-box"><Clock3 size={29}/><span>{t.labelTime}</span><strong>{t.time}</strong></article>
          <article className="detail-box venue-box"><MapPin size={30}/><span>{t.labelVenue}</span><strong>{t.hall}</strong><p>{t.address1}<br/>{t.address2}<br/>{t.address3}</p></article>
        </div><div className="detail-ctas"><a className="primary-btn" href={maps} target="_blank" rel="noreferrer noopener"><MapPin size={18}/>{t.directions}</a><button className="outline-btn" onClick={()=>saveCalendar(lang)} type="button"><CalendarDays size={18}/>{t.calendar}</button></div><Next target="wishes" t={t}/></section>
        <Wishes t={t} lang={lang}/>
        <section className="scene parents-scene" id="parents" data-scene><div className="parents-flowers">🌷 🌸 🌼 🌸 🌷</div><p className="kicker">{t.parentsKicker}</p><h2>{t.shareTitle}</h2><div className="parents-names">{PARENTS[lang].map(x=><strong key={x}>{x}</strong>)}</div><div className="flower-ornament">❀　♥　❀</div><p className="scene-desc">{t.shareSub}</p><button className="primary-btn" onClick={share} type="button"><Share2 size={18}/>{t.shareButton}</button>{shareMessage&&<p className="share-message" role="status"><Copy size={15}/>{shareMessage}</p>}<p className="footer-love">{t.footer}</p></section>
      </main>
      <footer><div className="srinuma-card"><small>Presented by</small><svg className="srinuma-original-icon" viewBox="65 15 670 668" role="img" aria-label="Original SRINUMA icon"><image href="/brand/srinuma-original.png" x="0" y="0" width="2048" height="683"/></svg><strong>SRINUMA</strong><span>Digital Solutions</span><a href="tel:+918148902247">+91 81489 02247</a><a href="mailto:srinumadigitalsolutions@gmail.com">srinumadigitalsolutions@gmail.com</a></div></footer>
      <MusicPlayer t={t}/>
    </div>
    {!opened&&<button className="intro-language" type="button" onClick={()=>setLang(l=>l==='ta'?'en':'ta')}><Languages size={16}/>{t.langButton}</button>}
  </div>;
}
export default App;
