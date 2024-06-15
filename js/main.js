const itemsURL =
  "https://webdev-alexey.github.io/project_roll-delivery/json/db.json";
const productsContainer = document.querySelector("#productsMainContainer");
const cartItemsContainer = document.querySelector("#cartItemsHolder");
const cartEmptyNotification = document.querySelector("#cartEmpty");
const cartTotal = document.querySelector("#cartTotal");
const makeOrder = document.querySelector("#makeOrder");
const cart = document.querySelector("#cart");
const cartTotalPrice = document.querySelector("#cartTotalPrice");
const deliveryPriceContainer = document.querySelector(
  "#deliveryPriceContainer"
);
const deliveryMinimalFree = 600;

function getItems(url) {
  return fetch(url).then((answer) => answer.json());
}

function getItemsFromCart() {
  const localItems = JSON.parse(localStorage.getItem("cart"));
  if (localItems) {
    return localItems;
  } else {
    return [];
  }
}

main();

async function main() {
  const items = await getItems(itemsURL);
  const constItemsFromCart = await getItemsFromCart();

  const state = {
    items: items,
    cart: constItemsFromCart,
  };

  window.state = state;

  if (state.cart.length > 0) {
    state.cart.forEach(renderItemInCart);
    checkCart();
    calculateTotalPrice();
  }

  state.items.forEach(renderItem);

  function renderItem(item) {
    const markup = `
			<div class="col-md-6">
				<div class="card mb-4" data-productid="${item.id}">
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

						<button data-click="addToCart" type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>
						
					</div>
				</div>
			</div>`;

    productsContainer.insertAdjacentHTML("beforeend", markup);
  }

  function renderItemInCart(item) {
    const markup = `
			<div class="cart-item" data-productid="${item.id}">
				<div class="cart-item__top">
					<div class="cart-item__img">
						<img src="img/roll/${item.img}" alt="${item.title}">
					</div>
					<div class="cart-item__desc">
						<div class="cart-item__title">${item.title}</div>
						<div class="cart-item__weight">${item.itemsInBox} шт. / ${item.weight}г.</div>
						<div class="cart-item__details">
							<div class="items items--small">
								<div class="items__control" data-click="minus">-</div>
								<div class="items__current" data-count>${item.items}</div>
								<div class="items__control" data-click="plus">+</div>
							</div>
							<div class="price">
								<div class="price__currency">${item.price} ₽</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;

    cartItemsContainer.insertAdjacentHTML("beforeend", markup);
  }

  function itemUpdateCounter(id, type) {
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
  }

  function itemUpdateCounterInCart(id, type) {
    const itemIndex = state.cart.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });
    let count = state.cart[itemIndex].items;

    if (type == "minus") {
      if (count - 1 > 0) {
        count--;
        state.cart[itemIndex].items = count;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      } else if (count - 1 == 0) {
        state.cart.splice(itemIndex, 1);
        cartItemsContainer.innerHTML = "";
        state.cart.forEach(renderItemInCart);
        localStorage.setItem("cart", JSON.stringify(state.cart));
        checkCart();
      }
    }

    if (type == "plus") {
      count++;
      state.cart[itemIndex].items = count;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    }

    calculateTotalPrice();
  }

  function itemUpdateViewCounter(id) {
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
  }

  function itemUpdateViewCounterInCart(id) {
    const itemIndex = state.cart.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    if (itemIndex != -1) {
      const countToShow = state.cart[itemIndex].items;
      const currentProduct = cart.querySelector('[data-productid="' + id + '"');
      const counter = currentProduct.querySelector("[data-count]");
      counter.innerText = countToShow;
    }
  }

  function checkCart() {
    if (state.cart.length > 0) {
      cartEmptyNotification.style.display = "none";
      cartTotal.style.display = "block";
      makeOrder.style.display = "block";
    } else {
      cartEmptyNotification.style.display = "block";
      cartTotal.style.display = "none";
      makeOrder.style.display = "none";
    }
  }

  function addToCart(id) {
    const itemIndex = state.items.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });

    const itemIndexInCart = state.cart.findIndex(function (element) {
      if (element.id == id) {
        return true;
      }
    });
    if (itemIndexInCart == -1) {
      const newItem = {
        id: state.items[itemIndex].id,
        title: state.items[itemIndex].title,
        price: state.items[itemIndex].price,
        weight: state.items[itemIndex].weight,
        itemsInBox: state.items[itemIndex].itemsInBox,
        img: state.items[itemIndex].img,
        items: state.items[itemIndex].counter,
      };

      state.cart.push(newItem);
    } else {
      state.cart[itemIndexInCart].items += state.items[itemIndex].counter;
    }

    localStorage.setItem("cart", JSON.stringify(state.cart));

    state.items[itemIndex].counter = 1;
    itemUpdateViewCounter(id);

    cartItemsContainer.innerHTML = "";
    state.cart.forEach(renderItemInCart);
    checkCart();
    calculateTotalPrice();
  }

  function calculateDelivery() {
    if (state.totalPrice >= deliveryMinimalFree) {
      deliveryPriceContainer.innerText = "бесплатно";
      deliveryPriceContainer.classList.add("free");
    } else {
      deliveryPriceContainer.innerText = 300;
      deliveryPriceContainer.classList.remove("free");
    }
  }

  function calculateTotalPrice() {
    let totalPrice = 0;

    state.cart.forEach(function (element) {
      const thisPrice = element.items * element.price;
      totalPrice += thisPrice;
    });

    state.totalPrice = totalPrice;
    cartTotalPrice.innerText = new Intl.NumberFormat("ru-RU").format(
      totalPrice
    );
    calculateDelivery();
  }

  productsContainer.addEventListener("click", function (e) {
    if (e.target.matches('[data-click="minus"]')) {
      const id = e.target.closest("[data-productid]").dataset.productid;
      itemUpdateCounter(id, "minus");
      itemUpdateViewCounter(id);
    } else if (e.target.matches('[data-click="plus"]')) {
      const id = e.target.closest("[data-productid]").dataset.productid;
      itemUpdateCounter(id, "plus");
      itemUpdateViewCounter(id);
    } else if (e.target.matches('[data-click="addToCart"]')) {
      const id = e.target.closest("[data-productid]").dataset.productid;
      addToCart(id);
    }
  });

  cart.addEventListener("click", function (e) {
    if (e.target.matches('[data-click="minus"]')) {
      const id = e.target.closest("[data-productid]").dataset.productid;
      itemUpdateCounterInCart(id, "minus");
      itemUpdateViewCounterInCart(id);
    } else if (e.target.matches('[data-click="plus"]')) {
      const id = e.target.closest("[data-productid]").dataset.productid;
      itemUpdateCounterInCart(id, "plus");
      itemUpdateViewCounterInCart(id);
    }
  });
}
