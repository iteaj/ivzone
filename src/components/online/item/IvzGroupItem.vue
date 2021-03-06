<template>
    <a-col span="24" class="ivz-group-item" @click.stop="activeHandle"
           :class="model.id == global.active ? 'ivz-group-active' : null">
        <div class="ivz-gi-header" v-show="model.name">
            <div style="float: left">{{model.name}}</div>
        </div>
        <draggable :list="meta.children" :options="options" group="item"
                   :animation='global.animation' class="ivz-gi-drag">
            <template :span="global.span" v-for="item in meta.children">
                <ivz-form-item :global="global" :meta="item" type="table" :ref="item.id"
                    :data-id="item.id" :key="item.id" :view="view"  @delMetaItem="delMetaItem" />
            </template>
        </draggable>
        <div class="ivz-group-del" @click.stop="delMetaItem(meta)">
            <span style="width: 36px; text-align: center; display: inline-block; cursor: pointer">
                <ivz-icon type="iz-icon-delete" :style="{fontSize: '18px'}"></ivz-icon>
            </span>
        </div>
    </a-col>
</template>

<script>
    import draggable from "vuedraggable";
    import IvzFormItem from "@/components/online/item/IvzFormItem";
    import EditMetas from "@/components/online/EditMetas";
    export default {
        name: "IvzGroupItem",
        props: ["meta", "global", "view"],
        components: {draggable, IvzFormItem},
        data() {
            return {
                options: {
                    type: 'group',
                    ghostClass: 'ghost',
                    // forceFallback: true,
                    chosenClass: 'active',
                    dragClass: 'drag-handle'
                },
                model: null,
                isActive: false,
            }
        },
        created() {
            this.initItem();
            this.activeHandle(); // 刚拖拽的项默认激活
        },
        methods: {
            initItem() {
                let model = this.meta['model'];
                if(model) {
                    this.model = model;
                } else {
                    this.model = EditMetas.getItemModel(this.meta.type);

                    this.model['id'] = this.meta.id;
                    this.model['type'] = this.meta.type;
                    this.meta['model'] = this.model;
                }

            },
            activeHandle() {
                this.global.active = this.model.id;

                this.global.editModel = this.model;
                this.global.editMetas = EditMetas.getItemMetas(this.meta.type);
            },
            delMetaItem(meta) {
                this.activeHandle();
                this.global.delItem(meta);
            },
            resolverGroupToMeta(valid) {
                if(valid) {
                    let itemMetas = EditMetas.getItemMetas(this.meta.type);
                    for(let meta of itemMetas) {
                        if(meta.metas && meta.metas.length > 0) {
                            for(let item of meta.metas) {
                                if(item.rules) {
                                    if(!this.model[item.field]) {
                                        this.activeHandle();
                                        this.$msg.warningMessage(`${item.title}必填`);
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
                let groupMeta = EditMetas.resolverGroupToMeta(this.model, this.global);
                let formMetas = groupMeta.metas || groupMeta.children;

                if(!this.$utils.isBlank(this.meta.children)) {
                    for(let meta of this.meta.children) {
                        let metaRef = this.$refs[meta.id][0];

                        let viewMeta = metaRef.resolverItemToMeta(valid);
                        if(viewMeta === false) return false;

                        formMetas.push(viewMeta);
                    }
                }

                return groupMeta
            }
        }
    }
</script>

<style scoped>
    .ivz-group-item {
        display: flex;
        min-height: 102px;
        display: -ms-flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-between;
        border: 1px dashed darkorange!important;
    }
    .ivz-group-del {
        right: 0px;
        bottom: 0px;
        height: 30px;
        display: none;
        line-height: 30px;
        border-radius: 3px;
        position: absolute;
        background: #efefef;
        padding: 0px 0px 0px 3px;
    }
    .ivz-group-active .ivz-group-del {
        display: block!important;
    }
    .ivz-gi-drag {
        flex-grow: 1;
        margin: 3px 0px;
    }
    .ivz-gi-header {
        height: 36px;
        padding-left: 12px;
        line-height: 36px;
        background: #f4f6fc;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
</style>
