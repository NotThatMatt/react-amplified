import React from 'react';
import { Storage } from 'aws-amplify'

class S3ImageUpload extends React.Component {
  onChange(e) {
    const file = e.target.files[0];
      Storage.put(file.name, file, {
          contentType: 'video/mp4'
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
  }

  render() {
        return (
        
          <div>
            <input
                type="file" accept='video/mp4' id="upload-file"
                onChange={(evt) => this.onChange(evt)}
            />
          </div>
      )
  }
}

export default S3ImageUpload