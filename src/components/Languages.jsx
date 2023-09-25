import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import context from '../context/context';
import languagesjson from './Languages';

const Languages = () => {
  const a = useContext(context);
  const getlanguages = a.getlanguages;
  const languages = a.languages;
  const addlanguage = a.addlanguage;
  const dellanguage = a.dellanguage;

  useEffect(() => {
    getlanguages();
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });
  const handleDelete = (id) => {
    dellanguage({ id });
  };

  const handleAddPlan = () => {
    setFormData({
      name: '',
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormSubmit = () => {
    addlanguage(formData)
  };

  const getnamefromcode = (value) => {
    const language = languagesjson.filter((lang) => lang.language === value);
    return language.length > 0 ? language[0].name : '';
  };

  return (
    <div className='container'>
      <h1 className="my-3 text-center">All Languages</h1>
      <div style={{ marginLeft: 0 }} onClick={handleAddPlan} className="mb-3 btn loadmore">
        Add Language
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Languages</th>
          </tr>
        </thead>
        <tbody>
          {languages?.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.name}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(plan._id)}
                  style={{ marginRight: '5px' }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} backdrop="static" onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Language</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Name</Form.Label>
              <select
                 onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex;
                  const selectedOption = e.target.options[selectedIndex];
                  const langname = selectedOption.getAttribute("data-langname");
              
                  setFormData({
                    language: e.target.value,
                    name: langname,
                  });
                }}
                className='form-select'>
                  <option value="" defaultChecked>Select A language</option>
                {
                  languagesjson.map((elem,index) => {
                    return <option key={index} data-langname={elem.name} value={elem.language}>{elem.name}</option>
                  })
                }
              </select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            ADD
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Languages;
