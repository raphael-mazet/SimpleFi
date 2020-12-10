export default function urlStringSanitiser(string) {
  // return string.replace(/\//gi, '%2F').toLowerCase();
  return string.replace(/[\W_]+/g,"-").toLowerCase();
}