import React, { useState, useEffect, useCallback } from 'react';

import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [backendPodName, setBackendPodName] = useState('');
  const [backendNodeName, setBackendNodeName] = useState('');

  const fetchFiles = useCallback(function () {
  //  fetch(`${process.env.REACT_APP_BACKEND_URL}/data`)
    fetch("/api/data")
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        setFiles(jsonData.files);
      });
  }, []);

  useEffect(
    function () {
      fetchFiles();
    },
    [fetchFiles]
  );

  const fetchAuthors = async () => {
    const response = await fetch('/api/authors');
    const data = await response.json();
    setBackendPodName(data.backendPodName || 'undefined');
    setBackendNodeName(data.backendNodeName || 'undefined');
  };


  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleTextChange(event) {
    setText(event.target.value);
  }

  function handleSaveFile() {
    //fetch(`${process.env.REACT_APP_BACKEND_URL}/data`, {
    fetch("/api/data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, text }),
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (resData) {
        console.log(resData);
        setTitle('');
        setText('');
        fetchFiles();
      });
  }

  return (
    <div className='App'>
      <section>
        <label htmlFor='title-input'>Title:</label>
        <input type='text' id='title-input' value={title} onChange={handleTitleChange} />
        <br />
        <label htmlFor='text-input'>Text:</label>
        <textarea id='text-input' value={text} onChange={handleTextChange} />
        <br />
        <button onClick={handleSaveFile}>Save file</button>
      </section>
      <section>
        <button onClick={fetchFiles}>Fetch files</button>
        <ul>
          {files.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
      </section>
      <section>
        <div>
          <button onClick={fetchAuthors}>Fetch authors</button>
          <div>Backend Pod Name: {backendPodName}</div>
          <div>Backend Node Name: {backendNodeName}</div>
          <div>Frontend Pod Name: {window._env_.FRONTEND_POD_NAME  || 'undefined'}</div>
          <div>Frontend Node Name: {window._env_.FRONTEND_NODE_NAME || 'undefined'}</div>
        </div>
      </section>
    </div>
  );
}

export default App;
