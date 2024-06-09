const items = [
  {
    id: 1,
    title: "Филадельфия хит ролл",
    price: 300,
    weight: 180,
    itemsInBox: 6,
    img: "california-hit.jpg",
    counter: 1,
  },
  {
    id: 2,
    title: "Калифорния темпура",
    price: 250,
    weight: 205,
    itemsInBox: 6,
    img: "california-tempura.jpg",
    counter: 1,
  },
  {
    id: 3,
    title: "Запеченый ролл «Калифорния»",
    price: 230,
    weight: 182,
    itemsInBox: 6,
    img: "zapech-california.jpg",
    counter: 1,
  },
  {
    id: 4,
    title: "Филадельфия",
    price: 320,
    weight: 230,
    itemsInBox: 6,
    img: "philadelphia.jpg",
    counter: 1,
  },
];

const state = {
  items: items,
  cart: [],
};

const productsContainer = document.querySelector("#productsMainContainer");

const renderItem = function (item) {
  const markup = `
    <div class="col-md-6">
      <div class="card mb-4" data-productid=${item.id}>
        <img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
        <div class="card-body text-center">
          <h4 class="item-title">${item.title}</h5>
          <p><small class="text-muted">${item.itemsInBox} шт.</small></p>
    
          <div class="details-wrapper">
            <div class="items">
              <div class="items__control" data-click="minus">-</div>
              <div class="items__current" data-count>${item.counter}</div>
              <div class="items__control" data-click="plus">+</div>
            </div>
    
            <div class="price">
              <div class="price__weight">${item.weight}г.</div>
              <div class="price__currency">${item.price} ₽</div>
            </div>
          </div>
    
          <button type="button" class="btn btn-block btn-outline-warning" id="addButton">+ в корзину</button>
          
        </div>
      </div>
    </div>
  `;

  productsContainer.insertAdjacentHTML("beforeend", markup);
};

items.forEach(renderItem);

const itemUpdateCounter = function (id, type) {
  const itemIndex = state.items.findIndex(function (element) {
    if (element.id == id) {
      return true;
    }
  });

  let count = state.items[itemIndex].counter;

  if (type == "minus") {
    if (count - 1 > 0) {
      count--;
      state.items[itemIndex].counter = count;
    }
  }

  if (type == "plus") {
    count++;
    state.items[itemIndex].counter = count;
  }
};

const itemUpdateViewCounter = function (id) {
  const itemIndex = state.items.findIndex(function (element) {
    if (element.id == id) {
      return true;
    }
  });

  const countToShow = state.items[itemIndex].counter;
  const currentProduct = productsContainer.querySelector(
    '[data-productid="' + id + '"'
  );
  const counter = currentProduct.querySelector("[data-count]");

  counter.innerText = countToShow;
};

productsContainer.addEventListener("click", function (e) {
  const id = e.target.closest("[data-productid]").dataset.productid;

  if (e.target.matches('[data-click="minus"]')) {
    itemUpdateCounter(id, "minus");
    itemUpdateViewCounter(id);
  } else if (e.target.matches('[data-click="plus"]')) {
    itemUpdateCounter(id, "plus");
    itemUpdateViewCounter(id);
  }
});
