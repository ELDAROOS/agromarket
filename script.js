let cartCount = 0;
const cartCountElement = document.getElementById('cart-count');

async function loadProducts() {
  try {
    const response = await fetch('http://localhost:3001/products');
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    const catalog = document.querySelector('.catalog');
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'Ошибка: не удалось загрузить товары. Убедитесь, что json-server запущен на порту 3001.';
    catalog.appendChild(errorMessage);
  }
}

function renderProducts(products) {
  const catalog = document.querySelector('.catalog');
  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price} тг</p>
      <button type="button">В корзину</button>
    `;

    const button = card.querySelector('button');
    button.addEventListener('click', () => {
      cartCount++;
      if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.classList.add('bump');
        setTimeout(() => cartCountElement.classList.remove('bump'), 200);
      }
    });

    catalog.appendChild(card);
  });
}

loadProducts();
