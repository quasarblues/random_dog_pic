const btnsContainer = document.querySelector('.btns-container');
const genBtn = document.querySelector('.gen-btn');
const clearBtn = document.querySelector('.clear-btn');
const navGenBtn = document.querySelector('.nav-gen-btn');
const navClearBtn = document.querySelector('.nav-clear-btn');
const cardContainerEl = document.querySelector('.card-container');
const navbar = document.querySelector('.scroll-nav');

const getRandDogImg = async () => {
    try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random ');
        const data = await res.json();
        //Destructure to only receive the image url.
        return data;
    } catch (err) {
        console.log(err);
    }
}

const createDogCard = (data) => {
    const { message } = data;

    const regex = /(?<=breeds\/)[^/]+/;
    const match = message.match(regex);

    let formattedBreed;

    if (match) {
        const breed = match[0]; // e.g., "pinscher-miniature" or "beagle"

        if (breed.includes('-')) {
            // Handle hyphenated names (e.g., "pinscher-miniature")
            const words = breed.split('-'); // Split into ["pinscher", "miniature"]

            // Capitalize each word
            const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

            // Reverse the order of the words and join them
            formattedBreed = capitalizedWords.reverse().join(' '); // "Miniature Pinscher"
        } else {
            // Handle single word breeds (e.g., "beagle")
            formattedBreed = breed.charAt(0).toUpperCase() + breed.slice(1); // "Beagle"
        }
    } else {
        // If no breed is returned
        formattedBreed = 'Breed Unknown';
    }

    const newCardEl = document.createElement('div');
    newCardEl.classList.add('card');
    newCardEl.innerHTML = `
    <div class="card-img-container">
        <img src="${message}" alt="dog image">
     </div>
    <div class="card-info">
        <p class="breed-name">${formattedBreed}</p>
    </div>
    <span class="close-btn">&times;</span>
    `
    cardContainerEl.append(newCardEl);

    // Be able to close each newly created card
    const closeBtn = newCardEl.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        newCardEl.remove();
    })

    newCardEl.addEventListener('click', () => {
        if (window.innerWidth <= 600) {
            newCardEl.classList.toggle('active');
            newCardEl.classList.toggle('hover');
        }
    })

    newCardEl.addEventListener('mouseover', () => {
        if (window.innerWidth > 600) {
            newCardEl.classList.add('active');
            newCardEl.classList.add('hover');
        }
    })

    newCardEl.addEventListener('mouseout', () => {
        if (window.innerWidth > 600) {
            newCardEl.classList.remove('active');
            newCardEl.classList.remove('hover');
        }
    })

    // Scroll into view when new card is created
    newCardEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// Create scroll listener to display the navbar
function createScrollListener() {
    window.addEventListener('scroll', () => {
        if (btnsContainer.getBoundingClientRect().bottom <= 0) {
            navbar.style.display = 'flex';
        } else {
            navbar.style.display = 'none';
        }
    })
}

const removeAllImgs = () => {
    cardContainerEl.innerHTML = '';
}

// Wait 50ms to allow the DOM time to set the display of the navbar
const resetNavDisplay = () =>
    setTimeout(() => {
        navbar.style.display = 'none'
    }, 50);

genBtn.addEventListener('click', async () => {
    const data = await getRandDogImg();
    createDogCard(data);
    if (cardContainerEl.children.length > 0) {
        createScrollListener();
    }
})


navGenBtn.addEventListener('click', async () => {
    const data = await getRandDogImg();
    createDogCard(data);
    if (cardContainerEl.children.length > 0) {
        createScrollListener();
    }
})

navClearBtn.addEventListener('click', () => {
    removeAllImgs();
    resetNavDisplay();
})

clearBtn.addEventListener('click', () => {
    removeAllImgs();
    resetNavDisplay();
})
