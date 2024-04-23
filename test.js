function postData() {
    const apiKey = "aio_FRcK28kFx9ylh9C7M8ArFVvbCDFc"; // Replace with your Adafruit IO API key
    const feedKey = "cong-tac-quat"; // The feed key you want to update
  
  
    const data = {
      value: 1,
    };
  
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://io.adafruit.com/api/v2/homeless_da01/feeds/${feedKey}/data`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-AIO-Key", apiKey);
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log("Data posted successfully");
        } else {
          console.error("Failed to post data:", xhr.statusText);
        }
      }
    };
  
    xhr.send(JSON.stringify(data));
  }
  
  // Call the function to post the data
  postData();