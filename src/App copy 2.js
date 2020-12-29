import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Storage } from 'aws-amplify'
import { API, Auth } from 'aws-amplify';


function App() {

  state = { fileUrl: '', file: '', filename: '' }
  handleChange = e => {
    const file = e.target.files[0]
    this.setState({
      fileUrl: URL.createObjectURL(file),
      file,
      filename: file.name
    })
  }
  saveFile = () => {
    Storage.put(this.state.filename, this.state.file)
    .then(() => {
      console.log('successfully saved file!')
      this.setState({ fileUrl: '', file: '', filename: '' })
      })
      .catch(err => {
        console.log('error uploading file!', err)
    })
  }

  async function callAPI() {
    const user = await Auth.currentAuthenticatedUser()
    const token = user.signInUserSession.idToken.jwtToken
  
    console.log({ token })
  
    const requestInfo = {
  
      headers: {
        Authorization: token
      }
    }

    console.log({ requestInfo })
  
    const data = await API.get('mytestapi', '/hello', requestInfo)
  
    console.log({ data })
  
  }
  
  return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Upload File</h2>
          <input type='file' onChange={handleChange} />
          <img src={state.fileUrl} alt="picturehere"/>
          <button onClick={saveFile}>Save File</button>
          <button onClick={callAPI}>Test API</button>
          <amplify-sign-out button-text="Log Out"></amplify-sign-out>
        </header>
      </div>
    );
  }


export default withAuthenticator(App);
 