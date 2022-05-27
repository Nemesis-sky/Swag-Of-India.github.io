//This is code to change flag and number according to option select
var selector = document.getElementById("selector");

selector.onchange = () => {
    var selectedValue = selector.value;
    if (selectedValue == "india") {
        document.getElementById("flag").setAttribute("src", "Images/India.png");
        document.getElementById("country-no").innerText = "+91 9838203708";
    } else if (selectedValue == "english") {
        document.getElementById("flag").setAttribute("src", "Images/Group 2560.png");
        document.getElementById("country-no").innerText = "+43 9838203708";
    } else {
        document.getElementById("flag").setAttribute("src", "Images/germany.png");
        document.getElementById("country-no").innerText = "+45 9838203708";
    }
}
//Button to go top and make navbar sticky
var goTop = document.getElementById("go-top");
var navBar = document.getElementById("header");
onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goTop.classList.add("change-btn");
        navBar.classList.add("change-header");


    } else {
        goTop.classList.remove("change-btn");
        navBar.classList.remove("change-header");

    }

}
// When the user clicks on the button, scroll to the top of the page
goTop.onclick = function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
// Hamburger js
$(".hamburger").click(function () {
    $(".top-right-list-container-2").toggle();
})

// getting product information from json file
let productListUrl = 'https://my-json-server.typicode.com/Nemesis-sky/Swag-Of-India/db';
var productList;
var htmlToChange;
let lowStars = "";
let reviews = "";
let i;
let j;
let isNew = false;
async function fetchData() {
    fetch(productListUrl)
        .then(response => response.json())
        .then(json => {
            productList = json;

            for (i = 0; i < productList.product.length; i++) {
                htmlToChange = '<div class="col-lg-4 col-md-6" id="product' + productList.product[i].id + '">' +
                    '<div class="card">' +
                    '<img src="Images/' + productList.product[i].imageName + '.png" alt="">';
                // this code is to show if product is new or not
                isNew = '<span class="new-tag">New</span>';
                if (productList.product[i].isNew == true) {
                    htmlToChange += isNew;
                }
                // *********
                htmlToChange +=
                    '<div class="card-body">' +
                    '<p class="card-text dark">' + productList.product[i].name + '</p>' +
                    '<p><span class="dark">' + productList.product[i].priceWithDiscount + ' &nbsp;</span><span class="strike-text">' + productList.product[i].price + '</span>' +
                    '<span class="orange">&nbsp;(' + (productList.product[i].price - productList.product[i].priceWithDiscount) / productList.product[i].price * 100 + ' Off)</span>' +
                    '</p>' +
                    '<div class="review-stars">';
                // this code is to show stars with ratings
                lowStars = 6 - productList.product[i].ratings;
                if (productList.product[i].ratings == 5) {
                    lowStars = 0;
                }
                for (j = 1; j <= productList.product[i].ratings; j++) {
                    reviews += '<i class="fas fa-star"></i>';
                }
                for (j = 1; j < lowStars; j++) {
                    reviews += '<i class="far fa-star"></i>';
                }
                lowStars = 0;

                htmlToChange += reviews + productList.product[i].ratings + '/5';
                reviews = "";
                // ***********

                htmlToChange += '</div>' +
                    '</div>' +
                    '<div class="hover-icon">' +
                    '<i class="fas fa-heart addToWishlist"></i>' +
                    '<i class="fas fa-eye"></i>' +
                    '<i class="fas fa-cart-plus addToCart"></i>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                if (document.querySelector("#viewArea")) {
                    document.querySelector("#viewArea").innerHTML += htmlToChange;

                }
                if (document.querySelector("#home-product"))
                    document.querySelector("#home-product").innerHTML += htmlToChange;


            }
            // when hover on product wishlist and add to cart icon will 
            // visible and opacity will reduce
            // added this code here because poduct listing also avai
            $(".hover-icon").hide();
            $('[id^=product]').on({
                mouseover: function () {
                    $(this).find(".hover-icon").show()
                },
                mouseout: function () {
                    $(this).find(".hover-icon").hide()
                }
            })
            displayCart();
            removerCartProduct();
            displayWihslist()
            removeFromWishlist();
            countProduct();
            countWishlist();
            // adding products to cart
            let cart = document.getElementsByClassName("card");
            // converting the classes of html collection to array
            let carts = Array.from(cart);
            for (let j = 0; j < carts.length; j++) {
                // Applying event listener to add to cart button
                let button = carts[j].lastChild.lastChild;
                button.addEventListener("click", function () {
                    traverseproduct(cart[j]);
                })

            }
            // calculating how much product in cart and increasing as per click on add to cart button

            function countProduct() {
                let productItems = localStorage.getItem("productIncart");
                if (productItems) {
                    productItems = JSON.parse(productItems);
                    if (document.getElementById("count-cart"))
                        document.getElementById("count-cart").innerHTML = Object.keys(productItems).length;
                    document.getElementById("cart-count").innerHTML = Object.keys(productItems).length;
                }
            }
            // Storing data to local storage with all the calculation
            function traverseproduct(getcart) {
                let productAdded = getcart.parentElement.id;
                for (i = 0; i < productList.product.length; i++) {
                    // this if statement checking if product clicked is the same in json file
                    // here product imagename consider as unique
                    if (productAdded == productList.product[i].imageName) {
                        let checkStorage = localStorage.getItem("productIncart")
                        let finalProduct = productList.product[i];
                        finalProduct.wishlist = false;
                        checkStorage = JSON.parse(checkStorage)
                        // adding product to local storage
                        if (checkStorage != null) {
                            checkStorage = {
                                ...checkStorage,
                                [finalProduct.name]: finalProduct
                            }
                            finalProduct.inCart += 1;
                        } else {
                            finalProduct.inCart = 1;
                            checkStorage = {
                                [finalProduct.name]: finalProduct
                            }
                        }
                        localStorage.setItem("productIncart", JSON.stringify(checkStorage));
                        totalCost(finalProduct);
                        displayCart();
                        storeCart();
                        countProduct();
                    }

                };

            }
            //    displaying totalcost in html element on page
            function storeCart() {
                let productItems = localStorage.getItem("cartnumber");
                if (productItems) {
                    if (document.getElementById("count-cart")) {
                        document.getElementById("count-cart").innerText = productItems;
                        if (document.getElementById("total-price"))
                            document.getElementById("total-price").innerHTML = "TOTAL : Rs " + localStorage.getItem("totalCost")
                        document.getElementById("total").innerHTML = " Rs " + localStorage.getItem("totalCost");
                        document.getElementById("total-2").innerHTML = " Rs " + localStorage.getItem("totalCost");
                    }
                }
            }
            storeCart();
            // calculating total cost of item
            function totalCost(cost) {

                checktotal = localStorage.getItem("totalCost");

                if (checktotal != null) {
                    checktotal = parseInt(checktotal);
                    localStorage.setItem("totalCost", checktotal +
                        cost.priceWithDiscount)
                } else
                    localStorage.setItem("totalCost", cost.priceWithDiscount)


            }
            // displying products on cart page 
            function displayCart() {
                let getItemsFromStorage = localStorage.getItem("productIncart");
                getItemsFromStorage = JSON.parse(getItemsFromStorage)
                let holdsClass = document.getElementById("holdsAll");
                if (getItemsFromStorage && holdsClass) {
                    Object.values(getItemsFromStorage).map(item => {
                        holdsClass.innerHTML += `<div class="row added-product" id="added-product">
                           <div class="col-lg-3 col-md-6">
                           <div class="product-pic">
                           <img src="Images/${item.imageName}.png" alt="">
                           </div>
                           </div>
                           <div class="col-lg-6 col-md-6">
                           <div class="pro-info">
                           <span class="card-text dark">${item.name}</span>
                           <span><button><select name="" id="">
                           <option>Size:Onesize</option>
                           <option>2</option>
                           </select>
                           </button>
                           <button>QTY:<select name="" id="">
                           <option value=""> ${item.inCart}</option>
                           <option value="">2</option>
                           <option value="">3</option>
                           <option value="">4</option>
                           </select>
                           </button>
                           </span>
                           </div>
                           </div>
                           <div class="col-lg-3 col-md-12">
                           <div class="pricing">
                           <span> ${item.priceWithDiscount}</span>
                           <span><span class="strike-text"> ${item.price}</span>&nbsp;<span class="orange">(60% Off)</span></span>
                           <span class="delivery-text">Delivery in 4-6 days</span>
                           </div>
                           </div>
                           <div class="remove">
                           <button class="remove-Button">Remove</button> | <button class="move-to-wishlist">Move To Wishlist</button>
                           </div>`

                        countProduct();
                    })
                }
            }
            // removing carts from local storage as well as from page and recalculating all the data
            function removerCartProduct() {
                if (document.getElementById("holdsAll")) {
                    var removeButton = document.getElementsByClassName("remove-Button");
                    for (k = 0; k < removeButton.length; k++) {
                        let remove = removeButton[k];
                        remove.onclick = () => {
                            let findProductName = remove.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[1].textContent;
                            let productInCart = localStorage.getItem("productIncart")
                            productInCart = JSON.parse(productInCart)
                            if (findProductName == productInCart[findProductName].name) {
                                productCostToDelete = productInCart[findProductName]
                                updateTotalCost(productCostToDelete);
                                delete productInCart[findProductName]
                                localStorage.setItem("productIncart", JSON.stringify(productInCart))
                                updatingPage(remove);
                                storeCart();
                                countProduct();
                            }

                            // recalculating total products no. in local storage

                            // removing product from page
                            function updatingPage(remove) {
                                remove.parentElement.parentElement.style.display = "none"

                            }
                        }
                    }
                    // recalculating totalcost after removing product
                    function updateTotalCost(product) {
                        let checktotalAgain = localStorage.getItem("totalCost");

                        if (checktotalAgain != null) {
                            checktotalAgain = parseInt(checktotalAgain);
                            localStorage.setItem("totalCost", checktotalAgain -
                                product.priceWithDiscount)
                        }

                    }
                    // cart to wishlist
                    let movingToWishlist = document.getElementsByClassName("move-to-wishlist");
                    for (let m = 0; m < movingToWishlist.length; m++) {
                        let buttonToWishlist = movingToWishlist[m];
                        buttonToWishlist.onclick = () => {
                            let againFindProduct = buttonToWishlist.parentElement.parentElement.childNodes[3].childNodes[1].childNodes[1].textContent;
                            let productCart = localStorage.getItem("productIncart")
                            let addingProduct = localStorage.getItem("productInWishlist")
                            productCart = JSON.parse(productCart);
                            addingProduct = JSON.parse(addingProduct);
                            if (againFindProduct == productCart[againFindProduct].name) {
                                productCart[againFindProduct].wishlist = true;
                                addingProduct = {
                                    ...addingProduct,
                                    [productCart[againFindProduct].name]: productCart[againFindProduct]
                                }
                                updateTotalCost(productCart[againFindProduct]);
                                delete productCart[againFindProduct];

                                localStorage.setItem("productIncart", JSON.stringify(productCart));
                                localStorage.setItem("productInWishlist", JSON.stringify(addingProduct));
                                countProduct();
                                buttonToWishlist.parentElement.parentElement.style.display = "none";
                                countWishlist();
                            }
                        }
                    }
                }
            }
            // The code from here is for wishlist products
            // applying event listener to wishlist(heart) button
            for (let q = 0; q < carts.length; q++) {
                var wishlistbutton = carts[q].lastChild.childNodes[0]
                wishlistbutton.addEventListener("click", function () {
                    addingProductToWishlist(cart[q]);

                })
            }

            function addingProductToWishlist(product) {
                wishlistToAdd = product.parentElement.id;
                for (m = 0; m < productList.product.length; m++) {
                    // this if statement checking if product clicked is the same in json/local storage file
                    // here product imagename consider as unique
                    if (wishlistToAdd == productList.product[m].imageName) {
                        let checkStorageagain = localStorage.getItem("productInWishlist");
                        productList.product[m].wishlist = true;
                        let addingwishlistProduct = productList.product[m];
                        checkStorageagain = JSON.parse(checkStorageagain)
                        if (checkStorageagain != null) {
                            checkStorageagain = {
                                ...checkStorageagain,
                                [productList.product[m].name]: addingwishlistProduct
                            }
                        } else {
                            checkStorageagain = {
                                [productList.product[m].name]: addingwishlistProduct
                            }
                        }
                        localStorage.setItem("productInWishlist", JSON.stringify(checkStorageagain));
                        countWishlist();
                    }
                }
            }

            function displayWihslist() {
                let getItemsFromStorageagain = localStorage.getItem("productInWishlist");
                getItemsFromStorageagain = JSON.parse(getItemsFromStorageagain)
                let parentClass = document.getElementById("wishlist-product-all-info");
                if (getItemsFromStorageagain && parentClass) {
                    Object.values(getItemsFromStorageagain).map(item => {
                        parentClass.innerHTML += `<div class="wishlist-product-container" >
                            <div class="wishlist-product row">
                                <div class="col-lg-4 wishlist-product-image">
                                    <img src="Images/${item.imageName}.png" alt="">
                                </div>
                                <div class="col">
                                    <div class="bold">${item.name}</div>
                                    <div><img src="Images/Group 2545.png" alt="">
                                        <span>(2850)</span>
                                    </div>
                                    <span class="bold">${item.priceWithDiscount} </span><span class="faint"><del>${item.price}
                                    </del></span><span class="orange bold"> (60% off)</span>
                                    <div>
                                        <select name="" id="" class="select-wishlist">
                                            <option value="" selected>Select Pack of</option>
                                        </select>
                                    </div>
                                    <div class="wishlist-carried-button">
                                        <button class="add-to-cart">Add To cart</button> |
                                        <button class="remove-wishlist">Remove from wishlist</button>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    })
                    countWishlist();
                }
            }

            function countWishlist() {
                let countWishlist = localStorage.getItem("productInWishlist");
                countWishlist = JSON.parse(countWishlist);
                if (countWishlist) {
                    if (document.getElementById("count-wishlist-product"))
                        document.getElementById("count-wishlist-product").innerHTML = Object.keys(countWishlist).length;
                    document.getElementById("wishlist-count").innerHTML = Object.keys(countWishlist).length;
                }
            }

            function removeFromWishlist() {
                if (document.getElementById("wishlist-product-all-info")) {
                    let wishlistRemove = document.getElementsByClassName("remove-wishlist");
                    for (i = 0; i < wishlistRemove.length; i++) {
                        let removeFromWishlistButton = wishlistRemove[i];
                        removeFromWishlistButton.onclick = () => {
                            let findwishlistproduct = removeFromWishlistButton.parentElement.parentElement.childNodes[1].textContent;
                            let productInWishlist = JSON.parse(localStorage.getItem("productInWishlist"));
                            if (findwishlistproduct == productInWishlist[findwishlistproduct].name) {
                                delete productInWishlist[findwishlistproduct]
                                localStorage.setItem("productInWishlist", JSON.stringify(productInWishlist))
                                // removing product from page
                                removeFromWishlistButton.parentElement.parentElement.parentElement.parentElement.style.display = "none";
                                countWishlist();
                                countProduct();
                            }
                        }
                    }
                }
            }
            //switching product between wishlist to cart
            let wishlistToCart = document.getElementsByClassName("add-to-cart");
            for (let w = 0; w < wishlistToCart.length; w++) {
                let buttonToCart = wishlistToCart[w];
                buttonToCart.onclick = () => {
                    let FindProduct = buttonToCart.parentElement.parentElement.childNodes[1].textContent;
                    let productwishlist = localStorage.getItem("productInWishlist")
                    let addingProduct = localStorage.getItem("productIncart")
                    productwishlist = JSON.parse(productwishlist);
                    addingProduct = JSON.parse(addingProduct);
                    if (FindProduct == productwishlist[FindProduct].name) {
                        productwishlist[FindProduct].wishlist = false;
                        addingProduct = {
                            ...addingProduct,
                            [productwishlist[FindProduct].name]: productwishlist[FindProduct]
                        }

                        delete productwishlist[FindProduct];

                        localStorage.setItem("productInWishlist", JSON.stringify(productwishlist));
                        localStorage.setItem("productIncart", JSON.stringify(addingProduct));
                        countWishlist();
                        countProduct();
                        buttonToCart.parentElement.parentElement.parentElement.parentElement.style.display = "none";
                    }
                }
            }
        })

}
fetchData();