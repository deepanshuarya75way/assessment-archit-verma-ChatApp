import { createGroup, getMyGroups, joinGroup } from "../../../backend/src/controllers/group.controller.js";

export const useGroupStore = create((set)=>({
  groups: [],
  isLoadingGroups: false,

  getMyGroups:async()=>{
    try {
      set({isLoadingGroups:true})
      const res = await axiosInstance.get("/groups/my-groups")

      set({groups: res.data,})
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
    }
    finally{
      set({isLoadingGroups:false})
    }
  },

  createGroup: async(name,memberIds)=>{
    try {
      const res = await axiosInstance.post("/groups/create",{
        name,
        memberIds,
      })
      set((state)=>({
        groups:[res.data,...state.groups],
      }))
      return res.data
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
      throw error
    }
  },
  joinGroup:async(inviteCode)=>{
    try {
      const res= await axiosInstance.post("/groups/join",{inviteCode})

      set((state)=>({
        groups:[res.data, ...state.groups],
      }))

      return res.data
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
      throw error
    }
  }
}))