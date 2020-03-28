/* jshint esversion: 6 */

// DOM Elements
const time = document.getElementById("time"),
    greeting = document.getElementById("greeting"),
    name = document.getElementById("name"),
    focus = document.getElementById("focus");

// Options
const showAmPm = true;

// Show Time
function showTime (){
    
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    // Set AM or PM
    // const amPm = hour >= 12 ? "PM" : "AM";

    // 12 hour Format
    // hour = hour % 12 || 12;
    
    // Output time
    time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n){
    return (parseInt(n, 10) < 10 ? "0":"") + n;
}

// Set Background and Greeting
function setBgGreet(){
    let today = new Date(),
        hour = today.getHours();

    if(hour < 12){
        // Morning
        document.body.style.backgroundImage = `url('../images/morning${Math.floor(Math.random() * 4)}.jpg')`;
        greeting.textContent = "Good Morning";
    } else if(hour < 18){
        // Afternoon
        document.body.style.backgroundImage = `url('../images/afternoon${Math.floor(Math.random() * 3)}.jpg')`;
        greeting.textContent = "Good Afternoon";
    } else {
        // Evening
        document.body.style.backgroundImage = `url('../images/night${Math.floor(Math.random() * 5)}.jpg')`;
        greeting.textContent = "Good Evening";
        document.body.style.color = "white";
    }
}

// Get Name
function getName(){
    if(localStorage.getItem("name") === null){
        name.textContent = "[Enter Name]";
    } else {
        name.textContent = localStorage.getItem("name");
    }
}

// Set Name
function setName(e){
    if(e.type === "keydown"){
        // Make sure enter is pressed
        if(e.code === "Enter"){
            localStorage.setItem("name", e.target.innerText);
            name.blur();
        }
    } else {
        localStorage.setItem("name", e.target.innerText);
    }
}

// Get Focus
function getFocus(){
    if(localStorage.getItem("focus") === null){
        focus.textContent = "[Enter Your Goal]";
    } else {
        focus.textContent = localStorage.getItem("focus");
    }
}

// Set Focus
function setFocus(e){
    if(e.type === "keydown"){
        // Make sure enter is pressed
        if(e.code === "Enter"){
            localStorage.setItem("focus", e.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem("focus", e.target.innerText);
    }
}


name.addEventListener("keydown", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keydown", setFocus);
focus.addEventListener("blur", setFocus);


// Run
showTime();
setBgGreet();
getName();
getFocus();
