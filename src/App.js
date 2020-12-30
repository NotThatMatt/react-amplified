import React, { useReducer, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { API, Auth, Storage } from 'aws-amplify';
import './App.css';


const formReducer = (state, event) => {
  if(event.reset) {
    return {
      filename: '',
      email: '',
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
  const file = formData.file
  
  const requestInfo = {
    headers: {
      Authorization: token
    },
    body: {
      formData
    }
  }
  
  Storage.put(formData.filename, file, {
    contentType: 'video/mp4'
})
  console.log({ requestInfo })
  const data = await API.post('mytestapi', '/hello', requestInfo)
  console.log({ data })
}

function App() {
   
  const [formData, setFormData] = useReducer(formReducer, {
  filename: '',
  email: '',
  source: '',
  langs: [{ 'es': false}, {'fr': false}, {'de': false}]});
  
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = event => {
    console.log(event)
    event.preventDefault();
    setSubmitting(true);

   setTimeout(() => {
     setSubmitting(false);
     setFormData({
      reset: true
    }); 
    submitJob(formData)
   }, 3000)
 
 }
 
 const handleChange = event => {
  switch (event.target.type) {
    case "file":
      setFormData({
        type: event.target.type,
        name: 'filename',
        value: event.target.files[0].name
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
       <div>You are submitting the following:
       <ul>
         {Object.entries(formData).map(([name, value]) => (
           <li key={name}><strong>{name}</strong>:{value.toString()}</li>
         ))}
       </ul></div>
     }
      <form onSubmit={handleSubmit}> 
      <fieldset>
         <label>
           <p>File Name</p>
           <input type="hidden" name="filename" onChange={handleChange} value={formData.filename}/>
           <input type="file" accept='video/mp4' name="file" onChange={handleChange} onClick={(event)=> { event.target.value = null }} />
         </label>
         <label>
           <p>Source Language</p>
           <select name="source" onChange={handleChange} value={formData.source}>
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
         <label>
           <p>Email Address</p>
           <input type="email" name="email" onChange={handleChange} value={formData.email}/>
         </label>
         <p><button type="submit">Submit</button></p>
       </fieldset>       
      </form>
      <amplify-sign-out button-text="Log Out"></amplify-sign-out>
    </div>
  )
}


export default withAuthenticator(App);
 