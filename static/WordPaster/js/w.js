import {FileUploader} from './w.file'
import './json2.min'
import './jquery-1.8.3.min'
/*
	版权所有 2009-2021 荆门泽优软件有限公司 保留所有版权。
	产品：http://www.ncmem.com/webapp/wordpaster/index.aspx
    控件：http://www.ncmem.com/webapp/wordpaster/pack.aspx
    示例：http://www.ncmem.com/webapp/wordpaster/versions.aspx
    版本：2.4.4
    更新记录：
		2012-07-04 增加对IE9的支持。
*/
function debugMsg(m) { $("#msg").append(m);}

export function WebServer(mgr)
{
    var _this = this;
    // 创建一个Socket实例
    this.socket = null;
    this.tryConnect = true;
    this.exit = false;
    this.runed = false;

    this.run = function ()
    {
        if (this.runed) return;
        if (typeof navigator.msLaunchUri != 'undefined')
        {
            console.log(mgr.Config.edge.protocol + "://" + mgr.Config.edge.port);
            //up6://9006
            navigator.msLaunchUri(mgr.Config.edge.protocol + "://" + mgr.Config.edge.port, function ()
            {
                console.log('应用打开成功');
            }, function ()
            {
                console.log('启动失败');
            });
            _this.runed = true;
        }
    };
    this.runChr = function () {
        var protocol = mgr.Config.edge.protocol + "://?port=" + mgr.Config.edge.port;
        var html = "<iframe id='wordpaster-uri-fra' width=1 height=1 src='" + protocol + "'></iframe>";
        $("#wordpaster-uri-fra").remove();
        $(document.body).append(html);
    };
    this.connect = function ()
    {
        if (!_this.tryConnect) return;
        var con = new WebSocket('ws://127.0.0.1:' + mgr.Config.edge.port);
        console.log("开始连接服务:" + 'ws://127.0.0.1:' + mgr.Config.edge.port);

        // 打开Socket 
        con.onopen = function (event)
        {
            _this.socket = con;
            _this.tryConnect = false;
            console.log("服务连接成功");

            // 监听消息
            con.onmessage = function (event)
            {
                mgr.recvMessage(event.data);
            };

            // 监听Socket的关闭
            con.onclose = function (event)
            {
                //手动退出
                if (!this.exit) {
                    _this.tryConnect = true;
                    _this.run();
                }
            };
        };
        con.onerror = function (event)
        {
            _this.run();
            console.log("连接失败");
        };
    };
    this.close = function ()
    {
        this.exit = true;
    };
    this.send = function (p)
    {
        if (this.socket) this.socket.send(p);
    };
}
/*
	上传对象管理器
	关联HTML元素：
		文件上传列表：FilePostLister
		文件上传列表项模板：UploaderTemplate
		文件上传列表分隔线：FilePostLine
*/
export function WordPasterManager()
{
	var _this = this;
	
    window.UE.registerUI('wordpaster', function (editor, uiName) {
        editor.registerCommand(uiName, {
            execCommand: function () {
                editor.focus();
                _this.SetEditor(editor);
                _this.PasteManual();
            }
        });
        var iconUrl = editor.options.UEDITOR_HOME_URL + '../WordPaster/css/paster.png';

        var btn = new window.UE.ui.Button({
            name: "Word一键粘贴",
            //提示
            title: 'Word一键粘贴',
            cssRules: 'background: url("' + iconUrl + '") no-repeat 2px 2px !important',
            onclick: function () {
                editor.focus();
                _this.SetEditor(editor);
                _this.PasteManual();
            }
        });
        editor.addListener('selectionchange', function () {
            var state = editor.queryCommandState(uiName);
            if (state == -1) {
                btn.setDisabled(true);
                btn.setChecked(false);
            } else {
                btn.setDisabled(false);
                btn.setChecked(state);
            }
        });
        editor.addListener('ready', function () {
            _this.SetEditor(editor);
        });
        editor.addListener("firstBeforeExecCommand", function () {
            _this.SetEditor(editor);
        });
        return btn;
    });
    window.UE.registerUI('netpaster', function (editor, uiName) {
        editor.registerCommand(uiName, {
            execCommand: function () {
                editor.focus();
                _this.SetEditor(editor);
                _this.UploadNetImg();
            }
        });
        var iconUrl = editor.options.UEDITOR_HOME_URL + '../WordPaster/css/net.png';

        var btn = new window.UE.ui.Button({
            name: "自动上传网络图片",
            title: '自动上传网络图片',
            cssRules: 'background: url("' + iconUrl + '") no-repeat 2px 2px !important',
            onclick: function () {
                editor.focus();
                _this.SetEditor(editor);
                _this.UploadNetImg();
            }
        });
        editor.addListener('selectionchange', function () {
            var state = editor.queryCommandState(uiName);
            if (state == -1) {
                btn.setDisabled(true);
                btn.setChecked(false);
            } else {
                btn.setDisabled(false);
                btn.setChecked(state);
            }
        });
        editor.addListener('ready', function () {
            _this.SetEditor(editor);
        });
        editor.addListener("firstBeforeExecCommand", function () {
            _this.SetEditor(editor);
        });
        return btn;
    });
    window.UE.registerUI('ppt', function (editor, uiName) {
        editor.registerCommand(uiName, {
            execCommand: function () {
                editor.focus();
                _this.SetEditor(editor);
                _this.PastePPT();
            }
        });
        var iconUrl = editor.options.UEDITOR_HOME_URL + '../WordPaster/css/ppt.png';

        var btn = new window.UE.ui.Button({
            name: "PowerPoint一键粘贴",
            title: 'PowerPoint一键粘贴',
            cssRules: 'background: url("' + iconUrl + '") no-repeat 2px 2px !important',
            onclick: function () {
                editor.focus();
                _this.SetEditor(editor);
                _this.PastePPT();
            }
        });
        editor.addListener('selectionchange', function () {
            var state = editor.queryCommandState(uiName);
            if (state == -1) {
                btn.setDisabled(true);
                btn.setChecked(false);
            } else {
                btn.setDisabled(false);
                btn.setChecked(state);
            }
        });
        editor.addListener('ready', function () {
            _this.SetEditor(editor);
        });
        editor.addListener("firstBeforeExecCommand", function () {
            _this.SetEditor(editor);
        });
        return btn;
    });
    this.Editor = null;
    this.Fields = {}; //符加信息
    this.UploadDialogCreated = false;
    this.PasteDialogCreated = false;
    this.imgPasterDlg = null;//jquery obj
    this.imgUploaderDlg = null;//jquery obj
    this.imgIco = null;//jquery obj
    this.imgMsg = null;//jquery obj
    this.imgPercent = null;//jquery obj
    this.ui = { setup: null ,single:null,dialog:{files:0/**word图片上传窗口 */,paste:0/**粘贴窗口 */}};
    this.data={
    	editor:null,
        browser:{name:navigator.userAgent.toLowerCase(),ie:true,ie64:false,chrome:false,firefox:false,edge:false,arm64:false,mips64:false,platform:window.navigator.platform.toLowerCase()},
        error:{
        "0": "连接服务器错误",
        "1": "发送数据错误",
        "2": "接收数据错误",
        "3": "未设置文件路径",
        "4": "本地文件不存在",
        "5": "打开本地文件错误",
        "6": "不能读取本地文件",
        "7": "公司未授权",
        "8": "未设置IP",
        "9": "域名未授权",
        "10": "文件大小超出限制",
        "11": "不能设置回调函数",
        "12": "Native控件错误",
        "13": "Word图片数量超过限制"
      },
      type:{local:0/*本地图片*/,network:1/*网络图片*/,word:2/*word图片*/},
    };
    this.ffPaster = null;
    this.ieParser = null;
    this.ffPasterName = "ffPaster" + new Date().getTime();
    this.iePasterName = "iePaster" + new Date().getTime();
    this.setuped = false;//控件是否安装
    this.websocketInited = false;
    this.natInstalled = false;
    this.filesPanel = null;//jquery obj
    this.fileItem = null;//jquery obj
    this.line = null;//jquery obj
	this.Config = {
		editor:null,
		"EncodeType"		    : "GB2312"
		, "Company"			    : "荆门泽优软件有限公司"
		, "Version"			    : "1,5,141,60875"
		, "License2"			: ""
		, "Debug"			    : false//调试模式
		, "LogFile"			    : "f:\\log.txt"//日志文件路径
		, "PasteWordType"	    : ""	//粘贴WORD的图片格式。JPG/PNG/GIF/BMP，推荐使用JPG格式，防止出现大图片。
		, "PasteImageType"	    : ""	//粘贴文件，剪帖板的图片格式，为空表示本地图片格式。JPG/PNG/GIF/BMP
		, "PasteImgSrc"		    : ""	//shape:优先使用源公式图片，img:使用word自动生成的图片
		, "JpgQuality"		    : "100"	//JPG质量。0~100
		, "QueueCount"		    : "5"	//同时上传线程数
		, "CryptoType"		    : "uuid"//名称计算方式,md5,crc,sha1,uuid，其中uuid为随机名称
		, "ThumbWidth"		    : "0"	//缩略图宽度。0表示不使用缩略图
		, "ThumbHeight"		    : "0"	//缩略图高度。0表示不使用缩略图
		, "FileFieldName"		: "file"//自定义文件名称名称
		, "ImageMatch"		    : ""//服务器返回数据匹配模式，正则表达式，提取括号中的地址
		, "ImageUrl"		    : ""//自定义图片地址，格式"{url}"，{url}为固定变量，在此变量前后拼接图片路径，此变量的值为posturl返回的图片地址
		, "FileCountLimit"		: 300//图片数量限制
		, "AppPath"			    : ""
		, "Cookie"			    : ""
		, "Servers"             : [{"url":"www.ncmem.com"},{"url":"www.xproerui.com"}]//内部服务器地址(不下载此地址中的图片)
		, "WebImg"              : {urlEncode:true/*下载外部图片地址是URL是否自动编码，默认情况下自动编码，部分网站URL没有进行编码*/}
		, "IcoError"            : "http://www.ncmem.com/products/word-imagepaster/ckeditor353/WordPaster/error.png"
		, "IcoUploader"         : "http://www.ncmem.com/products/word-imagepaster/ckeditor353/WordPaster/upload.gif"
		, "PostUrl"			    : "http://www.ncmem.com/products/word-imagepaster/fckeditor2461/asp.net/upload.aspx"
		//x86
		,ie:{name:"Xproer.WordParser2",clsid:"2404399F-F06B-477F-B407-B8A5385D2C5E",path:"http://res2.ncmem.com/download/WordPaster/fast/2.0.29/WordPaster.cab"}
		//x64
		,ie64:{name:"Xproer.WordParser2x64",clsid:"7C3DBFA4-DDE6-438A-BEEA-74920D90764B",path:"http://res2.ncmem.com/download/WordPaster/fast/2.0.29/WordPaster64.cab"}
		//Firefox
		, "XpiType"	            : "application/npWordPaster2"
		, "XpiPath"		        : "http://res2.ncmem.com/download/WordPaster/fast/2.0.29/WordPaster.xpi"
		//Chrome
		, "CrxName"		        : "npWordPaster2"
		, "CrxType"	            : "application/npWordPaster2"
		, "CrxPath"		        : "http://res2.ncmem.com/download/WordPaster/fast/2.0.29/WordPaster.crx"
		//Edge
		, edge: { protocol: "wordpaster", port: 9200, visible: false }
		, "ExePath": "http://res2.ncmem.com/download/WordPaster/fast/2.0.29/WordPaster.exe"
		, "mac": { path: "http://res2.ncmem.com/download/WordPaster/mac/1.0.17/WordPaster.pkg" }
		, "linux": { path: "http://res2.ncmem.com/download/WordPaster/linux/1.0.8/com.ncmem.wordpaster_2020.12.3-1_amd64.deb" }
		, "arm64": { path: "http://res2.ncmem.com/download/WordPaster/arm64/1.0.5/com.ncmem.wordpaster_2020.12.3-1_arm64.deb" }
		, "mips64": { path: "http://res2.ncmem.com/download/WordPaster/mips64/1.0.1/com.ncmem.wordpaster_2020.12.3-1_mips64el.deb" }
	};
	this.EditorContent = ""; //编辑器内容。当图片上传完后需要更新此变量值
	this.CurrentUploader = null; //当前上传项。
	this.UploaderList = new Object(); //上传项列表
    //已上传图片列表
    //模型：LocalUrl:ServerUrl
	this.UploaderListCount = 0; //上传项总数
	this.fileMap = new Object();//文件映射表。
	this.postType = this.data.type.word;//默认是word
    this.working = false;//正在上传中
    this.pluginInited = false;
    this.edgeApp = new WebServer(this);
    this.app = {
		entID: "Uploader7Event"
		, ins: null
		, check: function ()//检查插件是否已安装
		{
			return null != this.GetVersion();
		}
		, supportFF: function () {
			var mimetype = navigator.mimeTypes;
			if (typeof mimetype == "object" && mimetype.length) {
				for (var i = 0; i < mimetype.length; i++)
				{
					var enabled = mimetype[i].type == this.ins.Config.XpiType;
					if (!enabled) enabled = mimetype[i].type == this.ins.Config.XpiType.toLowerCase();
					if (enabled) return mimetype[i].enabledPlugin;
				}
			}
			else {
				mimetype = [this.ins.Config.XpiType];
			}
			if (mimetype) {
				return mimetype.enabledPlugin;
			}
			return false;
		}
		, NeedUpdate: function () {
			return this.GetVersion() != this.Config["Version"];
		}
		, getHtmlIE: function () {
			var acx = '<div style="display: none">';
			//Word解析组件
			acx += ' <object id="objWordParser" classid="clsid:' + this.config.ie.clsid + '"';
			acx += ' codebase="' + this.config.ie.path + '#version=' + this.config["Version"] + '"';
			acx += ' width="1" height="1" ></object>';
			acx += '</div>';
			return acx;}
		, getHtmlFF: function () {
			var html = '<embed type="' + this.config["XpiType"] + '" pluginspage="' + this.config["XpiPath"] + '" width="1" height="1" id="objWordPaster"/>';
			return html; }
		, getHtmlChr: function () {
			var html = '<embed type="' + this.config["CrxType"] + '" pluginspage="' + this.config["CrxPath"] + '" width="1" height="1" id="objWordPaster"/>';
			return html;
		}
		, setUpChr: function () {
				document.write('<iframe style="display:none;" src="' + this.config["XpiPath"] + '"></iframe>');
		}
		, init: function () {
			var param = { name: "init", config: this.ins.Config,fields:this.ins.Fields };
			this.postMessage(param);
		}
		, exit: function () {
			var par = { name: 'exit' };
			var evt = document.createEvent("CustomEvent");
			evt.initCustomEvent(this.entID, true, false, par);
			document.dispatchEvent(evt);
		}
		, exitEvent: function () {
			var obj = this;
			$(window).bind("beforeunload", function () { obj.exit(); });
		}
		, paste: function () {
			var param = { name: "paste"};
			this.postMessage(param);
		}
		, pastePPT: function () {
			var param = { name: "pastePPT"};
			this.postMessage(param);
		}
		, pasteAuto: function (data) {
			var param = { name: "pasteAuto",html:data};
			this.postMessage(param);
		}
		, postMessage: function (json) {
			try {
				this.ins.parter.postMessage(JSON.stringify(json));
			}
			catch (e) { console.log("调用postMessage失败，请检查控件是否安装成功"); }
		}
		, postMessageEdge: function (json) {
			try {
				this.ins.edgeApp.send(JSON.stringify(json));
			}
			catch (e) { console.log("调用postMessage失败，请检查控件是否安装成功"); }
		}
	};
    this.app.ins = this;
    var browserName = navigator.userAgent.toLowerCase();
	this.data.browser.ie = this.data.browser.name.indexOf("msie") > 0;
    //IE11
	this.data.browser.ie = this.data.browser.ie ? this.data.browser.ie : this.data.browser.name.search(/(msie\s|trident.*rv:)([\w.]+)/) != -1;
	this.data.browser.firefox = this.data.browser.name.indexOf("firefox") > 0;
    this.data.browser.chrome = this.data.browser.name.indexOf("chrome") > 0;    
	this.data.browser.chrome45 = false;
    this.data.browser.edge = this.data.browser.name.indexOf("Edge") > 0;
    this.data.browser.arm64 = this.data.browser.platform.indexOf("aarch64")>0;
    this.data.browser.mips64 = this.data.browser.platform.indexOf("mips64")>0;
	this.chrVer = navigator.appVersion.match(/Chrome\/(\d+)/);
	this.ffVer = this.data.browser.name.match(/Firefox\/(\d+)/);
	if (this.data.browser.edge) { this.data.browser.ie = this.data.browser.firefox = this.data.browser.chrome = this.data.browser.chrome45 = false; }

    //Win64
    if (window.navigator.platform == "Win64")
	{
		$.extend(this.Config.ie,this.Config.ie64);
    }//macOS
    else if (window.navigator.platform == "MacIntel") {
        this.data.browser.edge = true;
        this.app.postMessage = this.app.postMessageEdge;
        this.edgeApp.run = this.edgeApp.runChr;
        this.Config.ExePath = this.Config.mac.path;
    }
    else if (window.navigator.platform == "Linux x86_64") {
        this.data.browser.edge = true;
        this.app.postMessage = this.app.postMessageEdge;
        this.edgeApp.run = this.edgeApp.runChr;
        this.Config.ExePath = this.Config.linux.path;
    }
    else if (this.data.browser.arm64) {
        this.data.browser.edge = true;
        this.app.postMessage = this.app.postMessageEdge;
        this.edgeApp.run = this.edgeApp.runChr;
        this.Config.ExePath = this.Config.arm64.path;
    }
    else if (this.data.browser.mips64) {
        this.data.browser.edge = true;
        this.app.postMessage = this.app.postMessageEdge;
        this.edgeApp.run = this.edgeApp.runChr;
        this.Config.ExePath = this.Config.mips64.path;
    }//Firefox
	else if (this.data.browser.firefox)
    {
        this.app.postMessage = this.app.postMessageEdge;
        this.edgeApp.run = this.edgeApp.runChr;
        this.data.browser.edge = true;
	} //chrome
	else if (this.data.browser.chrome)
	{
	    _this.Config["XpiPath"] = _this.Config["CrxPath"];
	    _this.Config["XpiType"] = _this.Config["CrxType"];
	    
        this.data.browser.edge = true;
        this.app.postMessage = this.app.postMessageEdge;
        this.edgeApp.run = this.edgeApp.runChr;
	}
	else if (this.data.browser.edge)
    {
        this.app.postMessage = this.app.postMessageEdge;
	}

    this.pluginLoad = function () {
        if (!this.pluginInited) {
            if (this.data.browser.edge) {
                this.edgeApp.connect();
            }
        }
    };
    this.pluginCheck = function () {
        if (!this.pluginInited) {
            this.setup_tip();
            this.pluginLoad();
            return false;
        }
        return true;
    };
    this.setup_tip = function () {
        var dom = this.ui.setup.find("div").html("控件加载中，如果未加载成功请先<a name='w-exe'>安装控件</a>");
        var lnk = dom.find('a[name="w-exe"]');
        lnk.attr("href", this.Config["ExePath"]);
        this.ui.dialog.paste = layer.open({
            type: 1,
            title: "安装提示",
            closeBtn: 1,
            area: ['291px', '124px'],
            scrollbar: false,
            content: _this.ui.setup,
            end: function () {
                _this.ui.dialog.paste=0;
            }
        });
    };
    this.need_update = function ()
    {
        var dom = this.ui.setup.html("发现新版本，请<a name='w-exe' href='#'>更新</a>");
        var lnk = dom.find('a[name="w-exe"]');
        lnk.attr("href", this.Config["ExePath"]);
        this.ui.dialog.paste = layer.open({
            type: 1,
            title: "更新提示",
            closeBtn: 1,
            area: ['170px', '113px'],
            content: _this.ui.setup,
            end: function () {
                _this.ui.dialog.paste=0;
            }
        });
    };
	this.setupTipClose = function ()
	{
	    var dom = this.imgMsg.html("图片上传中......");
	    this.imgPercent.show();
	    this.imgIco.show();
        this.CloseDialogPaste();
        this.setuped = true;
	};
	this.CheckUpdate = function ()
	{
	    if (this.Browser.CheckVer())
	    {
	        this.OpenDialogPaste();
	        var dom = this.imgMsg.html("控件有新版本，请<a name='aCtl'>更新控件</a>");
	        var lnk = dom.find('a[name="aCtl"]');
	        lnk.attr("href", this.Config["ExePath"]);
	        this.imgPercent.hide();
	        this.imgIco.hide();
	    }
	};

    //加载控件及HTML元素
	this.GetHtml = function ()
	{
	    //Word图片粘贴
	    var acx = "";
        //Word解析组件
        acx += ' <object name="' + this.iePasterName + '" classid="clsid:' + this.Config.ie.clsid + '"';
	    acx += ' codebase="' + this.Config.ie.path + '#version=' + this.Config["Version"] + '"';
	    acx += ' width="1" height="1" ></object>';
	    if (this.data.browser.edge) acx = '';
	    //单张图片上传窗口
	    acx += '<div name="imgPasterDlg" class="panel-paster" style="display:none;">';
	    acx += '<img name="ico" id="infIco" alt="进度图标" src="' + this.Config["IcoUploader"] + '" /><span name="msg">图片上传中...</span><span name="percent">10%</span>';
        acx += '</div>';
        //安装提示
        acx += '<div name="ui-setup" class="panel-paster panel-setup"><div style="padding:10px;"></div></div>';
	    //图片批量上传窗口
        acx += '<div name="filesPanel" class="panel-files" style="display: none;"></div>';
	    //
	    acx += '<div style="display: none;">';

	    //文件上传列表项模板
	    acx += '<div class="UploaderItem" name="fileItem" id="UploaderTemplate">\
		            <div class="UploaderItemLeft">\
		            <div name="fname" class="FileName top-space">HttpUploader程序开发.pdf</div>\
		            <div class="ProcessBorder top-space">\
		                <div name="process" class="Process"></div>\
		            </div>\
		            <div name="msg" class="PostInf top-space">已上传:15.3MB 速度:20KB/S 剩余时间:10:02:00</div>\
		        </div>\
		        <div class="UploaderItemRight">\
		            <a name="btn" class="Btn" href="javascript:void(0)">取消</a>\
		            <div name="percent" class="ProcessNum">35%</div>\
		        </div>';
	    acx += '</div>'; //template end
	    //分隔线
	    acx += '<div name="line" class="Line" id="FilePostLine"></div>';

	    //hide div end
	    acx += '</div>';
	    return acx;
	};

    //加载控件及HTML元素
	this.Load = function ()
    {
        if (!WordPaster.inited)
        {
            var dom = $(document.body).append(this.GetHtml());
            this.ffPaster = dom.find('embed[name="' + this.ffPasterName + '"]').get(0);
            this.ieParser = dom.find('object[name="' + this.iePasterName + '"]').get(0);
            this.line = dom.find('div[name="line"]');
            this.fileItem = dom.find('div[name="fileItem"]');
            this.filesPanel = dom.find('div[name="filesPanel"]');
            this.imgUploaderDlg = dom.find('div[name="filesPanel"]');
            this.imgPasterDlg = dom.find('div[name="imgPasterDlg"]');
            this.imgIco = this.imgPasterDlg.find('img[name="ico"]');
            this.imgMsg = this.imgPasterDlg.find('span[name="msg"]');
            this.imgPercent = this.imgPasterDlg.find('span[name="percent"]');
            this.ui.single = dom.find('div[name="imgPasterDlg"]');
            this.ui.setup = dom.find('div[name="ui-setup"]');

            this.init();
        }
        WordPaster.inited = true;
	};

	this.LoadTo = function (oid)
    {
        if (!WordPaster.inited)
        {
            var dom = $("#" + oid).append(this.GetHtml());
            this.ffPaster = dom.find('embed[name="' + this.ffPasterName + '"]').get(0);
            this.ieParser = dom.find('object[name="' + this.iePasterName + '"]').get(0);
            this.line = dom.find('div[name="line"]');
            this.fileItem = dom.find('div[name="fileItem"]');
            this.filesPanel = dom.find('div[name="filesPanel"]');
            this.imgUploaderDlg = dom.find('div[name="filesPanel"]');
            this.imgPasterDlg = dom.find('div[name="imgPasterDlg"]');
            this.ui.single = dom.find('div[name="imgPasterDlg"]');
            this.imgIco = this.imgPasterDlg.find('img[name="ico"]');
            this.imgMsg = this.imgPasterDlg.find('span[name="msg"]');
            this.imgPercent = this.imgPasterDlg.find('span[name="percent"]');
            this.ui.setup = dom.find('div[name="ui-setup"]');

            this.init();
        }
        WordPaster.inited = true;
	};

    //在文档加载完毕后调用
	this.init = function ()
	{
        setTimeout(function ()
        {
            if (!_this.data.browser.edge)
            {
                _this.parter = _this.ffPaster;
                if (_this.data.browser.ie) _this.parter = _this.ieParser;
                _this.parter.recvMessage = _this.recvMessage;
            }
            if (_this.data.browser.edge) {
                _this.edgeApp.connect();
            }
            else { _this.app.init(); }
	    }, 500);
	};

    //打开图片上传对话框
	this.OpenDialogFile = function ()
	{
        if(0 == this.ui.dialog.files)
        this.ui.dialog.files = layer.open({
            type: 1,
            title: "图片上传窗口",
            closeBtn: 1,
            area: ['452px', '445px'],
            skin: 'layui-layer-nobg',
            shadeClose: false,
            content: _this.imgUploaderDlg,
            cancel: function () {
                if (_this.working) return false;
                return true;
            },
            end:function(){
                _this.ui.dialog.files=0;
            }
        });
	};
	this.CloseDialogFile = function ()
	{
        layer.closeAll();
	};

    //打开粘贴图片对话框
	this.OpenDialogPaste = function ()
	{
		if( 0 == this.ui.dialog.paste )
        this.ui.dialog.paste = layer.open({
            type: 1,
            title: "上传进度",
            closeBtn: 1,
            area: ['500px', '107px'],
            shadeClose: false,
            content: _this.imgPasterDlg,
            cancel: function(){
        		if(_this.working)return false;
        		return true;
        	},
            end: function () {
                _this.ui.dialog.paste = 0;
            }        
        });
	};
	this.CloseDialogPaste = function ()
	{
        layer.closeAll();
	};
	this.InsertHtml = function (html)
	{
		_this.Editor.execCommand("insertHtml", html);	
	};
	this.GetEditor = function () { return CKEDITOR.currentInstance; };

    //在FCKeditor_OnComplete()中调用
	this.SetEditor = function (edt)
	{
	    _this.Editor = edt;
        this.data.editor = edt;
	};

    //粘贴命令
	this.Paste = function (evt)
	{
	    this.PasteManual();
	};

    //单击按钮粘贴
	this.PasteManual = function ()
	{
	    if( !this.pluginCheck() ) return;
        if(this.working) return;        
        this.app.paste();
        this.working = true;
    };

    //powerpoint
	this.PastePPT = function ()
	{
		if( !this.pluginCheck() ) return;
		if(this.working) return;
		this.app.pastePPT();
		this.working = true;
	};

    //上传网络图片
	this.UploadNetImg = function ()
	{
		if( !this.pluginCheck() ) return;
	    var data = _this.Editor.getContent();
        this.app.pasteAuto(data);
	};

	/*
	根据ID删除上传任务
	参数:
	fileID
	*/
	this.Delete = function(fileID)
	{
		var obj = this.UploaderList[fileID];
		if (null == obj) return;

		var tbID = "item" + obj.FileID;
		var item = document.getElementById(tbID);
		if (item) document.removeChild(item); //删除
	};

	/*
		添加到上传列表
		参数
			index 上传对象唯一标识
			uploaderObj 上传对象
	*/
	this.AppendToUploaderList = function(index, uploaderObj)
	{
		this.UploaderList[index] = uploaderObj;
		++this.UploaderListCount;
	};

	/*
		添加到上传列表层
		参数
			fid 文件ID
			div 上传信息层对象
			obj 上传对象
	*/
	this.AppendToListDiv = function(fid, div, obj)
	{
		var line = this.line.clone(true); //分隔线
		line.attr("id", "FilePostLine" + fid)
            .css("display", "block");
		obj.Separator = line;

		this.filesPanel.append(div);
		this.filesPanel.append(line);
	};

	/*
		更新编辑器内容。
		在所有图片上传完后调用。
		在上传图片出现错误时调用。
	*/
	this.UpdateContent = function ()
	{
	    _this.InsertHtml(_this.EditorContent);
	};

	this.addImgLoc = function (img)
	{
	    var fid = img.id;
	    var task = new FileUploader(img.id, img.src, this, img.width, img.height);
	    this.fileMap[img.id] = task;//添加到文件映射表
	    var ui = this.fileItem.clone();
	    ui.css("display", "block").attr("id", "item" + fid);

	    var objFileName = ui.find('div[name="fname"]');
	    var divMsg = ui.find('div[name="msg"]');
	    var aBtn = ui.find('a[name="btn"]');
	    var divPercent = ui.find('div[name="percent"]');
	    var divProcess = ui.find('div[name="process"]');

	    objFileName.text(img.name).attr("title", img.name);
	    task.pProcess = divProcess;
	    task.pMsg = divMsg;
	    task.pMsg.text("");
	    task.pButton = aBtn;
	    aBtn.attr("fid", fid)
            .attr("domid", "item" + fid)
            .attr("lineid", "FilePostLine" + fid)
            .click(function ()
            {
                switch ($(this).text())
                {
                    case "暂停":
                    case "停止":
                        task.Stop();
                        break;
                    case "取消":
                        { task.Remove(); }
                        break;
                    case "续传":
                    case "重试":
                        task.Post();
                        break;
                }
            });
	    task.pPercent = divPercent;
	    task.pPercent.text("0%");
	    task.ImageTag = img.html; //图片标记
	    task.InfDiv = ui;//上传信息DIV

	    //添加到上传列表层
	    this.AppendToListDiv(fid, ui, task);

	    //添加到上传列表
	    this.AppendToUploaderList(fid, task);
	    task.Ready(); //准备
	    return task;
	};
	this.WordParser_PasteWord = function (json)
    {
	    this.postType = this.data.type.word;
	    this.EditorContent = json.word;
	    for (var i = 0, l = json.imgs.length; i < l; ++i)
	    {
	        this.addImgLoc(json.imgs[i]);
	    }
	};
	this.WordParser_PasteExcel = function (json)
	{
	    this.postType = this.data.type.word;
	    this.EditorContent = json.word;
	    for (var i = 0, l = json.imgs.length; i < l; ++i)
	    {
	        this.addImgLoc(json.imgs[i]);
	    }
	    this.OpenDialogFile();
	};
	this.WordParser_PasteHtml = function (json)
	{
	    this.postType = this.data.type.word;
	    this.InsertHtml(json.word);//
        this.CloseDialogFile();
	    this.working = false;
	};
	this.WordParser_PasteFiles = function (json)
	{
	    this.postType = this.data.type.local;
	    for (var i = 0, l = json.imgs.length; i < l; ++i)
	    {
	        var task = this.addImgLoc(json.imgs[i]);
	        task.PostLocalFile = true;//
	    }
	    this.OpenDialogFile();
	};
	this.WordParser_PasteImage = function (json)
	{
	    this.OpenDialogPaste();
	    this.imgMsg.text("开始上传");
	    this.imgPercent.text("1%");
	};
	this.WordParser_PasteAuto = function (json)
	{
	    this.postType = this.data.type.network;
	    for (var i = 0, l = json.imgs.length; i < l; ++i)
	    {
	        this.addImgLoc(json.imgs[i]);
	    }
	    this.OpenDialogFile();
	};
	this.WordParser_PostComplete = function (json)
	{
	    this.imgPercent.text("100%");
	    this.imgMsg.text("上传完成");
	    var img = "<img src=\"";
	    img += json.value;
	    img += "\" />";
	    this.InsertHtml(img);
	    this.CloseDialogPaste();
	    this.working = false;
	};
	this.WordParser_PostProcess = function (json)
	{
	    this.imgPercent.text(json.percent);
	};
	this.WordParser_PostError = function (json)
	{
		this.OpenDialogPaste();
        this.imgMsg.html(
            this.data.error[json.value] + "<br/>" +
            "PostUrl:" + this.Config["PostUrl"] + "<br/>" +
            "License:" + this.Config["License"] + "<br/>" +
            "License2:" + this.Config["License2"] + "<br/>" +
            "当前url:" + window.location.href);
	    this.imgIco.attr("src",this.Config["IcoError"]);
	    this.imgPercent.text("");
	    this.working = false;
	};
	this.File_PostComplete = function (json)
	{
	    var up = this.fileMap[json.id];
	    up.postComplete(json);
	    //delete up;//
	};
	this.File_PostProcess = function (json)
	{
	    var up = this.fileMap[json.id];
	    up.postProcess(json);
	};
	this.File_PostError = function (json)
	{
	    var up = this.fileMap[json.id];
	    up.postError(json);
	};
	this.Queue_Complete = function (json)
	{
	    //上传网络图片
	    if (_this.postType == this.data.type.network)
	    {
			//_this.GetEditor().setData(json.word);
			this.data.editor.setContent( json.word );
	    } //上传Word图片时才替换内容
	    else if (_this.postType == this.data.type.word)
	    {
	        _this.InsertHtml(json.word);//
	    }
	    this.CloseDialogFile();
	    _this.working = false;
	};
	this.load_complete_edge = function (json)
    {
		this.pluginInited = true;
        _this.app.init();
        this.CloseDialogPaste();
    };
    this.imgs_out_limit = function (json) {
        layer.alert(this.data.error["13"] + "<br/>文档图片数量：" + json.imgCount + "<br/>限制数量：" + json.imgLimit, { icon: 2 });
    };
    this.url_unauth = function (json) {
        layer.alert(this.data.error["9"] + "<br/>PostUrl：" + json.url, { icon: 2 });
    };
    this.state_change = function (json) {
        if (json.value == "parse_document")
        {
            this.OpenDialogFile();
            this.filesPanel.text("正在解析文档");
        }
        else if (json.value == "process_data") {
            this.filesPanel.text("正在处理数据");
        }
        else if (json.value == "process_data_end")
        {
            this.filesPanel.text("");
        }
        else if (json.value == "parse_empty") {
            this.CloseDialogFile();
        }
    };
    this.load_complete = function (json)
    {
        if (this.websocketInited) return;
        this.websocketInited = true;
		this.pluginInited = true;

        var needUpdate = true;
        if (typeof (json.version) != "undefined")
        {
            this.setuped = true;
            if (json.version == this.Config.Version) {
                needUpdate = false;
            }
        }
        if (needUpdate) this.need_update();
    };
    this.recvMessage = function (msg)
	{
	    var json = JSON.parse(msg);
	    if      (json.name == "Parser_PasteWord") _this.WordParser_PasteWord(json);
	    else if (json.name == "Parser_PasteExcel") _this.WordParser_PasteExcel(json);
	    else if (json.name == "Parser_PasteHtml") _this.WordParser_PasteHtml(json);
	    else if (json.name == "Parser_PasteFiles") _this.WordParser_PasteFiles(json);
	    else if (json.name == "Parser_PasteImage") _this.WordParser_PasteImage(json);
	    else if (json.name == "Parser_PasteAuto") _this.WordParser_PasteAuto(json);
	    else if (json.name == "Parser_PostComplete") _this.WordParser_PostComplete(json);
	    else if (json.name == "Parser_PostProcess") _this.WordParser_PostProcess(json);
	    else if (json.name == "Parser_PostError") _this.WordParser_PostError(json);
	    else if (json.name == "File_PostProcess") _this.File_PostProcess(json);
	    else if (json.name == "File_PostComplete") _this.File_PostComplete(json);
	    else if (json.name == "File_PostError") _this.File_PostError(json);
        else if (json.name == "load_complete") _this.load_complete(json);
	    else if (json.name == "Queue_Complete") _this.Queue_Complete(json);
	    else if (json.name == "load_complete_edge") _this.load_complete_edge(json);
        else if (json.name == "state_change") _this.state_change(json);
        else if (json.name == "imgs_out_limit") _this.imgs_out_limit(json);
        else if (json.name == "url_unauth") _this.url_unauth(json);
	};
}
/**
 * WordPaster.getInstance().Load()
 */
export var WordPaster = {
    instance: null,
    inited:false,
    getInstance: function (cfg) {
        if (this.instance == null) {
            this.instance = new WordPasterManager();
            $.extend(this.instance.Config,cfg);
            window.WordPaster = WordPaster;
        }
        return this.instance;
    }
}