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
            accept="text/html,application/json"
            :data="uData"
            :file-list="fileList"
            name="singleFile"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-change="handleChange"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">选择文件后要点击下面生成的文件名确认导入</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelUpload">关 闭</el-button>
            <el-button type="primary" @click="confirmUpload">确 定</el-button>
        </span>
        </el-dialog>
        
    </div>
</template>

<script>
import { baseURL } from '@/config/settings';
import { parseByString } from "bookmark-file-parser";//https://github.com/hold-baby/bookmark-file-parser
import Idb from 'idb-js'  //  引入Idb
import db_student_config from '../db/db_student_config'
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
                navDb:null,
                visible:false,
                uData:{userCode:''},
                action:`${baseURL}/upload/single`,
                fileList:[],
                jsonData:null,
                fileType:null,
                oldTypeList:[],
                oldLinkList:[],
            };
        },
        created(){
            Idb(db_student_config).then(nav_db => {
                this.navDb = nav_db;
            });

            
            
        },
        watch: {
            dialogVisible (newValue, oldValue) {
            this.visible = newValue
            // console.log('newValue',newValue)
            }
        },
        mounted(){
            //  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            //  this.uData.userCode = userInfo.sub;
            // console.log('userInfo',userInfo.sub);
        },
        methods: {
            groupArr(arr) {
                var map = {},
                    result = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    if (!map[ai.type]) {
                    result.push({
                        ftitle: ai.type,
                        list: [ai]
                    });
                    map[ai.type] = ai;
                    } else {
                    for (var j = 0; j < result.length; j++) {
                        var dj = result[j];
                        if (dj.ftitle == ai.type) {
                        dj.list.push(ai);
                        break;
                        }
                    }
                    }
                }
                return result;
            },
            uuid() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
            
                var uuid = s.join("");
                return uuid;
            },
            beforeUpload(file){
                // console.log('beforeUpload',file.File);
                
                // if(!this.uData.userCode){
                //     this.$message.error('请先登录!');
                // }
                // return this.uData.userCode
            },
            handleChange(file, fileList) {
                //获取导航类别
                    this.navDb.queryAll({
                        tableName: "type",
                        success: (res) => {
                            // console.log('getTypeList',res)
                            this.oldTypeList = res;
                        }
                    });
                    //获取导航链接
                    this.navDb.queryAll({
                        tableName: "link",
                        success: (res) => {
                            // console.log('queryAll oldLinkList',res)
                            this.oldLinkList = res;
                        }
                    });
                // this.fileList = fileList.slice(-3);
                // let fileType = file.raw.type;
                // console.log('fileType',fileType);
                // console.log('file',file);

                // console.log('this.fileList',this.fileList);
            },
            handlePreview(file) {
                // console.log('handlePreview',file);
                let reader = new FileReader();
                this.fileType = file.raw.type;
                reader.readAsText(file.raw);
                reader.onload = (e) => {
                                        
                    // console.log('fileType',this.fileType);
                    // console.log(' this.jsonData', this.jsonData);
                    // console.log('typeof this.jsonData', typeof this.jsonData);

                    if(this.fileType=='application/json'){
                        this.jsonData = JSON.parse(e.target.result);
                        let siteList = this.groupArr(this.jsonData);
                        // console.log('siteList',siteList);
                        let types = siteList.map(item => {
                            return {
                                code:'',
                                type:item.ftitle,
                                _id:this.uuid()
                            }
                        });
                        // console.log('types',types);
                        // console.log('oldTypeList',this.oldTypeList);
                        let newTypeList = this.oldTypeList.concat(types);
                        let obj = {};
                        newTypeList = newTypeList.reduce((newArr, next) => {
                            obj[next.type] ? "" : (obj[next.type] = true && newArr.push(next));
                            return newArr;
                        }, []);
                        // console.log('newTypeList',newTypeList);
                        //先清除类型数据
                        this.navDb.clear_table({
                            tableName:'type'
                        });
                        // 插入多条数据
                        this.navDb.insert({
                            tableName: "type",
                            data: newTypeList,
                            success: () => {
                                this.$message.success('存入类型成功');
                                console.log("添加成功")
                            }
                        });

                        // 获取所有项
                        let linkList = siteList.map(item => {
                            return item.list
                        });
                        linkList = linkList.flat();
                        console.log('linkList',linkList);
                        let newLinkList = linkList.concat(this.oldLinkList);
                        let linkObj = {};
                        linkList = newLinkList.reduce((newArr, next) => {
                            linkObj[next.url] ? "" : (linkObj[next.url] = true && newArr.push(next));
                            return newArr;
                        }, []);
                        console.log('linkList',linkList);
                        //先清除类型数据
                        this.navDb.clear_table({
                            tableName:'link'
                        });
                        // 插入多条数据
                        this.navDb.insert({
                            tableName: "link",
                            data: linkList,
                            success: () => {
                                this.$message.success('存入链接成功');
                                console.log("添加成功")
                                location.reload()
                            }
                        });

                    }else if(this.fileType=='text/html'){
                        let that = this;
                        this.jsonData = e.target.result;
                        // this.$message.warning('暂时不支持此类文件！');
                        // console.log('this.jsonData',this.jsonData);
                        const bookmark = parseByString(this.jsonData)
                        console.log('bookmark',bookmark);
                        let typeArr = [];
                        let linkArr = [];
                        function finder(data,n){
                            data.forEach(element => {
                                // console.log('element',element.type);
                                if(element.type=='folder'){
                                    // console.log('element.name',element.name);
                                    // console.log('element.children',element.children);
                                    element.children.fatherName = element.name;
                                    typeArr.push({ type: element.name, code: '',_id:that.uuid() });
                                    finder(element.children,element.name)
                                }else{
                                    linkArr.push({ _id:that.uuid(),"title": element.name, "desc": element.name, "url": element.href, "type": n, "icon": element.icon, "clicks": 1, "code": '' })
                                    // console.log('element href',element.href);
                                }
                            });
                        };
                        finder(bookmark,'常用链接');
                        // console.log('typeArr',typeArr);
                        // console.log('linkArr',linkArr);

                        
                        let newTypeList = [...new Set([...this.oldTypeList, ...typeArr])];
                        let newLinkList = [...new Set([...this.oldLinkList, ...linkArr])]; 

                        // console.log('newTypeList',newTypeList);
                        // console.log('newLinkList',newLinkList);

                        //先清除类型数据
                        this.navDb.clear_table({
                            tableName:'type'
                        });
                        // 插入多条数据
                        this.navDb.insert({
                            tableName: "type",
                            data: newTypeList,
                            success: () => {
                                // this.$message.success('存入类型成功');
                                console.log("添加成功")
                            }
                        });

                        //先清除数据
                        this.navDb.clear_table({
                            tableName:'link'
                        });
                        // 插入多条数据
                        this.navDb.insert({
                            tableName: "link",
                            data: newLinkList,
                            success: () => {
                                this.$message.success('存入链接成功');
                                console.log("添加成功")
                                location.reload()
                            }
                        });

                    }else{
                        this.$message.error('请选择正确的文件');
                    }
                    
                    
                };
            },
             confirmUpload(file){
                // console.log('confirmUpload',file);
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