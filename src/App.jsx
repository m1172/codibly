import React, { useState, useEffect } from 'react';
import './style.css';
const App = () => {
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('currentPage') || 1
  );
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(localStorage.getItem('open') || 'true');
  const [error, setError] = useState('');

  const [data, setData] = useState({});

  useEffect(() => {
    const storedData = localStorage.getItem('data');

    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      fetch(`https://reqres.in/api/products?page=${currentPage}`)
        .then((response) => response.json())
        .then((response) => {
          setProducts(response.data);
        })
        .catch((e) => {
          setError(e);
        });
    }

    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);
  localStorage.setItem('open', isOpen);

  const onChange = (e) => {
    let value = e.target.value;
    setIsOpen('false');
    setData({ ...data, inputValue: value });
    if (value == '') {
      setIsOpen('true');
      setData({ ...data, product: '', inputValue: '' });
    }
  };

  const handleClick = () => {
    fetch(`https://reqres.in/api/products/${data.inputValue}`)
      .then((response) => response.json())
      .then((response) => {
        setData({ ...data, product: response.data });
      })
      .catch((e) => {
        setError(e);
      });
  };

  return (
    <div className='wrapper'>
      <div className='container'>
        <div className='inputDiv'>
          <input type='number' onChange={onChange} value={data.inputValue} />
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
          {isOpen == 'true' ? (
            <tbody>
              {products?.map((product) => (
                <tr
                  key={product.id}
                  onClick={() =>
                    setData({ ...data, modal: product.pantone_value })
                  }
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
              <tr style={{ backgroundColor: `${data.product?.color}` }}>
                <td>{data.product?.id}</td>
                <td>{data.product?.name}</td>
                <td>{data.product?.year}</td>
              </tr>
            </tbody>
          )}
        </table>
        {isOpen == 'true' ? (
          <div className='Buttons'>
            <span className='modal'>Modal: {data.modal}</span>
            <span className='page'>page: {currentPage}</span>
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
