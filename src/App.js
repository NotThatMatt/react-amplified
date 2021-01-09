import React, { useReducer, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { API, Auth, Storage } from 'aws-amplify';
import './App.css';


const formReducer = (state, event) => {
  if(event.reset) {
    return {
      mediaFile: '',
      source: '',
      langs: [{ 'es': false}, {'fr': false}, {'de': false}]
    }
  }
  if(event.name==='langs'){
    const updateLangs = [...state.langs]
    updateLangs.splice(event.id, 1, { [event.value]: event.checked });

    return {      
      ...state,
      langs: updateLangs
    }

  }
  return {
    ...state,
    [event.name]: event.value
  }
 }

 async function submitJob(formData) {
  const user = await Auth.currentAuthenticatedUser()
  const token = user.signInUserSession.idToken.jwtToken
  const email = user.attributes.email
  const file = formData.file
  const targetLanguages = []


  // upload file
  Storage.put(formData.mediaFile, file, {
    contentType: 'video/mp4'
  })

  // create array of target languages
  formData.langs.forEach(targetLangs);
  function targetLangs(value, index, array) {
    var isLang = JSON.parse(Object.values(value))
    var source = formData.source 
    var target = Object.keys(value).toString()

    if (isLang===true) {
      targetLanguages.push({
        "sourceLanguage": source,
        "targetLanguage": target
      })  
    }
  }

  // clean up form and add target languages and email
  delete formData.file
  delete formData.langs
  delete formData.source
  formData['targetLanguages'] = targetLanguages
  formData['email'] = email
  
  // call api
  const requestInfo = {
    headers: {
      Authorization: token
    },
    body: {
      formData
    }
  }
  
  console.log({ requestInfo })
  const data = await API.post('translateapi', '/files', requestInfo)
  console.log({ data })
  }

function App() {
   
  const [formData, setFormData] = useReducer(formReducer, {
  mediaFile: '',
  source: '',
  langs: [{ 'es': false}, {'fr': false}, {'de': false}]});
  
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = event => {
    event.preventDefault();
    
    submitJob(formData)
    setFormData({reset: true}); 
    document.getElementById("jobSubmit").reset(); 
    setSubmitting(true);
   
 }
 
 const handleChange = event => {
  switch (event.target.type) {
    case "file":
      setFormData({
        type: event.target.type,
        name: 'mediaFile',
        value: event.target.files[0].name
      })
      setFormData({
        type: event.target.type,
        name: 'file',
        value: event.target.files[0]
      })
    break;
    case "checkbox":
      setFormData({
        id: event.target.attributes.id.value,
        type: event.target.type,
        name: event.target.name,
        value: event.target.value,
        checked: event.target.checked
      })
    break;
    default:
      setFormData({
        type: event.target.type,
        name: event.target.name,
        value: event.target.value
      });
  }
}
  return (
    <div className="App-header">
      <h1>Submit Translation Job</h1>
      {submitting &&
       <div>You're job has been submitted successfully</div>
     }
      <form id="jobSubmit" onSubmit={handleSubmit}> 
      <fieldset>
         <label>
           <p>File Name</p>
           <input type="hidden" name="mediaFile" onChange={handleChange} />
           <input type="file" accept='video/mp4' name="file" onChange={handleChange}  />
         </label>
         <label>
           <p>Source Language</p>
           <select name="source" onChange={handleChange} >
              <option value="">--Please choose an option--</option>
              <option value="en">English</option>               
           </select>
         </label>
         <label>
           <p>Target Language</p>
           <input id="0" onChange={handleChange} type="checkbox" name="langs" value="es" /> Spanish<br></br>
           <input id="1" onChange={handleChange} type="checkbox" name="langs" value="fr" /> French<br></br>
           <input id="2" onChange={handleChange} type="checkbox" name="langs" value="de" /> German<br></br>
         </label>
         <p><button type="submit">Submit</button></p>
       </fieldset>       
      </form>
      <amplify-sign-out button-text="Log Out"></amplify-sign-out>
    </div>
  )
}

export default withAuthenticator(App);
 
