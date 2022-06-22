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
            <div class="el-upload__tip" slot="tip">只能导入本站导出的json文件，选择文件后要点击下面的文件名触发导入</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelUpload">关 闭</el-button>
            <el-button type="primary" @click="confirmUpload">确 定</el-button>
        </span>
        </el-dialog>
        
    </div>
</template>

<script>
import $ from 'jquery';
import { baseURL } from '@/config/settings'
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
                            console.log('queryAll oldLinkList',res)
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
                        //先清除数据
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
                        this.jsonData = e.target.result;
                        this.$message.warning('暂时不支持此类文件！');
                        // console.log('this.jsonData',this.jsonData);
                        this.parse(this.jsonData)

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
             },
             parse(html){
                let that = this;
                let typeArr = [];
                let linkArr = [];
                // 加载html，使用常用的$符号
                var htmls = $.parseHTML(html);
                // console.log('htmls',htmls);

                // 获取最外层的dt标签
                var $dl = $(htmls).find("dl").first();
                console.log('dls',$(htmls).find("dl"));
                var $dt = $($dl).children("dt").eq(0);
                // 从dt开始遍历dom树，生成对象
                var obj = foo($dt);

                // let dls = $(htmls).find("dl");
                // for (let index = 0; index < dls.length; index++) {
                //     let $dt = $(dls[index]).children("dt").eq(0);
                //     console.log('$dt',$dt);

                //     // 从dt开始遍历dom树，生成对象
                //     var obj = foo($dt);  
                //     console.log('index',index);
                //     console.log('obj',obj);                 
                // }

                // 将对象转化为json字符串，添加额外参数使json格式更易阅读
                // var s = JSON.stringify(obj, null, 4);
                // console.log('ssss',s);

                console.log('linkArr',linkArr);
                console.log('typeArr',typeArr);

                let newTypeList = [...new Set([...this.oldTypeList, ...typeArr])];
                let newLinkList = [...new Set([...this.oldLinkList, ...linkArr])];


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

                // 将json字符串写入json文件
                // fs.writeFileSync('output.json', s);
                function foo($dt,t){
                    // h3标签为文件夹名称
                    var $h3 = $($dt).children("h3");
                    if($h3.length == 0){
                        // a标签为网址
                        var $a = $($dt).children("a");
                        // 返回该书签的名称和网址组成的对象
                        if ($a.length > 0) {
                            linkArr.push({ _id:that.uuid(),"title": $a.text(), "desc": $a.text(), "url": $a.attr('href'), "type": t, "icon": $a.attr('icon'), "clicks": 1, "code": '' })
                        }
                        return $a.length > 0 ? { "title": $a.text(), "desc": $a.text(), "url": $a.attr('href'), "type": t, "icon": $a.attr('icon'), "clicks": 1, "code": '' } : null;
                    }
                    var h3 = $h3.text();
                    typeArr.push({ type: h3, code: '',_id:that.uuid() });
                    console.log('h3',h3);
                    
                    var arr = [];
                    var obj = {};
                    // 获取下一级dt标签集合
                    var $dl = $($dt).children("dl");
                    console.log('$dl$dl$dl',$dl);
                    var $dtArr = $($dl).children("dt");
                    for(var i = 0; i < $dtArr.length; i++){                        
                        // 遍历下一级dt标签
                        var tmp = foo($($dtArr).eq(i), h3);
                        // 将返回的对象push至子文件数组
                        arr.push(tmp);
                    }
                    // 创建文件夹与子文件数组的键值对
                    obj[h3] = arr;
                    // 返回该对象
                    return obj;
                }
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