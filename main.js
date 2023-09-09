let main = {
    username: 'سامان محمدی',
    dom: {
        headerWrapper: document.querySelector(".header-wrapper"),
        categoryList: document.querySelector(".category-list"),
        categorySelectorContainer: document.querySelector(".category-selector-container"),
        cloneableCategorySelector: document.querySelector("#cloneable-category-selector"),
        cloneableProduct: document.querySelector("#cloneable-product"),
        cloneableProductPlaceholder: document.querySelector("#cloneable-product-placeholder"),
        cloneableCategory: document.querySelector("#cloneable-category"),
        cloneableTag: document.querySelector("#cloneable-tag"),
        orderCheckoutCard: document.querySelector("#order-checkout-card"),

        barsIcon: document.querySelector('.bars-icon'),
        hamburgerMenu: document.querySelector('.hamburger-menu'),
    },
    init: function(){
        productManager.init();
        $(main.dom.orderCheckoutCard).hide();

        // this.test();
        this.refreshProducts();

        document.querySelector('#order-checkout-card .btn').onclick = function(){
            productManager.checkout();
        }

        // hamburger menu
        this.handleHamburgerMenu();

        // appbar
        this.handleAppBar();
    },
    handleAppBar: function(){
        let items = Array.from(document.querySelectorAll('.app-bar-item'));
            items.forEach(item => {
                item.onclick = function(){
                    items.forEach(item => item.classList.remove('active'));
                    this.classList.add('active');
                }
            })
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
    refreshProducts: function(){
        setTimeout(() => {
            productManager.loadProductList('db/products.json');
        }, 0);
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
            setTimeout(() => productManager.onScroll());
            // productManager.onScroll();
        }, utils.randomInt(1, 500));
    },
}

let productManager = {
    init: function(){
        addEventListener("scroll", (event) => {
            productManager.onScroll();
        });
    },
    onScroll: function(){
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
    },
    createTag: function(icon, text, product, important){
        let tag = main.dom.cloneableTag.cloneNode(true);
        if(icon) tag.querySelector('.tag-icon').className = `tag-icon fa-solid ${icon}`;
        if(text) tag.querySelector('.tag-text').innerHTML = text;
        if(important) tag.classList.add('tag-important');
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
                window.scrollTo(0, category.offsetTop - main.dom.headerWrapper.offsetHeight - 10);
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
    addProduct: function(o){
        if(!o.category) return false;

        let product = main.dom.cloneableProduct.cloneNode(true);
            product.classList.remove('hidden');
            product.setAttribute('id', 'prod-' + utils.generateRandomChars());

        // let addButton = product.querySelector('.btn.product-action.add'),
        //     removeButton = product.querySelector('.btn.product-action.remove'),
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
            main.dom.categoryList.classList.add('has-order');
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
            main.dom.categoryList.classList.remove('has-order');
            $(main.dom.orderCheckoutCard).slideUp('fast');
        }
    },
    clearProductList: function(){
        main.dom.categoryList.innerHTML = '';
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
        } catch(e) {
            main.dom.categoryList.innerHTML = document.querySelector('#load-error').outerHTML;
            main.dom.categoryList.querySelector('#retry-btn').onclick = function(){
                main.refreshProducts();
            }
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

        productManager.onScroll();
    },
    checkout: function(){
        let allOrders = main.dom.categoryList.getElementsByClassName('ordered');
        Array.from(allOrders).forEach(order => {
            let name = order.querySelector('.product-title').textContent.trim();
            order.querySelectorAll('.tag-text').forEach(tag => {
                name += " - " + tag.textContent;
            });
            let type = order.getAttribute('data-order-type');
            let quantity = order.getAttribute('data-orders');
           
            $.ajax({
                url: 'https://omegarelectrice.com/v2/api/order.php',
                type: 'POST',
                data: JSON.stringify({
                    user: main.username,
                    product: name,
                    quantity,
                    type,
                }),
                dataType: "json", 
                success: function(response) {
                    console.log(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle the error response here
                    console.log("Error: " + textStatus + " - " + errorThrown);
                    console.log("Status: " + jqXHR.status + " - " + jqXHR.statusText);
                    console.log("Content: " + jqXHR.responseText);
                },
            });
        })
    },
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
}

main.init();
