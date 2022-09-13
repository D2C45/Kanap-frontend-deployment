// import de la fonction request permettant de faire des requêtes et de renvoyer la réponse en JSON
import {request} from './functions.js';
import {config} from './config.js';

// variable récupérant l'élément avec l'Id 'items'
const items = document.getElementById('items');

/**
 * Parcourt la liste de canapés pour créer les éléments HTML à afficher pour chaque canapé
 * @param {Object} couchList la liste des canapés
 */
function display(couchList) {
    for(let couch of couchList) {
        items.innerHTML += `<a href="./product.html?id=${couch._id}">
                                <article>
                                    <img src="${couch.imageUrl}" alt="${couch.altTxt}">
                                    <h3 class="productName">${couch.name}</h3>
                                    <p class="productDescription">${couch.description}</p>
                                </article>
                            </a>`
    }; 
};

// requête pour récupérer la config, puis requête pour récupérer la liste de canapés sur l'API et l'afficher
        request(config.host)
            .then(function(couchList) {
                display(couchList);
            });