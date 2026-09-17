let cartCount = 0;
const cartCountElement = document.getElementById('cart-count');

async function loadProducts() {
  try {
    const response = await fetch('http://localhost:3001/products');
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status}`);
    }
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Ошибка при загрузке каталога:', error);
    const catalog = document.querySelector('.catalog');
    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-state';
    errorMsg.textContent = 'Не удалось загрузить каталог товаров. Убедитесь, что сервер запущен.';
    catalog.appendChild(errorMsg);
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
