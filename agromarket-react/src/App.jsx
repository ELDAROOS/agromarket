import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
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
      <Header cartCount={cartCount} />

      <main className="page">
        <section id="catalog" className="catalog">
          <div className="catalog-toolbar">
            <h2>Каталог</h2>
            <input
              type="search"
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
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAddToCart}
                  featured={Number(product.id) === 1}
                />
              ))}
            </div>
          )}
        </section>

        <aside id="delivery" className="sidebar">
          <h3>Доставка</h3>
          <ul>
            <li>Астана — на следующий день</li>
            <li>Акмолинская область — 2-3 дня</li>
            <li>Бесплатно от 20 000 тг</li>
          </ul>
        </aside>

        <ContactForm />
      </main>

      <Footer />
    </>
  );
}

export default App;
