const jobListObg = [];
const allJobList = document.querySelector('#all-job-list');

function allJobListDisplay(jobListObg){
    allJobList.innerHTML = jobListObg.map((data) => {
        let jobTypeStyle = '#FF8A00';

        if(data.type === 'Full Time'){
            jobTypeStyle = '#FF8A00';
        }else if(data.type === 'Internship'){
            jobTypeStyle = '#FF5757';
        }else if(data.type === 'Remote'){
            jobTypeStyle = '#56E5C4';
        }

        return `
            <div class="lws-single-job">
                <div class="flex-1 min-w-0">
                    <h2 class="lws-title">${data.title}</h2>
                    <div class="job-footers">
                        <div class="lws-type">
                            <!-- Fulltime - #FF8A00,  --><!-- Internship - #FF5757,  --><!-- Remote - #56E5C4,  -->
                            <i class="fa-solid fa-stop !text-[${jobTypeStyle}] text-lg mr-1.5"></i>
                            ${data.type}
                        </div>
                        <div class="lws-salary">
                            <i class="fa-solid fa-bangladeshi-taka-sign text-slate-400 text-lg mr-1.5"></i>
                            BDT ${data.salary.toLocaleString()}
                        </div>
                        <div class="lws-deadline">
                            <i class="fa-regular fa-calendar text-slate-400 text-lg mr-1.5"></i>
                            Closing on ${data.deadline}
                        </div>
                    </div>
                </div>
                <div class="mt-5 flex lg:mt-0 lg:ml-4">
                    <span class="hidden sm:block">
                        <button type="button" class="lws-edit btn btn-primary" onclick="jobEdit(event, ${data.id})">
                            <i class="fa-solid fa-pen text-gray-300 -ml-1 mr-2"></i>
                            Edit
                        </button>
                    </span>

                    <span class="sm:ml-3">
                        <button type="button" class="lws-delete btn btn-danger" onclick="jobDelete(event, ${data.id})">
                            <i class="fa-solid fa-trash text-gray-300 -ml-1 mr-2"></i>
                            Delete
                        </button>
                    </span>
                </div>
            </div>`;
    }).join('');
}

async function getJobListData(){
    try {
		let response = await fetch('http://localhost:9000/jobs', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
		const result = await response.json();

		[].splice.apply(jobListObg, [0, jobListObg.length].concat(result)); 
		
        allJobListDisplay(jobListObg);
		
        console.log(result);
	} catch (error) {
		console.log(error);
	}
}


window.onload = getJobListData();

// Job lws-searchJob
const lwsSearchJob = document.querySelector('#lws-searchJob');
lwsSearchJob.addEventListener('input', searchDelay(() =>{
    indexPageDisplay();
    allJobListSearch(lwsSearchJob.value);
},500));

function searchDelay(fn, delay){
    let delayTimeId;
    return function (){
        if(delayTimeId){
            clearTimeout(delayTimeId);
        }
        delayTimeId = setTimeout(fn, delay);
    }
}

const lwsSortSalary = document.querySelector('#lws-sort');
function currentShotItemCheck(){
    if(lwsSortSalary.value == "asc" || lwsSortSalary.value == "desc"){
        return `&_sort=salary&_order=${lwsSortSalary.value}`;

    }
    return '';
}


async function JobFinderSalaryShort(dataValue, cbFu){
    
    let UrlQuary = "";
    if(dataValue != ''){
        UrlQuary = `title_like=${dataValue}`;
    }
    const subMenuActive = document.querySelector('.sub-menu-acrive');

    let response;
    if(subMenuActive && subMenuActive.innerText.trim() === 'Internship'){
       response =  await fetch(`http://localhost:9000/jobs/?type=Internship&${UrlQuary}`);
    }else if(subMenuActive && subMenuActive.innerText.trim() === 'Full Time'){
        response =  await fetch(`http://localhost:9000/jobs/?type=Full%20Time&${UrlQuary}`);
    }else if(subMenuActive && subMenuActive.innerText.trim() === 'Remote'){
         response =  await fetch(`http://localhost:9000/jobs/?type=Remote&${UrlQuary}`);
    }else{
        response =  await fetch(`http://localhost:9000/jobs/?${UrlQuary}`);
    }

    const jobsortData = [...await response.json()]; 
    const lwsSort = document.querySelector('#lws-sort');

    if(lwsSort.value === 'high-to-low'){
        jobsortData.sort((a, b) => (parseInt(a.salary) < parseInt(b.salary)) ? 1 : -1);
    }else if(lwsSort.value === 'low-to-high'){
        jobsortData.sort((a, b) => (parseInt(a.salary) > parseInt(b.salary)) ? 1 : -1);
    }

    return jobsortData;
}

async function allJobListSearch(data){     
    let jobsortData = await JobFinderSalaryShort(data, currentShotItemCheck);

    if(jobsortData.length != 0){
        allJobListDisplay(jobsortData);
    }else{
        allJobList.innerHTML = `
        <div class="lws-single-job">
            <div class="flex-1 min-w-0">
                <h2 class="lws-title">Job Not Found</h2>
            </div>
        </div>`;
    }
}


// tab search
function subMenuDacrive(){
    document.querySelector('#lws-searchJob').value = '';
    const subMenu = document.querySelectorAll('.sub-menu');
    subMenu.forEach(data =>{
        data.classList.remove('sub-menu-acrive');
    });
}

document.getElementById('lws-alljobs-menu').addEventListener('click', (e)=>{
    e.preventDefault();
    subMenuDacrive();
    indexPageDisplay();
    allJobListDisplay(jobListObg);
});

document.getElementById('lws-internship-menu').addEventListener('click', async(e)=>{
    e.preventDefault();
    subMenuDacrive()

    e.target.classList.add('sub-menu-acrive');
    
    indexPageDisplay();
    
    const response =  await fetch(`http://localhost:9000/jobs/?type=Internship${currentShotItemCheck()}`);
    const result = await response.json();

    allJobListDisplay(result);
});


document.getElementById('lws-fulltime-menu').addEventListener('click', async(e)=>{
    e.preventDefault();
    subMenuDacrive()

    e.target.classList.add('sub-menu-acrive');

    indexPageDisplay();
    const response =  await fetch(`http://localhost:9000/jobs/?type=Full%20Time${currentShotItemCheck()}`);
    const result = await response.json();
    allJobListDisplay(result);
});

document.getElementById('lws-remote-menu').addEventListener('click', async(e)=>{
    e.preventDefault();
    subMenuDacrive()

    e.target.classList.add('sub-menu-acrive');

    indexPageDisplay();
    const response =  await fetch(`http://localhost:9000/jobs/?type=Remote${currentShotItemCheck()}`);
    const result = await response.json();
    allJobListDisplay(result);
});


document.getElementById('lws-sort').addEventListener('change', async(e)=>{
    e.preventDefault();
    
    indexPageDisplay();

    

    let jobsortData = await JobFinderSalaryShort(lwsSearchJob.value, currentShotItemCheck);
    
    allJobListDisplay(jobsortData);
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const indexPage = document.querySelector('#index-page');
const addJobPage = document.querySelector('#add-job-page');
const editJobPage = document.querySelector('#edit-job-page');

function indexPageDisplay(){
    indexPage.classList.remove('hidden');
    addJobPage.classList.add('hidden');
    editJobPage.classList.add('hidden');
}

function addJobPageDisplay(){
    indexPage.classList.add('hidden');
    addJobPage.classList.remove('hidden');
    editJobPage.classList.add('hidden');
}

function editJobPageDisplay(){
    indexPage.classList.add('hidden');
    addJobPage.classList.add('hidden');
    editJobPage.classList.remove('hidden');
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

document.querySelector('#lws-addJob-menu').addEventListener('click', (e)=>{
    e.preventDefault();
    addJobPageDisplay();
});


const addJobForm = document.querySelector('#add-job-form');
addJobForm.onsubmit = async function(event){
    event.preventDefault();

    const title = document.querySelector('#lws-JobTitle');
    const type = document.querySelector('#lws-JobType');
    const salary = document.querySelector('#lws-JobSalary');
    const deadline = document.querySelector('#lws-JobDeadline');

    const formData = {
        title : title.value,
        type : type.value,
        salary : salary.value,
        deadline : deadline.value,
    }

    const headers = new Headers({'Content-Type': 'application/json'});
    let response = await fetch("http://localhost:9000/jobs", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: headers,
    });

    // get response
    let result = await response.json();
    console.log(result);

    indexPageDisplay();
    let jobsortData = await JobFinderSalaryShort('', currentShotItemCheck);
    allJobListDisplay(jobsortData);

    title.value = '';
    type.value = '';
    salary.value = '';
    deadline.value = '';

    
}



async function jobEdit(event, jobID){
    event.preventDefault();
    editJobPageDisplay();

    const headers = new Headers({'Content-Type': 'application/json'});
    let response = await fetch(`http://localhost:9000/jobs/${jobID}`, {
        method: "GET",
        headers: headers,
    });

    // get response
    let result = await response.json();
    console.log(result);

    document.querySelector('#editLws-JobID').value = result.id;
    document.querySelector('#editLws-JobTitle').value = result.title;
    document.querySelector('#editLws-JobType').value = result.type;
    document.querySelector('#editLws-JobSalary').value = result.salary;
    document.querySelector('#editLws-JobDeadline').value = result.deadline;

}


async function jobDelete(event, jobID){
    event.preventDefault();

    const headers = new Headers({'Content-Type': 'application/json'});
    let response = await fetch(`http://localhost:9000/jobs/${jobID}`, {
        method: "DELETE",
        headers: headers,
    });

    // get response
    let result = await response.json();
    console.log(result);

    indexPageDisplay();
    let jobsortData = await JobFinderSalaryShort('', currentShotItemCheck);
    allJobListDisplay(jobsortData);
}



const editJobForm = document.querySelector('#edit-job-form');
editJobForm.onsubmit = async function(event){
    event.preventDefault();


    const jobID = document.querySelector('#editLws-JobID').value;
    const title = document.querySelector('#editLws-JobTitle');
    const type = document.querySelector('#editLws-JobType');
    const salary = document.querySelector('#editLws-JobSalary');
    const deadline = document.querySelector('#editLws-JobDeadline');

    const formData = {
        // id: jobID,
        title : title.value,
        type : type.value,
        salary : salary.value,
        deadline : deadline.value,
    }

    // alert(JSON.stringify(formData));
    const headers = new Headers({'Content-Type': 'application/json'});
    let response = await fetch(`http://localhost:9000/jobs/${jobID}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: headers,
    });

    // get response
    let result = await response.json();
    console.log(result);

    indexPageDisplay();

    let jobsortData = await JobFinderSalaryShort(lwsSearchJob.value, currentShotItemCheck);
    allJobListDisplay(jobsortData);
    
}

const lwsJobType = document.querySelector('#lws-JobType');
document.querySelector("#lws-addJob-menu").addEventListener('click', (e)=>{
    
    const subMenuActive = document.querySelector('.sub-menu-acrive');

    if(subMenuActive && subMenuActive.innerText.trim() === 'Internship'){
        lwsJobType.value = 'Internship';
        lwsJobType.disabled = true;
    }else if(subMenuActive && subMenuActive.innerText.trim() === 'Full Time'){
        lwsJobType.value = 'Full Time';
        lwsJobType.disabled = true;
    } else if(subMenuActive && subMenuActive.innerText.trim() === 'Remote'){
        lwsJobType.value = 'Remote';
        lwsJobType.disabled = true;
    }else{
        lwsJobType.disabled = false;
    }
});