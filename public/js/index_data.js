- function () {
    var data = {
        $: new Jquery(),
        info: [],
        listInfo: null,
        onceInfo: null,
        listParent: null,  //类目父元素
        contentParent: document.querySelector('.newList'),  //内容父元素
        loader: document.querySelector('.loading'),  //加载动画元素
        innerParent: document.querySelector('.newList'),    //所有新闻内容父元素
        imgUrl: '../img/news.jpg',
        page: 1,
        enter: false,
        enterChild: false,
        ajaxFlag: true,
        scrollTop: null,  //滚动穿透抓取滚动距离
        getelement() { 
            this.listParent = document.querySelector('.searchList')
        },
        getInfo: function (page) {
            this.$.config.page = page
            this.loader.style.transform = 'scaleY(1)'
            this.$.applyAjax('post', this.$.url, this.$.config, function (data) {   //新闻查询
                switch (data.showapi_res_code) {
                    case 0:
                        this.loader.style.transform = 'scaleY(0)'
                        this.ajaxFlag = this.loadIng = this.enter = true
                        this.info = this.info.concat(data.showapi_res_body.pagebean.contentlist)
                        var html = ''
                        for (var i = 0; i < this.info.length; i += 2) {
                            html += "<div class='newsContent'>" +
                                "<div class='title'>" +
                                "<h3><span>" + this.info[i].channelName + "</span><b>" + this.$.get2Unicode(this.info[i].channelName) + "</b></h3>" +
                                "<div class='more'>More &gt;</div>" +
                                "</div>" +
                                "<div class='content'>" +
                                "<div class='headTitle'>" +
                                "<img src='" + (this.info[i].imageurls && this.info[i].imageurls.length > 0 ? this.info[i].imageurls[0].url : this.imgUrl) + "'>" +
                                "<div class='headText'>" +
                                "<div class='rgba' data-id='" + this.info[i].id + "'></div>" +
                                "<p>" + this.info[i].title + "</p>" +
                                "<span class='time'>" + this.info[i].pubDate + "</span>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "<div class='title'>" +
                                "<h3><span>" + this.info[i + 1].channelName + "</span><b>" + this.$.get2Unicode(this.info[i + 1].channelName) + "</b></h3>" +
                                "<div class='more'>More &gt;</div>" +
                                "</div>" +
                                "<div class='contentLast'>" +
                                "<div class='rgba' data-id='" + this.info[i + 1].id + "'></div>" +
                                "<div class='img'>" +
                                "<div class='mbox'></div>" +
                                "<img src='" + (this.info[i + 1].imageurls && this.info[i + 1].imageurls.length > 0 ? this.info[i + 1].imageurls[0].url : this.imgUrl) + "'>" +
                                "</div>" +
                                "<div class='innerText'>" +
                                "<p>" + this.info[i + 1].title + "</p>" +
                                "<span class='time'>" + this.info[i].pubDate + "</span>" +
                                "</div>" +
                                "</div>" +
                                "</div>"
                        }
                        this.contentParent.innerHTML = html
                        this.enterLoad(this.enter,'.main','body>.enter')
                        window.addEventListener('scroll', this.scrollLoad.bind(this))
                        break
                    default:
                        alert(data.showapi_res_error)
                }
            }.bind(this))
        },
        enterLoad: function (falg, parent, child) { 
            setTimeout(function () { 
                if (falg) {
                    document.querySelector(child).classList.remove('show')
                    document.querySelector(parent).style.display = 'block'
                } else { 
                    this.enterLoad()
                }
            }.bind(this),300)
        },
        scrollLoad: function () {
            if (document.scrollingElement.scrollHeight - document.scrollingElement.scrollTop === window.innerHeight) {
                if (this.ajaxFlag) {
                    this.ajaxFlag = false
                    this.page++
                    this.getInfo(this.page)
                }
            }
        },
        getCategory: function () {  //新闻列表
            this.$.applyAjax('post', this.$.queryUrl, this.$.config, function (data) {
                switch (data.showapi_res_code) {
                    case 0:
                        this.listInfo = data.showapi_res_body.channelList
                        var fragment = document.createDocumentFragment()
                        this.listInfo.map(function (val) {
                            var li = document.createElement('li')
                            li.setAttribute('data-id', val.channelId)
                            li.innerHTML = val.name
                            fragment.appendChild(li)
                        }.bind(this))
                        this.listParent.firstElementChild.appendChild(fragment)
                        break
                    case 1:
                        throw new Error('系统调用错误')
                    default:
                        throw new Error(data.showapi_res_error)
                }
            }.bind(this))
        },
        innerHide: function () {
            container.classList.remove('show')
            document.body.style.position = 'static'
            document.body.style.top = 0
            container.querySelector('.enter').classList.add('show')
            document.scrollingElement.scrollTop = this.scrollTop
        },
        innerShow: function (e) {
            if (e.target.hasAttribute('data-id')) {
                this.enterChild = false
                this.scrollTop = document.scrollingElement.scrollTop
                container.classList.add('show')
                document.body.style.position = 'fixed'
                document.body.style.top = -this.scrollTop + 'px'
                var config = JSON.parse(JSON.stringify(this.$.config))
                delete config.page
                config.id = e.target.getAttribute('data-id')
                config.needAllList = 1
                config.needHtml = 1
                this.$.applyAjax('post', this.$.url, config, function (data) { 
                    switch (data.showapi_res_code) {
                        case 0:
                            var content = document.querySelector('.contentList .content')
                            this.onceInfo = data.showapi_res_body.pagebean.contentlist[0]
                            if (this.onceInfo.html && this.onceInfo.html !== '') {
                                content.innerHTML = this.onceInfo.html
                            } else { 
                                content.innerHTML = '<h3 class="h3">暂时没有更多内容哦<b>~</b></h3>'
                            }
                            new BScroll(document.querySelector('.innerBox .contentList'))
                            this.enterChild = true
                            this.enterLoad(this.enterChild, '.contentList', '.innerBox>.enter')
                            break
                        default:
                            throw new Error(data.showapi_res_error)
                    }
                }.bind(this))
            } 
        },
        move: function () {
            this.getInfo(this.page)
            this.getCategory()
            this.innerParent.addEventListener(
                'click',
                this.innerShow.bind(this)
            )
            document.querySelector('.innerBox .close').addEventListener('click', this.innerHide.bind(this))
        }
    }.move()
}()