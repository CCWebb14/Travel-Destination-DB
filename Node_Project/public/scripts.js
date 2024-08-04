
//Inputs required: elementID of an element that contains text
//Purpose: sanitize text input from an element
//Returns: element text converted to lowercase
function retrieveAndSanitizeText(elementID) {
    return document.getElementById(elementID).value.toLowerCase();
}

async function countAttractions() {
    const province = retrieveAndSanitizeText('provinceInput');
    const city = retrieveAndSanitizeText('cityInput');

    if (!province || !city) {
        alert("Please enter both province and city.");
        return;
    }

    try {
        const response = await fetch('/count-attractions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ province: province, city: city })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        if (data.success) {
            alert(`There are ${data.count} attractions in ${city}, ${province}.`);
        } else {
            alert("Failed to count attractions.");
        }
    } catch (error) {
        alert("Error counting attractions: " + error.message);
    }
}


//Purpose: retrieves values from html file, triggers get method, then triggers display method
async function findAndDisplayAttractions() {
    const inputProvince = retrieveAndSanitizeText('provinceInput');
    const inputCity = retrieveAndSanitizeText('cityInput');

    if (!inputProvince || !inputCity) {
        alert("enter province or city");
        return;
    }

    try {
        const attractions = await getAttractions(inputProvince, inputCity);
        displayAttractionsOnTable(attractions);
        alert("Filtered data retrieved");
    } catch (error) {
        alert("problem retrieving info");
    }
}

//Inputs required: province and city
//Purpose: Performs a GET request and returns parsed JSON for diplsaying on main page.Throws error for try-catch if not found
//NOTE: response JSON should only contain attraction Name, ID, and Star Rating
async function getAttractions(provinceInput, cityInput) {

    // ON THE BACKEND ONLY RETURN NAME, ID, STAR RATING!
    const response = await fetch('/get-attractions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            province: provinceInput,
            city: cityInput
        })
    })

    if (!response.ok) {
        throw new Error();
    }

    const parsedValue = await response.json();
    return parsedValue.data;
}

//Inputs required: attractions in form of JSON
//Purpose: Displays JSON data in the main page by adding each object into a row
async function displayAttractionsOnTable(attractions) {
    const attractionTable = document.getElementById('attractionresultstable');
    const tableBody = attractionTable.querySelector('tbody');

    //clear old data before displaying
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    attractions.forEach(attraction => {
        // Destructuring assignment of attraction JSON
        const [attractionID, attractionName] = attraction;

        //create row
        const newRow = tableBody.insertRow();

        const nameCell = newRow.insertCell(0);
        nameCell.textContent = attractionName; // TODO: NOTE THIS IS JUST A PLACEHOLDER, CHANGE LATER OTHERWISE THERE WILL BE BUGS

        const idCell = newRow.insertCell(1);
        idCell.textContent = attractionID;  // TODO: NOTE THIS IS JUST A PLACEHOLDER, CHANGE LATER OTHERWISE THERE WILL BE BUGS
    })
}

//Purpose: Extracts attraction data, triggers POST request
async function addNewAttractionSubmit() {
    const name = retrieveAndSanitizeText('insertName')
    const description = retrieveAndSanitizeText('insertDescription');
    const open = retrieveAndSanitizeText('insertOpen');
    const close = retrieveAndSanitizeText('insertClose');
    const lat = document.getElementById('insertLat').value;
    const long = document.getElementById('insertLon').value;
    const category = retrieveAndSanitizeText('chooseCat');
    const province = retrieveAndSanitizeText('insertProv');
    const city = retrieveAndSanitizeText('insertCity');

    // TODO: checking valid inputs, ex 5 decimal places for lat and long

    const attractionJson = {
        name: name,
        description: description,
        open: open,
        close: close,
        lat: lat,
        long: long,
        category: category,
        province: province,
        city: city
    }

    try {
        addAttraction(attractionJson);
        alert("New attraction added!");
    } catch (error) {
        alert('failed to insert data');
    }
}

//Input: Attraction in JSON format
//Purpose: Deliver a POST request to add into database
async function addAttraction(attraction) {

    //TODO: PLUG IN ROUTING AFTER COMPLETING BACKEND
    const response = await fetch("/add-attraction", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attraction)
    });

    if (!response.ok) {
        throw new Error();
    }

    console.log("add successful"); // debugging purposes
}


//Purpose: Fetch,Repopulate, and display table with .sql file data
async function repopulatedata() {

    //TODO: add path to route for default data
    const response = await fetch("/intiate-table");

    if (!response.ok) {
        alert("Repopulation not completed properly");
        return;
    }
    const responseJson = await response.json();
    displayAttractionsOnTable(responseJson); //HELPER FUNCTION ALREADY DEFINED
    alert("Data repopulated!");
}

async function countAttractionsHaving() {
    const province = document.getElementById('provinceInput').value;
    const city = document.getElementById('cityInput').value;
    const minCount = 2;  // You can change this value or get it from user input if needed

    if (!province || !city) {
        alert("Please enter both province and city.");
        return;
    }

    try {
        const response = await fetch('/count-attractions-having', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ province: province, city: city, minCount: minCount })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        if (data.success) {
            alert(`Cities with more than ${minCount} attractions: ${JSON.stringify(data.data)}`);
        } else {
            alert("Failed to count attractions with HAVING clause.");
        }
    } catch (error) {
        alert("Error counting attractions with HAVING clause: " + error.message);
    }
}

async function getAvgAttractionsPerProvince() {
    try {
        const response = await fetch('/avg-attractions-per-province', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        if (data.success) {
            alert(`Average attractions per province: ${JSON.stringify(data.data)}`);
        } else {
            alert("Failed to get average attractions per province.");
        }
    } catch (error) {
        alert("Error getting average attractions per province: " + error.message);
    }
}


//Purpose: Counts number of tuples
async function countAttractions() {

    const provinceInput = document.getElementById('provinceInput').value;
    const cityInput = document.getElementById('cityInput').value;

    const response = await fetch('/count-attractions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            province: provinceInput,
            city: cityInput
        })
    })
    console.log(response);
    if (!response.ok) {
        alert("Count not completed");
        return;
    }

    const responseData = await response.json();

    alert(`Theres currently ${responseData.count} number of attractions`);
}

//Purpose: Handles update button press
async function updateAttractionAction() {
    const activityId = document.getElementById('idModify').value;
    const newname = document.getElementById('newinsertName').value;
    const newlat = document.getElementById('newinsertLat').value;
    const newlong = document.getElementById('newinsertLon').value;
    const newopen = document.getElementById('newinsertOpen').value;
    const newclose = document.getElementById('newinsertClose').value;
    const newdescription = document.getElementById('newinsertDescription').value;
    const newcategory = document.getElementById('newchooseCat').value;


    // TODO: ensure that these json values are good
    const attractionJson = {
        id: activityId,
        newname: newname,
        newlat: newlat,
        newlong: newlong,
        newopen: newopen,
        newclose: newclose,
        newdescription: newdescription,
        newcategory: newcategory
    }

    try {
        updateDbAttraction(attractionJson);
        alert('Attraction info successfully updated');
    } catch (error) {
        alert('Attraction failed to update')
    }
}

//Purpose: Executes PUT request to backend to update
// TODO: COMPLETE THIS METHOD
async function updateDbAttraction(attractionJson) {
    const response = await fetch("XYZ", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

//Purpose: Obtains ID to delete and sends DELETE request
async function deleteAttraction() {
    const attractionID = document.getElementById('idToDelete').value;

    try {
        await executeDelete(attractionID);
        alert("Attraction deleted!")
    } catch (error) {
        alert("Deletion failed to execute.");
    }
}

//Inputs: AttractionID string
async function executeDelete(attractionID) {
    const response = await fetch('/delete-attraction', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attractionID: attractionID })
    })

    if (!response.ok) {
        throw new Error();
    }
}

//Purpose: Execute GET request that fulfills price criteria
async function findSuitableBudget() {
    const price = document.getElementById('priceTarget').value;
    const comparison = document.getElementById('chooseComparison').value;

    console.log(price);
    console.log(comparison);

    try {
        const filteredExperiences = await filterBudget(price, comparison);
        console.log(filteredExperiences);
        displayFilteredExperiences(filteredExperiences);
        alert('Experiences Filtered');
    } catch (error) {
        alert('Problem with filtering');
    }
}

//Purpose: Sends GET request, returns experiences filtered
async function filterBudget(price, comparison) {
    const response = await fetch('/filter-experiences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ price: price,  comparison: comparison})
    })

    if (!response.ok) {
        throw new Error();
    }
    const filteredData = await response.json();

    return filteredData.filteredExperiences;
}

//Purpose: Display experiences on UI
//TODO: Complete
async function displayFilteredExperiences(filteredExperiences) {
    const budgetTable = document.getElementById('budgettable');
    const tableBody = budgetTable.querySelector('tbody');


    //clear old data before displaying
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    console.log(Array.isArray(filteredExperiences));

    filteredExperiences.forEach(experience => {

        const [experienceID, experienceName, price] = experience;

        //create row
        const newRow = tableBody.insertRow();

        const nameCell = newRow.insertCell(0);
        nameCell.textContent = experienceID; 

        const idCell = newRow.insertCell(1);
        idCell.textContent = experienceName;  

        const priceCell = newRow.insertCell(2);
        priceCell.textContent = price;
    })
}

//Purpose: Executes GET request with PROJECTIONS with selected checkboxes
async function projectExperiencesCheckbox() {
    const attractionID = document.getElementById("filterAttractionExperience").value;
    console.log(attractionID);
    const experienceCheckboxes = document.querySelectorAll('#experienceFilter .form-check-input');
    //note selectedBoxes is an array that will be sent for projection 
    const selectedBoxes = [];

    experienceCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedBoxes.push(checkbox.value);
        }
    });

    const experienceJSON = {
        attractionID: attractionID,
        selectedBoxes: selectedBoxes
    }

    console.log(selectedBoxes);

    if (experienceCheckboxes.length === 0) {
        alert("Please select at least 1 attribute");
        return;
    }

    try {
        const responseData = await fetchProjectionExperiences(experienceJSON);
        console.log(responseData); //testing
        addExperiencesToDynamicTable(selectedBoxes, responseData);
    } catch (error) {
        alert("Not filtered properly");
    }

}

//Purpose: Sends JSON attributes for a PROJECTION query
async function fetchProjectionExperiences(experienceJSON) {

    const response = await fetch('/project-tables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(experienceJSON)
    })

    if (!response.ok) {
        throw new Error();
    }

    return response.json();
}

// Inputs: array[selectedboxes], array[responseData]
//Purpose: adds data to table dynamically
async function addExperiencesToDynamicTable(selectedBoxes, responseData) {

    const experienceHeader = document.getElementById("experienceHeader");
    const experienceBody = document.getElementById("experienceBody");

    experienceHeader.innerHTML = '';
    experienceBody.innerHTML = '';

    const headRow = document.createElement('tr');
    selectedBoxes.forEach(boxOption => {
        const headerCell = document.createElement('th');
        let newText;
        if (boxOption == 'experienceID') {
            newText = 'Experience ID'
        } else if (boxOption == 'experienceName') {
            newText = 'Experience Name'
        } else if (boxOption == 'experienceDesc') {
            newText = 'Experience Description'
        } else if (boxOption == 'company') {
            newText = 'Host Company'
        } else if (boxOption == 'price') {
            newText = 'Experience Price'
        }
        headerCell.textContent = newText;
        headRow.appendChild(headerCell);
    });
    experienceHeader.appendChild(headRow);

    const experiences = responseData.projectedExperiences;

    experiences.forEach((experience) => {
        const row = document.createElement('tr');

        for (i = 0; i < selectedBoxes.length; i++) {
            const cell = document.createElement('td');
            cell.textContent = experience[i];
            row.appendChild(cell);
        }
        experienceBody.appendChild(row);
    });
}

//Purpose: Handles search button press
async function findCompletionistAction() {
    const attractionID = document.getElementById('completionistAttractionID').value;

    const completionistObject = {
        attractionID: attractionID
    }

    try {
        const completionists = await findCompletionist(completionistObject);
        displayCompletionistsOnTable(completionists);
        alert('Completionist were successfuly discovered.');
    } catch (error) {
        alert('findCompletionist has returned unsuccessfuly.')
    }
}

//Purpose: Executes POST request to backend to fetch
async function findCompletionist(completionistObject) {
    const response = await fetch("/find-completionists", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(completionistObject)
    })

    if (!response.ok) {
        throw new Error();
    }

    const parsedValue = await response.json();
    return parsedValue.data;
}

//Inputs required: user table rows
//Purpose: Displays user data in the main page by adding each object into a row
async function displayCompletionistsOnTable(completionists) {
    const attractionTable = document.getElementById('attractionCompletionistResultsTable');
    const tableBody = attractionTable.querySelector('tbody');

    //clear old data before displaying
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    completionists.forEach(completionist => {
        // Destructuring assignment of completionist object
        const [userID, userName] = completionist;

        const newRow = tableBody.insertRow();

        const idCell = newRow.insertCell(0);
        idCell.textContent = userID;

        const usernameCell = newRow.insertCell(1);
        usernameCell.textContent = userName;
    })
}

// Updates names in the demotable.
// async function updateNameDemotable(event) {
//     event.preventDefault();

//     const oldNameValue = document.getElementById('updateOldName').value;
//     const newNameValue = document.getElementById('updateNewName').value;

//     const response = await fetch('/update-name-demotable', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             oldName: oldNameValue,
//             newName: newNameValue
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('updateNameResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Name updated successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error updating name!";
//     }
// }

// // Counts rows in the demotable.
// // Modify the function accordingly if using different aggregate functions or procedures.
// async function countDemotable() {
//     const response = await fetch("/count-demotable", {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('countResultMsg');

//     if (responseData.success) {
//         const tupleCount = responseData.count;
//         messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
//     } else {
//         alert("Error in count demotable!");
//     }
// }

// TODO: REMOVE. DEV ONLY. 
// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    document.getElementById("findAttractions").addEventListener("click", findAndDisplayAttractions);
    document.getElementById("deleteAttractionButton").addEventListener("click", deleteAttraction);
    document.getElementById("projectExperiences").addEventListener("click", projectExperiencesCheckbox);
    document.getElementById("findBudget").addEventListener("click", findSuitableBudget);
    document.getElementById("findCompletionists").addEventListener("click", findCompletionistAction);
    document.getElementById("countResults").addEventListener("click", countAttractions);
    document.getElementById("countResultsHaving").addEventListener("click", countAttractionsHaving);
    document.getElementById("avgAttractionsPerProvince").addEventListener("click", getAvgAttractionsPerProvince);
    // document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    // fetchAndDisplayUsers();
}
