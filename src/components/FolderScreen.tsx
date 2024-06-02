import { useContext, useEffect, useState } from "react"
import Modal from 'react-modal'
import Item from "./Item";
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from "react-router-dom";
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

const FolderScreen = () => {
    const location = useLocation()
    const { items, setItemsList } = useContext<ItemsContextType | undefined>(ItemsContext);

    const [itemModalShown, setItemModalShown] = useState(false)


    const closeModal = () => {
        setItemModalShown(false)
    }

    const [itemType, setItemType] = useState<"file" | "folder">("file")
    const [itemName, setItemName] = useState("")
    const [error, setError] = useState(false)

    const getItems = () => {
        const items = localStorage.getItem("directories")
        const id = location.pathname.split("/").pop()

        if (!items) {
            setItemsList([{
                type: "add",
                displayName: "",
                id: "add"
            }])
            return
        }
        const parsedItems = JSON.parse(items)
        setItemsList([...parsedItems.find(item => item.id === id).items, {
            type: "add",
            displayName: "",
            id: "add"
        }])

    }

    const addItem = () => {
        const itemId = uuidv4()
        setItemsList([{
            type: itemType,
            displayName: itemName,
            id: itemId
        }, ...items])

        const directories = localStorage.getItem("directories")
        const id = window.location.pathname.split("/").pop()

        if (directories) {
            let parsedDirectories = JSON.parse(directories)
            const idx = parsedDirectories.findIndex(item => item.id === id)
            parsedDirectories[idx].items = [...parsedDirectories[idx].items, {
                type: itemType,
                displayName: itemName,
                id: itemId
            }]
            if (itemType === "file") {

                localStorage.setItem("directories", JSON.stringify(parsedDirectories))
            } else {
                localStorage.setItem("directories", JSON.stringify([...parsedDirectories, {
                    id: itemId,
                    name: itemName,
                    items: []
                }]))
            }
        }

        setItemType("file")
        setItemName("")
        setItemModalShown(false)
    }

    useEffect(() => getItems(), [location]);



    return (
        <div>

            <div className="holder">

                {
                    items.map((item, index: number) => <Item displayName={item.displayName} setItemModalShown={setItemModalShown} type={item.type}
                        id={item.id} key={index.toString()}
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
                                //console.log(items.length !== 1 && items.filter(item => item.displayName === e.target.value && item.type !== "add").length > 0)
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

export default FolderScreen
