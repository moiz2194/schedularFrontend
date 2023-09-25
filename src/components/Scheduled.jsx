import React, { useContext, useEffect, useState } from 'react'
import context from '../context/context'
import './home.css'
import { Button, Form, Modal } from 'react-bootstrap';
import axios from '../context/axios';
// import languages from './Languages';
import "../styles/scheduled.css"
const Home = () => {
    const a = useContext(context);
    const languages = a.languages;
    const getlanguages = a.getlanguages;
    const getallnotifications = a.getschedulednotifications;
    const notifications = a.schedulenotifications;
    const deletenotification = a.deletenotification
    const hasMore = a.hasMore
    const getmorenotifications = a.getmoreschedulednotifications;
    const [limit, setlimit] = useState(0)
    const [developer, setdeveloper] = useState(false)
    useEffect(() => {
        getallnotifications(limit)
        getlanguages()
    }, [])
    function formatTime(createdAt) {
        const date = new Date(createdAt);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let amOrPm = hours >= 12 ? 'pm' : 'am';

        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12;

        // Add leading zeros to minutes if necessary
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${amOrPm}`;
    }
    function formatDate(createdAt) {
        const date = new Date(createdAt);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Add leading zeros to month and day if necessary
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        return `${year}-${month}-${day}`;
    }
    const fetchMoreData = () => {
        const newlimit = limit + 10
        setlimit(newlimit)
        getmorenotifications(newlimit)
    }
    //   Modal
    const [showModal, setshowModal] = useState(false);
    const [id, setid] = useState(null)
    const handleShowModal = (data) => {
        setFormData({
            type: data.data.type,
            image: data.data.image,
            link: data.data.link,
        })
        setid(data._id)
        // setbodies(data.bodies);
        setpriority(data.priority);
        const newbody = data.bodies
        // Add TOpics
        const updatedNewBody = newbody.map((currentelement) => {
            console.log("Selected", selectedlanguages)
            if (currentelement.name !== "en" && !selectedlanguages.includes(currentelement.name)) {
                setselectedlanguages((prev) => [...prev, currentelement.name]);
            }

            const filteredTopics = topics.filter((topic) =>
                topic.Languages.includes(currentelement.name)
            );
            console.log(filteredTopics);

            // Add filteredTopics to the currentelement object
            return {
                ...currentelement,
                topicsoptions: filteredTopics,
            };
        });
        // Set the updated newbody array with filteredTopics back to state
        console.log(updatedNewBody);
        setbodies(updatedNewBody);
        setshowModal(true)
    }
    const handleCloseModal = () => {
        setbodies([])
        setselectedlanguages([])
        console.log("runned")
        setshowModal(false)
    }
    const gettopics = a.gettopics;
    const topics = a.topics;
    const [loading, setloading] = useState(false)
    useEffect(() => {
        const gettopicsfunc = async () => {
            setloading(true)
            await gettopics();
            setloading(false)
        };
        gettopicsfunc()
    }, []);
    useEffect(() => {
        gettopicbylanguage('en');
    }, [topics])

    const gettopicbylanguage = (language) => {
        const filteredTopics = topics.filter((topic) =>
            topic.Languages.includes(language)
        );
        console.log(filteredTopics);
        const updatedBodies = bodies.map((body) => {
            if (body.name === language) {
                return {
                    ...body,
                    topicsoptions: filteredTopics,
                    to: filteredTopics[0]?.topic
                };
            }
            return body;
        });
        setbodies(updatedBodies);
    }
    const [formData, setFormData] = useState({
        type: 1,
        image: '',
        link: '',
    });
    const [bodies, setbodies] = useState([{
        "name": "en",
        "title": "",
        "body": "",
        "to": "",
        "topicsoptions": []
    }])
    const [priority, setpriority] = useState("high");
    const [selectedlanguages, setselectedlanguages] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // Languages
    const handleLanguageCheckboxChange = async (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add language to selected languages
            setselectedlanguages((prev) => [...prev, value]);
            const english_title = bodies.find((body) => body.name === "en")?.title || ''
            const english_body = bodies.find((body) => body.name === "en")?.body || ''
            let title = ""
            let body = ""
            if (english_title === '' || english_body === '') {
            } else {
                title = await translateText(english_title, value)
                body = await translateText(english_body, value)
            }
            const newbody = [...bodies, { name: value, title, body }]
            // Add TOpics
            const filteredTopics = topics.filter((topic) =>
                topic.Languages.includes(value)
            );
            console.log(filteredTopics);
            const updatedBodies = newbody.map((body) => {
                if (body.name === value) {
                    return {
                        ...body,
                        topicsoptions: filteredTopics,
                        to: filteredTopics[0]?.topic
                    };
                }
                return body;
            });
            console.log(updatedBodies)
            setbodies(updatedBodies);
        } else {
            setselectedlanguages((prev) => prev.filter((lang) => lang !== value));
            setbodies((prev) => prev.filter((lang) => lang.name !== value));
            console.log(`Language deselected: ${value}`);
        }
    };
    // 
    const translateText = async (text, targetLanguage) => {
        const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        const data = {
            q: text,
            target: targetLanguage,
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            console.log(json.data.translations[0].translatedText);
            return json.data.translations[0].translatedText;
        } catch (error) {
            return "error";
        }
    };

    // 
    const handlebodychange = (event) => {
        let { name, value } = event.target;
        const { language } = event.target.dataset;
        console.log(language);
        if (value.topic) {
            value = value.topic
        }
        // Update bodies array
        setbodies((prev) =>
            prev.map((body) =>
                body.name === language ? { ...body, [name]: value } : body
            )
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let link = '';
            let inputbody;
            link = "editschedulenotification"
            inputbody = { id, data: formData, priority, schedule: true, bodies }
            await axios.post(`/api/admin/${link}`, inputbody);
            // Notification successfully added
            alert("Successfully Sent!")
        } catch (error) {
            console.error('Error adding notification:', error);
            alert(error.message)
        }
    };
    const getnamefromcode = (value) => {
        const language = languages.filter((lang) => lang.language === value);
        return language.length > 0 ? language[0].name : '';
    };

    // Preview
    const [showModal2, setshowModal2] = useState(false)
    // 
    function convertTo12HourFormat(time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const time12 = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
        return time12;
    }
    return (
        <div className='container'>
            <h2 className=' text-center my-4'>Notications Scheduled</h2>
            <div className='table-responsive'>
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Time</th>
                                <th scope="col">Date</th>
                                <th scope="col">Scheduled Time</th>
                                <th scope="col">Scheduled Date</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                notifications?.length !== 0 && notifications?.map((user) => {
                                    return <tr>
                                        <td>
                                            <div>{user?.serial ? user.serial : "Not given"}</div>
                                        </td>
                                        <td>
                                            {
                                                user.bodies && <div>{user?.bodies[0].title ? user?.bodies[0].title : "Not given"}</div>
                                            }
                                        </td>
                                        <td>
                                            <div>{user?.createdAt ? formatDate(user.createdAt) : "Not given"}</div>
                                        </td>
                                        <td>
                                            <div>{user?.createdAt ? formatTime(user.createdAt) : "Not given"}</div>
                                        </td>
                                        <td>
                                            <div>{user?.schedule_time ? convertTo12HourFormat(user.schedule_time) : "Not given"}</div>
                                        </td>
                                        <td>
                                            <div>{user?.schedule_date ? user.schedule_date : "Not given"}</div>
                                        </td>
                                        <td>
                                            <div onClick={() => deletenotification({ id: user._id })} className='btn btn-danger'>Delete</div>
                                            <div onClick={() => handleShowModal(user)} className='btn btn-info mx-2'>Edit</div>
                                        </td>
                                    </tr>

                                })
                            }

                        </tbody>
                    </table>
                    <div style={{ width: "100%" }}>
                        {
                            hasMore ? <div onClick={() => {
                                console.log("load more")
                                fetchMoreData()
                            }} className="loadmore btn my-3">Load More</div>
                                : ""
                        }
                    </div>
                </>

            </div>
            <Modal show={showModal} backdrop="static" onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className='container my-4'>
                        {loading ? 'Loading...' :
                            <form className='schedule-form' onSubmit={handleSubmit}>
                                <h2 className='text-center'>Add Notification</h2>
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">
                                        Type
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        Image
                                    </label>
                                    <div className='d-flex'>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                        />
                                        <div className="btn loadmore mx-3" onClick={() => setshowModal2(true)}>
                                            Preview
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="link" className="form-label">
                                        Link
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="link"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="priority" className="form-label">
                                        Priority
                                    </label>
                                    <select
                                        className="form-select"
                                        id="priority"
                                        name="priority"
                                        value={priority}
                                        onChange={(e) => setpriority(e.target.value)}
                                    >
                                        <option value="high">high</option>
                                        <option value="normal">normal</option>
                                    </select>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value={developer} onChange={(e) => {
                                        setdeveloper(e.target.checked)
                                        if (e.target.checked) {
                                            const updatedNewBody = bodies.map((currentelement) => {
                                                return {
                                                    ...currentelement,
                                                    to: "/topics/developer",
                                                    topicsoptions: [{ topic: "/topics/developer" }, ...currentelement.topicsoptions]
                                                };
                                            });
                                            setbodies(updatedNewBody);
                                        } else {
                                            const updatedNewBody = bodies.map((currentelement) => {
                                                const newtopic = currentelement.topicsoptions.filter((topic) => topic.topic !== "/topics/developer")
                                                return {
                                                    ...currentelement,
                                                    topicsoptions: newtopic,
                                                };
                                            });
                                            setbodies(updatedNewBody);
                                        }
                                    }} />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Developer
                                    </label>
                                </div>
                                <div className="mb-3 options">
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
                                                            checked={selectedlanguages?.includes(language.language)}
                                                            onChange={handleLanguageCheckboxChange}
                                                        />
                                                        {language.name}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <h2>English</h2>
                                <div className="mb-3">
                                    <label htmlFor="to" className="form-label">
                                        Topic
                                    </label>
                                    <select
                                        value={
                                            bodies.find((body) => body.name === "en")?.to || ""
                                        }
                                        name="to" data-language={'en'}
                                        onChange={handlebodychange} className='form-select'>
                                        {
                                            bodies.find((body) => body.name === "en")?.topicsoptions?.map((elem) => {
                                                return <option className={bodies.find((body) => body.name === "en")?.to === elem.topic ? "true" : "false"} value={elem.topic}>{elem.topic}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={bodies.find((body) => body.name === "en")?.title || ''}
                                        onChange={handlebodychange}
                                        data-language={"en"}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label onClick={() => console.log(bodies)} htmlFor="body" className="form-label">
                                        Body
                                    </label>
                                    <textarea
                                        className="form-control"
                                        name="body"
                                        data-language={"en"}
                                        value={bodies.find((body) => body.name === "en")?.body || ''}
                                        onChange={handlebodychange}
                                        rows={10}
                                    ></textarea>
                                </div>
                                {
                                    selectedlanguages.length !== 0 && selectedlanguages.map((language) => {
                                        return <>
                                            <h2>{getnamefromcode(language)} <span onClick={() => {
                                                setselectedlanguages((prev) => prev.filter((lang) => lang !== language));
                                                setbodies((prev) => prev.filter((lang) => lang.name !== language));
                                            }} className="delete pointer" style={{ fontSize: "22px", color: "red" }}>✖</span></h2>
                                            <div className="mb-3">
                                                <label htmlFor="to" className="form-label">
                                                    Topic
                                                </label>
                                                <select
                                                    data-language={language}
                                                    onChange={handlebodychange}
                                                    name="to"
                                                    className="form-select"
                                                    value={
                                                        bodies.find((body) => body.name === language)?.to || ""
                                                    }
                                                >
                                                    {bodies
                                                        .find((body) => body.name === language)
                                                        ?.topicsoptions?.map((elem) => {
                                                            return (
                                                                <option
                                                                    key={elem.topic} // Make sure to add a unique key
                                                                    value={elem.topic}
                                                                >
                                                                    {elem.topic}
                                                                </option>
                                                            );
                                                        })}
                                                </select>

                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="title" className="form-label">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    data-language={language}
                                                    value={bodies.find((body) => body.name === language)?.title || ''}
                                                    onChange={handlebodychange}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="body" className="form-label">
                                                    Body
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="body"
                                                    data-language={language}
                                                    value={bodies.find((body) => body.name === language)?.body || ''}
                                                    onChange={handlebodychange}
                                                    rows={10}
                                                ></textarea>
                                            </div>
                                        </>
                                    })
                                }

                                <button type="submit" className="schedule-btn loadmore btn" >
                                    Submit
                                </button>
                            </form>
                        }

                    </div>

                    <Modal show={showModal2} backdrop="static" onHide={() => setshowModal2(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Preview Image</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <img width={200} src={formData.image} alt="Link is expired" />
                        </Modal.Body>
                    </Modal>
                </Modal.Body>
            </Modal>
        </div>


    )
}

export default Home