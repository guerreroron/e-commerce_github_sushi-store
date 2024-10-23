import React from 'react'
import { useState, useEffect } from 'react'
import './PublicationList.css'


const PublicationsList = ({ product }) => {
    
    const [publications, setPublications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fakeData = [
        {
            author: { name: "Augusto Duarte" },
            content: "Contraté a la empresa para un evento grande con más de 200 personas y resultó un éxito. Excelente servicio de catering.",
            date_publish: "2024-09-28T22:40:58.993Z",
            likes: 6,
        },
        {
            author: { name: "Jaime Santander" },
            content: "Lo que más me ha gustado son sus salsas que no tienen un precio extra, la mejor sin duda es la salsa de cilantro, ideal para acompañar sashimi.",
            date_publish: "2024-09-24T22:40:58.993Z",
            likes: 12,
         }
    ]

    useEffect(() => {
        const fetchPublications = async () => {

            /* console.log(product.id) */

            if (!product.id) return //Se evita hacer la solicitud sin id
            try {
                const response = await fetch(`http://localhost:4000/products/${product.id}/publications`)
                if (!response.ok) {
                    throw new Error('Error al obtener las publicaciones')
                }
                const data = await response.json()
                setPublications(data.publications || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPublications()
    }, [product.id])
    
    if(loading) return <div>Cargando publicaciones...</div>
    if(error) return <div>{error}</div>

    // Solo usar fakeData si no hay publicaciones
    const allPublications = publications.length > 0 ? publications : fakeData

  return (
    <div className='publication-list'>
        {allPublications.map((publication) => (
                <div key={publication._id || publication.author.name} className="publication-box">
                    <div className="publication-header">
                    <span className="publication-title">{publication.author?.name || 'Autor desconocido'}</span>
                    <span className="publication-date">{new Date(publication.date_publish).toLocaleDateString()}</span>
                    </div>
                    <div className="publication-content">
                        {publication.content}
                    </div>
                    <div className="publication-likes-comments">
                        <span>{publication.likes || 0} Likes</span>
                    </div>
                </div>
            ))}
    </div>
  )
}

export default PublicationsList