const u = [
  { name: "VS Code", protocol: "vscode://file", icon: "📝" },
  { name: "Cursor", protocol: "cursor://file", icon: "✨" }
], p = "click2component_editor", k = {
  enabled: !0,
  key: "Alt",
  defaultEditor: "vscode"
};
function b(e) {
  return "__vue__" in e;
}
function v(e) {
  return "__vueParentComponent" in e;
}
function g(e) {
  var t, o, i, c, r, a;
  if (v(e) && e.__vueParentComponent) {
    let n = e.__vueParentComponent;
    for (; n; ) {
      if ((t = n == null ? void 0 : n.type) != null && t.__file) {
        const s = (i = (o = n.type.__loc) == null ? void 0 : o.start) == null ? void 0 : i.line;
        return {
          instance: n,
          line: s
        };
      }
      if (!(n != null && n.parent))
        break;
      n = n.parent;
    }
  }
  if (b(e) && e.__vue__) {
    const n = e.__vue__, s = (a = (r = (c = n.$options) == null ? void 0 : c.__loc) == null ? void 0 : r.start) == null ? void 0 : a.line;
    return {
      instance: n,
      line: s
    };
  }
  return null;
}
function C(e, t = "") {
  e.setAttribute("vue-click-to-component-target", t);
}
function f(e) {
  let t;
  e ? t = document.querySelectorAll(
    `[vue-click-to-component-target="${e}"]`
  ) : t = document.querySelectorAll("[vue-click-to-component-target]"), t.forEach((o) => {
    o.removeAttribute("vue-click-to-component-target");
  });
}
const x = (e) => {
  const t = document.createElement("a");
  t.href = e, t.click();
};
function y(e, t) {
  const o = localStorage.getItem(p);
  if (!o) {
    window.__click2component_pending_file = e, d = null, _(!0);
    return;
  }
  const i = u.find(
    (r) => r.name.toLowerCase() === o.toLowerCase()
  );
  if (!i) {
    console.warn(`不支持的编辑器: ${o}`);
    return;
  }
  let c = e.startsWith("/") ? `${i.protocol}${e}` : `${i.protocol}/${e}`;
  t && (c += `:${t}`), console.log("[Click2Component] 打开文件:", c), x(c);
}
const h = `
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
</style>`;
let l = null, d = null;
function E() {
  if (l)
    return l;
  l = document.createElement("div"), Object.assign(l.style, {
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
  const e = document.createElement("div");
  e.textContent = "选择编辑器", e.style.fontWeight = "bold", e.style.marginBottom = "8px", l && l.appendChild(e), u.forEach((o) => {
    const i = document.createElement("button");
    i.textContent = `${o.icon || ""} ${o.name}`, Object.assign(i.style, {
      padding: "6px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background: d === o.name.toLowerCase() ? "#e6f7ff" : "#fff",
      cursor: "pointer",
      marginBottom: "8px"
    }), i.addEventListener("click", () => {
      d = o.name.toLowerCase(), l && u.forEach((c, r) => {
        const a = l == null ? void 0 : l.children[r + 1];
        a.tagName === "BUTTON" && (a.style.background = "#fff");
      }), i.style.background = "#e6f7ff";
    }), l && l.appendChild(i);
  });
  const t = document.createElement("button");
  return t.textContent = "确定", Object.assign(t.style, {
    padding: "6px 12px",
    border: "1px solid #1890ff",
    borderRadius: "4px",
    background: "#1890ff",
    color: "#fff",
    cursor: "pointer",
    width: "100%"
  }), t.addEventListener("click", () => {
    d && (localStorage.setItem(p, d), _(!1), u.find(
      (i) => i.name.toLowerCase() === d
    ) && window.__click2component_pending_file && (y(window.__click2component_pending_file), window.__click2component_pending_file = null));
  }), l && (l.appendChild(t), document.body.appendChild(l)), l;
}
function _(e) {
  const t = E();
  t.style.display = e ? "flex" : "none";
}
function w(e, t) {
  var r, a;
  if (!t.enabled) {
    console.log("[Click2Component] 功能未启用");
    return;
  }
  if (f("hover"), !(t.key === "Alt" || t.key === "Option" ? e.altKey : t.key === "Shift" ? e.shiftKey : t.key === "Control" ? e.ctrlKey : t.key === "Meta" ? e.metaKey : e.altKey)) {
    document.body.removeAttribute("vue-click-to-component");
    return;
  }
  document.body.setAttribute("vue-click-to-component", "");
  const i = e.target, c = g(i);
  if (c) {
    const { instance: n, line: s } = c;
    C(i, "hover"), console.log("[Click2Component] 已高亮组件元素:", {
      element: i.tagName,
      componentFile: n.__file || ((r = n.type) == null ? void 0 : r.__file) || ((a = n.$options) == null ? void 0 : a.__file),
      line: s
    });
  }
}
window.__click2component_pending_file = null;
function K(e, t) {
  var s, m;
  if (!(t != null && t.enabled) || !(t.key === "Alt" || t.key === "Option" ? e.altKey : t.key === "Shift" ? e.shiftKey : t.key === "Control" ? e.ctrlKey : t.key === "Meta" ? e.metaKey : e.altKey) || (e == null ? void 0 : e.button) !== 0)
    return;
  const i = e.target, c = g(i);
  if (!c)
    return;
  e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
  const { instance: r, line: a } = c, n = r.__file || ((s = r.type) == null ? void 0 : s.__file) || ((m = r.$options) == null ? void 0 : m.__file);
  console.log("[Click2Component] 点击处理:", {
    element: i.tagName,
    componentFile: n,
    line: a
  }), n && y(n, a);
}
function P(e, t = {}) {
  console.log("[Click2Component] 初始化插件，配置:", t);
  const o = { ...k, ...t };
  if (console.log("[Click2Component] 最终配置:", o), !o.enabled) {
    console.log("[Click2Component] 插件未启用");
    return;
  }
  let i = !1;
  const c = () => {
    if (i)
      return;
    document.head.insertAdjacentHTML("beforeend", h), console.log("[Click2Component] 已添加高亮样式");
    const r = (n) => K(n, o), a = (n) => w(n, o);
    document.addEventListener("click", r, !0), document.addEventListener("mousemove", a, !0), console.log("[Click2Component] 已添加事件监听器"), window.addEventListener("keyup", (n) => {
      (o.key === "Alt" || o.key === "Option" ? n.altKey : o.key === "Shift" ? n.shiftKey : o.key === "Control" ? n.ctrlKey : o.key === "Meta" ? n.metaKey : n.altKey) || (f(), document.body.removeAttribute("vue-click-to-component"));
    }), window.addEventListener("blur", () => {
      f(), document.body.removeAttribute("vue-click-to-component");
    }), i = !0;
  };
  c(), e.mixin({
    mounted() {
      c();
    },
    unmounted() {
    }
  }), e.config.globalProperties.$router && e.config.globalProperties.$router.afterEach(() => {
    setTimeout(c, 0);
  });
}
const O = {
  install: P
};
export {
  O as default
};
