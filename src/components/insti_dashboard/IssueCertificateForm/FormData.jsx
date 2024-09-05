import { createContext, useState, useContext } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    studentName: "", 
    course: "", 
    date: '',
    contact: "",    
    add: "",
    walletAddress: "",
  
  });

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => useContext(FormDataContext);
