const L = [
  { name: "VS Code", protocol: "vscode://file", icon: "📝" },
  { name: "Cursor", protocol: "cursor://file", icon: "✨" }
], S = "click2component_editor", D = {
  enabled: !0,
  key: "Alt",
  defaultEditor: "vscode"
};
function H(t) {
  return "__vue__" in t;
}
function B(t) {
  return "__vueParentComponent" in t;
}
function I(t, e) {
  var c, s, a, l, p, h, v, k, x, b, w, E;
  const n = (s = (c = t == null ? void 0 : t.__source) == null ? void 0 : c.start) == null ? void 0 : s.line, i = (p = (l = (a = t == null ? void 0 : t.__vnode) == null ? void 0 : a.loc) == null ? void 0 : l.start) == null ? void 0 : p.line;
  if (t.childNodes.length > 0) {
    let r, d = 1 / 0;
    for (const o of Array.from(t.childNodes)) {
      const m = (h = o.getBoundingClientRect) == null ? void 0 : h.call(o);
      if (m) {
        const y = Math.abs(m.top + m.height / 2 - e);
        let u;
        o.nodeType === Node.TEXT_NODE && ((v = o.textContent) != null && v.trim()) ? u = (x = (k = o == null ? void 0 : o.__source) == null ? void 0 : k.start) == null ? void 0 : x.line : o.nodeType === Node.ELEMENT_NODE && (u = (E = (w = (b = o == null ? void 0 : o.__vnode) == null ? void 0 : b.loc) == null ? void 0 : w.start) == null ? void 0 : E.line), u && y < d && (d = y, r = u);
      }
    }
    if (r !== void 0)
      return r;
  }
  return i || n;
}
function N(t, e) {
  var h, v, k, x, b, w, E;
  let n = t;
  const i = [];
  let c = 0;
  const s = (r) => r ? r.includes("node_modules") : !1, a = (r) => {
    var m, y, u, P, K, $, O;
    const d = (u = (y = (m = r == null ? void 0 : r.__vnode) == null ? void 0 : m.loc) == null ? void 0 : y.start) == null ? void 0 : u.line;
    if (d)
      return d;
    const o = (O = ($ = (K = (P = r == null ? void 0 : r.__vnode) == null ? void 0 : P.componentOptions) == null ? void 0 : K.Ctor) == null ? void 0 : $.options) == null ? void 0 : O.__file;
    if (o) {
      const A = o.match(/:(\d+)$/);
      if (A)
        return parseInt(A[1], 10);
    }
  };
  for (; n; ) {
    const r = n.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - e);
    if (B(n) && n.__vueParentComponent) {
      let o = n.__vueParentComponent;
      for (; o; ) {
        if ((h = o == null ? void 0 : o.type) != null && h.__file) {
          const m = I(n, e), y = a(n), u = o.type.__file;
          i.push({
            instance: o,
            line: y || ((k = (v = o.type.__loc) == null ? void 0 : v.start) == null ? void 0 : k.line),
            textLine: m,
            depth: c,
            distance: d,
            isThirdParty: s(u)
          });
        }
        if (!(o != null && o.parent))
          break;
        o = o.parent, c++;
      }
    }
    if (H(n) && n.__vue__) {
      const o = n.__vue__, m = I(n, e), y = a(n), u = o.__file || ((x = o.$options) == null ? void 0 : x.__file);
      i.push({
        instance: o,
        line: y || ((E = (w = (b = o.$options) == null ? void 0 : b.__loc) == null ? void 0 : w.start) == null ? void 0 : E.line),
        textLine: m,
        depth: c,
        distance: d,
        isThirdParty: s(u)
      });
    }
    n = n.parentElement, c++;
  }
  if (i.length === 0)
    return null;
  i.sort((r, d) => r.depth !== d.depth ? r.depth - d.depth : r.isThirdParty !== d.isThirdParty ? r.isThirdParty ? 1 : -1 : (r.distance || 1 / 0) - (d.distance || 1 / 0));
  const l = i.filter(
    (r) => {
      var d, o;
      return r.instance.__file || ((d = r.instance.type) == null ? void 0 : d.__file) || ((o = r.instance.$options) == null ? void 0 : o.__file);
    }
  );
  if (l.length === 0)
    return null;
  const p = l[0];
  return {
    instance: p.instance,
    line: p.textLine || p.line
    // 优先使用文本行号
  };
}
function j(t, e = "") {
  t.setAttribute("vue-click-to-component-target", e);
}
function T(t) {
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
function M(t, e) {
  const n = localStorage.getItem(S);
  if (!n) {
    window.__click2component_pending_file = t, g = null, R(!0);
    return;
  }
  const i = L.find(
    (a) => a.name.toLowerCase() === n.toLowerCase()
  );
  if (!i) {
    console.warn(`不支持的编辑器: ${n}`);
    return;
  }
  const c = t.startsWith("/") ? t : `/${t}`;
  let s = `${i.protocol}${c}`;
  e && (i.name.toLowerCase() === "vscode" ? s += `:${e}` : i.name.toLowerCase() === "cursor" && (s += `:${e}:1`)), z(s);
}
const G = `
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
function U() {
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
  t.textContent = "选择编辑器", t.style.fontWeight = "bold", t.style.marginBottom = "8px", f && f.appendChild(t), L.forEach((n) => {
    const i = document.createElement("button");
    i.textContent = `${n.icon || ""} ${n.name}`, Object.assign(i.style, {
      padding: "6px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background: g === n.name.toLowerCase() ? "#e6f7ff" : "#fff",
      cursor: "pointer",
      marginBottom: "8px"
    }), i.addEventListener("click", () => {
      g = n.name.toLowerCase(), f && L.forEach((c, s) => {
        const a = f == null ? void 0 : f.children[s + 1];
        a.tagName === "BUTTON" && (a.style.background = "#fff");
      }), i.style.background = "#e6f7ff";
    }), f && f.appendChild(i);
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
    g && (localStorage.setItem(S, g), R(!1), L.find(
      (i) => i.name.toLowerCase() === g
    ) && window.__click2component_pending_file && (M(window.__click2component_pending_file), window.__click2component_pending_file = null));
  }), f && (f.appendChild(e), document.body.appendChild(f)), f;
}
function R(t) {
  const e = U();
  e.style.display = t ? "flex" : "none";
}
function V(t) {
  if (_ && (_.remove(), _ = null), !t)
    return;
  _ = document.createElement("div"), _.className = "click2component-path-tooltip";
  const e = t.split("/"), n = e.pop() || "", i = e.join("/");
  _.innerHTML = `
    <span class="path-middle">${i}/</span>
    <span class="path-end">${n}</span>
  `, document.body.appendChild(_);
}
function C() {
  _ && (_.remove(), _ = null);
}
function W(t, e) {
  var s, a;
  if (!e.enabled)
    return;
  if (T("hover"), !(e.key === "Alt" || e.key === "Option" ? t.altKey : e.key === "Shift" ? t.shiftKey : e.key === "Control" ? t.ctrlKey : e.key === "Meta" ? t.metaKey : t.altKey)) {
    document.body.removeAttribute("vue-click-to-component"), C();
    return;
  }
  document.body.setAttribute("vue-click-to-component", "");
  const i = t.target, c = N(i, t.clientY);
  if (c) {
    const { instance: l } = c, p = l.__file || ((s = l.type) == null ? void 0 : s.__file) || ((a = l.$options) == null ? void 0 : a.__file);
    j(i, "hover"), p && V(p);
  } else
    C();
}
window.__click2component_pending_file = null;
function q(t, e) {
  var p, h;
  if (!(e != null && e.enabled) || !(e.key === "Alt" || e.key === "Option" ? t.altKey : e.key === "Shift" ? t.shiftKey : e.key === "Control" ? t.ctrlKey : e.key === "Meta" ? t.metaKey : t.altKey) || (t == null ? void 0 : t.button) !== 0)
    return;
  const i = t.target, c = N(i, t.clientY);
  if (!c)
    return;
  t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation();
  const { instance: s, line: a } = c, l = s.__file || ((p = s.type) == null ? void 0 : p.__file) || ((h = s.$options) == null ? void 0 : h.__file);
  l && (console.log("[Click2Component] 跳转到:", {
    file: l,
    line: a || 1
  }), M(l, a));
}
function Y(t, e = {}) {
  const n = { ...D, ...e };
  if (!n.enabled)
    return;
  let i = !1;
  const c = () => {
    if (i)
      return;
    document.head.insertAdjacentHTML("beforeend", G);
    const s = (l) => q(l, n), a = (l) => W(l, n);
    document.addEventListener("click", s, !0), document.addEventListener("mousemove", a, !0), window.addEventListener("keydown", (l) => {
      (n.key === "Alt" || n.key === "Option" ? l.altKey : n.key === "Shift" ? l.shiftKey : n.key === "Control" ? l.ctrlKey : n.key === "Meta" ? l.metaKey : l.altKey) || C();
    }), window.addEventListener("keyup", () => {
      T(), document.body.removeAttribute("vue-click-to-component"), C();
    }), window.addEventListener("blur", () => {
      T(), document.body.removeAttribute("vue-click-to-component"), C();
    }), i = !0;
  };
  c(), t.mixin({
    mounted() {
      c();
    }
  }), t.config.globalProperties.$router && t.config.globalProperties.$router.afterEach(() => {
    setTimeout(c, 0);
  });
}
const X = {
  install: Y
};
export {
  X as default
};
