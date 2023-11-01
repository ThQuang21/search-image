import React from 'react'
import { useState, useEffect } from 'react';
import loader from './loader-loading.gif'
const clientID = `?client_id=00QvB13AshJSuzmDL3PM3Gyc7FB8oOzqxFxSE53mh18`;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [finalSearch, setFinalSearch] = useState('')
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const fetchImages = async () => {
    setIsLoading(true);
    let url = `https://api.unsplash.com/search/photos/${clientID}&page=${page}&query=${finalSearch}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (searchText && page === 1) {
          return data.results;
        } else if (searchText) {
          return [...oldPhotos, ...data.results];
        } else {
          return [];
        }
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
    }, [page, finalSearch]);

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if (
        (!isLoading && window.innerHeight + window.scrollY) >=
        document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });
    return () => window.removeEventListener('scroll', event);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFinalSearch(searchText)
    setPage(1);
  };
  return (
    <main>
      <div className='search'>
        <form className='search-form'>
          <input
            type='text'
            placeholder='search keyword'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className='form-input'
          />
          <button type='submit' className='submit-btn' onClick={handleSubmit}>
            Search
          </button>

        </form>
      </div>

      <div id='gallery'>
        {photos.map(url => <img src={url.urls['small']} alt="picture"></img>)}
      </div>

      {isLoading ? 
        <div className='loader'><img src={loader}></img></div>
       : "" }
    </main>
  );
}
