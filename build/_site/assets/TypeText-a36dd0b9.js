import{r as s,j as r}from"./index-68eacab0.js";import{u as b}from"./useWindowSize-d3456f55.js";function N(x){const[o,d]=s.exports.useState(0),[c,u]=s.exports.useState(0),[f,h]=s.exports.useState(0),[m,g]=s.exports.useState(),[T,p]=s.exports.useState(x.start==null?!1:!x.start),i=x.text,l=s.exports.useRef(),[j,S]=s.exports.useState(0),[y,v]=s.exports.useState(0),w=b();s.exports.useEffect(()=>{T||W().then(e=>{g(e)})},[f]),s.exports.useEffect(()=>{x.start!==void 0&&p(!x.start)},[x.start]),s.exports.useEffect(()=>{l.current&&(S(l.current.clientWidth),v(l.current.clientHeight))},[w,l.current]),s.exports.useEffect(()=>{d(0),u(0);const e=setInterval(()=>{h(n=>n+1)},50);return()=>clearInterval(e)},[]);function E(){let e=i.map((n,t)=>r.exports.jsx("span",{className:n.class,children:n.text},t));return e.push(r.exports.jsx("span",{children:"|"},"_")),r.exports.jsx("span",{children:e})}function I(e){return new Promise((n,t)=>{p(!0),setTimeout(()=>{p(!1),n("done")},e)})}async function W(){let e=[];for(let t=0;t<i.length;t++)if(t<o)e.push(i[t]);else if(t==o){let a={...i[t]};a.text=a.text.slice(0,c),a.text[c-2]==="."&&await I(300),u(c+1),c==i[t].text.length&&(d(o+1),u(0)),e.push(a)}o==i.length?e.push({class:[],text:f%20>10&&x.blinkingCursor!=!1?"_":""}):e.push({class:[],text:"_"});let n=e.map((t,a)=>r.exports.jsx("span",{className:t.class,children:t.text},a));return r.exports.jsx("span",{children:n})}return r.exports.jsxs(r.exports.Fragment,{children:[r.exports.jsx("span",{className:"text-2xl md:text-5xl xl:text-3xl py-4 absolute inline-block",style:{width:j,height:y},children:m}),r.exports.jsx("p",{className:"text-2xl md:text-5xl xl:text-3xl py-4 invisible",ref:l,children:E()})]})}export{N as default};
