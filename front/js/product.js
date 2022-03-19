const url = new URL(window.location.href);
const idProduct = url.searchParams.get("id");
let data = "";


const color = document.querySelector("#colors");
const quantityItem = document.querySelector("#quantity");

getArticle();

function getArticle() {
    fetch("http://localhost:3000/api/products/" + idProduct).then((response) => response.json().then((data) => {
        //transmision des data dans ma function
        postArticle(data);
    }))
}

function postArticle(data) {
    // insertion image
    let img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = data.altTxt;

    const itemImg = document.getElementById("itemImg");
    itemImg.appendChild(img);

    const title = document.getElementById("title");
    title.innerText = data.name;

    const price = document.getElementById("price");
    price.innerText = data.price;

    const description = document.getElementById("description");
    description.innerText = data.description;

    const colors = document.getElementById("colors");


    for(const color of data.colors) {
        const opt = document.createElement("option");
        opt.setAttribute('value', color);
        opt.innerText = color;
        colors.appendChild(opt);
    }

    ajouteAuxPanier(data);
}


function ajouteAuxPanier(data){
    const boutonEnvoyeFormulaire = document.querySelector("#addToCart");
    boutonEnvoyeFormulaire.addEventListener("click",(event) => {

        //On récupère la couleur
        let choiceColor = color.value;


        if (choiceColor === "") {
            alert("Vous avez oublié de choisir une couleur");
            return false;
        }

        //On récupère la quantité
        let choiceQuantity = quantityItem.value;

        if (choiceQuantity === "") {
            alert("Vous avez oublié d'ajouter une quantité.")
            return false;
        } else if (choiceQuantity === "0") {
            alert("Vous devez mettre une quantité supérieur a 0.")
            return false;
        }

        //Initialisation du tableau
        let tableauOption = {
            color: choiceColor,
            quantity: choiceQuantity,
            id: idProduct,
            img: data.imageUrl,
            prix: data.price,
            alt: data.altTxt,
            name: data.name
        }

        //Fonctionnement par l'absurdité
        //On regarde si la clé tableau existe dans Application (navigateur), si elle existe c'est qu'on a déjà un élément dans le panier
        //Si elle existe pas c'est qu'on a pas encore ajouter d'éléments au panier, et donc on se préparer a créer le tableau
        let getProduit = JSON.parse(localStorage.getItem("tableau"));

        //fenêtre pop-up
        let popupConfirmation = () => {
            if (getProduit) {
                let checkProduit = getProduit.find(el => el.id === idProduct && el.color === choiceColor);


                if (checkProduit) {
                    if (window.confirm(`Vous possèdez déjà ce produit dans votre panier, voulez-vous rajouter le produit suivant: ${choiceQuantity} ${data.name} ${choiceColor} en plus de celui déjà présent dans le panier.`)) {
                        window.location.href = "cart.html";
                        return true
                    }
                } else {
                    if (window.confirm(`Vous possèdez déjà un produit dans votre panier, voulez-vous rajouter le produit suivant: ${choiceQuantity} ${data.name} ${choiceColor} a votre panier.`)) {
                        window.location.href = "cart.html";
                        return true
                    }
                }
            } else {
                if (window.confirm(`Vous avez ajouté votre premier produit: ${choiceQuantity} ${data.name} ${choiceColor} a votre panier.`)) {
                    window.location.href = "cart.html";
                    return true
                }
            }
        }

        if (getProduit) { //Si un produit est présent dans le panier alors la clé tableau existe déjà
            //On regarde si le produit est présent dans le panier
            const checkProduit = getProduit.find(el => el.id === idProduct && el.color === choiceColor);

            //Si le produit est présent alors on ajoute simplement la nouvelle quantité
            if (checkProduit) {
                if (popupConfirmation()) {
                    //On additionne la quantité qu'on a séléctionner avec l'ancien produit dans le panier
                    checkProduit.quantity = parseInt(tableauOption.quantity) + parseInt(checkProduit.quantity);
                    //Puis on l'ajoute au local storage
                    localStorage.setItem("tableau", JSON.stringify(getProduit));
                }
            } else {
                if (popupConfirmation()) {
                    //On ajoute le nouveau produit, car il existe pas encore dans le panier
                    getProduit.push(tableauOption);
                    //On le place dans e local storage
                    localStorage.setItem("tableau", JSON.stringify(getProduit));
                }
            }
        } else { //Si aucun produit n'est trouvé alors le panier est vide on s'apprête a créer le tableau avec un élément
            //On dit que getProduit est un tableau
            if (popupConfirmation()) {
                getProduit = [];
                //Puis on donne a ce tableau le produit que l'utilisateur a séléctionné
                getProduit.push(tableauOption);
                localStorage.setItem("tableau", JSON.stringify(getProduit));
            }
        }
    })
}

