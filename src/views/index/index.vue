<template>
    <a-layout style="height: 100%" class="ivz-index-layout">
        <a-layout-sider :trigger="null" collapsible :width="232" @breakpoint="breakpoint"
              :collapsed="isCollapsed" :collapsedWidth="72" breakpoint="lg" :class="'ivz-theme-'+theme">
          <div class="ivz-sider-menu">
              <div class="ivz-avatar" @click="collapsed">
                  <div class="ivz-avatar-center">
                      <a-avatar :size="64" :src="izStx + '/img/logo.png'"/>
                  </div>
                  <div class="ivz-avatar-name">
                      <span style="font-size: 16px">{{sysName}}</span>
                  </div>
              </div>
              <a-menu @select="selectMenu" mode="inline" :inline-collapsed="isCollapsed"
                      :openKeys="openKeys" :theme="theme" @openChange="openChange" :selectedKeys="selectedKeys">
                  <template v-if="activityView.type == 'M'" v-for="menu in menus">
                      <a-menu-item v-if="!menu.children" :key="menu.url">
                          <ivz-icon type="icon-tuichu" ></ivz-icon>
                          <span>{{menu.name}}</span>
                      </a-menu-item>
                      <ivz-sub-menu v-else :menus="menu" :key="menu.url"></ivz-sub-menu>
                  </template>
                  <template v-else-if="activityView.type == 'G'" v-for="menu in menus">
                      <a-menu-item-group :key="menu.url">
                          <template slot="title">
                              <ivz-icon :type="menu.icon"></ivz-icon>
                              <span>{{ menu.name }}</span>
                          </template>&nbsp;
                          <a-menu-item v-for="item in menu.children" :key="item.url">
                              <ivz-icon :type="item.icon"></ivz-icon>
                              <span>{{ item.name }}</span>
                          </a-menu-item>
                      </a-menu-item-group>
                  </template>
              </a-menu>
          </div>
        </a-layout-sider>
        <a-layout style="overflow: hidden; background: #ffffff;">
            <a-layout-header class="layout-header-bar">
                <div class="ivz-header-row">
                    <div class="ivz-header-col iz-header-col-left">
                        <ul style="list-style: none; padding: 0px; margin: 0px; float: left">
                            <li v-for="view in viewMenu" :key="view.id" :class="view==activityView?'iz-view-activity':null"
                                style="float: left" @click="viewHandler(view)" class="iz-view-col">
                                <ivz-icon :type="view.icon" size="16px"></ivz-icon>&nbsp;{{view.name}}
                            </li>
                            <li style="clear: both"></li>
                        </ul>
                    </div>
                    <div class="ivz-header-col ivz-header-col-right">
                        <ul style="list-style: none; padding: 0px; margin: 0px">
                            <li class="ivz-opera-col">
                                <a-dropdown placement="bottomCenter" class="ivz-opera-more">
                                    <div>
                                        <a-avatar :src="avatarUrl" :size="28" :loadError="loadError"></a-avatar>
                                        <span style="font-size: 14px;"> 欢迎, {{user.name}}</span>
                                    </div>
                                    <a-menu slot="overlay" @click="moreOpera">
                                        <a-menu-item key="info">
                                            <ivz-icon type="iz-icon-user-info"></ivz-icon>
                                            <span>个人信息</span>
                                        </a-menu-item>
                                        <a-menu-divider />
                                        <a-menu-item key="logout">
                                            <ivz-icon type="iz-icon-logout"></ivz-icon>
                                            <span>退出登录</span>
                                        </a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                            </li>
                            <li class="ivz-opera-col" @click="handleNotify">
                                <a-tooltip title="系统通知">
                                    <div><ivz-icon type="iz-icon-notify" size="18px"></ivz-icon></div>
                                </a-tooltip>
                            </li>
                            <li class="ivz-opera-col ivz-global-search">
                                <a-auto-complete dropdownClassName="ivz-search-dropdown" :dropdownStyle="{width: '300px'}"
                                         :dropdownMatchSelectWidth="true" style="width: 100%" optionLabelProp="value"
                                         placeholder="输入要搜索的内容" :filterOption="completeFilter">
                                    <template slot="dataSource">
                                        <a-select-opt-group v-for="group in searchSource" :key="group.label">
                                            <span slot="label">
                                                {{group.label}}<a style="float: right">类型</a>
                                            </span>
                                            <a-select-option v-for="item in group.children" :key="item.label" :value="item.label">
                                                <span @click="completeSelect(group, item)" style="display: inline-block; width: 100%">
                                                    {{item.label}}
                                                    <span style="float: right">{{group.type}}</span>
                                                </span>
                                            </a-select-option>
                                        </a-select-opt-group>
                                    </template>
                                </a-auto-complete>
                            </li>
                            <li style="clear: both"></li>
                        </ul>
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div class="ivz-task-bar">
                    <a-tabs :active-key="activityMenu.url" @change="switchTask" :hide-add="true"
                            @edit="closeTask" type="editable-card" size="small">
                        <a-tab-pane v-for="menu in taskBarData" :key="menu.url" :closable="menu.closable != false">
                            <span slot="tab" style="line-height: 30px;">
                                <span class="circle">
                                    <ivz-icon :type="menu.icon" :style="{fontSize: '16px'}"></ivz-icon>
                                </span>
                                <span style="margin-left: 2px">{{menu.name}}</span>
                            </span>
                        </a-tab-pane>
                    </a-tabs>
                    <div class="ivz-task-opera right">
                        <a-dropdown placement="bottomLeft">
                            <span>
                              <ivz-icon type="iz-icon-more" size="18px"></ivz-icon>
                            </span>
                            <a-menu slot="overlay" @click="taskBarCloseMoreOpera">
                                <a-menu-item key="other">
                                    <ivz-icon type="iz-icon-close-other"></ivz-icon>
                                    <span>关闭其他</span>
                                </a-menu-item>
                                <a-menu-item key="all">
                                    <ivz-icon type="iz-icon-close-all"></ivz-icon>
                                    <span>关闭所有</span>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                </div>
            </a-layout-header>
            <div id="slider-drawer">
                <ivz-notify-drawer ref="notifyDrawer"></ivz-notify-drawer>
                <ivz-setting-drawer ref="settingDrawer" :model="user" :config="config"></ivz-setting-drawer>
            </div>
            <a-layout-content ref="layoutContent" class="iz-main-container">
                <div class="ivz-content-iframe">
                    <transition-group name="list">
                        <iframe v-for="menu in taskBarData" :key="menu.url" :id="menu.url" :name="menu.name" :src="izCtx + menu.url"
                                frameBorder="false" v-show="menu==activityMenu" width="100%" height="100%"></iframe>
                    </transition-group>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
import CacheApi from '@/utils/cache.utils'
import Global from "@/components/global.config"
import IvzSubMenu from '@/components/basic/IvzSubMenu'
import IvzNotifyDrawer from "@/components/basic/IvzNotifyDrawer";
import IvzSettingDrawer from "@/components/basic/IvzSettingDrawer";
export default {
    name: 'index',
    components: {IvzSettingDrawer, IvzNotifyDrawer, IvzSubMenu},
    data () {
        return {
            menus: [],
            height: '100%',
            viewMenu: [],
            user: {},
            config: null,
            sysName: '',
            openKeys: [],
            theme: 'dark', // 主题 dark or light
            avatarUrl: null,
            notifyVisible: false,
            expandMode: 'single', // 菜单展开模式 (single || multi)
            searchValue: null,
            searchSource: [
                {label: '最近搜索', type: '菜单', call: () => {}, children: [
                        {label: '组件', value: null}
                    ]}
            ], // 搜索框使用的数据源
            fixedSider: false, // 固定侧边栏
            isCollapsed: false,
            activityMenu: {url: ''}, // 激活的菜单
            activityView: null, // 激活的视图
            selectedKeys: [], // 当前选中的菜单
            taskBarData: CacheApi.taskBarData, // 任务栏数据
            workMenu: null
        }
    },
    created () {
        CacheApi.getResources().then(menus => {
            this.viewMenu = menus;
            this.activityView = this.viewMenu[0];
            this.menus = this.activityView['children'] || []
        });
        CacheApi.getConfig().then(env => {
            this.user = env['user'];
            this.config = env['config'];
            this.avatarUrl = this.user['avatar'];
            this.sysName = this.config['sys_name'] ? this.config['sys_name']['value'] : '参数异常';
            let mainUrl = this.config['main_url'];
            this.$refs['settingDrawer'].init(this.user);
            if(mainUrl.value && mainUrl.value.trim().length>0) {
                this.workMenu = {name: this.config['main_name'].value
                    , url: this.config['main_url'].value, id: 0, closable: false, icon: 'iz-icon-work'};
                this.activityMenu = this.workMenu;
                this.taskBarData.splice(0, 0, this.workMenu);
            }

            this.expandMode = this.config['expand_mode'] ? this.config['expand_mode']['value'] : 'single'
        });
    },
    mounted () {
        let _this = this;
        CacheApi.activityMenuRegister = (activityMenu, refresh) => {
            _this.activityMenu = activityMenu;
            _this.selectedKeys[0] = activityMenu['url'];
            if(refresh) { // 如果当前的页面需要重新刷新
                let iframes = window.document.getElementsByTagName("iframe");
                for(let iframe of iframes) {
                    if(iframe.id == activityMenu['url']) {
                        iframe.contentWindow.location.reload();
                        break;
                    }
                }

            }
        }
    },
    methods: {
        callback () {},
        loadError () { // 头像地址加载错误, 换回logo
            this.avatarUrl = this.izStx + '/img/logo.png';
            return false
        },
        switchTask (url) { // 切换任务菜单处理
            if(this.isWorkMenu(url)) {
                this.activityMenu = this.workMenu;
                this.selectedKeys[0] = '';
            } else {
                this.openMenu(url);
            }
        },
        closeTask (url, action) { // 关闭任务处理
            let prevTemp = null; // 用来保存当前关闭的上一个任务
            this.taskBarData.forEach((item, index, ori) => {
                if(item['url'] === url) {
                    prevTemp = ori[index-1]; // 获取要删除的前一个
                    ori.splice(index, 1);
                    if(!prevTemp) prevTemp = ori[index];
                }
            });

            if(prevTemp) {
                this.switchTask(prevTemp['url']);
            } else {
                this.selectedKeys[0] = '';
            }
        },
        selectMenu (item) { // 选中菜单处理
            let url = item.key;
            this.openMenu(url);
            this.selectedKeys = item['selectedKeys'];
        },
        reloadCurrentIFrame (menu) {
            document.getElementById(menu.id).contentWindow.location.reload()
        },
        moreOpera (item) {
            if (item.key === 'logout') {
                this.$http.get(Global.logoutUrl).then(()=>{
                    location.href = this.izCtx + Global.loginUrl;
                });
            } else if(item.key === 'info') {
                this.$refs['notifyDrawer'].close();
                this.$refs['settingDrawer'].toggle();
            }
        },
        viewHandler (view) {
            if(view.type == 'G' && this.isCollapsed) {
                this.collapsed();
            }
            this.activityView = view;
            let menus = view['children'];
            this.menus = menus || []
        },
        openMenu (url) {
            CacheApi.openMenu(url)
        },
        taskBarCloseMoreOpera (item) { // 任务栏菜单关闭处理
            let start = this.workMenu ? 1 : 0;
            if (item.key === 'all') {
                if(this.workMenu) {
                    this.activityMenu = this.workMenu;
                    this.selectedKeys[0] = this.activityMenu['url']
                }

                this.taskBarData.splice(start, this.taskBarData.length)
            } else { // 关闭除当前激活的任务以外的所有任务
                let position = 1
                for(let index=0; index < this.taskBarData.length; index++) {
                    let item = this.taskBarData[index];
                    if (item === this.activityMenu) {
                        position = index; break;
                    }
                }
                this.taskBarData.splice(position + 1, this.taskBarData.length - position - 1)
                this.taskBarData.splice(start, Math.abs(position - start))
            }
        },
        isWorkMenu(url) {
            return this.workMenu && this.workMenu.url == url;
        },
        collapsed() {
            if(this.activityView.type == 'G') return;

            this.isCollapsed = !this.isCollapsed
        },
        breakpoint (broken) { // 响应式处理
            this.isCollapsed = broken
        },
        openChange (openKeys) { // 菜单展开模式处理
            if (this.expandMode === 'single') {
                let lastKey = openKeys.find(key => this.openKeys.indexOf(key) === -1) // 最后打开的菜单
                if (CacheApi.rootKeys.indexOf(lastKey) === -1) { // 说明还在同一个父菜单内
                    this.openKeys = openKeys
                } else {
                    this.openKeys = [lastKey]
                }
            } else if (this.expandMode === 'multi') {
                this.openKeys = openKeys
            } else {
                this.openKeys = openKeys;
                this.$log.errorLog('菜单展开模式错误可选[single || multi]', '请检查系统配置参数')
            }
        },
        completeSelect(group, option) {
            if(option && group.call) {
                group.call(option);
            } else {
                this.$log.warningLog("注册的搜索事件中, 未指定回调函数：call"
                    , "注册的时候设置e.g：call: ()=>{}", group)
            }
        },
        completeFilter(value, option) {
            return true;
        },
        handleNotify() {
            // this.$refs['notifyDrawer'].toggle();
            // this.$refs['settingDrawer'].close();
        }
    }
}
</script>
