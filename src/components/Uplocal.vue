<!--
 * @LastEditors: gcz
-->
<template>
    <div class=''>
        <!-- <el-input type="file" v-model="inputData" name="data" placeholder="上传"></el-input> -->
        <input type="file" ref="input" @change="inputChange">
    </div>
</template>

<script>
    export default {
        name: '',
        components: {},
        data () {
            return {
                inputData:'1',
                inputDalue:null
            };
        },
        created(){},
        methods: {
            inputChange(e){
                console.log('inputChange',e);
                console.log('input',this.$refs.input);
            }
        },
    }
</script>

<style lang='scss' scoped>


</style>