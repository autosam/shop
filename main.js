let main = {
    init: function(){
        productManager.init();
        $(productManager.dom.orderCheckoutCard).hide();

        this.test();
    },
    scrollByPercent: function (percent) {
        let totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        let viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        let pixelValue = (viewportHeight * percent) / 100;
        window.scrollTo(0, pixelValue + window.scrollY);
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
    dom: {
        headerWrapper: document.querySelector(".header-wrapper"),
        productList: document.querySelector(".product-list"),
        categorySelectorContainer: document.querySelector(".category-selector-container"),
        cloneableCategorySelector: document.querySelector("#cloneable-category-selector"),
        cloneableProduct: document.querySelector("#cloneable-product"),
        cloneableProductPlaceholder: document.querySelector("#cloneable-product-placeholder"),
        cloneableCategory: document.querySelector("#cloneable-category"),
        orderCheckoutCard: document.querySelector("#order-checkout-card"),
    },
    init: function(){
        addEventListener("scroll", (event) => {
            productManager.onScroll();
        });
    },
    onScroll: function(){
        let activeCategory = null;
        let categories = $('.category:not(.hidden)');
        Array.from(categories).forEach((category, index) => {
            let clientY = category.getBoundingClientRect().y - productManager.dom.headerWrapper.offsetHeight - 20;
            if(clientY < 0)
            activeCategory = category;
        });
        if(activeCategory){
            let activeCategoryId = activeCategory.getAttribute('cat-id');
            let selector = productManager.dom.headerWrapper.querySelector(`#cat-selector-${activeCategoryId}`);
            selector.activate();
        }
    },
    addCategory: function(o){
        let categoryId = utils.generateRandomChars();

        let category = this.dom.cloneableCategory.cloneNode(true);
            category.setAttribute('id', 'cat-' + categoryId);
            category.setAttribute('cat-id', categoryId);

        let title = category.querySelector('.category-title');

        let categorySelector = this.dom.cloneableCategorySelector.cloneNode(true);
            categorySelector.setAttribute('id', 'cat-selector-' + categoryId);
            categorySelector.setAttribute('cat-id', categoryId);
            categorySelector.onclick = () => {
                window.scrollTo(0, category.offsetTop - productManager.dom.headerWrapper.offsetHeight - 10);
                // categorySelector.activate();
                categorySelector.classList.add('target-selector');
            }
            categorySelector.activate = () => {
                let categorySelectors = productManager.dom.categorySelectorContainer.querySelectorAll('.toolbar-category-selector');
                    Array.from(categorySelectors).forEach(category => {
                        category.classList.remove('active-selector');
                    });
                categorySelector.classList.add('active-selector');
                categorySelector.classList.remove('target-selector');
                productManager.dom.categorySelectorContainer.scrollTo({left: categorySelector.offsetLeft - window.innerWidth / 2, behavior: 'smooth'});
            }

        if(o){
            if(o.title) {
                title.textContent = o.title;
                categorySelector.textContent = o.title;
            }
        }

        this.dom.productList.appendChild(category);
        this.dom.categorySelectorContainer.appendChild(categorySelector);

        return {container: category, toolbarSelector: categorySelector};
    },
    addProduct: function(o){
        if(!o.category) return false;

        let product = this.dom.cloneableProduct.cloneNode(true);
            product.classList.remove('hidden');
            product.setAttribute('id', 'prod-' + utils.generateRandomChars());

        let addButton = product.querySelector('.btn.product-action.add'),
            removeButton = product.querySelector('.btn.product-action.remove'),
            orderCount = product.querySelector('.product-order-count'),
            title = product.querySelector('.product-title'),
            description = product.querySelector('.product-description'),
            price = product.querySelector('.product-price'),
            image = product.querySelector('.product-image');

        if(o){
            if(o.title) title.textContent = o.title;
            if(o.description) description.textContent = o.description;
            if(o.price) price.textContent = o.price;
            if(o.image) image.src = o.image;
        }

        product.setAttribute('data-price', price.textContent);

        price.textContent = utils.persianNum(price.textContent) + ' تومان';

        addButton.onclick = () => {
            productManager.changeOrderCount(product, 1);
        }
        removeButton.onclick = () => {
            productManager.changeOrderCount(product, -1);
        }

        this.changeOrderCount(product, -1);

        o.category.container.appendChild(product);
        o.category.container.classList.remove('hidden');
        o.category.toolbarSelector.classList.remove('hidden');

        return product;
    },
    addPlaceholderProduct: function(){
        let product = this.dom.cloneableProductPlaceholder.cloneNode(true);
            product.classList.remove('hidden');
            product.setAttribute('id', 'plchldr' + utils.generateRandomChars());
            this.dom.productList.appendChild(product);
    },
    changeOrderCount: function(product, changeNum){
        let orderCountElement = product.querySelector('.product-order-count');
        let orderCount = parseInt(persianJs(orderCountElement.textContent).toEnglishNumber());
        orderCount += changeNum;
        if(orderCount < 0) orderCount = 0;
        orderCountElement.textContent = persianJs(orderCount.toString()).englishNumber();

        if(orderCount){
            product.classList.add('ordered');
        } else {
            product.classList.remove('ordered');
        }

        this.handleCheckoutCard();
    },
    handleCheckoutCard: function(){
        let allOrders = this.dom.productList.getElementsByClassName('ordered');
        if(allOrders.length){ // has orders
            this.dom.productList.classList.add('has-order');
            $(this.dom.orderCheckoutCard).slideDown('fast');
            // if($(product).is(":last-child"))
            //     main.scrollByPercent(20);
            
            let fullCheckoutPrice = 0;
            Array.from(allOrders).forEach(product => {
                let price = parseInt(product.getAttribute('data-price'));
                let orderCount = parseInt(persianJs(product.querySelector('.product-order-count').textContent).toEnglishNumber());
                let productCheckoutPrice = price * orderCount;
                product.setAttribute('data-debug', JSON.stringify({price, orderCount, productCheckoutPrice}));
                fullCheckoutPrice += productCheckoutPrice;
            });
            document.querySelector("#order-checkout-card > button").textContent = `ثبت سفارش (${utils.persianNum(fullCheckoutPrice)} تومان)`
        } else { // no orders
            this.dom.productList.classList.remove('has-order');
            $(this.dom.orderCheckoutCard).slideUp('fast');
        }
    },
    clearProductList: function(){
        this.dom.productList.innerHTML = '';
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
}

main.init();
