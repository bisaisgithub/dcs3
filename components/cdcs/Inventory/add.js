
let inventoryAdd = [
  {
    _id: 1,
    supplier: 's1',
    invoice: 'inv1',
    date_received: 'd1',
    type: 'add',
    items:[
      {
        description: 'd1',
        quantity: 10,
        unit_price: 100,
        used: 0
      },
      {
        description: 'd2',
        quantity: 10,
        unit_price: 200,
        used: 0
      },
    ]
  }
]

// let inventories: [{name: String, code: String, qty: Number}],

let inventoryDeduct = [
  {
    name: 'd1',
    code: 'id1',
    qty: 5
  }
]