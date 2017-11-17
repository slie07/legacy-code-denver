saveUserData('Sravan Vankina', 'spvankina@gmail.com', 10);

function saveUserData(name, email, id) {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userId", id);
}

function getUserName() {
    return localStorage.getItem("userName");
}

function getEmail() {
    return localStorage.getItem("userEmail");
}

function getUserId() {
    return localStorage.getItem("userId");
}

function saveAuthToken(token){
    localStorage.setItem("authToken", token);
}

function getAuthToken() {
    return localStorage.getItem("authToken");
}
