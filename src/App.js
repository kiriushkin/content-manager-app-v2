import { useEffect, useState } from 'react';
import Loader from './Loader.jsx';
import Nav from './Components/Nav/Nav.jsx';
import TS_Generator from './Components/TS-Generator/TS-Generator.jsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading, setIsLoading]);

  return <div className="App">{isLoading ? <Loader /> : <Rest />}</div>;
}

const Rest = () => {
  return (
    <>
      <Nav />
      <TS_Generator />
    </>
  );
};

export default App;
