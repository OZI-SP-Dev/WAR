import React, { useState, useEffect } from "react";
import { spWebContext } from "../../providers/SPWebContext";
import ContactUsModal from "./ContactUsModal";
import { UserContext } from "../../providers/UserProvider";

export const ContactUsContext = React.createContext();
export const ContactUsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [showContactUs, setShowContactUs] = useState(false);
  const [contactEmails, setContactEmails] = useState([
    "robert.porterfield.2@us.af.mil",
  ]);

  function hideContactUs() {
    setShowContactUs(false);
  }

  const getContacts = async () => {
    if (process.env.NODE_ENV === "development") {
      setLoading(false);
    } else {
      try {
        let contacts = await spWebContext.lists
          .getByTitle("Contacts")
          .items.get();
        let contactEmails = [];
        contacts.forEach((contact) => {
          contactEmails.push(contact.Title);
        });
        setContactEmails(contactEmails);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getContacts().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <UserContext.Consumer>
      {(user) => (
        <ContactUsContext.Provider value={{ setShowContactUs }}>
          {!loading && (
            <ContactUsModal
              showContactUsModal={showContactUs}
              hideContactUs={hideContactUs}
              contactEmails={contactEmails}
              loading={loading}
              user={user.Title}
            />
          )}
          {children}
        </ContactUsContext.Provider>
      )}
    </UserContext.Consumer>
  );
};
