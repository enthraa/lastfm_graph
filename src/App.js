import { useState, useCallback, useRef } from "react";
import { TreeMap } from "@nivo/treemap";
import "./App.css";
import axios from "axios";
import html2canvas from "html2canvas";

function App() {
  const [user, setUser] = useState("");
  const [period, setPeriod] = useState("7day");
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [albumFilter, setAlbumFilter] = useState(0);
  const [artistFilter, setArtistFilter] = useState(0);
  const chartRef = useRef(null);
  

  const handleInputChange = (event) => {
    setUser(event.target.value);
  };

  const handleInputChangePeriod = (event) => {
    setPeriod(event.target.value);
  };

  const handleAlbumFilterChange = useCallback((event) => {
    setAlbumFilter(parseInt(event.target.value));
  }, []);

  const handleArtistFilterChange = useCallback((event) => {
    setArtistFilter(parseInt(event.target.value));
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiKey = "5bc467254dfddfdfd794e2642b8097ce";

      const getTopAlbums = async (user, period, page) => {
        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&api_key=${apiKey}&period=${period}&limit=1000&page=${page}&format=json`
        );
        return response.data;
      };

      const response1 = await getTopAlbums(user, period);
      const predata = response1.topalbums;

      const totalPages = predata["@attr"].totalPages;
      const requests = [];

      for (let page = 1; page <= totalPages; page++) {
        const request = getTopAlbums(user, period, page);
        requests.push(request);
      }

      const responses = await Promise.all(requests);
      const albumsByArtist = {};

      for (const response of responses) {
        const data = response.topalbums;

        for (let index = 0; index < data.album.length; index++) {
          const artist = data.album[index].artist.name;
          const name = data.album[index].name;
          const playcount = data.album[index].playcount;

          if (playcount > albumFilter) {
            if (!albumsByArtist[artist]) {
              albumsByArtist[artist] = {
                name: artist,
                totalPlaycount: 0,
                children: [],
              };
            }

            albumsByArtist[artist].totalPlaycount += playcount;

            albumsByArtist[artist].children.push({
              name: name,
              value: playcount,
            });
          }
        }
      }

      const filteredAlbums = Object.values(albumsByArtist).filter(
        (artist) => artist.totalPlaycount > artistFilter
      );

      setAlbums(filteredAlbums);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [user, period, albumFilter, artistFilter]);

  const hasValidData = albums.length > 0;

  const captureChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current)
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL();
          link.download = "treemap.png";
          link.click();
        })
        .catch((error) => {
          console.log("Une erreur s'est produite lors de la capture du graphique :", error);
        });
    }
  };

  return (
    <div className="App">

    <div className="Recherche">
      <input
        type="text"
        placeholder="Enter Username"
        value={user}
        onChange={handleInputChange}
      />
      <select value={period} onChange={handleInputChangePeriod}>
        <option value="7day">Last 7 days</option>
        <option value="1month">Last 1 month</option>
        <option value="3month">Last 3 months</option>
        <option value="6month">Last 6 months</option>
      </select>

      <label>Display text</label>
      <input
        type="checkbox"
        checked={showLabels}
        onChange={() => setShowLabels(!showLabels)}
      /><br />

      <label>Minimum scrobbles album :</label>
      <input
        type="number"
        min="0"
        value={albumFilter}
        onChange={handleAlbumFilterChange}
      />

      <label>Minimum scrobbles artist :</label>
      <input
        type="number"
        min="0"
        value={artistFilter}
        onChange={handleArtistFilterChange}
      /><br />

        <button onClick={handleSearch}>Generate</button>
    </div>

    <div className="result">
        <div style={{ width: "100%", height: "1000px" }} ref={chartRef}>
          {/* Affiche le message de chargement lorsque isLoading est vrai */}
          {isLoading ? (
            <div className="loader">Loading...</div>
          ) : hasValidData ? (
            // Affiche le graphe s'il y a des données valides
            <TreeMap
              data={{
                name: user,
                children: albums,
              }}
              identity="name"
              value="value"
              label={showLabels ? (node) => `${node.data.name}: ${node.data.value}` : false}
              innerPadding={3}
              width={1000}
              height={1000}
              />
              ) : null /* Si ni isLoading ni hasValidData ne sont vrais, n'affiche rien */}
            </div>
          </div>
          {hasValidData && <button onClick={captureChart}>Download png</button>}
        </div>
  );
}

export default App;
