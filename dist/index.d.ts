import { App } from "vue";
declare global {
    interface Window {
        __click2component_pending_file: string | null;
        __WEBPACK_CONFIG__?: {
            context?: string;
            output?: {
                publicPath?: string;
            };
        };
        webpackHotUpdate?: any;
        __VUE_CLI_CONTEXT__?: string;
        __vue_app_config__?: any;
        __webpack_public_path__?: string;
        process?: {
            env?: {
                BASE_URL?: string;
                VUE_APP_PROJECT_ROOT?: string;
                HOME?: string;
            };
        };
    }
}
interface Options {
    enabled?: boolean;
    key?: string;
    defaultEditor?: string;
    autoDetectRoot?: boolean;
}
declare global {
    interface Window {
        __click2component_pending_file: string | null;
    }
}
declare function install(app: App, options?: Options): void;
declare const _default: {
    install: typeof install;
};
export default _default;
