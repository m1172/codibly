import React, { useState, useEffect } from 'react';
import './style.css';
const App = () => {
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('currentPage') || 1
  );
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [modal, setModal] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch(`https://reqres.in/api/products?page=${currentPage}`)
        .then((response) => response.json())
        .then((response) => {
          setProducts(response);
        })
        .catch((e) => {
          setError(e);
        });
    }
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const onChange = (e) => {
    let value = e.target.value;
    setIsOpen(false);
    setInputValue(value);
    if (value == '') {
      setIsOpen(true);
    }
  };

  const handleClick = () => {
    fetch(`https://reqres.in/api/products/${inputValue}`)
      .then((response) => response.json())
      .then((response) => {
        setProduct(response.data);
      })
      .catch((e) => {
        setError(e);
      });
  };

  return (
    <div className='wrapper'>
      <div className='container'>
        <div className='inputDiv'>
          <input type='number' onChange={onChange} />
          <button
            className='search'
            onClick={() => {
              handleClick();
            }}
          >
            Search
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Year</th>
            </tr>
          </thead>
          {isOpen ? (
            <tbody>
              {products.data?.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => setModal(product.pantone_value)}
                  style={{ backgroundColor: `${product.color}` }}
                >
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.year}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr style={{ backgroundColor: `${product?.color}` }}>
                <td>{product?.id}</td>
                <td>{product?.name}</td>
                <td>{product?.year}</td>
              </tr>
            </tbody>
          )}
        </table>
        {isOpen ? (
          <div className='Buttons'>
            <span className='modal'>Modal: {modal}</span>
            <span className='page'>page: {products.page}</span>
            <button onClick={() => setCurrentPage(1)}>Prev</button>
            <button onClick={() => setCurrentPage(2)}>Next</button>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='error'>{error}</div>
    </div>
  );
};
export default App;
