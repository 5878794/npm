<!-- 方式一： 注册函数@change中获取值 -->
<!-- <b-select :data='data' :value='selectValue' @change='saveVal'></b-select> -->

<!-- 方式二： 使用 this.refs.test.val 获取值-->
<!-- <b-select ref='test' :data='data' :value='selectValue'></b-select> -->



<template>
	<picker @change="bindPickerChange" :value="index" :range="array">
		<view class="uni-input">{{array[index]}}</view>
	</picker>
</template>

<script>
	export default {
		name:"b-select",
		data() {
			return {
				index:0,
				array:[],
				val:''
			};
		},
		props:{
			data:{type:Array,default:[]},
			value:{type:String}
		},
		watch:{
			data(oldData,newData){
				this.getIndex();
			},
			value(oldData,newData){
				this.getIndex();
			}
		},
		created(){
			this.val = this.value;
			this.getIndex();
		},
		methods:{
			bindPickerChange(e){
				let index = e.target.value,
					key = this.getKey(index);
				this.index = index;
				this.val = key;
				this.$emit('change',key);
			},
			//根据key获取index
			getIndex(){
				let index='',array=[],
					selected = this.value;
				this.data.map((rs,i)=>{
					if(rs.key == selected){
						index = i;
					}
					array.push(rs.value);
				});
				this.index = index.toString();
				this.array = array;
			},
			//根据index获取key
			getKey(index){
				let value;
				this.data.map((rs,i)=>{
					if(i==index){
						value = rs.key;
					}
				});
				return value;
			}
		}
	}
</script>

<style>

</style>
