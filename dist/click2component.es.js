const C = [
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
  var o, c, s, a, i, p;
  const n = (c = (o = t == null ? void 0 : t.__source) == null ? void 0 : o.start) == null ? void 0 : c.line;
  if (t.childNodes.length > 0) {
    let m, x = 1 / 0;
    for (const u of Array.from(t.childNodes))
      if (u.nodeType === Node.TEXT_NODE && ((s = u.textContent) != null && s.trim())) {
        const _ = (a = u.getBoundingClientRect) == null ? void 0 : a.call(u);
        if (_) {
          const b = Math.abs(_.top + _.height / 2 - e), w = (p = (i = u == null ? void 0 : u.__source) == null ? void 0 : i.start) == null ? void 0 : p.line;
          w && b < x && (x = b, m = w);
        }
      }
    if (m !== void 0)
      return m;
  }
  return n;
}
function M(t, e) {
  var m, x, u, _, b, w, T;
  let n = t;
  const o = [];
  let c = 0;
  const s = (l) => l ? l.includes("node_modules") : !1, a = (l) => {
    var h, g, v, P, K, $, O;
    const f = (v = (g = (h = l == null ? void 0 : l.__vnode) == null ? void 0 : h.loc) == null ? void 0 : g.start) == null ? void 0 : v.line;
    if (f)
      return f;
    const r = (O = ($ = (K = (P = l == null ? void 0 : l.__vnode) == null ? void 0 : P.componentOptions) == null ? void 0 : K.Ctor) == null ? void 0 : $.options) == null ? void 0 : O.__file;
    if (r) {
      const A = r.match(/:(\d+)$/);
      if (A)
        return parseInt(A[1], 10);
    }
  };
  for (; n; ) {
    const l = n.getBoundingClientRect(), f = Math.abs(l.top + l.height / 2 - e);
    if (B(n) && n.__vueParentComponent) {
      let r = n.__vueParentComponent;
      for (; r; ) {
        if ((m = r == null ? void 0 : r.type) != null && m.__file) {
          const h = I(n, e), g = a(n), v = r.type.__file;
          o.push({
            instance: r,
            line: g || ((u = (x = r.type.__loc) == null ? void 0 : x.start) == null ? void 0 : u.line),
            textLine: h,
            depth: c,
            distance: f,
            isThirdParty: s(v)
          });
        }
        if (!(r != null && r.parent))
          break;
        r = r.parent, c++;
      }
    }
    if (H(n) && n.__vue__) {
      const r = n.__vue__, h = I(n, e), g = a(n), v = r.__file || ((_ = r.$options) == null ? void 0 : _.__file);
      o.push({
        instance: r,
        line: g || ((T = (w = (b = r.$options) == null ? void 0 : b.__loc) == null ? void 0 : w.start) == null ? void 0 : T.line),
        textLine: h,
        depth: c,
        distance: f,
        isThirdParty: s(v)
      });
    }
    n = n.parentElement, c++;
  }
  if (o.length === 0)
    return null;
  o.sort((l, f) => l.depth !== f.depth ? l.depth - f.depth : l.isThirdParty !== f.isThirdParty ? l.isThirdParty ? 1 : -1 : (l.distance || 1 / 0) - (f.distance || 1 / 0));
  const i = o.filter(
    (l) => {
      var f, r;
      return l.instance.__file || ((f = l.instance.type) == null ? void 0 : f.__file) || ((r = l.instance.$options) == null ? void 0 : r.__file);
    }
  );
  if (i.length === 0)
    return null;
  const p = i[0];
  return {
    instance: p.instance,
    line: p.textLine || p.line
    // 优先使用文本行号
  };
}
function j(t, e = "") {
  t.setAttribute("vue-click-to-component-target", e);
}
function E(t) {
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
function N(t, e) {
  const n = localStorage.getItem(S);
  if (!n) {
    window.__click2component_pending_file = t, k = null, R(!0);
    return;
  }
  const o = C.find(
    (a) => a.name.toLowerCase() === n.toLowerCase()
  );
  if (!o) {
    console.warn(`不支持的编辑器: ${n}`);
    return;
  }
  const c = t.startsWith("/") ? t : `/${t}`;
  let s = `${o.protocol}${c}`;
  e && (o.name.toLowerCase() === "vscode" ? s += `:${e}` : o.name.toLowerCase() === "cursor" && (s += `:${e}:1`)), z(s);
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
let d = null, k = null, y = null;
function U() {
  if (d)
    return d;
  d = document.createElement("div"), Object.assign(d.style, {
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
  t.textContent = "选择编辑器", t.style.fontWeight = "bold", t.style.marginBottom = "8px", d && d.appendChild(t), C.forEach((n) => {
    const o = document.createElement("button");
    o.textContent = `${n.icon || ""} ${n.name}`, Object.assign(o.style, {
      padding: "6px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background: k === n.name.toLowerCase() ? "#e6f7ff" : "#fff",
      cursor: "pointer",
      marginBottom: "8px"
    }), o.addEventListener("click", () => {
      k = n.name.toLowerCase(), d && C.forEach((c, s) => {
        const a = d == null ? void 0 : d.children[s + 1];
        a.tagName === "BUTTON" && (a.style.background = "#fff");
      }), o.style.background = "#e6f7ff";
    }), d && d.appendChild(o);
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
    k && (localStorage.setItem(S, k), R(!1), C.find(
      (o) => o.name.toLowerCase() === k
    ) && window.__click2component_pending_file && (N(window.__click2component_pending_file), window.__click2component_pending_file = null));
  }), d && (d.appendChild(e), document.body.appendChild(d)), d;
}
function R(t) {
  const e = U();
  e.style.display = t ? "flex" : "none";
}
function V(t) {
  if (y || (y = document.createElement("div"), y.className = "click2component-path-tooltip", document.body.appendChild(y)), t) {
    const e = t.split("/"), n = e.pop() || "", o = e.join("/");
    y.innerHTML = `
      <span class="path-middle">${o}/</span>
      <span class="path-end">${n}</span>
    `, y.style.display = "flex";
  } else
    y.style.display = "none";
}
function L() {
  y && (y.style.display = "none");
}
function W(t, e) {
  var s, a;
  if (!e.enabled)
    return;
  if (E("hover"), !(e.key === "Alt" || e.key === "Option" ? t.altKey : e.key === "Shift" ? t.shiftKey : e.key === "Control" ? t.ctrlKey : e.key === "Meta" ? t.metaKey : t.altKey)) {
    document.body.removeAttribute("vue-click-to-component"), L();
    return;
  }
  document.body.setAttribute("vue-click-to-component", "");
  const o = t.target, c = M(o, t.clientY);
  if (c) {
    const { instance: i } = c;
    j(o, "hover");
    const p = i.__file || ((s = i.type) == null ? void 0 : s.__file) || ((a = i.$options) == null ? void 0 : a.__file);
    V(p);
  } else
    L();
}
window.__click2component_pending_file = null;
function q(t, e) {
  var p, m;
  if (!(e != null && e.enabled) || !(e.key === "Alt" || e.key === "Option" ? t.altKey : e.key === "Shift" ? t.shiftKey : e.key === "Control" ? t.ctrlKey : e.key === "Meta" ? t.metaKey : t.altKey) || (t == null ? void 0 : t.button) !== 0)
    return;
  const o = t.target, c = M(o, t.clientY);
  if (!c)
    return;
  t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation();
  const { instance: s, line: a } = c, i = s.__file || ((p = s.type) == null ? void 0 : p.__file) || ((m = s.$options) == null ? void 0 : m.__file);
  i && (console.log("[Click2Component] 跳转到:", {
    file: i,
    line: a
  }), N(i, a));
}
function Y(t, e = {}) {
  const n = { ...D, ...e };
  if (!n.enabled)
    return;
  let o = !1;
  const c = () => {
    if (o)
      return;
    document.head.insertAdjacentHTML("beforeend", G);
    const s = (i) => q(i, n), a = (i) => W(i, n);
    document.addEventListener("click", s, !0), document.addEventListener("mousemove", a, !0), window.addEventListener("keyup", (i) => {
      (n.key === "Alt" || n.key === "Option" ? i.altKey : n.key === "Shift" ? i.shiftKey : n.key === "Control" ? i.ctrlKey : n.key === "Meta" ? i.metaKey : i.altKey) || (E(), document.body.removeAttribute("vue-click-to-component"));
    }), window.addEventListener("blur", () => {
      E(), document.body.removeAttribute("vue-click-to-component"), L();
    }), o = !0;
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
