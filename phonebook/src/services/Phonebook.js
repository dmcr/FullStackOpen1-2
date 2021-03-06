import axios from 'axios'

//const baseUrl = 'http://localhost:3001/api/personshepatorenal'
//const baseUrl = 'https://fso-phonebook.herokuapp.com/api/persons'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const update = updatedPerson => {
    const request = axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson)
    return request.then(response => response.data)
}

const remove = id => {
    const request = axios.delete(`${baseUrl}/${id}`, id)
    return request.then(response => response.data)
}

export default {getAll, create, remove, update}