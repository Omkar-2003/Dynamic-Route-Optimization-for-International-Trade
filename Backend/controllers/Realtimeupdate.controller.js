const Warehouse = require("../models/warehouse.js");
const twilio = require("twilio");

// Replace these variables with your own values from your Twilio account
const accountSid = "";
const authToken = "";
const twilioPhoneNumber = "";

const Sendsms = async (req, res) => {
  try {
    const { entries } = req.body;
    console.log("Entries:", entries);

    if (!entries || Object.keys(entries).length === 0) {
      throw new Error("Invalid or empty entries provided");
    }

    const warehouse = await Warehouse.findById(entries.wareHouseHandlerId);
    if (!warehouse) {
      throw new Error("Warehouse not found");
    }

    const warehousePhoneNumber = warehouse.contact.phoneNumber;
    console.log("Warehouse Phone Number:", warehousePhoneNumber);

    const client = new twilio(accountSid, authToken);

    const jsonObject = {
      Driver: entries.driverNo,
      Consignee: entries.consigneeNo,
      Consignor: entries.consignorNo,
      WarehouseHandler: warehousePhoneNumber,
    };

    console.log(jsonObject);

    const promises = Object.entries(jsonObject).map(([key, phoneNumber]) => {
      return client.messages.create({
        body: `Hello ${key}, Your shipment process has just started. Your Shipment ID is ${entries.shipmentID}`,
        from: twilioPhoneNumber,
        to: `+91${phoneNumber}`, // Assuming phone numbers are Indian numbers
      });
    });

    await Promise.all(promises);
    console.log("Messages sent successfully");
    res.status(200).json({ message: "Messages sent successfully" });
  } catch (err) {
    console.error("Error sending messages:", err.message);
    res.status(500).json({ error: "Error sending messages" });
  }
};


const dummy= async(req,res)=>{
  try{
    console.log(req.body);
    res.status(200).json("data suceess");
  }catch(err){
    res.status(500).json("error");
  }
}

module.exports = {
  Sendsms,
  dummy,
};
