function orderId() {
    const idItem = document.getElementById("orderId");

    idItem.innerText = localStorage.getItem("orderId");
    localStorage.clear();
}


orderId();