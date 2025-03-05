(function(_,h){typeof exports=="object"&&typeof module<"u"?module.exports=h():typeof define=="function"&&define.amd?define(h):(_=typeof globalThis<"u"?globalThis:_||self,_.click2component=h())})(this,function(){"use strict";const _=[{name:"VS Code",protocol:"vscode://file",icon:"📝"},{name:"Cursor",protocol:"cursor://file",icon:"✨"}],h="click2component_editor",D={enabled:!0,key:"Alt",defaultEditor:"vscode"};function H(e){return"__vue__"in e}function j(e){return"__vueParentComponent"in e}function P(e,t){var o,c,s,a,i,p;const n=(c=(o=e==null?void 0:e.__source)==null?void 0:o.start)==null?void 0:c.line;if(e.childNodes.length>0){let y,w=1/0;for(const u of Array.from(e.childNodes))if(u.nodeType===Node.TEXT_NODE&&((s=u.textContent)!=null&&s.trim())){const v=(a=u.getBoundingClientRect)==null?void 0:a.call(u);if(v){const C=Math.abs(v.top+v.height/2-t),E=(p=(i=u==null?void 0:u.__source)==null?void 0:i.start)==null?void 0:p.line;E&&C<w&&(w=C,y=E)}}if(y!==void 0)return y}return n}function K(e,t){var y,w,u,v,C,E,A;let n=e;const o=[];let c=0;const s=l=>l?l.includes("node_modules"):!1,a=l=>{var x,k,b,I,S,M,N;const f=(b=(k=(x=l==null?void 0:l.__vnode)==null?void 0:x.loc)==null?void 0:k.start)==null?void 0:b.line;if(f)return f;const r=(N=(M=(S=(I=l==null?void 0:l.__vnode)==null?void 0:I.componentOptions)==null?void 0:S.Ctor)==null?void 0:M.options)==null?void 0:N.__file;if(r){const R=r.match(/:(\d+)$/);if(R)return parseInt(R[1],10)}};for(;n;){const l=n.getBoundingClientRect(),f=Math.abs(l.top+l.height/2-t);if(j(n)&&n.__vueParentComponent){let r=n.__vueParentComponent;for(;r;){if((y=r==null?void 0:r.type)!=null&&y.__file){const x=P(n,t),k=a(n),b=r.type.__file;o.push({instance:r,line:k||((u=(w=r.type.__loc)==null?void 0:w.start)==null?void 0:u.line),textLine:x,depth:c,distance:f,isThirdParty:s(b)})}if(!(r!=null&&r.parent))break;r=r.parent,c++}}if(H(n)&&n.__vue__){const r=n.__vue__,x=P(n,t),k=a(n),b=r.__file||((v=r.$options)==null?void 0:v.__file);o.push({instance:r,line:k||((A=(E=(C=r.$options)==null?void 0:C.__loc)==null?void 0:E.start)==null?void 0:A.line),textLine:x,depth:c,distance:f,isThirdParty:s(b)})}n=n.parentElement,c++}if(o.length===0)return null;o.sort((l,f)=>l.depth!==f.depth?l.depth-f.depth:l.isThirdParty!==f.isThirdParty?l.isThirdParty?1:-1:(l.distance||1/0)-(f.distance||1/0));const i=o.filter(l=>{var f,r;return l.instance.__file||((f=l.instance.type)==null?void 0:f.__file)||((r=l.instance.$options)==null?void 0:r.__file)});if(i.length===0)return null;const p=i[0];return{instance:p.instance,line:p.textLine||p.line}}function B(e,t=""){e.setAttribute("vue-click-to-component-target",t)}function T(e){let t;e?t=document.querySelectorAll(`[vue-click-to-component-target="${e}"]`):t=document.querySelectorAll("[vue-click-to-component-target]"),t.forEach(n=>{n.removeAttribute("vue-click-to-component-target")})}const z=e=>{const t=document.createElement("a");t.href=e,t.click()};function $(e,t){const n=localStorage.getItem(h);if(!n){window.__click2component_pending_file=e,g=null,O(!0);return}const o=_.find(a=>a.name.toLowerCase()===n.toLowerCase());if(!o){console.warn(`不支持的编辑器: ${n}`);return}const c=e.startsWith("/")?e:`/${e}`;let s=`${o.protocol}${c}`;t&&(o.name.toLowerCase()==="vscode"?s+=`:${t}`:o.name.toLowerCase()==="cursor"&&(s+=`:${t}:1`)),z(s)}const G=`
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
</style>`;let d=null,g=null,m=null;function U(){if(d)return d;d=document.createElement("div"),Object.assign(d.style,{position:"fixed",top:"20px",right:"20px",padding:"12px",background:"#fff",borderRadius:"6px",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.15)",zIndex:"9999",display:"flex",flexDirection:"column",gap:"8px"});const e=document.createElement("div");e.textContent="选择编辑器",e.style.fontWeight="bold",e.style.marginBottom="8px",d&&d.appendChild(e),_.forEach(n=>{const o=document.createElement("button");o.textContent=`${n.icon||""} ${n.name}`,Object.assign(o.style,{padding:"6px 12px",border:"1px solid #ddd",borderRadius:"4px",background:g===n.name.toLowerCase()?"#e6f7ff":"#fff",cursor:"pointer",marginBottom:"8px"}),o.addEventListener("click",()=>{g=n.name.toLowerCase(),d&&_.forEach((c,s)=>{const a=d==null?void 0:d.children[s+1];a.tagName==="BUTTON"&&(a.style.background="#fff")}),o.style.background="#e6f7ff"}),d&&d.appendChild(o)});const t=document.createElement("button");return t.textContent="确定",Object.assign(t.style,{padding:"6px 12px",border:"1px solid #1890ff",borderRadius:"4px",background:"#1890ff",color:"#fff",cursor:"pointer",width:"100%"}),t.addEventListener("click",()=>{g&&(localStorage.setItem(h,g),O(!1),_.find(o=>o.name.toLowerCase()===g)&&window.__click2component_pending_file&&($(window.__click2component_pending_file),window.__click2component_pending_file=null))}),d&&(d.appendChild(t),document.body.appendChild(d)),d}function O(e){const t=U();t.style.display=e?"flex":"none"}function V(e){if(m||(m=document.createElement("div"),m.className="click2component-path-tooltip",document.body.appendChild(m)),e){const t=e.split("/"),n=t.pop()||"",o=t.join("/");m.innerHTML=`
      <span class="path-middle">${o}/</span>
      <span class="path-end">${n}</span>
    `,m.style.display="flex"}else m.style.display="none"}function L(){m&&(m.style.display="none")}function W(e,t){var s,a;if(!t.enabled)return;if(T("hover"),!(t.key==="Alt"||t.key==="Option"?e.altKey:t.key==="Shift"?e.shiftKey:t.key==="Control"?e.ctrlKey:t.key==="Meta"?e.metaKey:e.altKey)){document.body.removeAttribute("vue-click-to-component"),L();return}document.body.setAttribute("vue-click-to-component","");const o=e.target,c=K(o,e.clientY);if(c){const{instance:i}=c;B(o,"hover");const p=i.__file||((s=i.type)==null?void 0:s.__file)||((a=i.$options)==null?void 0:a.__file);V(p)}else L()}window.__click2component_pending_file=null;function q(e,t){var p,y;if(!(t!=null&&t.enabled)||!(t.key==="Alt"||t.key==="Option"?e.altKey:t.key==="Shift"?e.shiftKey:t.key==="Control"?e.ctrlKey:t.key==="Meta"?e.metaKey:e.altKey)||(e==null?void 0:e.button)!==0)return;const o=e.target,c=K(o,e.clientY);if(!c)return;e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation();const{instance:s,line:a}=c,i=s.__file||((p=s.type)==null?void 0:p.__file)||((y=s.$options)==null?void 0:y.__file);i&&(console.log("[Click2Component] 跳转到:",{file:i,line:a}),$(i,a))}function Y(e,t={}){const n={...D,...t};if(!n.enabled)return;let o=!1;const c=()=>{if(o)return;document.head.insertAdjacentHTML("beforeend",G);const s=i=>q(i,n),a=i=>W(i,n);document.addEventListener("click",s,!0),document.addEventListener("mousemove",a,!0),window.addEventListener("keyup",i=>{(n.key==="Alt"||n.key==="Option"?i.altKey:n.key==="Shift"?i.shiftKey:n.key==="Control"?i.ctrlKey:n.key==="Meta"?i.metaKey:i.altKey)||(T(),document.body.removeAttribute("vue-click-to-component"))}),window.addEventListener("blur",()=>{T(),document.body.removeAttribute("vue-click-to-component"),L()}),o=!0};c(),e.mixin({mounted(){c()}}),e.config.globalProperties.$router&&e.config.globalProperties.$router.afterEach(()=>{setTimeout(c,0)})}return{install:Y}});
