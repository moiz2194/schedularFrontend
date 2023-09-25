import React, { useContext, useEffect, useState } from 'react';
import axios from '../context/axios';
import "./home.css"
import languagesjson from './Languages';
import { Modal } from 'react-bootstrap';
import context from '../context/context';
import { Stack, TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import Loading from './Loading';
const Home = () => {
  const a = useContext(context);
  const gettopics = a.gettopics;
  const topics = a.topics;
  const [loading, setloading] = useState(false)
  const languages = a.languages;
  const getlanguages = a.getlanguages;
  const [developer, setdeveloper] = useState(false)
  useEffect(() => {
    const gettopicsfunc = async () => {
      setloading(true)
      await gettopics();
      await getlanguages();
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
  const [schedule, setschedule] = useState(false);
  const [schedule_time, setschedule_time] = useState("");
  const [schedule_date, setschedule_date] = useState(null);
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
      // setbodies(newbody);
      console.log(updatedBodies)
      setbodies(updatedBodies);
    } else {
      // Remove language from selected languages
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
    if (value.topic) {
      value = value.topic
    }
    console.log(language)
    // Update bodies array
    setbodies((prev) =>
      prev.map((body) =>
        body.name === language ? { ...body, [name]: value } : body
      )
    );
    console.log(bodies)
  };

  const formatDate = (date) => {
    // Format the date as "dd/MM/yyyy"
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Ensure two-digit formatting for hours and minutes
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let link = '';
      let inputbody;
      if (schedule) {
        link = "addschedulenotification"
        inputbody = { data: formData, priority, schedule: true, schedule_date: formatDate(schedule_date), schedule_time: formatTime(schedule_time), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, bodies }
      } else {
        link = "addnotification"
        inputbody = { data: formData, priority, bodies }
      }
      await axios.post(`/api/admin/${link}`, inputbody);
      // Notification successfully added
      if (schedule) {
        alert("Successfully Scheduled!")
      } else {
        alert("Successfully Sent!")
      }
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
  const [showModal, setshowModal] = useState(false)
  return (
    <div className='container my-4'>
      {loading ? <Loading/> :
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
              <div className="btn loadmore mx-3" onClick={() => setshowModal(true)}>
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

          <div className="mb-3 options">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value={schedule} onChange={(e) => setschedule(e.target.checked)} id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Schedule
              </label>
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
                      to: newtopic[0].topic,
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
            <select name="to" data-language={'en'}
              value={bodies.find((body) => body.name === 'en')?.to || ''}
              onChange={handlebodychange} className='form-select'>
              {
                bodies.find((body) => body.name === "en")?.topicsoptions?.map((elem) => {
                  return <option value={elem.topic}>{elem.topic}</option>
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
            <label htmlFor="body" className="form-label">
              Body
            </label>
            <textarea
              className="form-control"
              name="body"
              data-language={"en"}
              rows={10}
              value={bodies.find((body) => body.name === "en")?.body || ''}
              onChange={handlebodychange}
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
                    value={bodies.find((body) => body.name === language)?.to || ''}
                    name="to" className='form-select'>
                    {
                      bodies.find((body) => body.name === language)?.topicsoptions?.map((elem) => {
                        return <option value={elem.topic}>{elem.topic}</option>
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
                    rows={10}
                    data-language={language}
                    value={bodies.find((body) => body.name === language)?.body || ''}
                    onChange={handlebodychange}
                  ></textarea>
                </div>
              </>
            })
          }
          {
            schedule && <>
              <Stack spacing={4} sx={{ width: "250px",marginBottom:"17px" }}>
                <DatePicker
                  label="Pick Schedule Date" value={schedule_date} onChange={(newValue) => setschedule_date(newValue)} closeOnSelect={false} />
              </Stack>
              <Stack spacing={4} sx={{ width: "250px" }}>
                <TimePicker
                  label="Pick Schedule Time"
                  minutesStep={1}
                  value={schedule_time} onChange={(newValue) => setschedule_time(newValue)} closeOnSelect={false} />
              </Stack>
            </>
          }


          <button type="submit" className="schedule-btn loadmore btn" >
            Submit
          </button>
        </form>
      }
      <Modal show={showModal} backdrop="static" onHide={() => setshowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Preview Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img width={200} src={formData.image} alt="Link is expired" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
