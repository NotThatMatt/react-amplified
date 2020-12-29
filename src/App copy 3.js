import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Storage } from 'aws-amplify'
import { API, Auth } from 'aws-amplify';

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

async function handleChange(e){
  const file = e.target.files[0];
  await Storage.put('picture.jpg', file, {
        contentType: 'image/jpg'
  });
}

// const handleChange = async (e) => {
//   const file = e.target.files[0];
//   await Storage.put('picture.jpg', file, {
//         contentType: 'image/jpg'
//   });
// }

class App extends Component {

  state = { fileUrl: '', file: '', filename: '' }
  // handleChange = e => {
  //   const file = e.target.files[0]
  //   this.setState({
  //     fileUrl: URL.createObjectURL(file),
  //     file,
  //     filename: file.name
  //   })
    
  // }
  saveFile = () => {
    Storage.put(this.state.filename, this.state.file)
    .then(() => {
      console.log('successfully saved file!')
      this.setState({ fileUrl: '', file: '', filename: '' })
      callAPI()
      })
      .catch(err => {
        console.log('error uploading file!', err)
    }) 
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Upload File</h2>          
          <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
          </form>          <input type='file' accept='image/png, image/jpeg' onChange={this.handleChange} />
          <button onClick={this.saveFile}>Save File</button>
          <amplify-sign-out button-text="Log Out"></amplify-sign-out>
        </header>
      </div>
    );
  }
}

export default withAuthenticator(App);
 