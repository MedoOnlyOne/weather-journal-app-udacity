/* Global Variables */
const apiKey = `195411c94cfa7748d14952fdf7452028`; 

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


document.addEventListener('DOMContentLoaded', ()=>{
    // get the generate button
    const generate = document.querySelector('#generate');

    /*
    when the generate button is clicked,
    get the input values,
    make an API call to get the temp,
    make a post request to the server to store the data,
    make a get request to the server to get the data again
    */
   generate.addEventListener('click', ()=>{
       // get the zip code and feelings from the user
       const zip = document.querySelector('#zip').value; // for test use 72201
       const feelings = document.querySelector('#feelings').value;
       
       // construct the url to make an API call    
       const fullUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=metric`;
       getTemp(fullUrl)
       // after we get the temp, we need to send the data to the server    
       .then((temp) => {
           console.log(temp);
           sendData(temp, feelings, d);
       })
       // after we have send the data to the server, we need to get it back again    
       .then(()=>{
           return getData();
       })
       // after the data is back, we need to update the UI
       .then((projectData) =>{
           console.log(projectData);
       })
       .catch((err) => console.log(err));
   });
});

async function getTemp(url){
    try {
        const data = await fetch(url);
        const temp = (await data.json()).main.temp;
        return temp;
    } catch (err) {
        Error(`Error: ${err}`);
    }
}

async function sendData(temp, feelings, date){
    try {
        await fetch('/saveProjectData', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "temp": temp,
                "feelings": feelings,
                "date": date
            })
        });
    } catch (err) {
        Error(`Error: ${err}`);
    }
}

async function getData(){
    try {
        const data = await fetch('/getProjectData');
        const projectData = await data.json();
        return projectData;
    } catch (err) {
        Error(`Error: ${err}`);
    }
}