import { createApp } from 'vue';
import { createPinia } from 'pinia';

import AppElEment from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'cesium/Build/Cesium/Widgets/widgets.css';
// 全局唯一样式入口：EP 组件样式(SCSS 源) + 设计/语义令牌 + 基础层 + EP 绑定 + 补丁 + 工具层
// normalize 与 EP 编译产物已由该入口承接，勿再单引
import '@/styles/index.scss';

const app = createApp(AppElEment);

app.use(createPinia());
app.use(router);
app.use(ElementPlus, { locale: zhCn });

app.mount('#app');
