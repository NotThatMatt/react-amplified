import React from 'react';
import S3ImageUpload from './S3ImageUpload';
import TargetLanguages from './TargetLanguages';


// import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { API, Auth } from 'aws-amplify';

async function callAPI() {
  const user = await Auth.currentAuthenticatedUser()
  const token = user.signInUserSession.idToken.jwtToken
  const email = user.attributes.email
  console.log({ email })
  const requestInfo = {
    headers: {
      Authorization: token
    },
    body: {
      formState
    }
  }
  
  console.log({ requestInfo })
  const data = await API.post('mytestapi', '/hello', requestInfo)
  console.log({ data })
}

const formState = { email: '', targetLang: '' };

function updateFormState(key, value) {
  formState[key] = value;
}



function App() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Submit Translation Job</h2>
          <form>
            <label>Upload File:<br></br>
              <S3ImageUpload />
            </label>
            <p></p>
            <label>Choose Source Language:<br></br>
              <select>
                <option defaultValue="en">English</option>
              </select>
            </label>
            <p></p>
            <label>Choose Target Languages:<br></br>
              <TargetLanguages functionCallFromParent={this.parentFunction.bind(this)}/>
            </label>
            <p></p>
            <label>Email Address:<br></br>
            <input type="text" onChange={e => updateFormState('email', e.target.value)}/>
            </label>
          </form>
          <p></p>
          <button onClick={ callAPI }>Submit Job</button>
          <p><label>------------------------</label></p>
          <amplify-sign-out button-text="Log Out"></amplify-sign-out>
        </header>
      </div>
    );
  }


export default withAuthenticator(App);
 