import { createContext, useState, FC, ReactNode, useRef } from 'react';

export interface Items {
    type: "file" | "folder" | "add",
    displayName: string,
    id: string,
}

export interface ItemsContextType {
    items: Items[],
    setItemsList: (item: Items[]) => void,
    addItems: (items: Items) => void,
    editItems: (item: Items, index: number) => void,
    searchItems: (val: string) => void,
}


export const ItemsContext = createContext<ItemsContextType | undefined>(undefined)


export const ItemsProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [items, setItems] = useState<Items[]>([])
    const itemsRef = useRef<Items[]>([])
    const setItemsList = (items: Items[]) => {
        setItems(items)
        itemsRef.current = items
    }

    const addItems = (item: Items) => {
        setItems([item, ...items])
    }

    const editItems = (item: Items, index: number) => {

        const directories = localStorage.getItem("directories")
        const id = window.location.pathname.split("/").pop()
        setItems(prevItems => prevItems.map((itm, idx) => {
            if (idx === index) return item
            return itm
        }))

        itemsRef.current = itemsRef.current.map((itm, idx) => {
            if (idx === index) return item
            return itm
        })

        if (directories) {
            let parsedDirectories = JSON.parse(directories)
            const idx = parsedDirectories.findIndex(item => item.id === id)
            parsedDirectories[idx].items[index] = {
                ...parsedDirectories[idx].items[index],
                ...item
            }

            localStorage.setItem("directories", JSON.stringify(parsedDirectories))
        }
    }

    const searchItems = (val: string) => {
        if (val === '') setItems(itemsRef.current)
        else setItems(items.filter((item) => item.displayName.toLowerCase().includes(val.toLowerCase())))
    }

    return (
        <ItemsContext.Provider value={{ items, setItemsList, addItems, editItems, searchItems }}>
            {children}
        </ItemsContext.Provider>
    )


}