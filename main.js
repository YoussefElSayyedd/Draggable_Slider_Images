// ============ Start DOM Images ============
const nums = ["One", "Two", "Three", "Four",
            "Five", "Six", "Seven", "Eight",
            "Nine", "Ten", "Eleven", "Twelve"];
// Create The Main UL
const ulElement = document.createElement("ul");
ulElement.className = "carousel";
for (let i = 0; i < 12; i++) {
    const theLi = document.createElement("li");
    theLi.className = "card";
    // Start Div Element
    const theDiv = document.createElement("div");
    theDiv.className = "img";
    const theImg = document.createElement("img");
    theImg.setAttribute("src", `./imgs/card${i + 1}.jpg`);
    theDiv.setAttribute("alt", `Img Number ${i + 1}`);
    theImg.setAttribute("draggable", "false");
    theDiv.appendChild(theImg);
    theLi.appendChild(theDiv);
    // Start H2 Element
    const theH2 = document.createElement("h2");
    theH2.appendChild(document.createTextNode(`Card ${nums[i]}`));
    theLi.appendChild(theH2);
    // Start Span Element
    const theSpan = document.createElement("span");
    theSpan.appendChild(document.createTextNode(`Image ${i + 1}`));
    theLi.appendChild(theSpan);
    ulElement.appendChild(theLi);
}
document.querySelector(".container").appendChild(ulElement);
// ============== End DOM Images ============

// Setting The Variables
const carousel = document.querySelector(".carousel");
const wrapper = document.querySelector(".wrapper");
const arrowBtns = document.querySelectorAll(".wrapper i");
const fristCardWidth = document.querySelector(".card").offsetWidth + 16; // 16 => The Gap Between Cards
const carouselChirdens = [...carousel.children];
const autoplayDuration = 2000;

let isDragging = false,
    startX,
    startScrollLeft,
    timeoutId;
// Get The Number Of Cards That Can Fit In The Carousel At Once
let cardPreView = Math.round(carousel.offsetWidth / fristCardWidth);

// Insert Copies Of The Last Few Cards To Beginning Of Carousel For Infinite Scrolling
carouselChirdens.slice(-cardPreView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert Copies Of The Frist Few Cards To End Of Carousel For Infinite Scrolling
carouselChirdens.slice(0, cardPreView).forEach(card => {
    carousel.insertAdjacentHTML("beforeEnd", card.outerHTML);
});

// Add Event Listeners For The Arrow Buttons To Scroll The Carousel Left And Right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += (btn.id === "left")? -fristCardWidth : fristCardWidth;
        console.log(fristCardWidth)
    });
});

// Function Will Work When Drag Start
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records The Initial Cursor And Scroll Position Of The Carousel
    startX = e.pageX; // To Know How Far The Mouse Moved
    startScrollLeft = carousel.scrollLeft; // To Know The Point That The Mouse Start From It
    console.log(startX);
    console.log(startScrollLeft);
}

// Function Works During Dragging
const dragging = (e) => {
    if (!isDragging) return; // If isDragging Is false Don't Do Any Thing
    // Updates The Scroll Position Of The Carousel Based On The Cursor Movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

// Function Will Works When Drag Stop
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const autoPlay = () => {
    if (window.innerWidth < 800) return; // We Won't Auto-Play On Mobile Devices
    // Autoplay The Carousel After Every 2.5 Sec
    timeoutId = setTimeout(() => carousel.scrollLeft += fristCardWidth, autoplayDuration);
}
autoPlay();

const infiniteScroll = () => {
    // If The Carousel Is At The Beginning, Scroll To The End
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    } 
    // If The Carousel Is At The End, Scroll To The Beginning
    else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }
    // Clear Exising Timeout
    clearTimeout(timeoutId);
    // Start Autoplay If Mouse Is Not Hovering Over Carousel
    if (!wrapper.matches(":hover")) autoPlay(); 
}
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", () => autoPlay);