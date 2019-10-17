import Vue from 'vue';
declare const AppProps: import("vue").VueConstructor<{
    propMessage: string;
} & Vue>;
export default class App extends AppProps {
    msg: string;
    helloMsg: string;
    mounted(): void;
    readonly computedMsg: string;
    greet(): void;
}
export {};
