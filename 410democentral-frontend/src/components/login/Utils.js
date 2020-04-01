export function checkPassword(password){
    return password.length > 6;
}

export function checkEmail(email){
    return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
}