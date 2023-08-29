import { initialize } from "@frontegg/js"

const style = document.createElement('style');
style.setAttribute('type', 'text/css');
document.getElementsByTagName('head')[0].appendChild(style);

const app = initialize({
  contextOptions: {
    baseUrl: 'https://id.correkt.horse',
  },
})

app.store.subscribe(() => {
  const state = app.store.getState();
  const mainContainer = document.getElementById('main-container');
  const debugContainer = document.querySelector('.debug');

  // Clear existing content to render updated state
  mainContainer.innerHTML = '';

  const user = state.auth.user;
  const isAuthenticated = state.auth.isAuthenticated;
  const cookieValue = ''; // Place your cookie value here
  const localStorageValue = localStorage.getItem('redirectUrl');

  if (isAuthenticated) {
    const profileSection = document.createElement('div');
    profileSection.className = 'profile-section';

    const profilePic = document.createElement('img');
    profilePic.className = 'profile-pic';
    profilePic.src = user?.profilePictureUrl; // Assuming profilePictureUrl is in the user object
    profilePic.alt = user?.name; // Assuming name is in the user object
    profileSection.appendChild(profilePic);

    const profileName = document.createElement('p');
    profileName.className = 'profile-name';
    profileName.textContent = user?.name;
    profileSection.appendChild(profileName);

    const logoutSection = document.createElement('div');
    logoutSection.className = 'logout-section';

    const logoutButton = document.createElement('button');
    logoutButton.className = 'logout-button';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', () => {
      app.logout();
    });
    logoutSection.appendChild(logoutButton);

    mainContainer.appendChild(profileSection);
    mainContainer.appendChild(logoutSection);
  } else {
    const loginButton = document.createElement('button');
    loginButton.className = 'login-button';
    loginButton.textContent = 'Login';
    loginButton.addEventListener('click', () => {
      app.loginWithRedirect();
    });
    mainContainer.appendChild(loginButton);
  }

  const cookieDebug = document.createElement('p');
  cookieDebug.textContent = `cookieValue: ${cookieValue}`;
  debugContainer.appendChild(cookieDebug);

  const localStorageDebug = document.createElement('p');
  localStorageDebug.textContent = `localStorage: ${localStorageValue}`;
  debugContainer.appendChild(localStorageDebug);

  // Update dynamic styles
  let styleHtml = '';
  if (isAuthenticated) {
    styleHtml += '[fe-state="isAuthenticated"] { }';
    styleHtml += '[fe-state="!isAuthenticated"] { display: none; }';
  } else {
    styleHtml += '[fe-state="isAuthenticated"] { display: none; }';
    styleHtml += '[fe-state="!isAuthenticated"] { }';
  }
  style.innerHTML = styleHtml;
});
