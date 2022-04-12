import React from 'react'

function TweetCreate(props) {
  const textAreaRef = React.createRef()

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    // const form = event.target;
    // const formData = new FormData(form);
    // const data = {};
    // formData.forEach((value, key) => {
    //     data[key] = value;
    // })
    const newTweet = textAreaRef.current.value;
    console.log(newTweet)
    textAreaRef.current.value = "";
  }

  return (
    <div className="row my-3">
      <div className="col-md-4 mx-auto col-12">
        <form onSubmit={handleSubmit}>
          <textarea ref={textAreaRef} required={true} className="form-control" name="tweet">
            
          </textarea>
          <button type="submit" className="btn btn-primary my-3">
            Tweet
          </button>
        </form>
      </div>
    </div>
  );
}

export default TweetCreate