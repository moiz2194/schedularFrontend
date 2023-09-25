import React, { useContext, useEffect, useState } from 'react';
import context from '../context/context';
import Loading from '../components/Loading.jsx';
import { Modal, Button, Form } from 'react-bootstrap';

const Key = () => {
    const a = useContext(context);
    const updatekey = a.updatekey;
    const getkey = a.getkey;
    const key = a.key;
    const [loading, setloading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newKey, setNewKey] = useState('');

    useEffect(() => {
        const getdata = async () => {
            setloading(true);
            await getkey();
            setloading(false);
        };
        getdata();
    }, []);

    const handleUpdateKey = async () => {
        await updatekey({fcm:newKey});
        setShowModal(false);
    };

    return (
        <div className='container'>
            {loading ? <Loading /> : (
                <div>
                    <div className="card my-5">
                        <div className="card-body">
                            <h5 className="card-title">FCM Key</h5>
                            <p className="card-text">{key?.fcm}</p>
                            <div className='btn loadmore' onClick={() => setShowModal(true)}>Update Key</div>
                        </div>
                    </div>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update FCM Key</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="newKey">
                                    <Form.Label>New FCM Key</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter new FCM Key"
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className='btn loadmore' onClick={handleUpdateKey}>Save Changes</div>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default Key;
