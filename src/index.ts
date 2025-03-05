import { App, ComponentPublicInstance } from "vue";

interface Options {
  enabled?: boolean;
  key?: string;
  defaultEditor?: string;
}

interface ComponentLocation {
  start?: {
    line?: number;
  };
}

interface VueComponentType {
  __file?: string;
  name?: string;
  __loc?: ComponentLocation;
}

interface VueComponentInstance {
  type: VueComponentType;
  parent?: VueComponentInstance;
  component?: ComponentInstance;
  __file?: string;
}

interface Vue2Element extends Element {
  __vue__?: ComponentInstance;
}

interface Vue3Element extends Element {
  __vueParentComponent?: VueComponentInstance;
}

interface ComponentInstance extends Omit<ComponentPublicInstance, "$options"> {
  __file?: string;
  $options?:
    | {
        __file?: string;
        name?: string;
        __loc?: ComponentLocation;
      }
    | ComponentPublicInstance["$options"];
  type?: VueComponentType;
  parent?: VueComponentInstance;
}

interface EditorConfig {
  name: string;
  protocol: string;
  icon?: string;
}

const SUPPORTED_EDITORS: EditorConfig[] = [
  { name: "VS Code", protocol: "vscode://file", icon: "📝" },
  { name: "Cursor", protocol: "cursor://file", icon: "✨" },
];

const EDITOR_STORAGE_KEY = "click2component_editor";

const defaultOptions: Options = {
  enabled: true,
  key: "Alt",
  defaultEditor: "vscode",
};

function isVue2Element(el: Element): el is Vue2Element {
  return "__vue__" in el;
}

function isVue3Element(el: Element): el is Vue3Element {
  return "__vueParentComponent" in el;
}

function findComponentInstance(
  el: Element
): { instance: ComponentInstance; line?: number } | null {
  // Vue 3
  if (isVue3Element(el) && el.__vueParentComponent) {
    let parent = el.__vueParentComponent;
    while (parent) {
      if (parent?.type?.__file) {
        // 尝试获取组件定义的行号
        const line = parent.type.__loc?.start?.line;
        return {
          instance: parent as unknown as ComponentInstance,
          line: line,
        };
      }
      if (!parent?.parent) break;
      parent = parent.parent;
    }
  }

  // Vue 2
  if (isVue2Element(el) && el.__vue__) {
    const instance = el.__vue__;
    const line = instance.$options?.__loc?.start?.line;
    return {
      instance,
      line,
    };
  }

  return null;
}

function setTarget(el: Element, type = "") {
  el.setAttribute("vue-click-to-component-target", type);
}

function cleanTarget(type?: string) {
  let targetElList: NodeListOf<Element>;

  if (type) {
    targetElList = document.querySelectorAll(
      `[vue-click-to-component-target="${type}"]`
    );
  } else {
    targetElList = document.querySelectorAll("[vue-click-to-component-target]");
  }

  targetElList.forEach((el) => {
    el.removeAttribute("vue-click-to-component-target");
  });
}

const openWithProtocol = (href: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.click();
};

function openEditor(sourceCodeLocation: string, line?: number) {
  const savedEditor = localStorage.getItem(EDITOR_STORAGE_KEY);
  if (!savedEditor) {
    window.__click2component_pending_file = sourceCodeLocation;
    selectedEditor = null;
    toggleOverlay(true);
    return;
  }

  const editorConfig = SUPPORTED_EDITORS.find(
    (e) => e.name.toLowerCase() === savedEditor.toLowerCase()
  );

  if (!editorConfig) {
    console.warn(`不支持的编辑器: ${savedEditor}`);
    return;
  }

  let fileUrl = sourceCodeLocation.startsWith("/")
    ? `${editorConfig.protocol}${sourceCodeLocation}`
    : `${editorConfig.protocol}/${sourceCodeLocation}`;

  // 添加行号
  if (line) {
    fileUrl += `:${line}`;
  }

  console.log("[Click2Component] 打开文件:", fileUrl);
  openWithProtocol(fileUrl);
}

const HIGHLIGHT_STYLE = `
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

let overlay: HTMLDivElement | null = null;
let selectedEditor: string | null = null;

function createOverlay() {
  if (overlay) return overlay;

  overlay = document.createElement("div");
  Object.assign(overlay.style, {
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
    gap: "8px",
  });

  const title = document.createElement("div");
  title.textContent = "选择编辑器";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "8px";
  if (overlay) overlay.appendChild(title);

  SUPPORTED_EDITORS.forEach((editor) => {
    const button = document.createElement("button");
    button.textContent = `${editor.icon || ""} ${editor.name}`;
    Object.assign(button.style, {
      padding: "6px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background:
        selectedEditor === editor.name.toLowerCase() ? "#e6f7ff" : "#fff",
      cursor: "pointer",
      marginBottom: "8px",
    });

    button.addEventListener("click", () => {
      selectedEditor = editor.name.toLowerCase();
      if (overlay) {
        SUPPORTED_EDITORS.forEach((_, i) => {
          const btn = overlay?.children[i + 1] as HTMLElement;
          if (btn.tagName === "BUTTON") {
            btn.style.background = "#fff";
          }
        });
      }
      button.style.background = "#e6f7ff";
    });
    if (overlay) overlay.appendChild(button);
  });

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "确定";
  Object.assign(confirmButton.style, {
    padding: "6px 12px",
    border: "1px solid #1890ff",
    borderRadius: "4px",
    background: "#1890ff",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
  });

  confirmButton.addEventListener("click", () => {
    if (selectedEditor) {
      localStorage.setItem(EDITOR_STORAGE_KEY, selectedEditor);
      toggleOverlay(false);
      const editorConfig = SUPPORTED_EDITORS.find(
        (e) => e.name.toLowerCase() === selectedEditor
      );
      if (editorConfig && window.__click2component_pending_file) {
        openEditor(window.__click2component_pending_file);
        window.__click2component_pending_file = null;
      }
    }
  });

  if (overlay) {
    overlay.appendChild(confirmButton);
    document.body.appendChild(overlay);
  }
  return overlay;
}

function toggleOverlay(show: boolean) {
  const overlay = createOverlay();
  overlay.style.display = show ? "flex" : "none";
}

function handleMouseMove(e: MouseEvent, options: Options) {
  if (!options.enabled) {
    console.log("[Click2Component] 功能未启用");
    return;
  }

  cleanTarget("hover");

  const isKeyPressed =
    options.key === "Alt" || options.key === "Option"
      ? e.altKey
      : options.key === "Shift"
      ? e.shiftKey
      : options.key === "Control"
      ? e.ctrlKey
      : options.key === "Meta"
      ? e.metaKey
      : e.altKey;

  if (!isKeyPressed) {
    document.body.removeAttribute("vue-click-to-component");
    return;
  }

  document.body.setAttribute("vue-click-to-component", "");
  const target = e.target as Element;
  const result = findComponentInstance(target);

  if (result) {
    const { instance, line } = result;
    setTarget(target, "hover");
    console.log("[Click2Component] 已高亮组件元素:", {
      element: target.tagName,
      componentFile:
        instance.__file || instance.type?.__file || instance.$options?.__file,
      line: line,
    });
  }
}

declare global {
  interface Window {
    __click2component_pending_file: string | null;
  }
}

window.__click2component_pending_file = null;

function handleClick(e: MouseEvent, options: Options) {
  if (!options?.enabled) return;

  const isKeyPressed =
    options.key === "Alt" || options.key === "Option"
      ? e.altKey
      : options.key === "Shift"
      ? e.shiftKey
      : options.key === "Control"
      ? e.ctrlKey
      : options.key === "Meta"
      ? e.metaKey
      : e.altKey;

  if (!isKeyPressed || e?.button !== 0) return;

  const target = e.target as Element;
  const result = findComponentInstance(target);

  if (!result) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const { instance, line } = result;
  const sourceCodeLocation =
    instance.__file || instance.type?.__file || instance.$options?.__file;

  console.log("[Click2Component] 点击处理:", {
    element: target.tagName,
    componentFile: sourceCodeLocation,
    line: line,
  });

  if (sourceCodeLocation) {
    openEditor(sourceCodeLocation, line);
  }
}

function install(app: App, options: Options = {}) {
  console.log("[Click2Component] 初始化插件，配置:", options);

  const finalOptions = { ...defaultOptions, ...options };
  console.log("[Click2Component] 最终配置:", finalOptions);

  if (!finalOptions.enabled) {
    console.log("[Click2Component] 插件未启用");
    return;
  }

  let initialized = false;
  const initialize = () => {
    if (initialized) return;

    // 添加高亮样式
    document.head.insertAdjacentHTML("beforeend", HIGHLIGHT_STYLE);
    console.log("[Click2Component] 已添加高亮样式");

    const clickHandler = (e: MouseEvent) => handleClick(e, finalOptions);
    const mouseMoveHandler = (e: MouseEvent) =>
      handleMouseMove(e, finalOptions);

    document.addEventListener("click", clickHandler, true);
    document.addEventListener("mousemove", mouseMoveHandler, true);
    console.log("[Click2Component] 已添加事件监听器");

    // 修改键盘事件监听，支持自定义键位
    window.addEventListener("keyup", (e) => {
      const isKeyPressed =
        finalOptions.key === "Alt" || finalOptions.key === "Option"
          ? e.altKey
          : finalOptions.key === "Shift"
          ? e.shiftKey
          : finalOptions.key === "Control"
          ? e.ctrlKey
          : finalOptions.key === "Meta"
          ? e.metaKey
          : e.altKey;

      if (!isKeyPressed) {
        cleanTarget();
        document.body.removeAttribute("vue-click-to-component");
      }
    });

    window.addEventListener("blur", () => {
      cleanTarget();
      document.body.removeAttribute("vue-click-to-component");
    });

    initialized = true;
  };

  // 初始化
  initialize();

  app.mixin({
    mounted() {
      // 确保在每次组件挂载时都重新初始化
      initialize();
    },
    unmounted() {
      // 不需要在unmounted时移除事件监听器，因为我们希望它们持续存在
    },
  });

  // 监听路由变化（适用于 vue-router 4.x）
  if (app.config.globalProperties.$router) {
    app.config.globalProperties.$router.afterEach(() => {
      // 确保在路由变化后重新初始化
      setTimeout(initialize, 0);
    });
  }
}

export default {
  install,
};
