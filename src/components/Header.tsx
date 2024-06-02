import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ItemsContext, ItemsContextType } from './Hooks/ItemsContext'

const Header = () => {
  const location = useLocation()
  const [path, setPath] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  const navigation = useNavigate()
  const { searchItems } = useContext<ItemsContextType | undefined>(ItemsContext);



  const getDirectoryNameFromId = (id: string) => {
    const directories = localStorage.getItem("directories")
    if (directories) {
      const parsedDirectories = JSON.parse(directories)
      const name = parsedDirectories.find((directory) => directory.id === id)?.name || ""
      return name;
    }
  }

  useEffect(() => {
    const url = location.pathname
    const ids = url.split("/")
    let names: string[] = []

    ids.map((id) => {
      const name = getDirectoryNameFromId(id)
      names.push(name)
    })
    names[0] = "Home"
    setPath(names.filter(name => name !== ""))
  }, [location.pathname])


  return (
    <div className='breadcrumb'>
      <div className='back-button'>
        <button className='button' disabled={location.pathname === '/'} onClick={() => {

          navigation(-1)
        }}>

          <i className="fa-solid fa-arrow-left"></i>
        </button>
      </div>
      <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: "flex" }}>

          {
            path?.map((name, index) => {
              return <div className='item' onClick={() => {
                if (index === 0) navigation("/")
                else navigation(index + 1 - path.length)
              }} key={index.toString()} >

                {index === path.length - 1 ? name : name + '/'}
              </div>
            })
          }
        </div>
        <div>
          <input type="text" value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchItems(e.target.value)
            }}
            placeholder='Search'
          />
        </div>
      </div>
    </div>
  )
}

export default Header
