import React, { useContext, useEffect, useState } from 'react'
import context from '../context/context'
import './home.css'
const Home = () => {
  const a = useContext(context);
  const getallnotifications = a.getsentnotifications;
  const getmorenotifications = a.getmoresentnotifications;
  const notifications = a.notifications;
  const hasMore = a.hasMore
  const [limit, setlimit] = useState(0)
  useEffect(() => {
    getallnotifications(limit)
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
  function formatString(inputString) {
    try {
      const parsedData = JSON.parse(inputString);
      parsedData.data.body = parsedData.data.body;
      const formattedJson = JSON.stringify(parsedData, null, 2);
      return formattedJson;
    } catch (error) {
      console.error("Error parsing the input string:", error);
      return null;
    }
  }
  const fetchMoreData = () => {
    const newlimit = limit + 10
    setlimit(newlimit)
    getmorenotifications(newlimit)
  }
  // const clicks=userdata?.clicks
  return (
    <div className='container'>
      <h2 className=' text-center my-4'>Notications Sent</h2>
      <div className='table-responsive'>
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>

              {notifications?.length !== 0 && notifications?.map((user, index) => (
                <>
                  <tr
                  >
                    <td>
                      <div>{user?.serial ? user.serial : "Not given"}</div>
                    </td>
                    <td>
                      <div>{user?.bodies[0].title ? user?.bodies[0].title : "Not given"}</div>
                    </td>
                    <td>
                      <div>{user?.createdAt ? formatDate(user.createdAt) : "Not given"}</div>
                    </td>
                    <td>
                      <div>{user?.createdAt ? formatTime(user.createdAt) : "Not given"}</div>
                    </td>
                    <td>
                      <div
                        className="pointer arrow collapsed"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                        aria-expanded="true"
                        aria-controls={`collapse${index}`}>
                        <img width={30} src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e" />
                      </div>
                    </td>
                  </tr>
                  <tr >
                    <td
                      colSpan={4}
                      id={`collapse${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOne"
                    >
                      {/* <h3>Request and Response JSON</h3> */}
                      <ol>
                        {
                          user?.requestjson.map((request, index) => (
                            <li key={index}>
                              <h4>Request</h4>
                              <pre dangerouslySetInnerHTML={{ __html: formatString(request) }} />

                              <h4>Response</h4>
                              <pre>{user?.responsejson[index]}</pre>
                            </li>
                          ))
                        }
                      </ol>
                    </td>
                  </tr>
                </>
              ))}

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
    </div>


  )
}

export default Home