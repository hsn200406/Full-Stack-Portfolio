// const { createElement } = require("react");

const submitbtn = document.getElementById("submitbtn")
const dobForm = document.getElementById("dobForm")
const birthdateInput = document.getElementById("birthdate");
const result = document.getElementById("result")
const countdownBtn = document.getElementById("countdownBtn")
const countdownResultInMonths = document.getElementById("countdownResultInMonths");
const countdownResultInDays = document.getElementById("countdownResultInDays")

const savDOB = (date) => {
    return new Promise((resolve, reject) => {
        if (!date) {
            reject("Date of Birth is Required");
        } else {
            resolve("Date of Birth has been saved successfully: <b>" + date + "</b>");
        }
    });
};

const displayRemainingTime = (date) => {
    const [birthYear, birthMonth, birthDay] = date.split("-").map(Number);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();

    // Determine next birthday
    let nextBirthdayYear = (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay <= birthDay)) 
        ? currentYear 
        : currentYear + 1;

    const nextBirthday = new Date(nextBirthdayYear, birthMonth - 1, birthDay);

    // Total difference in milliseconds
    let diffMs = nextBirthday - today;

    // Calculate total days
    let totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Approximate months and remaining days
    let monthsLeft = birthMonth - currentMonth;
    if (monthsLeft < 0) monthsLeft += 12;

    let daysLeft = birthDay - currentDay;
    if (daysLeft < 0) {
        monthsLeft -= 1;
        // Get days in previous month
        const prevMonth = new Date(nextBirthdayYear, birthMonth - 1, 0); // last day of previous month
        daysLeft += prevMonth.getDate();
    }

    countdownResultInMonths.innerHTML = `Next birthday is in <b>${monthsLeft}</b> months and <b>${daysLeft}</b> days! 🎉`;
    countdownResultInDays.innerHTML = `Or in total <b>${totalDays}</b> days`;
};


submitbtn.addEventListener('click', (event) => {
      event.preventDefault(); // prevent page refresh
      
      const selectedDate = birthdateInput.value;
      
      savDOB(selectedDate)
      .then((message) => {
        result.innerHTML = message;
        submitbtn.classList.remove("btn-secondary");
        submitbtn.classList.add("btn-success");
        submitbtn.disabled = true;
        countdownBtn.disabled = false;

        // Add listener for countdown button only once
        countdownBtn.addEventListener('click', () => {
            displayRemainingTime(selectedDate);
        }, { once: true }); // ensures listener is added only once

      })
      .catch((error) => {
        result.innerText = error;
        submitbtn.classList.remove("btn-success");
        submitbtn.classList.add("btn-secondary");
      })
})

