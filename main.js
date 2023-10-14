let main = {
    username: 'کاربر تست',
    placeholderImg: 'resources/img/placeholder_img.png',
    dom: {
        headerWrapper: document.querySelector(".header-wrapper"),
        appBar: document.querySelector('.app-bar'),
        loadingOverlay: document.querySelector('.loading-overlay'),
        categoryList: document.querySelector(".category-list"),
        categorySelectorContainer: document.querySelector(".category-selector-container"),
        cloneableCategorySelector: document.querySelector("#cloneable-category-selector"),
        cloneableProduct: document.querySelector("#cloneable-product"),
        cloneableProductPlaceholder: document.querySelector("#cloneable-product-placeholder"),
        cloneableCategory: document.querySelector("#cloneable-category"),
        cloneableTag: document.querySelector("#cloneable-tag"),
        orderCheckoutCard: document.querySelector("#order-checkout-card"),
        orderCheckoutScreen: document.querySelector('#order-checkout-screen'),

        barsIcon: document.querySelector('.bars-icon'),
        hamburgerMenu: document.querySelector('.hamburger-menu'),

        pages: {},
        cloneable: {},
    },
    init: function(){
        $(main.dom.orderCheckoutCard).hide();

        addEventListener("scroll", (event) => {
            main.onScroll();
        });

        // this.test();
        this.refreshProducts();

        // checkout
        this.handleCheckout();

        // hamburger menu
        // this.handleHamburgerMenu();

        // user
        this.handleUser();

        // appbar
        this.handleAppBar();

        // initializers
        initializers.init();

        // cloneables
        this.refreshCloneables();

        // slideshows
        this.handleSlideshows();

        // pages
        this.refreshPages();
        this.switchPage('page-home');

        setTimeout(() => {
            window.scrollTo({
                left: 0, 
                top: 0,
                behavior: 'instant',
            });
        }, 32);

        document.body.style.display = '';
    },
    handleAppBar: function(){
        let items = Array.from(document.querySelectorAll('.app-bar-item'));
            items.forEach(item => {
                item.onclick = function(e, other){
                    items.forEach(item => {
                        item.classList.remove('active');
                        item.querySelector('i').classList.add('fa-regular');
                        item.querySelector('i').classList.remove('fa-solid');
                    });
                    this.classList.add('active');
                    this.querySelector('i').classList.add('fa-solid');
                    this.querySelector('i').classList.remove('fa-regular');
                    
                    if(item.id == 'app-bar-user' && document.body.dataset.currentPage != 'page-user'){
                        main.populateUserOrderHistory();
                    }

                    if(!other){
                        main.switchPage(this.getAttribute('data-target'));
                    }

                }
            });

        // document.querySelector('#app-bar-user').onclick = function(){
        //     main.openWelcomeScreen();
        // }
        document.querySelector('#app-bar-home').click();
    },
    handleHamburgerMenu: function(){
        console.log(main.dom.hamburgerMenu)
        main.dom.barsIcon.onclick = function(){
            let menuHidden = main.dom.hamburgerMenu.classList.contains('soft-hidden');
            if(menuHidden) {
                main.dom.hamburgerMenu.classList.remove('soft-hidden');
                main.dom.headerWrapper.classList.add('hamburger-shown');
            }
            else {
                main.dom.hamburgerMenu.classList.add('soft-hidden');
                main.dom.headerWrapper.classList.remove('hamburger-shown');
            }
        }
    },
    openCheckoutScreen: function(){
        let orderListElm = main.dom.orderCheckoutScreen.querySelector('.finalize-order-list');

        orderListElm.innerHTML = '';

        let allOrders = main.dom.categoryList.getElementsByClassName('ordered');
        Array.from(allOrders).forEach(order => {
            let name = order.querySelector('.product-title').textContent.trim();
            order.querySelectorAll('.tag-text').forEach(tag => {
                name += " - " + tag.textContent;
            });
            let type = order.getAttribute('data-order-type') == 'box' ? "جعبه" : "عدد";
            let quantity = order.getAttribute('data-orders');
            let productId = order.getAttribute('data-product-id');

            // orderListElm.innerHTML += `
            //     <div class="checkout-list-item">
            //         ${name}: ${quantity} عدد
            //     </div>
            // `
            orderListElm.innerHTML += `
                <div class="checkout-list-item">
                    <div class="checkout-product-card">
                        <div class="product-info">
                            ${order.querySelector(".product-title").innerHTML}
                            ${order.querySelector(".product-tags").innerHTML}
                            <hr>
                            <div class="checkout-info">
                                <div class="checkout-product-quantity badge-orange"> × ${utils.persianNum(quantity)} ${type} </div>
                                <span> ${order.querySelector(".product-price").innerHTML} </span>
                            </div>
                        </div>

                    </div>
                </div>
            `;
        });

        $(main.dom.orderCheckoutScreen).slideDown();
        $(main.dom.appBar).fadeOut('fast');
    },
    closeCheckoutScreen: function(){
        $(main.dom.orderCheckoutScreen).slideUp('fast');
        $(main.dom.appBar).slideDown('fast');
    },
    setUsername: function(username){
        main.username = username;
        utils.setCookie('username', username, 100);
        document.querySelector('.user-box #username').textContent = username;
        main.populateUserOrderHistory();
    },
    handleUser: function(){
        return;
        let username = utils.getCookie('username');
        if(!username)
            this.openWelcomeScreen();
        else 
            main.setUsername(username);
    },
    openWelcomeScreen: function(){
        document.querySelector('#welcome-screen #user-register-btn').onclick = function(){
            let username = document.querySelector('#welcome-screen input').value;
            if(!username){
                return;
            }
            main.setUsername(username);
            main.closeWelcomeScreen();
            document.querySelector('#app-bar-home').click();
        }

        $('#welcome-screen').show();
        $(main.dom.appBar).fadeOut('fast');

        if (navigator.userAgent.indexOf('gonative') > -1) {
            gonative.statusbar.set({
                'style':'light',
                'color':'F16100',
                'overlay':false,
            });
        }
          
    },
    closeWelcomeScreen: function(){
        $('#welcome-screen').slideUp('fast');
        $(main.dom.appBar).slideDown('fast');

        if (navigator.userAgent.indexOf('gonative') > -1) {
            gonative.statusbar.set({
                'style':'dark',
                'color':'FFFFFF',
                'overlay':false,
            });
        }
    },
    handleCheckout: function(){
        // productManager.checkout();
        document.querySelector('#order-checkout-card .btn').onclick = function(){
            main.openCheckoutScreen();
        }
        document.querySelector("#order-checkout-screen .finalize-order-btn").onclick = function(){
            // (async function(){
            //     main.loadingStart();
            //     await productManager.checkout();
            //     main.loadingEnd();
            //     main.closeCheckoutScreen();
            //     productManager.trashOrdered();
            // })();

            main.loadingStart();
            productManager.checkout()
            .then(res => {
                main.closeCheckoutScreen();
                productManager.trashOrdered(); 
                $('.order-success').show();
                $('.finalize-order-failed').hide();
                document.querySelector('.order-tracking-code').textContent = res.setId;
                window.scrollTo(0,0);
                main.populateUserOrderHistory()
            })
            .catch(e => {
                $('.order-success').hide();
                $('.finalize-order-failed').show();
            })
            .finally(() => {
                main.loadingEnd();
            });
        }
    },
    loadingStart: function(){
        $(main.dom.loadingOverlay).fadeIn('fast');
    },
    loadingEnd: function(){
        $(main.dom.loadingOverlay).fadeOut();
    },
    refreshProducts: function(){
        setTimeout(() => {
            productManager.loadProductList(`https://api.omegarelectrice.com/json/products.json?tmp=${new Date().getTime()}`);
        }, 0);
    },
    populateUserOrderHistory: function(){
        if(!productManager.list){
            return setTimeout(() => main.populateUserOrderHistory(), 100);
        }
        let listContainer = document.querySelector('.users-last-orders-list');
        listContainer.innerHTML = '<i class="fa-duotone fa-spinner-third fa-spin"></i>';
        $(".no-order-history").hide();
        // https://api.omegarelectrice.com/user/orderHistory.php?username=${main.username}
        fetch(`https://api.omegarelectrice.com/user/orderHistory.php?username=${main.username}`)
        .then(response => response.json())
        .then(history => {
            if(!history.length){ // no order history
                $(".no-order-history").show();
            }

            listContainer.innerHTML = '';
            history.reverse().slice(0, 64).forEach(order => {
                let product = productManager.getProductById(order.product);
                if(!product) return;

                // name
                let name = `${product.title}`;
                for(let key in product.tags){
                    let tagText = productManager.tagIdToText(key)
                    if(key == 'box_amount' || !tagText) continue;
                    name += ` <div class="tag"> <i class="fa-solid fa-tag"></i> ${tagText}: ${utils.persianNum(product.tags[key])}</div> `;
                }

                // processed
                let processed = '<span id="state" class="badge badge-blue"> در حال بررسی </span>';
                if(order.processed == 1) processed = '<span id="state" class="badge badge-green"> تایید شده </span>';
                else if(order.processed == -1) processed = '<span id="state" class="badge badge-red"> رد شده </span>';

                let item = main.dom.cloneable.orderHistoryItem.cloneNode(true);
                    item.querySelector('#product').innerHTML = name + '<hr>';
                    item.querySelector('#quantity').innerHTML = utils.persianNum(order.quantity);
                    item.querySelector('#type').innerHTML = order.type == 'box' ? "جعبه" : "عدد";
                    item.querySelector('#state').outerHTML = processed;
                    item.querySelector('#set-id').outerHTML = order.setId;
                    listContainer.appendChild(item);
            })
        })
    },
    scrollByPercent: function (percent) {
        let totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        let viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        let pixelValue = (viewportHeight * percent) / 100;
        window.scrollTo(0, pixelValue + window.scrollY);
    },
    wait: function(ms){
        return new Promise(resolve => {
            setTimeout(() => resolve(), ms);
        });
    },
    test: function(){
        for(let i = 0; i < 12; i++){
            productManager.addPlaceholderProduct();
        }
        setTimeout(() => {
            productManager.clearProductList();

            let testCategory1 = productManager.addCategory({title: 'دسته تست ۱'});
            let testCategory2 = productManager.addCategory({title: 'دسته تست ۲'});
            let testCategory3 = productManager.addCategory({title: 'دسته تست ۳'});
            let testCategory4 = productManager.addCategory({title: 'دسته تست ۴'});

            let testChars = `فونت ایران به کسانی که دارای اعتماد به نفس پایین هستند پیشنهاد می کنم نقاشی بکشند. وقتی دست به قلم شوند و متوجه بشوند که هر آنچه که بخواهند را می توانند روی تابلوی سفید رو به رویشان بکشند، کم کم اعتماد به نفسی درونشان شکل میگیرد که خواهند پذیرفت دنیای واقعی هم مثل نقاشی کردن است و کافیست دست به قلم شوند تا هر آنچه که میخواهند را در تابلوی دنیای واقعی شان خلق نمایند. سنس بطور قطع پر طرفدار‌ترین و پر استفاده ترین فونت، در طراحی رابط کاربری فارسی است. اگر به نقاشی های نقاشان ماهر توجه کنی، درون همه نقاشی هایشان می توانی خود واقعی شان را ببینی. زیرا آنها از تمام وجودشان مایه میگذارند تا بتوانند اثرشان را خلق کنند. تیم فونت‌ایران یک نقاشی منحصر به فرد باید بیننده اش را درگیر خود کرده و درون او احساسی را دچار تغییر و تحول گرداند. یک نقاش خوب نقاشی است که وقتی نقاشی اش را می کشد و به مخاطبش نشان می دهد، حس مخاطب از وقتی نقاشی را ندیده بود برای نقاشی کردن هایم هیچ سوژه ای نمیخواهم، من بهترین و عالیترین سوژه ام را یافته ام. آن سوژه تو هستی. وقتی زیباترین اثر خداوند رو به رویم قرار دارد، چرا باید به دنبال سوژه ای دیگر بگردم؟ تا وقتی که آن را دید تغییر نماید. در سال‌های مختلف همه وبسایت‌ها و اپلیکیشن‌های راه یافته به مرحله نهاییِ جشنواره وب و موبایل را به عنوان یک جامعه آماری نمونه مورد بررسی قرار داده است. در سال ۱۳۹۴ تنها یک سال پس از انتشار فونت ایران سنس ۱۷ درصد وبسایت‌ها و نرم افزارهای موبایل از فونت`
                .split(' ')
                .map(word => word + ' ');
            for(let x = 0; x < utils.randomInt(5, 15); x++){
                let category = productManager.addCategory({title: 'دسته تست ' + utils.persianNum(x + 1)});
                for(let i = 0; i < utils.randomInt(-5, 30); i++){
                    let o = {category: category};
                    if(!utils.randomInt(0, 4)){
                        o = {
                            title: utils.generateRandomChars(utils.randomInt(3, 5), testChars),
                            description: utils.generateRandomChars(utils.randomInt(7, 23), testChars),
                            price: 500 * utils.randomInt(2, 500),
                            image: 'https://img.freepik.com/free-photo/red-white-cat-i-white-studio_155003-13189.jpg?w=2000',
                            category: category,
                        }
                    }
                    productManager.addProduct(o);
                }
            }
            setTimeout(() => main.onScroll());
            // main.onScroll();
        }, utils.randomInt(1, 500));
    },

    handleSlideshows: function(){
        let slideshows = [...document.querySelectorAll('.image-slideshow')];
            slideshows.forEach(element => {
                let images = element.querySelectorAll('.slide-image');
                let activeSlideIndex = 0;
                let lastActiveSlideIndex = images.length - 1;

                let defaultPoint = element.querySelector('.image-slideshow-point');
                for(let i = 0; i < images.length - 1; i++){
                    let nPoint = defaultPoint.cloneNode(true);
                    element.querySelector('.image-slideshow-pointer-container').appendChild(nPoint);
                }
                let points = [...element.querySelectorAll('.image-slideshow-point')];

                function changeToActiveSlide(dir){
                    let addition = '';
                    if(dir){
                        addition = '-inv';
                    }

                    function removeAllAnimations(){
                        ['slide-image-anim-in', 'slide-image-anim-out', 'slide-image-anim-in-inv', 'slide-image-anim-out-inv'].forEach(anim => {
                            images.forEach(img => {
                                img.classList.remove(anim);
                            })
                        })
                    }

                    points.forEach((p, i) => {
                        if(i == activeSlideIndex){
                            p.classList.add('active');
                        } else {
                            p.classList.remove('active');
                        }
                    })

                    removeAllAnimations();

                    images[lastActiveSlideIndex].classList.add('slide-image-anim-out' + addition);
                    images[activeSlideIndex].classList.add('slide-image-anim-in' + addition);
                }

                changeToActiveSlide();

                let isTouching = false,
                    autoSlideDelay = 0;

                let autoSlideFn = () => {
                    if(isTouching) return;
                    if(autoSlideDelay > 0){
                        autoSlideDelay--;
                        return;
                    }
                    lastActiveSlideIndex = activeSlideIndex;
                    activeSlideIndex++;
                    if(activeSlideIndex >= images.length) activeSlideIndex = 0;
                    changeToActiveSlide();
                }

                let autoSlideInterval = setInterval(autoSlideFn, 3000);

                // touch handling
                let touchstartX = 0;
                let touchendX = 0;

                function checkDirection() {
                    lastActiveSlideIndex = activeSlideIndex;
                    if (touchendX < touchstartX) {
                        activeSlideIndex--;
                        if(activeSlideIndex < 0) activeSlideIndex = images.length - 1;
                        changeToActiveSlide(true);
                    }
                    if (touchendX > touchstartX) {
                        activeSlideIndex++;
                        if(activeSlideIndex >= images.length) activeSlideIndex = 0;
                        changeToActiveSlide(false);
                    }
                }
                document.addEventListener('touchstart', e => {
                    if(e.changedTouches[0].target.closest('.image-slideshow') !== element) return;
                    isTouching = true;
                    autoSlideDelay = 1;
                    touchstartX = e.changedTouches[0].screenX;
                })
                document.addEventListener('touchend', e => {
                    isTouching = false;
                    if(e.changedTouches[0].target.closest('.image-slideshow') !== element) return;
                    touchendX = e.changedTouches[0].screenX
                    checkDirection();
                })
            });
        
    },

    createSpecialContainers: function(title, arrProductIds){
        let specialContainers = [], specialProducts = [];
        
        productManager.list.forEach(item => {
            if(!item.tags || !item.tags['home_special']) return;

            specialProducts.push(item);

            if(specialContainers.indexOf(item.tags['home_special']) >= 0) return;
            specialContainers.push(item.tags['home_special']);
        });

        if(!specialContainers.length) return;

        specialContainers.forEach(containerName => {
            let container = main.dom.cloneable['special-product-wrapper'].cloneNode(true);
                container.querySelector('.special-product-wrapper-title').innerHTML = `<i style="color: orangered" class="fa-duotone fa-sparkles"></i> ` + containerName;
                main.dom.pages['page-home'].appendChild(container);

            specialProducts.forEach(item => {
                if(item.tags['home_special'] != containerName) return;

                let itemDom = document.querySelector(`[data-product-id="${item.id}"]`);

                let product = main.dom.cloneable['vertical-product'].cloneNode(true);
                    product.querySelector('.vertical-product-image').src = item.image || main.placeholderImg;
                    product.querySelector('.vertical-product-title').textContent = itemDom.querySelector('.product-title').innerHTML;
                    product.querySelector('.vertical-product-tag-container').innerHTML = itemDom.querySelector('.product-tags').innerHTML;
                    product.querySelector('.vertical-product-price').innerHTML = itemDom.querySelector('.product-price').innerHTML;
    
                    product.querySelector('.vertical-product-add-btn').onclick = function(){
                        itemDom.querySelector('.btn.action.add-box').click();
                        main.switchPage('page-order', true);
                        document.querySelector('#app-bar-order').onclick(null, true);
                        setTimeout(() => {
                            window.scrollTo({
                                left: 0, 
                                top: itemDom.offsetTop - main.dom.headerWrapper.offsetHeight + 122,
                                behavior: 'instant',
                            });
                        }, 1);
                    }
                    
    
                    product.querySelector('.vertical-product-tag-container');
    
                container.querySelector('.special-products-container').appendChild(product);
            })
        })

        return;



        let wrapper = main.dom.cloneable['special-product-wrapper'].cloneNode(true);
        main.dom.pages['page-home'].appendChild(wrapper);


        productManager.list.forEach(item => {
            if(!item.tags || !item.tags['home_special']) return;

            let itemDom = document.querySelector(`[data-product-id="${item.id}"]`);


            let product = main.dom.cloneable['vertical-product'].cloneNode(true);
                product.querySelector('.vertical-product-image').src = item.image || main.placeholderImg;
                product.querySelector('.vertical-product-title').textContent = itemDom.querySelector('.product-title').innerHTML;
                product.querySelector('.vertical-product-tag-container').innerHTML = itemDom.querySelector('.product-tags').innerHTML;
                product.querySelector('.vertical-product-price').innerHTML = itemDom.querySelector('.product-price').innerHTML;

                product.querySelector('.vertical-product-add-btn').onclick = function(){
                    itemDom.querySelector('.btn.action.add-box').click();
                    main.switchPage('page-order', true);
                    document.querySelector('#app-bar-order').onclick(null, true);
                    setTimeout(() => {
                        window.scrollTo({
                            left: 0, 
                            top: itemDom.offsetTop - main.dom.headerWrapper.offsetHeight + 122,
                            behavior: 'instant',
                        });
                    }, 1);
                }
                

                product.querySelector('.vertical-product-tag-container');


            wrapper.querySelector('.special-products-container').appendChild(product);
        })
    },

    refreshCloneables: function(){
        main.dom.cloneable = {};
        [...document.querySelectorAll('[data-cloneable]')].forEach(cloneable => {
            let name = cloneable.dataset.cloneable;
            main.dom.cloneable[name] = cloneable;
            cloneable.removeAttribute('data-cloneable');
        });
    },

    switchPage: function (pageName, noScroll) {
        for (let currentPageName in main.dom.pages) {
            let page = main.dom.pages[currentPageName];
            if (currentPageName == pageName) {
                page.classList.remove('hidden');
                page.classList.add('swipe-from-left');
            }
            else {
                page.classList.add('hidden', 'swipe-from-left');
                page.classList.remove('swipe-from-left');
            }
            if(!noScroll) window.scrollTo({
                left: 0, 
                top: 0,
                behavior: 'instant',
            });
            
        }

        document.body.setAttribute('data-current-page', pageName);
        main.currentPage = pageName;

        if(pageName == 'page-home'){
            main.dom.headerWrapper.classList.add('no-box-shadow');
            // productManager.clearProductList();
            // main.refreshProducts();
        } else {
            main.dom.headerWrapper.classList.remove('no-box-shadow');
        }

        [...document.querySelectorAll('[data-page-dependant]')].forEach(element => {
            let dependantPageNames = element.dataset.pageDependant.split('|');
            for(let i = 0; i < dependantPageNames.length; i++){
                if(dependantPageNames[i] == pageName){
                    $(element).show();
                    break;
                } else {
                    $(element).hide();
                }
            }
        });
    },
    refreshPages: function () {
        main.dom.pages = {};
        // getting pages
        [...document.querySelectorAll('.page')].forEach(page => {
            main.dom.pages[page.getAttribute('id')] = page;
        });
    },
    createPageFromTemplate: function (template, o) {
        let cloneableTemplate = document.querySelector("#" + template);

        let page = cloneableTemplate.cloneNode(true);
        page.classList.remove('cloneable', 'page-template');
        page.classList.add('page');

        if (o) {
            page.querySelector('h1').innerHTML = o.title || '';
            page.querySelector('p').innerHTML = o.body || '';
            page.setAttribute('id', o.id || `page-${utils.generateRandomChars(20)}`);
            if (o.visible) {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }

            if (o.onback) {
                page.querySelector('.back-btn').onclick = o.onback;
            }
        }

        main.dom.pageContent.appendChild(page);
        // this.refreshPages();

        return page;
    },
    onScroll: function(){
        // scroll delta
        let scrollDelta;
        if(this.scrollYLast === undefined){
            this.scrollYLast = window.scrollY;
        } else {
            scrollDelta = window.scrollY - this.scrollYLast;
            this.scrollYLast = window.scrollY;
        }

        switch(main.currentPage){
            case 'page-order':
                // category selector update
                let activeCategory = null;
                let categories = $('.category:not(.hidden)');
                Array.from(categories).forEach((category, index) => {
                    let clientY = category.getBoundingClientRect().y - main.dom.headerWrapper.offsetHeight - 20;
                    if(clientY < 0)
                    activeCategory = category;
                });
                if(activeCategory){
                    let activeCategoryId = activeCategory.getAttribute('cat-id');
                    let selector = main.dom.headerWrapper.querySelector(`#cat-selector-${activeCategoryId}`);
                    selector.activate();
                }

                if(scrollDelta > 10){
                    main.dom.headerWrapper.style.top = '-72px';
                }
                if(scrollDelta < -10){
                    main.dom.headerWrapper.style.top = '0px';
                }
                break;
            default:
                main.dom.headerWrapper.style.top = '0px';
        }
    },
}

let initializers = {
    init: function(){
        this.home_page();
        this.order_page();
        this.user_page();
    },
    home_page: function(){
        $("#qi-order").click(() => {
            document.querySelector('#app-bar-order').click()
        });
        $("#qi-order-history").click(() => {
            document.querySelector('#app-bar-user').click()
        });
    },
    user_page: function(){
        document.querySelector('#change-username-btn').onclick = function(){
            main.openWelcomeScreen();
        }
    },
    order_page: function(){
        // search
        document.querySelector('.product-search-wrapper input').oninput = function(){
            productManager.uiSearch(this.value);
        }

        document.querySelector('.order-checkout-cancel').onclick = function(){
            productManager.trashOrdered();
        }
    }
}

let productManager = {
    createTag: function(icon, text, product, important){
        let tag = main.dom.cloneableTag.cloneNode(true);
        if(icon) tag.querySelector('.tag-icon').className = `tag-icon fa-solid ${icon}`;
        if(text) tag.querySelector('.tag-text').innerHTML = text;
        if(important) tag.classList.add('tag-important');
        tag.setAttribute('id', '');
        product.querySelector('.product-tags').appendChild(tag);
        return tag;
    },
    addCategory: function(o){
        let categoryId = utils.generateRandomChars();

        let category = main.dom.cloneableCategory.cloneNode(true);
            category.setAttribute('id', 'cat-' + categoryId);
            category.setAttribute('cat-id', categoryId);

        let title = category.querySelector('.category-title');

        let categorySelector = main.dom.cloneableCategorySelector.cloneNode(true);
            categorySelector.setAttribute('id', 'cat-selector-' + categoryId);
            categorySelector.setAttribute('cat-id', categoryId);
            categorySelector.onclick = () => {
                window.scrollTo(0, category.offsetTop - main.dom.headerWrapper.offsetHeight + 120);
                // categorySelector.activate();
                categorySelector.classList.add('target-selector');
            }
            categorySelector.activate = () => {
                let categorySelectors = main.dom.categorySelectorContainer.querySelectorAll('.toolbar-category-selector');
                    Array.from(categorySelectors).forEach(category => {
                        category.classList.remove('active-selector');
                    });
                categorySelector.classList.add('active-selector');
                categorySelector.classList.remove('target-selector');
                main.dom.categorySelectorContainer.scrollTo({left: categorySelector.offsetLeft - window.innerWidth / 2, behavior: 'smooth'});
            }

        if(o){
            if(o.title) {
                title.textContent = o.title;
                categorySelector.textContent = o.title;
            }
        }

        main.dom.categoryList.appendChild(category);
        main.dom.categorySelectorContainer.appendChild(categorySelector);

        return {container: category, toolbarSelector: categorySelector};
    },
    trashOrdered: function(){
        [...document.querySelectorAll('.product-card.ordered')].forEach(product => {
            productManager.changeOrderCount(product, -999999);
        });
    },
    addProduct: function(o){
        if(!o.category) return false;

        let product = main.dom.cloneableProduct.cloneNode(true);
            product.classList.remove('hidden');
            product.setAttribute('id', 'prod-' + utils.generateRandomChars());

        let addBoxButton = product.querySelector('.btn.action.add-box'),
            addSingleButton = product.querySelector('.btn.action.add-single'),
            quantitySelector = product.querySelector('.generic-quantity-selector'),
            orderCount = product.querySelector('.product-order-count'),
            title = product.querySelector('.product-title'),
            description = product.querySelector('.product-description'),
            price = product.querySelector('.product-price'),
            image = product.querySelector('.product-image');

        if(o){
            if(o.title) title.textContent = o.title;
            if(o.description) description.textContent = o.description; else $(description).hide();
            if(o.price) price.textContent = o.price;
            if(o.image) image.src = o.image;
            if(o.tags){
                if(o.tags.meter){
                    this.createTag('fa-ruler', `متراژ ${utils.persianNum(o.tags.meter)}`, product);
                }
                if(o.tags.amper){
                    this.createTag('fa-bolt', `${utils.persianNum(o.tags.amper)} آمپر`, product);
                }
                if(o.tags.watt){
                    this.createTag('fa-bolt', `${utils.persianNum(o.tags.watt)} وات`, product);
                }
                if(o.tags.box_amount){
                    this.createTag('fa-box', `${utils.persianNum(o.tags.box_amount)} عدد`, product);
                    product.setAttribute('data-box-quantity', o.tags.box_amount);
                }
                if(o.tags.custom){
                    this.createTag('fa-tag', `${o.tags.custom}`, product);
                }
            } else {
                $(product.querySelector(".product-tags")).hide();
            }
            if(o.id){
                product.setAttribute('data-product-id', o.id);
            }
        }

        product.setAttribute('data-price', price.textContent);

        if(o.price >= 0){
            price.innerHTML = utils.persianNum(price.textContent) + ' <small>تومان</small>';
        }
        else {
            price.innerHTML = `<span style="color: gray"> ناموجود </span>`;
            addBoxButton.disabled = true;
            addSingleButton.disabled = true;
        }

        addBoxButton.onclick = function(){
            product.setAttribute('data-order-type', 'box');
            productManager.changeOrderCount(product, 1);
        }
        addSingleButton.onclick = function(){
            product.setAttribute('data-order-type', 'single');
            productManager.changeOrderCount(product, 1);
        }
        quantitySelector.querySelector('.plus-btn').onclick = function(){
            productManager.changeOrderCount(product, 1);
        }
        quantitySelector.querySelector('.minus-btn').onclick = function(){
            productManager.changeOrderCount(product, -1);
        }
        this.changeOrderCount(product, -1);

        o.category.container.querySelector('.product-list').appendChild(product);
        o.category.container.classList.remove('hidden');
        o.category.toolbarSelector.classList.remove('hidden');

        return product;
    },
    addPlaceholderProduct: function(){
        let product = main.dom.cloneableProductPlaceholder.cloneNode(true);
            product.classList.remove('hidden');
            product.setAttribute('id', 'plchldr' + utils.generateRandomChars());
            main.dom.categoryList.appendChild(product);
    },
    changeOrderCount: function(product, changeNum){
        // return;
        // let orderCountElement = product.querySelector('.product-order-count');
        let orderType = product.getAttribute('data-order-type');
        let orderCountElement = product.querySelector('.generic-quantity-selector .middle-text');
        // let orderCount = parseInt(persianJs(orderCountElement.textContent).toEnglishNumber());
        let orderCount = parseInt(product.getAttribute('data-orders'));
        orderCount += changeNum;
        if(orderCount < 0) orderCount = 0;

        let orderInfoText = 'کارتن';
        if(orderType == 'single') orderInfoText = 'عدد';
        orderCountElement.textContent = `${persianJs(orderCount.toString()).englishNumber()} ${orderInfoText}`;

        if(orderCount){
            product.classList.add('ordered');
        } else {
            product.classList.remove('ordered');
        }

        product.setAttribute('data-orders', orderCount);

        this.handleCheckoutCard();
    },
    handleCheckoutCard: function(){
        let allOrders = main.dom.categoryList.getElementsByClassName('ordered');
        if(allOrders.length){ // has orders
            document.body.classList.add('has-order');
            $(main.dom.orderCheckoutCard).slideDown('fast');
            // if($(product).is(":last-child"))
            //     main.scrollByPercent(20);
            
            let fullCheckoutPrice = 0;
            Array.from(allOrders).forEach(product => {
                let price = parseInt(product.getAttribute('data-price'));
                let orderType = product.getAttribute('data-order-type');
                let orderCount = product.getAttribute('data-orders');
                let productCheckoutPrice;
                if(orderType == "box"){
                    let boxQuantity = product.getAttribute('data-box-quantity');
                    productCheckoutPrice = price * boxQuantity * orderCount;
                } else {
                    productCheckoutPrice = price * orderCount;
                }
                fullCheckoutPrice += productCheckoutPrice;
            });
            document.querySelector("#order-checkout-card > button").textContent = `ثبت سفارش (${utils.persianNum(fullCheckoutPrice)} تومان)`
        } else { // no orders
            document.body.classList.remove('has-order');
            $(main.dom.orderCheckoutCard).slideUp('fast');
        }
    },
    clearProductList: function(){
        main.dom.categoryList.innerHTML = '';
        main.dom.categorySelectorContainer.innerHTML = '';
    },
    onProductsLoaded: function(){
        if(document.querySelector('#featured-placeholder')){
            document.querySelector('#featured-placeholder').remove();
            main.createSpecialContainers();
        }
    },
    async loadProductList(path){
        let list, categories = [];

        productManager.clearProductList();

        for(let i = 0; i < 12; i++){
            productManager.addPlaceholderProduct();
        }

        await main.wait(utils.randomInt(100, 250));

        try {
            let response = await fetch(path);
            list = await response.json();
            productManager.list = list;
        } catch(e) {
            setTimeout(() => {
                main.dom.categoryList.innerHTML = document.querySelector('#load-error').outerHTML;
                main.dom.categoryList.querySelector('#retry-btn').onclick = function(){
                    main.refreshProducts();
                }
            }, 1000);
            return;
        }

        productManager.clearProductList();

        list.forEach(productDefinition => {
            if(!productDefinition.category) return false;

            let category = categories[productDefinition.category];

            if(!category){
                category = this.addCategory({title: productDefinition.category});
                categories[productDefinition.category] = category;
            }

            let product = this.addProduct({...productDefinition, category});
        });

        main.onScroll();

        this.onProductsLoaded();
    },
    checkout: function(){
        return new Promise((resolve, reject) => {
            let setId = utils.generateRandomChars(8);
            let allOrders = main.dom.categoryList.getElementsByClassName('ordered');
            Array.from(allOrders).forEach(order => {
                let name = order.querySelector('.product-title').textContent.trim();
                order.querySelectorAll('.tag-text').forEach(tag => {
                    name += " - " + tag.textContent;
                });
                let type = order.getAttribute('data-order-type');
                let quantity = order.getAttribute('data-orders');
                let productId = order.getAttribute('data-product-id');
                
                $.ajax({
                    url: 'https://api.omegarelectrice.com/order.php',
                    type: 'POST',
                    data: JSON.stringify({
                        user: main.username,
                        product: productId,
                        quantity,
                        type,
                        setId
                    }),
                    dataType: "json", 
                    success: function(response) {
                        console.log(response);
                        resolve({...response, setId});
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        // Handle the error response here
                        console.log("Error: " + textStatus + " - " + errorThrown);
                        console.log("Status: " + jqXHR.status + " - " + jqXHR.statusText);
                        console.log("Content: " + jqXHR.responseText);
                        reject();
                    },
                });
            });
        })
    },
    uiSearch: function(str){
        [...document.querySelectorAll('.category, .product-card, .category-title')].forEach(el => {
            el.classList.remove('search-hidden');
        });
        $('.search-not-found').hide();

        str = utils.convertNumFaToEn(str.trim());
        if(!str) return;

        [...document.querySelectorAll('.category-title')].forEach(el => {
            el.classList.add('search-hidden');
        })
        
        let hasMatch = false;

        let categories = document.querySelectorAll('.category');
        [...categories].forEach(category => {
            let hasItem = false;

            let products = category.querySelectorAll('.product-card');
            [...products].forEach(productDom => {
                // let product = productManager.getProductById(productDom.dataset.productId);
                // let fullName = product.title
                let name = productDom.querySelector('.product-title').textContent.trim();
                productDom.querySelectorAll('.tag-text').forEach(tag => {
                    name += " " + tag.textContent;
                });
                let result = search(str, name);
                if(result){
                    hasItem = true;
                    hasMatch = true;
                } else {
                    productDom.classList.add('search-hidden');
                }
            })

            if(!hasItem){
                category.classList.add('search-hidden');
            }
        })

        if(!hasMatch){
            $('.search-not-found').show();
        }

        function search(a, b){ // searching for a in b
            let aSplit = a.split(' '),
                bSplit = b.split(' ');
            
            for(let i = 0; i < aSplit.length; i++){
                let found = bSplit.indexOf(aSplit[i]) != -1;
                if(!found) return false;
            }

            return true;
        }
    },
    getProductById: function(id){
        for(let i = 0; i < this.list.length; i++){
            let product = this.list[i];
            if(product.id == id){
                return product;
            }
        }
        return false;
    },
    tagIdToText: function(id){
        switch(id){
            case "meter": return "متراژ";
            case "amper": return "آمپر";
            case "watt": return "وات";
            case "box_amount": return "تعداد در کارتن";
            case "custom": return "تگ";
            default: return '';
        }
    }
}

let utils = {
    randomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomCharacters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'.split(''),
    generateRandomChars: function(length, randomCharacters){
        if(!randomCharacters) randomCharacters = this.randomCharacters;
        if(!length) length = 20;
        let str = '';
        for(let i = 0; i < length; i++)
            str += randomCharacters[utils.randomInt(0, randomCharacters.length - 1)];
        return str;
    },
    persianNum: function(text){
        return persianJs(new Intl.NumberFormat('en-US', {style : "decimal" }).format(text)).englishNumber()
    },
    convertNumFaToEn: function(text){
        return text
            .replaceAll('1', '۱')
            .replaceAll('2', '۲')
            .replaceAll('3', '۳')
            .replaceAll('4', '۴')
            .replaceAll('5', '۵')
            .replaceAll('6', '۶')
            .replaceAll('7', '۷')
            .replaceAll('8', '۸')
            .replaceAll('9', '۹')
            .replaceAll('0', '۰');
    },
    convertNumEnToFa: function(text){
        return text
            .replaceAll('۱', '1')
            .replaceAll('۲', '2')
            .replaceAll('۳', '3')
            .replaceAll('۴', '4')
            .replaceAll('۵', '5')
            .replaceAll('۶', '6')
            .replaceAll('۷', '7')
            .replaceAll('۸', '8')
            .replaceAll('۹', '9')
            .replaceAll('۰', '0');
    },
    setCookie: function(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    },
}

main.init();
