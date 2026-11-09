// catalogo.js
// Questo file contiene solo le informazioni di base dei libri per la pagina Home.
// Il contenuto effettivo (i nodi) verrà caricato dinamicamente.

const bookCatalog = {
    "00000001": {
        id: "00000001",
        title: "Oltre il quarto mondo",
        description: "Sab e Ale, colti da un'improvvisa amnesia, si ritrovano coinvolti in un viaggio inaspettato.",
        protagonist: "Sabrina",
        stats: [
            { id: "forza", name: "Forza", value: 1 },
            { id: "tempra", name: "Tempra", value: 1 },
            { id: "destrezza", name: "Destrezza", value: 1 },
            { id: "riflessi", name: "Riflessi", value: 1 },
            { id: "concentrazione", name: "Concentrazione", value: 1 },
            { id: "osservazione", name: "Osservazione", value: 1 }
        ],
        startingNodeId: "0"
    }
    // ESEMPIO DI UN SECONDO LIBRO:
    /*
    "00000002": {
        id: "00000002",
        title: "Il mistero della villa",
        description: "Un'avventura investigativa.",
        protagonist: "Ispettore",
        stats: [ { id: "logica", name: "Logica", value: 5 } ],
        startingNodeId: "intro"
    }
    */
};