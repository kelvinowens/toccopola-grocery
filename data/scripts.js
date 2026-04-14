async function loadMenu() {
    try {
        const response = await fetch('menu.json');
        const menuItems = await response.json();

        // 1. Group items by category
        // This transforms your flat list into: { "Starters": [...], "Salads": [...] }
        const menuByCategory = menuItems.reduce((acc, item) => {
            const cat = item.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});

        const menuContent = document.getElementById('menu-content');
        menuContent.innerHTML = ''; // Clear existing content

        // 2. Loop through each category group
        Object.keys(menuByCategory).forEach(category => {
            const section = document.createElement('section');
            section.className = 'menu-section';

            // Add the Category Header (e.g., STARTERS)
            const title = document.createElement('h2');
            title.className = 'category-title';
            title.textContent = category.toUpperCase();
            section.appendChild(title);

            // 3. Loop through the items in this specific category
            menuByCategory[category].forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item-container';

                itemDiv.innerHTML = `
                    <div class="menu-item-header">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">$${item.price}</span>
                    </div>
                    ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                `;
                
                section.appendChild(itemDiv);
            });

            menuContent.appendChild(section);
        });

    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

window.onload = loadMenu;