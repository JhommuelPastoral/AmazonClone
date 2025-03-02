import { products } from "./products.js";


let productPurchase = JSON.parse(localStorage.getItem('productPurchase')) || [];
let totalProduct =  JSON.parse(localStorage.getItem('totalProduct')) || [];
const orderMainContainer = document.querySelector('.orderMainContainer');

const mobileCartQuantity = document.querySelector('.mobileCartQuantity');
const cartQuantity = document.querySelector('.cartQuantity');
let productAdded = JSON.parse(localStorage.getItem('productAdded')) || [];

productPurchase.forEach((value,index) =>{
  let newOrderGrid = document.createElement('div');
  newOrderGrid.classList.add('orderGrid');

  let newOrderHeader = document.createElement('div');
  newOrderHeader.classList.add('orderContainerHeader');
  newOrderHeader.innerHTML = `            
              <div class="headerLeftSection">
                <p>Order Placed:</p>
                <p>March 1</p>
              </div>
              <div class="headerMiddleSection">
                <p>Total:</p>
                <p>$ ${totalProduct[index]}</p>
              </div>
              <div class="headerRightSection">
                <p>Order ID:</p>
                <p>12a87e22-a2a6-4977-f049-f9d0effb910e</p>
              </div>`;
  newOrderGrid.appendChild(newOrderHeader);
  value.forEach(data =>{
    let orderContainer = document.createElement('div');
    orderContainer.classList.add('orderContainer');
    orderContainer.innerHTML = `
            <div class="orderDetails">
              <div class="imageContainer">
                <img src="${data['image']}" class="productImage">
              </div>
              <div class="productDetailsContainer">
                <p class="productName">${data['name']}</p>
                <p>Delivered on: February 26</p>
                <p>Quantity: ${data['quantity']}</p>
                <button class="buyAgainButton"> 
                  <div class="buyAgainContainer">
                    <img src="./images/icons/buy-again.png" class="buyAgainIcon"> Buy it again
                  </div>
                  <div class="addedContainer"> 
                      <p>&check; Added</p>
                  </div>
                  </button>
              </div>
              <div class="trackContainer">
                <button class="trackButton"> Track package </button>
              </div>
            </div>  
    `;
    newOrderGrid.appendChild(orderContainer);
    const buyAgainButton = orderContainer.querySelector('.buyAgainButton');
    
    buyAgainButton.addEventListener('click', ()=>{

      setTimeout(() => {
        orderContainer.querySelector('.buyAgainContainer').style.display = "none";
        orderContainer.querySelector('.addedContainer').style.display = "flex";

      }, 0);

      setTimeout(() => {
        orderContainer.querySelector('.buyAgainContainer').style.display = "flex";
        orderContainer.querySelector('.addedContainer').style.display = "none";
      }, 2000);

      let productName = orderContainer.querySelector('.productName').innerHTML;
      products.forEach(value =>{
        if(value['name'] === String(productName)){
          let cost = (Number(value['priceCents']) /100);
          let exists = false;

          let newProduct ={
            name: value['name'],
            image: value['image'],
            quantity: Number(1),
            price: Number(cost),
          }


          for (let i = 0; i < productAdded.length; i++) {
            if (productAdded[i].name === newProduct.name) {
              productAdded[i]['quantity'] = Number(Number(productAdded[i]['quantity'] ) + Number(newProduct['quantity']));
              exists = true;
              break;
            }
          }
        
          if (!exists) {
            productAdded.push(newProduct);

          }
          localStorage.setItem('productAdded', JSON.stringify(productAdded));

          renderValueCart();
          return;
        }
      });
    });

  }); 
 
  orderMainContainer.appendChild(newOrderGrid);


});

function renderValueCart(){
  let product = JSON.parse(localStorage.getItem('productAdded')) || [];
  let quantity =0;
  product.forEach(value=>{
    quantity += value['quantity']
  });
  mobileCartQuantity.innerHTML = quantity;
  cartQuantity.innerHTML = quantity;
}

renderValueCart();



