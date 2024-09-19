interface Scooter {
    "id"?: number;
    "serialnumber": string
    "model": string,    
    "battery":number,
    "imageUrl": string,
    "color": string,
    "status": Status,
  }
  enum Status {
    available = "Available",
    inRepair = "In Repair",
    unavailable = "Unavailable",
}

let homeContainer = document.querySelector(`#home-container`) as HTMLDivElement;
let form = document.querySelector('#form') as HTMLFormElement;
let submitButton = form.elements.namedItem('submit') as HTMLInputElement;
let table = document.querySelector(`table`) as HTMLTableElement;
const headTable = document.getElementById(`header-table`)as HTMLTableSectionElement ;
let serialnumber = document.querySelector('input[placeholder="serial Number"]') as HTMLInputElement;    
let model = document.querySelector('input[placeholder="model"]') as HTMLInputElement;
let battery = document.querySelector('input[placeholder="battery Level"]') as HTMLInputElement;
let imageUrl = document.querySelector('input[placeholder="image Url"]') as HTMLInputElement;
let color = document.querySelector('input[placeholder="color"]') as HTMLInputElement;
let statusFromForm = document.querySelector('#status') as HTMLSelectElement;

let Eform = document.querySelector(`.Edit`) as HTMLFormElement
let Eserialnumber = document.querySelector('#serial-number-edit') as HTMLInputElement;
let Emodel = document.querySelector('#model-edit') as HTMLInputElement;
let Ebattery = document.querySelector('#battery-level-edit') as HTMLInputElement;
let EimageUrl = document.querySelector('#image-url-edit') as HTMLInputElement;
let Ecolor = document.querySelector('#color-edit') as HTMLInputElement;
let Estatus = document.querySelector('#status-edit') as HTMLSelectElement;
let cancel = document.querySelector(`#cancel`) as HTMLInputElement;


let filterForm = document.querySelector(`#filter-form`) as HTMLFormElement;
let selectedFilter = document.querySelector(`#filter-by`) as HTMLSelectElement;
let inputFilter = document.querySelector(`#filter-input`) as HTMLInputElement;

let sortrForm = document.querySelector(`#sort-form`) as HTMLFormElement;
let selectedSortMethod = document.querySelector(`#sort-by`) as HTMLSelectElement;

let resetSearch = document.querySelector(`#reset-search`)as HTMLButtonElement;

let isFilterON:boolean = false;
let filteredScooters:Scooter[] = [];
let scooters: Scooter[] = [];

async function loadScooters() {
    const fetchedScooters = await fetchScooters();
    if (fetchedScooters) {
        scooters = fetchedScooters;
    }
}

async function fetchScooters(): Promise<Scooter[] | null> {
    try {
        const response = await fetch('https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter');
        if (!response.ok) {
            throw new Error('Failed to fetch scooters');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching scooters:', error);
    }
    return null;
}

function validateInputsForm() {
    return serialnumber.value && model.value && battery.value && imageUrl.value && color.value;
}

function validateInputsEform() {
    return Eserialnumber.value && Emodel.value && Ebattery.value && EimageUrl.value && Ecolor.value;
}

async function submitScooter(event:Event){
    event.preventDefault();
    const batteryLevel = parseInt(battery.value, 10)
    if(validateInputsForm()){
        let scooter:Scooter = createScooter();
        await addScooter(scooter);
        await renderPage()
    }
}

function createScooter():Scooter{
    let newScooter = {
        serialnumber: serialnumber.value,
        model: model.value,
        battery: parseInt(battery.value),
        imageUrl: imageUrl.value,
        color: color.value,
        status: Status[statusFromForm.value as keyof typeof Status],
    };
    clearForm()
    return newScooter
}

function clearForm(){
    serialnumber.value = "";
    model.value = "";
    battery.value = "";
    imageUrl.value = "";
    color.value = "";
}

async function addScooter(scooter: Scooter): Promise<void> {
    const response = await fetch('https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter', {
        method: 'POST',
        body: JSON.stringify(scooter),
        headers:{ "Content-Type": "application/json",}
    })
    if (!response.ok){
        console.error(response);
    }
}

async function addRow(scooter:Scooter, idx:number){
    
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

    const tdSImageUrl = createImgUrl(scooter.imageUrl)
    
    const tdActions = await createActions(scooter)

    tr.append(tdSerialnumber, tdModel, tdBattery, tdSImageUrl, tdColor, tdStatus, tdActions);
    table.appendChild(tr);
};

async function createActions(scooter: Scooter) {
    let btnRemove = await createDeleteBTN(scooter)

    let btnEdit = await createEditBTN(scooter)

    const td = document.createElement('td');
    td.classList.add('actionBtns');
    td.append(btnRemove, btnEdit);
    return td;
}

function createDeleteBTN(scooter:Scooter){
    const btnRemove = document.createElement('button');
    btnRemove.classList.add('action-btn');
    btnRemove.innerHTML = 'Delete';
    btnRemove.addEventListener('click', async () => await deleteScooter(scooter));
    return btnRemove;
}

function createEditBTN(scooter:Scooter){
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('action-btn');
    btnEdit.innerHTML = 'Edit';
    btnEdit.addEventListener('click', async () => await EditScooter(scooter));
    return btnEdit;
}

async function deleteScooter(scooter:Scooter): Promise<void> {
    const response = await fetch(`https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter/${scooter.id}`, { 
        method: 'DELETE',
    });
    if (!response.ok){
        console.error(response);
    }
    else{
        await renderPage();
    };
};

async function renderPage(){
    await loadScooters()
    showTable(scooters);
};

function createImgUrl(imageUrl:string){
    const tdSImageUrl = document.createElement('td');
    const url = document.createElement(`a`);
    url.target = `_blank`;
    url.innerText = `PHOTO`;
    url.href = imageUrl;
    tdSImageUrl.appendChild(url)
    return tdSImageUrl;
}

function EditScooter(scooter:Scooter){
    switchPages();
    Eserialnumber.value = scooter.serialnumber;
    Emodel.value = scooter.model;
    Ebattery.value = scooter.battery.toString();
    EimageUrl.value = scooter.imageUrl;
    Ecolor.value = scooter.color;
    Estatus.value = scooter.status.toLowerCase()
    if (scooter.id&&Eform){
        Eform.setAttribute('data-id', scooter.id.toString())
    }
        
}

function switchPages(){
    Eform.classList.toggle(`hidden`);
    homeContainer.classList.toggle(`hidden`);
}

function beckToHomePage(e:Event){
    console.log(465);
    
    e.preventDefault();
    switchPages();
}

async function saveChanges(e:Event){
    e.preventDefault()
    if(validateInputsEform()){
        let EditedScooter = {
            serialnumber: Eserialnumber.value,
            model: Emodel.value,
            battery: parseInt(Ebattery.value),
            imageUrl: EimageUrl.value,
            color: Ecolor.value,
            status: Status[Estatus.value as keyof typeof Status],
        };
        let scooterIdStr = Eform.getAttribute('data-id');
        if (scooterIdStr) {
            let scooterId = parseInt(scooterIdStr, 10);
            await updateEditedScooter(EditedScooter, scooterId);
            renderPage();
        }

        switchPages()

    }
}

async function updateEditedScooter(scooter: Scooter, id: number){
    const response = await fetch(`https://66e9784687e4176094498f4f.mockapi.io/api/v1/scooter/${id}`, {
        method: 'PUT',
        body: JSON.stringify(scooter),
        headers:{ "Content-Type": "application/json",}
    })
    if (!response.ok){
        console.error(response);
    }
}

function showTable(arrToShow:Scooter[]){
    table.innerHTML = '';
    if(scooters.length>0){
        table.appendChild(headTable)
        arrToShow.forEach((scooter, idx) => {
            addRow(scooter, idx);
        });
    };
}
    
async function filterBy(e:Event){
    e.preventDefault()
    let value = inputFilter.value;
    let filter = selectedFilter.value;
    
    if (filter !== null && filter !== "") { 
        isFilterON = true
        if (filter===`model`){
            filteredScooters = scooters.filter(sc=>sc.model == value);
        }
        else if(filter===`battery`){
            const batteryLevel:number = parseInt(value, 10)
            if(!isNaN(batteryLevel)){
                console.error(`cant filter by battery level with a number`)
            }
            filteredScooters = scooters.filter(sc=>sc.battery === batteryLevel);
        }   
        showTable(filteredScooters);
    }
}

function chooseHowToSort(e:Event){
    e.preventDefault();
    if (isFilterON){
        sortBy(filteredScooters);
    }
    else{
        sortBy(scooters);
    }
}

function sortBy(arrToSort:Scooter[]){
    let sort = selectedSortMethod.value;
    console.log(sort);
    
    if (sort == `model`){
        arrToSort.sort((a, b) => a.model.localeCompare(b.model));
    }
    if (sort == `battery`){
        arrToSort.sort((a, b) => b.battery - a.battery);
    }
    if (sort == `serialNumber`){
        arrToSort.sort((a, b) => a.serialnumber.localeCompare(b.serialnumber));
    }
    showTable(arrToSort);
}

async function reserSearchConteiner(){
    renderPage();
    isFilterON = false;
}

renderPage()
cancel.addEventListener(`click`, (e)=> beckToHomePage(e))
form.addEventListener('submit', submitScooter);
Eform.addEventListener(`submit`, saveChanges)
filterForm.addEventListener(`submit`, filterBy)
sortrForm.addEventListener(`submit`, chooseHowToSort)
resetSearch.addEventListener(`click`, reserSearchConteiner)
