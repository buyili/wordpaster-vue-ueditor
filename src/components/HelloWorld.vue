<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <vue-ueditor-wrap v-model="msg" :config="myConfig" @beforeInit="ueditorInit" @ready="ready"></vue-ueditor-wrap>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import {WordPaster,WordPasterManager} from '../../static/WordPaster/js/w'
import '../../static/WordPaster/css/w.css'
import '../../static/layer-v3.1.1/layer/layer'
import '../../static/layer-v3.1.1/layer/theme/default/layer.css'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'WordPaster for vue ueditor',
      myConfig: {
      // 编辑器不自动被内容撑高
      autoHeightEnabled: false,
      // 初始容器高度
      initialFrameHeight: 240,
      // 初始容器宽度
      initialFrameWidth: '100%',
      // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
      serverUrl: 'http://35.201.165.105:8000/controller.php',
      // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
      UEDITOR_HOME_URL: '../../static/UEditor/'
    }
    }
  },components: {VueUeditorWrap},
  mounted(){
  },
  methods:{
    ueditorInit(){
          //初始化
          WordPaster.getInstance({
			//上传接口配置教程：http://www.ncmem.com/doc/view.aspx?id=d88b60a2b0204af1ba62fa66288203ed
            PostUrl:"http://localhost:8891/upload.aspx",
            ImageUrl:"http://localhost:8891{url}"
          }).Load();
    },
    ready(ue){
      //
      ue.addshortcutkey({"wordpaster":"ctrl+86"});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
