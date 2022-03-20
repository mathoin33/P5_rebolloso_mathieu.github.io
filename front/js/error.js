export function error() {
    if (!produitLocalStorage) {
        document.getElementById("cartOrder").style.display = "none";
        return false;
    }
    return true;
}

export function checkInput() {
    const inputFeilds = document.querySelectorAll("input");
    const validInputs = Array.from(inputFeilds).filter( input => input.value.length === 0);

    if (validInputs.length === 0) {
        return true;
    } else {
        alert("Vous devez remplir tout les champs")
        return false;
    }
}