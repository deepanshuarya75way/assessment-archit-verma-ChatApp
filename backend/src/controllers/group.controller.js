import Group from "../models/Group.js";
import crypto from "crypto"
export const createGroup = async(req,res)=>{
  try {
    const {name,memberIds=[]}= req.body

    if(!name){
      return res.status(400).json({message:"Group name is required"})
    }
    const invitedCode = crypto.randomBytes(4).toString("hex")
    const members=[
      req.user._id,
      ...memberIds.filter(
        (id)=>id.toString()!==req.user._id.toString()
      ),
    ]
    const group = await Group.create({
      name,
      creator: req.user._id,
      members,
      inviteCode,
    })

    const populatedGroup = await Group.findById(group._id).populate("creator","fullName email profilePic").populate("members","fullName email profilePic")

    res.status(201).json(populatedGroup)

  } catch (error) {
    res.status(500).json({mesage:"internal server error"})
  }
}

export const getMyGroups = async(req,res)=>{
  try {
    const groups = await Group.find({members:req.user._id}).populate("creator","fullName email profilePic").populate("members","fullName email profilePic").sort({createdAt:-1})

    res.status(200).json(groups)

  } catch (error) {
    res.status(500).json({messsage:"Internal server error"})
  }
}

export const joinGroup = async(req,res)=>{
  try {
    const {inviteCode} = req.body

    const group = await Group.findOne({inviteCode})

    if(!group){
      return res.status(404).json({message:"invalid goup code"})
    }

    const alreadyMember = group.members.some(
      (memberId)=>memberId.toHexString()===req.user._id.toHexString()
    )

    if(alreadyMember){
      return res.status(400).json({message:"You already exist in group"})
    }
    await group.save()

    const updateGroup = await Group.findById(group._id).populate("creator","fullName email profilePic").populate("members","fullName email profilePic")

    res.status(200).json(updateGroup)
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
  }
}