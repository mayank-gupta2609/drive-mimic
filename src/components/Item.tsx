import { useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ItemsContext, ItemsContextType } from "./Hooks/ItemsContext"
type ItemProps = {
  type: "file" | "folder" | "add",
  displayName: string,
  setItemModalShown: (val: boolean) => void,
  id: string,
  index: number
}


const itemContainerStyles = {
  width: "100px",
  height: "100px",
  display: "flex",
  flexDirection: "column",
  fontSize: 30,
  border: "1px solid grey",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 5,
  borderStyle: "dashed",
  cursor: "pointer",
  position: "relative"
}

const itemIconStyles = { height: 70, width: 100, alignItems: "center", justifyContent: "center", display: "flex" }
const displayNameStyles = { height: 20, fontSize: 14, width: 100, textOverflow: "ellipsis", display: "flex", justifyContent: "center" }
const editIconStyles = {
  position: "absolute",
  top: 5,
  right: 5,
  fontSize: 15,
  zIndex: 10
}

const Item = (props: ItemProps) => {
  const { type, displayName, setItemModalShown, id, index } = props
  const [editEnabled, setEditEnabled] = useState(false)
  const [displayCardName, setDisplayCardName] = useState(displayName)
  const textInputRef = useRef<HTMLInputElement | null>(null)
  const { editItems } = useContext<ItemsContextType | undefined>(ItemsContext);

  const editDisplayName = (e) => {
    e.preventDefault()
    editItems({
      type: type,
      displayName: displayCardName,
    }, index)
    setEditEnabled(false)
  }


  if (type === "add") {
    return <div style={itemContainerStyles} onClick={() => setItemModalShown(true)} >
      <i className="fa-solid fa-plus"></i>
    </div>
  } else {
    return <div style={itemContainerStyles}

    >
      <div style={editIconStyles} onClick={() => {
        setEditEnabled(true)
        textInputRef.current?.focus()
      }}>
        <i className="fa-solid fa-pen-to-square"></i>
      </div>
      {type === "folder" ? <div >
        <Link to={`${window.location.pathname === "/" ? `${window.location.pathname}${id}` : `${window.location.pathname}/${id}`}`} style={{ textDecoration: 'none', color: "black" }}
        >

          <div style={itemIconStyles}>

            <i className={`fa-solid fa-folder`}></i>
          </div>
        </Link>
        <div style={displayNameStyles}>
          {editEnabled ?
            <form onSubmit={editDisplayName}>
              <input type="text" value={displayCardName} ref={textInputRef}
                onChange={(e) => setDisplayCardName(e.target.value)}
                style={{ height: 20, backgroundColor: "transparent", textAlign: "center" }}
              />
            </form>
            : displayName}
        </div>
      </div> : <>
        <div style={itemIconStyles}>

          <i className={`fa-solid fa-file`}></i>
        </div>
        <div style={displayNameStyles}>
          {editEnabled ? <form onSubmit={editDisplayName}>
            <input type="text" value={displayCardName} ref={textInputRef}
              onChange={(e) => setDisplayCardName(e.target.value)}
              style={{ height: 20, backgroundColor: "transparent", textAlign: "center" }}
            />
          </form> : displayName}
        </div>
      </>}
    </div>
  }
}

export default Item