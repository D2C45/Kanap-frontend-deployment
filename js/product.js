// import de fonctions et variables
import {request, checkInputAndAddToCart, currentId} from './functions.js';
import {config} from './config.js';

/**
 * Ajoute le texte récupéré dans la balise avec l'id
 * @param {Object} couch les caractéristiques du canapé
 * @param {String} id l'id de la balise html où insérer le texte
 * @param {String} content la clé de l'objet couch qui contient le contenu à insérer
 */
function text(couch,id,content=id) {
    document.getElementById(id).textContent = couch[content];
};

/**
 * Ajoute les couleurs dans le menu déroulant
 * @param {Object} couch les caractéristiques du canapé
 */
function colorList(couch) {
    for(let color of couch.colors) {
        let list = document.getElementById("colors");
        list.innerHTML += `<option value="${color}">${color}</option>`;
    };
}

/**
 * Ajoute les caractéristiques du canapé dans product.html
 * @param {Object} couch les caractéristiques du canapé
 */
function addElements(couch) {
    document.title = couch.name;
    document.getElementsByClassName("item__img")[0].innerHTML = `<img src="${couch.imageUrl}" alt="${couch.altTxt}">`;
    text(couch,'title','name');
    text(couch,'price');
    text(couch,'description');
    colorList(couch);
}

// requête pour récupérer la config, puis requête pour récupérer les caractéristiques du canapé sur l'API et ajouter les éléments dans product.html
        request(config.host + currentId)
            .then(function(couch) {
                addElements(couch);
            });

// Au click sur le bouton "Ajouter au panier", vérifie les champs et ajoute au panier
document.getElementById('addToCart').addEventListener('click', checkInputAndAddToCart);