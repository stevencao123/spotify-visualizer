import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const CLIENT_ID = "f21fd390cb134a52a86ba1d1825f437b"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RES_TYPE = "token"
  
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [artists, setArtists] = useState([])

  // saving token onto window local storage
  useEffect(()=>{
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash){
      token = hash.substring(1).split("&").find(e => e.startsWith("access_token")).split("=")[1]

      window.location.hash=""
      window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  // logout button
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey, 
        type: "artist"
      }
    })

    setArtists(data.artists.items)
    console.log(data)
  }

  const renderArtists = () => {
    return artists.map(artist => (
      <div key={artist.id}>
        {artist.images.length ? <img width={"200px"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
        {artist.name}
      </div>
    ))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify Visualizer</h1>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RES_TYPE}`}>Login to Spotify</a>
        : <button onClick={logout}>Logout</button>}

        {token ?
          <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"}>Search</button>
          </form>
          
          : <h2>Login to search</h2>
        }

        {renderArtists()}
      </header>
    </div>
  );
}

export default App;
