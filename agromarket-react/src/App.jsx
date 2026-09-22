import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Не удалось загрузить товары. Убедитесь, что json-server запущен на порту 3001.');
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function handleAddToCart() {
    setCartCount((prev) => prev + 1);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header>
        <div className="header-container">
          <h1>AgroMarket</h1>
          <div className="cart-widget">
            <span className="cart-icon" aria-hidden="true">🛒</span>
            <span className="cart-label">Корзина:</span>
            <span id="cart-count">{cartCount}</span>
          </div>
        </div>
      </header>

      <main>
        <section className="catalog-section">
          <div className="catalog-header">
            <h2>Каталог</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск товара..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && (
            <div className="loading-state">Загрузка товаров...</div>
          )}

          {error && !loading && (
            <div className="error-state">{error}</div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">По запросу «{searchTerm}» ничего не найдено</div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="catalog">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
