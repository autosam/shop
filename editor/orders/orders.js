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
        let processed = 'در حال بررسی';
        if(order.processed == 1) processed = 'تایید شده';
        else if(order.processed == -1) processed = 'رد شده';
        tbody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${order.timestamp}</td>
            <td>${order.user}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>${order.type == 'single' ? "تکی" : "جعبه ای"}</td>
            <td>${processed}</td>
            <td>-</td>
        </tr>
        `;
    });
    document.querySelector('.orders-container').setAttribute('data-loading', false);
}

function init(){
    let refreshBtn = document.querySelector('.btn.refresh');
    refreshBtn.onclick = function(){
        refreshOrders();
        this.querySelector('i').classList.add('fa-spin');
        setTimeout(() => this.querySelector('i').classList.remove('fa-spin'), 1000)
    };

    setInterval(() => {
        refreshBtn.click();
    }, 20000);

    refreshBtn.click();
}

init();