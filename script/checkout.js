const quantity = JSON.parse(localStorage.getItem('quantityCart')) || 0;
let product = JSON.parse(localStorage.getItem('productAdded')) || [];
let productPurchase = JSON.parse(localStorage.getItem('productPurchase')) || [];

const cartQuantity = document.querySelector('.cartQuantity');
const itemQuantity = document.querySelector('.itemQuantity');
const mainContainer = document.querySelector('.orderMainContainer');

const allShippingCost = document.querySelector('.allShippingCost');
const allItemCost = document.querySelector('.allItemCost');
const totalTax = document.querySelector('.totalTax');
const estimatedTax = document.querySelector('.estimatedTax');
const totalItemCost = document.querySelector('.totalCost');
const noOrderContainer = document.querySelector('.noOrderContainer');
const orderButton = document.querySelector('.orderButton');
let totalProduct =  JSON.parse(localStorage.getItem('totalProduct')) || [];

orderButton.addEventListener('click', () =>{

  productPurchase.push(product);
  totalProduct.push(Number(totalItemCost.innerHTML.slice(1)));
  localStorage.setItem('totalProduct', JSON.stringify(totalProduct));
  localStorage.setItem('productPurchase', JSON.stringify(productPurchase));
  localStorage.removeItem('productAdded');


  if (!sessionStorage.getItem("reloaded")) {
    sessionStorage.setItem("reloaded", "true"); // Mark that we reloaded
    location.reload();
  }

});

// localStorage.removeItem('productAdded');
// localStorage.removeItem('totalProduct');
// localStorage.removeItem('productPurchase');

function checkChart() {
  let products = JSON.parse(localStorage.getItem('productAdded')) || [];

  if (products.length === 0) {
    noOrderContainer.style.display = "block";
    orderButton.disabled = true;
    orderButton.style.opacity = "0.7";
    orderButton.style.cursor = "default";

    // Check if reload has already happened
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true"); // Mark that we reloaded
      location.reload();
    }
  } 
  else {
    orderButton.disabled = false;
    noOrderContainer.style.display = "none";
    sessionStorage.removeItem("reloaded"); // Reset reload flag when cart has items
    renderCart();
  }
}




function recalculateTotals() {
  let totalCost = 0;
  let shippingCost = 0;
  let quantity = 0;
  product.forEach(item => {
    totalCost += item.price * item.quantity;
    quantity += Number(item.quantity);
  });

  localStorage.setItem('quantityCart', quantity);
  itemQuantity.innerHTML = quantity;
  cartQuantity.innerHTML = quantity;

  document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
    if (radio.value.includes('Wednesday')) {
      shippingCost += 4.99;
    } else if (radio.value.includes('Monday')) {
      shippingCost += 9.99;
    }
  });

  allItemCost.innerHTML = `$${totalCost.toFixed(2)}`;
  allShippingCost.innerHTML = `$${shippingCost.toFixed(2)}`;
  totalTax.innerHTML = `$${(totalCost + shippingCost).toFixed(2)}`;
  estimatedTax.innerHTML = `$${((totalCost + shippingCost) / 10).toFixed(2)}`;
  totalItemCost.innerHTML = `$${(totalCost + shippingCost + (totalCost + shippingCost) / 10).toFixed(2)}`;
}


function renderCart() {
  mainContainer.innerHTML = "";
  product.forEach((value, index) => {
    let newOrder = document.createElement("div");
    newOrder.classList.add("orderContainer");
    const uniqueName = `option-${index}`;

    newOrder.innerHTML = ` 
      <div class="headerOrderContainer">
        <p class="deliverDate">Delivery date: Tuesday, March 11</p>
      </div>
      <div class="orderDetails">
        <div class="imageContainer">
          <img src="${value.image}" class="productImage">
        </div>
        <div class="itemDetail">
          <p class="productName">${value.name}</p>
          <p>$${value.price}</p>
          <p>Quantity: 
            <span class="valueQuantity">${value.quantity}</span> 
            <input type="number" class="updateQuantityNumber" value="${value.quantity}" min="1">
            <span class="updateQuantity">Update</span> 
            <span class="deleteProduct">Delete</span>
          </p>
        </div>
        <div class="deliveryOption">
          <p>Choose a delivery option:</p>
          <div class="option1">
            <input type="radio" name="${uniqueName}" checked value="Delivery date: Tuesday, March 11">
            <div class="date">
              <p>Tuesday, March 11</p>
              <p>Free Shipping</p>
            </div>
          </div>
          <div class="option1">
            <input type="radio" name="${uniqueName}" value="Delivery date: Wednesday, March 5">
            <div class="date">
              <p>Wednesday, March 5</p>
              <p>$4.99 - Shipping</p>
            </div>
          </div>
          <div class="option1">
            <input type="radio" name="${uniqueName}" value="Delivery date: Monday, March 3">
            <div class="date">
              <p>Monday, March 3</p>
              <p>$9.99 - Shipping</p>
            </div>
          </div>
        </div>
      </div>`;

    mainContainer.appendChild(newOrder);

    const radios = newOrder.querySelectorAll(`input[name="${uniqueName}"]`);
    const deliverDate = newOrder.querySelector(".deliverDate");
    const updateQuantity = newOrder.querySelector(".updateQuantity");
    const updateQuantityNumber = newOrder.querySelector(".updateQuantityNumber");
    const valueQuantity = newOrder.querySelector(".valueQuantity");
    const deleteProduct = newOrder.querySelector(".deleteProduct");

    radios.forEach((radio) => {
      radio.addEventListener("change", function () {
        deliverDate.innerHTML = this.value;
        recalculateTotals();
      });
    });

    updateQuantity.addEventListener("click", () => {
      if (updateQuantity.classList.contains("clicked")) {
        updateQuantityNumber.style.display = "none";
        valueQuantity.style.display = "inline-block";
        updateQuantity.innerHTML = "Update";
        product[index].quantity = Number(updateQuantityNumber.value);
        localStorage.setItem("productAdded", JSON.stringify(product));
        valueQuantity.innerHTML = updateQuantityNumber.value;
        updateQuantity.classList.remove("clicked");
        recalculateTotals();
      } else {
        updateQuantity.innerHTML = "Save";
        valueQuantity.style.display = "none";
        updateQuantityNumber.style.display = "inline-block";
        updateQuantity.classList.add("clicked");
      }
    });

    deleteProduct.addEventListener("click", () => {
      product.splice(index, 1);
      localStorage.setItem("productAdded", JSON.stringify(product));
      checkChart();
      renderCart();
      recalculateTotals();
    });
  });

  recalculateTotals();
}

checkChart();