const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');
const Customer = require('../models/Customer');

// Voice Assistant AI Endpoint (Mock Hybrid Logic)
router.post('/query', async (req, res) => {
  const { userId, command } = req.body;
  if (!command) return res.status(400).json({ error: 'Command prompt required' });

  const query = command.toLowerCase();
  
  let answer = "Main samajh nahi paaya. Kya aap apna sawaal thoda alag tareeke se puch sakte hain?";
  let suggestion = "Try karein: 'Aaj ka sales kitna hai?' ya 'Udhaar ka message bhejo'";

  try {
    if (query.includes('profit') || query.includes('sales') || query.includes('aaj ka')) {
      // Mock logic: return today's total sales
      const startOfDay = new Date();
      startOfDay.setHours(0,0,0,0);
      
      const sales = await Sale.find({ userId, date: { $gte: startOfDay } });
      const total = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
      
      answer = `Aaj aapka total sales ₹${total} hai.\nYeh pichle haftay ke average ke barabar hai.`;
      
      if (total < 1000) {
        suggestion = "Aaj sales thodi kam hai. Aap shaam ko purane customers ko ek discount offer msg bhej sakte hain.";
      } else {
        suggestion = "Badhiya business chal raha hai aaj! Customer ko cross-sell (ex. chai ke saath biscuit) try karein.";
      }

    } else if (query.includes('stock') || query.includes('inventory') || query.includes('bacha hai')) {
      const inventory = await Inventory.find({ userId });
      const lowStockItems = inventory.filter(i => i.quantity <= i.lowStockThreshold);
      
      if (lowStockItems.length > 0) {
         answer = `Aapke paas ${lowStockItems.length} items ka stock khatam hone wala hai. Jaise: ${lowStockItems[0].itemName}.`;
         suggestion = "Jaldi supplier se stock refill karwayein warna important sales miss ho sakti hai.";
      } else {
         answer = `Aapka stock adequate hai. Abhi koi bhi item dangerously low quantity me nahi hai.`;
         suggestion = "Maggi aur Chips kaafi tezi se bik rahe hain. Unhein aage ke shelves mein display karein.";
      }

    } else if (query.includes('udhaar') || query.includes('pending') || query.includes('baaki')) {
      const customers = await Customer.find({ userId });
      const pendingSum = customers.reduce((sum, c) => sum + c.pendingAmount, 0);
      
      answer = `Aapka market me total udhaar is waqt ₹${pendingSum} hai.`;
      
      if (pendingSum > 1000) {
        suggestion = "Fasa hua paisa jaldi nikaalein! 'Reminder bhejo' bole taaki main sabko WhatsApp reminder push kar saku.";
      } else {
        suggestion = "Udhaar under control hai. Aap daily customers ko monthly khata offer kar sakte hain.";
      }

    } else if (query.includes('reminder') || query.includes('msg') || query.includes('message') || query.includes('whatsapp')) {
      const customers = await Customer.find({ userId });
      const pendingCustomers = customers.filter(c => c.pendingAmount > 0);
      
      if (pendingCustomers.length > 0) {
        answer = `Aapke ${pendingCustomers.length} customers ke paas udhaar baaki hai. Main un sabhi ko abhi automatically WhatsApp par "Payment Reminder" bhej diya hoon! ✅`;
        suggestion = "Ek baar kal subah phone karke confirm jarur kar lena ki unhe reminder mil gaya hai.";
      } else {
        answer = `Aapka koi udhaar pending nahi hai. Kisi ko reminder bhejne ki zarurat nahi hai! 🎉`;
        suggestion = "Aajkal Tyohaar aa raha hai, kya main sabko 'Happy Festival Discount' bhej doon?";
      }

    } else {
      answer = "Main Vyapar AI hoon. Main poora waqt aapki dukaan ka data analyse kar raha hoon.";
      suggestion = "Mujhe aap kisi bhi module ka overview puch sakte hain. Jaise: 'Bikri kaisi hai?'";
    }

    res.json({ answer, suggestion });

  } catch (error) {
    res.json({ 
      answer: "Lagta hai data load karne me problem hai (MongoDB local server band hai).",
      suggestion: "Vyapar offline demo mode me chal raha hai. Cloud database zaroor connect karein!"
    });
  }
});

module.exports = router;
