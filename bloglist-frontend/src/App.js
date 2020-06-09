import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password })

      // Save token to local storage
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(window.localStorage)
      console.log(JSON.parse(window.localStorage.getItem('loggedBlogappUser')))

      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  const blogForm = () => {
    const handleBlogTitleChange = (event) => setNewBlog({ title: event.target.value, author: newBlog.author, url: newBlog.url })
    const handleBlogAuthorChange = (event) => setNewBlog({ title: newBlog.title, author: event.target.value, url: newBlog.url })
    const handleBlogUrlChange = (event) => setNewBlog({ title: newBlog.title, author: newBlog.author, url: event.target.value })
    const addBlog = (event) => {
      event.preventDefault()
      blogService
        .create(newBlog)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewBlog({ title: '', author: '', url: '' })
        })
        .catch(error => console.log(error))
    }

    return (
      <Togglable buttonLabel='Add new blog'>
        <BlogForm 
          newBlog={newBlog}
          handleSubmit={addBlog}
          onAuthorChange={handleBlogAuthorChange}
          onTitleChange={handleBlogTitleChange}
          onUrlChange={handleBlogUrlChange}
        />
      </Togglable>
    )
  }

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm 
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <div>{errorMessage}</div>
      {user === null ? loginForm() :
        <div>
          <p>{user.name} logged in <button onClick={() => {
              setUser(null)
              console.log('logging out', username, password)
              window.localStorage.removeItem('loggedBlogappUser')
            }}>Logout</button></p>
          {blogForm()}
          <div>
            <h2>blogs</h2>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App