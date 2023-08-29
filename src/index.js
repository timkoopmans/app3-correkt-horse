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

  mainContainer.innerHTML = '';

  const user = state.auth.user;
  const isAuthenticated = state.auth.isAuthenticated;

  if (isAuthenticated) {
    const profileSection = document.createElement('div');
    profileSection.className = 'profile-section';

    const profilePic = document.createElement('img');
    profilePic.className = 'profile-pic';
    profilePic.src = user?.profilePictureUrl;
    profilePic.alt = user?.name;
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
      setCookie("loginOrigin", "https://app3.correkt.horse", 7);
      window.location.href = `https://auth.correkt.horse?redirectUrl=${window.location}`;
    });
    mainContainer.appendChild(loginButton);
  }

  debugContainer.innerHTML = '';
  const cookieValue = getCookie("loginOrigin"); // Now using getCookie function
  const cookieDebug = document.createElement('p');
  cookieDebug.textContent = `cookieValue (loginOrigin): ${cookieValue}`;
  debugContainer.appendChild(cookieDebug);

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

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

