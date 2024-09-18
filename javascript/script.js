"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Status;
(function (Status) {
    Status["available"] = "Available";
    Status["inRepair"] = "In Repair";
    Status["unavailable"] = "Unavailable";
})(Status || (Status = {}));
let homeContainer = document.querySelector(`#home-container`);
let form = document.querySelector('#form');
let submitButton = form.elements.namedItem('submit');
let table = document.querySelector(`table`);
const headTable = document.getElementById(`header-table`);
let serialnumber = document.querySelector('input[placeholder="serial Number"]');
let model = document.querySelector('input[placeholder="model"]');
let battery = document.querySelector('input[placeholder="battery Level"]');
let imageUrl = document.querySelector('input[placeholder="image Url"]');
let color = document.querySelector('input[placeholder="color"]');
let statusFromForm = document.querySelector('#status');
let Eform = document.querySelector(`.Edit`);
let Eserialnumber = document.querySelector('#serial-number-edit');
let Emodel = document.querySelector('#model-edit');
let Ebattery = document.querySelector('#battery-level-edit');
let EimageUrl = document.querySelector('#image-url-edit');
let Ecolor = document.querySelector('#color-edit');
let Estatus = document.querySelector('#status-edit');
let cancel = document.querySelector(`#cancel`);
let filterForm = document.querySelector(`#filter-form`);
let selectedFilter = document.querySelector(`#filter-by`);
let inputFilter = document.querySelector(`#filter-input`);
let sortrForm = document.querySelector(`#sort-form`);
let selectedSortMethod = document.querySelector(`#sort-by`);
let resetSearch = document.querySelector(`#reset-search`);
let isFilterON = false;
let filteredScooters = [];
let scooters = [];
function loadScooters() {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchedScooters = yield fetchScooters();
        if (fetchedScooters) {
            scooters = fetchedScooters;
        }
    });
}
function fetchScooters() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter');
            if (!response.ok) {
                throw new Error('Failed to fetch scooters');
            }
            return yield response.json();
        }
        catch (error) {
            console.error('Error fetching scooters:', error);
        }
        return null;
    });
}
function validateInputsForm() {
    return serialnumber.value && model.value && battery.value && imageUrl.value && color.value;
}
function validateInputsEform() {
    return Eserialnumber.value && Emodel.value && Ebattery.value && EimageUrl.value && Ecolor.value;
}
function submitScooter(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const batteryLevel = parseInt(battery.value, 10);
        if (validateInputsForm() && isBatteryLevelValid(batteryLevel)) {
            let scooter = createScooter();
            yield addScooter(scooter);
            yield renderPage();
        }
    });
}
function createScooter() {
    let newScooter = {
        serialnumber: serialnumber.value,
        model: model.value,
        battery: parseInt(battery.value),
        imageUrl: imageUrl.value,
        color: color.value,
        status: Status[statusFromForm.value],
    };
    clearForm();
    return newScooter;
}
function isBatteryLevelValid(battery) {
    return battery >= 0 && battery <= 100;
}
function clearForm() {
    serialnumber.value = "";
    model.value = "";
    battery.value = "";
    imageUrl.value = "";
    color.value = "";
}
function addScooter(scooter) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter', {
            method: 'POST',
            body: JSON.stringify(scooter),
            headers: { "Content-Type": "application/json", }
        });
        if (!response.ok) {
            console.error(response);
        }
    });
}
function addRow(scooter, idx) {
    return __awaiter(this, void 0, void 0, function* () {
        let tr = document.createElement('tr');
        const tdSerialnumber = document.createElement('td');
        tdSerialnumber.innerText = scooter.serialnumber;
        const tdModel = document.createElement('td');
        tdModel.innerText = scooter.model;
        const tdBattery = document.createElement('td');
        tdBattery.innerText = scooter.battery.toString();
        const tdColor = document.createElement('td');
        tdColor.innerText = scooter.color;
        const tdStatus = document.createElement('td');
        tdStatus.innerText = scooter.status;
        const tdSImageUrl = createImgUrl(scooter.imageUrl);
        const tdActions = yield createActions(scooter);
        tr.append(tdSerialnumber, tdModel, tdBattery, tdSImageUrl, tdColor, tdStatus, tdActions);
        table.appendChild(tr);
    });
}
;
function createActions(scooter) {
    return __awaiter(this, void 0, void 0, function* () {
        let btnRemove = yield createDeleteBTN(scooter);
        let btnEdit = yield createEditBTN(scooter);
        const td = document.createElement('td');
        td.classList.add('actionBtns');
        td.append(btnRemove, btnEdit);
        return td;
    });
}
function createDeleteBTN(scooter) {
    const btnRemove = document.createElement('button');
    btnRemove.classList.add('action-btn');
    btnRemove.innerHTML = 'Delete';
    btnRemove.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () { return yield deleteScooter(scooter); }));
    return btnRemove;
}
function createEditBTN(scooter) {
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('action-btn');
    btnEdit.innerHTML = 'Edit';
    btnEdit.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () { return yield EditScooter(scooter); }));
    return btnEdit;
}
function deleteScooter(scooter) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter/${scooter.id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error(response);
        }
        else {
            yield renderPage();
        }
        ;
    });
}
;
function renderPage() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadScooters();
        showTable(scooters);
    });
}
;
function createImgUrl(imageUrl) {
    const tdSImageUrl = document.createElement('td');
    const url = document.createElement(`a`);
    url.target = `_blank`;
    url.innerText = `PHOTO`;
    url.href = imageUrl;
    tdSImageUrl.appendChild(url);
    return tdSImageUrl;
}
function EditScooter(scooter) {
    switchPages();
    Eserialnumber.value = scooter.serialnumber;
    Emodel.value = scooter.model;
    Ebattery.value = scooter.battery.toString();
    EimageUrl.value = scooter.imageUrl;
    Ecolor.value = scooter.color;
    Estatus.value = scooter.status.toLowerCase();
    if (scooter.id && Eform) {
        Eform.setAttribute('data-id', scooter.id.toString());
    }
}
function switchPages() {
    Eform.classList.toggle(`hidden`);
    homeContainer.classList.toggle(`hidden`);
}
function beckToHomePage(e) {
    console.log(465);
    e.preventDefault();
    switchPages();
}
function saveChanges(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (validateInputsEform()) {
            let EditedScooter = {
                serialnumber: Eserialnumber.value,
                model: Emodel.value,
                battery: parseInt(Ebattery.value),
                imageUrl: EimageUrl.value,
                color: Ecolor.value,
                status: Status[Estatus.value],
            };
            let scooterIdStr = Eform.getAttribute('data-id');
            if (scooterIdStr) {
                let scooterId = parseInt(scooterIdStr, 10);
                yield updateEditedScooter(EditedScooter, scooterId);
                renderPage();
            }
            switchPages();
        }
    });
}
function updateEditedScooter(scooter, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter/${id}`, {
            method: 'PUT',
            body: JSON.stringify(scooter),
            headers: { "Content-Type": "application/json", }
        });
        if (!response.ok) {
            console.error(response);
        }
    });
}
function showTable(arrToShow) {
    table.innerHTML = '';
    if (scooters.length > 0) {
        table.appendChild(headTable);
        arrToShow.forEach((scooter, idx) => {
            addRow(scooter, idx);
        });
    }
    ;
}
function filterBy(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        let value = inputFilter.value;
        let filter = selectedFilter.value;
        if (filter !== null && filter !== "") {
            isFilterON = true;
            if (filter === `model`) {
                filteredScooters = scooters.filter(sc => sc.model == value);
            }
            else if (filter === `battery`) {
                filteredScooters = scooters.filter(sc => sc.battery === parseInt(value, 10));
            }
            showTable(filteredScooters);
        }
    });
}
function chooseHowToSort(e) {
    e.preventDefault();
    if (isFilterON) {
        sortBy(filteredScooters);
    }
    else {
        sortBy(scooters);
    }
}
function sortBy(arrToSort) {
    let sort = selectedSortMethod.value;
    console.log(sort);
    if (sort == `model`) {
        arrToSort.sort((a, b) => a.model.localeCompare(b.model));
    }
    if (sort == `battery`) {
        arrToSort.sort((a, b) => b.battery - a.battery);
    }
    if (sort == `serialNumber`) {
        arrToSort.sort((a, b) => a.serialnumber.localeCompare(b.serialnumber));
    }
    showTable(arrToSort);
}
function reserSearchConteiner() {
    return __awaiter(this, void 0, void 0, function* () {
        renderPage();
        isFilterON = false;
    });
}
renderPage();
cancel.addEventListener(`click`, (e) => beckToHomePage(e));
form.addEventListener('submit', submitScooter);
Eform.addEventListener(`submit`, saveChanges);
filterForm.addEventListener(`submit`, filterBy);
sortrForm.addEventListener(`submit`, chooseHowToSort);
resetSearch.addEventListener(`click`, reserSearchConteiner);
