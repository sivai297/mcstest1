
/* ==========================================
   MCS Reviews Module
========================================== */

const reviewContainer =
document.querySelector(".review-grid");

const reviews = [

{
name:"Ramesh Kumar",
rating:5,
message:"Excellent PCB repair service. Highly recommended.",
image:"assets/users/user1.png"
},

{
name:"Arun Prakash",
rating:5,
message:"Fast delivery and genuine warranty support.",
image:"assets/users/user2.png"
},

{
name:"Selvam",
rating:4,
message:"Good customer support and quality products.",
image:"assets/users/user3.png"
}

];

/* ==========================================
Load Reviews
========================================== */

function loadReviews(){

if(!reviewContainer) return;

reviewContainer.innerHTML="";

reviews.forEach(review=>{

let stars="";

for(let i=0;i<review.rating;i++){

stars+="тн?";

}

reviewContainer.innerHTML+=`

<div class="review-card">

<img src="${review.image}" alt="${review.name}">

<h3>${review.name}</h3>

<div class="stars">

${stars}

</div>

<p>

${review.message}

</p>

</div>

`;

});

}

loadReviews();

/* ==========================================
Auto Review Slider
========================================== */

let currentReview=0;

function autoSlide(){

const cards=
document.querySelectorAll(".review-card");

cards.forEach(card=>{

card.style.display="none";

});

if(cards.length>0){

cards[currentReview].style.display="block";

currentReview++;

if(currentReview>=cards.length){

currentReview=0;

}

}

}

setInterval(autoSlide,4000);

/* ==========================================
Review Animation
========================================== */

const reviewObserver=
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:0.3
});

document.querySelectorAll(".review-card").forEach(card=>{

reviewObserver.observe(card);

});

/* ==========================================
Average Rating
========================================== */

let total=0;

reviews.forEach(r=>{

total+=r.rating;

});

const average=(total/reviews.length).toFixed(1);

console.log("Average Rating :",average);

/* ==========================================
Future Firebase Support
========================================== */

// Reviews will be loaded from Firestore later

console.log("Review Module Ready");
