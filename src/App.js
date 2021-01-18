import React, { useReducer } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth, Storage } from 'aws-amplify';
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

 const translateAPI = 'https://qllu34ohpk.execute-api.us-east-1.amazonaws.com/dev/job'

 async function submitJob(formData) {
  // const user = await Auth.currentAuthenticatedUser()
  const user = await Auth.user
  const token = user.signInUserSession.idToken.jwtToken
  // const email = user.attributes.email
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
  
  // call api
  const requestInfo = {
    method: 'POST',
    headers: {
      Authorization: token
    },
    body: {
      formData
    }
  }  
  fetch(translateAPI, requestInfo)
        .then(response => response.json())
        .then(data => console.log("data :", data));        

  alert("You're job has been submitted successfully");

  }

function App() {
   
  const [formData, setFormData] = useReducer(formReducer, {
  mediaFile: '',
  source: '',
  langs: [{ 'es': false}, {'fr': false}, {'de': false}]});
  
  const handleSubmit = event => {
    event.preventDefault();
    
    submitJob(formData)
    setFormData({reset: true}); 
    document.getElementById("jobSubmit").reset();     
   
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
      <form id="jobSubmit" onSubmit={handleSubmit}> 
      <fieldset>
         <label>
           <p></p>
           <div>Source File:</div>
           <input type="hidden" name="mediaFile" onChange={handleChange} />
           <input type="file" accept='video/mp4' name="file" onChange={handleChange}  />
         </label>
         <label>
           <p></p>
           <div>Source Language:</div>
           <select name="source" onChange={handleChange} >
              <option value="">--Please choose an option--</option>
              <option value="en">English</option>               
           </select>
         </label>
         <label>
           <p></p>
           <div>Target Languages:</div>
           <input id="0" onChange={handleChange} type="checkbox" name="langs" value="es" /> Spanish<br></br>
           <input id="1" onChange={handleChange} type="checkbox" name="langs" value="fr" /> French<br></br>
           <input id="2" onChange={handleChange} type="checkbox" name="langs" value="de" /> German<br></br>
         </label>
         <p><button type="submit">Submit</button></p>
       </fieldset>       
      </form>
      <br></br>
        <MyComponent />
      <br></br>
      <amplify-sign-out button-text="Log Out"></amplify-sign-out>
    </div>
  )
}


class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.handleClick = this.handleClick.bind(this) 
  };
  

  handleClick(){ 
    this.getData()
  } 

  componentDidMount() {
    this.getData()
  }

    getData() {    
      console.log('getData')
      fetch(translateAPI, {
      method: 'get',
      headers: new Headers({
          'Authorization': Auth.user.signInUserSession.idToken.jwtToken
      })
  }).then(response => response.json().then(result => {
      this.setState({
          isLoaded: true,
          items: result.Items
      })
  }))
}

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          {items.map(item => (
            <div key={item.first_name}>
              {item.first_name} {item.last_name}
            </div>
          ))}
          <button onClick={this.handleClick}>Refresh</button>
        </div>
      );
    }
  }
}



export default withAuthenticator(App);
 
