//Récupération du localstorage en caractere avec parse
let produitLocalStorage = JSON.parse(localStorage.getItem("tableau"));
const htmlPanierVide = document.querySelector("#cart__items");

main();

function main() {
    getPanier();
    totalPanier();
    modifierQuantite();
    supprimerProduit();
    postForm();
    getForm();
    error();
}

function error() {
    //Si il n'y a rien dans le localstorage alors on enlève le formulaire
    if (!produitLocalStorage) {
        document.getElementById("cartOrder").style.display = "none";
        return false;
    }
    //Sinon on continue le script et donc le formulaire sera présent car il y a un produit dans le panier
    return true;
}

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

//Récupérer le panier et affichage
function getPanier() {

    //si le localStorage est null ou qu'il est égale a 0 alors le panier est vide
    if (produitLocalStorage === null || produitLocalStorage === 0) {
        //On ajoute le texte et les balises p a #cart_items
        htmlPanierVide.innerHTML = `<p>Votre panier est vide</p>`;
    //Sinon le panier n'est pas vide et on le traite
    } else {


        //Pour chaque produit appartenant au localStorage on fait l'affichage
        for (let produit in produitLocalStorage) {
            //pour récupérer les informations de chaque produit on rentre dans le tableau porduit du-coup : produitLocalStorage[produit]
            //Création de la balise article
            let produitArticle = document.createElement("article");
            document.querySelector("#cart__items").appendChild(produitArticle);
            produitArticle.className = "cart__item";
            produitArticle.setAttribute('data-id', produitLocalStorage[produit].id)

            let divImg = document.createElement("div");
            produitArticle.appendChild(divImg);
            divImg.className = "cart__item__img";

            let img = document.createElement("img");
            divImg.appendChild(img);
            img.src = produitLocalStorage[produit].img;
            img.alt = produitLocalStorage[produit].alt;

            let containerTitlePrice = document.createElement("div");
            produitArticle.appendChild(containerTitlePrice);
            containerTitlePrice.className = "cart__item__content";

            let sousContainerTitlePrice = document.createElement("div");
            containerTitlePrice.appendChild(sousContainerTitlePrice);
            sousContainerTitlePrice.className = "cart__item__content__description";

            let h2 = document.createElement("h2");
            sousContainerTitlePrice.appendChild(h2);
            h2.innerText = produitLocalStorage[produit].name;

            // Insertion de la couleur
            let productColor = document.createElement("p");
            sousContainerTitlePrice.appendChild(productColor);
            productColor.innerHTML = produitLocalStorage[produit].color;
            productColor.style.fontSize = "20px";

            // Insertion du prix
            let productPrice = document.createElement("p");
            sousContainerTitlePrice.appendChild(productPrice);
            productPrice.innerHTML = produitLocalStorage[produit].prix + " €";

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
            productQuantity.value = produitLocalStorage[produit].quantity;
            productQuantity.className = "itemQuantity";
            productQuantity.setAttribute("type", "number");
            productQuantity.setAttribute("min", "1");
            productQuantity.setAttribute("max", "100");
            productQuantity.setAttribute("name", "itemQuantity");

            // Insertion de l'élément "div"
            let productItemContentSettingsDelete = document.createElement("div");
            productItemContentSettings.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

            // Insertion de "p" supprimer
            let productSupprimer = document.createElement("p");
            productItemContentSettingsDelete.appendChild(productSupprimer);
            productSupprimer.className = "deleteItem";
            productSupprimer.innerHTML = "Supprimer";
        }
    }

}


function totalPanier() {
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
        totalPrice += (elementQuantity[i].valueAsNumber * produitLocalStorage[i].prix)
    }

    let produitTotalPrice = document.getElementById('totalPrice');
    produitTotalPrice.innerHTML = totalPrice;

}


function modifierQuantite() {
    let quantityModif = document.querySelectorAll(".itemQuantity");

    //Boucle pour avoir l'item qu'on veut modifier, I correspond a l'itemQuantity, I est incrémenter
    //Autant de fois qu'il y a de itemQuantity d'ou le lenght pour avoir un int
    for (let i = 0; i < quantityModif.length; i++) {
        quantityModif[i].addEventListener("change", (event) => {
            event.preventDefault();


            let popupChangementQuantity = (data) => {
                if(resultatModifier) {
                    window.confirm(`vous avez bien modifié la quantité ${data.name}`);
                }
            }

            //Quantité que l'utilisateur a actuellement dans le localStorage
            let qttModif = produitLocalStorage[i].quantity;
            //Quantité modifié après que l'utilisateur en as ajouté ou supprimer dans le panier
            //On passera alors au localStorage cette nouvelle valeur
            let qttModifValue = quantityModif[i].valueAsNumber;

            //Permet de chercher dans le localStorage si la quantité modifié par l'utilisateur est bien
            //Différente de celle déjà présente dans le localStorage
            const resultatModifier = produitLocalStorage.find((el) => el.qttModifValue !== qttModif);

            resultatModifier.quantity = qttModifValue;
            produitLocalStorage[i].quantity = resultatModifier.quantity;

            popupChangementQuantity(resultatModifier);

            //On modifie le localStorage
            localStorage.setItem("tableau", JSON.stringify(produitLocalStorage));

            //On rafraichit la page
            location.reload();
        })
    }

}


function supprimerProduit() {
    let btnSuppr = document.querySelectorAll(".deleteItem");

    //Récupérer tout les boutons supprimé de la page, et fait le la boucle le nombre de fois qu'il y a de bouton supprimer
    //dans la page panier
    for (let i = 0; i < btnSuppr.length; i++) {
        btnSuppr[i].addEventListener("click", (event) => {
            event.preventDefault();

            let idDelete = produitLocalStorage[i].id;
            let colorDelete = produitLocalStorage[i].color;

            //Créer un nouveau table avec les conditions requises ou l'id élément est strictement égale a l'idDelete
            //Ou que la couleur et strictement égale a la couleur supprimé
            produitLocalStorage = produitLocalStorage.filter(el => el.id !== idDelete || el.color !== colorDelete);

            if (produitLocalStorage.length === 0) {
                localStorage.clear();
            } else {
                localStorage.setItem("tableau", JSON.stringify(produitLocalStorage));
            }

            alert("Vous avez supprimé le produit");
            location.reload();
        })
    }
}

function getForm() {

    let form = document.querySelector(".cart__order__form");

    //Création des expressions régulières
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    let charRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
    let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

    // Ecoute de la modification du prénom
    form.firstName.addEventListener('input', function() {
        //Séléctionne la balise suivante de l'input qui est donc le message d'erreur
        let firstNameErrorMsg = this.nextElementSibling;

        //On teste que l'utilisateur ne mettent pas n'importe quoi, il est autorisé a mettre tout ce qui est dans la regex
        if (charRegExp.test(this.value)) {
            firstNameErrorMsg.innerHTML = '';
            return true;
        } else {
            firstNameErrorMsg.innerHTML = 'Caractère interdit';
            return false;
        }
    });

    // Ecoute de la modification du nom
    form.lastName.addEventListener('input', function() {
        let lastNameErrorMsg = this.nextElementSibling;

        if (charRegExp.test(this.value)) {
            lastNameErrorMsg.innerHTML = '';
            return true;
        } else {
            lastNameErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
            return false;
        }
    });

    // Ecoute de la modification du prénom
    form.address.addEventListener('input', function() {
        let addressErrorMsg = this.nextElementSibling;

        if (addressRegExp.test(this.value)) {
            addressErrorMsg.innerHTML = '';
            return true;
        } else {
            addressErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
            return false;
        }

    });

    // Ecoute de la modification du prénom
    form.city.addEventListener('input', function() {
        let cityErrorMsg = this.nextElementSibling;

        if (charRegExp.test(this.value)) {
            cityErrorMsg.innerHTML = '';
            return true;
        } else {
            cityErrorMsg.innerHTML = 'Veuillez renseigner ce champ.';
            return false;
        }
    });

    // Ecoute de la modification du prénom
    form.email.addEventListener('input', function() {
        let emailErrorMsg = this.nextElementSibling;

        if (emailRegExp.test(this.value)) {
            emailErrorMsg.innerHTML = '';
            return true;
        } else {
            emailErrorMsg.innerHTML = 'Veuillez renseigner votre email.';
            return false;
        }
    });

}

function postForm(){

    //Récupération du bouton pour commander
    const btn_commander = document.getElementById("order");

    //Création de l'action sur le bouton commander
    btn_commander.addEventListener("click", (event) => {

        event.preventDefault();

        //Récupération des infos de l'utilisateur
        let inputName = document.getElementById('firstName');
        let inputLastName = document.getElementById('lastName');
        let inputAdress = document.getElementById('address');
        let inputCity = document.getElementById('city');
        let inputMail = document.getElementById('email');

       if (getForm()) {
       } else {
           alert("Vous devez entrer des informations valide")
           return false;
       }

        //Si un champ est vide alors on return false pour arrêter le scripte et lancer le message d'erreur
        if (!checkInput()) {
            return false;
        }

        //Si il y rien dans le localStorage on affiche un message d'erreur
        if (!error()) {
            alert("Vous n'avez rien dans le panier");
            return false;
        }

        const produits = JSON.parse(localStorage.getItem("tableau")); //

        //On construit un nouveau tableau grâce au localstorage
        let productsId = [];
        for (let i = 0; i < produits.length; i++) {
            productsId.push(produits[i].id)
        }

        //Création d'un autre tableau
        const order = {
            contact : {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAdress.value,
                city: inputCity.value,
                email: inputMail.value,
            },
            products : productsId
        };

        //On envoie les options qu'on veut a l'api, ici on envoie du POST car on a un formulaire de données
        const options = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },

        };

        fetch("http://localhost:3000/api/products/order", options)
            .then((response) => response.json())
            .then((data) => {
                localStorage.clear();
                localStorage.setItem("orderId", data.orderId);

                document.location.href = "confirmation.html";
            })
            .catch((err) => {
                alert ("Problème avec fetch : " + err.message);
            });
    })

}