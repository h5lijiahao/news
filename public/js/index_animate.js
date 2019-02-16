- function() { 
    var animate = { 
        nav: document.querySelector('.nav'),
        rightBtn: document.querySelector('.rightBtn'),
        closeParent: document.querySelector('.rightBox'), //功能栏
        close: document.querySelector('.rightBox .close'),//导航关闭按钮
        scrollTop: null,
        showTag: function() { 
            if (this.closeParent.classList.contains('hidden')) {
                this.closeParent.classList.remove('hidden')
                this.scrollTop = document.scrollingElement.scrollTop 
                document.body.style.position = 'fixed'
                document.body.style.top = -this.scrollTop + 'px'
            } else { 
                this.closeParent.classList.add('hidden')
                document.body.style.position = 'static'
                document.body.style.top = 0
                document.scrollingElement.scrollTop = this.scrollTop
            }
        },
        scroll: function () { 
            var scroll = document.scrollingElement.scrollTop
            if (scroll > 100) {
                this.nav.classList.add('move')
            } else { 
                this.nav.classList.remove('move')
            }
        },
        move: function () {
            new BScroll(document.querySelector('.searchList'))
            this.close.addEventListener(
                'click',
                this.showTag.bind(this)
            )
            this.rightBtn.addEventListener('click', this.showTag.bind(this))
            window.addEventListener('scroll',this.scroll.bind(this))
        }
    }.move()
}()