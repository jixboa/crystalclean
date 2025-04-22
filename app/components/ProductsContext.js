"use client";

import { createContext, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export const ProductsContext = createContext({});

export function ProductsContextProvider({ children }) {
  const [selectedProducts, setSelectedProducts] = useLocalStorageState("cart", {
    defaultValue: [],
  });
  const [catToBeUpdated, setCatToBeUpdated] = useLocalStorageState("carts", {
    defaultValue: [],
  });
  const [userDetail, setUserDetail] = useState([]);

  const username = "Kwame";

  return (
    <ProductsContext.Provider
      value={{
        username,
        userDetail,
        setUserDetail,
        selectedProducts,
        setSelectedProducts,
        catToBeUpdated,
        setCatToBeUpdated,
      }}>
      {children}
    </ProductsContext.Provider>
  );
}
