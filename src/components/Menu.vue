<template>
    <div>
        <div v-for="(menuItem, key) in menuList" :key="key">
            <el-submenu :index="menuItem[props.index]" v-if="menuItem[props.children] && menuItem[props.children].length > 0">
                <template slot="title">
                    <i :class="menuItem.icon"></i>
                    <span>{{menuItem[props.label]}}</span>
                </template>
                <sub-menu :menu-list="menuItem[props.children]" :props="props" @getmenu="onMenuItemClick"/>
            </el-submenu>
            <el-menu-item :index="menuItem[props.index]" v-else @click="onMenuItemClick(menuItem)">
                <template slot="title">
                    <span>{{menuItem[props.label]}}</span>
                </template>
            </el-menu-item>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sub-menu',
    props: {
		menuList: {
			type: Array,
			default () {
				return []
			}
		},
		props: {
			type: Object,
			default () {
				return {
					children: 'child',
                    label: 'menuName',
                    index: 'menuUrl'
				}
			}
        },
    },
    methods: {
        onMenuItemClick(item) {
            this.$emit('getmenu', item)
        }
    }
}
</script>

<style lang="scss">
#menu{
  display: inline-block;
  width: 200px;
  height: 100%;
  border: none;
  vertical-align: top;
}
</style>