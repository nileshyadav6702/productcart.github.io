const products = document.querySelector('.products')
const cartitems=document.querySelector('.order-summary')
const notfound=document.querySelector('.notfound')
const totalquantityspan=document.querySelector('.item-count')
const topayamount=document.querySelector('.amount')
let data=[]
let cart=[]
function gettingdata(){
    fetch('data.json').then(res => res.json())
    .then((list)=> {
        data=list
        showingdatatohtml()
    })
}
gettingdata()
const showingdatatohtml=()=>{
    if (JSON.parse(localStorage.getItem('cart'))){
        cart=JSON.parse(localStorage.getItem('cart'))
        addcarttohtml()
    }
    data.forEach((ite)=>{
        const item = document.createElement('div')
        item.classList.add('item')
        item.dataset.id=ite.product_id
        item.innerHTML = `<img src="${ite.image.desktop}" class="cake">
                    <div class="cart-button">
                        <img src="assets/images/icon-add-to-cart.svg" alt="">
                        <span class='add_cart'>Add to Cart</span>
                    </div>
                    <div class="details">
                        <p class="catorogray">${ite.category}</p>
                        <p class="name">${ite.name}</p>
                        <p class="prize">$${ite.price}</p>
                    </div>`
        products.append(item)

    })
}


products.addEventListener('click', (e) => {
    let pointer=e.target
    if (pointer.matches('.add_cart')){
        let product_id=pointer.parentElement.parentElement.dataset.id
        addcart(product_id)

    }
})

const addcart=(product_id)=>{
    let positionthisproduct=cart.findIndex((value)=>value.product_id==product_id)
    let positionindata=data[data.findIndex((value)=>value.product_id==product_id)]
    if (cart.length<=0){
        cart=[{
            product_id:product_id,
            quantity:1,
            name:positionindata.name,
            price:positionindata.price
            
        }]
    }
    else if (positionthisproduct<0){
        cart.push({
            product_id:product_id,
            quantity:1,
            name:positionindata.name,
            price:positionindata.price
        }
        )
    }
    else{
        cart[positionthisproduct].quantity++
    }
    addcarttohtml()
    addtomemmory()
    // console.log(cart);
    
}

const addtomemmory=()=>{
    localStorage.setItem('cart',JSON.stringify(cart))
}
const addcarttohtml=()=>{
    let totalquantity=0
    let totaltopay=0
    cartitems.innerHTML=''
    if (cart.length>0){
        notfound.style.display='none'
        cart.forEach((item)=>{
            const cake=document.createElement('div')
            cake.classList.add('order')
            cake.dataset.id=item.product_id
            cake.innerHTML=`<p>${item.name}</p>
                        <div class="details">
                            <span class="times">${item.quantity}x</span>
                            <span class="amount">@$${item.price}</span>
                            <span class="totalAmount">$${item.quantity*item.price}</span>
                        </div>
                        <div class="btn">
                            <span class='minus'>-</span>
                            <span class='total'>${item.quantity}</span>
                            <span class='plus'>+</span>
                        </div>
                        </div>
                        `
            totalquantity+=item.quantity
            totaltopay+=item.quantity*item.price
            cartitems.append(cake)
        })
        totalquantityspan.innerHTML=totalquantity
        topayamount.innerHTML=`$${totaltopay}`

    }
}


cartitems.addEventListener('click',(e)=>{
    let pointer=e.target
    if (pointer.matches('.plus') || pointer.matches('.minus')){
        const product_id=pointer.parentElement.parentElement.dataset.id
        type='minus'
        if (pointer.matches('.plus')){
            type='plus'
        }
        changequantity(product_id,type)
    }
})
const changequantity=(product_id,type)=>{
    let positionItemcart=cart.findIndex((value)=> value.product_id==product_id)
    if (positionItemcart>=0){
        switch(type){
            case('plus'):
                cart[positionItemcart].quantity++
                break
            
            default:
                let valuechange=cart[positionItemcart].quantity-1
                if (valuechange>0){
                    cart[positionItemcart].quantity=valuechange
                }
                else{
                    cart.splice(positionItemcart,1)
                }
                break;
        }

    }
    addtomemmory()
    addcarttohtml()

}
    




       