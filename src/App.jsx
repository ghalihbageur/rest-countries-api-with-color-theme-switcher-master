import { useEffect, useState, createContext, useContext } from 'react';
import './App.css'
import {BrowserRouter, Routes, Route, Link, useParams} from 'react-router-dom';

const DataContext = createContext();

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch('../data.json');
      const responseJson = await response.json();
      setData(responseJson);
    }

    getData();
  }, [])
  
  return (
    <>
      <BrowserRouter>
        <DataContext.Provider value={data}>
          <Navbar />
          <div className="wrapper">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/detail/:name" element={<Detail />}></Route>
          </Routes>
          </div>
        </DataContext.Provider>
      </BrowserRouter>

    </>
  )
}

function Home() {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  function handleFilter(newFilter) {
    setFilter(newFilter);
  }

  function handleSearch(newSearch) {
    setSearch(newSearch);
  }
  
  return(
    <>
      <Filter onFilter={handleFilter} filter={filter} onSearch={handleSearch} search={search}/>
      <ListCountry filter={filter} search={search}/>
    </>
  )
}

function Detail () {
  return (
    <div className='detail-container'>
      <Link to="/" className='button'><ion-icon name="arrow-back-outline"></ion-icon> Back</Link>
      <CountryDetail />
    </div>
  )
}

function CountryDetail() {
  const datas = useContext(DataContext);
  const params = useParams();
  const name = decodeURIComponent(params.name);
  console.log(name);

  const detail = datas?.find(data => data.name === name)
  console.log(detail);

  if(!detail){
    return;
  }
  return (
    <div className='country-detail'>
      <div>
        <img src={detail.flags.png} alt="" />
      </div>
      <div className="detail-content">
          <h2 className='detail-title'>{detail.name}</h2>
          <div className='detail-column'>
            <ul className='detail-info'>
              {(detail.nativeName) ? (<li className='detail-text'><b>Native name:</b> {detail.nativeName} </li>) : ''}
              {(detail.population) ? (<li className='detail-text'><b>Population:</b> {detail.population} </li>) : ''}
              {(detail.region) ? (<li className='detail-text'><b>Region:</b> {detail.region} </li>) : ''}
              {(detail.subregion) ? (<li className='detail-text'><b>Sub Region:</b> {detail.subregion} </li>) : ''}
              {(detail.capital) ? (<li className='detail-text'><b>Capital:</b> {detail.capital} </li>) : ''}
            </ul>
            <ul className='detail-info'>
              {(detail.topLevelDomain) ? (<li className='detail-text'><b>Top Level Domain:</b> {detail.topLevelDomain} </li>) : ''}
              {(detail.currencies.name) ? (<li className='detail-text'><b>Currencies:</b> {detail.currencies.name} </li>) : ''}
              {(detail.languages) ? (<li className='detail-text'><b>Languages:</b> {detail.languages?.map((language, idx) => (language.name + ((detail.languages.length - 1 !== idx) ? ', ' : '')))}</li>) : ''}
            </ul>
          </div>
            {(detail.borders) ? 
            (
              <div className='border'>
                <p className='border-text'>Border Countries:</p> 
                <div className="border-list">
                  {detail.borders.map((border, index) => (<span key={index} className='border-item'>{border}</span>))}
                </div>
              </div>
            ) : ''}
            
      </div>
    </div>
  )
}

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem('mode') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    localStorage.setItem('mode', theme);
  },[theme])

  function handleDarkMode() {
    setTheme(theme === 'light'?'dark':'light');
  }

  return (
    <nav className="navbar">
      <div className="wrapper">
        <h1 className="title">Where in the world?</h1>
        {(theme === 'light')?
        (
        <button onClick={handleDarkMode} type='button' className="darkmode-button">
          <ion-icon name="moon-outline"></ion-icon>
          Dark Mode
        </button>
        ) : (
        <button onClick={handleDarkMode} type='button' className="darkmode-button">
          <ion-icon name="sunny-outline"></ion-icon>
          Light Mode
        </button>
        )}
      </div>
    </nav>
  )
}

function Filter({onFilter, search, onSearch, filter}) {
  return(
    <section className="filter">
      <div className='search-bar'>
        <input type="text" value={search} onChange={(e) => onSearch(e.target.value)} className='search-input' placeholder='Search for a country...'/>
        <ion-icon name="search-outline" className="search-icon"></ion-icon>
      </div>
      <Dropdown onFilter={onFilter} filter={filter}/>
    </section>
  )
}

function Dropdown({onFilter, filter}) {
  const [open, setOpen] = useState(true);

  function handleDropdown() {
    setOpen((open === true) ? false : true);
  }

  function handleFilter(filter){
    setOpen(true);
    onFilter(filter);
    document.querySelectorAll('.filter-item').forEach(item => (item.innerHTML === filter) ? (item.classList.add('active')) : (item.classList.remove('active')));
  }

  return(
    <div className='filter-dropdown' data-open={open}>
      <button onClick={handleDropdown} aria-expanded={(open)?'Dropdown closed':'Dropdown opened'} className='filter-button'>{filter ? filter : 'Filter by Region '}<ion-icon name="chevron-down-outline"></ion-icon></button>
      <div className='filter-menu'>
        <button className='filter-item' onClick={() => handleFilter('')}>All</button>
        <button className='filter-item' onClick={() => handleFilter('Africa')}>Africa</button>
        <button className='filter-item' onClick={() => handleFilter('Americas')}>Americas</button>
        <button className='filter-item' onClick={() => handleFilter('Asia')}>Asia</button>
        <button className='filter-item' onClick={() => handleFilter('Europe')}>Europe</button>
        <button className='filter-item' onClick={() => handleFilter('Oceania')}>Oceania</button>
      </div>
    </div>
  )
}

function ListCountry({filter, search}) {
  const datas = useContext(DataContext);

  return(
    <main className='card-list'>
      {datas?.filter(data => {
        const searchMatch = (data.name.toLowerCase().includes(search.toLowerCase()));
        const filterMatch = filter == '' || (data.region.toLowerCase() === filter.toLowerCase());
        return searchMatch && filterMatch;
      }).map(data => (
        <CountryCard image={data.flags.png} key={data.numericCode} name={data.name} population={data.population} capital={data.capital} region={data.region} />
      ))}
    </main>
  )  
}

function CountryCard({image, name, population, capital, region}) {
  return (
    <Link to={'/detail/'+encodeURIComponent(name)} className='card'>
      <img src={image} alt="" />
      <div className='card-content'>
        <h2 className='card-title'>{name}</h2>
        <ul className='card-info'>
          <li className='card-text'><b>Population:</b> {population}</li>
          <li className='card-text'><b>Region:</b> {region}</li>
          <li className='card-text'><b>Capital:</b> {capital}</li>
        </ul>
      </div>
    </Link>
  )
}

export default App
