function getOrders(){
    return new Promise((resolve, reject) => {
        fetch('https://omegarelectrice.com/v2/api/orderList.php')
        .then(response => response.json())
        .then(res => {
            resolve(res);
            // console.log(res);
        })
        .catch(e => {
            reject(e);
        })
    })
}

async function refreshOrders(){
    let tbody = document.querySelector('.orders-table tbody');
    document.querySelector('.orders-container').setAttribute('data-loading', true);
    let orders = await getOrders();
    tbody.innerHTML = '';
    orders.forEach((order, i) => {
        let name;
        let product = productsHelper.getProductById(order.product);
        if(product){
            name = `${product.title}`;
            
            for(let key in product.tags){
                name += ` <div class="tag">${productsHelper.tagIdToText(key)}: ${product.tags[key]}</div> `;
            }
        } else {
            name = order.product;
        }

        let processed = 'در حال بررسی';
        if(order.processed == 1) processed = 'تایید شده';
        else if(order.processed == -1) processed = 'رد شده';
        tbody.innerHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${order.timestamp}</td>
            <td>${order.user}</td>
            <td>${name}</td>
            <td>${order.quantity}</td>
            <td>${order.type == 'single' ? "تکی" : "جعبه ای"}</td>
            <td>${processed}</td>
            <td>-</td>
        </tr>
        `;
    });
    document.querySelector('.orders-container').setAttribute('data-loading', false);
}

async function init(){
    // productsList = await loadProducts();
    productsHelper.init();

    let refreshBtn = document.querySelector('.btn.refresh');
    refreshBtn.onclick = function(){
        refreshOrders();
        this.querySelector('i').classList.add('fa-spin');
        setTimeout(() => this.querySelector('i').classList.remove('fa-spin'), 1000)
    };

    setInterval(() => {
        // refreshBtn.click();
    }, 20000);

    refreshBtn.click();
}

let productsHelper = {
    list: null,
    initialied: false,
    async init(){
        await this.loadProducts();
        console.log(this.list);
        this.initialied = true;
    },
    loadProducts: function(){
        return new Promise((resolve, reject) => {
            fetch("https://autosam.github.io/db/products.json").then(response => response.json()).then(list => {
                resolve(list);
                productsHelper.list = list;
            });
        });
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
            case "custom": return "";
        }
    }
}

init();