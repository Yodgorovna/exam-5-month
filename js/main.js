const categories = document.querySelector(".categories");
const products = document.querySelector(".products");

const renderProducts = (key) => {
  fetch(`https://fakestoreapi.com/products/category/${key}`)
    .then((res) => res.json())
    .then((data) => {
      products.innerHTML = data
        .map(
          (item) => `
      <div>
        <img  width = '300' src = '${item.image}' alt = 'image'/>
      </div>
      `
        )
        .join("");
    });
};

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
