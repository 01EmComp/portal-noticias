import { useEffect, useState } from "react";

const Weather = () => {
  const [temp, setTemp] = useState(null);

  useEffect(() => {
    const apiKey = "3cc382c60649446da01174302250212";

    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Rio Pomba`
    )
      .then((res) => res.json())
      .then((data) => {
        setTemp(Math.round(data.current.temp_c));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {temp !== null ? <p>{temp}°C</p> : <p>Carregando temperatura...</p>}
    </div>
  );
};

export default Weather;
