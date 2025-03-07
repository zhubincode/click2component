(function(y,k){typeof exports=="object"&&typeof module<"u"?module.exports=k():typeof define=="function"&&define.amd?define(k):(y=typeof globalThis<"u"?globalThis:y||self,y.click2component=k())})(this,function(){"use strict";const y=[{name:"VS Code",protocol:"vscode://file",icon:"📝"},{name:"Cursor",protocol:"cursor://file",icon:"✨"},{name:"Trae",protocol:"trae://file",icon:"🚀"}],k="click2component_editor",W={enabled:!0,key:"Alt",defaultEditor:"vscode",autoDetectRoot:!0};function B(t){return"__vue__"in t}function D(t){return"__vueParentComponent"in t}function O(t,e){var r,a,c,l,d,g,C,w,b,E,P,T;const n=(a=(r=t==null?void 0:t.__source)==null?void 0:r.start)==null?void 0:a.line,o=(d=(l=(c=t==null?void 0:t.__vnode)==null?void 0:c.loc)==null?void 0:l.start)==null?void 0:d.line;if(t.childNodes.length>0){let s,p=1/0;for(const i of Array.from(t.childNodes)){const _=(g=i.getBoundingClientRect)==null?void 0:g.call(i);if(_){const h=Math.abs(_.top+_.height/2-e);let u;i.nodeType===Node.TEXT_NODE&&((C=i.textContent)!=null&&C.trim())?u=(b=(w=i==null?void 0:i.__source)==null?void 0:w.start)==null?void 0:b.line:i.nodeType===Node.ELEMENT_NODE&&(u=(T=(P=(E=i==null?void 0:i.__vnode)==null?void 0:E.loc)==null?void 0:P.start)==null?void 0:T.line),u&&h<p&&(p=h,s=u)}}if(s!==void 0)return s}return o||n}function A(t,e){var g,C,w,b,E,P,T;let n=t;const o=[];let r=0;const a=s=>s?s.includes("node_modules"):!1,c=s=>{var _,h,u,N,R,S,j;const p=(u=(h=(_=s==null?void 0:s.__vnode)==null?void 0:_.loc)==null?void 0:h.start)==null?void 0:u.line;if(p)return p;const i=(j=(S=(R=(N=s==null?void 0:s.__vnode)==null?void 0:N.componentOptions)==null?void 0:R.Ctor)==null?void 0:S.options)==null?void 0:j.__file;if(i){const M=i.match(/:(\d+)$/);if(M)return parseInt(M[1],10)}};for(;n;){const s=n.getBoundingClientRect(),p=Math.abs(s.top+s.height/2-e);if(D(n)&&n.__vueParentComponent){let i=n.__vueParentComponent;for(;i;){if((g=i==null?void 0:i.type)!=null&&g.__file){const _=O(n,e),h=c(n),u=i.type.__file;o.push({instance:i,line:h||((w=(C=i.type.__loc)==null?void 0:C.start)==null?void 0:w.line),textLine:_,depth:r,distance:p,isThirdParty:a(u)})}if(!(i!=null&&i.parent))break;i=i.parent,r++}}if(B(n)&&n.__vue__){const i=n.__vue__,_=O(n,e),h=c(n),u=i.__file||((b=i.$options)==null?void 0:b.__file);o.push({instance:i,line:h||((T=(P=(E=i.$options)==null?void 0:E.__loc)==null?void 0:P.start)==null?void 0:T.line),textLine:_,depth:r,distance:p,isThirdParty:a(u)})}n=n.parentElement,r++}if(o.length===0)return null;o.sort((s,p)=>s.depth!==p.depth?s.depth-p.depth:s.isThirdParty!==p.isThirdParty?s.isThirdParty?1:-1:(s.distance||1/0)-(p.distance||1/0));const l=o.filter(s=>{var p,i;return s.instance.__file||((p=s.instance.type)==null?void 0:p.__file)||((i=s.instance.$options)==null?void 0:i.__file)});if(l.length===0)return null;const d=l[0];return{instance:d.instance,line:d.textLine||d.line}}function H(t,e=""){t.setAttribute("vue-click-to-component-target",e)}function K(t){let e;t?e=document.querySelectorAll(`[vue-click-to-component-target="${t}"]`):e=document.querySelectorAll("[vue-click-to-component-target]"),e.forEach(n=>{n.removeAttribute("vue-click-to-component-target")})}const U=t=>{const e=document.createElement("a");e.href=t,e.click()};function z(){var t,e;try{if(typeof window.webpackHotUpdate<"u"){if((t=window.__WEBPACK_CONFIG__)!=null&&t.context)return console.log("[Click2Component] 使用 webpack context:",window.__WEBPACK_CONFIG__.context),window.__WEBPACK_CONFIG__.context;const o=(e=process==null?void 0:process.env)==null?void 0:e.VUE_APP_PROJECT_ROOT;if(o)return console.log("[Click2Component] 使用环境变量中的项目根路径:",o),o;try{const r=document.querySelector('script[src*=".js.map"]');if(r){const c=r.src.split("/src/")[0];if(c&&!c.startsWith("http"))return console.log("[Click2Component] 使用源码映射推断的项目根路径:",c),c}}catch(r){console.warn("[Click2Component] 无法从源码映射获取项目路径:",r)}return console.warn("[Click2Component] 无法获取文件系统路径，请在 vue.config.js 中配置"),null}return null}catch(n){return console.warn("[Click2Component] 自动检测项目根目录失败:",n),null}}function L(...t){return t.map((e,n)=>(e=e.replace(/^\/+|\/+$/g,""),n===0&&t[0].startsWith("/")&&(e="/"+e),e)).filter(e=>e.length>0).join("/")}function G(t){var a;if(t.startsWith("/")&&!t.startsWith("~/"))return t;const e=z();if(t.startsWith("~")){const c=(a=process==null?void 0:process.env)==null?void 0:a.HOME;if(c){const l=t.replace(/^~/,c);return console.log("[Click2Component] 解析后的绝对路径:",l),l}}if(!e)return console.warn("[Click2Component] 无法检测到项目根目录"),t;let n=t;if(n.startsWith("./")&&(n=n.slice(2)),n=n.replace(/^src\//,""),n.includes("node_modules"))return L(e,n);const o=L(e,"src",n);console.log("[Click2Component] 尝试在 src 目录下查找:",o);const r=L(e,n);return console.log("[Click2Component] 尝试在项目根目录下查找:",r),o}function $(t,e){const n=localStorage.getItem(k);if(!n){window.__click2component_pending_file=t,v=null,I(!0);return}const o=y.find(c=>c.name.toLowerCase()===n.toLowerCase());if(!o){console.warn(`不支持的编辑器: ${n}`);return}const r=G(t);console.log("[Click2Component] 原始路径:",t),console.log("[Click2Component] 解析后的路径:",r);let a=`${o.protocol}${r}`;e&&(o.name.toLowerCase()==="vscode"?a+=`:${e}`:o.name.toLowerCase()==="cursor"&&(a+=`:${e}:1`)),U(a)}const V=`
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
</style>`;let f=null,v=null,m=null;function q(){if(f)return f;f=document.createElement("div"),Object.assign(f.style,{position:"fixed",top:"20px",right:"20px",padding:"12px",background:"#fff",borderRadius:"6px",boxShadow:"0 2px 8px rgba(0, 0, 0, 0.15)",zIndex:"9999",display:"flex",flexDirection:"column",gap:"8px"});const t=document.createElement("div");t.textContent="选择编辑器",t.style.fontWeight="bold",t.style.marginBottom="8px",f&&f.appendChild(t),y.forEach(n=>{const o=document.createElement("button");o.textContent=`${n.icon||""} ${n.name}`,Object.assign(o.style,{padding:"6px 12px",border:"1px solid #ddd",borderRadius:"4px",background:v===n.name.toLowerCase()?"#e6f7ff":"#fff",cursor:"pointer",marginBottom:"8px"}),o.addEventListener("click",()=>{v=n.name.toLowerCase(),f&&y.forEach((r,a)=>{const c=f==null?void 0:f.children[a+1];c.tagName==="BUTTON"&&(c.style.background="#fff")}),o.style.background="#e6f7ff"}),f&&f.appendChild(o)});const e=document.createElement("button");return e.textContent="确定",Object.assign(e.style,{padding:"6px 12px",border:"1px solid #1890ff",borderRadius:"4px",background:"#1890ff",color:"#fff",cursor:"pointer",width:"100%"}),e.addEventListener("click",()=>{v&&(localStorage.setItem(k,v),I(!1),y.find(o=>o.name.toLowerCase()===v)&&window.__click2component_pending_file&&($(window.__click2component_pending_file),window.__click2component_pending_file=null))}),f&&(f.appendChild(e),document.body.appendChild(f)),f}function I(t){const e=q();e.style.display=t?"flex":"none"}function F(t){if(m&&(m.remove(),m=null),!t)return;m=document.createElement("div"),m.className="click2component-path-tooltip";const e=t.split("/"),n=e.pop()||"",o=e.join("/");m.innerHTML=`
    <span class="path-middle">${o}/</span>
    <span class="path-end">${n}</span>
  `,document.body.appendChild(m)}function x(){m&&(m.remove(),m=null)}function Y(t,e){var a,c;if(!e.enabled)return;if(K("hover"),!(e.key==="Alt"||e.key==="Option"?t.altKey:e.key==="Shift"?t.shiftKey:e.key==="Control"?t.ctrlKey:e.key==="Meta"?t.metaKey:t.altKey)){document.body.removeAttribute("vue-click-to-component"),x();return}document.body.setAttribute("vue-click-to-component","");const o=t.target,r=A(o,t.clientY);if(r){const{instance:l}=r,d=l.__file||((a=l.type)==null?void 0:a.__file)||((c=l.$options)==null?void 0:c.__file);H(o,"hover"),d&&F(d)}else x()}window.__click2component_pending_file=null;function J(t,e){var d,g;if(!(e!=null&&e.enabled)||!(e.key==="Alt"||e.key==="Option"?t.altKey:e.key==="Shift"?t.shiftKey:e.key==="Control"?t.ctrlKey:e.key==="Meta"?t.metaKey:t.altKey)||(t==null?void 0:t.button)!==0)return;const o=t.target,r=A(o,t.clientY);if(!r)return;t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation();const{instance:a,line:c}=r,l=a.__file||((d=a.type)==null?void 0:d.__file)||((g=a.$options)==null?void 0:g.__file);l&&(console.log("[Click2Component] 跳转到:",{file:l,line:c||1}),$(l,c))}function X(t,e={}){const n={...W,...e};if(!n.enabled)return;let o=!1;const r=()=>{if(o)return;document.head.insertAdjacentHTML("beforeend",V);const a=l=>J(l,n),c=l=>Y(l,n);document.addEventListener("click",a,!0),document.addEventListener("mousemove",c,!0),window.addEventListener("keydown",l=>{(n.key==="Alt"||n.key==="Option"?l.altKey:n.key==="Shift"?l.shiftKey:n.key==="Control"?l.ctrlKey:n.key==="Meta"?l.metaKey:l.altKey)||x()}),window.addEventListener("keyup",()=>{K(),document.body.removeAttribute("vue-click-to-component"),x()}),window.addEventListener("blur",()=>{K(),document.body.removeAttribute("vue-click-to-component"),x()}),o=!0};r(),t.mixin({mounted(){r()}}),t.config.globalProperties.$router&&t.config.globalProperties.$router.afterEach(()=>{setTimeout(r,0)})}return{install:X}});
