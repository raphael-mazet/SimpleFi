export default function urlStringSanitiser(string) {
  return string.replace(/[\W_]+/g,"-").toLowerCase();
}