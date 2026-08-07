
/* ==========================================
   MCS Warranty System
========================================== */

const warrantyForm =
document.getElementById("warrantyForm");

const warrantyInput =
document.getElementById("warrantyNumber");

const resultBox =
document.getElementById("warrantyResult");

/* ==========================================
Sample Data
(Firebase connect panna remove pannuvom)
========================================== */

const warrantyDatabase = [

{

id:"MCS-2026-0001",

product:"LG Split AC PCB",

customer:"Ramesh",

purchase:"12-07-2026",

expiry:"12-01-2027",

status:"Active"

},

{

id:"MCS-2026-0002",

product:"Samsung Refrigerator PCB",

customer:"Arun",

purchase:"18-07-2026",

expiry:"18-01-2027",

status:"Active"

},

{

id:"MCS-2025-0010",

product:"IFB Washing PCB",

customer:"Suresh",

purchase:"02-02-2025",

expiry:"02-08-2025",

status:"Expired"

}

];

/* ==========================================
Warranty Check
========================================== */

if(warrantyForm){

warrantyForm.addEventListener("submit",function(e){

e.preventDefault();

const code =
warrantyInput.value.trim();

const warranty =
warrantyDatabase.find(item=>item.id===code);

if(warranty){

resultBox.innerHTML=

`
<div class="success">

<h2>Warranty Found</h2>

<p><b>Product :</b> ${warranty.product}</p>

<p><b>Customer :</b> ${warranty.customer}</p>

<p><b>Purchase :</b> ${warranty.purchase}</p>

<p><b>Expiry :</b> ${warranty.expiry}</p>

<p><b>Status :</b> ${warranty.status}</p>

</div>

`;

}

else{

resultBox.innerHTML=

`
<div class="error">

<h2>Warranty Not Found</h2>

<p>

Please check your Warranty Number.

</p>

</div>

`;

}

});

}

/* ==========================================
Copy Warranty Number
========================================== */

const copyButtons =
document.querySelectorAll(".copyWarranty");

copyButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

navigator.clipboard.writeText(

btn.dataset.code

);

alert("Warranty Number Copied");

});

});

/* ==========================================
Print Warranty
========================================== */

const printBtn =
document.getElementById("printWarranty");

if(printBtn){

printBtn.addEventListener("click",()=>{

window.print();

});

}

/* ==========================================
Download Warranty PDF
========================================== */

const pdfBtn =
document.getElementById("downloadWarranty");

if(pdfBtn){

pdfBtn.addEventListener("click",()=>{

alert("PDF Download Coming Soon");

});

}

/* ==========================================
QR Scan Placeholder
========================================== */

const qrButton =
document.getElementById("scanQR");

if(qrButton){

qrButton.addEventListener("click",()=>{

alert("QR Warranty Scanner");

});

}

/* ==========================================
Firebase Integration
Coming in Next Phase
========================================== */

console.log("Warranty Module Ready");
