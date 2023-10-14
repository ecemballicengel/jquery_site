$(document).ready(function () {
  //login kismi
  $("#loginForm").submit(function (e) {
    //sayfayi yenilemek istemiyoruz cunku yenilersek API den cektigimiz urunler kayboluyor. preventDefault bize durdurucu etki sagliyor.
    e.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();
    fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.token) {
          //login basarili ise
          $("#loginModal").hide();
          $("#navbar").show();
          $("#footer").show();
          $("#content").show();
        } else {
          //basarisiz ise
          alert("Login failed!");
        }
      });
  });
  //API dekileri cagiriyoruz
  var categories = [];
  var products = [];
  var cart = [];
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => {
      products = json;
      var productsHTML = "";
      json.forEach((product) => {
        productsHTML += `
        <div class="bg-white p-6 rounded border">
        <img src="${product.image}" alt="${product.title}" class="mb-2 w-50 h-40"/>
        <h3 class="text-xl mb-2">${product.title}</h3>
        <p class="text-green-500 text-lg mb-4">${product.price} $</p>
        <p class="text-gray-700 mb-2">${product.description}</p>
        <input type="number" min="1" value="1" class="quantityInput mb-2 p-2 border rounded" data-id="${product.id}"/>
        <button class="addToCartBtn p-2 bg-blue-500 text-white rounded" data-id="${product.id}">Sepete Ekle</button>

        </div>
        `;
        //kategoryleri cekiyoruz
        if (!categories.includes(product.category)) {
          categories.push(product.category);
        }

        $("#productsListing").html(productsHTML);
      });

      var categoriesHTML = "";
      categories.map((category) => {
        categoriesHTML += `<li >
        <a       
          href="#"
          class="block px-4 py-2 hover:bg-blue-300 dark:hover:bg-gray-600 dark:hover:text-white categoryClass"          
          >${category}</a
        >
      </li>`;
        $("#categoryList").html(categoriesHTML);
      });
    });

  //Update Cart Badge(sepet iconun yaninda ki miktari guncelliyoruz)
  function updateCartBadge() {
    var totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $("#cartBadge").text(totalItems);
  }

  $(document).on("click", ".addToCartBtn", function () {
    var productId = $(this).data("id");
    var quantity = $(`.quantityInput[data-id="${productId}"]`).val();
    var productTitle = $(this).closest(".bg-white").find("h3").text();
    var productPrice = parseFloat(
      $(this).closest(".bg-white").find(".text-green-500").text()
    );

    var existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.quantity += parseInt(quantity);
    } else {
      cart.push({
        id: productId,
        title: productTitle,
        price: productPrice,
        quantity: parseInt(quantity),
      });
    }

    updateCartBadge();
  });
  function updateCartSidebar() {
    var cartHTML = "";
    var totalPrice = 0;
    cart.forEach((item) => {
      var itemTotalPrice = item.price * item.quantity;
      totalPrice += itemTotalPrice;
      cartHTML += `
      <div class="bg-white p-4 rounded border mb-4">
        <h3 class="text-xl mb-2">${item.title}</h3>
        <p class="text-gray-700 mb-2">Quantity: ${item.quantity}</p>
        <p class="text-green-500 text-lg mb-4">Total: ${itemTotalPrice}$</p>
      </div>
      `;
    });
    cartHTML += `<p class="text-xl">Total Price ${totalPrice} $</p>`;
    $("#cartSidebar").html(cartHTML);
  }
  //show/hide cart sidebar
  $("#cartBtn").click(function () {
    $("#cartSidebar").toggleClass("translate-x-full");
    updateCartSidebar();
  });

  //tikladigimiz da kategorilerine gore urunlerimiz listeleniyor
  $(document).on("click", ".categoryClass", function () {
    var innerText = $(this).text();
    var filteredProducts = products.filter((product) => {
      return product.category == innerText;
    });
    var productsHTML = "";
    filteredProducts.forEach((product) => {
      productsHTML += `
            <div class="bg-white p-4 rounded border">
            <img src="${product.image}" alt="${product.title}" class="mb-2 w-50 h-40"/>
            <h3 class="text-xl mb-2">${product.title}</h3>
            <p class="text-green-500 text-lg mb-4">${product.price} $</p>
            <p class="text-gray-700 mb-2">${product.description}</p>
            <input type="number" min="1" value="1" class="quantityInput mb-2 p-2 border rounded" data-id="${product.id}"/>
            <button class="addToCartBtn p-2 bg-blue-500 text-white rounded" data-id="${product.id}">Sepete Ekle</button>

            </div>
            `;
      $("#productsListing").html(productsHTML);
    });
  });
});
