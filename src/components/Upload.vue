<!--
 * @LastEditors: gcz
-->
<template>
    <div class=''>
        <el-dialog
        title="上传书签文件"
        :visible.sync="visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="30%">
        <el-upload
            class="upload"
            drag
            :action=action
            accept="text/html"
            :data="uData"
            name="singleFile"
            :before-upload="beforeUpload"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传谷歌导出的html文件</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelUpload">关 闭</el-button>
            <el-button type="primary" @click="confirmUpload">确 定</el-button>
        </span>
        </el-dialog>
        
    </div>
</template>

<script>
import { baseURL } from '@/config/settings'
    export default {
        name: 'Upload',
        components: {},
        props:{
            dialogVisible:{
                type:Boolean,
                default:false
            }
        },
        data () {
            return {
                visible:false,
                uData:{userCode:''},
                action:`${baseURL}/upload/single`
            };
        },
        created(){
            
        },
        watch: {
            dialogVisible (newValue, oldValue) {
            this.visible = newValue
            console.log('newValue',newValue)
            }
        },
        mounted(){
            //  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            //  this.uData.userCode = userInfo.sub;
            // console.log('userInfo',userInfo.sub);
        },
        methods: {
            beforeUpload(){
                if(!this.uData.userCode){
                    this.$message.error('请先登录!');
                }
                return this.uData.userCode
            },
             confirmUpload(){
                this.$emit('confirmUpload')
             },
             cancelUpload(){
                 this.$emit('cancelUpload')
             }
             
        },
    }
</script>

<style lang='scss' scoped>
.upload{
    text-align: center;
    .el-upload__tip{color:crimson;}
}

</style>