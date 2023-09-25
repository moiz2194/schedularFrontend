import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import context from '../context/context';
import languagesjson from './Languages';

const Artist = () => {
    const a = useContext(context);
    const gettopics = a.gettopics;
    const languages = a.languages;
    const setlanguages = a.setlanguages;
    const getlanguages = a.getlanguages;
    const topics = a.topics;
    const deltopic = a.deltopic;
    const addtopic = a.addtopic;
    useEffect(() => {
        gettopics();
        let getdata = async () => {
            await getlanguages();
            const exists = languages.some((element) => element.name === "English");
            console.log(exists); // Log the result for debugging
            if (!exists) {
                setlanguages((prev) => [
                    ...prev,
                    { name: 'English', language: 'en' },
                ]);
            }
        }
        getdata()
    }, []);
    const getnamefromcode = (value) => {
        const language = languages.filter((lang) => lang.language === value);
        return language.length > 0 ? language[0].name : '';
    };

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        Languages: []
    });

    const handleDelete = (id) => {
        deltopic({ id });
    };

    const handleAddPlan = () => {
        setFormData({
            topic: '',
            Languages: []
        });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = () => {
        addtopic(formData)
    };
    const handleLanguageCheckboxChange = async (event) => {
        const { value, checked } = event.target;

        // Create a copy of the existing formData
        const updatedFormData = { ...formData };

        if (checked) {
            // Add the language to the Languages array
            updatedFormData.Languages.push(value);
        } else {
            // Remove the language from the Languages array
            updatedFormData.Languages = updatedFormData.Languages.filter(
                (lang) => lang !== value
            );
        }
        // Update the formData state with the modified Languages field
        setFormData(updatedFormData);
    };

    return (
        <div className='container'>
            <h1 className="my-3 text-center">All Topics</h1>
            <div style={{ marginLeft: 0 }} onClick={handleAddPlan} className="mb-3 btn loadmore">
                Add Topic
            </div>

            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Topic</th>
                        <th>Languages</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map((plan) => (
                        <tr key={plan._id}>
                            <td>{plan.topic}</td>
                            <td><ul>{plan.Languages.map((val) => {
                                return <li>{getnamefromcode(val)}</li>
                            })}</ul></td>
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
                    <Modal.Title>Add Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Topic</Form.Label>
                            <Form.Control
                                type="text"
                                name="topic"
                                value={formData.topic}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <div className="my-3 options">
                            {/*  */}
                            <div className="dropdown">
                                <button
                                    className="btn loadmore dropdown-toggle"
                                    type="button"
                                    id="languageDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Select Languages
                                </button>
                                <ul className="dropdown-menu alllanguages" aria-labelledby="languageDropdown">
                                    {languages?.map((language, index) => (
                                        <li
                                            key={index}>
                                            <label className="dropdown-item">
                                                <input
                                                    className='mx-2 pointer'
                                                    type="checkbox"
                                                    value={language.language}
                                                    checked={formData.Languages?.includes(language.language)}
                                                    onChange={handleLanguageCheckboxChange}
                                                />
                                                {language.name}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
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

export default Artist;
