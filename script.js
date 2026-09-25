const products=[
{id:1,name:"Regal Chronograph",cat:"Men's Watches",price:2499,old:3499,rating:4.8,img:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=85",new:true},
{id:2,name:"Aurum Classic",cat:"Men's Premium Watches",price:3299,old:4499,rating:4.9,img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85"},
{id:3,name:"Urban Black Dial",cat:"Men's Casual Watches",price:1799,old:2499,rating:4.6,img:"https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=85"},
{id:4,name:"Executive Leather Wallet",cat:"Men's Wallets",price:999,old:1499,rating:4.7,img:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=85",new:true},
{id:5,name:"Luna Pearl Watch",cat:"Women's Watches",price:2899,old:3999,rating:4.9,img:"https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=85",new:true},
{id:6,name:"Élan Rose Gold",cat:"Women's Premium Watches",price:3599,old:4999,rating:4.8,img:"https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=85"},
{id:7,name:"Sienna Mini Wallet",cat:"Women's Wallets",price:1199,old:1699,rating:4.7,img:"https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=85",new:true},
{id:8,name:"Ivory Fashion Watch",cat:"Women's Fashion Watches",price:2199,old:2999,rating:4.6,img:"https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=85"},
{id:9,name:"Heritage Brown Wallet",cat:"Men's Wallets",price:1299,old:1799,rating:4.8,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85"},
{id:10,name:"Celeste Silver",cat:"Women's Watches",price:2699,old:3599,rating:4.7,img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"},
{id:11,name:"Noir Card Wallet",cat:"Men's Wallets",price:899,old:1299,rating:4.5,img:"https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=85"},
{id:12,name:"Blush Compact Wallet",cat:"Women's Wallets",price:1099,old:1599,rating:4.6,img:"https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=85"}
];

let cart=JSON.parse(localStorage.getItem("luxoraCart")||"[]");
let wish=JSON.parse(localStorage.getItem("luxoraWish")||"[]");

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function money(n){return "₹"+n.toLocaleString("en-IN")}
function stars(r){return "★".repeat(Math.round(r))+"☆".repeat(5-Math.round(r))}
function card(p){
 return `<article class="product">
   <div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="badge">${p.new?"NEW":"BEST SELLER"}</span><button class="wish ${wish.includes(p.id)?"active":""}" onclick="toggleWish(${p.id})">${wish.includes(p.id)?"♥":"♡"}</button></div>
   <div class="product-info"><div class="category">${p.cat}</div><div class="product-name">${p.name}</div><div class="stars">${stars(p.rating)} <small>${p.rating}</small></div><div class="price"><strong>${money(p.price)}</strong> <del>${money(p.old)}</del></div>
   <div class="product-actions"><button onclick="viewProduct(${p.id})">View</button><button onclick="addCart(${p.id})">Add to Cart</button><button onclick="buyNow(${p.id})">Buy Now</button></div></div>
 </article>`
}
function render(id,list){$(id).innerHTML=list.map(card).join("")||'<div class="empty">No products found.</div>'}
function renderHome(){render("#menGrid",products.filter(p=>p.cat.startsWith("Men")).slice(0,4));render("#womenGrid",products.filter(p=>p.cat.startsWith("Women's")).slice(0,4));render("#newGrid",products.filter(p=>p.new));applyFilters()}
function applyFilters(){
 let q=$("#filterSearch").value.toLowerCase(),c=$("#categoryFilter").value,price=$("#priceFilter").value,r=+$("#ratingFilter").value;
 let list=products.filter(p=>(!q||p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q))&&(c==="all"||p.cat===c)&&(price==="all"||p.price<=+price)&&p.rating>=r);
 render("#allGrid",list)
}
function persist(){localStorage.setItem("luxoraCart",JSON.stringify(cart));localStorage.setItem("luxoraWish",JSON.stringify(wish))}
function updateCounts(){$("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);$("#wishCount").textContent=wish.length}
function addCart(id){let x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});persist();updateCounts();toast("Added to cart");openDrawer("#cartDrawer");renderCart()}
function buyNow(id){addCart(id);checkout()}
function removeCart(id){cart=cart.filter(x=>x.id!==id);persist();updateCounts();renderCart()}
function changeQty(id,d){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<1)removeCart(id);else{persist();renderCart();updateCounts()}}
function renderCart(){if(!cart.length){$("#cartItems").innerHTML='<div class="empty">Your cart is empty.</div>';$("#cartTotal").textContent="₹0";return}$("#cartItems").innerHTML=cart.map(x=>{let p=products.find(a=>a.id===x.id);return `<div class="cart-item"><img src="${p.img}"><div><strong>${p.name}</strong><div>${money(p.price)}</div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button>${x.qty}<button onclick="changeQty(${p.id},1)">+</button><button onclick="removeCart(${p.id})">Remove</button></div></div></div>`}).join("");$("#cartTotal").textContent=money(cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0))}
function renderWish(){if(!wish.length){$("#wishItems").innerHTML='<div class="empty">Your wishlist is empty.</div>';return}$("#wishItems").innerHTML=wish.map(id=>{let p=products.find(a=>a.id===id);return `<div class="cart-item"><img src="${p.img}"><div><strong>${p.name}</strong><div>${money(p.price)}</div><button class="text-link" onclick="addCart(${p.id})">Add to cart</button></div></div>`}).join("")}
function toggleWish(id){wish.includes(id)?wish=wish.filter(x=>x!==id):wish.push(id);persist();updateCounts();renderHome();renderWish();toast(wish.includes(id)?"Added to wishlist":"Removed from wishlist")}
function viewProduct(id){let p=products.find(x=>x.id===id);$("#modalContent").innerHTML=`<div class="modal-product"><img src="${p.img}" alt="${p.name}"><div><p class="eyebrow">${p.cat}</p><h2>${p.name}</h2><div class="stars">${stars(p.rating)} ${p.rating}</div><h3>${money(p.price)} <del>${money(p.old)}</del></h3><p>Crafted for everyday elegance, this premium accessory combines refined design, dependable quality and timeless style.</p><ul><li>Premium finish</li><li>Gift-ready packaging</li><li>7-day easy returns</li></ul><button class="btn dark full" onclick="addCart(${p.id})">Add to Cart</button></div></div>`;$("#productModal").classList.add("open")}
function openDrawer(id){$(id).classList.add("open");$("#backdrop").classList.add("open")}
function closeAll(){$$(".drawer,.modal").forEach(x=>x.classList.remove("open"));$("#backdrop").classList.remove("open")}
function checkout(){if(!cart.length){toast("Your cart is empty");return}closeAll();$("#modalContent").innerHTML=`<div><p class="eyebrow">SECURE CHECKOUT</p><h2>Complete Your Order</h2><input placeholder="Full Name"><input placeholder="Email"><input placeholder="Phone"><input placeholder="Delivery Address"><select style="width:100%;padding:13px;border:1px solid #e6e2dc;margin:8px 0"><option>Cash on Delivery</option><option>UPI / Card (Demo)</option></select><button class="btn dark full" onclick="placeOrder()">Place Order</button></div>`;$("#productModal").classList.add("open")}
function placeOrder(){cart=[];persist();updateCounts();closeAll();toast("Order placed successfully! (Demo)")}
function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}

$("#cartBtn").onclick=()=>{renderCart();openDrawer("#cartDrawer")};$("#wishBtn").onclick=()=>{renderWish();openDrawer("#wishDrawer")};$("#loginBtn").onclick=()=>$("#loginModal").classList.add("open");
$("#searchBtn").onclick=()=>{$("#searchPanel").classList.toggle("open");$("#searchInput").focus()};
$("#searchInput").oninput=e=>{$("#filterSearch").value=e.target.value;document.querySelector("#products").scrollIntoView();applyFilters()};
$("#filterSearch").oninput=applyFilters;$("#categoryFilter").onchange=applyFilters;$("#priceFilter").onchange=applyFilters;$("#ratingFilter").onchange=applyFilters;
$("#checkoutBtn").onclick=checkout;$("#backdrop").onclick=closeAll;$$("[data-close]").forEach(b=>b.onclick=closeAll);
$("#menuBtn").onclick=()=>$("#navLinks").classList.toggle("open");
$$("[data-filter]").forEach(a=>a.onclick=()=>{setTimeout(()=>{$("#categoryFilter").value=a.dataset.filter;applyFilters()},50)});
$$("[data-category-link]").forEach(a=>a.onclick=()=>{setTimeout(()=>{$("#categoryFilter").value=a.dataset.categoryLink==="men"?"Men's Watches":"Women's Watches";applyFilters()},50)});
$("#newsletterForm").onsubmit=e=>{e.preventDefault();e.target.reset();toast("Thanks for subscribing!")};
$("#loginSubmit").onclick=()=>{closeAll();toast("Demo login successful")};
renderHome();updateCounts();renderCart();