import React from 'react';

function Flower({ x, y, radius = 30, color = '#e38e9f', rotation = 0, petals = 7 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`} className="svg-flower">
      {Array.from({ length: petals }, (_, i) => (
        <ellipse key={i} cx="0" cy={-radius * .64} rx={radius * .43} ry={radius * .75}
          transform={`rotate(${i * 360 / petals})`} fill={color} stroke="#fff8e9" strokeWidth="1.4" opacity={i % 2 ? .91 : 1} />
      ))}
      <circle r={radius * .28} fill="#b97842" />
      <circle r={radius * .13} fill="#ffedb6" />
    </g>
  );
}

export function FlowerBranch({ side = 'left' }) {
  return (
    <svg className={`flower-branch flower-branch--${side}`} viewBox="0 0 450 380" fill="none" aria-hidden="true">
      <path d="M-28 -10 C68 66 96 67 142 131 S239 195 308 141" stroke="#567454" strokeWidth="5" opacity=".7" />
      <path d="M26 -10 C30 61 88 106 92 202 C91 227 84 259 67 277" stroke="#617853" strokeWidth="3" />
      <path d="M90 -10 C120 87 195 65 212 188 C217 227 213 250 215 260" stroke="#7b8c55" strokeWidth="3" />
      {[
        [22,48,-39],[70,66,45],[116,97,-42],[159,117,41],[205,143,-46],[258,158,45],
        [45,147,32],[82,175,-31],[191,190,32],[222,220,-29],[293,135,-46]
      ].map(([x,y,ang], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="34" transform={`rotate(${ang} ${x} ${y})`} fill={i%2?'#63875e':'#85a077'} opacity=".94" />)}
      <Flower x={26} y={19} radius={55} color="#ea9b97" petals={9} />
      <Flower x={115} y={23} radius={40} color="#f8c56b" petals={9} rotation={7} />
      <Flower x={186} y={69} radius={34} color="#f3b5a7" petals={8} />
      <Flower x={59} y={125} radius={26} color="#f7d19a" petals={8} />
      <Flower x={289} y={132} radius={28} color="#e4a6b8" petals={9} />
      <g className="marigold" transform="translate(93 197)">
        <path d="M0 0 L0 75" stroke="#c99138" strokeWidth="2" />
        {Array.from({length:8},(_,i)=><circle key={i} cx={i%2?3:-3} cy={i*8+13} r="6" fill={i%2?'#e7a43f':'#f6c35f'} />)}
      </g>
      <g transform="translate(217 256)">
        <path d="M0 0 V40" stroke="#7e805f" strokeWidth="1.6" />
        <circle cy="54" r="17" fill="#f2b3c2" opacity=".92" />
        <path d="M-13 47 Q0 32 13 47 M-13 59 Q0 75 13 59" stroke="#e9d2a4" strokeWidth="2" />
        <path d="M-6 70 L0 76 L6 70" fill="#bc8c42" />
      </g>
    </svg>
  );
}

export function FloralDivider() {
  return (
    <div className="floral-divider" aria-hidden="true">
      <span className="divider-line" />
      <svg viewBox="0 0 80 35" width="80" height="35" fill="none">
        <path d="M5 22 Q40 0 75 22 M40 21 V9" stroke="#7f9869" strokeWidth="1.5" />
        <path d="M23 14 Q12 1 10 17 Q19 22 23 14 M57 14 Q68 1 70 17 Q61 22 57 14" fill="#78936d" />
        <path d="M40 9 C27 15 28 24 40 28 C52 24 53 15 40 9Z" fill="#e7a1ad" />
        <path d="M40 20 C30 10 26 14 31 25 L40 29 L49 25 C54 14 50 10 40 20" fill="#f3c8c0" />
        <circle cx="40" cy="22" r="3" fill="#c8a15c" />
      </svg>
      <span className="divider-line" />
    </div>
  );
}

export function ExpectantMother() {
  return (
    <svg className="mother-svg" viewBox="0 0 450 550" role="img" aria-label="இளஞ்சிவப்பு புடவையில் வளைகாப்பு விழா தாய் — அலங்கார ஓவியம்">
      <defs>
        <linearGradient id="sari" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#f6b1b8" /><stop offset=".55" stopColor="#d66d91" /><stop offset="1" stopColor="#9d476a" />
        </linearGradient>
        <linearGradient id="pallu" x1="0" x2="1"><stop stopColor="#b94b75" /><stop offset="1" stopColor="#f7c5cc" /></linearGradient>
        <radialGradient id="halo"><stop stopColor="#ffe7de" /><stop offset="1" stopColor="#fff9ef" /></radialGradient>
        <linearGradient id="skin" x1="0" x2="1"><stop stopColor="#f4c1a1" /><stop offset="1" stopColor="#d88e79" /></linearGradient>
      </defs>
      <ellipse cx="225" cy="287" rx="186" ry="225" fill="url(#halo)" />
      <path d="M78 438 Q28 273 104 158 M368 439 Q428 249 355 152" fill="none" stroke="#baac84" strokeWidth="2.5" opacity=".5" />
      <path d="M86 360 Q42 345 53 288 M75 327 Q36 319 52 275 M365 361 Q408 328 395 281 M378 333 Q419 310 411 264" stroke="#87a078" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="226" cy="514" rx="139" ry="15" fill="#b99e9f" opacity=".19" />
      {/* Hair bun and braid */}
      <ellipse cx="179" cy="161" rx="42" ry="47" fill="#2a292d" />
      <path d="M173 147 Q179 72 247 78 Q291 86 290 145 L292 236 Q264 255 246 229 L222 140Z" fill="#342d30" />
      <path d="M184 205 C145 285 188 353 153 414" stroke="#30292d" strokeWidth="27" strokeLinecap="round" fill="none" />
      {/* Main drape */}
      <path d="M209 223 C169 226 153 274 162 331 C158 399 112 466 101 512 Q227 540 344 509 C322 456 313 383 314 330 C320 253 278 219 209 223Z" fill="url(#sari)" stroke="#a65b7b" strokeWidth="3" />
      <path d="M170 317 Q170 430 132 501 Q208 515 265 508" fill="none" stroke="#fce0bb" strokeWidth="4" opacity=".88" />
      <path d="M186 316 Q187 430 164 506 M213 358 Q214 453 203 513 M247 362 Q267 442 260 512" stroke="#ffe2d1" strokeWidth="2" opacity=".45" fill="none" />
      {/* Blouse and belly */}
      <path d="M210 208 C236 226 269 225 278 219 L289 288 L184 290 L184 242Z" fill="#cf5e86" stroke="#a85374" strokeWidth="2" />
      <ellipse cx="251" cy="339" rx="70" ry="75" fill="url(#sari)" stroke="#f1adba" strokeWidth="3" />
      <path d="M193 341 Q241 386 302 347" fill="none" stroke="#efbbbf" strokeWidth="2" opacity=".85" />
      {/* Neck & face side profile */}
      <path d="M209 188 L202 233 Q226 260 251 231 L245 185Z" fill="url(#skin)" />
      <path d="M184 127 C193 91 241 94 260 132 C272 155 253 183 241 198 C225 219 198 204 188 175 Q179 162 184 127Z" fill="url(#skin)" />
      <path d="M180 139 C179 104 215 78 252 99 C275 113 273 144 269 152 C251 146 239 124 232 111 C220 132 204 139 180 139Z" fill="#28262b" />
      <path d="M188 123 C207 106 223 107 234 104" fill="none" stroke="#4c3735" strokeWidth="6" strokeLinecap="round" />
      <path d="M189 164 Q202 173 210 162 M226 167 Q233 171 241 166" fill="none" stroke="#453337" strokeWidth="2" strokeLinecap="round" />
      <path d="M203 186 Q218 191 228 184" stroke="#ad5666" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="181" cy="176" r="8" fill="none" stroke="#deb666" strokeWidth="3" />
      <path d="M201 213 Q222 227 243 210" fill="none" stroke="#fbe1b5" strokeWidth="6" strokeLinecap="round" />
      <circle cx="224" cy="225" r="6" fill="#d6b36b" />
      {/* Pallu sweeping over shoulder */}
      <path d="M202 219 Q159 236 156 293 Q164 334 136 395 Q122 425 112 460 Q150 479 173 477 C197 426 194 374 205 324 Q221 270 202 219Z" fill="url(#pallu)" stroke="#f6d29b" strokeWidth="5" />
      <path d="M173 250 Q185 284 167 356 Q158 406 131 459" stroke="#f8e0c6" strokeWidth="2.5" fill="none" opacity=".9" />
      {/* Cradling arms */}
      <path d="M280 260 Q320 276 325 310 Q321 346 279 372 Q262 384 242 371" fill="none" stroke="url(#skin)" strokeWidth="24" strokeLinecap="round" />
      <path d="M187 263 Q164 299 180 344 Q197 363 223 371 Q242 373 251 365" fill="none" stroke="url(#skin)" strokeWidth="21" strokeLinecap="round" />
      <path d="M284 361 Q269 375 250 375 M218 371 Q237 382 251 371" stroke="#d68f7d" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M300 361 L310 370 M179 341 L190 349" stroke="#ead099" strokeWidth="6" strokeLinecap="round" />
      <circle cx="309" cy="372" r="4" fill="#a66352" />
      {/* Saree border and embroidered dots */}
      <path d="M105 509 Q219 531 344 507" fill="none" stroke="#eed8b5" strokeWidth="9" />
      {Array.from({length:19},(_,i)=> <circle key={i} cx={127+i*11} cy={504+Math.sin(i/18*Math.PI)*10} r="2" fill="#fbe0b0" />)}
      <g fill="#f4cd8f" opacity=".9">
        <circle cx="137" cy="432" r="4" /><circle cx="153" cy="422" r="3" /><circle cx="281" cy="463" r="4" /><circle cx="297" cy="477" r="3" />
      </g>
      <g transform="translate(332 180)"><path d="M0 0 C10 -18 25 -18 34 0 C22 5 10 13 0 0" fill="#d7a2aa"/><path d="M0 0 C-12 -12 -20 -8 -19 3 C-10 10 0 6 0 0" fill="#efa7b2"/></g>
    </svg>
  );
}
