const deleteText = document.querySelectorAll('.fa-trash')

Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteEmployee)
})

async function deleteEmployee(){
    const parent = this.parentNode;
    const eName = parent.querySelector(".employee-name").innerText;
    const eHours = parent.querySelector(".employee-hours").innerText;
    const eStartDate = parent.querySelector(".employee-start-date").innerText;
    const eShift = parent.querySelector(".employee-shift").innerText;
    
    console.log(eName, eHours, eStartDate, eShift); //check
    try{
        const response = await fetch('deleteEmployee', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'currName': eName,
              'currHours': eHours,
              'currStartDate': eStartDate,
              'currShift': eShift
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}