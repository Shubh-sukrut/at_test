import React from 'react'

const Main_board = () => {
  return (
    <>
    <div className="home-container">
        <h1 className="app-text">Your Apps</h1>
        <p className="head-content">Here are your registered apps</p>
        <button className="texting-btn">Texting</button>
        <button className="tracking-btn">Agency Tracking</button>
        <div className="unsubscribed-div">
            <p className="unsubscribed-text">You have not subscribed to ageny tracking app yet. Please contact to administrator</p>
        </div>
    </div>
    </>
  )
}

export default Main_board