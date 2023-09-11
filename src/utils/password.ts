// Password should contains character number and more than 10.
export const passwordHelpText =
  "Password should contains character number and more than 10.";
export function validatePassword(password: string): boolean {
  var chart = /[a-zA-Z]/g;
  var numbers = /[0-9]/g;
  if (!password.match(chart)) {
    return false;
  } else if (!password.match(numbers)) {
    return false;
  } else if (password.length < 10) {
    return false;
  }
  return true;
}
