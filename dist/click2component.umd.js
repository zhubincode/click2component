(function(h,v){typeof exports=="object"&&typeof module<"u"?module.exports=v():typeof define=="function"&&define.amd?define(v):(h=typeof globalThis<"u"?globalThis:h||self,h.click2component=v())})(this,function(){"use strict";const h=[{name:"VS Code",protocol:"vscode://file",icon:"📝"},{name:"Cursor",protocol:"cursor://file",icon:"✨"},{name:"Trae",protocol:"trae://file",icon:"🚀"}],v="click2component_editor",D={enabled:!0,key:"Alt",defaultEditor:"vscode"};function H(e){return"__vue__"in e}function j(e){return"__vueParentComponent"in e}function K(e,t){var c,s,a,l,p,g,b,w,E,C,T,L;const n=(s=(c=e==null?void 0:e.__source)==null?void 0:c.start)==null?void 0:s.line,i=(p=(l=(a=e==null?void 0:e.__vnode)==null?void 0:a.loc)==null?void 0:l.start)==null?void 0:p.line;if(e.childNodes.length>0){let r,f=1/0;for(const o of Array.from(e.childNodes)){const _=(g=o.getBoundingClientRect)==null?void 0:g.call(o);if(_){const y=Math.abs(_.top+_.height/2-t);let u;o.nodeType===Node.TEXT_NODE&&((b=o.textContent)!=null&&b.trim())?u=(E=(w=o==null?void 0:o.__source)==null?void 0:w.start)==null?void 0:E.line:o.nodeType===Node.ELEMENT_NODE&&(u=(L=(T=(C=o==null?void 0:o.__vnode)==null?void 0:C.loc)==null?void 0:T.start)==null?void 0:L.line),u&&y<f&&(f=y,r=u)}}if(r!==void 0)return r}return i||n}function $(e,t){var g,b,w,E,C,T,L;let n=e;const i=[];let c=0;const s=r=>r?r.includes("node_modules"):!1,a=r=>{var _,y,u,I,S,N,M;const f=(u=(y=(_=r==null?void 0:r.__vnode)==null?void 0:_.loc)==null?void 0:y.start)==null?void 0:u.line;if(f)return f;const o=(M=(N=(S=(I=r==null?void 0:r.__vnode)==null?void 0:I.componentOptions)==null?void 0:S.Ctor)==null?void 0:N.options)==null?void 0:M.__file;if(o){const R=o.match(/:(\d+)$/);if(R)return parseInt(R[1],10)}};for(;n;){const r=n.getBoundingClientRect(),f=Math.abs(r.top+r.height/2-t);if(j(n)&&n.__vueParentComponent){let o=n.__vueParentComponent;for(;o;){if((g=o==null?void 0:o.type)!=null&&g.__file){const _=K(n,t),y=a(n),u=o.type.__file;i.push({instance:o,line:y||((w=(b=o.type.__loc)==null?void 0:b.start)==null?void 0:w.line),textLine:_,depth:c,distance:f,isThirdParty:s(u)})}if(!(o!=null&&o.parent))break;o=o.parent,c++}}if(H(n)&&n.__vue__){const o=n.__vue__,_=K(n,t),y=a(n),u=o.__file||((E=o.$options)==null?void 0:E.__file);i.push({instance:o,line:y||((L=(T=(C=o.$options)==null?void 0:C.__loc)==null?void 0:T.start)==null?void 0:L.line),textLine:_,depth:c,distance:f,isThirdParty:s(u)})}n=n.parentElement,c++}if(i.length===0)return null;i.sort((r,f)=>r.depth!==f.depth?r.depth-f.depth:r.isThirdParty!==f.isThirdParty?r.isThirdParty?1:-1:(r.distance||1/0)-(f.distance||1/0));const l=i.filter(r=>{var f,o;return r.instance.__file||((f=r.instance.type)==null?void 0:f.__file)||((o=r.instance.$options)==null?void 0:o.__file)});if(l.length===0)return null;const p=l[0];return{instance:p.instance,line:p.textLine||p.line}}function B(e,t=""){e.setAttribute("vue-click-to-component-target",t)}function P(e){let t;e?t=document.querySelectorAll(`[vue-click-to-component-target="${e}"]`):t=document.querySelectorAll("[vue-click-to-component-target]"),t.forEach(n=>{n.removeAttribute("vue-click-to-component-target")})}const z=e=>{const t=document.createElement("a");t.href=e,t.click()};function O(e,t){const n=localStorage.getItem(v);if(!n){window.__click2component_pending_file=e,k=null,A(!0);return}const i=h.find(a=>a.name.toLowerCase()===n.toLowerCase());if(!i){console.warn(`不支持的编辑器: ${n}`);return}const c=e.startsWith("/")?e:`/${e}`;let s=`${i.protocol}${c}`;t&&(i.name.toLowerCase()==="vscode"?s+=`:${t}`:i.name.toLowerCase()==="cursor"&&(s+=`:${t}:1`)),z(s)}const G=`
<style type="text/css" key="vue-click-to-component-style">
  [vue-click-to-component] * {
    pointer-events: auto !important;
  }

  [vue-click-to-component-target] {
    cursor: pointer !important;
    outline: 2px solid #1890ff !important;
    outline-offset: 2px !important;
    background-color: rgba(24, 144, 255, 0.1) !important;
    transition: all 0.2s ease-in-out !important;
  }

  [vue-click-to-component-target]:hover {
    outline-color: #40a9ff !important;
    background-color: rgba(24, 144, 255, 0.2) !important;
  }

  [vue-click-to-component-target="hover"] {
    outline-style: dashed !important;
  }

  .click2component-path-tooltip {
    position: fixed;
    top: 0;
    left: 0;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 0 0 4px 0;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    color: #fff;
    pointer-events: none !important;
    max-width: 800px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
  }

  .click2component-path-tooltip .path-middle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 20px;
  }

  .click2component-path-tooltip .path-end {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
</style>`;let d=null,k=null,m=null;function U(){if(d)return d;d=document.createElement("div"),Object.assign(d.style,{position:"fixed",top:"20px",right:"20px",padding:"12px",background:"#fff",borderRadius:"6px",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.15)",zIndex:"9999",display:"flex",flexDirection:"column",gap:"8px"});const e=document.createElement("div");e.textContent="选择编辑器",e.style.fontWeight="bold",e.style.marginBottom="8px",d&&d.appendChild(e),h.forEach(n=>{const i=document.createElement("button");i.textContent=`${n.icon||""} ${n.name}`,Object.assign(i.style,{padding:"6px 12px",border:"1px solid #ddd",borderRadius:"4px",background:k===n.name.toLowerCase()?"#e6f7ff":"#fff",cursor:"pointer",marginBottom:"8px"}),i.addEventListener("click",()=>{k=n.name.toLowerCase(),d&&h.forEach((c,s)=>{const a=d==null?void 0:d.children[s+1];a.tagName==="BUTTON"&&(a.style.background="#fff")}),i.style.background="#e6f7ff"}),d&&d.appendChild(i)});const t=document.createElement("button");return t.textContent="确定",Object.assign(t.style,{padding:"6px 12px",border:"1px solid #1890ff",borderRadius:"4px",background:"#1890ff",color:"#fff",cursor:"pointer",width:"100%"}),t.addEventListener("click",()=>{k&&(localStorage.setItem(v,k),A(!1),h.find(i=>i.name.toLowerCase()===k)&&window.__click2component_pending_file&&(O(window.__click2component_pending_file),window.__click2component_pending_file=null))}),d&&(d.appendChild(t),document.body.appendChild(d)),d}function A(e){const t=U();t.style.display=e?"flex":"none"}function V(e){if(m&&(m.remove(),m=null),!e)return;m=document.createElement("div"),m.className="click2component-path-tooltip";const t=e.split("/"),n=t.pop()||"",i=t.join("/");m.innerHTML=`
    <span class="path-middle">${i}/</span>
    <span class="path-end">${n}</span>
  `,document.body.appendChild(m)}function x(){m&&(m.remove(),m=null)}function W(e,t){var s,a;if(!t.enabled)return;if(P("hover"),!(t.key==="Alt"||t.key==="Option"?e.altKey:t.key==="Shift"?e.shiftKey:t.key==="Control"?e.ctrlKey:t.key==="Meta"?e.metaKey:e.altKey)){document.body.removeAttribute("vue-click-to-component"),x();return}document.body.setAttribute("vue-click-to-component","");const i=e.target,c=$(i,e.clientY);if(c){const{instance:l}=c,p=l.__file||((s=l.type)==null?void 0:s.__file)||((a=l.$options)==null?void 0:a.__file);B(i,"hover"),p&&V(p)}else x()}window.__click2component_pending_file=null;function q(e,t){var p,g;if(!(t!=null&&t.enabled)||!(t.key==="Alt"||t.key==="Option"?e.altKey:t.key==="Shift"?e.shiftKey:t.key==="Control"?e.ctrlKey:t.key==="Meta"?e.metaKey:e.altKey)||(e==null?void 0:e.button)!==0)return;const i=e.target,c=$(i,e.clientY);if(!c)return;e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation();const{instance:s,line:a}=c,l=s.__file||((p=s.type)==null?void 0:p.__file)||((g=s.$options)==null?void 0:g.__file);l&&(console.log("[Click2Component] 跳转到:",{file:l,line:a||1}),O(l,a))}function Y(e,t={}){const n={...D,...t};if(!n.enabled)return;let i=!1;const c=()=>{if(i)return;document.head.insertAdjacentHTML("beforeend",G);const s=l=>q(l,n),a=l=>W(l,n);document.addEventListener("click",s,!0),document.addEventListener("mousemove",a,!0),window.addEventListener("keydown",l=>{(n.key==="Alt"||n.key==="Option"?l.altKey:n.key==="Shift"?l.shiftKey:n.key==="Control"?l.ctrlKey:n.key==="Meta"?l.metaKey:l.altKey)||x()}),window.addEventListener("keyup",()=>{P(),document.body.removeAttribute("vue-click-to-component"),x()}),window.addEventListener("blur",()=>{P(),document.body.removeAttribute("vue-click-to-component"),x()}),i=!0};c(),e.mixin({mounted(){c()}}),e.config.globalProperties.$router&&e.config.globalProperties.$router.afterEach(()=>{setTimeout(c,0)})}return{install:Y}});
