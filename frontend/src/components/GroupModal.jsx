import { createGroup } from "../../../backend/src/controllers/group.controller"

const GroupModal = ({isOpen,onCLose})=>{
  const [groupName,setGroupName] = useState('')
  const [selectedUsers,setSelectedUser] = useState([])
  const {users, createGroup}= ueGroupStore()

  if(!isOpen) return null
  const toggleUser = (userId)=>{
    setSelectedUser((prev)=>prev.includes(userId)?prev.filter((id)=>id!== userId):[...prev,userId])

  }
}

const handleCreate  =async (e)=>{
  e.preventDefault()
  if(!groupName.trim()) return 
  await createGroup(groupName,selectedUsers)
  setGroupName("")
  setSelectedUser([])
  onCLose()
}

return (
  <div className="fixed insert-0 z-50 flex">
    <div className="">
      <h2 className="mb-4 text-xl">
        Create Groups
      </h2>
      <form action="" onSubmit={handleCreate}>
        <input type="text" placeholder="Group name" value={groupName} onChange={(e)=>setGroupName(e.target.value)} className="" />
      </form>
    </div>
  </div>
)