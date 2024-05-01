export function displayStationsContainer(listContainer) {
    listContainer.innerHTML === '' ?
        listContainer.style.display = 'none' :
        listContainer.style.display = 'block';
}