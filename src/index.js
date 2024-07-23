document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');

    let allPups = [];
    let filterGoodDogs = false;


    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(pups => {
            allPups = pups;
            displayPups(pups);
        });

    
    function displayPups(pups) {
        dogBar.innerHTML = '';
        pups.forEach(pup => {
            const span = document.createElement('span');
            span.textContent = pup.name;
            span.addEventListener('click', () => showPupInfo(pup));
            dogBar.appendChild(span);
        });
    }

    
    function showPupInfo(pup) {
        dogInfo.innerHTML = `
            <img src="${pup.image}" />
            <h2>${pup.name}</h2>
            <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;
        const button = dogInfo.querySelector('button');
        button.addEventListener('click', () => toggleGoodDog(pup));
    }

    
    function toggleGoodDog(pup) {
        pup.isGoodDog = !pup.isGoodDog;
        fetch(`http://localhost:3000/pups/${pup.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isGoodDog: pup.isGoodDog })
        })
        .then(response => response.json())
        .then(updatedPup => {
            showPupInfo(updatedPup);
            if (filterGoodDogs) {
                displayPups(allPups.filter(pup => pup.isGoodDog));
            } else {
                displayPups(allPups);
            }
        });
    }

   
    filterButton.addEventListener('click', () => {
        filterGoodDogs = !filterGoodDogs;
        filterButton.textContent = `Filter good dogs: ${filterGoodDogs ? 'ON' : 'OFF'}`;
        if (filterGoodDogs) {
            displayPups(allPups.filter(pup => pup.isGoodDog));
        } else {
            displayPups(allPups);
        }
    });
});
