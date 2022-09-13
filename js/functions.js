/**
 * Envoie une requête à adress qui renvoit les données JSON si ok
 * @param {url} adress chemin d'accès(url ou chemin relatif)
 * @param {object} option options de la requête (facultatif)
 * @returns {json}
 */
async function request(adress, option) {
    let response = await fetch(adress, option);
    if (response.ok) {
        return response.json();
    } else {
        console.log(error);
    }
}

// ---------------------------------------------------------------
// ---------- Gestion du panier ----------------------------------
// ---------------------------------------------------------------

// variable récupérant l'url de la page (chaine de caractères)
const currentUrlString = window.location.href;
// variable qui convertit la chaine de caractères en url
const currentUrl = new URL(currentUrlString);
// variable qui récupère l'id de l'url
const currentId = currentUrl.searchParams.get("id");

/**
 * Sauvegarde le panier
 * @param {Object} cart le panier
 */
 function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Récupère le panier
 * @returns {JSON | Array} le panier ou un tableau vide si le panier n'existe pas
 */
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

/**
 * Recherche si le produit est déjà présent dans le panier avec le même id et la même couleur
 * @param {Object} product le produit
 * @param {JSON} cart le panier
 * @returns {Object | undefined} le produit trouvé ou undefined si non trouvé
 */
function findProductIntoCart (product, cart) {
    let found = undefined;
    for (let article of cart) {
        if (article.id == product.id && article.color == product.color) {
            found = article;
            break;
        }
    }
    return found;
}

/**
 * Crée l'objet produit avec les caractéristiques (id, quantité et couleur) récupérées sur la page courante
 * @returns {object}
 */
function createProductObject() {
    let product = {
        id: currentId,
        quantity: Number(document.getElementById('quantity').value, 10),
        color: document.getElementById('colors').value
    }
    return product;
}

/**
 * Sauvegarde le panier, affiche un message de confirmation et recharge la page
 * @param {string} cart le panier
 */
function saveCartAndConfirm(cart) {
    saveCart(cart);
    window.alert("L'article a été ajouté à votre panier");
    location.reload();
}

/**
 * Ajoute le produit au panier ou incrémente la quantité si le produit est déjà présent dans le panier
 * @param {object} product
 */
function addToCart(product) {
    let cart = getCart();
    let found = findProductIntoCart(product, cart);
    if (found != undefined) {
        if (found.quantity + product.quantity > 100) {
            window.alert("La quantité saisie dépasse la quantité totale de 100 autorisé pour ce produit, veuillez modifier la quantité");
        } else{
            found.quantity += product.quantity;
            saveCartAndConfirm(cart);
        }
    } else {
        cart.push(product);
        saveCartAndConfirm(cart);
    }
}

/**
 * Vérifie que les champs couleur et quantité soit correctement renseignés
 * Renvoie une alerte si mal renseignés
 * Ajoute au panier si bien renseignés
 */
function checkInputAndAddToCart() {
    let product = createProductObject();
    if (product.color == '') {
        window.alert("Veuillez choisir une couleur");
    } else {
        if (product.quantity < 1 || product.quantity > 100 || !Number.isInteger(product.quantity)) {
            window.alert("Veuillez choisir une quantité valable entre 1 et 100");
        } else {
            addToCart(product);
        }
    }
}

export {request, checkInputAndAddToCart, getCart, findProductIntoCart, saveCart, currentId};