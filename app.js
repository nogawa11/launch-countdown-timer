const days = document.querySelector(".days")
const hours = document.querySelector(".hours")
const minutes = document.querySelector(".minutes")
const seconds = document.querySelector(".seconds")
const form = document.querySelector(".form")
const dateInput = document.querySelector("#date")
const timeInput = document.querySelector("#time")
const startBtn = document.querySelector(".btn-start")
const updateBtn = document.querySelector(".btn-update")
const closeBtn = document.querySelector(".btn-close")

const setLaunchInfo = () => {
  const date = dateInput.value;
  const time = timeInput.value;
  const launchInfo = moment(`${date} ${time}}`);
  return launchInfo;
}

const setDateTime = () => {
  const currentDateTime = moment();
  dateInput.value = currentDateTime.add(1, "days").format("YYYY-MM-DD");
  dateInput.setAttribute("min", currentDateTime.format("YYYY-MM-DD"));
  dateInput.setAttribute("max", currentDateTime.add(1, "years").format("YYYY-MM-DD"));
  timeInput.value = moment().format("HH:mm")
}

const formatInfo = (info) => {
	let formattedInfo = "0";
	if (info < 10) {
		formattedInfo += info;
		return formattedInfo;
	} else {
		return info;
	}
};

const updateCountdown = (d, h, m, s) => {
	days.innerText = formatInfo(d);
	hours.innerText = formatInfo(h);
	minutes.innerText = formatInfo(m);
	seconds.innerText = formatInfo(s);
};

const displayCountdown = (display) => {
	const main = document.querySelector(".main");
	main.style.display = display;
	const header = document.querySelector(".header-text");
	if (display === "none") {
		header.innerText = "Launch is complete";
	} else {
		header.innerText = "Launching soon";
	}
};

const calculate = (launch) => {
	const currentDateTime = moment();
	duration = moment.duration(launch.diff(currentDateTime));
	if (duration < 0) {
		displayCountdown("none");
	}
	const daysRemaining = launch.diff(currentDateTime, "days");
	const hoursRemaining = duration.hours();
	const minutesRemaining = duration.minutes();
	const secondsRemaining = duration.seconds();
	updateCountdown(daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining);
};

const findRemainingTime = () => {
	const localStorageLaunch = localStorage.getItem("launchDate");
	const launch = setLaunchInfo();
	if (localStorageLaunch) {
		calculate(moment(localStorageLaunch));
	} else {
		calculate(launch);
	}
};

const saveLaunch = (launch) => {
	localStorage.setItem("launchDate", launch);
};

const countdownInfo = () => {
	findRemainingTime();
	const info = setInterval(() => {
		if (duration <= 0) {
			clearInterval(info);
		} else {
			findRemainingTime();
		}
	}, 1000);
};

const displayForm = (display) => {
	form.style.display = display;
};

document.addEventListener("DOMContentLoaded", () => {
	setDateTime();
	if (localStorage.getItem("launchDate")) {
		displayForm("none");
		countdownInfo();
	} else {
		updateCountdown("0", "0", "0", "0");
	}
});

startBtn.addEventListener("click", (event) => {
	event.preventDefault();
  launch = setLaunchInfo();
	saveLaunch(launch);
	countdownInfo();
  displayForm('none')
  displayCountdown('flex');
});

updateBtn.addEventListener("click", (event) => {
	event.preventDefault();
  displayForm('block')
  const storedDate = new Date(localStorage.getItem("launchDate"))
  const formattedDate = moment(storedDate).format('YYYY-MM-DD')
  const formattedTime = moment(storedDate).format('HH:mm')
  dateInput.value = formattedDate;
  timeInput.value = formattedTime;
});

closeBtn.addEventListener("click", (event) => {
	event.preventDefault();
  displayForm('none')
});
