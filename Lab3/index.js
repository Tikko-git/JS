import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://workout-planner-da5ae-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const workoutListInDB = ref(database, "workout-list");

const workoutNameEl = document.getElementById("workout-name");
const workoutDateEl = document.getElementById("workout-date");
const addButtonEl = document.getElementById("add-button");
const workoutListEl = document.getElementById("workout-list");

addButtonEl.addEventListener("click", () => {
    const workoutName = workoutNameEl.value.trim();
    const workoutDate = workoutDateEl.value;

    if (workoutName && workoutDate) {
        const workoutData = {
            name: workoutName,
            date: workoutDate,
            completed: false
        };

        push(workoutListInDB, workoutData);

        workoutNameEl.value = '';
        workoutDateEl.value = '';
    } else {
        alert("Please enter the training name and date.");
    }
});

onValue(workoutListInDB, (snapshot) => {
    workoutListEl.innerHTML = ''; 
    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        itemsArray.forEach(([itemId, workoutData]) => appendWorkoutToDOM(itemId, workoutData));
    }
});

function appendWorkoutToDOM(itemId, workoutData) {
    const workoutItem = document.createElement('li');
    workoutItem.classList.add('workout-item');
    workoutItem.dataset.itemId = itemId;

    const checkboxId = `checkbox-${itemId}`; 

    workoutItem.innerHTML = `
        <input type="checkbox" id="${checkboxId}" class="complete-checkbox" ${workoutData.completed ? 'checked' : ''}>
        <label for="${checkboxId}" class="workout-info">${workoutData.name} - ${workoutData.date}</label>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
    `;

    workoutItem.querySelector('.delete-button').addEventListener("click", () => {
        const itemRef = ref(database, `workout-list/${itemId}`);
        remove(itemRef);
    });

    workoutItem.querySelector('.edit-button').addEventListener("click", () => {
        const newWorkoutName = prompt("Update workout name:", workoutData.name);
        const newWorkoutDate = prompt("Update workout date:", workoutData.date);

        if (newWorkoutName && newWorkoutDate) {
            const updatedData = {
                name: newWorkoutName,
                date: newWorkoutDate
            };
            update(ref(database, `workout-list/${itemId}`), updatedData);
        }
    });

    workoutItem.querySelector('.complete-checkbox').addEventListener("change", (event) => {
        update(ref(database, `workout-list/${itemId}`), { completed: event.target.checked });
    });

    workoutListEl.appendChild(workoutItem);
}
