export function hideElement(elem) {    
    elem.classList.add('is-hidden');   
}

export function showElement(elem) {
    if(elem.classList.contains('is-hidden')) {
        elem.classList.remove('is-hidden');
    }
    return;   
}

