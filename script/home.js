import { products } from "./products.js";



const orderGrid = document.querySelector('.orderGrid');
const hambugerButton = document.querySelector('.hambugerSection');

let productAdded = JSON.parse(localStorage.getItem('productAdded'));
if(!productAdded){
  productAdded = [];
}

export let totalQuantity = 0;

productAdded.forEach(value =>{
  totalQuantity = Number(totalQuantity + value['quantity']);
});

const cartQuantity = document.querySelector('.cartQuantity');
const mobileCartQuantity = document.querySelector('.mobileCartQuantity');
cartQuantity.innerHTML = totalQuantity;
mobileCartQuantity.innerHTML = totalQuantity;


hambugerButton.addEventListener('click', ()=>{

  if(hambugerButton.classList.contains('clicked')){
    document.querySelector('.mobileViewContainer').style.display = "none";
    hambugerButton.classList.remove('clicked');
  }
  else{
    document.querySelector('.mobileViewContainer').style.display = "block";
    hambugerButton.classList.add('clicked');
  }

});



products.forEach(value =>{

  let newProductOrder = document.createElement('div');
  newProductOrder.classList.add('orderContainer');
  newProductOrder.id = `${value['id']}`;
  newProductOrder.innerHTML = ` 
        <div class="imageProductContainer">
          <img src="${value['image']}" class="productImage">
        </div>
        <div class="nameContainer">
          <p>${value['name']}</p>
        </div>
        <div class="ratingContainer">

          <img src="./images/ratings/rating-${(Number(value['rating']['stars']) * 10)}.png" class="ratingImage">
          <p class="ratingCount"> ${value['rating']['count']}</p>
        </div>
        <div class="priceContainer">
          <p class="productPrice">$${(Number(value['priceCents']) /100).toFixed(2)} </p>
        </div>
        <div class="quantityContainer">
          <select class="quantitySelector">
            <option  value="1"> 1 </option>
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
            <option value="5"> 5 </option>
            <option value="6"> 6 </option>
            <option value="7"> 7 </option>
            <option value="8"> 8 </option>
            <option value="9"> 9 </option>
            <option value="10"> 10 </option>
          </select>

        </div>
        <div class="addedContainer">
          <img src="./images/icons/checkmark.png" class="checkIcon">
          <p>Added</p>
        </div>
        <div class="buttonContainer">
          <button class="addButton"> Add to Cart</button>
        </div>
  `;
  orderGrid.appendChild(newProductOrder);
  let addButton = newProductOrder.querySelector('.addButton');
  addButton.addEventListener('click', ()=>{

    let quantity = newProductOrder.querySelector('.quantitySelector').value;
    let cost = (Number(value['priceCents']) /100);
    let newProduct = {
      name: value['name'],
      image: value['image'],
      quantity: Number(quantity),
      price: cost,
      total: Number(Number(cost * quantity).toFixed(2))
    };

    let exists = false;

    for (let i = 0; i < productAdded.length; i++) {
      if (productAdded[i].name === newProduct.name) {
        productAdded[i]['quantity'] = Number(Number(productAdded[i]['quantity'] ) + Number(newProduct['quantity']));
        productAdded[i]['total'] = Number(productAdded[i]['quantity'] * newProduct['price'] ).toFixed(2);
        exists = true;
        break;
      }
    }
  
    if (!exists) {
      productAdded.push(newProduct);
    }

    totalQuantity = Number(totalQuantity + Number(quantity));
    cartQuantity.innerHTML = totalQuantity;
    mobileCartQuantity.innerHTML = totalQuantity;
    localStorage.setItem('quantityCart', totalQuantity);
    localStorage.setItem('productAdded', JSON.stringify(productAdded));
    
    
    setTimeout(() => {
      newProductOrder.querySelector('.addedContainer').style.visibility = "visible";
    }, 0);
    setTimeout(() => {
      newProductOrder.querySelector('.addedContainer').style.visibility = "hidden";
    }, 2000);

    
  });


});




window.addEventListener('resize', ()=>{
  if(window.innerWidth >= 575){
    document.querySelector('.mobileViewContainer').style.display = "none";
    hambugerButton.classList.remove('clicked');  
  }


});