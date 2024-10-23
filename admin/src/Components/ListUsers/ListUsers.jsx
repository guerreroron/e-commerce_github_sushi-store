import React, { useEffect, useState } from 'react'
import './ListUsers.css'
import edit_person from '../../assets/person_edit_24dp.png'
import delete_icon from '../../assets/delete_24dp.png'
import orders_icon from '../../assets/receipt_long_24dp.png'
import { useCtx_Ctrl_Panel } from '../../Context_CtrlPanel/Context_CtrlPanel'

const ListUsers = () => {
    const [allUsers, setAllUsers] = useState([])
    const [selectedUserPurchases, setSelectedUserPurchases] = useState([])
    const [selectedUser, setSelectedUser] = useState(null) 
    const [orderType, setOrderType] = useState()
    const {selectedEmails, toggleEmailSelection} = useCtx_Ctrl_Panel()

    const fetchInfo = async () => {
        let url

        switch (orderType) {
            case 'best-clients':
                url = 'http://localhost:4000/topclients'
                break
            case 'new-clients':
                url = 'http://localhost:4000/newclients'
                break
            case 'inactive-clients':
                url = 'http://localhost:4000/inactiveclients'
                break
            default:
                url = 'http://localhost:4000/allusers'
                break
        }

        try {
            const res = await fetch(url)
            const data = await res.json()
            setAllUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
        }
    }

    useEffect(() => {
        fetchInfo()
    }, [orderType])

    const handleOrderChange = (event) => {
        setOrderType(event.target.value)
    }

    const editUser = () => {
      console.log('edituser-btn')
    }

    const orderUser = async (user) => {
        try {
            const res = await fetch(`http://localhost:4000/userpurchases/${user._id}`)
            const data = await res.json()
    
            if (data.success) {
                setSelectedUserPurchases(data.purchases)
                // Actualizando el usuario seleccionado
                setSelectedUser(user)
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error("Error fetching user purchases:", error)
        }
    }

    const removeUser = async (_id) => {
        try {
            const res = await fetch(`http://localhost:4000/removeusers/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            if (data.success) {
                await fetchInfo()
            } else {
                console.error("Failed to remove user:", data.message)
            }
        } catch (error) {
            console.error("Error removing user:", error)
        }
    }

    const capitalizeName = (name) => {
        return name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }
 
    return (
        <div className='userlist'>
            <h2>All users list</h2>
            <select name="client_order" id="client_order" size="1" onChange={handleOrderChange}>
                <option className='option' value="">Seleccione un orden</option>
                <option value="best-clients">Clientes top</option>
                <option value="new-clients">Clientes nuevos</option>
                <option value="inactive-clients">Clientes inactivos</option>
            </select>
            <div className="userlist-main headers">
                <p className='special'>Username</p>
                <p className='special'>Email</p>
                <p>Send</p>
                <p>Edit</p>
                <p>Orders</p>
                <p>Remove</p>
            </div>
            <div className="userlist-allusers">
                <hr />
                {allUsers.map((user) => (
                    <div key={user._id} className="userlist-main list">
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <input 
                            type="checkbox" 
                            name="user_selected" 
                            id="user_selected" 
                            checked={selectedEmails.includes(user.email)} 
                            onChange={() => toggleEmailSelection(user.email)}
                        />
                        <img 
                            onClick={() => editUser(user._id)}
                            className='userlist-orders-icon'
                            src={edit_person} 
                            alt="editar persona icon" 
                        />
                        <img 
                            onClick={() => orderUser(user)}
                            className='userlist-orders-icon'
                            src={orders_icon} 
                            alt="lista de compras icon" 
                        />
                        <img
                            onClick={() => removeUser(user._id)}
                            className='userlist-remove-icon'
                            src={delete_icon}
                            alt="delete icon"
                        />
                    </div>
                ))}
            </div>
            {selectedUserPurchases.length > 0 && selectedUser && (
            <div className='modal'>
                <h2>Purchase History<br/><span>{capitalizeName(selectedUser.name)}</span></h2>
                <p className='totalSpent'>Total Spent: ${selectedUser.totalSpent}.-</p>
                <hr />
                {selectedUserPurchases.map(purchase => (
                    <div key={purchase._id}>
                        <p className='modal-date'>Date: {new Date(purchase.date).toLocaleString()}</p>
                        <p>Total Amount: ${purchase.totalAmount}</p>
                        <ul>
                            {purchase.products.map(product => (
                                <li key={product.id}>{product.name} - {product.quantity} x ${product.price}</li>
                            ))}
                        </ul>
                        <hr />
                    </div>
                ))}
                <button onClick={() => setSelectedUserPurchases([])}>Close</button>
            </div>
        )}
        </div>
    )
}

export default ListUsers
