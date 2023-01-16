let homeName = document.getElementById("homeName")
let homeSurname = document.getElementById("homeSurname")
let homeJob = document.getElementById("homeJob")
let homeDscr = document.getElementById("homeDscr")
let homeInst = document.getElementById("homeInst")
let homeMail = document.getElementById("homeMail")
let homeTg = document.getElementById("homeTg")
let homeLinkedin = document.getElementById("homeLinkedin")
let homePinterest = document.getElementById("homePinterest")
let sectionNav = document.getElementById("sectionNav")

let contactsButton = document.getElementById("contactsButton")
let worksButtons = document.getElementById("worksButtons")
let notesButton = document.getElementById("notesButton")
let photosButton = document.getElementById("photosButton")
let aboutButton = document.getElementById("aboutButton")

let sectionHome = document.getElementById("sectionHome")
let sectionWorks = document.getElementById("sectionWorks")
let sectionNotes = document.getElementById("sectionNotes")
let sectionPhotos = document.getElementById("sectionPhotos")
let sectionAbout = document.getElementById("sectionAbout")
let sectionContacts = document.getElementById("sectionContacts")

let navRectangle = document.getElementById("navRectangle")



function showContacts() {
  if(homeName.style.display === 'none') {
    homeName.style.display = 'flex'
    homeInst.style.display = 'none'
    homeSurname.style.display = 'flex'
    homeMail.style.display = 'none'
    homeJob.style.display = 'flex'
    homeTg.style.display = 'none'
    homeDscr.style.display = 'flex'
    homeLinkedin.style.display = 'none'
    sectionNav.style.display = 'flex'
    homePinterest.style.display = 'none'
    sectionHome.style.display = 'flex'

    contactsButton.textContent = 'Get In Touch'
  }

  else {
    homeName.style.display = 'none'
    homeInst.style.display = 'flex'
    homeSurname.style.display = 'none'
    homeMail.style.display = 'flex'
    homeJob.style.display = 'none'
    homeTg.style.display = 'flex'
    homeDscr.style.display = 'none'
    homeLinkedin.style.display = 'flex'
    sectionNav.style.display = 'none'
    homePinterest.style.display = 'flex'
    sectionHome.style.display = 'flex'

    contactsButton.textContent = 'Close'


    /*FOR WORKS*/
    sectionWorks.style.display = 'none'
    notesButton.style.display = 'block'
    photosButton.style.display = 'block'
    aboutButton.style.display = 'block'
    worksButtons.textContent = 'Works'

     /*FOR ABOUT*/
     sectionAbout.style.display = 'none'
     worksButtons.style.display = 'block'
     notesButton.style.display = 'block'
     photosButton.style.display = 'block'
     aboutButton.textContent = 'About'

      /*FOR NOTES*/
      navRectangle.style.background = '#BD2323'
      notesButton.style.color = '#BD2323'
      sectionNotes.style.display = 'none'
      worksButtons.style.display = 'block'
      photosButton.style.display = 'block'
      aboutButton.style.display = 'block'
      notesButton.textContent = 'Notes'

       /*FOR PHOTOS*/
       navRectangle.style.background = '#BD2323'
       photosButton.style.color = '#BD2323'
       sectionPhotos.style.display = 'none'
       worksButtons.style.display = 'block'
       notesButton.style.display = 'block'
       aboutButton.style.display = 'block'
       photosButton.textContent = 'Photos'

  }
}


function showWorks() {
  if(sectionHome.style.display === 'none') {
    sectionHome.style.display = 'flex'
    sectionWorks.style.display = 'none'
    notesButton.style.display = 'block'
    photosButton.style.display = 'block'
    aboutButton.style.display = 'block'

    worksButtons.textContent = 'Works'
  }

  else {
    sectionHome.style.display = 'none'
    sectionWorks.style.display = 'flex'
    notesButton.style.display = 'none'
    photosButton.style.display = 'none'
    aboutButton.style.display = 'none'

    worksButtons.textContent = 'Close Works'
  }
}

/*
function showWorks() {
  if(sectionHome.style.display === 'none') {
    sectionHome.style.display = 'flex'
    sectionWorks.style.display = 'none'
    notesButton.style.display = 'block'
    photosButton.style.display = 'block'
    aboutButton.style.display = 'block'

    worksButtons.textContent = 'Works'
  }

  else {
    sectionHome.style.display = 'none'
    sectionWorks.style.display = 'flex'
    notesButton.style.display = 'none'
    photosButton.style.display = 'none'
    aboutButton.style.display = 'none'

    worksButtons.textContent = 'Close Works'
  }
}
*/


function showNotes() {
  if(sectionHome.style.display === 'none') {
    sectionHome.style.display = 'flex'
    sectionNotes.style.display = 'none'
    worksButtons.style.display = 'block'
    photosButton.style.display = 'block'
    aboutButton.style.display = 'block'

    navRectangle.style.background = '#BD2323'
    notesButton.style.color = '#BD2323'
    notesButton.textContent = 'Notes'
  }

  else {
    sectionHome.style.display = 'none'
    sectionNotes.style.display = 'flex'
    worksButtons.style.display = 'none'
    photosButton.style.display = 'none'
    aboutButton.style.display = 'none'

    navRectangle.style.background = '#2E3192'
    notesButton.style.color = '#2E3192'
    notesButton.textContent = 'Close Notes'
  }
}


function showPhotos() {
  if(sectionHome.style.display === 'none') {
    sectionHome.style.display = 'flex'
    sectionPhotos.style.display = 'none'
    worksButtons.style.display = 'block'
    notesButton.style.display = 'block'
    aboutButton.style.display = 'block'

    navRectangle.style.background = '#BD2323'
    photosButton.style.color = '#BD2323'
    photosButton.textContent = 'Photos'
  }

  else {
    sectionHome.style.display = 'none'
    sectionPhotos.style.display = 'flex'
    worksButtons.style.display = 'none'
    notesButton.style.display = 'none'
    aboutButton.style.display = 'none'

    navRectangle.style.background = '#FEF200'
    photosButton.style.color = '#FEF200'
    photosButton.textContent = 'Close Photos'
  }
}


function showAbout() {
  if(sectionHome.style.display === 'none') {
    sectionHome.style.display = 'flex'
    sectionAbout.style.display = 'none'

    worksButtons.style.display = 'block'
    notesButton.style.display = 'block'
    photosButton.style.display = 'block'

    aboutButton.textContent = 'About'
  }

  else {
    sectionHome.style.display = 'none'
    sectionAbout.style.display = 'flex'

    worksButtons.style.display = 'none'
    notesButton.style.display = 'none'
    photosButton.style.display = 'none'

    aboutButton.textContent = 'Close About'
  }
}
