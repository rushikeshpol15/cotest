const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

//for fetching information
async function fetchData()
{
    try {
        let ApiResposnseWIthoutJson=await fetch('https://fedskillstest.coalitiontechnologies.workers.dev',{
            headers:{
                'Authorization':'Basic '+ btoa('coalition:skills-test')
            }
        })

        let APIResponse=await ApiResposnseWIthoutJson.json();

        let patients=[];
        let jessicaInfo={};

        APIResponse.forEach((element,index)=>{
                if(element.name!='Jessica Taylor')
                {
                    patients.push(element);
                }
                else{
                    jessicaInfo=element;
                }
        })

        updateDomElementsWithAPIData(patients,jessicaInfo);   //passing patients for sidebar and jessica for remaining chart and details

    } catch (error) {
        console.log(error);
    }
}

function updateDomElementsWithAPIData(patients,jessicaInfo)         //to update the element into the dom
{
    let sidebarMemberContainer=document.querySelector('.sidebar-member-container');

    // let data=patients.map((element)=>{
    //     return `
    //     <div class="d-flex align-items-center justify-content-between">
    //         <img src="${element.profile_picture}" class="patient-profile-picture" alt="image"/>
    //         <div class="ms-3 flex-grow-1">
    //             <div class="patient-name">${element.name}</div>
    //             <div class="patient-gender-age">${element.gender}, ${element.age}</div>
    //         </div>
    //         <img src="Images/more_horiz.png" class="patient-more-button" alt="image"/>
    //     </div>`;
    // });

    

    patients.forEach((element)=>{                               //sidebar patient info
        let patientnameimgcontainer=document.createElement('div');
        patientnameimgcontainer.classList.add('d-flex', 'align-items-center', 'justify-content-between','my-3');

        let imgTag=document.createElement('img');
        imgTag.src=element.profile_picture;
        imgTag.classList.add('patient-profile-picture');


        let nameandgenderbox=document.createElement('div');
        nameandgenderbox.classList.add('ms-2', 'flex-grow-1');

        let patientname=document.createElement('div');
        patientname.classList.add('patient-name');
        patientname.innerText=element.name;

        let patientgenderage=document.createElement('div');
        patientgenderage.classList.add('patient-gender-age');
        patientgenderage.innerText=element.name+' , '+element.age;

        nameandgenderbox.appendChild(patientname);
        nameandgenderbox.appendChild(patientgenderage);

        let moreimgTag=document.createElement('img');
        moreimgTag.src="Images/more_horiz.png";
        moreimgTag.classList.add('patient-more-button');

        patientnameimgcontainer.appendChild(imgTag);
        patientnameimgcontainer.appendChild(nameandgenderbox);
        patientnameimgcontainer.appendChild(moreimgTag);


        sidebarMemberContainer.appendChild(patientnameimgcontainer);

    })
    


    //jessica profile picture and other personal details 
    let jessicaImg=document.querySelector('.jessica-image');
    jessicaImg.src=jessicaInfo.profile_picture;

    let jesscaName=document.getElementById('jessica-name');
    jesscaName.innerHTML=jessicaInfo.name;

    let DoB=document.getElementById('DoB');
    let Gender=document.getElementById('Gender');
    let Contact=document.getElementById('Contact');
    let Emergency=document.getElementById('Emergency');
    let Insurance=document.getElementById('Insurance');


    const date = new Date(jessicaInfo.date_of_birth);

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    DoB.innerHTML= `${month} ${day}, ${year}`;
    Gender.innerHTML=jessicaInfo.gender;
    Contact.innerHTML=jessicaInfo.phone_number;
    Emergency.innerHTML=jessicaInfo.emergency_contact;
    Insurance.innerHTML=jessicaInfo.insurance_type;


    //lab result 
    let labresultMainContainer=document.querySelector('.lab-result-info-box');
    jessicaInfo.lab_results.forEach((element)=>{
        let labresultcontainer=document.createElement('div');
        labresultcontainer.classList.add('d-flex', 'align-items-center', 'justify-content-between','my-2','p-3');
        
        let labresultcontent=document.createElement('div');
        labresultcontent.classList.add('lab-result-content');
        labresultcontent.innerText=element;

        let downloadimg=document.createElement('img');
        downloadimg.src="Images/download.png";
        downloadimg.style.width="20px";
        downloadimg.style.height="20px";

        labresultcontainer.appendChild(labresultcontent);
        labresultcontainer.appendChild(downloadimg);

        labresultMainContainer.appendChild(labresultcontainer);
        
    })
    

    let dignosticlistgrid=document.querySelector('.dignostic-list-grid');

    //dignosis list
    jessicaInfo.diagnostic_list.forEach(element=>{
        
        let proeblem=document.createElement('div');
        proeblem.classList.add('my-3','jessica-info-titles');
        proeblem.innerText=element.name;

        let description=document.createElement('div');
        description.classList.add('my-3','jessica-info-titles');
        description.innerText=element.description;

        let status=document.createElement('div');
        status.classList.add('my-3','jessica-info-titles');
        status.innerText=element.status;

        dignosticlistgrid.appendChild(proeblem);
        dignosticlistgrid.appendChild(description);
        dignosticlistgrid.appendChild(status);

    })

    const diagnosisHistorytemp = jessicaInfo.diagnosis_history;                                     //getting the digonsis history from above jessica info
    const diagnosisHistory=diagnosisHistorytemp.filter((records,index)=>index<=5).reverse();        //to get only first 6 records
    const months = diagnosisHistory.map(entry => `${entry.month.substring(0,3)} ${entry.year}`);    //for chart x axis month and year
    const systolicValues = diagnosisHistory.map(entry => entry.blood_pressure.systolic.value);      //for chart systolic values
    const diastolicValues = diagnosisHistory.map(entry => entry.blood_pressure.diastolic.value);    //for chart distolic values

    const ctx = document.getElementById('bloodPressureChart').getContext('2d');
    const bloodPressureChart = new Chart(ctx, {             //from chart.js
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '',
                    data: systolicValues,
                    borderColor: '#E66FD2',
                    backgroundColor: 'rgba(255, 99, 132)',
                    fill: false,
                    tension: 0.5
                },
                {
                    label: '',
                    data: diastolicValues,
                    borderColor: '#8C6FE6',
                    backgroundColor: 'rgba(54, 162, 235)',
                    fill: false,
                    tension: 0.5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {                  //to remove default square box label 
                legend: {
                  labels: {
                    boxWidth: 0
                  }
                }
              },
            scales: {
                y: {
                    beginAtZero: false,
                    min:60,
                },
                x: {                           
                }
            }
        }
    });

}

document.addEventListener('DOMContentLoaded',fetchData);        //fetching api after DOM loaded
