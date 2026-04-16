package main

import (
    "log"
    "net/http"
)

func main() {

    // Sert les fichiers statiques (CSS, images, etc.)
    // Ici on sert tout le dossier courant
    fs := http.FileServer(http.Dir("./"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))

    // Route principale → renvoie ton portfolio.html
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "portfolio.html")
    })

    log.Println("Serveur lancé sur http://localhost:8080")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal(err)
    }
}
