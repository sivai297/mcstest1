
import { db } 
from "./firebase-config.js";


import {
collection,
getDocs,
query,
orderBy
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const productsContainer =
document.getElementById("productsContainer");



async function loadProducts(){


if(!productsContainer)
return;



productsContainer.innerHTML = "";


/*
const q = query(
collection(db,"products"),
orderBy("createdAt","desc")
);



const snapshot =
await getDocs(q); */
const snapshot = await getDocs(collection(db, "products"));



snapshot.forEach((doc)=>{


const product = doc.data();



productsContainer.innerHTML += `


<div class="product-card">


<img 
src="${product.image}"
alt="${product.name}">



<h3>
${product.name}
</h3>


<p>
Brand: ${product.brand}
</p>


<p>
Model: ${product.model}
</p>


<h4>
₹${product.price}
</h4>


<p>
Warranty: ${product.warranty}
</p>


<p>
${product.description}
</p>


<span>
${product.stock}
</span>


<a href="https://wa.me/918190081807">

<button>
WhatsApp Enquiry
</button>

</a>


</div>


`;



});


}



loadProducts();
