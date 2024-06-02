import { Routes, Route } from "react-router-dom";
import InitialScreen from './components/InitialScreen';
import Header from './components/Header';
import FolderScreen from './components/FolderScreen';
import { ItemsProvider } from './components/Hooks/ItemsContext';

const App = () => {

  return (
    <ItemsProvider>
      <div className='main-app'>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" Component={InitialScreen} />
            <Route path="/:folderId/*" Component={FolderScreen} />
          </Routes>
        </div>
      </div>
    </ItemsProvider>
  )
}

export default App