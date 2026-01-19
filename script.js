function dynamicTimings() {
    const now = new Date();

    //updating time

    let hours = now.getHours();        
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";

    // converting to 12-hour format
    hours = hours % 12 || 12;

    let timing = document.getElementById("timeText");
    timing.innerText = `${hours}:${minutes}:${seconds} ${period}`;

    //updating date

    let myDate = document.getElementById("dateText");

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = now.getDate();
    const month = months[now.getMonth()]; // getMonth() returns 0-11
    const year = now.getFullYear();

    const formattedDate = `${day} ${month}, ${year}`;

    myDate.innerText = formattedDate;

    
}

// run immediately
dynamicTimings();

// update every second
setInterval(dynamicTimings, 1000);


//updating city and weather with coordinates given by browser

let apiKey = "583f12d47da75834ae881d573514caec";

navigator.geolocation.getCurrentPosition(function(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    //getting city name
    let city = "Jaipur"
    

    fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => document.getElementById("cityText").innerText = data[0].name);
    
    //getting weather for that city that we fetched

    

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
                .then(resp => resp.json())
                .then(weatherData => {
                    let temp = Math.round(weatherData.main.temp);
                    let desc = weatherData.weather[0].description;

                    // Update your HTML elements
                    document.getElementById("temperatureText").innerText = `${temp}°C`;
                    document.getElementById("statusText").innerText = desc.charAt(0).toUpperCase() + desc.slice(1);
                });
    
});



// theme changing logic
const arrOfObjs = [
    { pri: "#27374D", sec: "#9DB2BF" },
    { pri: "#3E0703", sec: "#d6b48c" },
    { pri: "#0A400C", sec: "#819067" }
];

let i = 0;
const themeBtn = document.getElementById("themeBtn");

function applyTheme(index) {
    const { pri, sec } = arrOfObjs[index];

    document.querySelectorAll(".theme-pri")
        .forEach(el => el.style.backgroundColor = pri);

    document.querySelectorAll(".theme-sec")
        .forEach(el => el.style.backgroundColor = sec);
}



// restore saved theme index
const savedThemeIndex = localStorage.getItem("themeIndex");
if (savedThemeIndex !== null) {
  i = Number(savedThemeIndex);
}



// 🔥 apply theme on page load
applyTheme(i);

// change theme on click
themeBtn.addEventListener("click", () => {
    i = (i + 1) % arrOfObjs.length;
    applyTheme(i);
    localStorage.setItem("themeIndex", i);  
});


// -------- PAGE PERSISTENCE LOGIC --------

const pages = [
  "homePage",
  "todoPage",
  "plannerPage",
  "motivationPage",
  "timerPage"
];

function showPage(pageId) {
  pages.forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  document.getElementById(pageId).classList.remove("hidden");

    // save current page
    localStorage.setItem("currentPage", pageId);
    
    // run page-specific logic
    onPageOpen(pageId);
}


function onPageOpen(pageId) {
  if (pageId === "motivationPage") {
    gettingQuote();
    getRandomColor();
  }
}




//-------------------------home page ends--------------------------------

//todo tab open logic

let todoTab = document.getElementById("todoTab");
let homePage = document.getElementById("homePage");
let todoPage = document.getElementById("todoPage");

todoTab.addEventListener("click", () => {
    showPage("todoPage");
})

//todo tab close logic

let todoCloseBtn = document.getElementById("todoCloseBtn");
todoCloseBtn.addEventListener("click", () => {
    showPage("homePage");

})







//actual todo logic on add task btn

let addBtn = document.getElementById("addTaskBtn");

addBtn.addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value;
    const details = document.getElementById("taskDetails").value;

    if (!title) return;

    const taskDiv = document.createElement("div");
    
    taskDiv.className = "p-4 w-full mt-4 bg-[#FBF5DE] rounded-xl flex gap-4 items-start ";

    taskDiv.innerHTML = `
        <div class="flex justify-between items-start w-full">
    
            <!-- Left: Task text -->
            <div class="max-w-[75%]">
                <h3 class="text-xl font-bold">${title}</h3>
                <p class="text-sm text-gray-600 mt-1">${details}</p>
            </div>

            <!-- Right: Button -->
            <button class="btnExist bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium active:scale-95">Mark as Completed</button>

         </div>
    `;

    document.getElementById("taskList").appendChild(taskDiv);

    // reset inputs
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDetails").value = "";
})

document.getElementById("taskList").addEventListener("click", (e) => {
    if (e.target.classList.contains("btnExist")) {
        e.target.closest("div").parentElement.remove();
    }
});


//-----------------------------todo page ends-----------------------------------



//planner tab page opening logic

let plannerTab = document.getElementById("plannerTab");
let plannerPage = document.getElementById("plannerPage");

plannerTab.addEventListener("click", () => {
    showPage("plannerPage");
})

//planner tab close logic
let plannerCloseBtn = document.getElementById("plannerCloseBtn");
plannerCloseBtn.addEventListener("click", () => {
    showPage("homePage");

})


//---------------------------------planner page ends-------------------------------------------




//random color for motivation page

let blurBg = document.getElementById("blurBg")
let quoteCard = document.getElementById("quoteCard")

function getRandomColor() {
    const r = Math.floor(Math.random() * 256); // 0–255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    let randColor = `rgb(${r}, ${g}, ${b})`;

    blurBg.style.backgroundColor = randColor; 
    quoteCard.style.backgroundColor = randColor; 
}


//quote & author fetching logic

let quoteText = document.getElementById("quoteText")
let authorText = document.getElementById("authorText")

async function gettingQuote(){ 
    let response = await fetch("https://api.api-ninjas.com/v2/randomquotes", {
        headers: {
            "X-Api-Key": "lJssTXhiNK0c5nLoCJ9TiaIkmLZ3s6qjDv86U0eR"
        }
    })
    let data = await response.json();
    quoteText.textContent = data[0].quote;
    authorText.textContent = data[0].author;
}

//motivation tab page opening logic
let motivationTab = document.getElementById("motivationTab");
let motivationPage = document.getElementById("motivationPage");


motivationTab.addEventListener("click", () => {
    showPage("motivationPage");
})

//motivation tab page closing logic

let motivationCloseBtn = document.getElementById("motivationCloseBtn");

motivationCloseBtn.addEventListener("click", () => {
    showPage("homePage");
    quoteText.textContent = "Loading...";
    authorText.textContent = "Loading...";
})



//----------------------------motivation page ends---------------------------------


// timer page opening logic

let timerTab = document.getElementById("timerTab");
let timerPage = document.getElementById("timerPage");


timerTab.addEventListener("click", () => {
    showPage("timerPage");
})

// timer page closing logic
let timerCloseBtn = document.getElementById("timerCloseBtn");

timerCloseBtn.addEventListener("click", () => {
    showPage("homePage");
  
})



//pobodomaro timer logic
const timer = document.getElementById("timer");
const currSession = document.getElementById("currSession");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let time = WORK_TIME;
let isWork = true;
let interval = null;

function render() {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  timer.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
}

function nextSession() {
  isWork = !isWork;
  time = isWork ? WORK_TIME : BREAK_TIME;
  currSession.textContent = isWork ? "Work" : "Break";
}

startBtn.onclick = () => {
  if (interval) return;

  interval = setInterval(() => {
    if (time === 0) {
      clearInterval(interval);
      interval = null;
      nextSession(); // switch but don't start
      render();
      return;
    }

    time--;
    render();
  }, 1000);
};

pauseBtn.onclick = () => {
  clearInterval(interval);
  interval = null;
};

resetBtn.onclick = () => {
  clearInterval(interval);
  interval = null;
  isWork = true;
  time = WORK_TIME;
  currSession.textContent = "Work";
  render();
};

render();

// ------------------timer page ends-----------------------------------



window.addEventListener("DOMContentLoaded", () => {
  const savedPage = localStorage.getItem("currentPage") || "homePage";
  showPage(savedPage);
});
