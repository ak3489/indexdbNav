<template>
  <div id="app" :class="isDark?'dark':''">
    <section class="theme-list hidden-md-and-up">
      <div class="fixed-nav" ref="fixednav">
        <div class="fixed-nav-content">
          <p
            v-for="(item, index) in siteList"
            :key="index"
            :class="['tab-title', activeId === index && 'select-tab']"
            @click="changeTab(index, $event)"
          >
            {{ item.ftitle }}
          </p>
        </div>
      </div>
    </section>
    <!-- 主体部分 -->
    <el-row type="flex" justify="space-around">
      <!-- 侧边楼层导航 -->
      <el-col class="hidden-sm-and-down" :sm="1" :md="2">
        <div class="sidebar">
          <Kitty  :customStyle="{ transform: 'rotateX(0deg)',right: '-8px',left:'auto',top: '-50px' }"></Kitty>
          <div class="nav" v-for="(item, index) in siteList" :key="item.ftitle" @click="setFloorNavMountClick(index)">{{ item.ftitle }}</div>
        </div>
      </el-col>
      <!-- 站点主体部分 -->
      <el-col :xs="22" :sm="22" :md="20">
        <el-row class="hidden-sm-and-down" type="flex" justify="space-around" style="margin-top: 32px;position: sticky;top: 0;z-index: 100;">
          <el-col :sm="24" :md="12">


            <!-- <el-input ref="searchInput" placeholder="请输入搜索内容" v-model="formSearch.searchKey" clearable>
              <el-button slot="prepend" icon="el-icon-search"></el-button>
            </el-input> -->

            <div class="search-wrap">
              <el-input ref="searchInput" placeholder="请输入内容" v-model="formSearch.searchKey" clearable class="input-with-select">
                <el-select v-model="searchSelect" slot="prepend" placeholder="请选择">
                  <el-option
                    v-for="item in searchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button @click="outSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>

          </el-col>
        </el-row>
        <siteList :siteList="siteList" :typeList="typeList" :code="code" @refresh="getSiteList"></siteList>
      </el-col>
      <!-- 联系我 -->
      <el-col class="hidden-md-and-down" :md="1">
        <div class="contact">
          <transition name="el-fade-in-linear">
            <div class="item" id="to-top" v-show="showBackTop" @click="toTop()">
              <i class="el-icon-caret-top" style="font-size:24px"></i>
              <!-- <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-huojian" />
              </svg> -->
            </div>
          </transition>
          <div class="contact-item">
            <!-- <div class="item" id="qq" @click="goToQQ()" @mouseover="icon.qq = '#icon-qq-color'" @mouseout="icon.qq = '#icon-qq'">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="icon.qq" />
              </svg>
            </div> -->
            <!-- <div
              id="weixin"
              class="item weixin-btn"
              @mouseover="
                showWeixin = true
                icon.weixin = '#icon-weixin-color'
              "
              @mouseout="
                showWeixin = false
                icon.weixin = '#icon-weixin'
              "
            >
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="icon.weixin" />
              </svg>
              <div>
                <transition name="el-zoom-in-center">
                  <img src="https://qiniuyun.zhichi921.com/weixin1.jpg" alt v-show="showWeixin" />
                </transition>
              </div>
            </div> -->
            <div class="item" id="" @click="changeTheme">
              <img :src="themeIco" alt="" srcset="">
            </div>
            <div class="item" v-if="accessToken" id="" @click="handleLogout">登出</div>
            <div class="item" v-if="accessToken" id="">
              <a href="https://navigation.authing.cn/u" style="display: block;" target="_blank" rel="noopener noreferrer">我</a>
            </div>
            <div class="item" id="" @click.prevent.stop="onContextmenu" @contextmenu.prevent="onContextmenu">菜单</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="other">
      <div class="u-flex u-row-center other-item">
        <div class=""><img src="../src/assets/注册完成.svg" alt=""></div>
        <div class="text">此版本不需要注册,但也不能分享(数据在你本地)!</div>
      </div>
      <div class="u-flex u-row-center other-item">
        <div class="">如果你愿意你可以把你的专属链接分享给他人,:<br />或者懒得备份请使用:<br /><a target="_blank" href="https://dao.momen.vip/">https://dao.momen.vip</a></div>
        <div class="text"><img src="../src/assets/数据分享.svg" alt=""></div>
      </div>
      <div class="u-flex u-row-center other-item">
        <div class=""><img src="../src/assets/问题.svg" alt=""></div>
        <div class="text">
          <ul>
            <!-- <li>可以导入谷歌浏览器的收藏夹</li> -->
            <li>链接右下角为点击数</li>
            <li>对右下角菜单点击右键,可以选择注册或登录,新增网址(<b>必须先有类别</b>)等!</li>
            <li>对网址点击右键可以进行编辑、删除操作.</li>
            <li>Ctrl+F激活搜索框</li>
            <!-- <li>可以通过更改个人资料的昵称，修改网页的标题</li> -->
          </ul>
        </div>
      </div>
      <div class="u-flex u-row-center other-item">
        <div class="">
          <p>制作此网站的目的:一是学习练习所用,二是收藏的网址太多需要工作和娱乐分开书签不够用.<br />开发出来方便大家(虽然目前只有自己在用~~)</p>
          <p>希望大家不要用来传播违法不良信息,否则后果自负!!!</p>
        </div>
        <div class="text"><img src="../src/assets/编辑规则.svg" alt=""></div>
      </div>
    </div>


    <!-- 底部 -->
    <!-- <div class="footer">
      <div class="footer-inner">
        <el-input placeholder="权限密钥" v-model="code" @change="codeChange" style="width:300px">
            <template slot="prepend">密钥</template>
        </el-input>
      </div>
    </div> -->

    <!-- 新增类型 -->
    <el-dialog title="新增分类" :visible.sync="typeDialog">
      <el-form :model="typeForm" :rules="typeRules" ref="typeFormRef">
        <el-form-item label="分类名称" prop="type">
          <el-input type="textarea" :rows="4" placeholder="请输入类型名称" v-model="typeForm.type"></el-input>
        </el-form-item>
        <el-form-item class="form-footer">
          <el-button size="medium" @click="typeDialog = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addType">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增链接 -->
    <el-dialog title="新增网址" :visible.sync="linkDialog" :close-on-click-modal="false">
      <el-form :model="linkForm" :rules="linkRules" ref="linkFormRef" label-position="left" style="padding-top:0"  label-width="90px">
        <el-form-item label="网址URL" prop="url">
          <el-input type="input" placeholder="请输入网址URL" v-model="linkForm.url" @blur="inputUrlBlur"></el-input>
        </el-form-item>
        <el-form-item label="网址分类" prop="type">
          <el-select v-model="linkForm.type" placeholder="请选分类">
            <el-option :label="item.type" :value="item.type" v-for="item in typeList" :key="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网址标题" prop="title">
          <el-input type="input" :rows="4" placeholder="请输入网址标题" v-model="linkForm.title"></el-input>
        </el-form-item>
        <el-form-item label="网址简介" prop="desc">
          <el-input type="input" :rows="4" placeholder="请输入网址简介" v-model="linkForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="网址图标">
          <el-input type="input" :rows="4" placeholder="请输入网站图标地址" v-model="linkForm.icon"></el-input>
          <div class="showIco" v-if="linkForm.icon" style="color:crimson;display: flex;align-items: center;margin-top: 24px;">
            <img :src="linkForm.icon" alt="">
            如果看到这行文字并且没看到图标请修改图标地址或者直接不填图标地址会显示默认的。
          </div>
          
        </el-form-item>
        <el-form-item class="form-footer">
          <el-button size="medium" @click="linkDialog = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addLink">确 定</el-button>
        </el-form-item>
      </el-form>
      <div class="tip" style="color:crimson">提示：输入网址后会自动分析地址信息，可等出结果后进行修改。</div>
    </el-dialog>

    <Upload :dialogVisible="uploadVisible" @confirmUpload="confirmUpload" @cancelUpload="cancelUpload"></Upload>
    <!-- <Uplocal /> -->

    <el-dialog
      title="提示"
      :visible.sync="showDel"
      width="30%">
      <span>确认删除所有数据吗，记得先导出备份哟！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDel = false">取 消</el-button>
        <el-button type="primary" @click="clearTable">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SiteList from '@/components/SiteList'
import Kitty from '@/components/Kitty'
import Upload from '@/components/Upload'
// import Uplocal from '@/components/Uplocal'
import { getSiteList, addType, getTypeList, addLink, analysisURL } from '@/api'
import utils from '@/utils/index.js'
import saveJSON from '@/utils/saveJSON.js'

import Idb from 'idb-js'  //  引入Idb
import db_student_config from './db/db_student_config'
export default {
  name: 'app',
  components: {
    SiteList,
    Kitty,
    Upload,
    // Uplocal,
    // Cute,
  },
  data() {
    return {
      navDb:null,
      showDel:false,
      isDark:false,
      themeIco:'./assets/light.svg',
      accessToken:'',
      code:'',
      keyword: '',
      searchSelect:'站内',
      searchOptions:[
        {value: '站内',label: '站内',url:''},
        {value: '百度',label: '百度',url:'https://www.baidu.com/s?wd='},
        {value: '谷歌',label: '谷歌',url:'https://www.google.com.hk/search?q='},
        {value: '翻译',label: '翻译',url:'https://youdao.com/result?lang=en&word='},
        {value: '云音乐',label: '云音乐',url:'https://music.163.com/#/search/m/?s='},
        {value: '知乎',label: '知乎',url:'https://www.zhihu.com/search?type=content&q='},
        {value: 'B站',label: 'B站',url:'https://search.bilibili.com/all?keyword='},
        {value: '图片',label: '图片',url:'https://image.baidu.com/search/index?tn=baiduimage&fm=result&ie=utf-8&word='},
        {value: '地图',label: '地图',url:'https://www.gaode.com/search?query='},
        {value: '微信',label: '微信',url:'https://weixin.sogou.com/weixin?type=2&query='}
      ],
      siteList: [],
      linkData:[],
      element: {
        smnav_item:null,
        nav_item: null,
        floor_item: null,
      },
      showBackTop: false,
      showWeixin: false,
      rules: {
        content: [{ required: true, message: '请填写反馈内容', trigger: 'blur' }],
      },
      timer: null,
      icon: {
        qq: '#icon-qq',
        weixin: '#icon-weixin',
      },
      loading: null,
      searchTimer: null, 
      qq: '1843544121',
      typeDialog:false,
      typeForm:{
        _id:'',
        type: '',
        code: '',
      },
      typeRules: {
        type: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
      },
      typeList:[],
      linkDialog:false,
      defaultLinkForm:{
        url: '',
        title: '',
        desc: '',
        type: '',
        icon: '',
        clicks: 1,
        code: '',
      },
      linkForm:{
        _id:'',
        url: '',
        title: '',
        desc: '',
        type: '',
        icon: '',
        clicks: 1,
        code: '',
      },
      linkRules: {
        url: [{ required: true, message: '请输入网址', trigger: 'blur' }],
        title: [{ required: true, message: '请输入网址标题', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入网址简介', trigger: 'blur' }],
        type: [{ required: true, message: '请选择网址类别', trigger: 'blur' }],
        
      },
      formSearch: {
				searchKey: '',
				timer: null
			},
      alertTitle:"提示的文案",
      uploadVisible:false,
      activeId:1
    }
  },
  created() {
    Idb(db_student_config).then(nav_db => {
      this.navDb = nav_db;
      // console.log('nav_db',nav_db);
      this.getSiteList()
      this.getTypeList();
    });
    this.loading = this.$loading({ fullscreen: true });
    
    let saveTip = localStorage.getItem("saveTip");
    let nowTime = `${new Date().getFullYear()}-${('00'+(new Date().getMonth()+1)).slice(-2)}-${('00'+new Date().getDate()).slice(-2)}`;
    // console.log('saveTip',saveTip);
    // console.log('Between',);
    let between = this.getDaysBetween(saveTip,nowTime);
    // console.log('saveTip',saveTip);
    // console.log('nowTime',nowTime);
    // console.log('between',between);
    if(!saveTip||between>2){
      this.$notify({
        title: '注意',
        message: '清空浏览器数据会清掉导航内容，记得导出备份！',
        duration: 0
      });
      let saveTime = `${new Date().getFullYear()}-${('00'+(new Date().getMonth()+1)).slice(-2)}-${('00'+new Date().getDate()).slice(-2)}`;
      localStorage.setItem("saveTip", saveTime);
    }
    
      
  },
  methods: {
    getDaysBetween(startDate, enDate) {
        const sDate = Date.parse(startDate)
        const eDate = Date.parse(enDate)
        if (sDate > eDate) {
            return 0
        }
        if (sDate === eDate) {
            return 1
        }
        const days = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000)
        return days
    },
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "新增网址",
            onClick: () => {
              this.linkDialog = true;
            }
          },
          { label: "重新加载", divided: true, icon: "el-icon-refresh",
            onClick: () => {
              location.reload();
            }
          },
          {
            label: "新增类别",
            divided: true,
            onClick: () => {
              this.typeDialog = true;
              // this.$message("新增类别");
            }
          },
          { label: "清除所有链接", divided: false, icon: "el-icon-delete",
            onClick: () => {
              this.showDel = true;
            }
          },
           { label: "导出链接", divided: false, icon: "el-icon-files",
            onClick: () => {
              this.exportLink()
            }
          },
          {
            label: "导入链接",
            divided: true,
            icon:"el-icon-edit-outline",
            onClick: () => {
              this.uploadVisible = true;
            }
          }
        ],
        event,
        //x: event.clientX,
        //y: event.clientY,
        customClass: "menu-custom-class",
        zIndex: 100,
        minWidth: 230
      });
      return false;
    },
    addType(){
      
      let that = this;
      this.$refs['typeFormRef'].validate((valid) => {
        if (valid) {
          let hasType = this.typeList.some(function(item){
            // console.log('item',item);
            return item.type == that.typeForm.type
          });
          console.log('hasType',hasType);
          if (hasType){this.$message.error('已经有了');return false};
          this.typeForm._id = Date.now();
          this.navDb.insert({
              tableName: "type",
              data: that.typeForm,
              success: () => {
                this.$message.success("添加成功");
                this.typeDialog = false;
                this.typeForm.type = '';
                this.getTypeList();
                console.log("添加成功")
              }
          });
        } else {
          this.$message('请填写完整');
          return false;
        }
      });
      
    },
    addLink(){
      let that = this;
      this.linkForm.code = this.code;
      this.$refs['linkFormRef'].validate((valid) => {
        if (valid) {

          this.linkForm._id = Date.now();
          this.navDb.insert({
              tableName: "link",
              data: that.linkForm,
              success: () => {
                this.$message.success("添加成功");
                this.linkDialog = false;
                this.linkForm = this.defaultLinkForm;
                this.getSiteList();
                console.log("添加成功")
              }
          });
        } else {
          this.$message('请填写完整');
          return false;
        }
      });
      
    },
    async getTypeList() {
      // console.log('this.navDb',this.navDb);
      this.navDb.queryAll({
          tableName: "type",
          success: (res) => {
              // console.log('getTypeList',res)
              this.typeList = res;
          }
      });
      // console.log('this.code',this.code);
      // const res = await getTypeList({code:this.code})
      // this.typeList = res.data;
    },
    async getSiteList() {
       this.navDb.queryAll({
          tableName: "link",
          success: (res) => {
              // console.log('getSiteList',res)
              // console.log('getSiteList',res)
              let siteArr = res;
              this.linkData = res;
              this.siteList = this.groupArr(siteArr);
              // console.log('this.siteList',this.siteList)
              this.sitetotalnum = res.length
          }
      });
      
    },
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
    codeChange(e){
      localStorage.setItem('code',e);
    },
    goToQQ() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=' + this.qq + '&site=qq&menu=yes', '_blank')
    },
    /**
     * 监听窗口滚动楼层导航动态定位
     */
    floorSrcollEventListener() {
      const { nav_item, floor_item ,smnav_item} = this.element
      const window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      for (let i = 0, len = floor_item.length; i < len; i++) {
        let floor_offsetTop = floor_item[i].offsetTop - floor_item[0].offsetTop
        if (window_scrollTop >= floor_offsetTop) {
          for (let n = 0, len = nav_item.length; n < len; n++) {
            const current_classList = nav_item[n].classList
            if(i === n){
              current_classList.add('active')

              this.activeId = n;
              const spanLeft = smnav_item[n].getBoundingClientRect().left; // 当前点击的元素左边距离
              const divBox = document.querySelector(".select-tab").clientWidth / 2; // 点击的元素一半宽度
              const totalWidths = document.body.clientWidth; // 屏幕总宽度
              const widths = totalWidths / 2; // 一半的屏幕宽度
              const spanRight = totalWidths - spanLeft; // 元素的右边距离
              const scrollBox = document.querySelector(".fixed-nav"); // 获取最外层的元素
              const scrollL = scrollBox.scrollLeft; // 滚动条滚动的距离
              // 当元素左边距离 或者 右边距离小于100时进行滑动
              if (spanRight < 100 || spanLeft < 100) {
                scrollBox.scrollLeft = scrollL + (spanLeft - widths) + divBox;
              }

            }else{
              current_classList.remove('active')
            }
            // i === n ? current_classList.add('active') : current_classList.remove('active')
          }
        }
      }
    },
    changeTab(id, event) {
      this.setFloorNavMountClick(id)
      // 如果选择的和当前激活的不同
      if (id !== this.activeId) {
        this.activeId = id;
        // 计算当前按钮的位置，看是否需要移动
        const spanLeft = event.clientX; // 当前点击的元素左边距离
        const divBox = document.querySelector(".select-tab").clientWidth / 2; // 点击的元素一半宽度
        const totalWidths = document.body.clientWidth; // 屏幕总宽度
        const widths = totalWidths / 2; // 一半的屏幕宽度
        const spanRight = totalWidths - spanLeft; // 元素的右边距离
        const scrollBox = document.querySelector(".fixed-nav"); // 获取最外层的元素
        const scrollL = scrollBox.scrollLeft; // 滚动条滚动的距离
        // 当元素左边距离 或者 右边距离小于100时进行滑动
        if (spanRight < 100 || spanLeft < 100) {
          scrollBox.scrollLeft = scrollL + (spanLeft - widths) + divBox;
        }
      }
    },
    /**
     * 设置楼层导航事件驱动方法
     * @param {Number} index  楼层下标
     */
    setFloorNavMountClick(index) {
      const { floor_item } = this.element
      let floor_offsetTop = floor_item[index].offsetTop - floor_item[0].offsetTop + 72,
        window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        timer = {
          step: 60,
          times: 16,
          FLOOR_OFFSETTOP: floor_offsetTop,
        }
        //尝试修复bug
        // let availHeight = window.screen.availHeight;
        // let scrollHeight = document.body.scrollHeight;
        // let ah = scrollHeight - availHeight;
        // if(floor_offsetTop>ah){floor_offsetTop=ah}
        // console.log('floor_offsetTop',floor_offsetTop);
        //  console.log('window_scrollTop',window_scrollTop);
        // console.log(' document.body.scrollHeight', document.body.scrollHeight);
        // console.log(' window.screen.availHeight',  window.screen.availHeight);
         //尝试修复bug

      if (window_scrollTop > floor_offsetTop) {
        this.setFloorScrollArrowUp(timer)
      } else if (window_scrollTop == floor_offsetTop) {
        return false
      } else {
        this.setFloorScrollArrowDown(timer)
      }
    },
    /**
     * 设置楼层向上滚动
     * @param {Object} timer 定时器配置
     */
    setFloorScrollArrowUp(timer) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (window_scrollTop <= timer.FLOOR_OFFSETTOP) {
          document.documentElement.scrollTop = timer.FLOOR_OFFSETTOP
          document.body.scrollTop = timer.FLOOR_OFFSETTOP
          clearInterval(this.timer)
        } else {
          document.documentElement.scrollTop = window_scrollTop - timer.step
          document.body.scrollTop = window_scrollTop - timer.step
        }
      }, timer.times)
    },
    /**
     * 设置楼层向下滚动
     * @param {Object} timer 定时器配置
     */
    setFloorScrollArrowDown(timer) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let window_scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (window_scrollTop >= timer.FLOOR_OFFSETTOP) {
          document.documentElement.scrollTop = timer.FLOOR_OFFSETTOP
          document.body.scrollTop = timer.FLOOR_OFFSETTOP
          clearInterval(this.timer)
        } else {
          document.documentElement.scrollTop = window_scrollTop + timer.step
          document.body.scrollTop = window_scrollTop - timer.step
        }
      }, timer.times)
    },
    // 显示返回顶部按钮
    handleScroll() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= 120) {
        this.showBackTop = true
      } else if (scrollTop < 120) {
        this.showBackTop = false
      }
    },
    // 返回顶部
    toTop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      console.log('top',top);
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 80
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    },
    getToken: async function(code, codeChallenge) {
			// let tokenSet = await this.$authing.getAccessTokenByCode(code, { codeVerifier: codeChallenge });
			// const { access_token, id_token } = tokenSet;
			// let userInfo = await this.$authing.getUserInfoByAccessToken(tokenSet.access_token);
      // this.code = userInfo.sub;
      // localStorage.setItem('code',this.code);
			// localStorage.setItem('accessToken', access_token);
			// localStorage.setItem('idToken', id_token);
      // localStorage.setItem('userInfo', JSON.stringify(userInfo));
      // let url = 'http://'+window.location.host+'?u='+this.code;
      // window.location.href = url;

		},
    handleLogout(){
      let idToken = localStorage.getItem('idToken')
      this.$authing.buildLogoutUrl({
        expert: true,
        redirectUri: window.location.host,
        idToken,
      })
      localStorage.clear()
      window.location.href = 'http://'+window.location.host
    },
    search(){
      let that = this;
      this.siteList = [
        {
          ftitle:'搜索结果',
          list:[]
        }
      ];
      this.linkData.map((link)=>{
          if(link.title.indexOf(this.formSearch.searchKey)!=-1    || link.desc.indexOf(this.formSearch.searchKey)!=-1 || link.url.indexOf(this.formSearch.searchKey)!=-1){
              that.siteList[0].list.push(link);
          }
      })
    },
    outSearch(){
      let that = this;
      if(this.searchSelect=='站内'){return};
      // console.log('searchSelect',this.searchSelect);
      // console.log('111',this.searchOptions);
      let theIndex;
      this.searchOptions.forEach((element,index) => {
        if(element.label==that.searchSelect){
          theIndex=index
        }
      });
      // console.log('theIndex',this.searchOptions[theIndex]);
      window.open(this.searchOptions[theIndex].url + this.formSearch.searchKey, '_blank')
    },
    searchKey(e) {     
      // console.log('searchKey',e);
      var key = window.event.keyCode ? window.event.keyCode : window.event.which;
      if (key === 70 && e.ctrlKey) {
        this.$refs['searchInput'].focus()
        e.preventDefault()
      }else if(key === 13){
        this.outSearch()
      }
    },
    setNav(){
      this.element = {
        smnav_item: document.getElementsByClassName('tab-title'),
        nav_item: document.getElementsByClassName('nav'),
        floor_item: document.getElementsByClassName('floor-item'),
      }
      this.element.nav_item[0].classList.add('active')
      window.addEventListener('scroll', this.floorSrcollEventListener)
    },
    async inputUrlBlur(){
      // console.log('this.linkForm.url',this.linkForm.url);
      if(/(http|https):\/\/([\w.]+\/?)\S*/.test(this.linkForm.url)){
        const res = await analysisURL(this.linkForm.url);
        // console.log('linkForm',this.linkForm);
        if(res.code!=200){
          this.$message( res.msg + '请手动填写')
        }
        console.log('inputUrlBlur',res);
        this.linkForm.title = res.data.title;
        this.linkForm.desc = res.data.desc;
        this.linkForm.icon = res.data.icon;
      }else{
       this.$alert( "网址错误-请以http或https开始")
        console.log('inputUrlBlur','网址错误');
      }
    },
    confirmUpload(){
      this.uploadVisible = false;
      this.getSiteList()
      this.getTypeList();
    },
    cancelUpload(){
      this.uploadVisible = false;
    },
    changeTheme(){
      this.isDark = !this.isDark
    },
    clearTable(){
      this.showDel = false;
      this.navDb.clear_table({
        tableName:'type'
      });
      this.navDb.clear_table({
        tableName:'link'
      })
      this.getSiteList()
      this.getTypeList();
    },
    exportLink(){
      saveJSON(this.linkData,'linkData.json')
      // saveJSON(this.typeList,'typeList.json')
      // saveJSON(this.siteList,'siteList.json')
    }
  },
  watch: {
    code:{
      handler(val, oldVal){
          this.getTypeList();
          this.getSiteList();
      },
		},
    isDark:{
      handler(val, oldVal){
        if(val){
           document.body.parentElement.classList.add('dark-mode');
           this.themeIco = require('./assets/dark.svg')
        }else{
          document.body.parentElement.classList.remove('dark-mode');
          this.themeIco = require('./assets/light.svg')
        }
      },
      immediate: true
    },
    'formSearch.searchKey': {
      handler(value) {
        console.log('value',value);
        // console.log('searchSelect',this.searchSelect);
        if(this.searchSelect!='站内'){return};
        if(!value) {
          this.siteList = this.groupArr(this.linkData);
          return;
        };
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.search();
          this.toTop();
        }, 500)
      },
      deep: true
    },
    'linkForm.url': {
      handler(value) {
        if(value){
          this.linkForm.url = value.toLowerCase();
        }
      },
      deep: true
    }
    
  },
  mounted() {
    let that = this;
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // console.log('userInfo',userInfo);
    if(userInfo){
      let webTitle = userInfo.nickname || '网址导航';
      document.title = webTitle;
    }
    
     if (this.siteList.length>0) {
           this.setNav();
      } else { // 避免网站加载速度太慢的备用措施
          let timer1 = setInterval(function(){ 
              if (that.siteList.length>0) { 
                  clearInterval(timer1); // 取消定时器
                   that.setNav();
              }
          },200);
      };
    // 添加监听屏幕滚动事件
    window.addEventListener('scroll', this.handleScroll)
    this.loading.close();

    document.addEventListener('keydown', this.searchKey)

    // function getQueryVariable(variable)
    // {
    //       var query = window.location.search.substring(1);
    //       var vars = query.split("&");
    //       for (var i=0;i<vars.length;i++) {
    //               var pair = vars[i].split("=");
    //               if(pair[0] == variable){return pair[1];}
    //       }
    //       return(false);
    // }


    // 当设置要根据系统主题自动切换模式，执行以下代码
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    // 设置 onchange 事件的回调函数
    mql.onchange = function (evt) {
        if (evt.matches) {
            // 当前为深色模式
            document.body.parentElement.classList.add('dark-mode');
        } else {
            // 当前为浅色模式
            document.body.parentElement.classList.remove('dark-mode');
        }
    }




    // console.log('userInfo',localStorage.getItem('userInfo'));
    // 添加百度统计
    // let _hmt = _hmt || []
    // ;(function() {
    //   let hm = document.createElement('script')
    //   hm.src = 'https://hm.baidu.com/hm.js?b77f0ca4f2ff4960338c95760b7efb11'
    //   let s = document.getElementsByTagName('script')[0]
    //   s.parentNode.insertBefore(hm, s)
    // })()

  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.floorSrcollEventListener)
  },
}
</script>

<style scoped lang="scss">
// @import "./assets/dark.scss";

.sidebar {
  position: sticky;
  top: 50px;
  left: 1.5%;
  margin-top: 50px;
  min-height: 200px;
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: center;
  padding: 20px 0;
  color: #444;
  .nav {
    cursor: pointer;
    font-size: 15px;
    & + .nav{
      margin-top: 20px;
    }
  }
}
.active {
  color: var(--active-color);
}
.contact {
  position: fixed;
  bottom: 130px;
  right: 25px;
  width: 46px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 192px;
  .item {
    width: 46px;
    height: 40px;
    background-color: #e1e9ee;
    margin-top: 8px;
    line-height: 40px;
    text-align: center;
    color: var(--main-color);
    font-size: 13px;
    border-radius: 4px;
    transition: 0.3s;
    cursor: pointer;
    a:visited{
      color: var(--main-color);
    }
    &:hover {
      color: var(--active-color);
    }
    .icon {
      font-size: 20px;
    }
    img{
      width: 30px;
      height: 30px;
      margin-top: 5px;
    }
  }

  #fankui {
    background-color: #99aebc;
    &:hover {
      color: #222222;
    }
  }
  #to-top {
    padding-top: 5px;
    .icon {
      width: 24px;
      height: 24px;
    }
  }
}
.weixin-btn {
  position: relative;
  & > div {
    position: absolute;
    left: -190px;
    top: -150px;
    img {
      width: 160px;
      height: 284px;
      border-radius: 10px;
    }
  }
}
.form-footer {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;
}
.footer {
  text-align: center;
  height:60px;
  .footer-inner{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    background-color: #e5e5e5;
  }

}
::v-deep .el-textarea__inner {
  font-family: 'Pingfang-Medium';
}
.other{
  padding: 24px;
  color: #fff;
  margin-top: 24px;
  background: linear-gradient(180deg,#4f48ad,#1d185e);
  &-item{
    line-height: 1.5;
    margin-bottom: 24px;
    img{
      width: 30vw;
    }
    .text{
      padding: 24px;
    }
  }
}
.theme-list {
  background: linear-gradient(270deg,#4fafff,#2777ff);
  position: sticky;
  left: 0;
  top: 0;
  z-index: 99;
  padding:1rem 0;
}
.fixed-nav {
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}
.fixed-nav-content {
  display: flex;
}
.tab-title {
  padding: 0 13px;
  margin-right: 12px;
  color: #141414;
  border-radius: 13px;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 0;
}
.tab-title.select-tab{
  color: #fff;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0.01rem;
  opacity: 0;
  display: none;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: #fff;
  opacity: 0;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  width: 0.01rem;
  border-radius: 0.01rem;
  opacity: 0;
}
//搜索
.search-wrap{
.el-select {
  width: 130px;
}
/deep/ .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
}

</style>
