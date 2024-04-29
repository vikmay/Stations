export function handleEditModalClick(event) {
    if (event.target.classList.contains('edit-close')) {
        event.target.parentElement.remove();
        document.querySelectorAll('.edit-station-form').forEach(form => form.remove());
    }
}