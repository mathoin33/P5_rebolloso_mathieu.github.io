//Récupération du localstorage en caractere avec parse
let produitLocalStorage = JSON.parse(localStorage.getItem("tableau"));
const htmlPanierVide = document.querySelector("#cart__items");
let cart = [];
cart = JSON.parse(localStorage.getItem("tableau"));

function error() {
    //Si il n'y a rien dans le localstorage alors on enlève le formulaire
    if (!produitLocalStorage) {
        document.getElementById("cartOrder").style.display = "none";
        return false;
    }
    //Sinon on continue le script et donc le formulaire sera présent car il y a un produit dans le panier
    return true;
}
error()

function checkInput() {
    //On regarde toute les valeurs des inputs, si un inpuit n'est pas remplie alors le script s'arrête
    //Et lance une erreur
    const inputFeilds = document.querySelectorAll("input");
    const validInputs = Array.from(inputFeilds).filter( input => input.value.length === 0);

    if (validInputs.length === 0) {
        return true;
    } else {
        alert("Vous devez remplir tout les champs")
        return false;
    }
}


async function display() {
    if (document.getElementById("cart__items") != null && cart != null) {
        for (i in cart) {
            let data = await fetch(`http://localhost:3000/api/products/${cart[i].id}`);
            if (!data.ok) {
                throw new Error("Une erreur")
            }
            let value = await data.json();
            getPanier(value);
        }
    }
}

const fetchProduct = async() => {
    await fetch('http://localhost:3000/api/products')
        .then(res => res.json()
            .then(json => products = json))

    const cartDisplay = async () => {
        if (produitLocalStorage) {
            await produitLocalStorage
        }
    };

    cartDisplay();

    if (produitLocalStorage === null || produitLocalStorage === 0) {
        htmlPanierVide.innerHTML = `<p>Votre panier est vide</p>`
    } else {
        for (let i = 0; i < produitLocalStorage.length; i++) {
            let produitArticle = document.createElement("article");
            document.querySelector("#cart__items").appendChild(produitArticle);
            produitArticle.className = "cart__item";
            produitArticle.setAttribute('data-id', produitLocalStorage[i].id)

            let divImg = document.createElement("div");
            produitArticle.appendChild(divImg);
            divImg.className = "cart__item__img";

            let img = document.createElement("img");
            divImg.appendChild(img);
            img.src = produitLocalStorage[i].img;
            img.alt = produitLocalStorage[i].alt;

            let containerTitlePrice = document.createElement("div");
            produitArticle.appendChild(containerTitlePrice);
            containerTitlePrice.className = "cart__item__content";

            let sousContainerTitlePrice = document.createElement("div");
            containerTitlePrice.appendChild(sousContainerTitlePrice);
            sousContainerTitlePrice.className = "cart__item__content__description";

            let h2 = document.createElement("h2");
            sousContainerTitlePrice.appendChild(h2);
            h2.innerText = produitLocalStorage[i].name;

            // Insertion de la couleur
            let productColor = document.createElement("p");
            sousContainerTitlePrice.appendChild(productColor);
            productColor.innerHTML = produitLocalStorage[i].color;
            productColor.style.fontSize = "20px";

            // Insertion du prix
            let productPrice = document.createElement("p");
            sousContainerTitlePrice.appendChild(productPrice);
            productPrice.innerHTML = products[i].price + "€";

            // Insertion de l'élément "div"
            let productItemContentSettings = document.createElement("div");
            containerTitlePrice.appendChild(productItemContentSettings);
            productItemContentSettings.className = "cart__item__content__settings";

            // Insertion de l'élément "div"
            let productItemContentSettingsQuantity = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsQuantity);
            productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

            // Insertion de "Qté : "
            let productQte = document.createElement("p");
            productItemContentSettingsQuantity.appendChild(productQte);
            productQte.innerHTML = "Qté : ";

            // Insertion de la quantité
            let productQuantity = document.createElement("input");
            productItemContentSettingsQuantity.appendChild(productQuantity);
            productQuantity.value = produitLocalStorage[i].quantity;
            productQuantity.className = "itemQuantity";
            productQuantity.setAttribute("type", "number");
            productQuantity.setAttribute("min", "1");
            productQuantity.setAttribute("max", "100");
            productQuantity.setAttribute("name", "itemQuantity");

            // Insertion de l'élément "div"
            let productItemContentSettingsDelete = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

            // ajout d'un p qui va contenir le bouton "Supprimer"
            let pDeleteItem = document.createElement("p");
            pDeleteItem.className = "deleteItem";
            productItemContentSettings.appendChild(pDeleteItem);
            pDeleteItem.innerHTML = "Supprimer";

            const quantityAndPrice = () => {
                let elementQuantity = document.getElementsByClassName('itemQuantity');
                let longueurTableau = elementQuantity.length;
                totalQuantity = 0;

                //On ajoute chaque élément a totalQuantity, et quand on ajoute un nouveau produit il l'incrémente
                for (let i = 0; i < longueurTableau; ++i) {
                    totalQuantity += elementQuantity[i].valueAsNumber;
                }

                let produitTotalQuantity = document.getElementById("totalQuantity");
                produitTotalQuantity.innerHTML = totalQuantity;

                totalPrice = 0;

                for (let i = 0; i < longueurTableau; ++i) {
                    //Boucle pour récupérer les prix et les quantités et les multipliers pour avoir le prix total
                    totalPrice += (elementQuantity[i].valueAsNumber * products[i].price)
                }

                let produitTotalPrice = document.getElementById('totalPrice');
                produitTotalPrice.innerHTML = totalPrice;
            }
            quantityAndPrice();

            // fonction pour modifier la quantité
            const quantityChanged = () => {
                let qtyModif = document.querySelectorAll(".itemQuantity");


                for (let l= 0; l < qtyModif.length; l++) {
                    qtyModif[l].addEventListener("change", (e) => {
                        e.preventDefault();

                        //Quantité que l'utilisateur a actuellement dans le localStorage
                        let qttModif = produitLocalStorage[l].quantity;
                        //Quantité modifié après que l'utilisateur en as ajouté ou supprimer dans le panier
                        //On passera alors au localStorage cette nouvelle valeur
                        let qttModifValue = qtyModif[l].valueAsNumber;

                        //Permet de chercher dans le localStorage si la quantité modifié par l'utilisateur est bien
                        //Différente de celle déjà présente dans le localStorage
                        const resultatModifier = produitLocalStorage.find((el) => el.qttModifValue !== qttModif);

                        resultatModifier.quantity = qttModifValue;
                        produitLocalStorage[l].quantity = resultatModifier.quantity;

                        quantityAndPrice(); // on rappelle la fonction pour que le prix s'actualise en temps réel.
                        //On modifie le localStorage
                        localStorage.setItem("tableau", JSON.stringify(produitLocalStorage));

                        //On rafraichit la page
                        location.reload();
                    })
                }
            };
            quantityChanged();

            // fonction pour supprimer un produit
            const deleteProducts = () => {

                pDeleteItem.addEventListener("click" , (e) => {
                    e.preventDefault();
                    // enregistrer l'id et la couleur séléctionnés par le bouton supprimer
                    let deleteId = produitLocalStorage[i].id;
                    let deleteColor = produitLocalStorage[i].colors;

                    // filtrer l'élément cliqué par le bouton supprimer
                    produitLocalStorage = produitLocalStorage.filter( el => el.id !== deleteId || el.colors !== deleteColor);

                    if (produitLocalStorage.length === 0) {
                        localStorage.clear();
                    } else {
                        localStorage.setItem("tableau", JSON.stringify(produitLocalStorage)); // on modifie ou supprime la quantité dans le localStorage
                    }

                    location.reload();

                });
            }

            deleteProducts();

            let btnCommander = document.getElementById("order");

            btnCommander.addEventListener("click", (e) => {
                e.preventDefault();

                if (!checkInput()) {
                    return false;
                }

                const contact = {
                    firstName: document.getElementById("firstName").value,
                    lastName:  document.getElementById("lastName").value,
                    address:   document.getElementById("address").value,
                    city:      document.getElementById("city").value,
                    email:     document.getElementById("email").value
                }

                let products = [];
                products.push(produitLocalStorage[i].id);

                const tbl = {
                    products,
                    contact
                };

                let contactRegex= [
                    firstName.reportValidity(),
                    lastName.reportValidity(),
                    address.reportValidity(),
                    city.reportValidity(),
                    email.reportValidity()
                ]

                const req =  {
                    method: 'POST',
                    body: JSON.stringify(tbl),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }

                let contactRegexEnd = true;
                for (let n= 0; n < contactRegex.length; n++) {
                    if (contactRegex[n] === false) contactRegexEnd = false;
                }
                if (contactRegexEnd === true) {

                    fetch("http://localhost:3000/api/products/order", req)
                        .then(response => response.json())
                        .then(data => {
                            localStorage.setItem('orderId', data.orderId);
                            document.location.href = 'confirmation.html?id='+ data.orderId;
                        });
                }
            });
        }
    }
}
fetchProduct();
