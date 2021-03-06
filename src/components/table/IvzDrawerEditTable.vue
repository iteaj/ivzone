<template>
    <a-locale-provider :locale="zhCN">
        <a-drawer @close="$emit('close', this)" :visible="visible"
                  :wrapStyle="{overflow: 'auto'}" :placement="placement"
                  :closable="false" :mask-closable="maskClosable" :mask="mask" :mask-style="{}"
                  wrapClassName="ivz-drawer-edit-wrap" :height="height">
            <slot name="header"></slot>
            <ivz-edit-table :data="data" :table-metas="tableMetas" :action-metas="actionMetas"
                :table-config="config.table" ref="tableRef" @finished="mountFinished">
                <template #action="{row, index}">
                    <slot name="action" :row="row" :index="index"></slot>
                </template>
                <template v-for="meta in tableAliasMetas" #[meta.tableSlot]="{value, row, index}">
                    <slot :name="meta.tableSlot" :value="value" :row="row" :index="index"></slot>
                </template>
            </ivz-edit-table>
            <div class="ivz-opera-row" style="text-align: center">
                <slot name="submit">
                    <a-button class="ivz-button-action" @click="cancel">关闭</a-button>
                    <a-button class="ivz-button-action" @click="add" type="primary">新增</a-button>
                    <a-button class="ivz-button-action" @click="freshen" type="dashed">刷新</a-button>
                </slot>
            </div>
        </a-drawer>
    </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'
export default {
    name: 'IvzDrawerEditTable',
    props: {
        height: {default: 248},
        mask: {type: Boolean, default: true},
        data: {type: Array, default: () => []},
        placement: {type: String, default: 'top'}, // 取值top or bottom
        maskClosable: {type: Boolean, default: true},
        metas: {type: Array, default: () => [], required: true},
        config: {type: Object, default: () => {}, required: true},
        actionMetas: {type: Object, default: () => {}, required: true}
    },
    data () {
        return {
            zhCN,
            oriModel: {},
            addMeta: null,
            visible: false,
            tableMetas: null,
            tableAliasMetas: [],
        }
    },
    created () {
        this.$resolver.initDefaultTableConfig(this.config.table, this);
        this.tableMetas = this.$resolver.resolverTableMetas(this.metas
            , this.config.table, this, meta=>{
                if(meta.tableSlot) {
                    this.tableAliasMetas.push(meta);
                }
                this.$resolver.resolverMetaDefaultValue(meta, this.oriModel);
        })
    },
    mounted () {
        this.addMeta = this.actionMetas['Add'];
    },
    methods: {
        open () {
            this.visible = true
            this.freshen();
        },
        add () {
            let length = this.tableRef.data ? this.tableRef.data.length : 0;
            let editModel = this.$utils.assignVueProperty({}, this.oriModel, this);
            this.tableRef.actionHandle(this.addMeta, editModel, length)
        },
        cancel () {
            this.visible = false;
            this.tableRef.resetBackModel()
        },
        freshen () {
            if(this.tableRef) {
                this.tableRef.query();
                this.tableRef.resetBackModel()
            }
        },
        mountFinished (tableRef) {
            this.tableRef = tableRef
            this.freshen();
        }
    }
}
</script>

<style>
    .ivz-drawer-edit-wrap .ivz-opera-row {
        height: 42px;
        width: 100%;
        bottom: 3px;
        line-height: 42px;
        position: absolute;
        border-top: 1px solid #e8e8e8;
    }
    .ivz-drawer-edit-wrap .ant-drawer-body {
        padding: 24px 24px 2px 24px;
    }
</style>
