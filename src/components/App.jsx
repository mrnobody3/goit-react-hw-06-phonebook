import { nanoid } from 'nanoid';
import { useState, useEffect, useRef, useCallback } from 'react';

import ContactForm from './ContactForm';
import Filter from './Filter';
import ContactList from './ContactList';

import s from './app.module.css';

const App = () => {
  const [contacts, setContacts] = useState([
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
    { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
  ]);
  const [filter, setFilter] = useState('');

  const firstTime = useRef(true);

  useEffect(() => {
    if (!firstTime.content) {
      const items = JSON.stringify(contacts);
      localStorage.setItem('contacts', items);
    }
  }, [contacts]);

  useEffect(() => {
    if (firstTime.current) {
      const data = JSON.parse(localStorage.getItem('contacts'));
      if (data?.length) {
        setContacts(data);
      }
      firstTime.current = false;
    }
  }, []);

  const handleChange = useCallback(
    e => {
      setFilter(e.target.value);
    },
    [setFilter]
  );

  const deleteContact = useCallback(
    id => {
      const filtered = contacts.filter(contact => contact.id !== id);
      setContacts(filtered);
    },
    [contacts]
  );

  const getFilteredContacts = useCallback(() => {
    if (!filter) {
      return contacts;
    }
    const filterToLover = filter.toLowerCase();
    const filteredContacts = contacts.filter(({ name }) => {
      const result = name.toLowerCase().includes(filterToLover);
      return result;
    });
    return filteredContacts;
  }, [contacts, filter]);

  const addContactBySubmit = useCallback(
    props => {
      const duplicate = contacts.find(contact => contact.name === props.name);
      if (duplicate) {
        alert(`${props.name} is already in books list`);
        return;
      }

      setContacts(prevState => {
        const { name, number } = props;
        const newContact = {
          id: nanoid(),
          name,
          number,
        };
        return [...prevState, newContact];
      });
    },
    [contacts]
  );

  return (
    <div className={s.container}>
      <h1 className={s.title}>Phonebook</h1>
      <ContactForm addContactBySubmit={addContactBySubmit} />
      <h2 className={s.title}>Contacts</h2>
      <Filter handleChange={handleChange} filter={filter} />
      <ContactList
        contacts={getFilteredContacts()}
        deleteContact={deleteContact}
      />
    </div>
  );
};

export default App;
