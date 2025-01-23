// Get all list items
const navItems = document.querySelectorAll("nav ul li a");

// Get the current page URL
const currentPage = window.location.pathname.split("/").pop();

navItems.forEach(item => {
    // Check if the item's href matches the current page URL
    if (item.getAttribute("href") === currentPage) {
        item.parentElement.classList.add("active");
    }
});
