// import de fonctions
import {request, getCart, saveCart, findProductIntoCart} from './functions.js';
import {config} from './config.js';

// variable récupérant l'élément avec l'Id 'cart__items'
const cartItems = document.getElementById('cart__items');

/**
 * Crée la chaine de caractères à insérer dans le HTML pour un canapé
 * @param {object} article l'article récupéré dans le panier via localStorage
 * @param {object} couchDetails les détails du canapé récupérés sur l'API via l'id du canapé
 * @returns {string} la chaine de caractères à insérer dans le HTML pour un canapé
 */
function addElementsIntoCart(article, couchDetails) {
    let content =   `<article class="cart__item" data-id="${couchDetails._id}" data-color=
                    "${article.color}">
                        <div class="cart__item__img">
                            <img src="${couchDetails.imageUrl}" alt="${couchDetails.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${couchDetails.name}</h2>
                                <p>${article.color}</p>
                                <p>${couchDetails.price.toFixed(2)} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`
    return content;
};

/**
 * Récupère le panier
 * Parcourt le panier pour récupérer les articles
 * Interroge l'api pour récupérer les détails des canapés à partir de l'id
 * Concatène les chaines de caractère de chaque canapé avec la fonction addElementsIntoCart
 * @returns {string} la chaine de caractères à insérer dans le HTML pour tous les canapés du panier
 */
async function displayCart() {
    let cart = getCart();
    let content = '';
    for(let article of cart) {
        let currentId = article.id;
        let couchDetails = await request(config.host + currentId);
        content += addElementsIntoCart(article, couchDetails);
    }
    return content;
}

// Récupère le contenu et l'ajoute au HTML pour afficher le panier
let content = await displayCart();
cartItems.innerHTML = content;


// Variables récupérant les éléments qui affichent la quantité totale et le prix total
const totalQuantityElt = document.getElementById('totalQuantity');
const totalPriceElt = document.getElementById('totalPrice');

/**
 * Calcule et renvoie la quantité totale d'article présent dans le panier dans l'élément quantité
 */
function getTotalArticles() {
    let cart = getCart();
    let totalQuantity = 0;
    for(let article of cart) {
        totalQuantity += article.quantity;
    }
    totalQuantityElt.textContent = totalQuantity;
}

// Affiche la quantité totale d'article présent dans le panier
getTotalArticles();

/**
 * Calcule et renvoie le prix total du panier
 * @returns {number}
 */
async function getTotalPrice() {
    let cart = getCart();
    let totalPrice = 0;
    for(let article of cart) {
        let currentId = article.id;
        let couchDetails = await request(config.host + currentId);
        totalPrice += (article.quantity * (couchDetails.price * 10)) / 10;
    }
    return totalPrice;
}

// Affiche le prix total du panier
async function displayPrice() {
    let totalPrice = await getTotalPrice();
    totalPriceElt.textContent = totalPrice.toFixed(2);
}

displayPrice();

/**
 * Récupère l'id et la couleur dans l'élément article qui contient l'élément quantité
 * Crée un objet avec l'id et la couleur du produit dont la quantité est à modifier
 * @param {string} element élément HTML du produit dont la quantité est à modifier
 * @param {string} cart le panier stocké dans le localStorage
 * @returns {object} un objet avec l'id et la couleur du produit dont la quantité est à modifier
 */
function getIdAndColor(element, cart) {
    let article = element.closest("article");
    let product = {
        id: article.dataset.id,
        color: article.dataset.color
    }
    let foundProduct = findProductIntoCart(product, cart);
    return foundProduct;
}

// Récupère la liste des éléments itemQuantity dans un tableau
let itemQuantityList = document.getElementsByClassName("itemQuantity");

/**
 * Change la quantité du produit dans le panier stocké dans le localStorage
 * @param {string} itemQuantity élément HTML du produit dont la quantité est à modifier
 */
function changeValue(itemQuantity) {
    let cart = getCart();
    let foundProduct = getIdAndColor (itemQuantity, cart);
    let value = Number(itemQuantity.value);
    if (value < 1 || value > 100 || !Number.isInteger(value)) {
        window.alert("Veuillez choisir une quantité valable entre 1 et 100");
        location.reload();
    } else {
        itemQuantity.defaultValue = itemQuantity.value;
        foundProduct.quantity = value;
    saveCart(cart);
    }    
}

// Boucle sur tous les éléments itemQuantity pour changer la quantité dans le panier stocké
// dans le localStorage et actualiser la quantité et le prix total
for(let itemQuantity of itemQuantityList) {
    itemQuantity.addEventListener('change', function() {
        changeValue(itemQuantity);
        getTotalArticles();
        displayPrice();
    });
}

// Récupère les boutons supprimer dans un tableau
let deleteItemList = document.getElementsByClassName("deleteItem");

/**
 * Supprime le produit dans le localStorage et le HTML
 * @param {string} deleteItem un bouton supprimer du panier
 */
function deleteProduct(deleteItem) {
    let cart = getCart();
    let article = deleteItem.closest("article");
    let foundProduct = getIdAndColor (deleteItem, cart);
    let index = cart.indexOf(foundProduct);
    cartItems.removeChild(article);
    cart.splice(index, 1);
    saveCart(cart);
}

// Boucle qui parcourt les boutons supprimer pour qu'au click, le produit soit supprimé
// du localStorage et du HTML, et actualiser la quantité et le prix total
for(let deleteItem of deleteItemList) {
    deleteItem.addEventListener('click', function() {
        deleteProduct(deleteItem);
        getTotalArticles();
        displayPrice();
    });
}

// ********************** Vérification du formulaire *************************


// *******************************************************
// *********** validité des champs prénom et nom *********
// *******************************************************

// Récupération de l'input firstName (Prénom)
let firstName = document.getElementById("firstName");
// Récupération de l'input lastName (Nom)
let lastName = document.getElementById("lastName");

// Récupération des éléments pour l'affichage du message d'erreur
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");

// Création de l'expression régulière pour validation prénom et nom
let nameRegExp = /^[a-zA-ZÀ-ÖÙ-öù-ÿ]+([-'\s]{1}[a-zA-ZÀ-ÖÙ-öù-ÿ]+)?$/;

// Ecoute de la modification du champ prénom
firstName.addEventListener("change", function() {
    firstNameErrorMsg.textContent = validName(this)[1];
});

// Ecoute de la modification du champ nom
lastName.addEventListener("change", function() {    
    lastNameErrorMsg.textContent = validName(this)[1];
});

/**
 * Teste la validité de la saisie du prénom(ou du nom) et affiche un message d'erreur si non valide
 * @param {string} inputName la balise input pour le prénom ou le nom
 * @returns {array} un tableau avec un booléen pour la validité et le message assoocié
 */
function validName(inputName) {    
    let testName = nameRegExp.test(inputName.value);
    let msg;
    let valid = false;
    // Pas d'espace, d'apostrophe ou de tiret au début du mot
    if (/^\s|^-|^'/.test(inputName.value)) {
        msg = "Retirer les espaces, apostrophes ou tirets au début"
    }
    // Au moins 3 caractères
    else if (inputName.value.length < 3) {
        msg = "Ce champ doit contenir au moins 3 caractères"
    }
    // Test la regExp
    else if (!testName) {
        msg = "Ce champ ne peut comporter que des caractères alphabétiques";
    }
    // Champ valide
    else {
        msg = "";
        valid = true;
    }
    // retourne si valide ou non, et le message associé
    let response = [valid, msg];
    return response;
};

// ***********************************************
// *********** validité du champ adresse *********
// ***********************************************

// Récupération de l'input address
let address = document.getElementById("address");

// Récupération de l'élément pour l'affichage du message d'erreur
let addressErrorMsg = document.getElementById("addressErrorMsg");

// Création de l'expression régulière pour validation de l'adresse
let addressRegExp = /^[0-9]{1,4}(?:(?:[,. ]){1}[a-zA-ZÀ-ÖÙ-öù-ÿ'-]+)+$/;

// Ecoute de la modification du champ adresse
address.addEventListener("change", function() {
    addressErrorMsg.textContent = validAdress(this)[1];
});

/**
 * Teste la validité de la saisie de l'adresse et affiche un message d'erreur si non valide
 * @param {string} inputAdress la balise input pour l'adresse
 * @returns {array} un tableau avec un booléen pour la validité et le message assoocié
 */
 function validAdress(inputAdress) {    
    let testAdress = addressRegExp.test(inputAdress.value);
    let msg;
    let valid = false;
    // L'adresse doit commencer par un chiffre (évite les espaces et autres caractères)
    if (!/^[0-9]/.test(inputAdress.value)) {
        msg = "L'adresse doit commencer par des chiffres"
    }
    // Test la regExp
    else if (!testAdress) {
        msg = "Le format de l'adresse n'est pas valide (ex: 20 rue du parc)";
    }
    // Champ valide
    else {
        msg = "";
        valid = true;
    }
    // retourne si valide ou non, et le message associé
    let response = [valid, msg];
    return response;
};

// *********************************************
// *********** validité du champ ville *********
// *********************************************

// Récupération de l'input city
let city = document.getElementById("city");

// Récupération de l'élément pour l'affichage du message d'erreur
let cityErrorMsg = document.getElementById("cityErrorMsg");

// Création de l'expression régulière pour validation de l'adresse
let cityRegExp = /^[a-zA-ZÀ-ÖÙ-öù-ÿ]+(?:(?:[,. ]){0,1}[a-zA-ZÀ-ÖÙ-öù-ÿ'-]+)$/;

// Ecoute de la modification du champ adresse
city.addEventListener("change", function() {
    cityErrorMsg.textContent = validCity(this)[1];
});

/**
 * Teste la validité de la saisie de la ville et affiche un message d'erreur si non valide
 * @param {string} inputCity la balise input pour la ville
 * @returns {array} un tableau avec un booléen pour la validité et le message assoocié
 */
 function validCity(inputCity) {    
    let testCity = cityRegExp.test(inputCity.value);
    let msg;
    let valid = false;
    // Pas d'espace, d'apostrophe ou de tiret au début du mot
    if (/^\s|^-|^'/.test(inputCity.value)) {
        msg = "Retirer les espaces, apostrophes ou tirets au début"
    }
    // Au moins 3 caractères
    else if (inputCity.value.length < 3) {
        msg = "Ce champ doit contenir au moins 3 caractères"
    }
    // Test la regExp
    else if (!testCity) {
        msg = "Ce champ ne peut comporter que des caractères alphabétiques";
    }
    // Champ valide
    else {
        msg = "";
        valid = true;
    }
    // retourne si valide ou non, et le message associé
    let response = [valid, msg];
    return response;
};

// *********************************************
// *********** validité du champ email *********
// *********************************************

// Récupération de l'input email
let email = document.getElementById("email");

// Récupération de l'élément pour l'affichage du message d'erreur
let emailErrorMsg = document.getElementById("emailErrorMsg");

// Création de l'expression régulière pour validation de l'adresse
let emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;

// Ecoute de la modification du champ adresse
email.addEventListener("change", function() {
    emailErrorMsg.textContent = validEmail(this)[1];
});

/**
 * Teste la validité de la saisie de l'email et affiche un message d'erreur si non valide
 * @param {string} inputEmail la balise input pour l'email
 * @returns {array} un tableau avec un booléen pour la validité et le message assoocié
 */
 function validEmail(inputEmail) {    
    let testEmail = emailRegExp.test(inputEmail.value);
    let msg;
    let valid = false;
    // Pas d'espace, d'apostrophe ou de tiret au début du mot
    if (/^\s/.test(inputEmail.value)) {
        msg = "Retirer les espaces au début"
    }
    // Test la regExp
    else if (!testEmail) {
        msg = "Le format de l'email n'est pas valide (ex: nom@domaine.fr)";
    }
    // Champ valide
    else {
        msg = "";
        valid = true;
    }
    // retourne si valide ou non, et le message associé
    let response = [valid, msg];
    return response;
};


// *********************************************************
// ****************** soumission du formulaire *************
// *********************************************************

/**
 * Récupère tous les id des produits présents dans le panier
 * @param {object} cart le panier
 * @returns {array} un tableau avec les id des produits du panier
 */
 function getProductsId(cart) {
    let productsId = [];
    for (let product of cart) {
        productsId.push(product.id);
    }
    return productsId;
}

/**
 * Récupère les éléments saisis dans le formulaire
 * @returns {object} contient les éléments saisis dans le formulaire
 */
function getCustomerInfo() {
    let contact = {
        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value
    };
    return contact;
}

// Récupération du bouton commander
let sendForm = document.getElementById("order");

//Ecoute la soumission du formulaire au click sur le bouton order
sendForm.addEventListener("click", function(event){
    event.preventDefault();
    let cart = getCart();
    // Vérifie si le panier est vide
    if (cart.length == 0) {
        window.alert("Votre panier est vide, veuillez ajouter des articles pour passer commande")
    }
    // Vérifie si tous les champs sont valides
    else if (validName(firstName)[0] && validName(lastName)[0] && validAdress(address)[0] && validCity(city)[0] && validEmail(email)[0]) {
        // Regroupe toutes les données pour la commande
        let orderInfo = {
            contact : getCustomerInfo(),
            products : getProductsId(cart)
        };
        // Crée les options pour la requête
        let option = {
            method : "POST",
            headers : {
                "Accept" : "application/json",
                "Content-Type": "application/json"
            },
            body : JSON.stringify(orderInfo)
        };
        // Envoi la commande
        postOrder(option);
    } else {
        window.alert("Vérifiez que le formulaire est correctement rempli");
    }
});

/**
 * Récupère la config, puis requête POST avec le paramètre order
 * Renvoi sur la page confirmation avec l'id renvoyé par l'API dans l'url
 * Vide le panier
 * @param {object} option les options pour la requête POST
 * @param {object} cart le panier
 */
async function postOrder(option) {
                request(config.host + "order", option)
                    .then(function(response) {
                        document.location.href = "confirmation.html?id=" + response.orderId;
                        localStorage.removeItem("cart");
                    })
}