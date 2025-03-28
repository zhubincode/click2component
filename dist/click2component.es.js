const P = [
  { name: "VS Code", protocol: "vscode://file", icon: "📝" },
  { name: "Cursor", protocol: "cursor://file", icon: "✨" },
  { name: "Trae", protocol: "trae://file", icon: "🚀" }
], R = "click2component_editor", W = {
  enabled: !0,
  key: "Alt",
  defaultEditor: "vscode",
  autoDetectRoot: !0
};
function B(t) {
  return "__vue__" in t;
}
function D(t) {
  return "__vueParentComponent" in t;
}
function N(t, e) {
  var r, a, c, l, d, y, k, v, C, w, x, b;
  const n = (a = (r = t == null ? void 0 : t.__source) == null ? void 0 : r.start) == null ? void 0 : a.line, o = (d = (l = (c = t == null ? void 0 : t.__vnode) == null ? void 0 : c.loc) == null ? void 0 : l.start) == null ? void 0 : d.line;
  if (t.childNodes.length > 0) {
    let s, p = 1 / 0;
    for (const i of Array.from(t.childNodes)) {
      const m = (y = i.getBoundingClientRect) == null ? void 0 : y.call(i);
      if (m) {
        const h = Math.abs(m.top + m.height / 2 - e);
        let u;
        i.nodeType === Node.TEXT_NODE && ((k = i.textContent) != null && k.trim()) ? u = (C = (v = i == null ? void 0 : i.__source) == null ? void 0 : v.start) == null ? void 0 : C.line : i.nodeType === Node.ELEMENT_NODE && (u = (b = (x = (w = i == null ? void 0 : i.__vnode) == null ? void 0 : w.loc) == null ? void 0 : x.start) == null ? void 0 : b.line), u && h < p && (p = h, s = u);
      }
    }
    if (s !== void 0)
      return s;
  }
  return o || n;
}
function S(t, e) {
  var y, k, v, C, w, x, b;
  let n = t;
  const o = [];
  let r = 0;
  const a = (s) => s ? s.includes("node_modules") : !1, c = (s) => {
    var m, h, u, L, O, A, $;
    const p = (u = (h = (m = s == null ? void 0 : s.__vnode) == null ? void 0 : m.loc) == null ? void 0 : h.start) == null ? void 0 : u.line;
    if (p)
      return p;
    const i = ($ = (A = (O = (L = s == null ? void 0 : s.__vnode) == null ? void 0 : L.componentOptions) == null ? void 0 : O.Ctor) == null ? void 0 : A.options) == null ? void 0 : $.__file;
    if (i) {
      const I = i.match(/:(\d+)$/);
      if (I)
        return parseInt(I[1], 10);
    }
  };
  for (; n; ) {
    const s = n.getBoundingClientRect(), p = Math.abs(s.top + s.height / 2 - e);
    if (D(n) && n.__vueParentComponent) {
      let i = n.__vueParentComponent;
      for (; i; ) {
        if ((y = i == null ? void 0 : i.type) != null && y.__file) {
          const m = N(n, e), h = c(n), u = i.type.__file;
          o.push({
            instance: i,
            line: h || ((v = (k = i.type.__loc) == null ? void 0 : k.start) == null ? void 0 : v.line),
            textLine: m,
            depth: r,
            distance: p,
            isThirdParty: a(u)
          });
        }
        if (!(i != null && i.parent))
          break;
        i = i.parent, r++;
      }
    }
    if (B(n) && n.__vue__) {
      const i = n.__vue__, m = N(n, e), h = c(n), u = i.__file || ((C = i.$options) == null ? void 0 : C.__file);
      o.push({
        instance: i,
        line: h || ((b = (x = (w = i.$options) == null ? void 0 : w.__loc) == null ? void 0 : x.start) == null ? void 0 : b.line),
        textLine: m,
        depth: r,
        distance: p,
        isThirdParty: a(u)
      });
    }
    n = n.parentElement, r++;
  }
  if (o.length === 0)
    return null;
  o.sort((s, p) => s.depth !== p.depth ? s.depth - p.depth : s.isThirdParty !== p.isThirdParty ? s.isThirdParty ? 1 : -1 : (s.distance || 1 / 0) - (p.distance || 1 / 0));
  const l = o.filter(
    (s) => {
      var p, i;
      return s.instance.__file || ((p = s.instance.type) == null ? void 0 : p.__file) || ((i = s.instance.$options) == null ? void 0 : i.__file);
    }
  );
  if (l.length === 0)
    return null;
  const d = l[0];
  return {
    instance: d.instance,
    line: d.textLine || d.line
    // 优先使用文本行号
  };
}
function H(t, e = "") {
  t.setAttribute("vue-click-to-component-target", e);
}
function K(t) {
  let e;
  t ? e = document.querySelectorAll(
    `[vue-click-to-component-target="${t}"]`
  ) : e = document.querySelectorAll("[vue-click-to-component-target]"), e.forEach((n) => {
    n.removeAttribute("vue-click-to-component-target");
  });
}
const z = (t) => {
  const e = document.createElement("a");
  e.href = t, e.click();
};
function U() {
  var t, e;
  try {
    if (typeof window.webpackHotUpdate < "u") {
      if ((t = window.__WEBPACK_CONFIG__) != null && t.context)
        return console.log(
          "[Click2Component] 使用 webpack context:",
          window.__WEBPACK_CONFIG__.context
        ), window.__WEBPACK_CONFIG__.context;
      const o = (e = process == null ? void 0 : process.env) == null ? void 0 : e.VUE_APP_PROJECT_ROOT;
      if (o)
        return console.log(
          "[Click2Component] 使用环境变量中的项目根路径:",
          o
        ), o;
      try {
        const r = document.querySelector(
          'script[src*=".js.map"]'
        );
        if (r) {
          const c = r.src.split("/src/")[0];
          if (c && !c.startsWith("http"))
            return console.log(
              "[Click2Component] 使用源码映射推断的项目根路径:",
              c
            ), c;
        }
      } catch (r) {
        console.warn("[Click2Component] 无法从源码映射获取项目路径:", r);
      }
      return console.warn(
        "[Click2Component] 无法获取文件系统路径，请在 vue.config.js 中配置"
      ), null;
    }
    return null;
  } catch (n) {
    return console.warn("[Click2Component] 自动检测项目根目录失败:", n), null;
  }
}
function T(...t) {
  return t.map((e, n) => (e = e.replace(/^\/+|\/+$/g, ""), n === 0 && t[0].startsWith("/") && (e = "/" + e), e)).filter((e) => e.length > 0).join("/");
}
function G(t) {
  var a;
  if (t.startsWith("/") && !t.startsWith("~/"))
    return t;
  const e = U();
  if (t.startsWith("~")) {
    const c = (a = process == null ? void 0 : process.env) == null ? void 0 : a.HOME;
    if (c) {
      const l = t.replace(/^~/, c);
      return console.log("[Click2Component] 解析后的绝对路径:", l), l;
    }
  }
  if (!e)
    return console.warn("[Click2Component] 无法检测到项目根目录"), t;
  let n = t;
  if (n.startsWith("./") && (n = n.slice(2)), n = n.replace(/^src\//, ""), n.includes("node_modules"))
    return T(e, n);
  const o = T(e, "src", n);
  console.log("[Click2Component] 尝试在 src 目录下查找:", o);
  const r = T(e, n);
  return console.log("[Click2Component] 尝试在项目根目录下查找:", r), o;
}
function j(t, e) {
  const n = localStorage.getItem(R);
  if (!n) {
    window.__click2component_pending_file = t, g = null, M(!0);
    return;
  }
  const o = P.find(
    (l) => l.name.toLowerCase() === n.toLowerCase()
  );
  if (!o) {
    console.warn(`不支持的编辑器: ${n}`);
    return;
  }
  const r = G(t);
  console.log("[Click2Component] 原始路径:", t), console.log("[Click2Component] 解析后的路径:", r);
  let a = r;
  /^[A-Za-z]:/.test(a) && (a = "/" + a.replace(/\\/g, "/"));
  let c = `${o.protocol}${a}`;
  e && (o.name.toLowerCase() === "vscode" ? c += `:${e}` : o.name.toLowerCase() === "cursor" && (c += `:${e}:1`)), z(c);
}
const V = `
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
</style>`;
let f = null, g = null, _ = null;
function q() {
  if (f)
    return f;
  f = document.createElement("div"), Object.assign(f.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px",
    background: "#fff",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  });
  const t = document.createElement("div");
  t.textContent = "选择编辑器", t.style.fontWeight = "bold", t.style.marginBottom = "8px", f && f.appendChild(t), P.forEach((n) => {
    const o = document.createElement("button");
    o.textContent = `${n.icon || ""} ${n.name}`, Object.assign(o.style, {
      padding: "6px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background: g === n.name.toLowerCase() ? "#e6f7ff" : "#fff",
      cursor: "pointer",
      marginBottom: "8px"
    }), o.addEventListener("click", () => {
      g = n.name.toLowerCase(), f && P.forEach((r, a) => {
        const c = f == null ? void 0 : f.children[a + 1];
        c.tagName === "BUTTON" && (c.style.background = "#fff");
      }), o.style.background = "#e6f7ff";
    }), f && f.appendChild(o);
  });
  const e = document.createElement("button");
  return e.textContent = "确定", Object.assign(e.style, {
    padding: "6px 12px",
    border: "1px solid #1890ff",
    borderRadius: "4px",
    background: "#1890ff",
    color: "#fff",
    cursor: "pointer",
    width: "100%"
  }), e.addEventListener("click", () => {
    g && (localStorage.setItem(R, g), M(!1), P.find(
      (o) => o.name.toLowerCase() === g
    ) && window.__click2component_pending_file && (j(window.__click2component_pending_file), window.__click2component_pending_file = null));
  }), f && (f.appendChild(e), document.body.appendChild(f)), f;
}
function M(t) {
  const e = q();
  e.style.display = t ? "flex" : "none";
}
function F(t) {
  if (_ && (_.remove(), _ = null), !t)
    return;
  _ = document.createElement("div"), _.className = "click2component-path-tooltip";
  const e = t.split("/"), n = e.pop() || "", o = e.join("/");
  _.innerHTML = `
    <span class="path-middle">${o}/</span>
    <span class="path-end">${n}</span>
  `, document.body.appendChild(_);
}
function E() {
  _ && (_.remove(), _ = null);
}
function Y(t, e) {
  var a, c;
  if (!e.enabled)
    return;
  if (K("hover"), !(e.key === "Alt" || e.key === "Option" ? t.altKey : e.key === "Shift" ? t.shiftKey : e.key === "Control" ? t.ctrlKey : e.key === "Meta" ? t.metaKey : t.altKey)) {
    document.body.removeAttribute("vue-click-to-component"), E();
    return;
  }
  document.body.setAttribute("vue-click-to-component", "");
  const o = t.target, r = S(o, t.clientY);
  if (r) {
    const { instance: l } = r, d = l.__file || ((a = l.type) == null ? void 0 : a.__file) || ((c = l.$options) == null ? void 0 : c.__file);
    H(o, "hover"), d && F(d);
  } else
    E();
}
window.__click2component_pending_file = null;
function J(t, e) {
  var d, y;
  if (!(e != null && e.enabled) || !(e.key === "Alt" || e.key === "Option" ? t.altKey : e.key === "Shift" ? t.shiftKey : e.key === "Control" ? t.ctrlKey : e.key === "Meta" ? t.metaKey : t.altKey) || (t == null ? void 0 : t.button) !== 0)
    return;
  const o = t.target, r = S(o, t.clientY);
  if (!r)
    return;
  t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation();
  const { instance: a, line: c } = r, l = a.__file || ((d = a.type) == null ? void 0 : d.__file) || ((y = a.$options) == null ? void 0 : y.__file);
  l && (console.log("[Click2Component] 跳转到:", {
    file: l,
    line: c || 1
  }), j(l, c));
}
function X(t, e = {}) {
  const n = { ...W, ...e };
  if (!n.enabled)
    return;
  let o = !1;
  const r = () => {
    if (o)
      return;
    document.head.insertAdjacentHTML("beforeend", V);
    const a = (l) => J(l, n), c = (l) => Y(l, n);
    document.addEventListener("click", a, !0), document.addEventListener("mousemove", c, !0), window.addEventListener("keydown", (l) => {
      (n.key === "Alt" || n.key === "Option" ? l.altKey : n.key === "Shift" ? l.shiftKey : n.key === "Control" ? l.ctrlKey : n.key === "Meta" ? l.metaKey : l.altKey) || E();
    }), window.addEventListener("keyup", () => {
      K(), document.body.removeAttribute("vue-click-to-component"), E();
    }), window.addEventListener("blur", () => {
      K(), document.body.removeAttribute("vue-click-to-component"), E();
    }), o = !0;
  };
  r(), t.mixin({
    mounted() {
      r();
    }
  }), t.config.globalProperties.$router && t.config.globalProperties.$router.afterEach(() => {
    setTimeout(r, 0);
  });
}
const Z = {
  install: X
};
export {
  Z as default
};
