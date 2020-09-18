
export default function fetchRequest (path, options) {
  return fetch(path, options)
    .then(res => res.status <= 400 ? res : Promise.reject(res))
    .then(res => res.status !== 204 ? res.json() : res)
    .then(data => console.log('my data', data))
    .catch(o_O => {
      console.error(`Error fetching [${options ? options.method : 'GET'}] ${path}`);
      console.error('Error', o_O);
    })
}