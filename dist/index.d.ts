import { App } from "vue";
interface Options {
    enabled?: boolean;
    key?: string;
    defaultEditor?: string;
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
