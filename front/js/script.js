
req();
//recuperation des données de l'api
function req() {
    fetch("http://localhost:3000/api/products").then((res) => res.json().then((data) => {
        for(const product of data) {
            appendItem(product._id, product.name, product.imageUrl, product.altTxt, product.description)
        }
    })).catch((e) => showError());
}
// creation de la fonction pour faire apparaitre les element sur la page d'accueil
function appendItem(id, name, image, altText, desc) {
    // ajout de l'élément a
    const a = document.createElement("a");
    a.setAttribute("href", `/P5_rebolloso_code/front/html/product.html?id=${id}`)
// ajout de l'élément a
    const article = document.createElement("article");

// ajout de l'élément img
    const  img = document.createElement("img");
    img.setAttribute("src", image);
    img.setAttribute("alt", altText);
    article.appendChild(img);

// ajout de l'élément h3
    const h3 = document.createElement("h3");
    h3.innerText = name;
    article.appendChild(h3);
// ajout de l'élément description
    const p = document.createElement("p");
    p.innerText = desc;
    article.appendChild(p);
// permet de faire apparaitre les items
    a.appendChild(article);
    const items = document.getElementById('items');
    items.appendChild(a);

}

function showError() {
    const newArticle = document.createElement("article");
    newArticle.innerHTML = "Il n'y a aucun article...";
    const item = document.getElementById("items");
    item.appendChild(newArticle);
}