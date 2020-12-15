desiredDays = ["21","22","23","24","25"]
mountains = ['3']
people = ['daniel gorman']

// Afton Alps				=	"11"
// Alpine Valley			=	"232"
// Attitash Mountain		=	"203"
// Beaver Creek				=	"2"
// Boston Mills Brandywine	=	"212"
// Breckenridge				=	"3"
// Crested Butte			=	"15"
// Crotched Mountain		=	"205"
// Heavenly					=	"6"
// Hidden Valley			=	"1218"
// Hunter					=	"73"
// Keystone					=	"4"
// Kirkwood					=	"9"
// Liberty Mountain			=	"206"
// Mad River Mountain		=	"201"
// Mount Sunapee			=	"87"
// Mt Brighton				=	"12"
// Mt Snow					=	"74"
// Northstar				=	"8"
// Okemo					=	"86"
// Paoli Peaks				=	"1219"
// Park City				=	"14"
// Roundtop Mountain		=	"207"
// Snow Creek				=	"202"
// Stevens Pass				=	"44"
// Stowe					=	"85"
// Vail						=	"1"
// Whistler Blackcomb		=	"80"
// Whitetail				=	"208"
// Wildcat Mountain			=	"204"
// Wilmot Mountain			=	"43"

mountainSelect = document.getElementById('PassHolderReservationComponent_Resort_Selection')

nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      "value"
    ).set;

changeEvent = new Event('change', { bubbles: true});


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForLoad() {
	await timeout(100)
	if ($("[class*=loading_spinner").length !== 0) {
		console.log('loading')
		await waitForLoad()
	} else {
		console.log('loaded')
	}
}

async function changeMountain(val) {
	nativeSelectValueSetter.call(mountainSelect, val)
	mountainSelect.dispatchEvent(changeEvent)
	$("#passHolderReservationsSearchButton").click()
	console.log('waiting for mountain to change')
	await waitForLoad()
	console.log('changedMountain')
}

async function getElementForDay(day) {
	for (element of $(".passholder_reservations__calendar__day ")) {
        if (element.innerHTML === day) {
			return element
        }
	}
}

async function checkPersonBoxes() {
	let checkboxFound = false
	let arr = $(".passholder_reservations__assign_passholder_modal__list li")
	for (let i = 0; i < arr.length; i++) {
		for (person of people) {
			if (arr[i].innerHTML.toLowerCase().includes(person.toLowerCase())) {
				let checkbox = arr.eq(i).find('[id^=passholder-selection]')[0]
				if (checkbox != undefined) {
					checkbox.checked = true
					checkbox.click()
					console.log('checking passholder')
					await waitForLoad()
					//TODO error handling
					console.log('passholder confirmed')
					checkboxFound = true
				}
			}
		}
	}
	return checkboxFound
}

async function reserveDay(dayElement) {
	dayElement.click();
	console.log('loading checkboxes')
	await waitForLoad()
	console.log('checkboxes loaded')
	if (await checkPersonBoxes()) {
		$(".passholder_reservations__assign_passholder_modal__controls .primaryCTA")[0].click()
		console.log('processing reservations')
		await waitForLoad()
		console.log('reservations processed')
		return true
	} else {
		$(".passholder_reservations__assign_passholder_modal__controls .left_arrow").click()
		return false
	}
}

async function nextMountain(index) {
	if (mountains.length === 1) {
		await changeMountain("209")
		doTheWork(0)
	} else {
		doTheWork((index+1)%mountains.length)
	}
}

async function tryReserveDay(day) {
	console.log('trying to reserve ' + day)
	dayElement = await getElementForDay(day)
	return !dayElement.disabled && (await reserveDay(dayElement));
}

async function finalizeReservations() {
	$("#terms-accepted")[0].checked = true
	$("#terms-accepted")[0].click()
	$(".passholder_reservations__completion__cta button")[0].click()
}

async function doTheWork(index) {
	await changeMountain(mountains[index]);
	let foundDay = false
	for (day of desiredDays) {
		foundDay = foundDay || await tryReserveDay(day)
	}
	if (!foundDay) {
		nextMountain(index)
	} else {
		finalizeReservations()
	}
}

function start() {
	doTheWork(0)
}
