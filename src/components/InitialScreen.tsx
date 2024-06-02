import { useContext, useEffect, useState } from "react"
import Modal from 'react-modal'
import Item from "./Item";
import { v4 as uuidv4 } from 'uuid';
import { Items, ItemsContext, ItemsContextType } from "./Hooks/ItemsContext";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: 350,
    borderRadius: 20,
    width: 400
  },
};

const InitialScreen = () => {

  const { items, setItemsList } = useContext<ItemsContextType | undefined>(ItemsContext);

  const [itemModalShown, setItemModalShown] = useState(false)

  const closeModal = () => {
    setItemModalShown(false)
  }


  const [itemType, setItemType] = useState<"file" | "folder">("file")
  const [itemName, setItemName] = useState("")
  const [error, setError] = useState(false)

  const getItems = () => {
    const items = localStorage.getItem("items")

    if (!items) {
      setItemsList([{
        type: "add",
        displayName: "",
        id: "add"
      }])
      return
    }
    const parsedItems = JSON.parse(items)
    setItemsList([...parsedItems, {
      type: "add",
      displayName: "",
      id: "add"
    }])

  }

  const addItem = () => {
    const id = uuidv4()
    setItemsList([{
      type: itemType,
      displayName: itemName,
      id
    }, ...items])
    setItemType("file")
    setItemName("")
    setItemModalShown(false)

    const directories = localStorage.getItem("directories")
    if (itemType === "folder") {
      if (directories) {
        const parsedDirectories = JSON.parse(directories)
        localStorage.setItem("directories", JSON.stringify([...parsedDirectories, {
          id: id,
          name: itemName,
          items: []
        }]))
      } else {
        localStorage.setItem("directories", JSON.stringify([{
          id: id,
          name: itemName,
          items: []
        }]))
      }

    }

    localStorage.setItem("items", JSON.stringify([{
      type: itemType,
      displayName: itemName,
      id
    }, ...items.slice(0, items.length - 1)]))

  }

  useEffect(() => {
    getItems()
  }, [])



  return (
    <div>

      <div className="holder">

        {
          items.map((item: Items, index: number) => <Item displayName={item.displayName} setItemModalShown={setItemModalShown} type={item.type}
            id={item.id}
            key={index.toString()}
            index={index}
          />)

        }
      </div>


      <Modal
        isOpen={itemModalShown}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ width: "100%", height: 40, borderBottom: "1px solid grey", textAlign: "center", fontSize: 20, display: "flex", justifyContent: "space-evenly", alignItems: "center", paddingBottom: 20 }}>
            Add File/Folder
            <i className="fa-solid fa-close" onClick={() => setItemModalShown(false)}></i>

          </div>

          <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
            <div style={{ width: "100%", height: "33%", display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
              <div onClick={() => {
                setItemType("file")
              }} style={{
                color: itemType === "file" ? "blue" : "black"
              }}>File</div>
              <div onClick={() => {
                setItemType("folder")
              }} style={{
                color: itemType === "folder" ? "blue" : "black"
              }}>Folder</div>
            </div>
            <div style={{ width: "100%", height: "33%" }}>
              <input type="text" value={itemName} onChange={(e) => {
                if (items.length !== 1 && items.filter(item => item.displayName === e.target.value && item.type !== "add").length > 0) {
                  setError(true)
                } else setError(false)
                setItemName(e.target.value)
              }}
                placeholder={`Enter ${itemType} name`}
              />
            </div>
            <div style={{ width: "100%", height: "33%" }}>
              {
                error && <div style={{ width: "100%", color: "red" }}>
                  Item with this name already exists
                </div>
              }
              <button style={{
                width: "100%",
                backgroundColor: (error || itemName === "") ? "grey" : "blue",
                color: "white", border: "none", height: 40,
                borderRadius: 10,
                cursor: itemName === "" ? "not-allowed" : "pointer"
              }} disabled={error || itemName === ""}
                onClick={addItem}

              >Done</button>
            </div>
          </div>
        </div>
      </Modal>




    </div>
  )
}

export default InitialScreen
