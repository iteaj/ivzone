// 首页(index)挂载到window, iframe挂载到window.parent
import Utils from '../utils/basic.utils'

let defaultGlobalConfig = {
    izCtx: '',
    izStx: '',
    envUrl: '/env', // 获取环境配置Url
    loginUrl: '/login', // 登录地址
    logoutUrl: '/logout', // 注销系统
    captchaUrl: '/captcha', // 验证码地址
    dictUrl: '/core/dictData/listByType', // 获取字典数据url
    resourcesUrl: '/resources', // 获取菜单资源Url
    dictLabelField: 'label', // 字典名称字段
    dictValueField: 'value', // 字典值字段
    iconUrl: '//at.alicdn.com/t/font_1174643_k7u490ljfw9.js' // 图标链接
}

let ivzGlobalConfig = window.ivzGlobalConfig || window.parent.ivzGlobalConfig
// 全局配置如果存在, 则合并默认(不存在使用默认)
if (ivzGlobalConfig) Utils.mergeObject(ivzGlobalConfig, defaultGlobalConfig)
else ivzGlobalConfig = window.ivzGlobalConfig = defaultGlobalConfig // 不存在使用默认

export default ivzGlobalConfig