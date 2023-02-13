let homeName = document.getElementById("homeName")
let homeSurname = document.getElementById("homeSurname")
let homeJob = document.getElementById("homeJob")
let homeDscr = document.getElementById("homeDscr")
let homeInst = document.getElementById("homeInst")
let homeMail = document.getElementById("homeMail")
let homeTg = document.getElementById("homeTg")
let homeLinkedin = document.getElementById("homeLinkedin")
let homePinterest = document.getElementById("homePinterest")

let contactsButton = document.getElementById("contactsButton")
let projectsButton = document.getElementById("projectsButton")
let worksButtons = document.getElementById("worksButtons")
let notesButton = document.getElementById("notesButton")
let photosButton = document.getElementById("photosButton")
let aboutButton = document.getElementById("aboutButton")
let closeButton = document.getElementById('closeButton')
let closeProjectsButton = document.getElementById('closeProjectsButton')

let sectionHome = document.getElementById("sectionHome")
let sectionWorks = document.getElementById("sectionWorks")
let sectionNotes = document.getElementById("sectionNotes")
let sectionPhotos = document.getElementById("sectionPhotos")
let sectionAbout = document.getElementById("sectionAbout")
let sectionNav = document.getElementById("sectionNav")
let sectionNavLinks = sectionNav.querySelector('.nav__links')
let sectionContacts = document.getElementById("sectionContacts")
let sectionProjects = document.getElementById("sectionProjects")
let sectionNavProject = document.getElementById("sectionNavProject")

let navRectangle = document.getElementById("navRectangle")

let AboutTextGroup = document.querySelector('.about__text-group')
let worksGrid = document.getElementById ("works__grid")
let notesGrid = document.getElementById("notes_grid")

let titleName = document.getElementById("title__ruslan")
let titleSurname = document.getElementById("title__surname")
let titleJob = document.getElementById("title__job")
let titleDscr = document.getElementById("title__dscr")
let titleLinkedin = document.getElementById("title__linkedin")
let titlePinterest = document.getElementById("title__pinterest")

let projectGrid = document.getElementById("projects__grid")
let projectSM = document.getElementById("project__sm")


const pages = [sectionHome, sectionWorks, sectionNotes, sectionPhotos, sectionAbout]
closeButton.style.display = 'none'



function showBlock(elementId) {
for (let pageElement of pages) {
  pageElement.style.opacity = '0'
}

let element = document.getElementById(elementId)
element.style.opacity = '1'


if (element === sectionHome) {
  sectionHome.style.height = 'calc(100% - 244px)'
  sectionHome.style.transition = 'height .3s ease'
  sectionWorks.style.display = 'none'
  sectionNotes.style.display = 'none'
  sectionPhotos.style.display = 'none'
  sectionAbout.style.display = 'none'
  sectionNav.style.height = '208px'
  sectionNav.style.gap = '20px'
  sectionNavLinks.style['padding-right'] = '0'

  worksButtons.style.display = 'block'
  notesButton.style.display = 'block'
  photosButton.style.display = 'block'
  aboutButton.style.display = 'block'
  closeButton.style.display = 'none'

} else {
  sectionHome.style.height = 'calc(100% - 106px)'
  sectionNav.style.gap = '0'
  sectionNav.style.height = '70px'
  closeButton.style.display = 'block'
  sectionNavLinks.style['width'] = 'fit-content'
  sectionNavLinks.style['padding-right'] = '20px'

  worksButtons.style.display = 'none'
  notesButton.style.display = 'none'
  photosButton.style.display = 'none'
  aboutButton.style.display = 'none'
  closeButton.style.display = 'block'
}

if (element === sectionWorks) {
  sectionWorks.style.display = 'flex'
  sectionNotes.style.display = 'none'
  sectionPhotos.style.display = 'none'
  sectionAbout.style.display = 'none'
  sectionHome.style.opacity = '0'
  sectionWorks.scrollTo(0,0)
  contactsButton.style.display = 'none'
  projectsButton.style.display = 'block'
  sectionProjects.style.display = 'none'
} else {
  contactsButton.style.display = 'block'
  projectsButton.style.display = 'none'
  sectionProjects.style.display = 'none'
}

if (element === sectionPhotos) {
  sectionPhotos.style.display = 'flex'
  sectionWorks.style.display = 'none'
  sectionNotes.style.display = 'none'
  sectionAbout.style.display = 'none'
  navRectangle.style.background = '#FEF200'
  closeButton.style.color = '#FEF200'
} else {
  navRectangle.style.background = '#BD2323'
  closeButton.style.color = '#BD2323'
}

if (element === sectionNotes) {
  sectionNotes.style.display = 'flex'
  sectionWorks.style.display = 'none'
  sectionPhotos.style.display = 'none'
  sectionAbout.style.display = 'none'
  notesGrid.scrollTo(0,0)
}

if (element === sectionAbout) {
  sectionAbout.style.display = 'flex'
  sectionNotes.style.display = 'none'
  sectionWorks.style.display = 'none'
  sectionPhotos.style.display = 'none'
  AboutTextGroup.scrollTo(0,0)
}

  closeButton.textContent = 'Close ' + elementId.substr(7)
  projectsButton.textContent = 'Projects'
}



function showContacts() {
  if (titleName.textContent === 'instagram') {
    titleName.textContent = 'ruslan'
    titleSurname.textContent = 'myachkov'
    titleJob.textContent = 'designer'

    homeLinkedin.style.display = 'none'
    homePinterest.style.display = 'none'

    sectionWorks.style.display = 'none'
    sectionNotes.style.display = 'none'
    sectionPhotos.style.display = 'none'
    sectionAbout.style.display = 'none'

    sectionNav.style.display = 'flex'
    sectionNav.style.height = '208px'
    sectionNav.style.gap = '20px'
    sectionNavLinks.style['padding-right'] = '0'

    worksButtons.style.display = 'block'
    notesButton.style.display = 'block'
    photosButton.style.display = 'block'
    aboutButton.style.display = 'block'

    navRectangle.style['background'] = '#BD2323'

    homeDscr.style.display = 'flex'
    homeLinkedin.style.height = '100%'

    sectionHome.style.height = 'calc(100% - 244px)'

    contactsButton.style['paddingLeft'] = '8px'
    contactsButton.textContent = 'Contacts'

    sectionContacts.style['gap'] = '0'

    titleName.style['paddingRight'] = '0'
    homeName.style['gap'] = '20px'
    titleSurname.style['paddingLeft'] = '0'
    homeSurname.style['gap'] = '20px'
    titleJob.style['paddingRight'] = '0'
    homeJob.style['gap'] = '20px'
    titleLinkedin.style['paddingLeft'] = '0'
    homeLinkedin.style['gap'] = '20px'
    titlePinterest.style['paddingRight'] = '0'
    homePinterest.style['gap'] = '20px'



    closeButton.style.display = 'none'


  } else {
    titleName.textContent = 'instagram'
    titleName.innerHTML = '<a class="home__title home__title_orange" id="title__ruslan" href="https://www.instagram.com/ruslan_myachkov/" target="_blank">instagram</a>'
    titleSurname.textContent = 'mail'
    titleSurname.innerHTML = '<a class="home__title home__title_blue" id="title__surname" href="mailto:rmyachkov@yandex.ru" target="_blank">mail</a>'
    titleJob.textContent = 'telegram'
    titleJob.innerHTML = '<a class="home__title home__title_yellow" id="title__job" href="https://t.me/rusmyachkov" target="_blank">telegram</a>'

    homeLinkedin.style.display = 'flex'
    homePinterest.style.display = 'flex'
    homeDscr.style.display = 'none'

    sectionWorks.style.display = 'none'
    sectionNotes.style.display = 'none'
    sectionPhotos.style.display = 'none'
    sectionAbout.style.display = 'none'
    sectionNav.style.display = 'none'

    sectionContacts.style['gap'] = '8px'
    contactsButton.style['paddingLeft'] = '0'
    contactsButton.textContent = 'Close'

    sectionHome.style.display = 'flex'
    sectionHome.style.opacity = '1'
    sectionHome.style.height = 'calc(100% - 36px)'
    sectionHome.style.transition = 'none'

    titleName.style['paddingRight'] = '20px'
    homeName.style['gap'] = '0'
    titleSurname.style['paddingLeft'] = '20px'
    homeSurname.style['gap'] = '0'
    titleJob.style['paddingRight'] = '20px'
    homeJob.style['gap'] = '0'
    titleLinkedin.style['paddingLeft'] = '20px'
    homeLinkedin.style['gap'] = '0'
    titlePinterest.style['paddingRight'] = '20px'
    homePinterest.style['gap'] = '0'
  }
  }



  let myMediaQuery = window.matchMedia('(min-width: 450px) and (max-width: 1330px)');
  function matchMediaCallback(myMediaQuery) {
    if(myMediaQuery.matches) {
      document.querySelector(".notes__title").textContent = "typing...";
    } else {
      document.querySelector(".notes__title").textContent = "ruslan is typing...";
    }
  }
  myMediaQuery.addEventListener('change', matchMediaCallback);
  matchMediaCallback(myMediaQuery);




function showProjects() {
  if (sectionWorks.style.display === 'none') {
    sectionWorks.style.display = 'flex'
    sectionProjects.style.display = 'none'
    projectsButton.textContent = 'Projects'
    sectionWorks.scrollTo(0,0)
    projectGrid.style.display = 'grid'
    projectSM.style.display = 'none'
  } else {
    sectionWorks.style.display = 'none'
    sectionProjects.style.display = 'flex'
    projectsButton.textContent = 'Shots'
    sectionProjects.scrollTo(0,0)
  }

  sectionNavProject.style.display = 'none'
  sectionNav.style.display ='flex'
}


const soprojects = [projectSM]

function showProjectSM(elementId) {
  for (let pageElement of soprojects) {
    pageElement.style.display = 'none'
  }

  let element = document.getElementById(elementId)
  element.style.display = 'flex'

  if (element === projectSM) {
    projectGrid.style.display = 'none'
    sectionNav.style.display ='none'
    sectionNavProject.style.display = 'flex'
    projectSM.style.display = 'flex'
  } else {
    projectGrid.style.display = 'grid'
    sectionNav.style.display ='flex'
  }
}

function showImageGrid() {
  if(projectGrid.style.display = 'none'){
  sectionNavProject.style.display = 'none'
  sectionNav.style.display = 'flex'
  projectGrid.style.display = 'grid'
  projectSM.style.display = 'none'
  } else {
    projectGrid.style.display = 'grid'
    projectSM.style.display = 'none'
  }
}



