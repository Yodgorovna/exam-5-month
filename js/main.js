const categories = document.querySelector(".categories");
const products = document.querySelector(".products");
const cart = document.querySelector(".cart");
const show = document.querySelector(".show");
const cart_modal_btn = document.getElementById("cart-button");
const span_cart = document.getElementsByClassName("close-cart")[0];
const span_show = document.getElementsByClassName("close-show")[0];
const cart_content = document.querySelector(".cart-content");
const show_content = document.querySelector(".show-content");
const cart_count = document.querySelector(".cart-count");

const getData = async () => {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getSingleData = async (id) => {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const saveState = async (key, data) => {
  const value = JSON.stringify(data);
  localStorage.setItem(key, value);
};

const getState = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

const count_cart = () => {
  const data = getState("product");
  cart_count.innerHTML = `${data.length}`;
};

count_cart();

const renderProducts = (key) => {
  fetch(`https://fakestoreapi.com/products/category/${key}`)
    .then((res) => res.json())
    .then((data) => {
      products.innerHTML = data
        .map(
          (item) => `
      <div class = 'card'>
        <img src = '${item.image}' class = "card-image"  alt = 'image'/>
        <div class="buttons">
          <button class="btn" id = "btn1" data-showid = "${item.id}"></button>
          <button class="btn" id = "btn2" data-id = "${item.id}"></button>
      </div>
      <h1 class = "card-title">${item.title}</h1>
      <div class = "stars">
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star checked"></span>
          <span class="fa fa-star"></span>
          <span class="fa fa-star"></span>
      </div>
      <div class = 'price'>
          <h4>$${item.price * 0.76}</h4>
          <h5>$${item.price}</h5>
          <h6 class = "percentage">24% Off</h6>
        </div>
      </div>
      `
        )
        .join("");
    });
};

products.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    fetch(`https://fakestoreapi.com/products/${id}`).then(res);
  }
});

const getCategories = () => {
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((data) => {
      categories.innerHTML = data
        .map(
          (item) => `
      <button data-name = "${item}">${item}</button>`
        )
        .join("");
      renderProducts(data[0]);
    });
};

getCategories();

categories.addEventListener("click", (e) => {
  const key = e.target.dataset.name;
  if (key) {
    renderProducts(key);
  }
});

//// MODAL ////

cart_modal_btn.onclick = function () {
  cart.style.display = "block";
};

span_cart.onclick = function () {
  cart.style.display = "none";
};

span_show.onclick = function () {
  show.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == cart) {
    cart.style.display = "none";
  }
};

/////////////////////////////////////////////
const renderLocalData = () => {
  const data = getState("product");
  cart_content.innerHTML = data
    .map(
      (item) => `
  <div class = "cart_block">
    <button class = "cart_button" data-deleteid = '${item.id}'>x</button>
    <div class = "img_block">
      <img src = "${item.image}" alt = "image"/>
    </div>
    <h1 class = "cart_title">${item.title}</h1>
    <h1 class = "price">${item.price}$</h1>
  </div>`
    )
    .join("");
};

products.addEventListener("click", async (e) => {
  if (e.target.dataset.id) {
    const data = await getSingleData(e.target.dataset.id);
    const oldData = getState("product");
    const el = oldData.find((item) => item.id == e.target.dataset.id);
    if (!el) {
      saveState("product", [...oldData, data]);
      renderLocalData();
      count_cart();
    }
  }
});
renderLocalData();

products.addEventListener("click", async (e) => {
  if (e.target.dataset.showid) {
    show.style.display = "block";
    const data = await getSingleData(e.target.dataset.showid);
    show_content.innerHTML = `
    <div> <img width = '200' src = "${data.image}" alt = "img"/>
    <h4>${data.title}</h4>
    <p>${data.category}</p>
    <p>${data.description}</p>
    <p>Price:    ${data.price}$</p>
    </div>`;
  }
});

cart.addEventListener("click", (e) => {
  if (e.target.dataset.deleteid) {
    const data = getState("product");

    for (let i = 0; i < data.length; i++) {
      if (e.target.dataset.deleteid == data[i].id) {
        data.splice(i, 1);
      }
    }
    saveState("product", data);
    count_cart();
  }

  renderLocalData();
});
