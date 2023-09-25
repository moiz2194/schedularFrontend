import React, { useEffect, useState } from 'react';
import context from './context.js';
import axiosInstance from "../context/axios.js"
const State = (props) => {
  const [notifications, setnotifications] = useState([]);
  const [schedulenotifications, setschedulenotifications] = useState([])
  const [hasMore, sethasMore] = useState(false)
  const [topics, settopics] = useState([])
  const [languages, setlanguages] = useState([])
  const [key, setkey] = useState({})
  const login = async (data) => {
    try {
      const response = await axiosInstance.post('/api/admin/loginadmin', data);
      const json = response.data;

      if (json.success) {
        window.location.reload();
        localStorage.setItem('login-token', json.token);
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const getschedulednotifications = async (data) => {
    try {
      const response = await axiosInstance.get(`/api/admin/getschedulednotifications?limit=${data}`, data);
      const json = response.data;

      if (json.success) {
        setschedulenotifications(json.data)
        sethasMore(json.hasMore)
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const getmoreschedulednotifications = async (data) => {
    try {
      const response = await axiosInstance.get(`/api/admin/getschedulednotifications?limit=${data}`, data);
      const json = response.data;

      if (json.success) {
        setschedulenotifications((prev) => [...prev, ...json.data])
        sethasMore(json.hasMore)
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const getsentnotifications = async (data) => {
    try {
      const response = await axiosInstance.get(`/api/admin/getsentnotifications?limit=${data}`, data);
      const json = response.data;

      console.log(json)
      if (json.success) {
        setnotifications(json.data)
        sethasMore(json.hasMore)
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const getmoresentnotifications = async (data) => {
    try {
      const response = await axiosInstance.get(`/api/admin/getsentnotifications?limit=${data}`, data);
      const json = response.data;

      console.log(json)
      if (json.success) {
        setnotifications((prev) => [...prev, ...json.data])
        sethasMore(json.hasMore)
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };



  const deletenotification = async (data) => {
    try {
      const response = await axiosInstance.post('/api/admin/deletenotification', data);
      const json = response.data;

      if (json.success) {
        window.location.reload()
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const addtopic = async (data) => {
    try {
      const response = await axiosInstance.post('/api/topic/', data);
      const json = response.data;
      if (json.success) {
        window.location.reload()
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const gettopics = async (data) => {
    try {
      const response = await axiosInstance.get('/api/topic/', data);
      const json = response.data;
      if (json.success) {
        settopics(json.data)
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const deltopic = async (data) => {
    try {
      const response = await axiosInstance.post('/api/topic/deltopic', data);
      const json = response.data;
      if (json.success) {
        window.location.reload()
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  // Languages
  const addlanguage = async (data) => {
    try {
      const response = await axiosInstance.post('/api/topic/langauge', data);
      const json = response.data;
      if (json.success) {
        window.location.reload()
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const getlanguages = async (data) => {
    try {
      const response = await axiosInstance.get('/api/topic/langauge', data);
      const json = response.data;
      if (json.success) {
        setlanguages(json.data)
        return true
      } else {
        alert(json.message);
        return false
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const dellanguage = async (data) => {
    try {
      const response = await axiosInstance.post('/api/topic/langauge/delete', data);
      const json = response.data;
      if (json.success) {
        window.location.reload()
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  // Fcm key
  const getkey = async () => {
    try {
      const response = await axiosInstance.get('/api/topic/key');
      const json = response.data;
      if (json.success) {
        setkey(json.data)
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert('Error during fetching key:', error);
    }
  };
  const updatekey = async (data) => {
    try {
      const response = await axiosInstance.post('/api/topic/addkey',data);
      const json = response.data;
      if (json.success) {
        setkey(json.data)
      } else {
        alert(json.message);
      }
    } catch (error) {
     alert('Error during Update:', error);
    }
  };

  return (
    <context.Provider value={{
      getkey,key,updatekey,
      getlanguages, addlanguage, dellanguage, languages, setlanguages,
      gettopics, addtopic, deltopic, topics,
      getmoreschedulednotifications, schedulenotifications,
      getmoresentnotifications, hasMore, deletenotification, login, getschedulednotifications,
      getsentnotifications, notifications
    }}>
      {props.children}
    </context.Provider>
  )
}

export default State