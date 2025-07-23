const Bill = require("../models/bill")

async function handleCreateBill(req, res)
{
    await Bill.create({
        firmName: req.body.firmName,
        address: req.body.address,
        gstin: req.body.gstin,
        contractId: req.body.contractId,
        customerName: req.body.customerName,
        itemsAdded: req.body.itemsAdded,
        contact: req.body.contact
    }) 

    res.status(200).json({message:"Bill Created"})
}

async function handleFetchBill(req, res)
{
    const data = await Bill.find({})
    if(data)
        res.status(200).json(data)
    else
        res.status(401).json({message: "Error in fetching bills"})
}
module.exports = {handleCreateBill, handleFetchBill}