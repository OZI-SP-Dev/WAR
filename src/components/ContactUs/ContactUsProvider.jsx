import React, { useState } from 'react';
import ContactUsModal from './ContactUsModal';

export const ContactUsContext = React.createContext();
export const ContactUsProvider = ({ children }) => {
  const [showContactUs, setShowContactUs] = useState(false);
  
  function hideContactUs() {
    setShowContactUs(false);
  }

  return (
    <ContactUsContext.Provider value={{ setShowContactUs }}>
      <ContactUsModal showContactUsModal={showContactUs} hideContactUs={hideContactUs} />
      {children}
    </ContactUsContext.Provider>
  )
}