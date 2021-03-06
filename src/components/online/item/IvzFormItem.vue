<template>
    <a-col :span="model.span || view.span" @click.stop="activeHandle"
           :class="model.id == global.active ? 'ivz-item-active' : null">
        <div class="ivz-form-item">
            <a-form-model-item :label="model.label" :prop="meta.id" :required="model.required"
                    :extra="model.extra" :label-col="model.labelCol" :wrapper-col="model.wrapperCol">
                <a-tree v-if="meta.type == 'tree'" :disabled="model.disabled" :replaceFields="{title: 'label', key: 'value'}"
                        :treeData="model.options" :checkable="model.checkable" v-model="model[meta.id]"></a-tree>
                <a-rate v-else-if="meta.type == 'rate'" :disabled="model.disabled"
                        :allowHalf="model.allowHalf" :count="model.count" v-model="model[meta.id]" />
                <a-slider v-else-if="meta.type == 'slider'" :disabled="model.disabled" v-model="model[meta.id]"
                        :min="model.min" :max="model.max" :step="model.step"></a-slider>
                <a-switch v-else-if="meta.type == 'switch'" :checkedChildren="model['checkedChildren']"
                          :disabled="model.disabled" v-model="model[meta.id]" :unCheckedChildren="model['unCheckedChildren']"/>
                <a-upload v-else-if="meta.type == 'upload'" :disabled="model.disabled">
                    <a-button><a-icon type="upload" /> 点击上传 </a-button>
                </a-upload>
                <a-input v-else-if="meta.type == 'text'" v-model="model[meta.id]" :placeholder="model.placeholder"
                        :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled" />
                <a-select v-else-if="meta.type == 'select'" :placeholder="model.placeholder" :options="model.options"
                          :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled"
                          :mode="model.mode" v-model="model[meta.id]" />
                <ivz-editor v-else-if="meta.type == 'editor'" :meta="meta" :model="model" :disabled="model.disabled" />
                <a-radio-group v-else-if="meta.type == 'radio'" :options="model.options"
                           :disabled="model.disabled" v-model="model[meta.id]" />
                <a-cascader v-else-if="meta.type == 'cascade'" :placeholder="model.placeholder" :options="model.options"
                    :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled" v-model="model[meta.id]" />
                <a-textarea v-else-if="meta.type == 'textarea'" :placeholder="model.placeholder" :autoSize="{maxRows: 2}"
                    :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled" v-model="model[meta.id]" />
                <a-date-picker v-else-if="meta.type == 'date'" :placeholder="model.placeholder"
                   :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled"
                   :format="model.format" :showTime="model.showTime" :showToday="model.showToday" v-model="model[meta.id]" />
                <a-time-picker v-else-if="meta.type == 'time'" :placeholder="model.placeholder"
                   :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled" v-model="model[meta.id]"/>
                <a-checkbox-group v-else-if="meta.type == 'checkbox'" :options="model.options" v-model="model[meta.id]" />
                <a-tree-select v-else-if="meta.type == 'stree'" :placeholder="model.placeholder" :treeData="model.options"
                    :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled" v-model="model[meta.id]"
                    :multiple="model.multiple" />
                <a-range-picker v-else-if="meta.type == 'dateRange'" :placeholder="model.placeholder"
                    :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled" v-model="model[meta.id]" />
                <a-input-number v-else-if="meta.type == 'number'" :placeholder="model.placeholder"
                    :allowClear="model.clear" :read-only="model.readonly" :disabled="model.disabled"
                    style="width: 100%" :min="model.min" :max="model.max" :step="model.step" v-model="model[meta.id]" />
                <a-input-password v-else-if="meta.type == 'password'" v-model="model[meta.id]"
                       :placeholder="model.placeholder" :visibilityToggle="model.visibility" />
            </a-form-model-item>
            <div class="ivz-item-opera">
                <span class="ivz-io-icon" @click.stop="delItem">
                    <ivz-icon type="iz-icon-delete" :style="{color: '#ffffff', fontSize: '18px'}"></ivz-icon>
                </span>
            </div>
        </div>
    </a-col>
</template>

<script>
    import EditMetas from "@/components/online/EditMetas";
    import IvzEditor from "@/components/basic/IvzEditor";
    export default {
        name: "IvzFormItem",
        components: {IvzEditor},
        props: ["meta", "global", "type", "span", "view"],
        data() {
            return {
                isActive: false,
                model: {
                    id: null,
                    type: null,
                    label: '',
                    field: '',
                    rules: [],
                    extra: '',
                    hasFeedback: '',
                    placeholder: '',
                    labelCol: null,
                    wrapperCol: null
                },
                operaValue: ['table'],
                operas: [
                    {label: '表格', value: 'table'},
                    {label: '搜索', value: 'search'},
                ],
            }
        },
        created() {
            if(!this.meta['model']) {
                this.model = EditMetas.getItemModel(this.meta.type);
                this.model['id'] = this.meta.id;
                this.model['type'] = this.meta.type;
                this.model['label'] = this.meta.name;
                if(this.model[this.model.id] == undefined) {
                    this.$set(this.model, this.model.id, null);
                    if(this.meta.type == 'slider') {
                        this.model[this.meta.id] = this.model['min'];
                    }
                }
                if(this.model.isTable == undefined) {
                    this.$set(this.model, 'isTable', true);
                }
                if(this.model.isSearch == undefined) {
                    this.$set(this.model, 'isSearch', false);
                }

                if(this.span) this.model.span = this.span;
            } else {
                this.model = this.meta['model'];
            }

            this.activeHandle(); // 刚拖拽的项默认激活
            this.mountModelToMeta();
        },
        updated() { },
        methods: {
            mountModelToMeta() {
                if(!this.meta['model'])
                    this.meta['model'] = this.model;
            },
            activeHandle() {
                this.global.active = this.model.id;

                // 最右侧的编辑模型和编辑项元数据
                this.global.editModel = this.model;
                if(this.type == 'form') {
                    this.global.editMetas = EditMetas.getFormItemMetas(this.meta.type);
                } else {
                    this.global.editMetas = EditMetas.getItemMetas(this.meta.type);
                }
            },
            OperaChange(val) {
                this.model['isTable'] = val.includes('table');
                this.model['isSearch'] = val.includes('search');
            },
            delItem() {
                this.$emit("delMetaItem", this.meta);
            },
            resolverItemToMeta(valid) {
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

                return EditMetas.resolverItemToMeta(this.model, this.global)
            }
        }
    }
</script>

<style scoped>
    .ivz-form-item {
        max-height: 88px;
        min-height: 76px;
        position: relative;
    }
</style>
