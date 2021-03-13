desiredDays = ['3/13']
mountains = ['Kirkwood'] // use the name

// Afton Alps               =   "11"
// Alpine Valley            =   "232"
// Attitash Mountain        =   "203"
// Beaver Creek             =   "2"
// Boston Mills Brandywine  =   "212"
// Breckenridge             =   "3"
// Crested Butte            =   "15"
// Crotched Mountain        =   "205"
// Heavenly                 =   "6"
// Hidden Valley            =   "1218"
// Hunter                   =   "73"
// Keystone                 =   "4"
// Kirkwood                 =   "9"
// Liberty Mountain         =   "206"
// Mad River Mountain       =   "201"
// Mount Sunapee            =   "87"
// Mt Brighton              =   "12"
// Mt Snow                  =   "74"
// Northstar                =   "8"
// Okemo                    =   "86"
// Paoli Peaks              =   "1219"
// Park City                =   "14"
// Roundtop Mountain        =   "207"
// Snow Creek               =   "202"
// Stevens Pass             =   "44"
// Stowe                    =   "85"
// Vail                     =   "1"
// Whistler Blackcomb       =   "80"
// Whitetail                =   "208"
// Wildcat Mountain         =   "204"
// Wilmot Mountain          =   "43"

monthOrder = []
activeMonth = new Date().getMonth()+1

mountainSelect = document.getElementById('benefit_ticket_modal__content__resort_input')

nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      "value"
    ).set;

changeEvent = new Event('change', { bubbles: true});

async function prepareMonthOrder() {
    currentMonth = new Date().getMonth()+1
    for (let i = currentMonth; i < currentMonth+12; i++) {
        monthOrder.push(i%12)
    }
    var index = monthOrder.indexOf(0);
    if (index !== -1) {
        monthOrder[index] = 12;
    }
    //console.log(monthOrder)
}

async function resetActiveMonth() {
    activeMonth = new Date().getMonth()+1
}

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForLoad() {
    await timeout(100)
    if ($("[class*=loading_spinner").length !== 0) {
        //console.log('loading')
        await waitForLoad()
    } else {
        //console.log('loaded')
    }
}

async function changeMountain(val) {
    console.log("changing mountain to " + val)
    //mountainSelect.selectedIndex=14
    nativeSelectValueSetter.call(mountainSelect, val)
    mountainSelect.dispatchEvent(changeEvent)
    $(".input-group-addon").click()
    console.log('waiting for mountain to change')
    resetActiveMonth()
    await waitForLoad()
    console.log('changedMountain')
}

async function increaseMonth() {
    $("button[title='Next Month']").click()
    activeMonth = (activeMonth + 1)%12
    if (activeMonth === 0) {
        activeMonth = 12
    }
    await waitForLoad()
}

async function decreaseMonth() {
    $("button[title='Previous Month']").click()
    activeMonth = (activeMonth - 1)%12
    if (activeMonth === 0) {
        activeMonth = 12
    }
    await waitForLoad()
}

async function setMonth(month) {
    //console.log('setting month')
    if (month === activeMonth.toString()) {
        return
    }
    let activeIndex = monthOrder.indexOf(activeMonth)
    let desiredIndex = monthOrder.indexOf(parseInt(month))
    if (activeIndex > desiredIndex) {
        await decreaseMonth()
    } else {
        await increaseMonth()
    }
    await setMonth(month)
}

async function getElementForDay(date) {
    console.log('getting day ' + date)
    let month, day
    if (date.includes('/')) {
        month = date.split('/')[0]
        day = date.split('/')[1]
    } else {
        month = activeMonth
        day = date
    }
    console.log(month + '/' + day)
    await setMonth(month)
    console.log('Table: ' + $(".table-condensed td").length)
    for (element of $(".table-condensed td")) {
        console.log('Day: ' + day)
        if (element.innerHTML === day) {
            return element
        }
    }
}

async function reserveDay(dayElement) {
    dayElement.click();
    console.log('loading checkboxes')
    await waitForLoad()
    console.log('checkboxes loaded')
    return true
}

async function nextMountain(index) {
    if (mountains.length === 1) {
        await changeMountain("Jack Frost Big Boulder")
        doTheWork(0)
    } else {
        doTheWork((index+1)%mountains.length)
    }
}

async function tryReserveDay(day) {
    console.log('trying to reserve ' + day)
    dayElement = await getElementForDay(day)
    return !dayElement.classList.contains('disabled') && (await reserveDay(dayElement));
}

async function finalizeReservations() {
    await waitForLoad()
    $("#benefit_ticket_modal__content__attestment_input")[0].checked = true
    //$("#benefit_ticket_modal__content__attestment_input")[0].click()
    document.getElementsByClassName('benefit_ticket_modal__option_submit primaryCTA')[0].click()
}

async function extendSession() {
    // Extend our session and clear the dialog if it's up.
    await requirejs(['FR', 'jquery', 'underscore', 'moment', 'services/freerideRestApi'], function(FR, $, _, moment, restApi) {

        var _helper = {
            closeModal: function closeModal() {
            FR.$el.window.trigger('global-modal-close');
            },
            openModal: function openModal() {
            var template = _helper.getTemplate();
    
            setTimeout(function() {
                FR.$el.window.trigger('global-modal-open', [template]);
            }, 1000);
            },
            getTemplate: function getTemplate() {
            var template = _.template(_$el.template.html());
    
            return template({});
            },
            startSessionWarning: function startSessionWarning() {
            if (FR.$el.body.attr('data-session-active') === 'true' && FR.$el.body.attr('data-user-authentication-status') === 'logged in') {
                _showModalTime = moment().add(parseInt(FR.$el.body.attr('data-session-time'), 10) - 2, 'm');
    
                //_helper.checkForSessionWarning();
            }
            }
        }
        //console.log("extending session");
        restApi.extendSession({}, function(response) {
            _helper.closeModal();
    
            if (response.success === true) {
            //console.log("successful extend");
            FR.$el.body.attr('data-session-time', response.data);
    
            _helper.startSessionWarning();
    
            FR.$el.window.trigger('session-extended');
            } else {
            //console.log("unsuccessful extend");
    
            }
        });
    });
}

async function doTheWork(index) {
    await extendSession();

    await changeMountain(mountains[index]);
    let foundDay = false
    for (day of desiredDays) {
        console.log("loop processing day " + day)
        foundDay = (await tryReserveDay(day)) || foundDay
    }
    if (!foundDay) {
        nextMountain(index)
    } else {
        finalizeReservations()
    }
}

function start() {
    prepareMonthOrder()
    doTheWork(0)
}