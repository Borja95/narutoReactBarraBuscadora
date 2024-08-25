import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Viewer from 'react-viewer';

function App() {

  const urlApi = "https://narutodb.xyz/api/character?page=1&limit=1431";

  const [catalogoPersonajes, setCatalogoPersonajes] = useState([]);
  const [personajes, setPersonajes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [imagenSeleccionada, setImagenSeleccionada] = useState('')
  const [estaAbierto, setEstaAbierto] = useState(false)


  const getPersonajes = async () => {
    await axios.get(urlApi)
      .then(res => {
        console.log(res);
        setCatalogoPersonajes(res.data.characters);
        setPersonajes(res.data.characters);

      }).catch(err => {
        alert("Ocurrió un error al obtener los personajes");
      })

  }

  const handleChange=(e)=>{
    setBusqueda(e.target.value);
  }

  const buscarPersonaje = () => {

    if(catalogoPersonajes.length > 0){
      var busquedaActual = catalogoPersonajes.filter(
        (elemento )=>{
          var nombrePersonaje = elemento.name;

          if(nombrePersonaje.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(busqueda)){
            return elemento;
          }
        }
      );

      setPersonajes(busquedaActual);

    }

  }

  const mostrarVisualizadorImagenes =(urlImagen)=>{
    setEstaAbierto(!estaAbierto);
    setImagenSeleccionada(urlImagen);
  }


  useEffect(() => {
    getPersonajes();
  }, [])

  useEffect(() => {
    buscarPersonaje();
  }, [busqueda])

  return (
    <div className="App">
      <div className='container'>

        <nav className="navbar navbar-light bg-light p-3">

          <h4>Personajes de Naruto</h4>

          <form className="form-inline" >
            <input className="form-control" type="search" placeholder="Buscar Personaje" aria-label="Search" onChange={handleChange} />
          </form>
        </nav>


        <div className='table-responsive'>
          <table className='table table-sm'>
            <thead>
              <tr className='table-primary'>
                <th>#</th>
                <th>Nombre</th>
                <th>Sexo</th>
                <th>Origen</th>
                <th>Foto</th>
              </tr>
            </thead>
            <tbody>
              {personajes.map((personaje, index) => (

                <tr key={"fila" + index}>
                  <td>{index + 1}</td>
                  <td>{personaje.name}</td>
                  <td>{(personaje.personal != undefined && personaje.personal.sex != undefined) ? personaje.personal.sex : ""}</td>
                  <td>{(personaje.personal != undefined && personaje.personal.affiliation != undefined) ? personaje.personal.affiliation : ""}</td>
                  <td>{(personaje.images != undefined && personaje.images != undefined && personaje.images.length > 0) ?
                    <img src={personaje.images[0]} width={50} height={50} style={{ cursor: 'pointer' }} onClick={()=>mostrarVisualizadorImagenes(personaje.images[0])}/> : ""}</td>
                </tr>

              ))}

            </tbody>


          </table>
        </div>
      </div>

              {estaAbierto && (
                <Viewer 
                  visible={estaAbierto}
                  onClose={() => setEstaAbierto(false)}
                  images={[{ src : imagenSeleccionada }]}
                />
              )}

    </div>
  );
}

export default App;
