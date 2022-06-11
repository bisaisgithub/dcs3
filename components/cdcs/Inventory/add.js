
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
        remaining: 10
      },
      {
        description: 'd2',
        quantity: 10,
        unit_price: 200,
        remaining: 0
      },
    ],
    deduct_id: []
  }
]

// let inventories: [{name: String, code: String, qty: Number}],

let inventoryDeduct = [
  {
    name: 'd1',
    code: '1',
    qty: 5
  }
]