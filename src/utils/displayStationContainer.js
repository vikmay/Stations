export function displayStationsContainer(listContainer) {
    if (listContainer.innerHTML === '') {
        listContainer.style.display = 'none';
    } else {
        listContainer.style.display = 'block';
    }
}