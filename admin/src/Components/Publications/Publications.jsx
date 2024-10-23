import React, { useState } from 'react'
import './Publications.css'
import approve_icon from '../../assets/approve_icon_24dp.png'
import delete_icon from '../../assets/delete_24dp.png'

const Publications = () => {
  const [publications, setPublications] = useState([
    
    // Data Dummie
     
    {
      _id: '1',
      author: 'User1',
      date: '2024-09-20T14:48:00.000Z',
      content: 'Id sed harum nostrum repellat dignissimos ad nam vitae obcaecati soluta placeat fugit blanditiis, cumque tenetur laborum ipsum natus impedit distinctio, sequi numquam voluptate perspiciatis cum.',
      approved: false, 
    },
    {
      _id: '2',
      author: 'User2',
      date: '2024-09-21T10:30:00.000Z',
      content: 'Ea ab incidunt minus ipsum reprehenderit adipisci perspiciatis culpa alias consectetur, sit amet, consectetur adipisicing elit. Sunt tempore omnis doloremque nostrum maiores molestiae.',
      approved: true,
    },
  ])

  const approvePublication = (id) => {
    console.log(`Approving publication: ${id}`)
    // lógica para aprobar la publicación
  }

  const deletePublication = (id) => {
    console.log(`Deleting publication: ${id}`)
    // lógica para eliminar la publicación
  }

  return (
    <div className='publications'>
      <h2>User Publications</h2>
      <div className="publications-main headers">
        <p>Author & Date</p>
        <p>Content</p>
        <p>Approved</p>
        <p>Actions</p>
      </div>
      <div className="publications-list">
        <hr />
        {publications.map((publication) => (
          <div key={publication._id} className="publications-main list">
            <div className='author-date'>
                <span><p>{publication.author}</p></span>
                <p>{new Date(publication.date).toLocaleDateString()}</p>
            </div>
            <div className='contenido'>
                <p>ID: {publication._id}</p>
                <p className='content-preview'>{publication.content}</p>
            </div>
            <p>{publication.approved ? 'Yes' : 'No'}</p>
            <div className="actions">
              <img
                onClick={() => approvePublication(publication._id)}
                className='icon approve-icon'
                src={approve_icon}
                alt="approve publication"
              />
              <img
                onClick={() => deletePublication(publication._id)}
                className='icon delete-icon'
                src={delete_icon}
                alt="delete publication"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Publications