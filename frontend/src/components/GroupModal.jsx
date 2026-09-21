import { User } from "lucide-react"
import { createGroup } from "../../../backend/src/controllers/group.controller.js"
import { useState } from "react"
import { useGroupStore } from "../store/useGroupStore.js"
import { useEffect } from "react"

const GroupModal = ({isOpen,onClose})=>{
  const [groupName,setGroupName] = useState('')
  const [selectedUsers,setSelectedUser] = useState([])
  const {users, getUsers, createGroup}= useGroupStore()
useEffect(()=>{
  getUsers()
},[getUsers])
  if(!isOpen) return null

  const toggleUser = (userId)=>{
    setSelectedUser((prev)=>prev.includes(userId)?prev.filter((id)=>id!== userId):[...prev,userId])

  }
}


const handleCreate  = async (e)=>{
  e.preventDefault()
  if(!groupName.trim()) return 
  await createGroup(groupName,selectedUsers)
  setGroupName("")
  setSelectedUser([])
  onClose()
};

return (
  <>
  <div className="fixed insert-0 z-50 flex">
  
      <h2 className="mb-4 text-xl">
        Create Groups
      </h2>
      <form onSubmit={handleCreate}>
        <input type="text" placeholder="Group name" value={groupName} onChange={(e)=>setGroupName(e.target.value)} />
        <div className="">
          {users?.map((user)=>(

          <label key={user._id} htmlFor={user._id}>
            <input type="checkbox" id={user._id} checked={selectedUsers.includes(user._id)} onChange={()=> toggleUser(user._id)} />
            <span>
              {user.fullName || user.name || user.email}
            </span>
          </label>
          ))}
        </div>

        <div className="">
          <button type="button" onClick={onClose} >
            Cancel
          </button>

          <button type="submit" > Create Group</button>
        </div>
      </form>
    
  </div>
  </>
)
export default GroupModal